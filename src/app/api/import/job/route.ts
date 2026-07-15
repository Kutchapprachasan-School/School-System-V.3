import { NextResponse } from "next/server";
import { requireSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import { ImportJobStatus, ImportDomain } from "@prisma/client";

export async function POST(request: Request) {
  try {
    // 1. Authorization checks
    const session = await requireSession();
    const permissions: string[] = (session.session as any).permissions || [];

    if (!permissions.includes("import:execute")) {
      return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    const { fileName, targetDomain, totalRows } = body;

    if (!fileName || !targetDomain || totalRows === undefined) {
      return NextResponse.json({ error: "Missing job initialization fields" }, { status: 400 });
    }

    // 2. Create the ImportJob
    const job = await prisma.importJob.create({
      data: {
        fileName,
        targetDomain: targetDomain as ImportDomain,
        totalRows,
        status: ImportJobStatus.PENDING,
        createdBy: session.user.id,
      },
    });

    return NextResponse.json({ jobId: job.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
