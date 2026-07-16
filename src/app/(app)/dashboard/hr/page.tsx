"use client";

import { useState } from "react";
import { Users, FileSignature, UserPlus, Check, X, ShieldAlert, Award, Star, Clock, BarChart2, ArrowRight } from "lucide-react";

export default function HRPage() {
  const [personnelCount, setPersonnelCount] = useState(125);

  const stats = [
    { label: "บุคลากรทั้งหมด", value: "125", trend: "อัตรากำลังคนสะสม", trendUp: true, icon: Users, bgColor: "bg-blue-50 text-blue-500" },
    { label: "มาปฏิบัติงานวันนี้", value: "118", trend: "คิดเป็น 94.4%", trendUp: true, icon: Check, bgColor: "bg-emerald-50 text-emerald-500" },
    { label: "ลากิจ/ลาป่วย", value: "5 คน", trend: "รออนุมัติใบลา 2 ราย", trendUp: false, icon: Clock, bgColor: "bg-amber-50 text-amber-500", borderLeft: "border-l-4 border-l-amber-500" },
    { label: "ไปราชการภายนอก", value: "2 คน", trend: "พัฒนาบุคลากรสพฐ.", trendUp: true, icon: FileSignature, bgColor: "bg-purple-50 text-purple-500" }
  ];

  const leaveRequests = [
    {
      id: "1",
      name: "นายสมศักดิ์ รักชาติ",
      type: "ลาป่วย",
      date: "15 ม.ค. 67",
      days: 1,
      reason: "ไข้หวัดใหญ่",
      avatar: "S"
    },
    {
      id: "2",
      name: "นางวันทนี ศรีสวัสดิ์",
      type: "ลากิจส่วนตัว",
      date: "18-19 ม.ค. 67",
      days: 2,
      reason: "ติดต่อราชการต่างจังหวัด",
      avatar: "W"
    }
  ];

  const submodules = [
    { title: "วางแผนและสรรหา", description: "วิเคราะห์อัตรากำลัง และขอตำแหน่งเพิ่ม", icon: UserPlus, color: "text-blue-500", bgColor: "bg-blue-50" },
    { title: "ส่งเสริมความก้าวหน้า", description: "งานวิทยฐานะ และการพัฒนาบุคลากร", icon: Award, color: "text-emerald-500", bgColor: "bg-emerald-50" },
    { title: "ประเมินและเลื่อนขั้น", description: "ประเมินผลปฏิบัติงานประจำปีตามขั้นตอน", icon: Star, color: "text-amber-500", bgColor: "bg-amber-50" },
    { title: "วินัยและสวัสดิการ", description: "ระบบลงเวลาปฏิบัติงานออนไลน์และเวรยาม", icon: Clock, color: "text-purple-500", bgColor: "bg-purple-50" }
  ];

  const composition = [
    { label: "ข้าราชการครู", count: 85, percent: "68%", color: "bg-blue-500" },
    { label: "ครูอัตราจ้าง", count: 20, percent: "16%", color: "bg-pink-500" },
    { label: "พนักงานราชการ", count: 10, percent: "8%", color: "bg-amber-500" },
    { label: "ธุรการ/สนับสนุน", count: 10, percent: "8%", color: "bg-purple-500" }
  ];

  return (
    <div className="space-y-6 text-slate-700">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            ระบบบริหารงานบุคคล
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 ml-13 font-semibold">จัดการข้อมูลบุคลากร การลา และประเมินผลการปฏิบัติงาน</p>
        </div>

        <div className="flex gap-2.5">
          <button className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition text-xs flex items-center gap-2 cursor-pointer">
            <FileSignature className="w-4 h-4 text-pink-500" /> รออนุมัติการลา 
            <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.5 rounded-full animate-pulse ml-0.5 font-bold">3</span>
          </button>
          <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-xl shadow-sm transition text-xs flex items-center gap-2 cursor-pointer">
            <UserPlus className="w-4 h-4" /> เพิ่มบุคลากร
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
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

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Leave requests & Main Menus */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Leave Requests */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
            <div className="p-5 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-xs">รายการขออนุมัติการลา</h3>
              <button className="text-xs text-blue-600 font-bold hover:text-blue-500 cursor-pointer transition">
                ประวัติการลา
              </button>
            </div>
            
            <div className="divide-y divide-slate-50 p-6 space-y-4">
              {leaveRequests.map((req) => (
                <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 font-bold text-xs flex items-center justify-center border border-slate-300">
                      {req.avatar}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-slate-800 text-xs">{req.name}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">ประเภท: {req.type} | จำนวน: {req.days} วัน ({req.date})</p>
                      <p className="text-[10px] text-slate-500">เหตุผล: {req.reason}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => alert("อนุมัติคำขอการลา")} className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition shadow-sm cursor-pointer">
                      อนุมัติ
                    </button>
                    <button onClick={() => alert("ปฏิเสธคำขอการลา")} className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-[10px] font-bold px-3 py-1.5 rounded-lg transition cursor-pointer">
                      ปฏิเสธ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submodule grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {submodules.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col justify-between group hover:-translate-y-0.5 cursor-pointer">
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
                    <span>เข้าสู่ระบบ</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Personnel Composition */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-6">
            <h3 className="font-bold text-slate-800 text-xs">สัดส่วนประเภทบุคลากร</h3>
            <div className="space-y-4">
              {composition.map((item, idx) => (
                <div key={idx} className="space-y-1.5 text-xs font-semibold">
                  <div className="flex justify-between text-slate-600">
                    <span>{item.label} ({item.count} คน)</span>
                    <span className="font-bold text-slate-800">{item.percent}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${item.color} h-full rounded-full`} style={{ width: item.percent }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
