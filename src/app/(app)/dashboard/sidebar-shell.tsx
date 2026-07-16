"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChartPie,
  GraduationCap,
  Wallet,
  User,
  FolderOpen,
  ListTodo,
  Star,
  Shield,
  Upload,
  Menu,
  X,
  LogOut,
  Circle,
  Settings,
} from "lucide-react";

interface SidebarShellProps {
  userName: string;
  userRole: string;
  children: React.ReactNode;
}

interface MenuItem {
  label: string;
  icon: any;
  href: string;
  exact?: boolean;
  disabled?: boolean;
}

interface MenuGroup {
  header: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    header: "Dashboard",
    items: [
      {
        label: "ภาพรวม",
        icon: ChartPie,
        href: "/dashboard",
        exact: true,
      },
    ],
  },
  {
    header: "Management",
    items: [
      {
        label: "วิชาการ",
        icon: GraduationCap,
        href: "/dashboard/academic",
      },
      {
        label: "งบประมาณ",
        icon: Wallet,
        href: "/dashboard/budget",
      },
      {
        label: "บุคคล",
        icon: User,
        href: "/dashboard/hr",
      },
      {
        label: "ทั่วไป",
        icon: FolderOpen,
        href: "/dashboard/general",
      },
      {
        label: "รายการที่ต้องทำ",
        icon: ListTodo,
        href: "/dashboard/todo",
      },
    ],
  },
  {
    header: "Activities",
    items: [
      {
        label: "สำหรับนักเรียน",
        icon: Star,
        href: "/dashboard/student-portal",
      },
      {
        label: "สภานักเรียน",
        icon: Shield,
        href: "/dashboard/student-council",
      },
    ],
  },
  {
    header: "System",
    items: [
      {
        label: "นำเข้าข้อมูล",
        icon: Upload,
        href: "/dashboard/importer",
      },
      {
        label: "ตั้งค่า",
        icon: Settings,
        href: "/dashboard/setting",
      },
    ],
  },
];

export function SidebarShell({ userName, userRole, children }: SidebarShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Load and apply custom fonts from localStorage
  useEffect(() => {
    const applyFonts = () => {
      const savedThai = localStorage.getItem("system-font-thai") || "Sarabun";
      const savedEnglish = localStorage.getItem("system-font-english") || "Inter";

      const fontsToLoad = [];
      if (savedThai) fontsToLoad.push(savedThai.replace(/ /g, "+"));
      if (savedEnglish) fontsToLoad.push(savedEnglish.replace(/ /g, "+"));

      const linkId = "dynamic-google-fonts";
      let linkElement = document.getElementById(linkId) as HTMLLinkElement;
      if (!linkElement) {
        linkElement = document.createElement("link");
        linkElement.id = linkId;
        linkElement.rel = "stylesheet";
        document.head.appendChild(linkElement);
      }
      linkElement.href = `https://fonts.googleapis.com/css2?family=${fontsToLoad.map(f => `${f}:wght@300;400;500;600;700;800;900`).join("&family=")}&display=swap`;

      const styleId = "dynamic-fonts-override";
      let styleElement = document.getElementById(styleId) as HTMLStyleElement;
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

    applyFonts();

    window.addEventListener("system-fonts-changed", applyFonts);
    return () => {
      window.removeEventListener("system-fonts-changed", applyFonts);
    };
  }, []);

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isActive = (href: string, exact?: boolean) => {
    if (href === "#") return false;
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const avatarInitial = userName?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden" style={{ fontFamily: "'Noto Sans Thai', 'Sarabun', sans-serif" }}>

      {/* ===== MOBILE OVERLAY ===== */}
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{
          display: isOpen ? "block" : "none",
          background: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(3px)",
        }}
      />

      {/* ===== SIDEBAR ===== */}
      <aside
        className="fixed top-0 left-0 z-50 h-screen flex flex-col md:relative md:translate-x-0 transition-transform duration-300"
        style={{
          width: "260px",
          minWidth: "260px",
          backgroundColor: "#1e293b",
          color: "#cbd5e1",
          transform: isOpen ? "translateX(0)" : undefined,
          boxShadow: "4px 0 15px rgba(0,0,0,0.05)",
        }}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: "#334155" }}>
          <div
            className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-lg"
            style={{ backgroundColor: "#3b82f6" }}
          >
            S
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-bold text-white text-sm leading-tight">
              School Management System
            </h1>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-6 py-4 border-b" style={{ borderColor: "#334155" }}>
          <div className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-white/5 transition cursor-default">
            <div
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white border-2"
              style={{ backgroundColor: "#475569", borderColor: "#64748b" }}
            >
              {avatarInitial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate leading-tight">{userName}</p>
              <p className="flex items-center gap-1 mt-0.5" style={{ fontSize: "10px", color: "#4ade80" }}>
                <Circle className="w-1.5 h-1.5 fill-current" />
                <span>{userRole}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pb-10 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#475569 transparent" }}>
          {menuGroups.map((group) => (
            <div key={group.header}>
              <div
                className="px-6 pt-5 pb-2"
                style={{
                  fontSize: "0.7rem",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  color: "#64748b",
                  letterSpacing: "0.05em",
                }}
              >
                {group.header}
              </div>

              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);

                if (item.disabled) {
                  return (
                    <div
                      key={item.label}
                      className="flex items-center px-6 py-2.5 cursor-not-allowed select-none"
                      style={{
                        color: "#475569",
                        fontSize: "0.9rem",
                        borderLeft: "3px solid transparent",
                      }}
                    >
                      <Icon className="w-5 h-5 mr-2.5 shrink-0" style={{ opacity: 0.4 }} />
                      <span>{item.label}</span>
                      <span
                        className="ml-auto"
                        style={{
                          fontSize: "9px",
                          background: "#1e293b",
                          border: "1px solid #334155",
                          color: "#64748b",
                          padding: "1px 6px",
                          borderRadius: "4px",
                        }}
                      >
                        Soon
                      </span>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center px-6 py-2.5 transition-all"
                    style={{
                      color: active ? "#ffffff" : "#94a3b8",
                      fontSize: "0.9rem",
                      borderLeft: active ? "3px solid #3b82f6" : "3px solid transparent",
                      backgroundColor: active ? "#334155" : "transparent",
                      textDecoration: "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.05)";
                        (e.currentTarget as HTMLElement).style.color = "#f1f5f9";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                      }
                    }}
                  >
                    <Icon className="w-5 h-5 mr-2.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t" style={{ borderColor: "#334155" }}>
          <form action="/api/logout" method="GET">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-all text-sm font-medium cursor-pointer"
              style={{
                backgroundColor: "rgba(255,255,255,0.04)",
                border: "1px solid #334155",
                color: "#94a3b8",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(239,68,68,0.08)";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.2)";
                (e.currentTarget as HTMLElement).style.color = "#f87171";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.04)";
                (e.currentTarget as HTMLElement).style.borderColor = "#334155";
                (e.currentTarget as HTMLElement).style.color = "#94a3b8";
              }}
            >
              <LogOut className="w-4 h-4" />
              ออกจากระบบ
            </button>
          </form>
        </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header (mobile) */}
        <header
          className="h-14 flex items-center px-4 md:px-8 sticky top-0 z-30 border-b"
          style={{
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          {/* Hamburger – mobile only */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden mr-3 p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition"
          >
            <Menu className="w-5 h-5" />
          </button>

          <h1 className="text-base font-semibold text-slate-700">ระบบงานจัดการโรงเรียน</h1>
        </header>

        {/* Body */}
        <main
          className="flex-1 overflow-y-auto p-4 md:p-8"
          style={{ backgroundColor: "#F8FAFC" }}
        >
          <div style={{ animation: "fadeInUp 0.3s ease-in-out", paddingBottom: "80px" }}>
            {children}
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 767px) {
          aside {
            transform: ${isOpen ? "translateX(0) !important" : "translateX(-100%) !important"};
          }
        }
      `}</style>
    </div>
  );
}
