"use client";

import { useState } from "react";
import { GraduationCap, Calendar, Plus, Users, Award, AlertCircle, Clock, BookOpen, Layers, CheckSquare, ShieldCheck, Play, ArrowRight, Eye } from "lucide-react";

export default function AcademicPage() {
  const [academicYear, setAcademicYear] = useState("2566");

  const stats = [
    { label: "นักเรียนทั้งหมด", value: "2,450", trend: "+12 คน จากปีที่แล้ว", trendUp: true, icon: Users, bgColor: "bg-blue-50 text-blue-500" },
    { label: "เกรดเฉลี่ยโรงเรียน", value: "2.84", trend: "+0.05 เทอมก่อน", trendUp: true, icon: Award, bgColor: "bg-emerald-50 text-emerald-500" },
    { label: "รออนุมัติผลการเรียน", value: "14 วิชา", trend: "ต้องตรวจสอบด่วน", trendUp: false, icon: AlertCircle, bgColor: "bg-amber-50 text-amber-500", borderLeft: "border-l-4 border-l-amber-500" },
    { label: "ห้องเรียนที่สอน", value: "62", trend: "340 คาบ/สัปดาห์", trendUp: true, icon: Clock, bgColor: "bg-purple-50 text-purple-500" }
  ];

  const submodules = [
    { title: "ระบบส่งงาน", description: "ส่งแผนการจัดการเรียนรู้, งานวิจัย, และบันทึกหลังสอน", icon: CheckSquare, color: "text-blue-500", bgColor: "bg-blue-50", pill: "เปิดระบบ", pillColor: "bg-blue-50 text-blue-600 border border-blue-100", linkText: "เข้าสู่ระบบ" },
    { title: "จัดตารางสอน", description: "บริหารจัดการรายวิชา, หน่วยกิต, และตารางคาบเรียน", icon: Calendar, color: "text-emerald-500", bgColor: "bg-emerald-50", linkText: "จัดการตาราง" },
    { title: "เช็คชื่อนักเรียน", description: "เช็คการมาเรียน, วันลา, และการเข้าเรียนรายคาบตามตาราง", icon: Clock, color: "text-rose-500", bgColor: "bg-rose-50", pill: "อัปเดตวันนี้", pillColor: "bg-rose-50 text-rose-600 border border-rose-100", linkText: "บันทึกการเข้าเรียน" },
    { title: "งานทะเบียนวัดผล", description: "บันทึกคะแนนเก็บ, ตัดเกรด, และจัดทำเอกสาร ปพ. ต่างๆ", icon: BookOpen, color: "text-indigo-500", bgColor: "bg-indigo-50", linkText: "ระบบวัดผล" },
    { title: "ระบบสอบ", description: "จัดการคลังข้อสอบ, พิมพ์ข้อสอบ, และกำหนดตารางสอบ", icon: Award, color: "text-purple-500", bgColor: "bg-purple-50", linkText: "จัดการสอบ" },
    { title: "หลักสูตรสถานศึกษา", description: "จัดการโครงสร้างหลักสูตร, แผนการเรียน, และหน่วยกิต", icon: Layers, color: "text-amber-500", bgColor: "bg-amber-50", linkText: "จัดการหลักสูตร" },
    { title: "นิเทศการสอน", description: "บันทึกผลการนิเทศ, ติดตามการสอน, และประเมิน", icon: ShieldCheck, color: "text-teal-500", bgColor: "bg-teal-50", pill: "เปิดให้ประเมิน", pillColor: "bg-teal-50 text-teal-600 border border-teal-100", linkText: "ระบบนิเทศ" }
  ];

  const approvalList = [
    { id: 1, class: "ม.1/1", subject: "คณิตศาสตร์พื้นฐาน (ค21101)", teacher: "ครูสมยศ รักเรียน", status: "pending", statusLabel: "รออนุมัติ", date: "2026-07-16" },
    { id: 2, class: "ม.3/2", subject: "ภาษาอังกฤษ (อ23101)", teacher: "ครูสมศรี วิทยฐานะ", status: "pending", statusLabel: "รออนุมัติ", date: "2026-07-16" },
    { id: 3, class: "ม.6/4", subject: "ฟิสิกส์เพิ่มเติม (ว30201)", teacher: "ครูประสงค์ คิดดี", status: "approved", statusLabel: "อนุมัติแล้ว", date: "2026-07-15" },
    { id: 4, class: "ม.2/3", subject: "ศิลปะพื้นฐาน (ศ22101)", teacher: "ครูมณี ร้องรำ", status: "approved", statusLabel: "อนุมัติแล้ว", date: "2026-07-14" }
  ];

  return (
    <div className="space-y-6 text-slate-700">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shadow-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            ระบบบริหารงานวิชาการ
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 ml-13 font-semibold">จัดการผลการเรียน จัดตารางสอน และงานทะเบียนวัดผล</p>
        </div>

        <div className="flex gap-2.5">
          <button className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition text-xs flex items-center gap-2 cursor-pointer">
            <Calendar className="w-4 h-4 text-blue-500" /> ปีการศึกษา {academicYear}
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition text-xs flex items-center gap-2 cursor-pointer">
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
                <h3 className="text-2xl font-black text-slate-800 leading-tight">{stat.value}</h3>
                <p className="text-[10px] text-slate-400 font-bold">{stat.trend}</p>
              </div>
              <div className={`w-11 h-11 rounded-full ${stat.bgColor} flex items-center justify-center`}>
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
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className={`w-12 h-12 rounded-2xl ${sub.bgColor} ${sub.color} flex items-center justify-center`}>
                    <Icon className="w-5.5 h-5.5" />
                  </div>
                  {sub.pill && (
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded ${sub.pillColor}`}>
                      {sub.pill}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 leading-tight">
                    {sub.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    {sub.description}
                  </p>
                </div>
              </div>
              <div className={`mt-5 pt-4 border-t border-slate-50 flex justify-between items-center text-xs font-bold ${sub.color}`}>
                <span>{sub.linkText}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Approval Section */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-sm font-bold text-slate-800">รายการอนุมัติผลการเรียน</h3>
          <button className="text-xs text-blue-600 hover:text-blue-500 font-bold cursor-pointer transition">
            ดูทั้งหมด
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-100 font-bold">
              <tr>
                <th className="px-6 py-3.5">ชั้นเรียน</th>
                <th className="px-6 py-3.5">วิชาที่ขออนุมัติ</th>
                <th className="px-6 py-3.5">ผู้ยื่นคำขอ</th>
                <th className="px-6 py-3.5 text-center">สถานะ</th>
                <th className="px-6 py-3.5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
              {approvalList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{item.class}</td>
                  <td className="px-6 py-4">{item.subject}</td>
                  <td className="px-6 py-4 text-slate-400 font-medium">{item.teacher}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      item.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {item.statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => alert(`ดูข้อมูลเกรดของวิชา ${item.subject}`)}
                      className="text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white px-2 py-1 rounded transition text-[9px] font-bold cursor-pointer"
                    >
                      ตรวจสอบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
