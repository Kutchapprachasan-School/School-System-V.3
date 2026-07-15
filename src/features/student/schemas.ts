// src/features/student/schemas.ts
import { z } from "zod";
import { StudentStatus } from "@prisma/client";

export const StudentImportSchema = z.object({
  studentId: z.string().min(1, "รหัสนักเรียนต้องไม่ว่าง"),
  studentName: z.string().min(1, "ชื่อ-นามสกุลต้องไม่ว่าง"),
  classLevel: z.string().min(1, "ระดับชั้นต้องไม่ว่าง"),
  room: z.string().min(1, "ห้องเรียนต้องไม่ว่าง"),
  status: z.nativeEnum(StudentStatus).default(StudentStatus.STUDYING),
  profileImage: z.string().nullable().optional(),
});

export type StudentImportInput = z.infer<typeof StudentImportSchema>;
