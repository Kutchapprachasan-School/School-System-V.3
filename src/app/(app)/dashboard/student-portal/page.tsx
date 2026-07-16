"use client";

import { useState } from "react";
import { Star, Award, Calendar, ClipboardCheck, AlertCircle, ArrowLeft, Shield, Save, RefreshCw, Plus, Search, Trash } from "lucide-react";

interface StudentProfile {
  studentId: string;
  name: string;
  classLevel: string;
  room: string;
  avatar: string;
  gpa: string;
  behaviorScore: number;
}

const MOCK_STUDENTS: StudentProfile[] = [
  { studentId: "65001", name: "ด.ช. สมชาย รักเรียน", classLevel: "1", room: "1", avatar: "SR", gpa: "3.84", behaviorScore: 95 },
  { studentId: "65002", name: "ด.ญ. สมหญิง ใจดี", classLevel: "2", room: "2", avatar: "SJ", gpa: "3.92", behaviorScore: 100 },
  { studentId: "65003", name: "ด.ช. ธนกร วงศ์สว่าง", classLevel: "1", room: "2", avatar: "TW", gpa: "2.75", behaviorScore: 88 }
];

export default function StudentPortalPage() {
  const [selectedStudentId, setSelectedStudentId] = useState<string>("65001");
  const [activeView, setActiveView] = useState<"home" | "exam" | "timetable" | "attendance" | "behavior" | "admin">("home");
  const [adminTab, setAdminTab] = useState<"settings" | "students" | "timetable">("settings");
  const [term, setTerm] = useState("1/2569");
  const [examStatus, setExamStatus] = useState("open");

  const student = MOCK_STUDENTS.find((s) => s.studentId === selectedStudentId) || MOCK_STUDENTS[0];

  const handleSelectStudent = (val: string) => {
    if (val) {
      setSelectedStudentId(val);
      setActiveView("home");
    }
  };

  const getTimetableForStudent = () => {
    // Return sample timetable
    return [
      { period: 1, mon: "คณิตศาสตร์", tue: "วิทยาศาสตร์", wed: "ภาษาไทย", thu: "ภาษาอังกฤษ", fri: "สังคมศึกษา" },
      { period: 2, mon: "คณิตศาสตร์", tue: "วิทยาศาสตร์", wed: "ภาษาไทย", thu: "ภาษาอังกฤษ", fri: "สังคมศึกษา" },
      { period: 3, mon: "ภาษาอังกฤษ", tue: "สุขศึกษา", wed: "ศิลปศึกษา", thu: "การงานอาชีพ", fri: "พลศึกษา" },
      { period: 4, mon: "พักกลางวัน", tue: "พักกลางวัน", wed: "พักกลางวัน", thu: "พักกลางวัน", fri: "พักกลางวัน" },
      { period: 5, mon: "สังคมศึกษา", tue: "ภาษาไทย", wed: "แนะแนว", thu: "คอมพิวเตอร์", fri: "กิจกรรมพัฒนาผู้เรียน" }
    ];
  };

  return (
    <div className="space-y-6 text-slate-700">
      
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center text-violet-600 shadow-sm">
            <Star className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">สำหรับนักเรียน</h2>
            <p className="text-slate-400 text-xs mt-1 font-medium">จัดการผลการเรียน ตารางเรียน และคะแนนความประพฤติ</p>
          </div>
        </div>

        {/* Student Picker & Admin Panel Toggle */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <select
            value={selectedStudentId}
            onChange={(e) => handleSelectStudent(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-sm outline-none focus:ring-2 focus:ring-violet-200 cursor-pointer"
          >
            {MOCK_STUDENTS.map((s) => (
              <option key={s.studentId} value={s.studentId}>
                {s.name} ({s.studentId})
              </option>
            ))}
          </select>

          <button
            onClick={() => setActiveView(activeView === "admin" ? "home" : "admin")}
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-violet-600 bg-white border border-slate-200 px-4 py-2 rounded-xl hover:border-violet-300 transition shadow-sm cursor-pointer"
          >
            <Shield className="w-4 h-4" /> Admin Panel
          </button>
        </div>
      </div>

      {/* Profile Card */}
      {activeView !== "admin" && (
        <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-violet-500/10">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl font-black border-2 border-white/30">
              {student.avatar}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black leading-none">{student.name}</h3>
              <p className="text-violet-200 text-xs">
                ชั้น ม.{student.classLevel}/{student.room} | รหัสประจำตัว: {student.studentId}
              </p>
              <span className="inline-block px-2.5 py-0.5 bg-white/20 rounded-full text-[9px] font-bold border border-white/30 uppercase tracking-wider">
                นักเรียน
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main View Area */}
      {activeView === "home" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            onClick={() => setActiveView("exam")}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-rose-500 group-hover:text-white transition-all duration-350">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">ผลสอบ</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">ประกาศผลสัมฤทธิ์ทางการเรียน</p>
            </div>
          </div>

          <div
            onClick={() => setActiveView("timetable")}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-blue-500 group-hover:text-white transition-all duration-350">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">ตารางเรียน</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">ตารางประจำชั้นสัปดาห์</p>
            </div>
          </div>

          <div
            onClick={() => setActiveView("attendance")}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-emerald-500 group-hover:text-white transition-all duration-350">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">เวลาเรียน</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">สถิติการมาแถวและคาบเรียน</p>
            </div>
          </div>

          <div
            onClick={() => setActiveView("behavior")}
            className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group flex flex-col items-center text-center gap-3"
          >
            <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-amber-500 group-hover:text-white transition-all duration-350">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">พฤติกรรม</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">คะแนนและบันทึกความประพฤติ</p>
            </div>
          </div>
        </div>
      )}

      {/* TIMETABLE VIEW */}
      {activeView === "timetable" && (
        <div className="space-y-4 animate-fade-in-up">
          <button onClick={() => setActiveView("home")} className="text-xs font-bold text-slate-400 hover:text-violet-600 flex items-center gap-1.5 transition cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
          </button>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <Calendar className="w-5 h-5 text-blue-500" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">ตารางเรียนประจำภาคเรียน</h3>
                <p className="text-[10px] text-slate-400">ชั้น ม.{student.classLevel}/{student.room}</p>
              </div>
            </div>
            <div className="p-4 overflow-x-auto">
              <table className="w-full text-xs border-collapse min-w-[560px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-400 text-center font-bold">
                    <th className="p-3 border border-slate-100 w-12">คาบ</th>
                    <th className="p-3 border border-slate-100">จันทร์</th>
                    <th className="p-3 border border-slate-100">อังคาร</th>
                    <th className="p-3 border border-slate-100">พุธ</th>
                    <th className="p-3 border border-slate-100">พฤหัสบดี</th>
                    <th className="p-3 border border-slate-100">ศุกร์</th>
                  </tr>
                </thead>
                <tbody className="text-center font-semibold">
                  {getTimetableForStudent().map((row) => (
                    <tr key={row.period} className="hover:bg-slate-50/50 transition">
                      <td className="p-3 border border-slate-100 bg-slate-50 text-slate-500 font-bold">{row.period}</td>
                      <td className="p-3 border border-slate-100">{row.mon}</td>
                      <td className="p-3 border border-slate-100">{row.tue}</td>
                      <td className="p-3 border border-slate-100">{row.wed}</td>
                      <td className="p-3 border border-slate-100">{row.thu}</td>
                      <td className="p-3 border border-slate-100">{row.fri}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* EXAM VIEW */}
      {activeView === "exam" && (
        <div className="space-y-4 animate-fade-in-up">
          <button onClick={() => setActiveView("home")} className="text-xs font-bold text-slate-400 hover:text-violet-600 flex items-center gap-1.5 transition cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
          </button>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center gap-3 bg-rose-50/50">
              <Award className="w-5 h-5 text-rose-500" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">ประกาศผลการเรียนภาคเรียน</h3>
                <p className="text-[10px] text-slate-400">เทอม {term}</p>
              </div>
            </div>
            <div className="p-6 space-y-4 text-center">
              <h4 className="text-lg font-black text-slate-700">คะแนนเฉลี่ยสะสม (GPA): {student.gpa}</h4>
              <p className="text-xs text-slate-400">ผลสอบกลางภาคและปลายภาคได้รับการยืนยันผลจากวิชาการแล้ว</p>
            </div>
          </div>
        </div>
      )}

      {/* ATTENDANCE VIEW */}
      {activeView === "attendance" && (
        <div className="space-y-4 animate-fade-in-up">
          <button onClick={() => setActiveView("home")} className="text-xs font-bold text-slate-400 hover:text-violet-600 flex items-center gap-1.5 transition cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
          </button>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center">
              <p className="text-slate-400 text-[10px] font-bold">มาเรียน</p>
              <h3 className="text-xl font-bold text-emerald-600">98 วัน</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center">
              <p className="text-slate-400 text-[10px] font-bold">ลากิจ/ลาป่วย</p>
              <h3 className="text-xl font-bold text-amber-500">2 วัน</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-100 text-center">
              <p className="text-slate-400 text-[10px] font-bold">ขาดแถว</p>
              <h3 className="text-xl font-bold text-rose-500">0 วัน</h3>
            </div>
          </div>
        </div>
      )}

      {/* BEHAVIOR VIEW */}
      {activeView === "behavior" && (
        <div className="space-y-4 animate-fade-in-up">
          <button onClick={() => setActiveView("home")} className="text-xs font-bold text-slate-400 hover:text-violet-600 flex items-center gap-1.5 transition cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
          </button>
          <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col items-center justify-center gap-2">
            <p className="text-xs font-semibold text-slate-400">คะแนนความประพฤติปัจจุบัน</p>
            <h3 className="text-4xl font-black text-violet-600">{student.behaviorScore} คะแนน</h3>
            <p className="text-[10px] text-slate-400">ตัดคะแนนจากเกณฑ์เริ่มต้น 100 คะแนน</p>
          </div>
        </div>
      )}

      {/* ADMIN PANEL VIEW */}
      {activeView === "admin" && (
        <div className="space-y-4 animate-fade-in-up">
          <button onClick={() => setActiveView("home")} className="text-xs font-bold text-slate-400 hover:text-violet-600 flex items-center gap-1.5 transition cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> กลับหน้าแรกพอร์ทัล
          </button>
          <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
              <Shield className="w-5 h-5 text-violet-500" />
              <h3 className="font-bold text-slate-800 text-sm">Admin Panel – สำหรับนักเรียน</h3>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-slate-100 overflow-x-auto text-xs font-bold">
              <button
                onClick={() => setAdminTab("settings")}
                className={`px-5 py-3 border-b-2 transition cursor-pointer ${
                  adminTab === "settings"
                    ? "text-violet-600 border-violet-500"
                    : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
              >
                ตั้งค่า
              </button>
              <button
                onClick={() => setAdminTab("students")}
                className={`px-5 py-3 border-b-2 transition cursor-pointer ${
                  adminTab === "students"
                    ? "text-violet-600 border-violet-500"
                    : "text-slate-400 border-transparent hover:text-slate-600"
                }`}
              >
                นักเรียน
              </button>
            </div>

            {/* Tab content: Settings */}
            {adminTab === "settings" && (
              <div className="p-6 space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 block">ภาคเรียนปัจจุบัน</label>
                    <input
                      type="text"
                      value={term}
                      onChange={(e) => setTerm(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-200"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 block">สถานะประกาศผลสอบ</label>
                    <select
                      value={examStatus}
                      onChange={(e) => setExamStatus(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-violet-200"
                    >
                      <option value="open">เปิด (นักเรียนดูผลได้)</option>
                      <option value="closed">ปิด (ยังไม่ประกาศ)</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => alert("บันทึกการตั้งค่าพอร์ทัลนักเรียนสำเร็จ")}
                  className="bg-violet-600 hover:bg-violet-700 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition"
                >
                  <Save className="w-4 h-4" /> บันทึก
                </button>
              </div>
            )}

            {/* Tab content: Students */}
            {adminTab === "students" && (
              <div className="p-6 space-y-4 text-xs">
                <div className="flex flex-wrap gap-3">
                  <div className="flex-1 min-w-[200px] relative">
                    <input
                      type="text"
                      placeholder="ค้นหารหัส หรือ ชื่อนักเรียน..."
                      className="w-full p-2.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                  <button
                    onClick={() => alert("กำลังซิงค์และตรวจสอบรหัสนักเรียนจากทะเบียน SGS")}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer transition"
                  >
                    <RefreshCw className="w-4 h-4" /> ดึงจาก SGS
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="p-3 text-left font-bold">รหัส</th>
                        <th className="p-3 text-left font-bold">ชื่อ</th>
                        <th className="p-3 text-left font-bold">ชั้น</th>
                        <th className="p-3 text-center font-bold">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-medium">
                      {MOCK_STUDENTS.map((s) => (
                        <tr key={s.studentId} className="hover:bg-slate-50/50 transition">
                          <td className="p-3 text-slate-800 font-bold">{s.studentId}</td>
                          <td className="p-3 text-slate-700">{s.name}</td>
                          <td className="p-3 text-slate-500">ม.{s.classLevel}/{s.room}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => alert("ลบรหัสนักเรียนออกจากการเข้าพอร์ทัลชั่วคราว")}
                              className="text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white p-1 rounded transition cursor-pointer"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
