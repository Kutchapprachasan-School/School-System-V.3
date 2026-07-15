# Implementation Plan: Sprint 2 Extension (Student CRUD & HomeVisit Import v2.2)

This plan details the technical steps to build the decoupled **Student Registry Master Profile** and the **Home Visit mobile workflow**, resolving transactional, database-concurrency, security, and mobile-UX issues.

---

## 1. Database & Security Implementation Details

### 1.1 Transaction Safety & Non-Repudiation
*   **Import Chunk Transaction Boundary:**
    *   To prevent failed validations from rolling back and losing row logs:
        *   Validate Zod schemas for all rows.
        *   Group rows into **Successfully Validated** and **Failed Validated**.
        *   Insert database records for valid rows inside a transaction `prisma.$transaction`.
        *   If the transaction fails, catch the error, mark all rows in the chunk as failed, and write the chunk failures and row error logs to `ImportRowLog` in a separate transaction.
*   **Central Audit Log Writing for Bulk Imports & Rollbacks:**
    *   Write a consolidated audit trail record to the central `AuditLog` table (action: `IMPORT` or `ROLLBACK`) whenever a bulk import job chunk completes processing or whenever a rollback job is successfully completed.
*   **Non-Repudiation Logging:**
    *   Expose actor metadata: Capture client `ipAddress` and `userAgent` from the request header and save them in `ImportJob`, `ImportRowLog`, and `AuditLog`.
    *   Ensure all data mutations in `StudentService` and `VisitService` write corresponding entries to `AuditLog` inside the same transaction block.
*   **Audited Rollback Execution:**
    *   Pass the user's `Actor` object and network headers (`ipAddress` and `userAgent`) to `importProcessor.rollbackJob(jobId, actor, ipAddress, userAgent)` to ensure rollback actions are non-repudiated and properly audited.
*   **Audit & Row Log Retention & Range Partitioning Strategy:**
    *   The `AuditLog` and `ImportRowLog` tables use PostgreSQL Range Partitioning on `createdAt` on a monthly basis (e.g. `audit_logs_2026_07`, `audit_logs_2026_08`).
    *   Archiving scripts move partition tables older than 12 months to cold storage. Retention period is locked at 7 years.
*   **Correlation ID Propagation:**
    *   Expose a `correlationId` tracking header. Capture and propagate this ID from request headers to database writes via Node's `AsyncLocalStorage` context middleware. Ensure `correlationId` is saved in `ImportJob`, `ImportRowLog`, and `AuditLog`.

### 1.2 Concurrency, Deadlocks & N+1 Prevention
*   **Rollback Performance (Prevention of N+1):**
    *   Instead of loops executing `findUnique` and `update` per record, batch operations:
        1. Fetch all records using a bulk query: `prisma.student.findMany({ where: { id: { in: targetEntityIds } } })`.
        2. Perform conflict detection and snapshot comparison in memory.
        3. Execute updates in a single batch query (e.g. bulk update status or raw SQL) or map them to concurrent executions if updates are distinct.
*   **Deterministic Upsert Ordering:**
    *   Before executing bulk operations in `batchUpsertStudents` and `batchUpsertHomeVisits`, sort the input array deterministically by unique keys:
        *   For students: sort by `studentId`.
        *   For visits: sort by `${studentId}_${visitDate}`.
*   **Date Normalization & Timezone-Agnostic Utilities:**
    *   All parsing of dates (e.g. `visitDate`) must use strict UTC date construction functions to avoid timezone offset shifts on the server:
        ```typescript
        function parseToUTCMidnight(dateStr: string): Date {
          const [year, month, day] = dateStr.split('-').map(Number);
          return new Date(Date.UTC(year, month - 1, day));
        }
        ```
    *   Check duplicates by query using date ranges: `visitDate: { gte: startDate, lte: endDate }`.
*   **Active Student Database Unique Constraint:**
    *   To prevent concurrent race conditions (TOCTOU) where duplicate active students are created simultaneously:
        1. Keep `studentId` on the `Student` Prisma model as a standard string (no `@unique` annotation to prevent Prisma schema mismatches).
        2. Run a raw PostgreSQL migration to create a partial unique index:
           `CREATE UNIQUE INDEX idx_student_active_unique ON students(student_id) WHERE deleted_at IS NULL;`
        3. This enforces uniqueness at the database level for active students while allowing soft-deleted ones to coexist.
*   **Active Home Visit Database Unique Constraint:**
    *   To prevent concurrent race conditions (TOCTOU) where duplicate visits on the same date are created:
        1. Keep `HomeVisit` model keys as standard strings in Prisma.
        2. Run a raw PostgreSQL migration to create a partial unique index:
           `CREATE UNIQUE INDEX idx_visit_active_unique ON home_visits(student_id, visit_date) WHERE deleted_at IS NULL;`
*   **Prisma Client Soft-Delete Extensions:**
    *   Enforce a global Prisma Client Extension in `src/server/db/client.ts` to automatically inject `deletedAt: null` filters on all read queries for Student and HomeVisit, preventing developer oversights.

### 1.3 Import Chunk Idempotency & Retry Limits
*   **Chunk-Level Processing Locks & Atomic Abandonment Recovery:**
    *   Add processing status (`ImportChunkStatus` enum), success/failed count, startedAt, completedAt, heartbeatAt, retryCount, and lastError columns to `ImportChunk` in `schema.prisma`.
    *   When a chunk is received:
        1. Query `ImportChunk` status. If status is `COMPLETED`, return the cached results immediately (idempotent bypass).
        2. If status is `PROCESSING`, check for abandonment.
        3. Reclaim abandoned chunks (heartbeat > 10 minutes) or lock new ones using an atomic SQL conditional query:
           ```sql
           UPDATE import_chunks 
           SET status = 'PROCESSING', heartbeatAt = NOW(), startedAt = NOW() 
           WHERE id = :chunkId 
             AND (status = 'PENDING' OR status = 'FAILED' OR (status = 'PROCESSING' AND heartbeatAt < NOW() - INTERVAL '10 minutes'))
           ```
        4. If the update returns `0` affected rows, abort chunk execution (concurrency fail-safe).
        5. **Retry Limitation Check:** If a chunk fails processing, increment `retryCount` and write error details in `lastError`. If `retryCount >= 3`, fail the chunk permanently (block further client retry executions).
*   **Compact Snapshots Diffs & Conflict checks:**
    *   In `ImportRowLog`, the `entitySnapshot` field stores only the diff of changed fields (`before` and `after`) instead of the entire entity JSON payload.
    *   Rollback conflict checks compare database values against only the fields mutated by the import, preventing unrelated user updates from raising false-positive rollback conflicts.

### 1.4 Active File & Cold Backup Storage Strategy
*   **Primary Active Storage:** All active media uploads (e.g. house photos, PDF documents, academic attachments) are stored in **Supabase Storage** (or Cloudflare R2).
*   **Cold Backup Archive (Google Drive):** Google Drive is utilized strictly as a cold backup target. Monthly automation cron-jobs export database dumps and zip archives of storage buckets, saving them to Google Drive for historical retention. Google Drive is **never** used as a primary application file server (avoiding OAuth rate limits and permission latency).
*   **FileReference Deduplication:** If multiple entities reference identical files (same checksum SHA-256), they reuse the same physical file path in storage but generate distinct rows in the `FileRecord` table.
*   **Physical Deletion Reference Counting:** When a `FileRecord` is deleted, verify `await prisma.fileRecord.count({ where: { storagePath: record.storagePath } })`. Only delete the physical file in Supabase Storage if the reference count is `1` (ensuring we don't break duplicate references).
*   **File Dimensions Metadata:** The `FileRecord` model stores pixel dimensions `width`, `height`, and camera `capturedAt` timestamp alongside file size and mimetype to support auditing.

### 1.5 Fine-Grained Authorization
*   **Import Endpoint Authorization:**
    *   Pass the user's `Actor` object to the `ImportService`. Verify that they possess domain-specific write permission (`student:create` or `visit:create`) for the target domain.
*   **Read Methods Authorization:**
    *   Enforce `student:view` and `visit:view` permissions inside all read service calls.

---

## 2. Decoupled Service Architecture

### 2.1 Visit Service (`src/features/home-visit/services/visit-service.ts`)
Exposes business methods:
*   `createVisit(data: HomeVisitInput, actor: Actor)`: Checks `visit:create` and `student:view`. Validates referential student exists and is active. Writes visit and audit log in a single transaction.
*   `updateVisit(id: string, data: Partial<HomeVisitInput>, actor: Actor)`: Checks `visit:update` and writes audit log.
*   `getVisitById(id: string, actor: Actor)`: Checks `visit:view`.

---

## 3. Mobile UI & Data Entry UX Standards

### 3.1 Mobile Ergonomics & Fitts's Law
*   **Button and Input Heights:** Enforce minimum target sizes of **48px** for all buttons, select boxes, and text inputs.
*   **Safari Zoom Bug:** Set `font-size: 16px` for all text inputs.
*   **Linear Progress:** Render a non-interactive top progress bar. Place distinct, bottom-sticky "ย้อนกลับ" (left, secondary outline style) and "ถัดไป" (right, primary solid style) buttons at least **24px** apart to prevent accidental clicks.

### 3.2 GPS Accuracy Alerts & Fraud Prevention Audit
*   **Accuracy Threshold Banner:** Capture `gpsAccuracy` and `gpsCapturedAt` (UTC date) alongside coordinates. If `gpsAccuracy > 100` meters, display a yellow UI banner warning: *"พิกัดไม่แม่นยำ (เบี่ยงเบน > 100ม.) กรุณาก้าวออกกลางแจ้ง หรือกดยืนยันใช้งานพิกัดนี้หากจำเป็น"*
*   **Manual GPS Override:** The UI must pass a `gpsOverride: boolean` status flag in the form payload, logged in the DB. Coordinates are locked as `readOnly` when `gpsSource = 'AUTO'`.
*   **GPS Source & Override Audits:** Capture `gpsSource` (`AUTO` when browser-acquired, `MANUAL` when overridden) and `gpsOverrideReason` (e.g. "ไม่มีสัญญาณ", "ครูเดินทางไม่ได้") in the database to trace data integrity anomalies.

### 3.3 Offline Capability & Cache Partitioning
*   **Throttled Connection Verification:** Check connectivity status using `navigator.onLine` combined with active request failure catches. The connection pill ping-checks `/api/health` every 60 seconds (throttled) with a 3-second timeout to minimize server request load. The health check api returns static mock payload database-free to avoid PG pool exhaustion.
*   **IndexedDB Cache:** Implement IndexedDB to store drafts, bypassing the 5MB localStorage limit. Caches text, GPS coordinates, and selections. Binaries/images are excluded from draft.
*   **Draft Schema Versioning & Soft-Reset:** Include version numbers in IndexedDB draft records. On version mismatch, trigger a soft-reset warning the user: *"Draft updated to a new version. Some inputs have been reset to prevent errors."*
*   **Unique Partition Keys:** Save drafts using UUID `draftId` key accompanied by metadata mapping: `studentId`, `academicYear`, `term`, and `visitSessionId`.
*   **Draft Expiry:** Auto-prune draft keys older than 30 days. Runs on app initialization and visibility tab changes (`document.visibilityState === 'visible'`).
*   **Post-Submit Purging:** Explicitly delete the draft from IndexedDB immediately upon successful API submission.

### 3.4 Canvas-Based Image Compression
*   **Memory Management:** Always process canvas within try-catch-finally, immediately calling `URL.revokeObjectURL(url)` and setting `canvas.width = 0; canvas.height = 0`.
*   **Iterative Compression:** Loop scale-down/quality reduction (starting from 0.75 and reducing by 0.1) until the output blob is under 1MB, ensuring compliance with payload limits.

---

## 4. Verification Plan

### Automated Tests
- Run `npm run typecheck` and `npm run lint`.

### Verification Scenarios
1.  **Draft Collision:** Fill out visit drafts for the same student across different semesters. Verify no data is overwritten.
2.  **GPS Timeout & Permission Bypasses:** Verify transitioning to `TIMEOUT` (15s) and `DENIED` works.
3.  **Unique Index Test (Test A):** Simulate two simultaneous import client threads creating the same student. Verify only one succeeds and no duplicates are created.
4.  **Rollback Conflict Test (Test B):** Perform an import, modify the student record via the UI, and execute a rollback. Verify that the rollback returns `CONFLICT` and does not overwrite modifications.
5.  **IndexedDB Quota Full Test (Test C):** Mock IndexedDB writing failure (`QuotaExceededError`). Verify the app displays a clear "Draft Save Failed - Storage Full" alert.
6.  **Post-Submit Purging Test (Test D):** Submit a visit successfully and verify the draft is deleted from IndexedDB.
7.  **Draft Version Invalidation Test (Test E):** Inject a draft with version `1` and check if the application handles it gracefully (fails safe or migrates) when the code is at version `2`.
