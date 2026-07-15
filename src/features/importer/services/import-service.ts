// src/features/importer/services/import-service.ts
import { prisma } from "@/server/db/client";
import { ImportProcessor, ImportChunkResult } from "../types";
import { StudentImportSchema } from "@/features/student/schemas";
import { batchUpsertStudents } from "@/features/student/repository";
import { HomeVisitImportSchema } from "@/features/home-visit/schemas";
import { batchUpsertHomeVisits } from "@/features/home-visit/repository";
import {
  RowImportStatus,
  ImportJobStatus,
  ImportChunkStatus,
  AuditAction,
} from "@prisma/client";
import { logger } from "@/server/logger/logger";
import { getCorrelationId } from "@/lib/correlation";

const MAX_CHUNK_RETRIES = 3;

export class DirectImportProcessor implements ImportProcessor {
  /**
   * Enforces State transitions
   */
  private async transitionJob(
    jobId: string,
    allowedFrom: ImportJobStatus[],
    to: ImportJobStatus
  ) {
    const job = await prisma.importJob.findUnique({ where: { id: jobId } });
    if (!job) throw new Error(`Import job ${jobId} not found`);

    if (!allowedFrom.includes(job.status)) {
      throw new Error(`Invalid state transition from ${job.status} to ${to}`);
    }

    await prisma.importJob.update({
      where: { id: jobId },
      data: { status: to },
    });
  }

  async processChunk(
    jobId: string,
    chunkId: string,
    payloadHash: string,
    domain: string,
    startIndex: number,
    rows: any[]
  ): Promise<ImportChunkResult> {
    const startTime = Date.now();
    const chunkKey = `${jobId}_${chunkId}`;
    const correlationId = getCorrelationId();

    // -------------------------------------------------------------------------
    // 1. Atomic Chunk Lock (TOCTOU-safe conditional UPDATE)
    //    Reclaims ABANDONED chunks (heartbeat > 10 min) or locks PENDING/FAILED.
    //    Returns 0 rows affected if another worker already holds the lock.
    // -------------------------------------------------------------------------
    const lockResult = await prisma.$executeRaw`
      UPDATE import_chunks
      SET    status       = 'PROCESSING',
             "heartbeatAt" = NOW(),
             "startedAt"   = NOW()
      WHERE  id = ${chunkKey}
        AND (
              status = 'PENDING'
          OR  status = 'FAILED'
          OR (status = 'PROCESSING' AND "heartbeatAt" < NOW() - INTERVAL '10 minutes')
        )
        AND "retryCount" < ${MAX_CHUNK_RETRIES}
    `;

    // Check whether the chunk already exists (COMPLETED = idempotent bypass)
    const existingChunk = await prisma.importChunk.findUnique({
      where: { id: chunkKey },
    });

    if (existingChunk) {
      // Idempotency: payload hash mismatch is a fatal error
      if (existingChunk.payloadHash !== payloadHash) {
        throw new Error("Idempotency violation: chunk payload hash mismatch");
      }

      // Already completed → return cached results
      if (existingChunk.status === ImportChunkStatus.COMPLETED) {
        const logs = await prisma.importRowLog.findMany({
          where: { importJobId: jobId, chunkId },
        });
        return {
          successCount: logs.filter((l) => l.status === RowImportStatus.SUCCESS)
            .length,
          failedCount: logs.filter((l) => l.status === RowImportStatus.FAILED)
            .length,
          rowLogs: logs.map((l) => ({
            rowIndex: l.rowIndex,
            status: l.status as any,
            targetEntityId: l.targetEntityId || undefined,
            errorDetails: l.errorDetails || undefined,
          })),
        };
      }

      // Retry cap exceeded → permanent failure
      if (existingChunk.retryCount >= MAX_CHUNK_RETRIES) {
        throw new Error(
          `Chunk ${chunkKey} has exceeded the maximum retry limit (${MAX_CHUNK_RETRIES})`
        );
      }

      // Lock contention — another worker holds the lock
      if (lockResult === 0 && existingChunk.status === ImportChunkStatus.PROCESSING) {
        throw new Error(`Chunk ${chunkKey} is already being processed by another worker`);
      }
    } else {
      // First-time encounter: insert the chunk in PROCESSING state
      await prisma.importChunk.create({
        data: {
          id: chunkKey,
          importJobId: jobId,
          status: ImportChunkStatus.PROCESSING,
          payloadHash,
          durationMs: 0,
          startedAt: new Date(),
          heartbeatAt: new Date(),
        },
      });
    }

    // -------------------------------------------------------------------------
    // 2. Set job state to RUNNING (idempotent)
    // -------------------------------------------------------------------------
    const job = await prisma.importJob.findUnique({ where: { id: jobId } });
    if (job?.status === ImportJobStatus.PENDING) {
      await this.transitionJob(
        jobId,
        [ImportJobStatus.PENDING],
        ImportJobStatus.RUNNING
      );
    }

    // -------------------------------------------------------------------------
    // 3. Server-side Zod Validation
    // -------------------------------------------------------------------------
    let schema: any;
    if (domain === "STUDENT") {
      schema = StudentImportSchema;
    } else if (domain === "HOME_VISIT") {
      schema = HomeVisitImportSchema;
    } else {
      throw new Error(`Unsupported import domain: ${domain}`);
    }

    const validRows: { rowIndex: number; data: any }[] = [];
    const failedRowLogs: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      const rowIndex = startIndex + i;
      const parsed = schema.safeParse(rows[i]);

      if (!parsed.success) {
        failedRowLogs.push({
          importJobId: jobId,
          chunkId,
          rowIndex,
          status: RowImportStatus.FAILED,
          originalData: rows[i] as any,
          errorDetails: JSON.stringify(parsed.error.format()),
          correlationId,
        });
      } else {
        validRows.push({ rowIndex, data: parsed.data });
      }
    }

    // -------------------------------------------------------------------------
    // 4. Batch DB writes — inside transaction for valid rows.
    //    Failed validation rows written OUTSIDE the transaction so they survive
    //    a data-layer rollback.
    // -------------------------------------------------------------------------
    let successCount = 0;
    let failedCount = failedRowLogs.length;

    try {
      if (validRows.length > 0) {
        if (domain === "STUDENT") {
          const batchResults = await batchUpsertStudents(jobId, chunkId, validRows);
          successCount = batchResults.length;
        } else if (domain === "HOME_VISIT") {
          const batchResults = await batchUpsertHomeVisits(jobId, chunkId, validRows);
          successCount = batchResults.filter(
            (r) => r.status === RowImportStatus.SUCCESS
          ).length;
          failedCount += batchResults.filter(
            (r) => r.status === RowImportStatus.FAILED
          ).length;
        }
      }
    } catch (batchError: any) {
      // Write all valid rows as failed OUTSIDE the main transaction
      const fallbackLogs = validRows.map((row) => ({
        importJobId: jobId,
        chunkId,
        rowIndex: row.rowIndex,
        status: RowImportStatus.FAILED,
        originalData: row.data as any,
        errorDetails: `BATCH_ERROR: ${batchError?.message ?? "Unknown error"}`,
        correlationId,
      }));
      await prisma.importRowLog.createMany({ data: fallbackLogs });
      failedCount += validRows.length;
      successCount = 0;

      // Mark chunk as FAILED and increment retry counter
      await prisma.importChunk.update({
        where: { id: chunkKey },
        data: {
          status: ImportChunkStatus.FAILED,
          retryCount: { increment: 1 },
          lastError: batchError?.message ?? "Unknown batch error",
        },
      });

      logger.error({ err: batchError, chunkKey }, "Chunk batch processing failed");

      throw batchError;
    }

    // Write validation failure logs (outside the main transaction)
    if (failedRowLogs.length > 0) {
      await prisma.importRowLog.createMany({ data: failedRowLogs });
    }

    const durationMs = Date.now() - startTime;

    // -------------------------------------------------------------------------
    // 5. Mark chunk COMPLETED + write consolidated AuditLog
    // -------------------------------------------------------------------------
    await prisma.importChunk.update({
      where: { id: chunkKey },
      data: {
        status: ImportChunkStatus.COMPLETED,
        successRows: successCount,
        failedRows: failedCount,
        durationMs,
        completedAt: new Date(),
        heartbeatAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        action: AuditAction.IMPORT,
        entityName: domain,
        entityId: jobId,
        after: { successCount, failedCount, chunkId } as any,
        correlationId,
      },
    });

    // 6. Increment job summary metrics
    await prisma.importJob.update({
      where: { id: jobId },
      data: {
        successRows: { increment: successCount },
        failedRows: { increment: failedCount },
      },
    });

    return {
      successCount,
      failedCount,
      rowLogs: [],
    };
  }

  // ---------------------------------------------------------------------------
  // ROLLBACK
  // Batch-fetches all target entities, performs field-level conflict detection
  // in memory, and updates in batches — no N+1 queries.
  // ---------------------------------------------------------------------------
  async rollbackJob(jobId: string): Promise<{
    rolledBackCount: number;
    conflictCount: number;
    conflictedIds: string[];
  }> {
    const job = await prisma.importJob.findUnique({ where: { id: jobId } });
    if (!job) throw new Error(`Import job ${jobId} not found`);

    const correlationId = getCorrelationId();

    await this.transitionJob(
      jobId,
      [ImportJobStatus.COMPLETED, ImportJobStatus.FAILED],
      ImportJobStatus.ROLLBACK_PENDING
    );

    const logs = await prisma.importRowLog.findMany({
      where: { importJobId: jobId, status: RowImportStatus.SUCCESS },
    });

    const targetIds = logs
      .map((l) => l.targetEntityId)
      .filter(Boolean) as string[];

    let rolledBackCount = 0;
    let conflictCount = 0;
    const conflictedIds: string[] = [];

    // ── STUDENT domain ────────────────────────────────────────────────────────
    if (job.targetDomain === "STUDENT") {
      // Batch fetch all targets in ONE query (N+1 prevention)
      const students = await prisma.student.findMany({
        where: { id: { in: targetIds } },
        select: {
          id: true,
          studentId: true,
          studentName: true,
          classLevel: true,
          room: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const studentMap = new Map(students.map((s) => [s.id, s]));

      const updateOps: any[] = [];
      const conflictLogUpdates: any[] = [];

      for (const log of logs) {
        if (!log.targetEntityId) continue;
        const student = studentMap.get(log.targetEntityId);

        if (!student) {
          // Already deleted — count as rolled back
          rolledBackCount++;
          continue;
        }

        // Field-level conflict detection: compare only the fields mutated by the import
        const snapshot = (log.entitySnapshot ?? {}) as Record<string, any>;
        const mutatedFields = Object.keys(snapshot) as Array<keyof typeof student>;
        const hasConflict = mutatedFields.some(
          (field) =>
            String((student as any)[field]) !== String(snapshot[field])
        );

        // New records (snapshot is null) conflict if record was modified after creation
        const isNewRecord = !log.entitySnapshot;
        const wasModifiedAfterCreation =
          student.createdAt.getTime() !== student.updatedAt.getTime();

        if (hasConflict || (isNewRecord && wasModifiedAfterCreation)) {
          conflictCount++;
          conflictedIds.push(student.studentId);
          conflictLogUpdates.push({ id: log.id });
          continue;
        }

        if (log.entitySnapshot) {
          // Restore snapshot fields
          updateOps.push(
            prisma.student.update({
              where: { id: log.targetEntityId },
              data: {
                studentName: snapshot.studentName,
                classLevel: snapshot.classLevel,
                room: snapshot.room,
                status: snapshot.status,
              },
            })
          );
        } else {
          // Soft-delete newly created record
          updateOps.push(
            prisma.student.update({
              where: { id: log.targetEntityId },
              data: { deletedAt: new Date() },
            })
          );
        }
        rolledBackCount++;
      }

      // Batch execute updates + conflict log updates
      if (updateOps.length > 0 || conflictLogUpdates.length > 0) {
        await prisma.$transaction([
          ...updateOps,
          ...conflictLogUpdates.map((l: any) =>
            prisma.importRowLog.update({
              where: { id: l.id },
              data: {
                status: RowImportStatus.FAILED,
                errorDetails: "ROLLBACK_CONFLICT: Record edited post-import",
              },
            })
          ),
        ]);
      }
    }

    // ── HOME_VISIT domain ─────────────────────────────────────────────────────
    else if (job.targetDomain === "HOME_VISIT") {
      const visits = await prisma.homeVisit.findMany({
        where: { id: { in: targetIds } },
        select: {
          id: true,
          visitStatus: true,
          informantRelation: true,
          teacherSummary: true,
          studentId: true,
          visitDate: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      const visitMap = new Map(visits.map((v) => [v.id, v]));

      const updateOps: any[] = [];
      const conflictLogUpdates: any[] = [];

      for (const log of logs) {
        if (!log.targetEntityId) continue;
        const visit = visitMap.get(log.targetEntityId);

        if (!visit) {
          rolledBackCount++;
          continue;
        }

        const snapshot = (log.entitySnapshot ?? {}) as Record<string, any>;
        const mutatedFields = Object.keys(snapshot);
        const hasConflict = mutatedFields.some(
          (field) =>
            String((visit as any)[field]) !== String(snapshot[field])
        );

        const isNewRecord = !log.entitySnapshot;
        const wasModifiedAfterCreation =
          visit.createdAt.getTime() !== visit.updatedAt.getTime();

        if (hasConflict || (isNewRecord && wasModifiedAfterCreation)) {
          conflictCount++;
          conflictedIds.push(log.targetEntityId);
          conflictLogUpdates.push({ id: log.id });
          continue;
        }

        if (log.entitySnapshot) {
          updateOps.push(
            prisma.homeVisit.update({
              where: { id: log.targetEntityId },
              data: {
                visitStatus: snapshot.visitStatus,
                informantRelation: snapshot.informantRelation,
                teacherSummary: snapshot.teacherSummary,
              },
            })
          );
        } else {
          updateOps.push(
            prisma.homeVisit.update({
              where: { id: log.targetEntityId },
              data: { deletedAt: new Date() },
            })
          );
        }
        rolledBackCount++;
      }

      if (updateOps.length > 0 || conflictLogUpdates.length > 0) {
        await prisma.$transaction([
          ...updateOps,
          ...conflictLogUpdates.map((l: any) =>
            prisma.importRowLog.update({
              where: { id: l.id },
              data: {
                status: RowImportStatus.FAILED,
                errorDetails: "ROLLBACK_CONFLICT: Record edited post-import",
              },
            })
          ),
        ]);
      }
    }

    // ── Finalise job + audit ───────────────────────────────────────────────────
    const finalStatus =
      conflictCount > 0 ? ImportJobStatus.FAILED : ImportJobStatus.ROLLBACKED;

    await prisma.$transaction([
      prisma.importJob.update({
        where: { id: jobId },
        data: { status: finalStatus },
      }),
      prisma.auditLog.create({
        data: {
          action: AuditAction.IMPORT, // reusing IMPORT action for rollback audit
          entityName: job.targetDomain,
          entityId: jobId,
          after: { rolledBackCount, conflictCount } as any,
          correlationId,
        },
      }),
    ]);

    return { rolledBackCount, conflictCount, conflictedIds };
  }
}

export const importProcessor = new DirectImportProcessor();
