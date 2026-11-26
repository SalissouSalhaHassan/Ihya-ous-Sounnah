"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  BookOpen,
  HeartHandshake,
  Droplet,
  RefreshCw,
  Languages,
  Users,
  BookMarked,
  Car,
  Library,
  Scale,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  LogIn,
  X,
  ClipboardList,
  Award,
  KeyRound,
  Settings,
  LayoutDashboard,
} from "lucide-react";
import { LOCALES } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-context";
import { useIdentitySettings } from "@/lib/identity-settings";

const STANDALONE_PREFIXES = ["/login", "/verify/"];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const { currentLocale, setCurrentLocale, t, isRtl } = useLocale();
  const identity = useIdentitySettings();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("mosques");

  useEffect(() => {
    if (pathname !== "/") return;
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    if (tabParam) {
      queueMicrotask(() => setCurrentTab(tabParam));
    }

    const onSwitchTab = (e: Event) => {
      const next = (e as CustomEvent<string>).detail;
      if (next) setCurrentTab(next);
    };
    window.addEventListener("manara:switch-tab", onSwitchTab);
    return () => window.removeEventListener("manara:switch-tab", onSwitchTab);
  }, [pathname]);

  const isStandalone =
    STANDALONE_PREFIXES.some((p) => pathname.startsWith(p)) ||
    (pathname.startsWith("/portal/project/") && pathname !== "/portal/project");

  if (isStandalone) {
    return <>{children}</>;
  }

  const activeTab = pathname === "/" ? currentTab : null;

  const coreNavItems = [
    { id: "mosques", label: t.nav.mosques, icon: Building2 },
    { id: "quran", label: t.nav.quran, icon: BookOpen },
    { id: "marriage", label: t.nav.marriage, icon: HeartHandshake },
    { id: "sync", label: t.nav.sync, icon: RefreshCw },
  ];

  const moduleLinks = [
    { href: "/dashboard", label: t.sidebar.dashboard, icon: LayoutDashboard, color: "text-emerald-400" },
    { href: "/mosques/maintenance", label: t.sidebar.maintenance, icon: Building2, color: "text-emerald-400" },
    { href: "/mosques/security", label: t.sidebar.security, icon: Car, color: "text-blue-400" },
    { href: "/mosques/funerals", label: t.sidebar.funerals, icon: Users, color: "text-purple-400" },
    { href: "/scholars/fatwa", label: t.sidebar.scholars, icon: BookOpen, color: "text-amber-400" },
    { href: "/mosques/library", label: t.sidebar.library, icon: Library, color: "text-teal-400" },
    { href: "/finance/zakat", label: t.sidebar.zakat, icon: Scale, color: "text-emerald-400" },
    { href: "/portal/project", label: t.sidebar.donorPortal, icon: Droplet, color: "text-cyan-400" },
    { href: "/magazine", label: t.sidebar.magazine, icon: BookMarked, color: "text-rose-400" },
    { href: "/bilan-2026", label: t.sidebar.bilan2026, icon: ClipboardList, color: "text-emerald-400" },
    { href: "/commissions", label: t.sidebar.commissions2026, icon: Award, color: "text-amber-400" },
    { href: "/access-control", label: t.sidebar.accessControl, icon: KeyRound, color: "text-rose-400" },
    { href: "/settings", label: t.sidebar.settings, icon: Settings, color: "text-cyan-400" },
  ];

  const activeTitle =
    coreNavItems.find((i) => i.id === activeTab)?.label ||
    moduleLinks.find((m) => pathname.startsWith(m.href))?.label ||
    t.appName;

  const handleCoreClick = (tabId: string) => {
    setMobileSidebarOpen(false);
    setCurrentTab(tabId);
    if (pathname === "/") {
      window.dispatchEvent(new CustomEvent("manara:switch-tab", { detail: tabId }));
      router.replace(`/?tab=${tabId}`, { scroll: false });
    } else {
      router.push(`/?tab=${tabId}`);
    }
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 print:bg-white print:text-slate-900 flex selection:bg-emerald-500 selection:text-white ${isRtl ? "rtl font-sans" : "ltr"
        }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/75 backdrop-blur-sm lg:hidden print:hidden"
        />
      )}

      {/* Persistent Collapsible Sidebar */}
      <aside
        className={`print:hidden fixed inset-y-0 start-0 z-50 lg:sticky lg:top-0 lg:h-screen bg-slate-900/95 backdrop-blur-xl border-e border-slate-800/90 flex flex-col transition-all duration-300 shrink-0 ${sidebarCollapsed ? "lg:w-20" : "lg:w-72"
          } w-72 ${mobileSidebarOpen
            ? "translate-x-0"
            : isRtl
              ? "translate-x-full lg:translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="h-16 px-4 border-b border-slate-800/80 flex items-center justify-between gap-2 shrink-0">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 ring-2 ring-emerald-400/30 shrink-0">
              <Building2 className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0">
                <span className="text-base font-black tracking-tight text-white block truncate">
                  {t.appName}
                </span>
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  ERP 2026
                </span>
              </div>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setSidebarCollapsed((prev) => !prev)}
            className="hidden lg:flex p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={sidebarCollapsed ? t.sidebar.expand : t.sidebar.collapse}
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-4 h-4" />
            ) : (
              <PanelLeftClose className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div className="space-y-1.5">
            {!sidebarCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {t.sidebar.coreSections}
              </div>
            )}
            {coreNavItems.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleCoreClick(tab.id)}
                  title={tab.label}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center gap-3 cursor-pointer ${sidebarCollapsed ? "justify-center" : ""
                    } ${isActive
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                    }`}
                >
                  <tab.icon className="w-4 h-4 shrink-0" />
                  {!sidebarCollapsed && <span className="truncate">{tab.label}</span>}
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5 pt-3 border-t border-slate-800/80">
            {!sidebarCollapsed && (
              <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                <span>{t.sidebar.specializedModules}</span>
                <span className="text-emerald-400">{moduleLinks.length}</span>
              </div>
            )}
            {moduleLinks.map((mod) => {
              const isActive = pathname.startsWith(mod.href);
              return (
                <Link
                  key={mod.href}
                  href={mod.href}
                  title={mod.label}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs transition flex items-center gap-3 ${sidebarCollapsed ? "justify-center" : ""
                    } ${isActive
                      ? "bg-slate-800 text-white border border-emerald-500/40 shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                    }`}
                >
                  <mod.icon className={`w-4 h-4 shrink-0 ${mod.color}`} />
                  {!sidebarCollapsed && <span className="truncate">{mod.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-slate-800/80 shrink-0">
          <Link
            href="/login"
            title={t.sidebar.loginPortal}
            className={`w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs font-bold text-emerald-400 transition flex items-center gap-2.5 ${sidebarCollapsed ? "justify-center" : ""
              }`}
          >
            <LogIn className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span>{t.sidebar.loginPortal}</span>}
          </Link>
        </div>
      </aside>

      {/* Print-only Official Logo Watermark (repeats on every printed page) */}
      {identity.showWatermarkOnPrint && identity.logoUrl && (
        <div
          aria-hidden="true"
          className="hidden print:flex fixed inset-0 z-0 items-center justify-center pointer-events-none"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={identity.logoUrl}
            alt=""
            className="w-[420px] max-w-[65%] h-auto object-contain opacity-[0.09]"
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="print:hidden sticky top-0 z-30 backdrop-blur-xl bg-slate-900/80 border-b border-emerald-900/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-black text-white truncate">
                  {activeTitle}
                </h1>
                <p className="text-[11px] text-slate-400 hidden sm:block truncate">
                  {t.tagline}
                </p>
              </div>
            </div>

            <div className="flex bg-slate-800/90 rounded-xl p-1 border border-slate-700/60 shadow-inner">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => setCurrentLocale(loc.code)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all duration-200 flex items-center gap-1 cursor-pointer ${currentLocale === loc.code
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                    }`}
                >
                  <Languages className="w-3 h-3" />
                  <span className="hidden sm:inline">{loc.nativeName}</span>
                  <span className="sm:hidden">{loc.code.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
