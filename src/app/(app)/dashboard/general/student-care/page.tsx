"use client";

import { Home, Users2, ArrowLeft, ArrowRight, ShieldCheck, Heart } from "lucide-react";
import Link from "next/link";

export default function StudentCarePage() {
  const subModules = [
    {
      title: "ระบบทะเบียนนักเรียน",
      description: "จัดการฐานข้อมูลนักเรียน ค้นหาประวัติ แก้ไขข้อมูลรายบุคคล และจัดการประวัติสถานภาพ",
      icon: Users2,
      href: "/dashboard/students",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "ระบบเยี่ยมบ้านนักเรียน",
      description: "บันทึกการเยี่ยมบ้านนักเรียน เก็บพิกัด GPS อัปโหลดรูปภาพ สรุปผลวิเคราะห์ และจัดเก็บร่างฟอร์มออฟไลน์",
      icon: Home,
      href: "/dashboard/visits",
      color: "text-amber-500",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6 text-slate-700">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/general"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 shadow-sm transition border border-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                <Heart className="w-5 h-5" />
              </div>
              ระบบดูแลช่วยเหลือนักเรียน
            </h2>
            <p className="text-slate-500 text-sm mt-1.5 ml-13 font-semibold">จัดเก็บประวัตินักเรียน ทะเบียนรายบุคคล และบันทึกข้อมูลเยี่ยมบ้านสพฐ.</p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subModules.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <Link
              key={idx}
              href={sub.href}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5 cursor-pointer text-decoration-none"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl ${sub.bgColor} ${sub.color} flex items-center justify-center`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {sub.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    {sub.description}
                  </p>
                </div>
              </div>
              <div className={`mt-5 pt-4 border-t border-slate-50 flex justify-between items-center text-xs font-bold ${sub.color}`}>
                <span>เข้าสู่ระบบ</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Security info card */}
      <div className="bg-blue-50/50 border border-blue-200/50 p-4 rounded-2xl flex gap-3 items-start text-xs font-semibold">
        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <h4 className="font-bold text-blue-800 text-[11px]">การเข้ารหัสพิกัดและความปลอดภัย</h4>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            ระบบดูแลช่วยเหลือจะทำการจัดเก็บประวัติการปรับปรุงและพิกัดตรวจสอบ GPS โดยอัตโนมัติ สอดคล้องกับมาตรฐานความปลอดภัย พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
          </p>
        </div>
      </div>

    </div>
  );
}
