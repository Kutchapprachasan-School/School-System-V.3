// src/features/home-visit/schemas.ts
import { z } from "zod";

export const HomeVisitImportSchema = z.object({
  studentId: z.string().min(1, "รหัสนักเรียนต้องไม่ว่าง"),
  visitStatus: z.string().min(1, "สถานะการเยี่ยมบ้านต้องไม่ว่าง"),
  visitDate: z.preprocess((val) => {
    if (typeof val === "string" || val instanceof Date) return new Date(val);
    return val;
  }, z.date({ message: "วันที่เยี่ยมบ้านไม่ถูกต้อง" }).refine((date) => {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return date <= oneYearFromNow;
  }, "วันที่เยี่ยมบ้านห้ามเกิน 1 ปีในอนาคต")),
  informantRelation: z.string().nullable().optional(),
  photoSource: z.string().nullable().optional(),
  mapLat: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), 
    z.number().min(-90, "ละติจูดต้องอยู่ระหว่าง -90 ถึง 90").max(90, "ละติจูดต้องอยู่ระหว่าง -90 ถึง 90").nullable().optional()
  ),
  mapLong: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), 
    z.number().min(-180, "ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180").max(180, "ลองจิจูดต้องอยู่ระหว่าง -180 ถึง 180").nullable().optional()
  ),
  houseNo: z.string().nullable().optional(),
  houseMoo: z.string().nullable().optional(),
  houseRoad: z.string().nullable().optional(),
  houseTambon: z.string().nullable().optional(),
  houseAmphoe: z.string().nullable().optional(),
  houseProvince: z.string().nullable().optional(),
  familyIncome: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().nullable().optional()),
  familyExpense: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().nullable().optional()),
  familyDebt: z.preprocess((val) => (val === "" || val === null || val === undefined ? null : Number(val)), z.number().nullable().optional()),
  teacherSummary: z.string().nullable().optional(),
});

export type HomeVisitImportInput = z.infer<typeof HomeVisitImportSchema>;
