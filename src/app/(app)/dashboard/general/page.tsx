"use client";

import Link from "next/link";
import { Users2, Home, ArrowRight, ShieldAlert } from "lucide-react";

export default function GeneralManagementPage() {
  const subModules = [
    {
      title: "ระบบทะเบียนนักเรียน",
      description: "จัดการฐานข้อมูลนักเรียน ค้นหาประวัติ แก้ไขข้อมูลรายบุคคล และจัดการประวัติสถานภาพ",
      icon: Users2,
      href: "/dashboard/students",
      color: "from-blue-500 to-indigo-600",
      shadowColor: "rgba(59, 130, 246, 0.15)",
    },
    {
      title: "ระบบเยี่ยมบ้านนักเรียน",
      description: "บันทึกการเยี่ยมบ้านนักเรียน เก็บพิกัด GPS อัปโหลดรูปภาพ สรุปผลวิเคราะห์ และจัดเก็บร่างฟอร์มออฟไลน์",
      icon: Home,
      href: "/dashboard/visits",
      color: "from-purple-500 to-indigo-600",
      shadowColor: "rgba(147, 51, 234, 0.15)",
    },
  ];

  return (
    <div className="space-y-6 text-slate-700">
      {/* Title Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
        <h2 className="text-xl font-bold text-slate-800 leading-tight">ระบบบริหารงานทั่วไป</h2>
        <p className="text-slate-400 text-xs mt-1.5 font-medium">
          เข้าถึงโมดูลงานย่อยและระบบบันทึกผลงานในฝั่งทะเบียนและสารสนเทศโรงเรียน
        </p>
      </div>

      {/* Modules Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subModules.map((mod) => {
          const Icon = mod.icon;
          return (
            <Link
              key={mod.title}
              href={mod.href}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col justify-between hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all duration-300 group cursor-pointer text-decoration-none"
            >
              <div className="space-y-4">
                {/* Icon Container */}
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${mod.color} flex items-center justify-center text-white shadow-lg`}
                  style={{ boxShadow: `0 8px 20px ${mod.shadowColor}` }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-800 leading-tight group-hover:text-purple-600 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              </div>

              {/* Action Link Footer */}
              <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-purple-600 transition-colors">
                <span>คลิกเพื่อเข้าสู่ระบบงาน</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Security Info Banner */}
      <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-4 flex gap-3 items-start">
        <ShieldAlert className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="text-xs font-bold text-slate-700">คำเตือนสิทธิ์ความปลอดภัย (RBAC Audit Logs)</h4>
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
            การดำเนินการสร้าง แก้ไข หรือนำเข้าข้อมูลทั้งหมดจะบันทึกพร้อมค่า Correlation ID และสิทธิ์การกระทำอย่างสมบูรณ์แบบเพื่อการตรวจสอบภายหลัง
          </p>
        </div>
      </div>
    </div>
  );
}
