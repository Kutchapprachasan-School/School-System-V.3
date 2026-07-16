"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building, Users, Home, Mail, ShieldAlert, ArrowRight, Calendar, Heart, Award, Landmark, School, HelpCircle } from "lucide-react";

export default function GeneralDashboardPage() {
  const router = useRouter();
  const [academicYear, setAcademicYear] = useState("2567");

  const stats = [
    { label: "นักเรียนทั้งหมด", value: "1,250", trend: "ในความดูแลของโรงเรียน", icon: Users, bgColor: "bg-teal-50 text-teal-600" },
    { label: "เยี่ยมบ้านนักเรียนแล้ว", value: "320 คน", trend: "ค้างดำเนินงาน 930 คน", icon: Home, bgColor: "bg-amber-50 text-amber-500", borderLeft: "border-l-4 border-l-amber-500" },
    { label: "หนังสือราชการลงรับ", value: "125 ฉบับ", trend: "หนังสือรอดำเนินการ 5", icon: Mail, bgColor: "bg-blue-50 text-blue-500" },
    { label: "บันทึกพฤติกรรมวันนี้", value: "82 รายการ", trend: "หักคะแนน 12, จิตอาสา 70", icon: ShieldAlert, bgColor: "bg-indigo-50 text-indigo-500" }
  ];

  const submodules = [
    {
      title: "งานสารบรรณ",
      description: "รับ-ส่งหนังสือราชการ บันทึกข้อความ คำสั่ง ประกาศ เกียรติบัตร",
      icon: Mail,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      pill: "พร้อมใช้งาน",
      pillColor: "bg-blue-50 text-blue-600 border border-blue-100",
      href: "/dashboard/general/document"
    },
    {
      title: "ระบบดูแลช่วยเหลือ",
      description: "เยี่ยมบ้านนักเรียน คัดกรองข้อมูลครอบครัว และบันทึกประวัติการช่วยเหลือ",
      icon: Home,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      pill: "พร้อมใช้งาน",
      pillColor: "bg-amber-50 text-amber-600 border border-amber-100",
      href: "/dashboard/general/student-care"
    },
    {
      title: "กิจการนักเรียน",
      description: "คะแนนความประพฤติ หักคะแนนความประพฤติ บันทึกทำความดี จิตอาสา",
      icon: ShieldAlert,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      pill: "พร้อมใช้งาน",
      pillColor: "bg-indigo-50 text-indigo-600 border border-indigo-100",
      href: "/dashboard/general/student-affairs"
    },
    {
      title: "ประชาสัมพันธ์",
      description: "เผยแพร่ข้อมูลข่าวสาร กิจกรรมภายในโรงเรียน และข่าวสารเด่นเพื่อสังคม",
      icon: Award,
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      href: "#"
    },
    {
      title: "รับสมัครนักเรียน",
      description: "ข้อมูลพื้นที่บริการ สถิติการสมัคร เอกสารมอบตัว และขึ้นทะเบียนผู้เรียนใหม่",
      icon: School,
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      href: "#"
    },
    {
      title: "โภชนาการและอนามัย",
      description: "ดูแลโรงอาหาร น้ำดื่มสะอาด การตรวจสุขภาพนักเรียนรายบุคคล และห้องพยาบาล",
      icon: Heart,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      href: "#"
    },
    {
      title: "อาคารสถานที่",
      description: "ดูแลทำความสะอาด ซ่อมแซมระบบไฟฟ้า ปรับปรุงห้องเรียนและภูมิทัศน์",
      icon: Building,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      href: "#"
    },
    {
      title: "ความสัมพันธ์ชุมชน",
      description: "ประสานงานร่วมกับบุคคลภายนอก สมาคมผู้ปกครอง และหน่วยงานเครือข่าย",
      icon: Landmark,
      color: "text-teal-500",
      bgColor: "bg-teal-50",
      href: "#"
    }
  ];

  const handleCardClick = (sub: typeof submodules[0]) => {
    if (sub.href === "#") {
      alert(`ระบบงาน "${sub.title}" อยู่ในระหว่างดำเนินการซิงค์ตามมาตรฐานสพฐ.`);
    } else {
      router.push(sub.href);
    }
  };

  return (
    <div className="space-y-6 text-slate-700">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center shadow-sm">
              <Building className="w-5 h-5" />
            </div>
            ระบบบริหารงานทั่วไป
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 ml-13 font-semibold">จัดการงานธุรการ ดูแลนักเรียน และงานสารบรรณโรงเรียน</p>
        </div>

        <div className="flex gap-2.5">
          <button className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition text-xs flex items-center gap-2 cursor-pointer">
            <Calendar className="w-4 h-4 text-teal-500" /> ปีการศึกษา {academicYear}
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
              onClick={() => handleCardClick(sub)}
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
                <span>เข้าสู่ระบบ</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
