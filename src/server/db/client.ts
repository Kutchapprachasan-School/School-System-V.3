// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { env } from "@/env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = new pg.Pool({ connectionString: env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const basePrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

/**
 * Global Soft-Delete Extension
 *
 * Automatically injects `deletedAt: null` into all findMany / findFirst /
 * findUnique read queries on models that have a `deletedAt` column, so
 * developers can never accidentally leak soft-deleted rows.
 *
 * Override at call-site with `{ where: { deletedAt: { not: null } } }` when
 * you intentionally need to query deleted records (e.g. rollback audits).
 */
export const prisma = basePrisma.$extends({
  name: "soft-delete-filter",
  query: {
    student: {
      findMany: ({ args, query }) => {
        args.where = { deletedAt: null, ...args.where };
        return query(args);
      },
      findFirst: ({ args, query }) => {
        args.where = { deletedAt: null, ...args.where };
        return query(args);
      },
    },
    homeVisit: {
      findMany: ({ args, query }) => {
        args.where = { deletedAt: null, ...args.where };
        return query(args);
      },
      findFirst: ({ args, query }) => {
        args.where = { deletedAt: null, ...args.where };
        return query(args);
      },
    },
  },
}) as unknown as PrismaClient;

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
