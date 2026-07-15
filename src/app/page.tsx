import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/server/auth/better-auth";

export default async function IndexPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
