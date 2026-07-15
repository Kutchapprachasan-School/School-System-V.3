// src/features/home-visit/repository.ts
import { prisma } from "@/server/db/client";
import { HomeVisitImportInput } from "./schemas";
import { RowImportStatus } from "@prisma/client";
import { randomUUID } from "crypto";

export async function batchUpsertHomeVisits(
  jobId: string,
  chunkId: string,
  rows: { rowIndex: number; data: HomeVisitImportInput }[]
) {
  // 1. Deduplicate rows inside the chunk by studentId + visitDate (keep last occurrence)
  const uniqueRowsMap = new Map<string, { rowIndex: number; data: HomeVisitImportInput }>();
  for (const row of rows) {
    const key = `${row.data.studentId}_${row.data.visitDate.toDateString()}`;
    uniqueRowsMap.set(key, row);
  }
  const deduplicatedRows = Array.from(uniqueRowsMap.values());

  // 2. Fetch student mapping for referenced codes (ignores soft-deleted students)
  const studentIds = deduplicatedRows.map((r) => r.data.studentId);
  const students = await prisma.student.findMany({
    where: {
      studentId: { in: studentIds },
      deletedAt: null,
    },
    select: {
      id: true,
      studentId: true,
    },
  });

  const studentMap = new Map(students.map((s) => [s.studentId, s]));

  // 3. Fetch all existing visits for these students on these dates to prevent N+1 queries
  const resolvedStudentUUIDs = Array.from(studentMap.values()).map((s) => s.id);
  const visitDates = deduplicatedRows.map((r) => r.data.visitDate);

  const existingVisits = await prisma.homeVisit.findMany({
    where: {
      studentId: { in: resolvedStudentUUIDs },
      visitDate: { in: visitDates },
      deletedAt: null,
    },
    select: {
      id: true,
      studentId: true,
      visitDate: true,
      visitStatus: true,
      informantRelation: true,
      teacherSummary: true,
      updatedAt: true,
    },
  });

  const visitMap = new Map(
    existingVisits.map((v) => [`${v.studentId}_${v.visitDate?.toDateString()}`, v])
  );

  const operations: any[] = [];
  const results: any[] = [];

  for (const row of deduplicatedRows) {
    const matchedStudent = studentMap.get(row.data.studentId);

    if (!matchedStudent) {
      // Missing FK Handling Rule: Fail row if student is not found or soft-deleted
      operations.push(
        prisma.importRowLog.create({
          data: {
            importJobId: jobId,
            chunkId,
            rowIndex: row.rowIndex,
            status: RowImportStatus.FAILED,
            originalData: row.data as any,
            errorDetails: `REFERENTIAL_ERROR: Active student with code ${row.data.studentId} does not exist`,
          },
        })
      );

      results.push({
        rowIndex: row.rowIndex,
        status: RowImportStatus.FAILED,
      });
      continue;
    }

    const studentUUID = matchedStudent.id;
    const visitKey = `${studentUUID}_${row.data.visitDate.toDateString()}`;
    const matchedVisit = visitMap.get(visitKey);

    let entitySnapshot: any = null;
    let entityUpdatedAt: Date | null = null;
    let targetEntityId: string | null = null;

    if (matchedVisit) {
      // Snapshot only non-binary fields to prevent log bloat
      entitySnapshot = {
        visitStatus: matchedVisit.visitStatus,
        informantRelation: matchedVisit.informantRelation,
        teacherSummary: matchedVisit.teacherSummary,
      };
      entityUpdatedAt = matchedVisit.updatedAt;
      targetEntityId = matchedVisit.id;

      // Update existing home visit
      operations.push(
        prisma.homeVisit.update({
          where: { id: matchedVisit.id },
          data: {
            visitStatus: row.data.visitStatus,
            informantRelation: row.data.informantRelation,
            photoSource: row.data.photoSource,
            mapLat: row.data.mapLat,
            mapLong: row.data.mapLong,
            houseNo: row.data.houseNo,
            houseMoo: row.data.houseMoo,
            houseRoad: row.data.houseRoad,
            houseTambon: row.data.houseTambon,
            houseAmphoe: row.data.houseAmphoe,
            houseProvince: row.data.houseProvince,
            familyIncome: row.data.familyIncome,
            familyExpense: row.data.familyExpense,
            familyDebt: row.data.familyDebt,
            teacherSummary: row.data.teacherSummary,
          },
        })
      );
    } else {
      const generatedId = randomUUID();
      targetEntityId = generatedId;

      // Create new home visit
      operations.push(
        prisma.homeVisit.create({
          data: {
            id: generatedId,
            studentId: studentUUID,
            visitStatus: row.data.visitStatus,
            visitDate: row.data.visitDate,
            informantRelation: row.data.informantRelation,
            photoSource: row.data.photoSource,
            mapLat: row.data.mapLat,
            mapLong: row.data.mapLong,
            houseNo: row.data.houseNo,
            houseMoo: row.data.houseMoo,
            houseRoad: row.data.houseRoad,
            houseTambon: row.data.houseTambon,
            houseAmphoe: row.data.houseAmphoe,
            houseProvince: row.data.houseProvince,
            familyIncome: row.data.familyIncome,
            familyExpense: row.data.familyExpense,
            familyDebt: row.data.familyDebt,
            teacherSummary: row.data.teacherSummary,
          },
        })
      );
    }

    // Log successful import
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

  // Execute chunk inside transaction
  if (operations.length > 0) {
    await prisma.$transaction(operations);
  }

  return results;
}
