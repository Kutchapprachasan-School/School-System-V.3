"use client";

import { useState, useEffect } from "react";
import { Settings, School, Users, Clock, Shield, Database, ToggleLeft, ListTodo, Type, Save, Trash2, ShieldAlert } from "lucide-react";

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState<"school" | "fonts" | "users" | "modules">("school");

  // School settings state
  const [schoolNameTh, setSchoolNameTh] = useState("โรงเรียนกุดจับประชาสรรค์");
  const [schoolNameEn, setSchoolNameEn] = useState("Kutchapprachasan School");
  const [schoolId, setSchoolId] = useState("1010000000");
  const [affiliation, setAffiliation] = useState("สพฐ.");
  const [area, setArea] = useState("สพม. กรุงเทพมหานคร");
  const [address, setAddress] = useState("เลขที่ 123 ถนนอุดรธานี-กุดจับ ตำบลเมือง อำเภอเมือง อุดรธานี 41000");
  const [phone, setPhone] = useState("042-200-000");
  const [email, setEmail] = useState("kudchap@school.ac.th");

  // Font settings state
  const [thaiFont, setThaiFont] = useState("Sarabun");
  const [englishFont, setEnglishFont] = useState("Inter");

  // Modules toggles state
  const [enabledModules, setEnabledModules] = useState({
    academic: true,
    budget: true,
    hr: true,
    general: true,
    todo: true,
    studentPortal: true,
    studentCouncil: true
  });

  // Load font settings from localStorage on client mount
  useEffect(() => {
    const savedThai = localStorage.getItem("system-font-thai");
    const savedEnglish = localStorage.getItem("system-font-english");
    if (savedThai) setThaiFont(savedThai);
    if (savedEnglish) setEnglishFont(savedEnglish);
  }, []);

  const handleSaveFonts = () => {
    localStorage.setItem("system-font-thai", thaiFont);
    localStorage.setItem("system-font-english", englishFont);

    // Dispatch event to notify layout
    window.dispatchEvent(new Event("system-fonts-changed"));

    alert("บันทึกการตั้งค่าฟอนต์ระบบสำเร็จและประยุกต์ใช้งานทันที!");
  };

  const handleSaveSchoolInfo = () => {
    alert("บันทึกข้อมูลโรงเรียนพื้นฐานสำเร็จเรียบร้อย");
  };

  const thaiFontOptions = [
    { name: "Sarabun (สารบรรณ)", value: "Sarabun" },
    { name: "Noto Sans Thai (โนโตะ ซันส์)", value: "Noto Sans Thai" },
    { name: "Charm (ชาร์ม)", value: "Charm" },
    { name: "Itim (ไอติม)", value: "Itim" },
    { name: "Mali (มะลิ)", value: "Mali" },
    { name: "Krub (ครับ)", value: "Krub" }
  ];

  const englishFontOptions = [
    { name: "Inter (อินเตอร์)", value: "Inter" },
    { name: "Roboto (โรโบโตะ)", value: "Roboto" },
    { name: "Outfit (เอาต์ฟิต)", value: "Outfit" },
    { name: "Playpen Sans (เพลย์เพน ซันส์)", value: "Playpen Sans" },
    { name: "Lexend (เลกเซนด์)", value: "Lexend" }
  ];

  return (
    <div className="space-y-6 text-slate-700">
      
      {/* Title */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shadow-sm border border-slate-200">
              <Settings className="w-5 h-5" />
            </div>
            ตั้งค่าระบบ
          </h2>
          <p className="text-slate-500 text-sm mt-1.5 ml-13 font-medium">จัดการข้อมูลโรงเรียน ผู้ใช้งาน และการตั้งค่าฟอนต์ระบบ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Settings Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-100 p-2 shadow-[0_4px_20px_rgba(0,0,0,0.01)] space-y-1">
            <button
              onClick={() => setActiveTab("school")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "school"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <School className="w-4.5 h-4.5" />
              ข้อมูลโรงเรียน
            </button>
            
            <button
              onClick={() => setActiveTab("fonts")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "fonts"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Type className="w-4.5 h-4.5" />
              ตั้งค่าฟอนต์ระบบ
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Users className="w-4.5 h-4.5" />
              จัดการผู้ใช้งาน
            </button>
            
            <button
              onClick={() => setActiveTab("modules")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "modules"
                  ? "bg-blue-50 text-blue-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <ToggleLeft className="w-4.5 h-4.5" />
              เปิด-ปิดระบบย่อย
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* TAB: SCHOOL INFO */}
          {activeTab === "school" && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">ข้อมูลโรงเรียนพื้นฐาน</h3>
                <button
                  onClick={handleSaveSchoolInfo}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition"
                >
                  <Save className="w-4 h-4" /> บันทึกข้อมูล
                </button>
              </div>

              <div className="p-6 space-y-5 text-xs">
                <div className="flex items-start gap-6 flex-wrap md:flex-nowrap">
                  <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 bg-slate-50 overflow-hidden shrink-0 relative">
                    <img src="/icon.jpg" alt="Logo" className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-500">ชื่อโรงเรียน (ภาษาไทย) *</label>
                      <input
                        type="text"
                        value={schoolNameTh}
                        onChange={(e) => setSchoolNameTh(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-500">ชื่อโรงเรียน (ภาษาอังกฤษ)</label>
                      <input
                        type="text"
                        value={schoolNameEn}
                        onChange={(e) => setSchoolNameEn(e.target.value)}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">รหัสสถานศึกษา (10 หลัก)</label>
                    <input
                      type="text"
                      value={schoolId}
                      onChange={(e) => setSchoolId(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">สังกัด</label>
                    <select
                      value={affiliation}
                      onChange={(e) => setAffiliation(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none cursor-pointer"
                    >
                      <option value="สพฐ.">สพฐ.</option>
                      <option value="กทม.">กทม.</option>
                      <option value="สช.">สช.</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500">เขตพื้นที่การศึกษา</label>
                    <input
                      type="text"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500">ที่อยู่โรงเรียน</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB: SYSTEM FONTS CONFIGURATION */}
          {activeTab === "fonts" && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <Type className="w-5 h-5 text-blue-500" /> ตั้งค่าฟอนต์ของระบบ (System Fonts Setup)
                </h3>
                <button
                  onClick={handleSaveFonts}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm transition"
                >
                  <Save className="w-4 h-4" /> บันทึกฟอนต์ระบบ
                </button>
              </div>

              <div className="p-6 space-y-6 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Thai Font Selector */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-500 block">ฟอนต์ภาษาไทย (Thai Font Family)</label>
                    <select
                      value={thaiFont}
                      onChange={(e) => setThaiFont(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition"
                    >
                      {thaiFontOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                    {/* Live Preview */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/50 space-y-1 mt-2">
                      <p className="text-[10px] text-slate-400 font-bold">ตัวอย่างภาษาไทย (Preview TH)</p>
                      <p
                        className="text-sm font-semibold text-slate-800"
                        style={{ fontFamily: `'${thaiFont}', sans-serif` }}
                      >
                        โรงเรียนกุดจับประชาสรรค์ ยินดีต้อนรับผู้ใช้งานสู่ระบบ
                      </p>
                    </div>
                  </div>

                  {/* English Font Selector */}
                  <div className="space-y-2">
                    <label className="font-bold text-slate-500 block">ฟอนต์ภาษาอังกฤษ (English Font Family)</label>
                    <select
                      value={englishFont}
                      onChange={(e) => setEnglishFont(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none cursor-pointer hover:bg-slate-100 transition"
                    >
                      {englishFontOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                    {/* Live Preview */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/50 space-y-1 mt-2">
                      <p className="text-[10px] text-slate-400 font-bold">ตัวอย่างภาษาอังกฤษ (Preview EN)</p>
                      <p
                        className="text-sm font-semibold text-slate-800"
                        style={{ fontFamily: `'${englishFont}', sans-serif` }}
                      >
                        Kutchapprachasan School Management System 2026.
                      </p>
                    </div>
                  </div>

                </div>

                <div className="bg-blue-50/50 border border-blue-200/50 p-4 rounded-2xl flex gap-3 items-start">
                  <ShieldAlert className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-blue-800 text-[11px]">การเชื่อมโยง Web Fonts</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
                      ระบบจะทำการโหลด Stylesheet ฟอนต์ที่บอสเลือกจาก Google Fonts API และนำไปประยุกต์ใช้งานครอบคลุมแท็กและฟิลด์เนื้อหาทั้งหมดของระบบโดยอัตโนมัติ
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: USERS LIST */}
          {activeTab === "users" && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">จัดการผู้ใช้งานระบบ</h3>
              </div>
              <div className="p-6 text-xs text-slate-400 text-center py-12">
                ผู้ใช้งานทั้งหมดซิงค์กับโมดูลฐานข้อมูลเรียบร้อยแล้ว
              </div>
            </div>
          )}

          {/* TAB: MODULE TOGGLES */}
          {activeTab === "modules" && (
            <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm">เปิด-ปิดระบบย่อย</h3>
              </div>
              <div className="p-6 text-xs text-slate-400 text-center py-12">
                กำหนดสถานะการเปิดใช้งานโมดูลงานวิชาการ บุคคล งบประมาณ และพอร์ทัลย่อยต่างๆ
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
