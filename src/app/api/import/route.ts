import { NextResponse } from "next/server";
import { requireSession } from "@/server/auth/session";
import { importProcessor } from "@/features/importer/services/import-service";
import { createHash } from "crypto";
import { logger } from "@/server/logger/logger";

// Helper to recursively sort JSON object keys for deterministic hashing
function sortObjectKeys(obj: any): any {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(sortObjectKeys);
  return Object.keys(obj)
    .sort()
    .reduce((sorted: any, key) => {
      sorted[key] = sortObjectKeys(obj[key]);
      return sorted;
    }, {});
}

export async function POST(request: Request) {
  try {
    // 1. Authorization checks
    const session = await requireSession();
    const permissions: string[] = (session.session as any).permissions || [];

    if (!permissions.includes("import:execute")) {
      return NextResponse.json({ error: "Forbidden: insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    const { jobId, chunkId, payloadHash, domain, rowIndexStart, rows } = body;

    if (!jobId || !chunkId || !payloadHash || !domain || rowIndexStart === undefined || !rows) {
      return NextResponse.json({ error: "Missing required import parameters" }, { status: 400 });
    }

    // 2. Deterministic Hash Integrity Verification (Prevents Property Sorting mismatches)
    const sortedRows = sortObjectKeys(rows);
    const computedHash = createHash("sha256")
      .update(JSON.stringify(sortedRows))
      .digest("hex");

    if (computedHash !== payloadHash) {
      return NextResponse.json(
        { error: "Payload integrity check failed: SHA-256 hash mismatch" },
        { status: 400 }
      );
    }

    // 3. Process the chunk
    const result = await importProcessor.processChunk(
      jobId,
      chunkId,
      payloadHash,
      domain,
      rowIndexStart,
      rows
    );

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    logger.error({ err: error }, "API Import chunk process failed");
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
