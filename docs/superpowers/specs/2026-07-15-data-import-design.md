# Data Import Layer Design Specification (Sprint 2)
Date: 2026-07-15
Status: APPROVED (Architecture Freeze Edition v1.2)

This document details the finalized architecture, safety checks, and integration strategy for importing large datasets (Students, HomeVisits, AcademicDocs, Saraban) into the migrated School Management System.

---

## 1. Architectural Overview

To ensure scalability, prevent Next.js server timeouts, and support future migration to background workers, the import process is decoupled from the UI layer:

```
[Browser] --- (PapaParse / XLSX JSON Array) ---> [Split into domain-specific chunks]
                                                         │
                                               (HTTP POST /api/import)
                                                         │
                                                         ▼
                                               [Next.js API Route]
                                                         │
                                                         ▼
                                               [Import Service Layer]
                                           (Zod Validation per Row)
                                                         │
                                            ┌────────────┴────────────┐
                                            ▼                         ▼
                                     [Valid Row]                [Invalid Row]
                                     Save snapshot              Log Zod error
                                     Upsert DB              Create ImportRowLog
                                     Status: SUCCESS          Status: FAILED
```

---

## 2. API Endpoint & Service Design

### 2.1 API Route: `POST /api/import`
Handles incoming batch chunks.

*   **Authorization:** Access requires an authenticated session (`requireSession()`) and the `"import:execute"` permission. Unauthorized requests will return a `403 Forbidden` status.
*   **Headers:** `Content-Type: application/json`
*   **Request Payload:**
    ```json
    {
      "jobId": "uuid-string",
      "chunkId": "chunk-0",
      "payloadHash": "sha256-hash-of-rows-json",
      "domain": "STUDENT",
      "rowIndexStart": 0,
      "rows": [
        { "studentId": "6901", "studentName": "John Doe", "classLevel": "M.1", "room": "1" },
        ...
      ]
    }
    ```
*   **Response Payload (200 OK):**
    ```json
    {
      "jobId": "uuid-string",
      "chunkId": "chunk-0",
      "processedCount": 200,
      "successCount": 198,
      "failedCount": 2,
      "durationMs": 523
    }
    ```

---

## 3. Idempotency & Hash Verification Strategy

To guard against network timeouts causing clients to retry the same chunk, or clients sending conflicting data under the same chunk key:
1.  Each chunk must carry a unique `chunkId` (e.g., `chunk-0`) and a `payloadHash` (a SHA-256 hash of the stringified `rows` array).
2.  Upon receiving a request, the server queries the database for an existing `ImportChunk` with the primary key `id = "${jobId}_${chunkId}"`.
3.  **Hash Verification:** 
    *   If a record is found and its `payloadHash` matches the request's `payloadHash`, the server skips processing and immediately returns success (short-circuit).
    *   If the record exists but the `payloadHash` differs, the server flags this as an **idempotency violation error** and aborts to prevent data corruption.

---

## 4. State Machine: ImportJob Lifecycle

We enforce strict transitions for the `ImportJob` lifecycle at the service layer:

```
    [PENDING]
        │
        ▼
   [PROCESSING] ◄─── (Processing Chunk by Chunk)
        │
   ┌────┴──────────────┐
   ▼                   ▼
[COMPLETED]        [FAILED]
   │
   ▼
[ROLLBACK_PENDING]
   │
   ┌────┴──────────────┐
   ▼                   ▼
[ROLLBACKED]       [ROLLBACK_FAILED]
```

*   **State Transition rules:**
    *   `PENDING` can transition only to `PROCESSING`.
    *   `PROCESSING` can transition to `COMPLETED` or `FAILED`.
    *   `COMPLETED` can transition to `ROLLBACK_PENDING` if a rollback is initiated.
    *   `ROLLBACK_PENDING` can transition to `ROLLBACKED` or `ROLLBACK_FAILED`.

---

## 5. Domain Lookup Strategy

To prevent hardcoding unique identifier keys in the importer service, we introduce `ImportDomainConfig`:

```typescript
interface DomainConfig {
  tableName: string;
  lookupKey: string;        // The unique identifier field to query (e.g. "studentId")
  primaryKey: string;       // The database internal primary key (e.g. "id")
  chunkSize: number;        // Configurable chunk size
}

const ImportRegistry: Record<string, DomainConfig> = {
  STUDENT: {
    tableName: "students",
    lookupKey: "studentId",
    primaryKey: "id",
    chunkSize: 200
  },
  HOME_VISIT: {
    tableName: "home_visits",
    lookupKey: "studentId", // linked to Student lookup
    primaryKey: "id",
    chunkSize: 100
  },
  SARABAN: {
    tableName: "saraban_docs",
    lookupKey: "docNumber",
    primaryKey: "id",
    chunkSize: 50
  }
};
```

---

## 6. Row-Level Validation & Snapshot Policy

### 6.1 Row Iteration Process
For each row inside a chunk:
1.  **Server-side Zod validation:** Validate the row schema.
    *   *If invalid:* Log to `ImportRowLog` with status `FAILED` and Zod error in `errorDetails`. Continue to next row.
2.  **Snapshot pre-fetch:** If updating an existing record, fetch the current state and save it in `ImportRowLog.entitySnapshot`. Also, record the current `updatedAt` of the DB record as `entityUpdatedAt`.
3.  **Database Upsert:** Write the row to the database.
    *   *If success:* Write status `SUCCESS` to `ImportRowLog` with the `targetEntityId`.
    *   *If database crash:* Catch error, log status `FAILED` to `ImportRowLog` with the error message in `errorDetails`.

### 6.2 Snapshot Data Policy
To prevent log database bloat and memory exhaustion:
*   **No Binary/Blob Data:** The `entitySnapshot` JSON object must strictly store metadata and basic data types (strings, numbers, booleans, dates).
*   **Excluded Fields:** Large text blocks, base64 strings, file streams, and attachments must be excluded from the snapshot query select statement before serializing to JSON.

---

## 7. Deterministic Rollback & Conflict Detection

To prevent rolling back imported data that has been modified manually by users post-import:

1.  When a rollback is triggered, we fetch `ImportRowLog` records for the job.
2.  For each log with status `SUCCESS`:
    *   **Check Conflict:** Fetch the current database record using `targetEntityId`.
    *   Compare the current record's `updatedAt` value with the `entityUpdatedAt` value recorded during import.
    *   *If mismatched:* A user has modified this record manually post-import. **Mark rollback status as CONFLICT, raise warning, and skip automatic rollback of this row.**
    *   *If matched (No Conflict) and `entitySnapshot` is null:* Soft delete the record (`deletedAt = now()`).
    *   *If matched (No Conflict) and `entitySnapshot` is NOT null:* Restore original values from `entitySnapshot`.
3.  If all non-conflict rows roll back successfully but conflicts occurred, update job status to `ROLLBACKED` with warning metadata listing the conflict records.
