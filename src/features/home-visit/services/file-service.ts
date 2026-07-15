// src/features/home-visit/services/file-service.ts
import { prisma } from "@/server/db/client";
import { promises as fs } from "fs";
import path from "path";
import type { Actor } from "@/features/student/services/student-service";

export class FileService {
  private verifyPermission(actor: Actor, permission: string) {
    if (!actor.permissions.includes(permission)) {
      throw new Error(`Unauthorized: missing permission '${permission}'`);
    }
  }

  /**
   * Deletes a FileRecord. Performs reference counting:
   * If other active records share the same physical storagePath, we do NOT delete
   * the physical file. If this was the last record referencing the path, we delete it.
   */
  async deleteFileRecord(id: string, actor: Actor): Promise<boolean> {
    // Requires a file deletion permission or visit modification permission
    this.verifyPermission(actor, "visit:update");

    const record = await prisma.fileRecord.findFirst({
      where: { id, deletedAt: null },
    });

    if (!record) {
      throw new Error("FileRecord not found or already deleted");
    }

    // Soft delete the FileRecord DB entry
    await prisma.fileRecord.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    // Check reference count of remaining active FileRecords sharing the same physical path
    const activeRefs = await prisma.fileRecord.count({
      where: {
        storagePath: record.storagePath,
        deletedAt: null,
      },
    });

    if (activeRefs === 0) {
      // No remaining active records reference this file path → safe to physically delete
      try {
        const physicalPath = path.join(process.cwd(), "public", record.storagePath);
        await fs.unlink(physicalPath);
        return true;
      } catch (err) {
        // Log error but don't fail transaction (assets can be cleaned up by cron backups)
        console.error(`Failed to physically delete file at ${record.storagePath}:`, err);
      }
    }

    return false;
  }
}

export const fileService = new FileService();
