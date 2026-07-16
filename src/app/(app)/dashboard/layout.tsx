import { requireSession } from "@/server/auth/session";
import { SidebarShell } from "./sidebar-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const role = (session.session as any).role || "TEACHER";

  return (
    <SidebarShell userName={session.user.name} userRole={role}>
      {children}
    </SidebarShell>
  );
}
