import { NextRequest, NextResponse } from "next/server";
import { requireSession } from "@/server/auth/session";
import { prisma } from "@/server/db/client";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user session
    const session = await requireSession();
    const userId = session.user.id;

    // 2. Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "Missing file payload" }, { status: 400 });
    }

    const widthStr = formData.get("width") as string | null;
    const heightStr = formData.get("height") as string | null;
    const capturedAtStr = formData.get("capturedAt") as string | null;
    
    const width = widthStr ? parseInt(widthStr, 10) : null;
    const height = heightStr ? parseInt(heightStr, 10) : null;
    const capturedAt = capturedAtStr ? new Date(capturedAtStr) : null;

    // 3. Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 4. Calculate SHA-256 checksum for deduplication auditing
    const checksum = crypto.createHash("sha256").update(buffer).digest("hex");

    // Check if another active FileRecord already shares this checksum
    const existingShare = await prisma.fileRecord.findFirst({
      where: { checksum, deletedAt: null },
    });

    let storagePath = "";
    const bucketName = "house-photos-mock";

    if (existingShare) {
      // Deduplication: reuse the same physical storage path
      storagePath = existingShare.storagePath;
    } else {
      // Create local file directory for mock storage
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });

      // Save file physically with checksum-based filename to avoid collision
      const fileExt = path.extname(file.name) || ".jpg";
      const fileName = `${checksum}${fileExt}`;
      const physicalPath = path.join(uploadsDir, fileName);
      
      await fs.writeFile(physicalPath, buffer);
      storagePath = `/uploads/${fileName}`; // Serving path
    }

    // 5. Create a new distinct FileRecord entry in the database (supports independent deletion lifecycles)
    const fileRecord = await prisma.fileRecord.create({
      data: {
        fileName: file.name,
        bucketName,
        storagePath,
        mimeType: file.type || "image/jpeg",
        sizeBytes: BigInt(file.size),
        checksum,
        width,
        height,
        capturedAt,
        uploaderId: userId,
      },
    });

    // BigInt serialization workaround
    return NextResponse.json({
      success: true,
      fileRecord: {
        id: fileRecord.id,
        fileName: fileRecord.fileName,
        storagePath: fileRecord.storagePath,
        width: fileRecord.width,
        height: fileRecord.height,
        capturedAt: fileRecord.capturedAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to upload image file" },
      { status: 500 }
    );
  }
}
