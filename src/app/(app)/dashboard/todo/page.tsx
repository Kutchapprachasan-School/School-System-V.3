"use client";

import { useState } from "react";
import { ListTodo, RotateCw, Plus, Search, Filter, RefreshCcw, Trash2, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface TodoItem {
  id: number;
  title: string;
  source: string;
  sourceLabel: string;
  priority: "urgent" | "high" | "normal" | "low";
  priorityLabel: string;
  due: string;
  status: "pending" | "todo" | "inprogress" | "done" | "overdue";
  statusLabel: string;
  assignee: string;
  note: string;
}

const INITIAL_TODOS: TodoItem[] = [
  {
    id: 1,
    title: "ขออนุมัติโครงการปรับปรุงห้องคอมพิวเตอร์",
    source: "budget",
    sourceLabel: "งบประมาณ",
    priority: "high",
    priorityLabel: "สำคัญ",
    due: "2026-07-25",
    status: "pending",
    statusLabel: "รออนุมัติ",
    assignee: "ครูสมปอง ทดสอบ",
    note: "วงเงิน 150,000 บาท รอผอ.อนุมัติ"
  },
  {
    id: 2,
    title: "ประเมินผลปฏิบัติงานรอบ 6 เดือน",
    source: "hr",
    sourceLabel: "งานบุคคล",
    priority: "urgent",
    priorityLabel: "เร่งด่วนมาก",
    due: "2026-07-20",
    status: "todo",
    statusLabel: "ต้องทำ",
    assignee: "ฝ่ายบุคคล",
    note: "ครบกำหนดสิ้นเดือนกรกฎาคม"
  },
  {
    id: 3,
    title: "จัดทำแผนพัฒนาบุคลากรประจำปี 2569",
    source: "hr",
    sourceLabel: "งานบุคคล",
    priority: "normal",
    priorityLabel: "ปกติ",
    due: "2026-08-15",
    status: "inprogress",
    statusLabel: "กำลังดำเนินการ",
    assignee: "ฝ่ายบุคคล",
    note: "อยู่ระหว่างรวบรวมข้อมูล"
  },
  {
    id: 4,
    title: "ตรวจรับสื่อการสอนวิชาวิทยาศาสตร์",
    source: "academic",
    sourceLabel: "วิชาการ",
    priority: "normal",
    priorityLabel: "ปกติ",
    due: "2026-07-18",
    status: "done",
    statusLabel: "เสร็จแล้ว",
    assignee: "ฝ่ายวิชาการ",
    note: "ตรวจรับครบถ้วน เรียบร้อย"
  },
  {
    id: 5,
    title: "สรุปยอดบันทึกนักเรียนมาสายประตู 1",
    source: "student_council",
    sourceLabel: "สภานักเรียน",
    priority: "high",
    priorityLabel: "สำคัญ",
    due: "2026-07-16",
    status: "todo",
    statusLabel: "ต้องทำ",
    assignee: "เวรประจำวัน",
    note: "ส่งยอดก่อนเวลา 08:30 น."
  }
];

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>(INITIAL_TODOS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPriority, setFilterPriority] = useState("");

  const filteredTodos = todos.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.assignee.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    const matchesCategory = filterCategory ? item.source === filterCategory : true;
    const matchesPriority = filterPriority ? item.priority === filterPriority : true;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const handleToggleDone = (id: number) => {
    setTodos(
      todos.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === "done" ? "todo" : "done";
          return {
            ...t,
            status: nextStatus,
            statusLabel: nextStatus === "done" ? "เสร็จแล้ว" : "ต้องทำ"
          };
        }
        return t;
      })
    );
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterCategory("");
    setFilterPriority("");
  };

  const totalCount = todos.length;
  const urgentCount = todos.filter((t) => t.priority === "urgent").length;
  const pendingCount = todos.filter((t) => t.status === "pending").length;
  const doneCount = todos.filter((t) => t.status === "done").length;

  return (
    <div className="space-y-6 text-slate-700">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 shadow-sm">
              <ListTodo className="w-5 h-5" />
            </div>
            รายการที่ต้องทำ
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 ml-13 font-medium">ติดตามงานค้าง รออนุมัติ และรายการที่ต้องดำเนินการส่ง</p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => alert("ซิงค์ข้อมูลภาระงานล่าสุดสำเร็จ")}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm text-sm cursor-pointer"
          >
            <RotateCw className="w-4 h-4" /> ซิงค์ข้อมูล
          </button>
          <button
            onClick={() => alert("ระบบเพิ่มภาระงานภายนอกพร้อมเปิดใช้งาน")}
            className="bg-orange-500 hover:bg-orange-400 text-white px-5 py-2.5 rounded-xl font-bold transition flex items-center gap-2 shadow-sm text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> เพิ่มรายการ
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between relative overflow-hidden group">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-orange-50 rounded-full group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">ทั้งหมด</p>
            <h3 className="text-2xl font-black text-slate-800 leading-tight">{totalCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center">
            <ListTodo className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between relative overflow-hidden group">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-rose-50 rounded-full group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">เร่งด่วน</p>
            <h3 className="text-2xl font-black text-rose-600 leading-tight">{urgentCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between relative overflow-hidden group">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-amber-50 rounded-full group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">รออนุมัติ</p>
            <h3 className="text-2xl font-black text-amber-600 leading-tight">{pendingCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex items-center justify-between relative overflow-hidden group">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-emerald-50 rounded-full group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
          <div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">เสร็จแล้ว</p>
            <h3 className="text-2xl font-black text-emerald-600 leading-tight">{doneCount}</h3>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="ค้นหารายการ หรือ ผู้รับผิดชอบ..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition text-xs font-semibold"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-bold outline-none cursor-pointer min-w-[140px]"
        >
          <option value="">สถานะทั้งหมด</option>
          <option value="pending">รออนุมัติ</option>
          <option value="todo">ต้องทำ</option>
          <option value="inprogress">กำลังดำเนินการ</option>
          <option value="done">เสร็จแล้ว</option>
        </select>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-bold outline-none cursor-pointer min-w-[140px]"
        >
          <option value="">ทุกหมวดหมู่</option>
          <option value="academic">วิชาการ</option>
          <option value="budget">งบประมาณ</option>
          <option value="hr">งานบุคคล</option>
          <option value="student_council">สภานักเรียน</option>
        </select>

        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="py-2.5 px-4 bg-white border border-slate-200 rounded-xl text-slate-600 text-xs font-bold outline-none cursor-pointer min-w-[130px]"
        >
          <option value="">ความสำคัญทั้งหมด</option>
          <option value="urgent">เร่งด่วนมาก</option>
          <option value="high">สำคัญ</option>
          <option value="normal">ปกติ</option>
          <option value="low">ไม่รีบ</option>
        </select>

        <button
          onClick={handleClearFilters}
          className="py-2.5 px-4 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> ล้างตัวกรอง
        </button>
      </div>

      {/* Todo List Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-400 uppercase border-b border-slate-100 font-bold">
              <tr>
                <th className="px-6 py-4 w-10">#</th>
                <th className="px-6 py-4 min-w-[240px]">รายการ / หัวข้อ</th>
                <th className="px-6 py-4 w-28">แหล่งที่มา</th>
                <th className="px-6 py-4 w-24">ความสำคัญ</th>
                <th className="px-6 py-4 w-28 text-center">กำหนดส่ง</th>
                <th className="px-6 py-4 w-28 text-center">สถานะ</th>
                <th className="px-6 py-4 pr-6 w-36 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-medium">
              {filteredTodos.map((item, idx) => (
                <tr key={item.id} className={`hover:bg-slate-50/50 transition ${item.status === "done" ? "opacity-60" : ""}`}>
                  <td className="px-6 py-4 text-slate-400 font-bold">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-800 leading-tight">{item.title}</p>
                      <p className="text-[10px] text-slate-400">ผู้รับผิดชอบ: {item.assignee} | {item.note}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                      {item.sourceLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-bold ${
                      item.priority === "urgent"
                        ? "text-rose-600"
                        : item.priority === "high"
                        ? "text-orange-500"
                        : item.priority === "normal"
                        ? "text-blue-500"
                        : "text-slate-500"
                    }`}>
                      {item.priorityLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-400 font-semibold">{item.due}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`text-[9px] px-2 py-0.5 rounded font-bold ${
                      item.status === "done"
                        ? "bg-emerald-100 text-emerald-700"
                        : item.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : item.status === "inprogress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {item.statusLabel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center space-x-1.5">
                    <button
                      onClick={() => handleToggleDone(item.id)}
                      className="text-emerald-500 bg-emerald-50 hover:bg-emerald-500 hover:text-white px-2 py-1 rounded transition text-[9px] font-bold cursor-pointer"
                    >
                      {item.status === "done" ? "เปิดงานใหม่" : "เสร็จสิ้น"}
                    </button>
                    <button
                      onClick={() => setTodos(todos.filter((t) => t.id !== item.id))}
                      className="text-rose-500 bg-rose-50 hover:bg-rose-500 hover:text-white px-2 py-1 rounded transition text-[9px] font-bold cursor-pointer"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTodos.length === 0 && (
          <div className="p-16 text-center space-y-2 border-t border-slate-50">
            <ListTodo className="w-10 h-10 text-slate-200 mx-auto" />
            <p className="font-bold text-slate-400 text-sm">ไม่มีรายการที่ตรงกับเงื่อนไข</p>
            <p className="text-[10px] text-slate-300">ลองล้างหรือเปลี่ยนตัวกรองของท่าน</p>
          </div>
        )}
      </div>

    </div>
  );
}
