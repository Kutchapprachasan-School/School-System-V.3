"use client";

import { useState } from "react";
import { ArrowLeft, ShieldAlert, Award, Star, Search, Plus, Calendar, Eye } from "lucide-react";
import Link from "next/link";

interface BehaviorRecord {
  id: string;
  studentName: string;
  class: string;
  type: "merit" | "demerit";
  action: string;
  points: number;
  date: string;
  reporter: string;
}

const INITIAL_RECORDS: BehaviorRecord[] = [
  {
    id: "1",
    studentName: "เด็กชายสมชาย ใจดี",
    class: "ม.2/1",
    type: "merit",
    action: "ช่วยทำความสะอาดและกวาดใบไม้บริเวณลานอเนกประสงค์หลังเลิกแถว",
    points: 10,
    date: "2569-07-16",
    reporter: "ครูสมปอง ทดสอบ"
  },
  {
    id: "2",
    studentName: "เด็กหญิงสมศรี ดีเลิศ",
    class: "ม.3/2",
    type: "merit",
    action: "เก็บกระเป๋าเงินได้และส่งคืนเจ้าของผ่านประชาสัมพันธ์โรงเรียน",
    points: 20,
    date: "2569-07-16",
    reporter: "ครูวันทนี ศรีสวัสดิ์"
  },
  {
    id: "3",
    studentName: "เด็กชายเกเร ดื้อรั้น",
    class: "ม.1/2",
    type: "demerit",
    action: "หลบเลี่ยงไม่เข้าร่วมกิจกรรมเข้าแถวเคารพธงชาติโดยไม่มีเหตุจำเป็น",
    points: -5,
    date: "2569-07-15",
    reporter: "เวรประจำวัน"
  }
];

export default function StudentAffairsPage() {
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");

  const filteredRecords = INITIAL_RECORDS.filter((rec) => {
    const matchesSearch = rec.studentName.toLowerCase().includes(search.toLowerCase()) || rec.class.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType ? rec.type === filterType : true;
    return matchesSearch && matchesType;
  });

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
              <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center shadow-sm">
                <ShieldAlert className="w-5 h-5" />
              </div>
              ระบบงานกิจการนักเรียน
            </h2>
            <p className="text-slate-500 text-sm mt-1.5 ml-13 font-semibold">บันทึกคะแนนความประพฤติ หักคะแนนความประพฤติ และความดีจิตอาสา</p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition text-xs flex items-center gap-2 cursor-pointer">
            <Calendar className="w-4 h-4 text-indigo-500" /> ปีการศึกษา 2567
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">บันทึกความดีสะสม</p>
            <h3 className="text-2xl font-black text-slate-800">128 รายการ</h3>
            <p className="text-[10px] text-emerald-500 font-bold">+15 วันนี้</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">ตัดคะแนนพฤติกรรม</p>
            <h3 className="text-2xl font-black text-slate-800">8 รายการ</h3>
            <p className="text-[10px] text-rose-500 font-bold">รอตรวจสอบ 1 ราย</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">เกียรติบัตรความดี</p>
            <h3 className="text-2xl font-black text-slate-800">45 รายการ</h3>
            <p className="text-[10px] text-blue-500 font-bold">ออกแล้วภาคเรียนนี้</p>
          </div>
          <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Star className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="ค้นหาชื่อนักเรียน หรือ ชั้นเรียน..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-xs font-semibold"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-bold outline-none cursor-pointer min-w-[140px]"
        >
          <option value="">ประเภททั้งหมด</option>
          <option value="merit">บันทึกความดี (+คะแนน)</option>
          <option value="demerit">ตัดคะแนนพฤติกรรม (-คะแนน)</option>
        </select>

        <button
          onClick={() => alert("ระบบเพิ่มพฤติกรรมใหม่พร้อมเปิดใช้งาน")}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> เพิ่มรายการบันทึก
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-100 font-bold">
              <tr>
                <th className="px-6 py-3.5">ชื่อ-นามสกุล</th>
                <th className="px-6 py-3.5">ชั้นเรียน</th>
                <th className="px-6 py-3.5 min-w-[280px]">รายละเอียดการบันทึก</th>
                <th className="px-6 py-3.5 text-center">ปรับคะแนน</th>
                <th className="px-6 py-3.5">ผู้บันทึก</th>
                <th className="px-6 py-3.5 text-center w-24">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
              {filteredRecords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{item.studentName}</td>
                  <td className="px-6 py-4">{item.class}</td>
                  <td className="px-6 py-4 max-w-[320px] truncate" title={item.action}>
                    {item.action}
                  </td>
                  <td className={`px-6 py-4 text-center font-bold ${item.type === "merit" ? "text-emerald-600" : "text-rose-600"}`}>
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-medium">{item.reporter}</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => alert(`ดูข้อมูลความประพฤติรายบุคคลของ ${item.studentName}`)}
                      className="text-blue-500 bg-blue-50 hover:bg-blue-500 hover:text-white w-8 h-8 rounded-lg flex items-center justify-center mx-auto transition cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="p-16 text-center space-y-2 border-t border-slate-50">
            <ShieldAlert className="w-10 h-10 text-slate-200 mx-auto" />
            <p className="font-bold text-slate-400 text-sm">ไม่มีรายการบันทึกที่ค้นพบ</p>
          </div>
        )}
      </div>

    </div>
  );
}
