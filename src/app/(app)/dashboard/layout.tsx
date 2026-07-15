import { requireSession } from "@/server/auth/session";
import { LayoutDashboard, Users, Home, BookOpen, FileText, Upload, LogOut, Shield } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/server/auth/better-auth";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  const navItems = [
    { name: "แดชบอร์ด (Analytics)", icon: LayoutDashboard, href: "/dashboard", active: true },
    { name: "ทะเบียนนักเรียน (Student)", icon: Users, href: "#", disabled: true },
    { name: "เยี่ยมบ้านนักเรียน (Home Visit)", icon: Home, href: "#", disabled: true },
    { name: "งานวิชาการ (Academic Docs)", icon: BookOpen, href: "#", disabled: true },
    { name: "งานสารบรรณ (Saraban)", icon: FileText, href: "#", disabled: true },
    { name: "นำเข้าข้อมูล (Importer)", icon: Upload, href: "#", disabled: true },
  ];

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col justify-between">
        <div>
          {/* Brand Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
              S
            </div>
            <span className="font-semibold text-lg tracking-tight text-white">School System</span>
          </div>

          {/* Navigation */}
          <nav className="mt-6 px-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              if (item.disabled) {
                return (
                  <div
                    key={item.name}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-500 cursor-not-allowed select-none text-sm group"
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    <span className="text-[10px] bg-slate-800/80 text-slate-400 px-1.5 py-0.5 rounded-md font-mono shrink-0">
                      Sprint 2
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-slate-800 hover:text-white ${
                    item.active ? "bg-indigo-600/10 text-indigo-400 font-medium border border-indigo-500/10" : "text-slate-400"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Footer Profile & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-semibold text-indigo-400 border border-slate-700">
              {session.user.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
              <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-mono mt-0.5">
                <Shield className="w-3. h-3." />
                <span>{(session.session as any).role || "TEACHER"}</span>
              </div>
            </div>
          </div>

          <form
            action={async () => {
              "use server";
              // Direct server-side sign out logic: we can redirect to a logout api route or handle it
              redirect("/api/logout");
            }}
          >
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 text-slate-400 hover:text-rose-400 text-sm font-medium transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>ออกจากระบบ</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-slate-800 flex items-center px-8 bg-slate-900/20 backdrop-blur-md sticky top-0 z-40">
          <h1 className="text-xl font-semibold text-white">ระบบงานจัดการโรงเรียน</h1>
        </header>

        {/* Body Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
