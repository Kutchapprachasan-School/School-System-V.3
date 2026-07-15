// src/features/home-visit/services/visit-service.ts
import { prisma } from "@/server/db/client";
import { AuditAction } from "@prisma/client";
import { getCorrelationId } from "@/lib/correlation";
import { parseToUTCMidnight } from "@/lib/dates";
import type { Actor } from "@/features/student/services/student-service";

// ---------------------------------------------------------------------------
// Input types
// ---------------------------------------------------------------------------

export interface HomeVisitInput {
  studentId: string; // internal UUID of the Student record
  visitStatus: string;
  visitDate: string; // ISO "YYYY-MM-DD"
  informantRelation?: string;
  photoSource?: string;

  // GPS
  mapLat?: number;
  mapLong?: number;
  gpsAccuracy?: number;
  gpsCapturedAt?: Date;
  gpsSource?: "AUTO" | "MANUAL";
  gpsOverrideReason?: string;

  // Address
  houseNo?: string;
  houseMoo?: string;
  houseRoad?: string;
  houseTambon?: string;
  houseAmphoe?: string;
  houseProvince?: string;

  // Finances
  familyIncome?: number;
  familyExpense?: number;
  familyDebt?: number;

  teacherSummary?: string;
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class VisitService {
  private verifyPermission(actor: Actor, ...permissions: string[]) {
    for (const perm of permissions) {
      if (!actor.permissions.includes(perm)) {
        throw new Error(`Unauthorized: missing permission '${perm}'`);
      }
    }
  }

  // -------------------------------------------------------------------------
  // READ
  // -------------------------------------------------------------------------

  async getVisitsByStudent(studentId: string, actor: Actor) {
    this.verifyPermission(actor, "visit:view");
    return prisma.homeVisit.findMany({
      where: { studentId },
      orderBy: { visitDate: "desc" },
    });
  }

  async getVisitById(id: string, actor: Actor) {
    this.verifyPermission(actor, "visit:view");
    return prisma.homeVisit.findFirst({ where: { id } });
  }

  // -------------------------------------------------------------------------
  // CREATE
  // -------------------------------------------------------------------------

  async createVisit(data: HomeVisitInput, actor: Actor) {
    this.verifyPermission(actor, "visit:create", "student:view");

    // 1. Validate student exists and is active
    const student = await prisma.student.findFirst({
      where: { id: data.studentId },
    });
    if (!student) {
      throw new Error(
        `Referential error: Student ${data.studentId} does not exist or has been deleted`
      );
    }

    const visitDate = parseToUTCMidnight(data.visitDate);
    const correlationId = getCorrelationId();

    return prisma.$transaction(async (tx) => {
      const visit = await tx.homeVisit.create({
        data: {
          studentId: data.studentId,
          visitStatus: data.visitStatus,
          visitDate,
          informantRelation: data.informantRelation,
          photoSource: data.photoSource,
          mapLat: data.mapLat,
          mapLong: data.mapLong,
          gpsAccuracy: data.gpsAccuracy,
          gpsCapturedAt: data.gpsCapturedAt,
          gpsSource: data.gpsSource,
          gpsOverrideReason: data.gpsOverrideReason,
          houseNo: data.houseNo,
          houseMoo: data.houseMoo,
          houseRoad: data.houseRoad,
          houseTambon: data.houseTambon,
          houseAmphoe: data.houseAmphoe,
          houseProvince: data.houseProvince,
          familyIncome: data.familyIncome,
          familyExpense: data.familyExpense,
          familyDebt: data.familyDebt,
          teacherSummary: data.teacherSummary,
          createdBy: actor.id,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: actor.id,
          action: AuditAction.CREATE,
          entityName: "HomeVisit",
          entityId: visit.id,
          after: { ...data } as any,
          correlationId,
        },
      });

      return visit;
    });
  }

  // -------------------------------------------------------------------------
  // UPDATE
  // -------------------------------------------------------------------------

  async updateVisit(id: string, data: Partial<HomeVisitInput>, actor: Actor) {
    this.verifyPermission(actor, "visit:update");

    const visit = await prisma.homeVisit.findFirst({ where: { id } });
    if (!visit) throw new Error("Visit not found or soft-deleted");

    const correlationId = getCorrelationId();

    return prisma.$transaction(async (tx) => {
      const visitDate = data.visitDate
        ? parseToUTCMidnight(data.visitDate)
        : undefined;

      const updated = await tx.homeVisit.update({
        where: { id },
        data: {
          visitStatus: data.visitStatus,
          visitDate,
          informantRelation: data.informantRelation,
          photoSource: data.photoSource,
          mapLat: data.mapLat,
          mapLong: data.mapLong,
          gpsAccuracy: data.gpsAccuracy,
          gpsCapturedAt: data.gpsCapturedAt,
          gpsSource: data.gpsSource,
          gpsOverrideReason: data.gpsOverrideReason,
          houseNo: data.houseNo,
          houseMoo: data.houseMoo,
          houseRoad: data.houseRoad,
          houseTambon: data.houseTambon,
          houseAmphoe: data.houseAmphoe,
          houseProvince: data.houseProvince,
          familyIncome: data.familyIncome,
          familyExpense: data.familyExpense,
          familyDebt: data.familyDebt,
          teacherSummary: data.teacherSummary,
          updatedBy: actor.id,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: actor.id,
          action: AuditAction.UPDATE,
          entityName: "HomeVisit",
          entityId: id,
          before: {
            visitStatus: visit.visitStatus,
            visitDate: visit.visitDate,
            teacherSummary: visit.teacherSummary,
          } as any,
          after: data as any,
          correlationId,
        },
      });

      return updated;
    });
  }

  // -------------------------------------------------------------------------
  // SOFT DELETE
  // -------------------------------------------------------------------------

  async deleteVisit(id: string, actor: Actor) {
    this.verifyPermission(actor, "visit:delete");

    const visit = await prisma.homeVisit.findFirst({ where: { id } });
    if (!visit) throw new Error("Visit not found or already soft-deleted");

    const correlationId = getCorrelationId();

    return prisma.$transaction(async (tx) => {
      const deleted = await tx.homeVisit.update({
        where: { id },
        data: { deletedAt: new Date(), updatedBy: actor.id },
      });

      await tx.auditLog.create({
        data: {
          userId: actor.id,
          action: AuditAction.DELETE,
          entityName: "HomeVisit",
          entityId: id,
          before: { studentId: visit.studentId, visitDate: visit.visitDate } as any,
          correlationId,
        },
      });

      return deleted;
    });
  }
}

export const visitService = new VisitService();
