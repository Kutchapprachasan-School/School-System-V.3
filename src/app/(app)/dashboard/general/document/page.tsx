"use client";

import { useState } from "react";
import { Mail, Plus, Search, FileText, CheckCircle2, Eye, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OfficialDoc {
  id: string;
  docNum: string;
  title: string;
  sender: string;
  receiver: string;
  date: string;
  time: string;
  priority: "ด่วนที่สุด" | "ด่วนมาก" | "ด่วน" | "ปกติ";
  priorityColor: string;
  type: "inbox" | "outbox";
}

const INITIAL_DOCS: OfficialDoc[] = [
  {
    id: "1",
    docNum: "ศธ.04001/123",
    title: "แจ้งกำหนดการประเมินคุณภาพภายในสถานศึกษาประจำปีการศึกษา 2568",
    sender: "สพฐ.",
    receiver: "ฝ่ายวิชาการ",
    date: "2569-07-16",
    time: "14:30 น.",
    priority: "ด่วนที่สุด",
    priorityColor: "bg-red-100 text-red-700 border border-red-200",
    type: "inbox"
  },
  {
    id: "2",
    docNum: "กท.1001/055",
    title: "ขอเชิญส่งบุคลากรเข้าร่วมอบรมเชิงปฏิบัติการพัฒนาสื่อนวัตกรรมการศึกษา",
    sender: "สำนักการศึกษา",
    receiver: "ผู้อำนวยการ",
    date: "2569-07-15",
    time: "09:15 น.",
    priority: "ปกติ",
    priorityColor: "bg-slate-100 text-slate-700 border border-slate-200",
    type: "inbox"
  },
  {
    id: "3",
    docNum: "ศศ.2569/088",
    title: "นำส่งรายงานการใช้จ่ายเงินอุดหนุนอาหารกลางวัน ไตรมาส 1",
    sender: "โรงเรียนกุดจับประชาสรรค์",
    receiver: "สำนักงานเขตพื้นที่การศึกษา",
    date: "2569-07-14",
    time: "11:00 น.",
    priority: "ด่วน",
    priorityColor: "bg-amber-100 text-amber-700 border border-amber-200",
    type: "outbox"
  }
];

export default function DocumentPage() {
  const [activeTab, setActiveTab] = useState<"inbox" | "outbox">("inbox");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const filteredDocs = INITIAL_DOCS.filter((doc) => {
    const matchesTab = doc.type === activeTab;
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) || doc.docNum.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = priorityFilter ? doc.priority === priorityFilter : true;
    return matchesTab && matchesSearch && matchesPriority;
  });

  const inboxCount = INITIAL_DOCS.filter((d) => d.type === "inbox").length;
  const outboxCount = INITIAL_DOCS.filter((d) => d.type === "outbox").length;

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
              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center shadow-sm">
                <Mail className="w-5 h-5" />
              </div>
              ระบบงานสารบรรณ
            </h2>
            <p className="text-slate-500 text-sm mt-1.5 ml-13 font-semibold">รับ-ส่งหนังสือราชการ บันทึกข้อความ คำสั่ง ประกาศ และเกียรติบัตร</p>
          </div>
        </div>

        <div className="flex gap-2.5">
          <button className="bg-white border border-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm hover:bg-slate-50 transition text-xs flex items-center gap-2 cursor-pointer">
            <Calendar className="w-4 h-4 text-blue-500" /> ปีการศึกษา 2567
          </button>
        </div>
      </div>

      {/* Top Action Tabs */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex bg-white rounded-2xl p-1 border border-slate-100 shadow-sm gap-1">
          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
              activeTab === "inbox"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            หนังสือรับ
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === "inbox" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
              {inboxCount}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("outbox")}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
              activeTab === "outbox"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            หนังสือส่ง
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === "outbox" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
              {outboxCount}
            </span>
          </button>
        </div>

        <button
          onClick={() => alert("ระบบฟอร์มลงรับคำร้องใหม่เปิดใช้งานในรอบถัดไป")}
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> เพิ่มเอกสาร
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="ค้นหา เลขที่หนังสือ, ชื่อเรื่อง..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-xs font-semibold"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-bold outline-none cursor-pointer min-w-[140px]"
        >
          <option value="">ชั้นความลับ</option>
          <option value="ปกติ">ปกติ</option>
          <option value="ด่วน">ด่วน</option>
          <option value="ด่วนที่สุด">ด่วนที่สุด</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-400 border-b border-slate-100 font-bold">
              <tr>
                <th className="px-6 py-3.5 w-40">ที่/เลขที่</th>
                <th className="px-6 py-3.5 min-w-[240px]">เรื่อง</th>
                <th className="px-6 py-3.5">จาก / ถึง</th>
                <th className="px-6 py-3.5 text-center">วันที่ลงรับ</th>
                <th className="px-6 py-3.5">ชั้นความลับ</th>
                <th className="px-6 py-3.5 text-center w-24">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
              {filteredDocs.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition">
                  <td className="px-6 py-4 font-bold text-slate-800">{item.docNum}</td>
                  <td className="px-6 py-4 max-w-[320px] truncate" title={item.title}>
                    {item.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[9px] font-bold">
                      {activeTab === "inbox" ? item.sender : item.receiver}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400 font-medium">
                    {item.date} <span className="block text-[9px] font-bold text-slate-300">{item.time}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${item.priorityColor}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => alert(`ดูรายละเอียดเอกสารเลขที่ ${item.docNum}`)}
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

        {filteredDocs.length === 0 && (
          <div className="p-16 text-center space-y-2 border-t border-slate-50">
            <Mail className="w-10 h-10 text-slate-200 mx-auto" />
            <p className="font-bold text-slate-400 text-sm">ไม่มีรายการเอกสารที่ค้นพบ</p>
          </div>
        )}
      </div>

    </div>
  );
}
