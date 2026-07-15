"use server";

import { requireSession } from "@/server/auth/session";
import { studentService, Actor } from "@/features/student/services/student-service";
import { StudentImportInput } from "@/features/student/schemas";
import { revalidatePath } from "next/cache";

async function getActor(): Promise<Actor> {
  const session = await requireSession();
  return {
    id: session.user.id,
    role: (session.session as any).role || "TEACHER",
    permissions: (session.session as any).permissions || [],
  };
}

export async function createStudentAction(data: StudentImportInput) {
  try {
    const actor = await getActor();
    const student = await studentService.createStudent(data, actor);
    revalidatePath("/dashboard/students");
    return { success: true, student };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create student" };
  }
}

export async function updateStudentAction(id: string, data: Partial<StudentImportInput>) {
  try {
    const actor = await getActor();
    const student = await studentService.updateStudent(id, data, actor);
    revalidatePath("/dashboard/students");
    return { success: true, student };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update student" };
  }
}

export async function deleteStudentAction(id: string) {
  try {
    const actor = await getActor();
    await studentService.deleteStudent(id, actor);
    revalidatePath("/dashboard/students");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete student" };
  }
}
