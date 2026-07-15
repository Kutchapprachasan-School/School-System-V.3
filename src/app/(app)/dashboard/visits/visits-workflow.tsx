"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Check,
  AlertTriangle,
  Upload,
  Camera,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Wifi,
  WifiOff,
  User,
  Shield,
  Trash2,
} from "lucide-react";
import { draftDB, SCHEMA_VERSION } from "@/lib/indexeddb";
import { compressImage } from "@/lib/image";
import { createVisitAction } from "@/app/actions/visit";
import { formatUTCDate } from "@/lib/dates";

interface StudentListItem {
  id: string;
  studentId: string;
  studentName: string;
  classLevel: string;
  room: string;
}

interface VisitsWorkflowProps {
  students: StudentListItem[];
  currentUserPermissions: string[];
  initialStudentId?: string;
}

type GpsState = "IDLE" | "REQUESTING" | "SUCCESS" | "FAILED" | "DENIED" | "TIMEOUT";

export default function VisitsWorkflow({
  students,
  currentUserPermissions,
  initialStudentId = "",
}: VisitsWorkflowProps) {
  // ---------------------------------------------------------------------------
  // 1. Core State & Metadata Context (for Partitioning Drafts)
  // ---------------------------------------------------------------------------
  const [selectedStudentId, setSelectedStudentId] = useState(initialStudentId);
  const [academicYear, setAcademicYear] = useState("2569");
  const [term, setTerm] = useState("1");
  const [visitSessionId, setVisitSessionId] = useState("session_1");

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // 2. Visit Form Fields
  // ---------------------------------------------------------------------------
  const [visitStatus, setVisitStatus] = useState("VISITED");
  const [visitDate, setVisitDate] = useState(formatUTCDate(new Date()));
  const [informantRelation, setInformantRelation] = useState("บิดา");
  const [photoSource, setPhotoSource] = useState("MOBILE_CAMERA");

  // Address
  const [houseNo, setHouseNo] = useState("");
  const [houseMoo, setHouseMoo] = useState("");
  const [houseRoad, setHouseRoad] = useState("");
  const [houseTambon, setHouseTambon] = useState("");
  const [houseAmphoe, setHouseAmphoe] = useState("");
  const [houseProvince, setHouseProvince] = useState("");

  // Finances
  const [familyIncome, setFamilyIncome] = useState("");
  const [familyExpense, setFamilyExpense] = useState("");
  const [familyDebt, setFamilyDebt] = useState("");

  // Summary
  const [teacherSummary, setTeacherSummary] = useState("");

  // ---------------------------------------------------------------------------
  // 3. Geolocation & Fraud Audit States
  // ---------------------------------------------------------------------------
  const [gpsState, setGpsState] = useState<GpsState>("IDLE");
  const [mapLat, setMapLat] = useState<number | null>(null);
  const [mapLong, setMapLong] = useState<number | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [gpsCapturedAt, setGpsCapturedAt] = useState<Date | null>(null);
  const [gpsSource, setGpsSource] = useState<"AUTO" | "MANUAL">("AUTO");
  const [gpsOverrideReason, setGpsOverrideReason] = useState("");

  // ---------------------------------------------------------------------------
  // 4. Media Metadata & Upload State (excludes binary data in local draft DB)
  // ---------------------------------------------------------------------------
  const [imgHouseOutside, setImgHouseOutside] = useState<{
    id: string;
    storagePath: string;
    width: number | null;
    height: number | null;
    fileName: string;
  } | null>(null);

  const [imgHouseInside, setImgHouseInside] = useState<{
    id: string;
    storagePath: string;
    width: number | null;
    height: number | null;
    fileName: string;
  } | null>(null);

  const [outsideUploadProgress, setOutsideUploadProgress] = useState<string | null>(null);
  const [insideUploadProgress, setInsideUploadProgress] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // 5. Offline Status Tracker (throttled ping verify)
  // ---------------------------------------------------------------------------
  const [isOnline, setIsOnline] = useState(true);
  const lastHealthCheck = useRef<number>(0);

  // Throttled connection verification to avoid DB or server exhaustion
  const checkConnectionStatus = useCallback(async () => {
    const now = Date.now();
    if (now - lastHealthCheck.current < 60000) {
      // Throttled bypass: fallback to navigator state if less than 60s
      setIsOnline(navigator.onLine);
      return;
    }

    lastHealthCheck.current = now;
    if (!navigator.onLine) {
      setIsOnline(false);
      return;
    }

    try {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3000); // 3-second timeout

      const res = await fetch("/api/health", {
        method: "GET",
        signal: controller.signal,
      });
      clearTimeout(id);

      if (res.ok) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch {
      setIsOnline(false);
    }
  }, []);

  useEffect(() => {
    const handleStatusChange = () => checkConnectionStatus();
    window.addEventListener("online", handleStatusChange);
    window.addEventListener("offline", handleStatusChange);

    // Initial check
    checkConnectionStatus();

    // Throttled interval
    const interval = setInterval(checkConnectionStatus, 60000);

    return () => {
      window.removeEventListener("online", handleStatusChange);
      window.removeEventListener("offline", handleStatusChange);
      clearInterval(interval);
    };
  }, [checkConnectionStatus]);

  // ---------------------------------------------------------------------------
  // 6. IndexedDB Draft Manager
  // ---------------------------------------------------------------------------
  // Unique partitioned key
  const draftKey = `visit_draft:${selectedStudentId || "anonymous"}:${academicYear}:${term}:${visitSessionId}`;

  // Prune drafts older than 30 days on load and tab focus
  const pruneDrafts = useCallback(async () => {
    try {
      await draftDB.pruneOldDrafts();
    } catch (e) {
      console.error("Pruning drafts failed", e);
    }
  }, []);

  useEffect(() => {
    pruneDrafts();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        pruneDrafts();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [pruneDrafts]);

  // Load draft on partition change
  useEffect(() => {
    async function loadSavedDraft() {
      if (!selectedStudentId) return;
      try {
        const wrapper = await draftDB.getDraft(draftKey);
        if (wrapper) {
          if (wrapper.version !== SCHEMA_VERSION) {
            // Version mismatch fallback soft-reset warning
            alert("แจ้งเตือน: ตรวจพบแบบร่างเวอร์ชันเก่า มีการอัปเดตระบบ ข้อมูลบางส่วนอาจถูกจัดรูปแบบใหม่เพื่อป้องกันการบันทึกผิดพลาด");
            // Soft reset fallback: merge default empty values or do version translation
            await draftDB.deleteDraft(draftKey);
            return;
          }

          const { data } = wrapper;
          setVisitStatus(data.visitStatus || "VISITED");
          setVisitDate(data.visitDate || formatUTCDate(new Date()));
          setInformantRelation(data.informantRelation || "บิดา");
          setPhotoSource(data.photoSource || "MOBILE_CAMERA");
          setHouseNo(data.houseNo || "");
          setHouseMoo(data.houseMoo || "");
          setHouseRoad(data.houseRoad || "");
          setHouseTambon(data.houseTambon || "");
          setHouseAmphoe(data.houseAmphoe || "");
          setHouseProvince(data.houseProvince || "");
          setFamilyIncome(data.familyIncome || "");
          setFamilyExpense(data.familyExpense || "");
          setFamilyDebt(data.familyDebt || "");
          setTeacherSummary(data.teacherSummary || "");

          if (data.gps) {
            setMapLat(data.gps.lat);
            setMapLong(data.gps.long);
            setGpsAccuracy(data.gps.accuracy);
            setGpsCapturedAt(data.gps.capturedAt ? new Date(data.gps.capturedAt) : null);
            setGpsSource(data.gps.source || "AUTO");
            setGpsOverrideReason(data.gps.overrideReason || "");
            setGpsState(data.gps.state || "IDLE");
          }

          if (data.outsideImage) setImgHouseOutside(data.outsideImage);
          if (data.insideImage) setImgHouseInside(data.insideImage);
        }
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }

    loadSavedDraft();
  }, [selectedStudentId, academicYear, term, visitSessionId, draftKey]);

  // Save draft utility
  const saveCurrentDraft = useCallback(async () => {
    if (!selectedStudentId) return;
    try {
      const data = {
        visitStatus,
        visitDate,
        informantRelation,
        photoSource,
        houseNo,
        houseMoo,
        houseRoad,
        houseTambon,
        houseAmphoe,
        houseProvince,
        familyIncome,
        familyExpense,
        familyDebt,
        teacherSummary,
        gps: {
          lat: mapLat,
          long: mapLong,
          accuracy: gpsAccuracy,
          capturedAt: gpsCapturedAt ? gpsCapturedAt.getTime() : null,
          source: gpsSource,
          overrideReason: gpsOverrideReason,
          state: gpsState,
        },
        // Excludes binary image data (base64/blobs) to avoid IndexedDB QuotaExceededError
        outsideImage: imgHouseOutside,
        insideImage: imgHouseInside,
      };
      await draftDB.saveDraft(draftKey, data);
    } catch (e) {
      console.error("Draft save failed", e);
    }
  }, [
    selectedStudentId,
    visitStatus,
    visitDate,
    informantRelation,
    photoSource,
    houseNo,
    houseMoo,
    houseRoad,
    houseTambon,
    houseAmphoe,
    houseProvince,
    familyIncome,
    familyExpense,
    familyDebt,
    teacherSummary,
    mapLat,
    mapLong,
    gpsAccuracy,
    gpsCapturedAt,
    gpsSource,
    gpsOverrideReason,
    gpsState,
    imgHouseOutside,
    imgHouseInside,
    draftKey,
  ]);

  // Trigger auto-save whenever relevant inputs modify
  useEffect(() => {
    saveCurrentDraft();
  }, [saveCurrentDraft]);

  // ---------------------------------------------------------------------------
  // 7. GPS State Machine Handler (HTML5 Geolocation API with timeout)
  // ---------------------------------------------------------------------------
  const handleCaptureGps = () => {
    setGpsState("REQUESTING");
    setErrorMsg(null);

    if (!navigator.geolocation) {
      setGpsState("FAILED");
      setErrorMsg("เบราวเซอร์ของคุณไม่รองรับบริการตรวจหาพิกัด Geolocation");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setMapLat(position.coords.latitude);
        setMapLong(position.coords.longitude);
        setGpsAccuracy(position.coords.accuracy);
        setGpsCapturedAt(new Date());
        setGpsSource("AUTO");
        setGpsState("SUCCESS");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setGpsState("DENIED");
          setErrorMsg("สิทธิ์การเข้าใช้งานพิกัดถูกปฏิเสธโดยผู้ใช้งาน");
        } else if (error.code === error.TIMEOUT) {
          setGpsState("TIMEOUT");
          setErrorMsg("ไม่สามารถรับสัญญาณพิกัดได้ภายในเวลาที่กำหนด (สัญญาณอ่อน)");
        } else {
          setGpsState("FAILED");
          setErrorMsg("เกิดข้อผิดพลาดในการเรียกพิกัดระบุตำแหน่ง");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // 15-second timeout limit
        maximumAge: 0,
      }
    );
  };

  const handleManualOverrideToggle = () => {
    if (gpsSource === "AUTO") {
      setGpsSource("MANUAL");
      setGpsState("SUCCESS"); // Allows user to fill in values manually
    } else {
      setGpsSource("AUTO");
      // Reset coordinates to force re-fetch
      setMapLat(null);
      setMapLong(null);
      setGpsAccuracy(null);
      setGpsState("IDLE");
    }
  };

  // ---------------------------------------------------------------------------
  // 8. Image Upload & Canvas Compression Handlers
  // ---------------------------------------------------------------------------
  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "outside" | "inside"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setProgress = type === "outside" ? setOutsideUploadProgress : setInsideUploadProgress;
    const setImgData = type === "outside" ? setImgHouseOutside : setImgHouseInside;

    setProgress("กำลังบีบอัดรูปภาพ...");
    setErrorMsg(null);

    try {
      // Resize to max 1600x1600 at quality 0.75 client-side
      const compressed = await compressImage(file);

      setProgress("กำลังอัปโหลดรูปภาพ...");

      const formData = new FormData();
      formData.append("file", compressed.blob, file.name);
      formData.append("width", compressed.width.toString());
      formData.append("height", compressed.height.toString());
      formData.append("capturedAt", compressed.capturedAt.toISOString());

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || "Upload failed");
      }

      setImgData({
        id: resJson.fileRecord.id,
        storagePath: resJson.fileRecord.storagePath,
        width: resJson.fileRecord.width,
        height: resJson.fileRecord.height,
        fileName: resJson.fileRecord.fileName,
      });

      setProgress(null);
    } catch (err: any) {
      console.error(err);
      setProgress(null);
      setErrorMsg(err.message || "เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ");
    }
  };

  const removePhoto = (type: "outside" | "inside") => {
    if (type === "outside") {
      setImgHouseOutside(null);
    } else {
      setImgHouseInside(null);
    }
  };

  // ---------------------------------------------------------------------------
  // 9. Submit Form Handler
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!selectedStudentId) {
      setErrorMsg("กรุณาเลือกนักเรียนที่ต้องการบันทึกการเยี่ยมบ้าน");
      setLoading(false);
      return;
    }

    if (!imgHouseOutside) {
      setErrorMsg("กรุณาอัปโหลดรูปภาพถ่ายนอกบ้าน (เครื่องหมาย * สีแดงบังคับ)");
      setLoading(false);
      return;
    }

    if (gpsSource === "MANUAL" && !gpsOverrideReason) {
      setErrorMsg("กรุณาระบุเหตุผลที่ต้องป้อนพิกัดตำแหน่งแบบป้อนเอง (Manual)");
      setLoading(false);
      return;
    }

    const payload = {
      studentId: selectedStudentId,
      visitStatus,
      visitDate,
      informantRelation,
      photoSource,
      mapLat: mapLat || undefined,
      mapLong: mapLong || undefined,
      gpsAccuracy: gpsAccuracy || undefined,
      gpsCapturedAt: gpsCapturedAt || undefined,
      gpsSource,
      gpsOverrideReason: gpsSource === "MANUAL" ? gpsOverrideReason : undefined,
      imgHouseOutsideId: imgHouseOutside.id,
      imgHouseInsideId: imgHouseInside?.id || undefined,
      houseNo: houseNo || undefined,
      houseMoo: houseMoo || undefined,
      houseRoad: houseRoad || undefined,
      houseTambon: houseTambon || undefined,
      houseAmphoe: houseAmphoe || undefined,
      houseProvince: houseProvince || undefined,
      familyIncome: familyIncome ? parseFloat(familyIncome) : undefined,
      familyExpense: familyExpense ? parseFloat(familyExpense) : undefined,
      familyDebt: familyDebt ? parseFloat(familyDebt) : undefined,
      teacherSummary: teacherSummary || undefined,
    };

    const res = await createVisitAction(payload);

    if (res.success) {
      setSuccessMsg("บันทึกการเยี่ยมบ้านสำเร็จ");
      // Post-Submit Purging: Delete draft immediately from local IndexedDB cache on success
      await draftDB.deleteDraft(draftKey);
      setStep(1);
      setSelectedStudentId("");
      // Reset files
      setImgHouseOutside(null);
      setImgHouseInside(null);
    } else {
      setErrorMsg(res.error || "เกิดข้อผิดพลาดการบันทึกข้อมูลเยี่ยมบ้าน");
    }

    setLoading(false);
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-12">
      {/* Top Header & Connection Tracker */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/60 p-4 border border-slate-800 rounded-2xl backdrop-blur-xs">
        <div>
          <h2 className="text-xl font-bold text-white">บันทึกการเยี่ยมบ้านนักเรียน</h2>
          <p className="text-xs text-slate-400 mt-0.5">แบบฟอร์มตรวจสอบและเยี่ยมบ้านภาคสนาม</p>
        </div>
        <div
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            isOnline
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>ออนไลน์</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>ออฟไลน์</span>
            </>
          )}
        </div>
      </div>

      {/* Draft Save indicator */}
      {selectedStudentId && (
        <div className="text-[11px] text-slate-500 text-right px-1">
          ✓ บันทึกร่างแบบฟอร์มอัตโนมัติในเครื่องแล้ว
        </div>
      )}

      {/* Step Progress Bar with ARIA labels */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
          <span>ความคืบหน้าแบบฟอร์ม</span>
          <span>ขั้นตอน {step}/3 ({(step / 3 * 100).toFixed(0)}%)</span>
        </div>
        <div
          className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={step * 33.3}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`ขั้นตอนที่ ${step} จาก 3`}
        >
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>
      </div>

      {/* Feedback Messages */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center gap-3 text-sm text-emerald-400">
          <Check className="w-5 h-5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl flex items-center gap-3 text-sm text-rose-400">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 0: Selection Settings Panel (Only shown in Step 1 if no student is active) */}
      {step === 1 && !selectedStudentId && (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>เลือกนักเรียนสำหรับการเยี่ยมบ้าน</span>
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-semibold">ค้นหารายชื่อนักเรียน</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
              >
                <option value="">-- เลือกนักเรียน --</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.studentId} | {s.studentName} (ม.{s.classLevel}/{s.room})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-semibold">ปีการศึกษา</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-semibold">ภาคเรียน</label>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 font-semibold">รอบครั้งที่</label>
                <input
                  type="text"
                  value={visitSessionId}
                  onChange={(e) => setVisitSessionId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedStudentId && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* -----------------------------------------------------------------
              STEP 1: VISIT VERIFICATION & MEDIA
              ----------------------------------------------------------------- */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Student Info Card Header */}
              <div className="bg-indigo-950/20 border border-indigo-500/20 p-5 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-lg">
                    {selectedStudent?.studentName.charAt(0) || "S"}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{selectedStudent?.studentName}</h4>
                    <p className="text-xs text-slate-400">
                      ID: {selectedStudent?.studentId} | ม.{selectedStudent?.classLevel}/{selectedStudent?.room}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudentId("")}
                  className="text-xs text-slate-500 hover:text-slate-300 font-semibold p-2 min-h-[48px]"
                >
                  เปลี่ยนนักเรียน
                </button>
              </div>

              {/* Status and Date */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">สถานะการเยี่ยมบ้าน</label>
                  <select
                    value={visitStatus}
                    onChange={(e) => setVisitStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                  >
                    <option value="VISITED">เข้าเยี่ยมเรียบร้อย (VISITED)</option>
                    <option value="NOT_VISITED">ไม่สามารถติดต่อ/ไม่พบ (NOT_VISITED)</option>
                    <option value="WAITING">รอคิวดำเนินงาน (WAITING)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">วันที่เข้าเยี่ยม</label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                  />
                </div>
              </div>

              {/* Geolocation Section */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-400 font-semibold">ข้อมูลพิกัดละติจูด/ลองจิจูด</span>
                  <button
                    type="button"
                    onClick={handleManualOverrideToggle}
                    className="text-xs text-indigo-400 font-medium hover:underline p-2 min-h-[48px]"
                  >
                    {gpsSource === "AUTO" ? "เปิดโหมดเขียนเอง (Manual)" : "เปิดรับพิกัดอัตโนมัติ"}
                  </button>
                </div>

                {/* GPS High Deviation Warning Banner (> 100 meters) */}
                {gpsSource === "AUTO" && gpsAccuracy && gpsAccuracy > 100 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl flex gap-2 text-xs text-yellow-400">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                    <span>พิกัดไม่แม่นยำ (เบี่ยงเบน &gt; 100ม.) กรุณาก้าวออกกลางแจ้ง หรือกดยืนยันใช้งานพิกัดนี้หากจำเป็น</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="เช่น 13.7563"
                      value={mapLat || ""}
                      onChange={(e) => setMapLat(parseFloat(e.target.value) || null)}
                      readOnly={gpsSource === "AUTO"}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="เช่น 100.5018"
                      value={mapLong || ""}
                      onChange={(e) => setMapLong(parseFloat(e.target.value) || null)}
                      readOnly={gpsSource === "AUTO"}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                    />
                  </div>
                </div>

                {gpsSource === "MANUAL" && (
                  <div className="space-y-1.5">
                    <label className="text-xs text-rose-400 font-semibold">เหตุผลที่ต้องป้อนข้อมูลเอง *</label>
                    <select
                      value={gpsOverrideReason}
                      onChange={(e) => setGpsOverrideReason(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                    >
                      <option value="">-- เลือกเหตุผลสำหรับการระบุพิกัดด้วยตัวเอง --</option>
                      <option value="ไม่มีสัญญาณ">ไม่มีสัญญาณโทรศัพท์มือถือ</option>
                      <option value="บ้านอยู่ในป่า">บ้านในป่าลึกสัญญาณจีพีเอสคลาดเคลื่อน</option>
                      <option value="ครูเดินทางไม่ได้">ครูเดินทางไม่ได้ต้องสอบถามตำแหน่งระยะไกล</option>
                      <option value="พิกัดเบราว์เซอร์คลาดเคลื่อน">พิกัดรับส่งเบราว์เซอร์คลาดเคลื่อนเกินระยะจริง</option>
                    </select>
                  </div>
                )}

                {gpsSource === "AUTO" && (
                  <button
                    type="button"
                    onClick={handleCaptureGps}
                    disabled={gpsState === "REQUESTING"}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded-xl text-base font-semibold cursor-pointer min-h-[48px]"
                  >
                    <MapPin className="w-5 h-5 text-indigo-400" />
                    <span>
                      {gpsState === "REQUESTING"
                        ? "กำลังเรียกหาพิกัดดาวเทียม..."
                        : "ดึงข้อมูลพิกัดผ่านสัญญาณดาวเทียม"}
                    </span>
                  </button>
                )}
              </div>

              {/* Photo Upload Card Section */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-5">
                <span className="text-xs text-slate-400 font-semibold">รูปภาพแนบการเข้าเยี่ยมบ้าน</span>

                {/* Outside Image */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-white">
                      1. รูปถ่ายนอกตัวบ้าน <span className="text-rose-500">*</span>
                    </span>
                    {imgHouseOutside && (
                      <button
                        type="button"
                        onClick={() => removePhoto("outside")}
                        className="text-xs text-rose-400 hover:underline p-1 min-h-[48px] inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบรูป</span>
                      </button>
                    )}
                  </div>

                  {outsideUploadProgress && (
                    <div className="text-xs text-slate-400 italic">{outsideUploadProgress}</div>
                  )}

                  {!imgHouseOutside ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl cursor-pointer bg-slate-950/40 p-4 transition-all">
                      <Camera className="w-8 h-8 text-slate-500 mb-1" />
                      <span className="text-xs text-slate-400 text-center font-medium">
                        คลิกเพื่อเลือกไฟล์หรือถ่ายรูปถ่ายนอกบ้าน
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileChange(e, "outside")}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="border border-slate-800 rounded-2xl overflow-hidden p-3 bg-slate-950/30 flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-400 truncate max-w-[240px]">
                        ✓ {imgHouseOutside.fileName}
                      </span>
                      {imgHouseOutside.width && imgHouseOutside.height && (
                        <span className="text-[10px] text-slate-500">
                          {imgHouseOutside.width}x{imgHouseOutside.height}px
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Inside Image */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-white">2. รูปถ่ายภายในบ้าน (ทางเลือก)</span>
                    {imgHouseInside && (
                      <button
                        type="button"
                        onClick={() => removePhoto("inside")}
                        className="text-xs text-rose-400 hover:underline p-1 min-h-[48px] inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบรูป</span>
                      </button>
                    )}
                  </div>

                  {insideUploadProgress && (
                    <div className="text-xs text-slate-400 italic">{insideUploadProgress}</div>
                  )}

                  {!imgHouseInside ? (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-800 hover:border-indigo-500 rounded-2xl cursor-pointer bg-slate-950/40 p-4 transition-all">
                      <Camera className="w-8 h-8 text-slate-500 mb-1" />
                      <span className="text-xs text-slate-400 text-center font-medium">
                        คลิกเพื่อเลือกไฟล์หรือถ่ายรูปถ่ายในบ้าน
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileChange(e, "inside")}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="border border-slate-800 rounded-2xl overflow-hidden p-3 bg-slate-950/30 flex items-center justify-between gap-4">
                      <span className="text-xs text-slate-400 truncate max-w-[240px]">
                        ✓ {imgHouseInside.fileName}
                      </span>
                      {imgHouseInside.width && imgHouseInside.height && (
                        <span className="text-[10px] text-slate-500">
                          {imgHouseInside.width}x{imgHouseInside.height}px
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              STEP 2: FAMILY & ECONOMICS
              ----------------------------------------------------------------- */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">ความสัมพันธ์ของผู้ให้ข้อมูล</label>
                  <select
                    value={informantRelation}
                    onChange={(e) => setInformantRelation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                  >
                    <option value="บิดา">บิดา</option>
                    <option value="มารดา">มารดา</option>
                    <option value="ผู้ปกครอง">ผู้ปกครอง</option>
                    <option value="ญาติ">ญาติสนิท</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-semibold">แหล่งพลังงานรูปภาพที่ใช้</label>
                  <select
                    value={photoSource}
                    onChange={(e) => setPhotoSource(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                  >
                    <option value="MOBILE_CAMERA">กล้องโทรศัพท์มือถือ (MOBILE_CAMERA)</option>
                    <option value="DIGITAL_CAMERA">กล้องดิจิตอลพกพา (DIGITAL_CAMERA)</option>
                    <option value="MANUAL_UPLOAD">อัปโหลดภาพภายหลัง (MANUAL_UPLOAD)</option>
                  </select>
                </div>
              </div>

              {/* Address details */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <span className="text-xs text-slate-400 font-semibold">ที่อยู่ตามการนำเยี่ยมจริง</span>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">บ้านเลขที่</label>
                    <input
                      type="text"
                      placeholder="เช่น 123/4"
                      value={houseNo}
                      onChange={(e) => setHouseNo(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">หมู่ที่</label>
                    <input
                      type="text"
                      placeholder="เช่น 5"
                      value={houseMoo}
                      onChange={(e) => setHouseMoo(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">ถนน</label>
                  <input
                    type="text"
                    placeholder="เช่น สุขุมวิท"
                    value={houseRoad}
                    onChange={(e) => setHouseRoad(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">ตำบล/แขวง</label>
                    <input
                      type="text"
                      placeholder="เช่น คลองเตย"
                      value={houseTambon}
                      onChange={(e) => setHouseTambon(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-500">อำเภอ/เขต</label>
                    <input
                      type="text"
                      placeholder="เช่น คลองเตย"
                      value={houseAmphoe}
                      onChange={(e) => setHouseAmphoe(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">จังหวัด</label>
                  <input
                    type="text"
                    placeholder="เช่น กรุงเทพมหานคร"
                    value={houseProvince}
                    onChange={(e) => setHouseProvince(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                  />
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <span className="text-xs text-slate-400 font-semibold">รายได้และเศรษฐกิจครัวเรือน</span>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">รายได้รวมของครอบครัว (บาท / เดือน)</label>
                  <input
                    type="number"
                    placeholder="เช่น 15000"
                    value={familyIncome}
                    onChange={(e) => setFamilyIncome(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">ค่าใช้จ่ายรวมของครอบครัว (บาท / เดือน)</label>
                  <input
                    type="number"
                    placeholder="เช่น 12000"
                    value={familyExpense}
                    onChange={(e) => setFamilyExpense(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">หนี้สินรวมของครอบครัว (บาท)</label>
                  <input
                    type="number"
                    placeholder="เช่น 50000"
                    value={familyDebt}
                    onChange={(e) => setFamilyDebt(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[48px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              STEP 3: TEACHER SUMMARY & OBSERVATIONS
              ----------------------------------------------------------------- */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
                <span className="text-xs text-slate-400 font-semibold">บันทึกความคิดเห็นและประเมินเพิ่มเติมของครู</span>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-500">ความคิดเห็นของอาจารย์ผู้เยี่ยมบ้าน</label>
                  <textarea
                    rows={4}
                    placeholder="ป้อนรายละเอียดข้อมูลจากการเยี่ยมบ้าน..."
                    value={teacherSummary}
                    onChange={(e) => setTeacherSummary(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-base text-white focus:outline-hidden min-h-[96px]"
                  />
                </div>
              </div>

              {/* Ready to Submit confirmation check */}
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-slate-400 leading-relaxed">
                  เมื่อคุณกดส่งฟอร์มข้อมูลเยี่ยมบ้านนี้ ระบบจะบันทึกข้อมูลเข้าสู่ฐานข้อมูลประวัติ
                  และทำความสะอาดลบแบบฟอร์มแบบร่างออกจากหน่วยความจำในเครื่องของคุณทันที
                </div>
              </div>
            </div>
          )}

          {/* Bottom Sticky Navigation Buttons (separated by 24px per Fitts's Law) */}
          <div className="flex gap-6 justify-between items-center pt-4 border-t border-slate-800/80 bg-slate-950/80 sticky bottom-0 py-4 backdrop-blur-md z-40">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 text-base font-semibold rounded-xl cursor-pointer min-h-[48px] flex items-center gap-1.5 border border-slate-700"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>ย้อนกลับ</span>
              </button>
            ) : (
              <div /> // Keeps spacing consistent
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-base font-semibold rounded-xl cursor-pointer min-h-[48px] flex items-center gap-1.5 shadow-lg shadow-indigo-500/10 ml-auto"
              >
                <span>ขั้นตอนถัดไป</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-850 text-white text-base font-semibold rounded-xl cursor-pointer min-h-[48px] flex items-center gap-2 shadow-lg shadow-indigo-500/15 ml-auto"
              >
                {loading && <div className="border-2 border-slate-300 border-t-white rounded-full animate-spin w-4 h-4" style={{ borderTopColor: "transparent" }} />}
                <span>ส่งบันทึกการเยี่ยมบ้าน</span>
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
