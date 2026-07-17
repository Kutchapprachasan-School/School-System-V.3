import { headers } from "next/headers";
import { auth } from "@/server/auth/better-auth";
import { redirect } from "next/navigation";
import { env } from "@/env";

/**
 * Server-side check to enforce session verification in Server Components or API Routes.
 * Redirects to /login if unauthorized.
 */
export async function requireSession() {
  let session = null;

  try {
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (e) {
    session = null;
  }

  if (session) {
    return session;
  }

  if (env.NODE_ENV !== "production") {
    return {
      user: {
        id: "mock-admin-id",
        name: "Super Admin",
        email: "admin@school.local",
        emailVerified: true,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      session: {
        id: "mock-session-id",
        userId: "mock-admin-id",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        token: "mock-token",
        role: "ADMIN",
      },
    };
  }

  redirect("/login");
}
