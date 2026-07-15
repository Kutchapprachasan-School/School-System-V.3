# Student & HomeVisit Domain Specification (Sprint 2 Extension v2.2)
Date: 2026-07-15
Status: APPROVED (Architecture & UX Freeze Edition v2.2)

This specification decouples static Student Registry data from the mobile Home Visit Field Workflow and segregates transactional records from physical assets to guarantee scalability, security, and low database overhead.

---

## 1. Information Architecture & File Storage Strategy

To prevent database bloat, database rows store only transactional text and metadata references. No raw files, bytearrays, or base64 strings are stored directly in PostgreSQL:

```
┌──────────────────────────────────────┐
│       PostgreSQL DB (Metadata)       │
├──────────────────────────────────────┤
│ • Student / HomeVisit records        │
│ • FileRecord table (Metadata only)   │ ───┐
└──────────────────────────────────────┘    │
                                            │ References
                                            ▼
┌──────────────────────────────────────┐
│       External Cloud Storage         │
│ (MVP: Google Drive | Prod: Supabase) │
├──────────────────────────────────────┤
│ • Actual images, PDFs, Excel sheets  │
└──────────────────────────────────────┘
```

### 1.1 Storage Architecture
*   **Primary Active Storage:** All active media uploads (e.g. house photos, PDF documents, academic attachments) are stored in **Supabase Storage** (or Cloudflare R2).
*   **Cold Backup Archive (Google Drive):** Google Drive is utilized strictly as a cold backup target. Monthly automation cron-jobs export database dumps and zip archives of storage buckets, saving them to Google Drive for historical retention. Google Drive is **never** used as a primary application file server (avoiding OAuth rate limits and permission latency).

### 1.2 File Reference Schema (`FileRecord`)
All files are registered under the central `FileRecord` metadata table containing:
*   `id`: Unique UUID.
*   `fileName`: Original filename.
*   `bucketName`: Target storage bucket name.
*   `storagePath`: Target path inside the bucket.
*   `mimeType`: Content-type (e.g. `image/jpeg`).
*   `sizeBytes`: File size.
*   `checksum`: SHA-256 integrity hash for auditing.
*   *Extended Photo Metadata:* Stores image dimensions (`width` and `height` in pixels) and camera creation date (`capturedAt`) to verify photo quality.
*   *Deduplication & Cascade Deletion Policy:* Identical uploads share physical storage paths but maintain distinct `FileRecord` rows in the database. When a `FileRecord` is deleted, the system verifies `await prisma.fileRecord.count({ where: { storagePath: record.storagePath } })`. The physical file in Supabase Storage is deleted only if the reference count is `1` (avoiding broken links).

---

## 2. Decoupled Service Architecture (First-Class Citizens)

Both domains are fully decoupled from the UI and API Controllers via dedicated business service layers:

```
[UI / Controller / Server Action]
               │
      ┌────────┴────────┐
      ▼                 ▼
[Student Service]  [Visit Service] ◄── Enforces permissions, audit trails
      │                 │
      ▼                 ▼
[Student Repos]    [Visit Repos]
```

### 2.1 Home Visit Service (`visit-service.ts`)
Encapsulates all visit logic:
*   Enforces visit authorization (`visit:create`, `visit:update`, `visit:view`).
*   Validates referential integrity: Verifies referenced `studentId` belongs to an active, non-soft-deleted student.
*   Triggers business audit trails: Writes record modifications (changes in status, income, etc.) to the central `AuditLog` table within the same transaction.

### 2.2 Audit Retention & Table Partitioning
*   **Audit Retention Policy:** Central audit logs are kept online for 12 months, after which they are archived to secondary cold storage. Historical logs are retained for 7 years to satisfy regulatory compliance.
*   **Partitioning Strategy:** The `AuditLog` and `ImportRowLog` tables utilize range-based partitioning on PostgreSQL: `PARTITION BY RANGE(created_at)`. Logs are separated into monthly partition tables (e.g. `audit_log_2026_07`, `audit_log_2026_08`) to ensure O(1) query latency on administrative searches and rollback scans.
*   **Correlation ID & Propagation:** Every log entry generated during a single bulk transaction (import job or rollback) is tagged with a single shared `correlationId`. Request-level correlation IDs are automatically propagated down to DB hooks using Node's `AsyncLocalStorage` middleware.

---

## 3. Home Visit 3-Step Workflow Design

The Home Visit form is consolidated into a **3-step Mobile Workflow**:

### Step 1: Visit Verification & Media (ด่านแรกหน้าบ้าน)
*   **Verification:** Confirm student identity header (Name, ID, Class, Photo).
*   **Status & Date:** Visit status (`WAITING`, `VISITED`, `NOT_VISITED`) and date.
*   **GPS Capture State Machine & Accuracy:** 
    *   `IDLE`: Waiting for teacher interaction.
    *   `REQUESTING`: Fetching browser geolocation.
    *   `SUCCESS`: Coordinates displayed with timestamp.
        *   *Validation & Auditing:* Capture `gpsAccuracy`, `gpsCapturedAt` (UTC Date), and `gpsSource` (`AUTO` when browser-acquired, `MANUAL` when typed/overridden). If `gpsAccuracy > 100` meters, display a yellow UI warning banner recommending the teacher step outside.
    *   `FAILED` / `DENIED`: GPS request failed or user denied permission.
    *   `TIMEOUT`: GPS failed to acquire signal within 15 seconds (passed via browser `{ timeout: 15000 }` geolocation options).
    *   *GPS Fraud Auditing:* If coordinates are overridden, UI prompts for `gpsOverrideReason` (e.g. "ไม่มีสัญญาณ", "ครูเดินทางไม่ได้"), saved to the DB alongside `gpsOverride: true` status flag for audit inspection. Coordinates are locked as `readOnly` when `gpsSource = 'AUTO'`.
*   **Media Uploads & Compression:**
    *   Outside House Photo (Required `*`), Inside House Photo (Optional).
    *   **Compression Policy:** Images must be resized client-side to maximum dimensions `1600x1600px`, using JPEG quality `0.75`, targeting a file size under `1MB` before uploading.
    *   **Memory Management:** Process canvas within try-catch-finally, immediately calling `URL.revokeObjectURL(url)` and setting `canvas.width = 0; canvas.height = 0`.
    *   **Storage Upload Routing:** Images are compressed, uploaded to Supabase Storage, and registered in the `FileRecord` table. The `HomeVisit` record saves only the corresponding `FileRecord` foreign key IDs (`imgHouseOutsideId`, `imgHouseInsideId`).

### Step 2: Family & Economics (สภาพครอบครัวและเศรษฐกิจ)
*   **Living arrangements:** Who the student resides with.
*   **Financial metrics:** Family income, expense, and debt.
*   **Deduplication & Daily Session Rule:** 
    *   *Business Rule:* At most **1 official visit per student per calendar date** is recorded. If a student is visited multiple times on the same date, subsequent entries merge/update the existing daily record instead of inserting a duplicate row.
    *   *Postgres Date Type:* `visitDate` is mapped to the PostgreSQL `DATE` type (`DateTime @db.Date` in Prisma) to completely eliminate time-of-day offsets. Input dates must be constructed timezone-agnostically:
        ```typescript
        function parseToUTCMidnight(dateStr: string): Date {
          const [year, month, day] = dateStr.split('-').map(Number);
          return new Date(Date.UTC(year, month - 1, day));
        }
        ```

### Step 3: Teacher Summary & Risks (สรุปและความเสี่ยง)
*   **Observations:** Teacher notes and summary.

---

## 4. Mobile UI & Data Entry UX Standards

1.  **Linear Progress Indicator:** Render a non-interactive top progress bar:
    `ขั้นตอน 2/3 [██████░░░░░] 66%` with appropriate screen reader accessibility rules (`role="progressbar" aria-valuenow="66" aria-valuemin="0" aria-valuemax="100"`).
2.  **Button & Target Styling Constraints (Fitts's Law):**
    *   Enforce a minimum target height of **48px** for all buttons, select boxes, and text inputs.
    *   Primary action ("ถัดไป" / Next) and secondary action ("ย้อนกลับ" / Back) must use distinct visual weights (e.g. solid primary vs. outline secondary) and be separated by at least **24px** to prevent accidental clicks.
    *   Enforce `font-size: 16px` for all text inputs to prevent iOS Safari auto-zooming.
3.  **Auto-Save Draft & Versioned Partitioning:**
    *   **IndexedDB Cache:** Implement IndexedDB to store drafts, bypassing the 5MB localStorage limit. Caches text, GPS coordinates, and selections. Binaries/images are excluded from draft.
    *   **Draft Schema Invalidation:** Draft entries use a versioned structure. On version mismatch, the client triggers a soft-reset fallback: *"Draft updated to a new version. Some inputs have been reset to prevent errors."* rather than silently discarding all fields.
    *   **Unique Keys:** Form state is saved under a primary UUID `draftId` with partitioned student metadata mappings (`studentId`, `academicYear`, `term`, `visitSessionId`).
    *   **Draft Expiry:** Capped drafts are automatically purged after 30 days. Cleanup triggers on app initialization and tab visibility changes (`document.visibilityState === 'visible'`).
    *   **Post-Submit Purging:** Draft is immediately deleted from IndexedDB upon a successful server submit.
4.  **Searchable Comboboxes:** Long dropdown lists (like disadvantage type and occupations) must use search-filtering combobox elements.
5.  **Offline Status Indicator:** Top-right indicator displays active network state (`🟢 ออนไลน์` / `🔴 ออฟไลน์`) using browser connection listeners combined with debounced ping-checks to `/api/health` throttled to max 1 request per 60 seconds (or on request failure). The health check endpoint returns a database-free static JSON response to prevent PG pool exhaustion.

---

## 5. Role-Based Permissions for Home Visits

To enforce security on visits:
*   **Create Visit:** requires `visit:create` and `student:view`.
*   **Update Visit:** requires `visit:update`.
*   **View Visit:** requires `visit:view`.
*   *Future bounds:* `visit:approve`, `visit:export`, and `visit:rollback` are declared in the domain schema.

---

## 6. Database Transaction, Concurrency & Idempotency Standards

1.  **Failure Logging:** Failed validation logs (`ImportRowLog`) are written outside the main transaction to prevent rollback loss.
2.  **Concurrency Sorting:** Bulk upserts are sorted by unique keys (e.g. `studentId`) to prevent deadlocks.
3.  **Soft Delete Database Constraint:** 
    *   To prevent concurrent race conditions (duplicate creations), active student uniqueness must be locked at the database level.
    *   We execute a raw PostgreSQL migration to create a partial unique index:
        `CREATE UNIQUE INDEX idx_student_active_unique ON students(student_id) WHERE deleted_at IS NULL;`
    *   For home visits, active daily visit uniqueness is locked at the database level via:
        `CREATE UNIQUE INDEX idx_visit_active_unique ON home_visits(student_id, visit_date) WHERE deleted_at IS NULL;`
    *   In the Prisma model, we define `studentId` as a standard string field without `@unique` to avoid compilation errors, and rely on the database-level partial unique index to enforce strict transactional integrity.
4.  **Global Soft-Delete Query Filtering:** Enforce soft-delete visibility constraints globally using Prisma Client Extensions to inject `deletedAt: null` filters automatically.
5.  **N+1 Prevention:** Rollbacks batch fetch using `in: ids` and perform snapshots comparison in memory before execution.
6.  **Audit Trail Integration:** Both import job chunks and rollback executions write a consolidated summary log (action: `IMPORT` or `ROLLBACK`) to the central `AuditLog` table.
7.  **Audited Rollback Execution:** Rollbacks require passing the user's `Actor` object and network headers (`ipAddress` and `userAgent`) to ensure full non-repudiation logging.
8.  **Import Chunk Idempotency table & Abandonment Recovery:**
    *   The `ImportChunk` table tracks processing states using the `ImportChunkStatus` enum (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`, `ABANDONED`).
    *   Server locks chunk processing at the chunk level. If a client retries a half-completed chunk, the server detects the `COMPLETED` chunk or locks the `PROCESSING` status to prevent duplicate writes.
    *   *Abandonment Recovery & Retry Cap:* Chunks remaining in `PROCESSING` status for over 10 minutes (without updated `heartbeatAt`) are classified as `ABANDONED`. Recovery updates use atomic conditional SQL updates to prevent race conditions.
    *   *Retry Limit:* If a chunk fails, its `retryCount` is incremented. The chunk is blocked from execution when `retryCount >= 3` to prevent infinite processing loops, logging the final error details in `lastError`.
9.  **Compact Snapshots:**
    *   `entitySnapshot` in `ImportRowLog` stores only the changed fields (`before` and `after` diffs) rather than the entire 2KB+ entity JSON payload. Rollback conflict detection is executed only on the fields mutated by the import chunk.
