import { headers } from "next/headers";
import { auth } from "@/server/auth/better-auth";
import { redirect } from "next/navigation";

/**
 * Server-side check to enforce session verification in Server Components or API Routes.
 * Redirects to /login if unauthorized.
 */
export async function requireSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session;
}
