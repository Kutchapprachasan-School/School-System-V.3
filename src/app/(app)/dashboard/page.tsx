"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, CloudUpload, Calendar as CalendarIcon, List } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  color: "red" | "purple" | "blue";
  category: string;
  description?: string;
}

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "วันอาสาฬหบูชา",
    date: "2026-07-10",
    color: "red",
    category: "holiday",
    description: "Asarnha Bucha Day",
  },
  {
    id: "2",
    title: "วันเข้าพรรษา",
    date: "2026-07-11",
    color: "red",
    category: "holiday",
    description: "Buddhist Lent Day",
  },
  {
    id: "3",
    title: "สอบกลางภาค 1/2569",
    date: "2026-07-20",
    color: "purple",
    category: "academic",
    description: "สอบกลางภาคเรียนที่ 1",
  },
  {
    id: "4",
    title: "สอบกลางภาค 1/2569",
    date: "2026-07-21",
    color: "purple",
    category: "academic",
    description: "สอบกลางภาคเรียนที่ 1",
  },
  {
    id: "5",
    title: "สอบกลางภาค 1/2569",
    date: "2026-07-22",
    color: "purple",
    category: "academic",
    description: "สอบกลางภาคเรียนที่ 1",
  },
  {
    id: "6",
    title: "สอบกลางภาค 1/2569",
    date: "2026-07-23",
    color: "purple",
    category: "academic",
    description: "สอบกลางภาคเรียนที่ 1",
  },
  {
    id: "7",
    title: "สอบกลางภาค 1/2569",
    date: "2026-07-24",
    color: "purple",
    category: "academic",
    description: "สอบกลางภาคเรียนที่ 1",
  },
  {
    id: "8",
    title: "วันเฉลิมพระชนมพรรษา ร.10",
    date: "2026-07-28",
    color: "red",
    category: "holiday",
    description: "HM King Maha Vajiralongkorn's Birthday",
  },
];

export default function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); // Default to July 2026
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Thai months names
  const THAI_MONTHS = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
  ];

  const monthNameEN = currentDate.toLocaleString("en-US", { month: "long" });
  const displayTitle = `${monthNameEN} ${year}`;

  // Get total days in month
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const totalDays = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Get days of previous month to fill starts
  const prevMonthTotalDays = getDaysInMonth(year, month - 1);

  const daysGrid: { dayNum: number; isCurrentMonth: boolean; dateStr: string }[] = [];

  // Previous month padding days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = prevMonthTotalDays - i;
    const mStr = String((month === 0 ? 11 : month - 1) + 1).padStart(2, "0");
    const yStr = String(month === 0 ? year - 1 : year);
    daysGrid.push({
      dayNum: d,
      isCurrentMonth: false,
      dateStr: `${yStr}-${mStr}-${String(d).padStart(2, "0")}`,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const mStr = String(month + 1).padStart(2, "0");
    daysGrid.push({
      dayNum: d,
      isCurrentMonth: true,
      dateStr: `${year}-${mStr}-${String(d).padStart(2, "0")}`,
    });
  }

  // Next month padding days to complete 42 cells
  const remainingCells = 42 - daysGrid.length;
  for (let d = 1; d <= remainingCells; d++) {
    const mStr = String((month === 11 ? 0 : month + 1) + 1).padStart(2, "0");
    const yStr = String(month === 11 ? year + 1 : year);
    daysGrid.push({
      dayNum: d,
      isCurrentMonth: false,
      dateStr: `${yStr}-${mStr}-${String(d).padStart(2, "0")}`,
    });
  }

  // Filtered Events
  const filteredEvents = INITIAL_EVENTS.filter((e) => {
    if (selectedCategory === "all") return true;
    return e.category === selectedCategory;
  });

  const getEventsForDate = (dateStr: string) => {
    return filteredEvents.filter((e) => e.date === dateStr);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  // Helper to format date label Thai
  const formatThaiDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const mName = THAI_MONTHS[m - 1];
    return `${mName} ${d}, ${y}`;
  };

  // Event feed list (only shows current month events)
  const currentMonthEvents = filteredEvents.filter((e) => {
    const [y, m] = e.date.split("-").map(Number);
    return y === year && m === month + 1;
  }).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full text-slate-700">
      
      {/* ===== LEFT COLUMN: MINI CALENDAR & EVENTS FEED ===== */}
      <div className="w-full xl:w-[320px] shrink-0 space-y-6">
        
        {/* Mini Calendar Card */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-sm tracking-tight">{displayTitle}</span>
            <div className="flex items-center gap-1.5">
              <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold text-slate-400 mb-2">
            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
          </div>

          {/* Mini Calendar days grid */}
          <div className="grid grid-cols-7 gap-y-1 text-center text-xs font-semibold">
            {daysGrid.map((day, idx) => {
              const hasEvents = getEventsForDate(day.dateStr).length > 0;
              const isToday = day.dayNum === 16 && day.isCurrentMonth; // mock today is 16th July

              return (
                <div key={idx} className="relative flex items-center justify-center p-1.5">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full transition-all ${
                      !day.isCurrentMonth
                        ? "text-slate-300"
                        : isToday
                        ? "bg-sky-500 text-white shadow-sm"
                        : hasEvents && getEventsForDate(day.dateStr)[0].color === "red"
                        ? "bg-rose-500 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {day.dayNum}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Events Feed */}
        <div className="space-y-4">
          {currentMonthEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col gap-1.5"
            >
              <span className="text-[11px] font-bold text-slate-400">{formatThaiDate(event.date)}</span>
              <div className="flex items-start gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${
                    event.color === "red"
                      ? "bg-rose-500"
                      : event.color === "purple"
                      ? "bg-purple-500"
                      : "bg-blue-500"
                  }`}
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-800 leading-tight">{event.title}</h4>
                  {event.description && (
                    <p className="text-xs text-slate-400 mt-0.5">{event.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {currentMonthEvents.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              ไม่มีกิจกรรมหรือวันหยุดในเดือนนี้
            </div>
          )}
        </div>
      </div>

      {/* ===== RIGHT COLUMN: MAIN CALENDAR GRID ===== */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Calendar Controller Header */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-sm tracking-tight w-24 text-center">{displayTitle}</span>
            <button onClick={nextMonth} className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="bg-slate-100 p-0.5 rounded-xl flex border border-slate-200/50">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                รายการ
              </button>
              <button
                onClick={() => setViewMode("calendar")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  viewMode === "calendar"
                    ? "bg-white text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                ปฏิทิน
              </button>
            </div>

            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold outline-none cursor-pointer hover:bg-slate-50 transition"
            >
              <option value="all">ทุกประเภท</option>
              <option value="holiday">วันหยุด/กิจกรรม</option>
              <option value="academic">วิชาการ/สอบ</option>
            </select>

            {/* Plus Button */}
            <button
              onClick={() => alert("ฟีเจอร์เพิ่มกิจกรรมอยู่ในขั้นตอนการจัดสรรรอบถัดไป")}
              className="w-8 h-8 rounded-lg bg-sky-500 hover:bg-sky-400 text-white flex items-center justify-center shadow-sm cursor-pointer transition"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Cloud/Upload Button */}
            <button
              onClick={() => alert("ระบบสำรองกึ่งออฟไลน์ใช้งานบนคลาวด์เรียบร้อย")}
              className="w-8 h-8 rounded-lg bg-rose-500 hover:bg-rose-400 text-white flex items-center justify-center shadow-sm cursor-pointer transition"
            >
              <CloudUpload className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Content */}
        {viewMode === "calendar" ? (
          <div className="flex-1 grid grid-cols-7 border-collapse">
            {/* Days of Week Header */}
            {["SU", "MO", "TU", "WE", "TH", "FR", "SA"].map((dayName, idx) => (
              <div
                key={idx}
                className="py-3 text-center text-[10px] font-bold text-slate-400 border-b border-r border-slate-100 last:border-r-0"
              >
                {dayName}
              </div>
            ))}

            {/* Month Calendar Cells */}
            {daysGrid.map((day, idx) => {
              const events = getEventsForDate(day.dateStr);
              const isToday = day.dayNum === 16 && day.isCurrentMonth; // Mock today

              return (
                <div
                  key={idx}
                  className="min-h-[85px] p-2 border-r border-b border-slate-100 flex flex-col gap-1 last:border-r-0"
                  style={{
                    backgroundColor: day.isCurrentMonth ? "transparent" : "#fcfdfe",
                  }}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                        !day.isCurrentMonth
                          ? "text-slate-300"
                          : isToday
                          ? "bg-sky-500 text-white shadow-sm"
                          : "text-slate-700"
                      }`}
                    >
                      {day.dayNum}
                    </span>
                  </div>

                  {/* Cell Events List */}
                  <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className={`px-2 py-1 rounded text-[9px] font-bold leading-tight truncate cursor-pointer ${
                          event.color === "red"
                            ? "bg-rose-550 text-white"
                            : event.color === "purple"
                            ? "bg-purple-50 text-purple-600 border border-purple-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}
                        title={event.title}
                        style={{
                          backgroundColor: event.color === "red" ? "#ff4d6d" : undefined,
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex-1 p-6 space-y-4 overflow-y-auto">
            <h3 className="font-bold text-sm text-slate-800">กิจกรรมและวันหยุดทั้งหมดประจำเดือน</h3>
            <div className="divide-y divide-slate-100">
              {currentMonthEvents.map((event) => (
                <div key={event.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-3 h-3 rounded-full shrink-0 ${
                        event.color === "red"
                          ? "bg-rose-500"
                          : event.color === "purple"
                          ? "bg-purple-500"
                          : "bg-blue-500"
                      }`}
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">{event.title}</h4>
                      {event.description && (
                        <p className="text-xs text-slate-400">{event.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">{formatThaiDate(event.date)}</span>
                </div>
              ))}

              {currentMonthEvents.length === 0 && (
                <div className="text-center py-12 text-sm text-slate-400">
                  ไม่มีรายการกิจกรรมเพื่อแสดง
                </div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
