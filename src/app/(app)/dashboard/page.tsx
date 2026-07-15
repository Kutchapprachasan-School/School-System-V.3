import { requireSession } from "@/server/auth/session";
import { Shield, Key, User as UserIcon, Calendar, CheckCircle } from "lucide-react";

export default async function DashboardPage() {
  const session = await requireSession();
  
  // Custom properties from JWT payload injected by Better Auth
  const role = (session.session as any).role || "TEACHER";
  const permissions: string[] = (session.session as any).permissions || [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">ยินดีต้อนรับกลับ, {session.user.name}!</h2>
          <p className="text-slate-400 text-sm mt-1">นี่คือหน้าหลักของระบบสารบรรณและการจัดการระดับโรงเรียน (Sprint 1 MVP Shell)</p>
        </div>
        <div className="text-[11px] font-mono text-slate-500 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
          Last Active: {new Date().toLocaleDateString("th-TH")}
        </div>
      </div>

      {/* Stats / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <UserIcon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">บัญชีผู้ใช้งาน</h3>
            <p className="text-lg font-bold text-white mt-1 truncate">{session.user.username}</p>
            <p className="text-xs text-slate-500 mt-0.5 truncate">{session.user.email}</p>
          </div>
        </div>

        {/* Role Card */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">สิทธิ์ระบบงาน (Role)</h3>
            <p className="text-lg font-bold text-white mt-1">{role}</p>
            <p className="text-xs text-slate-500 mt-0.5">กำหนดผ่านฐานข้อมูล RBAC</p>
          </div>
        </div>

        {/* Permissions Count */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">สิทธิ์การดำเนินการ</h3>
            <p className="text-lg font-bold text-white mt-1">{permissions.length} รายการ</p>
            <p className="text-xs text-slate-500 mt-0.5">พร้อมใช้ใน API & Server Actions</p>
          </div>
        </div>
      </div>

      {/* RBAC Details Check */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
          <Key className="w-5 h-5 text-indigo-400" />
          การตรวจสอบสิทธิ์ความปลอดภัย (Custom RBAC Session Check)
        </h3>
        
        <div className="mt-4 space-y-4">
          <p className="text-slate-400 text-sm">
            การดึงสิทธิ์และบทบาทโดยตรงผ่านก้อน JWT Session ของ Better Auth โดยไม่ต้องทำ SQL Join ซ้ำซ้อน:
          </p>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 font-mono text-xs text-slate-300 space-y-1 overflow-x-auto">
            <div><span className="text-indigo-400">userId:</span> "{session.user.id}"</div>
            <div><span className="text-indigo-400">role:</span> "{role}"</div>
            <div><span className="text-indigo-400">permissions:</span> [</div>
            {permissions.map((p, idx) => (
              <div key={p} className="pl-6 text-emerald-400">
                "{p}"{idx < permissions.length - 1 ? "," : ""}
              </div>
            ))}
            <div>]</div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
            <CheckCircle className="w-4 h-4 text-indigo-500" />
            <span>สิทธิ์นี้ถูกโหลดแบบข้ามฝั่งในระดับ Middleware โดยอัตโนมัติ</span>
          </div>
        </div>
      </div>
    </div>
  );
}
