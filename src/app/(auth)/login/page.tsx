"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "@/lib/auth-client";
import { Lock, User, Eye, EyeOff, Loader2, AlertCircle, Sparkles } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const applySystemFonts = () => {
    const savedThai = localStorage.getItem("system-font-thai") || "Sarabun";
    const savedEnglish = localStorage.getItem("system-font-english") || "Inter";

    const fontsToLoad = [];
    if (savedThai) fontsToLoad.push(savedThai.replace(/ /g, "+"));
    if (savedEnglish) fontsToLoad.push(savedEnglish.replace(/ /g, "+"));

    const linkId = "dynamic-google-fonts";
    let linkElement = document.getElementById(linkId) as HTMLLinkElement | null;
    if (!linkElement) {
      linkElement = document.createElement("link");
      linkElement.id = linkId;
      linkElement.rel = "stylesheet";
      document.head.appendChild(linkElement);
    }
    linkElement.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad.map(
      (font) => `${font}:wght@300;400;500;600;700;800;900`
    ).join("&family=")}&display=swap`;

    const styleId = "dynamic-fonts-override";
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.innerHTML = `
      body, input, select, textarea, button, h1, h2, h3, h4, h5, h6, span, p, a, div {
        font-family: '${savedEnglish}', '${savedThai}', sans-serif !important;
      }
    `;
  };

  // State
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Tab state: "login" or "register"
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Registration Form State
  const [regName, setRegName] = useState("");
  const [regRole, setRegRole] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regReason, setRegReason] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);

  // Splash Screen State
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    applySystemFonts();
    window.addEventListener("system-fonts-changed", applySystemFonts);

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1300);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("system-fonts-changed", applySystemFonts);
    };
  }, []);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const isEmail = usernameOrEmail.includes("@");
      const payload = {
        password,
        rememberMe: true,
        callbackURL: callbackUrl,
      };

      if (isEmail) {
        await signIn.email({
          email: usernameOrEmail,
          ...payload,
        });
      } else {
        await signIn.username({
          username: usernameOrEmail,
          ...payload,
        });
      }

      setLoading(false);
      router.refresh();
      router.push(callbackUrl);
    } catch (err: any) {
      setLoading(false);
      const message = err?.response?.data?.message || err?.message || "ไม่สามารถเข้าสู่ระบบได้ กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง";
      setError(message);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Mock registration request (as in the original UI, it submits to an admin workflow)
    setTimeout(() => {
      setLoading(false);
      setRegSuccess(true);
      // Reset fields
      setRegName("");
      setRegRole("");
      setRegUsername("");
      setRegPassword("");
      setRegReason("");
    }, 1200);
  };

  const handleSocialClick = (provider: string) => {
    alert(`ระบบล็อกอินด้วย ${provider} ยังไม่ได้กำหนดค่า API Keys ในระบบหลังบ้าน`);
  };

  return (
    <>
      {/* ===== BRAND SPLASH SCREEN ===== */}
      {showSplash && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 transition-opacity duration-500">
          <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-5 px-8 animate-fade-in-up">
            <div className="relative flex items-center justify-center mb-1">
              <div className="absolute inset-0 rounded-full bg-purple-500/15 animate-ping opacity-60" style={{ animationDuration: "1.8s" }} />
              <div className="absolute -inset-5 rounded-full bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 blur-xl" />
              <div className="relative w-24 h-24 rounded-[24px] bg-white p-2 shadow-xl border border-slate-100 flex items-center justify-center overflow-hidden">
                <img src="/icon.jpg" alt="Logo" className="w-full h-full object-cover rounded-[18px]" />
              </div>
            </div>

            <h1 className="text-xl font-bold text-white leading-snug">
              โรงเรียนกุดจับประชาสรรค์
            </h1>
            <p className="text-xs font-semibold tracking-[0.12em] text-purple-400 uppercase">
              ระบบจัดการการลา
            </p>

            <div className="w-44 pt-3 mx-auto">
              <div className="h-[3px] w-full bg-slate-800 rounded-full overflow-hidden relative">
                <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full absolute top-0 bottom-0 animate-progress" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== DECORATIVE BACKGROUND ===== */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-purple-100 dark:bg-purple-950/20 blur-[100px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-100 dark:bg-indigo-950/20 blur-[100px] opacity-70" />
      </div>

      {/* ===== MAIN LOGIN CARD ===== */}
      <div className="w-full max-w-[420px] bg-white dark:bg-slate-900 rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] p-8 relative z-10 border border-slate-100 dark:border-slate-800">
        
        {/* Branding Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.06)] mb-4 p-1 border border-slate-100 dark:border-slate-800">
            <img src="/icon.jpg" alt="Logo" className="w-full h-full object-cover rounded-xl" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white text-center leading-tight">
            โรงเรียนกุดจับประชาสรรค์
          </h1>
          <p className="text-sm text-slate-400 mt-1.5 text-center font-medium">
            ระบบจัดการการลา
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-6 border border-slate-200/30 dark:border-slate-700/30">
          <button
            type="button"
            onClick={() => {
              setActiveTab("login");
              setRegSuccess(false);
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "login"
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("register");
              setRegSuccess(false);
              setError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "register"
                ? "bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            สมัครสมาชิก
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-xl text-sm mb-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* ===== TAB CONTENT: LOGIN ===== */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-[20px] w-[20px] text-slate-400" />
              </div>
              <input
                type="text"
                required
                className="w-full h-[50px] pl-[44px] pr-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 transition-all font-medium"
                placeholder="ชื่อผู้ใช้ หรือ อีเมล"
                value={usernameOrEmail}
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-[20px] w-[20px] text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full h-[50px] pl-[44px] pr-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 transition-all font-medium"
                placeholder="รหัสผ่าน"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                className="text-[13px] font-semibold text-purple-600 hover:text-purple-700 dark:text-purple-400 transition-colors cursor-pointer"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[15px] font-semibold hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 shadow-lg shadow-purple-500/10 transition-all duration-200 mt-2 flex items-center justify-center cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>
        )}

        {/* ===== TAB CONTENT: REGISTER ===== */}
        {activeTab === "register" && (
          <>
            {regSuccess ? (
              <div className="text-center py-6 space-y-4 animate-fade-in-up">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-full mx-auto flex items-center justify-center">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <h3 className="text-slate-800 dark:text-white font-bold text-lg">
                  ส่งคำขอเรียบร้อยแล้ว
                </h3>
                <p className="text-sm text-slate-500">
                  คำขอของท่านอยู่ในระหว่างการตรวจสอบโดยผู้ดูแลระบบ
                </p>
                <button
                  onClick={() => {
                    setRegSuccess(false);
                    setActiveTab("login");
                  }}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500 transition cursor-pointer"
                >
                  กลับหน้าเข้าสู่ระบบ
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    className="w-full h-[46px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 transition-all font-medium"
                    placeholder="ชื่อ-นามสกุลจริง"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                  />
                </div>

                <div>
                  <select
                    required
                    className="w-full h-[46px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 transition-all appearance-none font-medium"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                  >
                    <option value="" className="text-slate-500">
                      -- เลือกบทบาทตำแหน่ง --
                    </option>
                    <option value="TEACHER">ครูผู้สอน</option>
                    <option value="HR">งานบุคคล</option>
                    <option value="ACADEMIC">งานวิชาการ</option>
                    <option value="SARABAN">งานสารบรรณ</option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    required
                    className="w-full h-[46px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 transition-all font-medium"
                    placeholder="Username ที่ต้องการ"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                  />
                </div>

                <div>
                  <input
                    type="password"
                    required
                    className="w-full h-[46px] px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 transition-all font-medium"
                    placeholder="กำหนดรหัสผ่าน"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                  />
                </div>

                <div>
                  <textarea
                    rows={2}
                    className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/60 transition-all resize-none font-medium"
                    placeholder="เหตุผลความจำเป็นในการขอเข้าใช้ระบบ"
                    value={regReason}
                    onChange={(e) => setRegReason(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[46px] rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[13px] font-semibold hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 shadow-lg shadow-purple-500/10 transition-all duration-200 mt-2 flex items-center justify-center cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "ส่งคำขอสมัคร"
                  )}
                </button>
              </form>
            )}
          </>
        )}

        {/* ===== SOCIAL LOGINS ===== */}
        {activeTab === "login" && (
          <>
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-100 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[12px] font-semibold">
                <span className="bg-white dark:bg-slate-900 px-4 text-slate-400">
                  หรือเข้าสู่ระบบด้วย
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSocialClick("Google")}
                className="flex items-center justify-center gap-2 h-[46px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-[12px] font-bold text-slate-600 dark:text-slate-355">Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick("Facebook")}
                className="flex items-center justify-center gap-2 h-[46px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
                </svg>
                <span className="text-[12px] font-bold text-slate-600 dark:text-slate-355">Facebook</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick("LINE")}
                className="flex items-center justify-center gap-2 h-[46px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors shadow-sm cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 10.304c0-5.369-5.383-9.738-12-9.738S0 4.935 0 10.304c0 4.814 4.27 8.846 10.035 9.608.391.084.922.258 1.057.592.122.302.079.768.038 1.084l-.168 1.02c-.053.303-.243 1.183 1.037.643 1.28-.54 6.91-4.069 9.428-6.967C23.11 14.364 24 12.435 24 10.304z" fill="#00C300" />
                </svg>
                <span className="text-[12px] font-bold text-slate-600 dark:text-slate-355">LINE</span>
              </button>
            </div>
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-[11px] text-slate-400 font-medium">
            ©2026 developer Panchapon KP-school
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes progressAnimation {
          0%   { left: -100%; width: 30%; }
          50%  { width: 60%; }
          100% { left: 100%; width: 30%; }
        }
        .animate-progress {
          animation: progressAnimation 1.6s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}

export default function LoginPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center bg-[#F4F7FB] dark:bg-slate-950 px-4 py-12 relative overflow-hidden"
      style={{ fontFamily: "'Inter', 'Sarabun', sans-serif" }}
    >
      <Suspense fallback={
        <div className="w-full max-w-md bg-white border border-slate-100 p-8 rounded-3xl flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span className="text-sm text-slate-400">กำลังดาวน์โหลดข้อมูลล็อกอิน...</span>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
