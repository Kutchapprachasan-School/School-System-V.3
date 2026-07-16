"use client";

import { useState } from "react";
import { Megaphone, QrCode, ClipboardList, Clock, ShieldAlert, Award, FileText, ChevronRight, User, List } from "lucide-react";

export default function StudentCouncilPage() {
  const stats = [
    { label: "มาสายวันนี้", value: "45 คน", color: "text-rose-600", bgColor: "bg-rose-50", icon: Clock },
    { label: "ขาดแถวหน้าเสาธง", value: "12 คน", color: "text-amber-500", bgColor: "bg-amber-50", icon: ShieldAlert },
    { label: "ทำความดี/จิตอาสา", value: "8 รายการ", color: "text-emerald-600", bgColor: "bg-emerald-50", icon: Award, trend: "รอส่งต่อฝ่ายกิจการฯ" },
    { label: "รายงานเวร", value: "รอยืนยัน", color: "text-slate-800", bgColor: "bg-orange-50/30", icon: FileText, borderLeft: "border-l-4 border-l-orange-400" }
  ];

  const submodules = [
    { title: "เช็คคนมาสาย (เวรประตู)", description: "สแกนบัตรนักเรียน บันทึกชื่อคนมาสายหลังเวลา 07:45 น.", icon: Clock, color: "text-rose-500", bgColor: "bg-rose-50", textAction: "บันทึกการมาสาย" },
    { title: "เช็คแถวหน้าเสาธง", description: "บันทึกยอด นร. ที่เข้าแถว ขาดแถว โดยประธานสี/หัวหน้าห้อง", icon: Megaphone, color: "text-indigo-500", bgColor: "bg-indigo-50", textAction: "บันทึกแถว" },
    { title: "ตรวจเขตรับผิดชอบ", description: "ประเมินความสะอาดเขตสีและห้องเรียนประจำวัน", icon: ClipboardList, color: "text-teal-500", bgColor: "bg-teal-50", textAction: "ประเมินเขต" }
  ];

  const recentRecords = [
    { name: "ด.ช. ธนกร มนตรี", room: "ม.2/3", id: "64123", recorder: "นายสภา นักเรียนดี", time: "08:15 น.", gate: "ประตู 1" },
    { name: "ด.ญ. สุชาดา รักเรียน", room: "ม.5/1", id: "61004", recorder: "น.ส.กรรมการ เวรเช้า", time: "08:05 น.", gate: "ประตู 2" }
  ];

  return (
    <div className="space-y-6 text-slate-700">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
              <Megaphone className="w-5 h-5" />
            </div>
            ระบบงานสภานักเรียน
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 ml-13 font-medium">บันทึกเวรประจำวัน เช็คชื่อหน้าเสาธง และบำเพ็ญประโยชน์</p>
        </div>

        <div className="flex gap-2.5">
          <button className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition text-sm flex items-center gap-2 cursor-pointer" onClick={() => alert("ระบบเปิดใช้กล้องสแกนคิวอาร์โค้ดแล้ว")}>
            <QrCode className="w-4 h-4 text-orange-500" /> สแกนบาร์โค้ด
          </button>
          <button className="bg-orange-600 text-white font-bold py-2 px-4 rounded-xl shadow-[0_4px_14px_rgba(234,88,12,0.3)] hover:bg-orange-700 transition text-sm flex items-center gap-2 cursor-pointer" onClick={() => alert("ระบบบันทึกเวรเช้าพร้อมเปิดใช้งาน")}>
            <ClipboardList className="w-4 h-4" /> บันทึกเวรเช้า
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between relative overflow-hidden group ${stat.borderLeft || ""}`}>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-50 rounded-full group-hover:scale-125 transition-transform duration-500 opacity-60 pointer-events-none" />
              <div className="relative z-10 space-y-1">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{stat.label}</p>
                <h3 className={`text-xl font-bold ${stat.color} leading-none`}>{stat.value}</h3>
                {stat.trend && <p className="text-[9px] text-slate-400 font-semibold">{stat.trend}</p>}
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                <Icon className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid Menu Submodules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {submodules.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5 cursor-pointer"
              onClick={() => alert(`ระบบจะทำการเปิดหน้าการทำงาน "${sub.title}"`)}
            >
              <div className="space-y-4">
                <div className={`w-14 h-14 rounded-2xl ${sub.bgColor} ${sub.color} flex items-center justify-center text-xl group-hover:bg-orange-500 group-hover:text-white transition-all duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-800 group-hover:text-orange-600 transition-colors">
                    {sub.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    {sub.description}
                  </p>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex justify-between items-center text-xs font-bold text-slate-400 group-hover:text-orange-600 transition-colors">
                <span>{sub.textAction}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden max-w-4xl mx-auto">
        <div className="p-5 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 text-sm">ประวัติบันทึกมาสายล่าสุด (วันนี้)</h3>
          <span className="text-[10px] text-slate-400 font-medium">อัปเดตเมื่อสักครู่</span>
        </div>

        <div className="divide-y divide-slate-50">
          {recentRecords.map((rec, idx) => (
            <div key={idx} className="p-4 px-6 flex justify-between items-center hover:bg-slate-50 transition">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{rec.name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {rec.room} | รหัส: {rec.id} | ผู้บันทึก: {rec.recorder}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <span className="bg-rose-100 text-rose-700 text-[10px] px-2.5 py-0.5 rounded-md font-bold block">
                  {rec.time}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{rec.gate}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-slate-50 text-center border-t border-slate-100 text-xs">
          <button className="text-orange-600 font-bold hover:text-orange-700 cursor-pointer" onClick={() => alert("กำลังเข้าสู่รายการประวัติสภานักเรียนย้อนหลัง")}>
            ดูรายการทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
}
