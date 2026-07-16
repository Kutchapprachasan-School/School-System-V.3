"use client";

import { useState } from "react";
import { Coins, FileText, Plus, Wallet, TrendingUp, TrendingDown, ChevronRight, BarChart2, DollarSign, Package, ShieldCheck, List, ArrowRight } from "lucide-react";

export default function BudgetPage() {
  const [fiscalYear, setFiscalYear] = useState("2567");

  const recentProjects = [
    { name: "ซื้อกระดาษ A4 ประจำเดือน ม.ค.", dept: "ฝ่ายวิชาการ", budget: "15,000.00", status: "รอตรวจสอบงบ", statusColor: "bg-amber-100 text-amber-700" },
    { name: "จ้างเหมาปรับปรุงระบบอินเตอร์เน็ต", dept: "ฝ่ายบริหารทั่วไป", budget: "45,500.00", status: "กำลังดำเนินการ", statusColor: "bg-blue-100 text-blue-700" },
    { name: "ซื้ออุปกรณ์กีฬา", dept: "หมวดพลศึกษา", budget: "8,200.00", status: "อนุมัติแล้ว", statusColor: "bg-emerald-100 text-emerald-700", approved: true }
  ];

  const submodules = [
    { title: "งานวางแผนฯ", description: "จัดทำแผนปฏิบัติการประจำปี และเสนอของบประมาณ", icon: BarChart2, color: "text-blue-500", bgColor: "bg-blue-50" },
    { title: "งานการเงินและบัญชี", description: "บริหารการเงิน รับ-จ่าย และจัดทำบัญชีรายได้โรงเรียน", icon: DollarSign, color: "text-emerald-500", bgColor: "bg-emerald-50" },
    { title: "งานพัสดุและสินทรัพย์", description: "จัดซื้อจัดจ้าง ทะเบียนคุมพัสดุ และจำหน่ายพัสดุชำรุด", icon: Package, color: "text-amber-500", bgColor: "bg-amber-50" },
    { title: "งานตรวจสอบฯ", description: "ตรวจสอบภายใน และรับบริจาคระดมทุน (Edonation)", icon: ShieldCheck, color: "text-purple-500", bgColor: "bg-purple-50" }
  ];

  return (
    <div className="space-y-6 text-slate-700">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-xl flex items-center justify-center shadow-sm">
              <Coins className="w-5 h-5" />
            </div>
            ระบบบริหารงบประมาณ
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 ml-13 font-semibold">บัญชีเบิกจ่าย อาหารกลางวัน และระบบพัสดุ</p>
        </div>

        <div className="flex gap-2.5">
          <button className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition text-xs flex items-center gap-2 cursor-pointer">
            <FileText className="w-4 h-4 text-yellow-500" /> ออกรายงาน
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition text-xs flex items-center gap-2 cursor-pointer">
            <Plus className="w-4 h-4" /> ขอรับการจัดสรร
          </button>
        </div>
      </div>

      {/* Financial Stats Group */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden flex flex-col justify-between min-h-[180px]">
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/20 rounded-full blur-2xl transform -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl transform translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex justify-between items-start">
              <p className="text-slate-300 font-bold text-[10px] uppercase tracking-wider">ยอดยกมา / เงินคงเหลือ</p>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <Wallet className="w-4 h-4 text-yellow-400" />
              </div>
            </div>

            <h3 className="text-3xl font-black mt-2 leading-none">
              1,450,200<span className="text-lg font-bold text-slate-400">.00</span>
            </h3>
            <p className="text-[9px] text-yellow-400 font-bold uppercase tracking-wider">บาท (THB)</p>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex justify-between text-[10px] font-bold text-slate-300">
            <span>บัญชีโรงเรียน กทม.</span>
            <span>ปีงบประมาณ {fiscalYear}</span>
          </div>
        </div>

        {/* Double Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-center gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">เงินอุดหนุนรับเข้า</h4>
            </div>
            <h3 className="text-2xl font-black text-slate-800 leading-tight">
              850,000<span className="text-sm font-medium text-slate-400">.00</span>
            </h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "75%" }} />
            </div>
            <p className="text-[9px] text-slate-400 text-right font-bold">ได้รับแล้ว 75% ของแผน</p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col justify-center gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">เบิกจ่ายสะสม</h4>
            </div>
            <h3 className="text-2xl font-black text-slate-800 leading-tight">
              423,500<span className="text-sm font-medium text-slate-400">.00</span>
            </h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1 overflow-hidden">
              <div className="bg-rose-500 h-full rounded-full" style={{ width: "32%" }} />
            </div>
            <p className="text-[9px] text-slate-400 text-right font-bold">เบิกจ่ายไปแล้ว 32% ของงบ</p>
          </div>
        </div>
      </div>

      {/* Grid Submodules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {submodules.map((sub, idx) => {
          const Icon = sub.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${sub.bgColor} ${sub.color} flex items-center justify-center`}>
                  <Icon className="w-5.5 h-5.5" />
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
                <span>ตรวจสอบข้อมูล</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Procurement Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-5 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm">
            <List className="w-4 h-4 text-yellow-500" /> โครงการรอจัดซื้อจัดจ้าง
          </h3>
          <button className="text-xs bg-white border border-slate-200 font-bold px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition cursor-pointer">
            ดูทั้งหมด
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-100 font-bold">
              <tr>
                <th className="px-6 py-3.5">ชื่อโครงการ / รายการ</th>
                <th className="px-6 py-3.5">ผู้ขอเบิก</th>
                <th className="px-6 py-3.5 text-right">งบประมาณ (บาท)</th>
                <th className="px-6 py-3.5 text-center">สถานะ</th>
                <th className="px-6 py-3.5 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
              {recentProjects.map((proj, idx) => (
                <tr key={idx} className={`hover:bg-slate-50/50 transition ${proj.approved ? "opacity-60" : ""}`}>
                  <td className="px-6 py-4 font-bold text-slate-800">{proj.name}</td>
                  <td className="px-6 py-4 text-slate-400 font-medium">{proj.dept}</td>
                  <td className="px-6 py-4 font-bold text-slate-800 text-right">{proj.budget}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${proj.statusColor}`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button className="text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white px-2 py-1 rounded transition text-[9px] font-bold cursor-pointer">
                      {proj.approved ? "ดูเอกสาร" : "ตรวจสอบ"}
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
