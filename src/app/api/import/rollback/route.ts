import { NextResponse } from "next/server";
import { requireSession } from "@/server/auth/session";
import { importProcessor } from "@/features/importer/services/import-service";
import { logger } from "@/server/logger/logger";

export async function POST(request: Request) {
  try {
    // 1. Authorization checks
    const session = await requireSession();
    const permissions: string[] = (session.session as any).permissions || [];

    if (!permissions.includes("auth:manage")) {
      return NextResponse.json({ error: "Forbidden: insufficient admin permissions" }, { status: 403 });
    }

    const body = await request.json();
    const { jobId } = body;

    if (!jobId) {
      return NextResponse.json({ error: "Missing required jobId parameter" }, { status: 400 });
    }

    // 2. Trigger rollback execution
    const result = await importProcessor.rollbackJob(jobId);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    logger.error({ err: error }, "API Import rollback execution failed");
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
