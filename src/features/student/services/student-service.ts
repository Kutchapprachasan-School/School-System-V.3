// src/features/student/services/student-service.ts
import { prisma } from "@/server/db/client";
import { StudentImportInput } from "../schemas";
import { StudentStatus, AuditAction, Prisma } from "@prisma/client";
import { getCorrelationId } from "@/lib/correlation";

export interface Actor {
  id: string;
  role: string;
  permissions: string[];
}

export class StudentService {
  private verifyPermission(actor: Actor, permission: string) {
    if (!actor.permissions.includes(permission)) {
      throw new Error(`Unauthorized: missing permission ${permission}`);
    }
  }

  async getActiveStudents() {
    return prisma.student.findMany({
      where: { deletedAt: null },
      orderBy: { studentId: "asc" },
    });
  }

  async getStudentById(id: string) {
    return prisma.student.findFirst({
      where: { id, deletedAt: null },
    });
  }

  async createStudent(data: StudentImportInput, actor: Actor) {
    this.verifyPermission(actor, "student:create");

    // 1. Business Unique Key constraint check
    const existing = await prisma.student.findFirst({
      where: { studentId: data.studentId, deletedAt: null },
    });

    if (existing) {
      throw new Error(`Conflict: Student with code ${data.studentId} already exists`);
    }

    const correlationId = getCorrelationId();

    try {
      return await prisma.$transaction(async (tx) => {
        const student = await tx.student.create({
          data: {
            studentId: data.studentId,
            studentName: data.studentName,
            classLevel: data.classLevel,
            room: data.room,
            status: data.status,
            profileImage: data.profileImage,
            createdBy: actor.id,
          },
        });

        // 2. Audit Logging
        await tx.auditLog.create({
          data: {
            userId: actor.id,
            action: AuditAction.CREATE,
            entityName: "Student",
            entityId: student.id,
            after: data as any,
            correlationId,
          },
        });

        return student;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new Error(`Conflict: Student with code ${data.studentId} already exists (DB index violation)`);
      }
      throw error;
    }
  }

  async updateStudent(id: string, data: Partial<StudentImportInput>, actor: Actor) {
    this.verifyPermission(actor, "student:update");

    const student = await prisma.student.findFirst({
      where: { id, deletedAt: null },
    });

    if (!student) {
      throw new Error("Student not found or soft-deleted");
    }

    // If studentId is changing, ensure it doesn't conflict with another active student
    if (data.studentId && data.studentId !== student.studentId) {
      const existing = await prisma.student.findFirst({
        where: { studentId: data.studentId, deletedAt: null },
      });
      if (existing) {
        throw new Error(`Conflict: Student code ${data.studentId} is already in use`);
      }
    }

    const correlationId = getCorrelationId();

    try {
      return await prisma.$transaction(async (tx) => {
        const updated = await tx.student.update({
          where: { id },
          data: {
            studentId: data.studentId,
            studentName: data.studentName,
            classLevel: data.classLevel,
            room: data.room,
            status: data.status as StudentStatus | undefined,
            profileImage: data.profileImage,
            updatedBy: actor.id,
          },
        });

        await tx.auditLog.create({
          data: {
            userId: actor.id,
            action: AuditAction.UPDATE,
            entityName: "Student",
            entityId: id,
            before: {
              studentId: student.studentId,
              studentName: student.studentName,
              classLevel: student.classLevel,
              room: student.room,
              status: student.status,
            } as any,
            after: data as any,
            correlationId,
          },
        });

        return updated;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new Error(`Conflict: Student code ${data.studentId || student.studentId} is already in use (DB index violation)`);
      }
      throw error;
    }
  }

  async deleteStudent(id: string, actor: Actor) {
    this.verifyPermission(actor, "student:delete");

    const student = await prisma.student.findFirst({
      where: { id, deletedAt: null },
    });

    if (!student) {
      throw new Error("Student not found or already soft-deleted");
    }

    const correlationId = getCorrelationId();

    return prisma.$transaction(async (tx) => {
      const deleted = await tx.student.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          updatedBy: actor.id,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: actor.id,
          action: AuditAction.DELETE,
          entityName: "Student",
          entityId: id,
          before: { studentId: student.studentId } as any,
          correlationId,
        },
      });

      return deleted;
    });
  }
}

export const studentService = new StudentService();
