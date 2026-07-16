"use client";

import { useState } from "react";
import { Users, FileSignature, UserPlus, Check, X, ShieldAlert, Award, StarHalf, Clock, BarChart2 } from "lucide-react";

export default function HRPage() {
  const [personnelCount, setPersonnelCount] = useState(125);

  const stats = [
    { label: "บุคลากรทั้งหมด", value: "125", color: "text-blue-600", bgColor: "bg-blue-50" },
    { label: "มาปฏิบัติงาน", value: "118", color: "text-emerald-600", bgColor: "bg-emerald-50" },
    { label: "ลาปฏิบัติงาน", value: "5", color: "text-amber-500", bgColor: "bg-amber-50", borderBottom: "border-b-4 border-b-amber-400" },
    { label: "ไปราชการ", value: "2", color: "text-red-500", bgColor: "bg-red-50" }
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
    { title: "การวางแผนและการสรรหา", description: "วิเคราะห์อัตรากำลัง และขอตำแหน่งเพิ่ม", icon: UserPlus, color: "text-blue-500", bgColor: "bg-blue-50" },
    { title: "การส่งเสริมความก้าวหน้า", description: "งานวิทยฐานะ และการพัฒนาบุคลากร", icon: Award, color: "text-emerald-500", bgColor: "bg-emerald-50" },
    { title: "ประเมินและเลื่อนเงินเดือน", description: "ประเมินผลปฏิบัติงานประจำปี", icon: StarHalf, color: "text-amber-500", bgColor: "bg-amber-50" },
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
            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            ระบบบริหารงานบุคคล
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 ml-13 font-medium">จัดการข้อมูลบุคลากร การลา และประเมินผลการปฏิบัติงาน</p>
        </div>

        <div className="flex gap-2.5">
          <button className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition text-sm flex items-center gap-2 cursor-pointer">
            <FileSignature className="w-4 h-4 text-pink-500" /> รออนุมัติการลา 
            <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse ml-0.5">3</span>
          </button>
          <button className="bg-pink-600 text-white font-bold py-2 px-4 rounded-xl shadow-[0_4px_14px_rgba(219,39,119,0.3)] hover:bg-pink-700 transition text-sm flex items-center gap-2 cursor-pointer">
            <UserPlus className="w-4 h-4" /> เพิ่มบุคลากร
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col items-center justify-center relative overflow-hidden group ${stat.borderBottom || ""}`}>
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-slate-50 rounded-full group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
            <p className="text-slate-400 text-xs font-semibold mb-1 relative z-10">{stat.label}</p>
            <h3 className={`text-3xl font-black ${stat.color} relative z-10 leading-none`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Grid Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Leave requests & Main Menus */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Leave Requests */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
            <div className="p-5 px-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-sm">รายการขออนุมัติการลา</h3>
              <button className="text-xs text-blue-600 font-bold hover:text-blue-700 cursor-pointer">ประวัติการลา</button>
            </div>
            
            <div className="divide-y divide-slate-50">
              {leaveRequests.map((req) => (
                <div key={req.id} className="p-4 px-6 flex items-start sm:items-center justify-between hover:bg-slate-50 transition flex-col sm:flex-row gap-4 sm:gap-0">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 font-bold shrink-0">
                      {req.avatar}
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm gap-2 flex items-center">
                        {req.name}
                        <span className="bg-amber-50 text-amber-600 border border-amber-100 text-[9px] px-2 py-0.5 rounded-md">
                          {req.type}
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                        {req.date} ({req.days} วัน) | เหตุผล: {req.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto justify-end">
                    <button className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white transition text-[10px] font-bold border border-emerald-100 cursor-pointer">
                      อนุมัติ
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white transition text-[10px] font-bold border border-rose-100 cursor-pointer">
                      ไม่อนุมัติ
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submodules Menu */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {submodules.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] text-center hover:shadow-md hover:border-blue-200 transition cursor-pointer group"
                  onClick={() => alert(`โมดูล "${sub.title}" อยู่ในขั้นพิจารณาโครงงานบุคคลสพฐ.`)}
                >
                  <div className={`w-10 h-10 ${sub.bgColor} ${sub.color} rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-pink-600 group-hover:text-white transition`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs mt-1">{sub.title}</h4>
                  <p className="text-[9px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{sub.description}</p>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Side: Composition chart */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] p-6 space-y-5">
          <h3 className="font-bold text-slate-800 text-sm">สัดส่วนบุคลากร</h3>
          <div className="space-y-4">
            {composition.map((comp, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>{comp.label} ({comp.count})</span>
                  <span>{comp.percent}</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className={`${comp.color} h-full rounded-full`} style={{ width: comp.percent }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
