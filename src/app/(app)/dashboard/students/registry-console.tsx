"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, X, AlertCircle, Check, Shield } from "lucide-react";
import { StudentImportInput, StudentStatus } from "@/features/student/schemas";
import { createStudentAction, updateStudentAction, deleteStudentAction } from "@/app/actions/student";

interface Student {
  id: string;
  studentId: string;
  studentName: string;
  classLevel: string;
  room: string;
  status: StudentStatus;
  profileImage?: string | null;
}

export default function StudentRegistryConsole({
  initialStudents,
  currentUserPermissions,
}: {
  initialStudents: Student[];
  currentUserPermissions: string[];
}) {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [room, setRoom] = useState("");
  const [statusVal, setStatusVal] = useState<StudentStatus>("STUDYING");
  const [profileImage, setProfileImage] = useState("");

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper check for role permission
  const hasPermission = (perm: string) => currentUserPermissions.includes(perm);

  const openCreateModal = () => {
    setErrorMsg(null);
    setStudentId("");
    setStudentName("");
    setClassLevel("");
    setRoom("");
    setStatusVal("STUDYING");
    setProfileImage("");
    setModalMode("create");
    setIsModalOpen(true);
  };

  const openUpdateModal = (student: Student) => {
    setErrorMsg(null);
    setEditingId(student.id);
    setStudentId(student.studentId);
    setStudentName(student.studentName);
    setClassLevel(student.classLevel);
    setRoom(student.room);
    setStatusVal(student.status);
    setProfileImage(student.profileImage || "");
    setModalMode("update");
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const payload: StudentImportInput = {
      studentId,
      studentName,
      classLevel,
      room,
      status: statusVal,
      profileImage: profileImage || null,
    };

    if (modalMode === "create") {
      const res = await createStudentAction(payload);
      if (res.success && res.student) {
        setStudents((prev) => [...prev, res.student as Student].sort((a, b) => a.studentId.localeCompare(b.studentId)));
        setSuccessMsg("เพิ่มระเบียมนักเรียนสำเร็จ");
        setIsModalOpen(false);
      } else {
        setErrorMsg(res.error || "เกิดข้อผิดพลาด");
      }
    } else if (modalMode === "update" && editingId) {
      const res = await updateStudentAction(editingId, payload);
      if (res.success && res.student) {
        setStudents((prev) => prev.map((s) => (s.id === editingId ? (res.student as Student) : s)));
        setSuccessMsg("อัปเดตข้อมูลนักเรียนสำเร็จ");
        setIsModalOpen(false);
      } else {
        setErrorMsg(res.error || "เกิดข้อผิดพลาด");
      }
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบระเบียนนักเรียนนี้ชั่วคราว?")) return;
    setLoading(true);
    const res = await deleteStudentAction(id);
    if (res.success) {
      setStudents((prev) => prev.filter((s) => s.id !== id));
      setSuccessMsg("ลบข้อมูลนักเรียนเรียบร้อยแล้ว (Soft Deleted)");
    } else {
      setErrorMsg(res.error || "เกิดข้อผิดพลาดการลบข้อมูล");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">ทะเบียนข้อมูลนักเรียน</h2>
          <p className="text-slate-400 text-sm mt-1">รายชื่อข้อมูลนักเรียนทั้งหมดในระบบการบริหารส่วนงานทะเบียน</p>
        </div>
        {hasPermission("student:create") && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>เพิ่มระเบียนนักเรียน</span>
          </button>
        )}
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3 text-sm text-emerald-400">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-sm text-rose-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Database Registry Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {students.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center gap-3">
            <p className="text-slate-400 font-medium text-sm">ยังไม่มีข้อมูลนักเรียนในระบบ</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider bg-slate-950/20">
                  <th className="py-4 px-6">รหัสนักเรียน</th>
                  <th className="py-4 px-6">ชื่อ - นามสกุล</th>
                  <th className="py-4 px-6">ระดับชั้น</th>
                  <th className="py-4 px-6">ห้องเรียน</th>
                  <th className="py-4 px-6">สถานะภาพ</th>
                  <th className="py-4 px-6 text-right">เครื่องมือ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-sm text-slate-300">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-800/20 transition-all">
                    <td className="py-4 px-6 font-mono font-medium text-white">{student.studentId}</td>
                    <td className="py-4 px-6 font-semibold text-white">{student.studentName}</td>
                    <td className="py-4 px-6">ชั้น ม.{student.classLevel}</td>
                    <td className="py-4 px-6">ห้อง {student.room}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.status === "STUDYING"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}>
                        {student.status === "STUDYING" ? "กำลังศึกษา" : student.status === "GRADUATED" ? "สำเร็จการศึกษา" : "ย้ายสถานศึกษา"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      {hasPermission("student:update") && (
                        <button
                          onClick={() => openUpdateModal(student)}
                          className="p-3.5 min-h-[48px] min-w-[48px] text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/5 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                        >
                          <Edit2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                      {hasPermission("student:delete") && (
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-3.5 min-h-[48px] min-w-[48px] text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/20">
              <h3 className="text-md font-bold text-white">
                {modalMode === "create" ? "เพิ่มระเบียมนักเรียนใหม่" : "แก้ไขระเบียมนักเรียน"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer p-3 min-h-[48px] min-w-[48px] inline-flex items-center justify-center">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">รหัสนักเรียน (เลขประจำตัว)</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">ชื่อ - นามสกุล</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">ระดับชั้น (ม.)</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 1 หรือ 6"
                    value={classLevel}
                    onChange={(e) => setClassLevel(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400">ห้องเรียน</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น 1 หรือ 5"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">สถานภาพการศึกษา</label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value as StudentStatus)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                >
                  <option value="STUDYING">กำลังศึกษา (STUDYING)</option>
                  <option value="GRADUATED">สำเร็จการศึกษา (GRADUATED)</option>
                  <option value="MOVED">ย้ายสถานศึกษา (MOVED)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400">รูปโปรไฟล์ (URL หรือ Storage Path)</label>
                <input
                  type="text"
                  placeholder="เช่น /uploads/student-1.jpg"
                  value={profileImage}
                  onChange={(e) => setProfileImage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-slate-800/60 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-3 bg-slate-800 hover:bg-slate-750 text-slate-300 text-base font-semibold rounded-xl cursor-pointer min-h-[48px] min-w-[80px]"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-base font-semibold rounded-xl transition-all cursor-pointer min-h-[48px] min-w-[100px]"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>บันทึก</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple loader helper inside Client component
function Loader2({ className }: { className?: string }) {
  return <div className={`border-2 border-slate-300 border-t-white rounded-full animate-spin ${className}`} style={{ borderTopColor: 'transparent' }} />;
}
