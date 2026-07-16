import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../db/client";
import { env } from "@/env";
import { logger } from "../logger/logger";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: env.BETTER_AUTH_SECRET,
  trustHost: true,
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    username(),
  ],
  session: {
    strategy: "jwt",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
  },
  // Custom JWT hook to fetch permissions from Custom RBAC and inject into JWT payload
  jwt: {
    definePayload: async ({ user }: { user: any }) => {
      try {
        const userRoles = await prisma.userRole.findMany({
          where: { userId: user.id },
          include: {
            role: {
              include: {
                permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        });

        const permissions = Array.from(
          new Set(
            userRoles.flatMap((ur: any) =>
              ur.role.permissions.map((rp: any) => rp.permission.action)
            )
          )
        );

        const primaryRole = userRoles[0]?.role.name || "TEACHER";

        return {
          role: primaryRole,
          permissions: permissions,
        };
      } catch (error: any) {
        logger.error({ err: error }, "Failed to inject permissions into JWT payload");
        return {
          role: "TEACHER",
          permissions: [],
        };
      }
    },
  },
});
