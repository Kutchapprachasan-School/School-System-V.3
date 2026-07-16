"use client";

import { useState } from "react";
import { GraduationCap, Calendar, Plus, Users, Award, AlertCircle, Clock, BookOpen, Layers, CheckCircle2, ChevronRight } from "lucide-react";

export default function AcademicPage() {
  const [academicYear, setAcademicYear] = useState("2566");

  const stats = [
    { label: "นักเรียนทั้งหมด", value: "2,450", trend: "+12 คน จากปีที่แล้ว", trendUp: true, icon: Users, bgColor: "bg-blue-100", textColor: "text-blue-600" },
    { label: "เกรดเฉลี่ยโรงเรียน", value: "2.84", trend: "+0.05 เทอมก่อน", trendUp: true, icon: Award, bgColor: "bg-emerald-100", textColor: "text-emerald-600" },
    { label: "รออนุมัติผลการเรียน", value: "14 วิชา", trend: "ต้องตรวจสอบด่วน", trendUp: false, icon: AlertCircle, bgColor: "bg-amber-100", textColor: "text-amber-600", borderLeft: "border-l-4 border-l-amber-400" },
    { label: "ห้องเรียนที่สอน", value: "62", trend: "340 คาบ/สัปดาห์", trendUp: true, icon: Clock, bgColor: "bg-purple-100", textColor: "text-purple-600" }
  ];

  const submodules = [
    { title: "ระบบส่งงาน", description: "ส่งแผนการจัดการเรียนรู้, งานวิจัย, และบันทึกหลังสอน", icon: CheckCircle2, color: "text-sky-500", bgColor: "bg-sky-50", pill: "เปิดระบบ" },
    { title: "จัดตารางสอน", description: "บริหารจัดการรายวิชา, หน่วยกิต, และตารางคาบเรียน", icon: Calendar, color: "text-emerald-500", bgColor: "bg-emerald-50" },
    { title: "เช็คชื่อนักเรียน", description: "เช็คการมาเรียน, วันลา, และการเข้าเรียนรายคาบตามตาราง", icon: Clock, color: "text-rose-500", bgColor: "bg-rose-50", pill: "อัปเดตวันนี้" },
    { title: "งานทะเบียนวัดผล", description: "บันทึกคะแนนเก็บ, ตัดเกรด, และจัดทำเอกสาร ปพ. ต่างๆ", icon: BookOpen, color: "text-indigo-500", bgColor: "bg-indigo-50" },
    { title: "ระบบสอบ", description: "จัดการคลังข้อสอบ, พิมพ์ข้อสอบ, และกำหนดตารางสอบ", icon: Award, color: "text-purple-500", bgColor: "bg-purple-50" },
    { title: "หลักสูตร", description: "จัดการโครงสร้างหลักสูตรสถานศึกษาและกลุ่มสาระการเรียนรู้", icon: Layers, color: "text-amber-500", bgColor: "bg-amber-50" }
  ];

  return (
    <div className="space-y-6 text-slate-700">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            ระบบบริหารงานวิชาการ
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 ml-13">จัดการผลการเรียน จัดตารางสอน และงานทะเบียนวัดผล</p>
        </div>

        <div className="flex gap-2.5">
          <button className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition text-sm flex items-center gap-2 cursor-pointer">
            <Calendar className="w-4 h-4 text-blue-500" /> ปีการศึกษา {academicYear}
          </button>
          <button className="bg-blue-600 text-white font-bold py-2 px-4 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:bg-blue-700 transition text-sm flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> เพิ่มภาระงาน
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between relative overflow-hidden group ${stat.borderLeft || ""}`}>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-slate-50 rounded-full group-hover:scale-125 transition-transform duration-500 opacity-60 pointer-events-none" />
              <div className="relative z-10 space-y-1">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">{stat.value}</h3>
                <p className="text-[10px] text-slate-400 font-semibold">{stat.trend}</p>
              </div>
              <div className={`w-11 h-11 rounded-full ${stat.bgColor} ${stat.textColor} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {submodules.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5 cursor-pointer"
              onClick={() => alert(`โมดูล "${sub.title}" กำลังรวบรวมข้อมูลโครงสร้างงานสพฐ.`)}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`w-14 h-14 rounded-2xl ${sub.bgColor} ${sub.color} flex items-center justify-center text-xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-300`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {sub.pill && (
                    <span className="bg-sky-100 text-sky-600 text-[9px] font-bold px-2 py-0.5 rounded-md animate-pulse">
                      {sub.pill}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {sub.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {sub.description}
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400 group-hover:text-blue-600 transition-colors">
                <span>เข้าสู่ระบบงาน</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
