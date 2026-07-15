// src/features/student/repository.ts
import { prisma } from "@/server/db/client";
import { StudentImportInput } from "./schemas";
import { RowImportStatus } from "@prisma/client";
import { randomUUID } from "crypto";

export async function batchUpsertStudents(
  jobId: string,
  chunkId: string,
  rows: { rowIndex: number; data: StudentImportInput }[]
) {
  // 1. Deduplicate rows inside the chunk by studentId (keep last occurrence to prevent deadlocks)
  const uniqueRowsMap = new Map<string, { rowIndex: number; data: StudentImportInput }>();
  for (const row of rows) {
    uniqueRowsMap.set(row.data.studentId, row);
  }
  const deduplicatedRows = Array.from(uniqueRowsMap.values());

  // 2. Fetch all existing students in this chunk in a single query (prevents N+1 queries)
  const studentIds = deduplicatedRows.map((r) => r.data.studentId);
  const existingStudents = await prisma.student.findMany({
    where: {
      studentId: { in: studentIds },
      deletedAt: null,
    },
    select: {
      id: true,
      studentId: true,
      studentName: true,
      classLevel: true,
      room: true,
      status: true,
      updatedAt: true,
    },
  });

  const existingMap = new Map(existingStudents.map((s) => [s.studentId, s]));

  const operations: any[] = [];
  const results: any[] = [];

  for (const row of deduplicatedRows) {
    const matched = existingMap.get(row.data.studentId);
    let entitySnapshot: any = null;
    let entityUpdatedAt: Date | null = null;
    let targetEntityId: string | null = null;

    if (matched) {
      // Snapshot Policy: Store only primitives to prevent memory bloat (no binary images)
      entitySnapshot = {
        studentId: matched.studentId,
        studentName: matched.studentName,
        classLevel: matched.classLevel,
        room: matched.room,
        status: matched.status,
      };
      entityUpdatedAt = matched.updatedAt;
      targetEntityId = matched.id;

      // Update operation
      operations.push(
        prisma.student.update({
          where: { id: matched.id },
          data: {
            studentName: row.data.studentName,
            classLevel: row.data.classLevel,
            room: row.data.room,
            status: row.data.status,
            profileImage: row.data.profileImage,
          },
        })
      );
    } else {
      // Create operation: generate UUID on client/service side to link in logs
      const generatedId = randomUUID();
      targetEntityId = generatedId;

      operations.push(
        prisma.student.create({
          data: {
            id: generatedId,
            studentId: row.data.studentId,
            studentName: row.data.studentName,
            classLevel: row.data.classLevel,
            room: row.data.room,
            status: row.data.status,
            profileImage: row.data.profileImage,
          },
        })
      );
    }

    // Log the successful insert/update row log
    operations.push(
      prisma.importRowLog.create({
        data: {
          importJobId: jobId,
          chunkId,
          rowIndex: row.rowIndex,
          status: RowImportStatus.SUCCESS,
          originalData: row.data as any,
          targetEntityId,
          entitySnapshot,
          entityUpdatedAt,
        },
      })
    );

    results.push({
      rowIndex: row.rowIndex,
      status: RowImportStatus.SUCCESS,
      targetEntityId,
    });
  }

  // Execute in a single, lightweight database transaction
  await prisma.$transaction(operations);

  return results;
}
