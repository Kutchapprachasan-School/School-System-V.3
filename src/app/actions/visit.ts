"use server";

import { requireSession } from "@/server/auth/session";
import { visitService, HomeVisitInput } from "@/features/home-visit/services/visit-service";
import type { Actor } from "@/features/student/services/student-service";
import { revalidatePath } from "next/cache";

async function getActor(): Promise<Actor> {
  const session = await requireSession();
  return {
    id: session.user.id,
    role: (session.session as any).role || "TEACHER",
    permissions: (session.session as any).permissions || [],
  };
}

export async function createVisitAction(data: HomeVisitInput) {
  try {
    const actor = await getActor();
    const visit = await visitService.createVisit(data, actor);
    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard/visits");
    return { success: true, visit };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to create visit" };
  }
}

export async function updateVisitAction(id: string, data: Partial<HomeVisitInput>) {
  try {
    const actor = await getActor();
    const visit = await visitService.updateVisit(id, data, actor);
    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard/visits");
    return { success: true, visit };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to update visit" };
  }
}

export async function deleteVisitAction(id: string) {
  try {
    const actor = await getActor();
    await visitService.deleteVisit(id, actor);
    revalidatePath("/dashboard/students");
    revalidatePath("/dashboard/visits");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete visit" };
  }
}
