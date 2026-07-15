"use client";

import { useState } from "react";
import { Loader2, Upload, CheckCircle2, AlertTriangle, FileSpreadsheet, Play, RotateCcw } from "lucide-react";
import { StudentImportSchema } from "@/features/student/schemas";

// Simple helper to parse CSV client-side
function parseCSV(text: string): any[] {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
  if (lines.length === 0) return [];
  
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    return headers.reduce((obj: any, header, index) => {
      obj[header] = values[index] || null;
      return obj;
    }, {});
  });
}

// Deterministic SHA-256 helper for browser client
async function computeSHA256(text: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function ImporterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [validCount, setValidCount] = useState(0);
  const [invalidCount, setInvalidCount] = useState(0);
  const [duplicateCount, setDuplicateCount] = useState(0);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  
  const [status, setStatus] = useState<"idle" | "parsed" | "importing" | "success" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [timeTaken, setTimeTaken] = useState<number | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setStatus("idle");
    setValidationErrors([]);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      let parsedRows: any[] = [];

      try {
        if (selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".xls")) {
          // Dynamic Import to avoid Bundle Bloat
          const { read, utils } = await import("xlsx");
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const workbook = read(arrayBuffer, { type: "array" });
          const firstSheet = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheet];
          parsedRows = utils.sheet_to_json(sheet);
        } else {
          parsedRows = parseCSV(text);
        }

        // Run Client-side validation
        let valid = 0;
        let invalid = 0;
        let dups = 0;
        const ids = new Set<string>();
        const errorsList: string[] = [];

        parsedRows.forEach((row, idx) => {
          const parsed = StudentImportSchema.safeParse(row);
          if (!parsed.success) {
            invalid++;
            if (errorsList.length < 5) {
              errorsList.push(`แถวที่ ${idx + 2}: ${JSON.stringify(parsed.error.flatten().fieldErrors)}`);
            }
          } else {
            if (ids.has(parsed.data.studentId)) {
              dups++;
            } else {
              ids.add(parsed.data.studentId);
              valid++;
            }
          }
        });

        setRows(parsedRows);
        setValidCount(valid);
        setInvalidCount(invalid);
        setDuplicateCount(dups);
        setValidationErrors(errorsList);
        setStatus("parsed");
      } catch (err: any) {
        setStatus("failed");
        setValidationErrors(["โครงสร้างไฟล์ไม่ถูกต้องหรือไม่สามารถอ่านไฟล์ได้"]);
      }
    };

    if (selectedFile.name.endsWith(".xlsx") || selectedFile.name.endsWith(".xls")) {
      reader.readAsArrayBuffer(selectedFile);
    } else {
      reader.readAsText(selectedFile);
    }
  };

  const handleExecuteImport = async () => {
    if (rows.length === 0) return;
    setStatus("importing");
    setProgress(0);
    const startImportTime = Date.now();

    try {
      // 1. Initialize Job on server
      const initRes = await fetch("/api/import/job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file?.name || "import_file",
          targetDomain: "STUDENT",
          totalRows: rows.length,
        }),
      });

      if (!initRes.ok) throw new Error("Failed to initialize import job");
      const { jobId: serverJobId } = await initRes.json();
      setJobId(serverJobId);

      // 2. Batch Chunk sending (200 rows per chunk)
      const chunkSize = 200;
      const totalChunks = Math.ceil(rows.length / chunkSize);

      for (let i = 0; i < totalChunks; i++) {
        const startIndex = i * chunkSize;
        const chunkRows = rows.slice(startIndex, startIndex + chunkSize);

        // Sort keys recursively for deterministic hashing
        const sortedChunk = chunkRows.map(row => 
          Object.keys(row).sort().reduce((sorted: any, key) => {
            sorted[key] = row[key];
            return sorted;
          }, {})
        );

        const payloadHash = await computeSHA256(JSON.stringify(sortedChunk));

        const response = await fetch("/api/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId: serverJobId,
            chunkId: `chunk-${i}`,
            payloadHash,
            domain: "STUDENT",
            rowIndexStart: startIndex,
            rows: chunkRows,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || `Chunk ${i} failed to import`);
        }

        setProgress(Math.round(((i + 1) / totalChunks) * 100));
      }

      setTimeTaken(Date.now() - startImportTime);
      setStatus("success");
    } catch (err: any) {
      setStatus("failed");
      setValidationErrors([err.message || "เกิดข้อผิดพลาดระหว่างนำเข้าข้อมูล"]);
    }
  };

  const handleRollback = async () => {
    if (!jobId) return;
    setStatus("importing");
    try {
      const res = await fetch("/api/import/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      
      if (!res.ok) throw new Error("Rollback failed");
      setStatus("idle");
      setFile(null);
      setRows([]);
      alert("กู้คืนข้อมูลสำเร็จ (Rollback Completed)");
    } catch (err: any) {
      setStatus("failed");
      setValidationErrors([err.message || "การกู้คืนข้อมูลล้มเหลว"]);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-2">อัปโหลดแฟ้มข้อมูลนำเข้า</h2>
        <p className="text-slate-400 text-sm">
          เลือกไฟล์ CSV หรือ Excel เพื่อนำข้อมูลนักเรียนเข้าสู่ระบบ (ระบบจะตรวจสอบความถูกต้องก่อนเขียนลงฐานข้อมูลจริง)
        </p>

        {/* Upload Card */}
        <div className="mt-6 border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-8 text-center transition-all bg-slate-950/20 relative">
          <input
            type="file"
            accept=".csv, .xlsx, .xls"
            onChange={handleFileChange}
            disabled={status === "importing"}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="p-4 bg-indigo-500/10 rounded-full text-indigo-400 border border-indigo-500/15">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">คลิกเพื่อเลือกไฟล์ หรือลากมาวางที่นี่</p>
              <p className="text-xs text-slate-500 mt-1">รองรับไฟล์ CSV, XLSX ขนาดไม่เกิน 5,000 แถว</p>
            </div>
          </div>
        </div>

        {file && (
          <div className="mt-4 flex items-center justify-between bg-slate-950/80 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-5 h-5 text-indigo-400" />
              <span className="text-sm font-medium text-white truncate">{file.name}</span>
            </div>
            <span className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        )}
      </div>

      {/* Dry-run validation report */}
      {status === "parsed" && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-400" />
            รายงานตรวจสอบความถูกต้องของข้อมูล (Dry-Run Preview)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">ระเบียนปกติ</span>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{validCount}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">รหัสซ้ำในไฟล์</span>
              <p className="text-2xl font-bold text-amber-400 mt-1">{duplicateCount}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
              <span className="text-xs text-slate-400 font-medium">ข้อมูลเสีย / ไม่สมบูรณ์</span>
              <p className="text-2xl font-bold text-rose-500 mt-1">{invalidCount}</p>
            </div>
          </div>

          {validationErrors.length > 0 && (
            <div className="bg-rose-950/20 border border-rose-500/10 p-4 rounded-xl space-y-2">
              <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> ตัวอย่างข้อผิดพลาดที่พบ (5 แถวแรก)
              </span>
              <ul className="list-disc pl-5 space-y-1 text-xs text-rose-300/80 font-mono">
                {validationErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleExecuteImport}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <Play className="w-4 h-4" /> นำเข้าข้อมูลจริง (Execute)
            </button>
          </div>
        </div>
      )}

      {/* Progress execution screen */}
      {status === "importing" && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center py-12 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />
          <div>
            <h3 className="font-semibold text-white text-lg">กำลังประมวลผลนำเข้าข้อมูล...</h3>
            <p className="text-slate-500 text-xs mt-1">แบ่งส่งข้อมูลเป็นกลุ่มละ 200 รายการเพื่อป้องกัน Server ค้าง</p>
          </div>
          <div className="w-full max-w-md bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 mt-2">
            <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-mono text-indigo-400">{progress}% เสร็จสิ้น</span>
        </div>
      )}

      {/* Success state */}
      {status === "success" && (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center py-12 gap-4">
          <div className="p-4 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">นำเข้าข้อมูลสำเร็จแล้ว!</h3>
            <p className="text-slate-400 text-sm mt-1">บันทึกสถิติและประวัติข้อมูลนำเข้าลงฐานข้อมูลเสร็จสิ้น</p>
            {timeTaken && (
              <p className="text-slate-500 text-xs font-mono mt-1">เวลาในการส่ง: {(timeTaken / 1000).toFixed(2)} วินาที</p>
            )}
          </div>
          <div className="flex gap-4 mt-2">
            <button
              onClick={handleRollback}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/20 text-slate-400 hover:text-rose-400 text-sm font-semibold rounded-xl transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> กู้คืนข้อมูล (Rollback)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
