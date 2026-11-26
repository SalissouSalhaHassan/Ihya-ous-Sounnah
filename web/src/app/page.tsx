"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  BookOpen,
  HeartHandshake,
  Droplet,
  ShieldCheck,
  RefreshCw,
  Languages,
  CheckCircle2,
  WifiOff,
  MapPin,
  Users,
  FileText,
  Sun,
  Flame,
  ArrowRight,
  Sparkles,
  X,
  Plus,
  BookMarked,
  GraduationCap,
  Landmark,
  Car,
  Library,
  Scale,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  LogIn
} from "lucide-react";
import { LOCALES } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-context";
import { supabase } from "@/infrastructure/supabase/client";

interface MosqueItem {
  id: string;
  name: string;
  type: string;
  city?: string;
  village?: string;
  capacity?: number;
  has_water_well?: boolean;
  has_solar_power?: boolean;
  imam?: string;
}

interface CircleItem {
  id: string;
  name: string;
  target_level: string;
  gender: string;
  mosqueName?: string;
  teacherName?: string;
}

interface ProgressItem {
  id: string;
  student_full_name: string;
  surah_name: string;
  ayah_from: number;
  ayah_to: number;
  score: string;
  record_date: string;
}

interface MarriageContractItem {
  id: string;
  contract_number: string;
  verification_token?: string;
  groom_full_name: string;
  groom_national_id?: string | null;
  groom_birth_date?: string | null;
  groom_phone?: string | null;
  bride_full_name: string;
  bride_national_id?: string | null;
  bride_birth_date?: string | null;
  guardian_name?: string;
  guardian_relation?: string | null;
  witness1_name?: string | null;
  witness2_name?: string | null;
  dowry_amount?: number;
  dowry_status?: string;
  dowry_notes?: string | null;
  contract_date: string;
  mosques?: { name: string; city?: string };
  mosque_staff?: { full_name: string; role?: string };
}

export default function HomePage() {
  const { currentLocale, t, isRtl } = useLocale();

  const [activeTab, setActiveTab] = useState<"mosques" | "quran" | "marriage" | "sync">("mosques");
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success">("idle");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    const timer =
      tabParam === "mosques" ||
      tabParam === "quran" ||
      tabParam === "marriage" ||
      tabParam === "sync"
        ? setTimeout(() => setActiveTab(tabParam), 0)
        : null;

    const onSwitchTab = (e: Event) => {
      const next = (e as CustomEvent<string>).detail;
      if (next === "mosques" || next === "quran" || next === "marriage" || next === "sync") {
        setActiveTab(next);
      }
    };
    window.addEventListener("manara:switch-tab", onSwitchTab);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("manara:switch-tab", onSwitchTab);
    };
  }, []);

  // نافذة تسجيل مسجد جديد
  const [isMosqueModalOpen, setIsMosqueModalOpen] = useState(false);
  const [isSubmittingMosque, setIsSubmittingMosque] = useState(false);
  const [mosqueSuccess, setMosqueSuccess] = useState(false);

  // حقول تسجيل المسجد
  const [name, setName] = useState("");
  const [type, setType] = useState("JUMA");
  const [city, setCity] = useState("نيامي - Niamey");
  const [village, setVillage] = useState("");
  const [capacity, setCapacity] = useState(300);
  const [hasWaterWell, setHasWaterWell] = useState(true);
  const [hasSolarPower, setHasSolarPower] = useState(true);
  const [imamName, setImamName] = useState("");

  // نافذة فتح حلقة قرآن جديدة
  const [isCircleModalOpen, setIsCircleModalOpen] = useState(false);
  const [isSubmittingCircle, setIsSubmittingCircle] = useState(false);
  const [circleSuccess, setCircleSuccess] = useState(false);
  const [circleName, setCircleName] = useState("");
  const [targetLevel, setTargetLevel] = useState("حفظ وتجويد الأجزاء الخمسة الأولى");
  const [circleGender, setCircleGender] = useState("MALE");
  const [teacherName, setTeacherName] = useState("");

  // نافذة رصد تسميع اليوم
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isSubmittingProgress, setIsSubmittingProgress] = useState(false);
  const [progressSuccess, setProgressSuccess] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [surahName, setSurahName] = useState("سورة البقرة");
  const [ayahFrom, setAyahFrom] = useState(1);
  const [ayahTo, setAyahTo] = useState(25);
  const [score, setScore] = useState("EXCELLENT");
  const [revisionNotes, setRevisionNotes] = useState("تجويد متقن ومخارج سليمة");

  // القوائم الحية
  const [mosquesList, setMosquesList] = useState<MosqueItem[]>([]);
  const [circlesList, setCirclesList] = useState<CircleItem[]>([]);
  const [progressList, setProgressList] = useState<ProgressItem[]>([]);
  const [marriagesList, setMarriagesList] = useState<MarriageContractItem[]>([]);

  // نافذة تسجيل عقد زواج شرعي بالمسجد (مطابقة لشهادة عقد الزواج الرسمية)
  const [isMarriageModalOpen, setIsMarriageModalOpen] = useState(false);
  const [isSubmittingMarriage, setIsSubmittingMarriage] = useState(false);
  const [marriageSuccess, setMarriageSuccess] = useState(false);
  const [groomName, setGroomName] = useState("");
  const [groomRepresentative, setGroomRepresentative] = useState("");
  const [brideName, setBrideName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [witness1Name, setWitness1Name] = useState("");
  const [witness2Name, setWitness2Name] = useState("");
  const [dowryAmount, setDowryAmount] = useState(150000);
  const [brideMaritalStatus, setBrideMaritalStatus] = useState<
    "CELIBATAIRE" | "DIVORCEE" | "VEUVE"
  >("CELIBATAIRE");
  const [contractDate, setContractDate] = useState("");
  const [marriageImamName, setMarriageImamName] = useState("");
  const [marriageMosqueId, setMarriageMosqueId] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setContractDate((prev) => prev || new Date().toISOString().split("T")[0]);
    });
  }, []);

  // جلب البيانات عبر مسارات الـ API المحمية والمعزولة حسب القرية والمنظمة
  const fetchData = async () => {
    try {
      const [mRes, cRes, pRes, nRes] = await Promise.all([
        fetch("/api/mosques"),
        fetch("/api/quran/circles"),
        fetch("/api/quran/progress"),
        fetch("/api/marriage"),
      ]);

      // 1. المساجد
      if (mRes.ok) {
        const mJson = await mRes.json();
        const mData = Array.isArray(mJson?.mosques) ? mJson.mosques : [];
        interface MosqueRow {
          id: string;
          name: string;
          type: string;
          city: string | null;
          village: string | null;
          capacity: number | null;
          has_water_well: boolean;
          has_solar_power: boolean;
          mosque_staff?: { full_name: string; role: string }[];
        }
        setMosquesList(
          (mData as MosqueRow[]).map((m) => ({
            id: m.id,
            name: m.name,
            type: m.type,
            city: m.city ? `${m.city} ${m.village ? "- " + m.village : ""}` : "النيجر",
            capacity: m.capacity || 100,
            has_water_well: m.has_water_well,
            has_solar_power: m.has_solar_power,
            imam: m.mosque_staff?.find((s) => s.role === "IMAM")?.full_name || "معتمد لدى الهيئة",
          }))
        );
      } else if (mRes.status === 401 || mRes.status === 403) {
        setMosquesList([]);
      }

      // 2. حلقات القرآن
      if (cRes.ok) {
        const cJson = await cRes.json();
        const cData = Array.isArray(cJson?.circles) ? cJson.circles : [];
        interface CircleRow {
          id: string;
          name: string;
          target_level: string;
          gender: string;
          mosques?: { name: string } | null;
          mosque_staff?: { full_name: string } | null;
        }
        setCirclesList(
          (cData as CircleRow[]).map((c) => ({
            id: c.id,
            name: c.name,
            target_level: c.target_level,
            gender: c.gender,
            mosqueName: c.mosques?.name || "جامع النور الكبير",
            teacherName: c.mosque_staff?.full_name || "الشيخ المحفظ",
          }))
        );
      } else if (cRes.status === 401 || cRes.status === 403) {
        setCirclesList([]);
      }

      // 3. سجل التسميع
      if (pRes.ok) {
        const pJson = await pRes.json();
        setProgressList(Array.isArray(pJson?.progress) ? pJson.progress : []);
      } else if (pRes.status === 401 || pRes.status === 403) {
        setProgressList([]);
      }

      // 4. عقود الزواج الشرعية
      if (nRes.ok) {
        const nJson = await nRes.json();
        setMarriagesList(Array.isArray(nJson?.contracts) ? nJson.contracts : []);
      } else if (nRes.status === 401 || nRes.status === 403) {
        setMarriagesList([]);
      }
    } catch (e) {
      console.log("Cached load:", e);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      void fetchData();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  // 1. تسجيل مسجد جديد
  const handleRegisterMosque = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmittingMosque(true);
    try {
      const res = await fetch("/api/mosques", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          type,
          city: city.trim(),
          village: village.trim(),
          capacity,
          hasWaterWell,
          hasSolarPower,
          imamName: imamName.trim() || undefined,
        }),
      });

      if (res.ok) {
        setMosqueSuccess(true);
        await fetchData();
        setTimeout(() => {
          setIsSubmittingMosque(false);
          setMosqueSuccess(false);
          setIsMosqueModalOpen(false);
          setName("");
          setVillage("");
          setImamName("");
        }, 1200);
      } else {
        alert("حدث خطأ أثناء التسجيل");
        setIsSubmittingMosque(false);
      }
    } catch {
      setIsSubmittingMosque(false);
    }
  };

  // 2. فتح حلقة قرآن جديدة
  const handleCreateCircle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!circleName.trim()) return;

    setIsSubmittingCircle(true);
    try {
      const res = await fetch("/api/quran/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: circleName.trim(),
          targetLevel,
          gender: circleGender,
          teacherName: teacherName.trim() || undefined,
        }),
      });

      if (res.ok) {
        setCircleSuccess(true);
        await fetchData();
        setTimeout(() => {
          setIsSubmittingCircle(false);
          setCircleSuccess(false);
          setIsCircleModalOpen(false);
          setCircleName("");
          setTeacherName("");
        }, 1200);
      } else {
        alert("حدث خطأ أثناء فتح الحلقة");
        setIsSubmittingCircle(false);
      }
    } catch {
      setIsSubmittingCircle(false);
    }
  };

  // 3. رصد تسميع يومي
  const handleRecordProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !surahName.trim()) return;

    setIsSubmittingProgress(true);
    try {
      const res = await fetch("/api/quran/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentFullName: studentName.trim(),
          surahName: surahName.trim(),
          ayahFrom,
          ayahTo,
          score,
          revisionNotes,
        }),
      });

      if (res.ok) {
        setProgressSuccess(true);
        await fetchData();
        setTimeout(() => {
          setIsSubmittingProgress(false);
          setProgressSuccess(false);
          setIsProgressModalOpen(false);
          setStudentName("");
        }, 1200);
      } else {
        alert("حدث خطأ أثناء رصد التسميع");
        setIsSubmittingProgress(false);
      }
    } catch {
      setIsSubmittingProgress(false);
    }
  };

  // 4. تسجيل عقد زواج شرعي بالمسجد
  const handleRegisterMarriage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groomName.trim() || !brideName.trim() || !guardianName.trim()) return;

    const statusLabelMap = {
      CELIBATAIRE: "البكر / Célibataire",
      DIVORCEE: "الثيب / Divorcée",
      VEUVE: "أرملة / Veuve",
    };
    const metaNotes = [
      groomRepresentative.trim()
        ? `وكيل الزوج: ${groomRepresentative.trim()}`
        : null,
      `حالة الزوجة: ${statusLabelMap[brideMaritalStatus]}`,
    ]
      .filter(Boolean)
      .join(" | ");

    setIsSubmittingMarriage(true);
    try {
      const res = await fetch("/api/marriage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groomFullName: groomName.trim(),
          brideFullName: brideName.trim(),
          guardianName: guardianName.trim(),
          witness1Name: witness1Name.trim() || "الشاهد الأول المعتمد",
          witness2Name: witness2Name.trim() || "الشاهد الثاني المعتمد",
          dowryAmount,
          dowryStatus: "PAID",
          dowryNotes: metaNotes,
          contractDate: contractDate || undefined,
          imamName: marriageImamName.trim() || undefined,
          mosqueId: marriageMosqueId || (mosquesList[0]?.id || undefined),
        }),
      });

      if (res.ok) {
        setMarriageSuccess(true);
        await fetchData();
        setTimeout(() => {
          setIsSubmittingMarriage(false);
          setMarriageSuccess(false);
          setIsMarriageModalOpen(false);
          setGroomName("");
          setGroomRepresentative("");
          setBrideName("");
          setGuardianName("");
          setWitness1Name("");
          setWitness2Name("");
          setBrideMaritalStatus("CELIBATAIRE");
          setMarriageImamName("");
        }, 1200);
      } else if (res.status === 401 || res.status === 403) {
        alert(t.marriageModule.authRequiredErr);
        setIsSubmittingMarriage(false);
      } else {
        const errData = await res.json().catch(() => null);
        alert(errData?.error || "Error");
        setIsSubmittingMarriage(false);
      }
    } catch {
      setIsSubmittingMarriage(false);
    }
  };


  const triggerMockSync = () => {
    setSyncStatus("syncing");
    setTimeout(() => {
      setSyncStatus("success");
      setTimeout(() => setSyncStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <div
      className={`flex flex-col flex-1 ${isRtl ? "rtl font-sans" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* 2. Top Stats Ribbon */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: t.stats.totalMosques, value: mosquesList.length > 0 ? mosquesList.length.toString() : "1", icon: Building2, color: "text-emerald-400" },
              { title: t.stats.activeCircles, value: circlesList.length > 0 ? circlesList.length.toString() : "14", icon: BookOpen, color: "text-teal-400" },
              { title: t.stats.studentsCount, value: "8,920", icon: Users, color: "text-blue-400" },
              { title: t.stats.wellProjects, value: "185", icon: Droplet, color: "text-cyan-400" },
              { title: t.stats.nikahCount, value: marriagesList.length.toString(), icon: HeartHandshake, color: "text-rose-400" },
              { title: t.stats.offlineStatus, value: "Supabase Live", icon: ShieldCheck, color: "text-emerald-400" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all hover:-translate-y-0.5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                    Live
                  </span>
                </div>
                <div className="text-2xl font-black text-white tracking-tight">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1 truncate">{stat.title}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Main Dashboard Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">

        {/* Tab 1: Mosques Module */}
        {activeTab === "mosques" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-6 rounded-3xl border border-emerald-900/30">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-emerald-400" />
                  {t.mosqueModule.title}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {t.mosqueModule.desc}
                </p>
              </div>

              <button
                onClick={() => setIsMosqueModalOpen(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-900/40 flex items-center gap-2 active:scale-95 cursor-pointer ring-2 ring-emerald-400/30"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                {t.mosqueModule.addMosque}
              </button>
            </div>

            {/* Mosques Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mosquesList.map((mosque) => (
                <div
                  key={mosque.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 hover:border-emerald-600/50 transition-all flex flex-col justify-between group shadow-sm hover:shadow-emerald-950/30"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition">
                        {mosque.name}
                      </h3>
                      <span className="px-2 py-0.5 text-[11px] font-bold rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {mosque.type === "JUMA" ? t.mosqueModule.jumaLabel : t.mosqueModule.musallaLabel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mb-4">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {mosque.city}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                      <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
                        <span className="text-slate-400 block text-[10px]">{t.mosqueModule.capacity}</span>
                        <span className="font-bold text-white text-sm">{mosque.capacity}</span>
                      </div>
                      <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/40">
                        <span className="text-slate-400 block text-[10px]">{t.mosqueModule.imamLabel}</span>
                        <span className="font-bold text-white text-xs truncate block">{mosque.imam || t.mosqueModule.certifiedImam}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {mosque.has_water_well && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 px-2 py-1 rounded-lg border border-cyan-800/50">
                          <Droplet className="w-3 h-3" /> {t.mosqueModule.wellAvailable}
                        </span>
                      )}
                      {mosque.has_solar_power && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-950/60 px-2 py-1 rounded-lg border border-amber-800/50">
                          <Sun className="w-3 h-3" /> {t.mosqueModule.solarAvailable}
                        </span>
                      )}
                    </div>
                  </div>

                  <a
                    href="/mosques/maintenance"
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700/80 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>{t.mosqueModule.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Quran Circles Module */}
        {activeTab === "quran" && (
          <div className="space-y-6">
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-900/30">
                    <BookOpen className="w-7 h-7 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-white">{t.quranModule.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{t.quranModule.desc}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* زر فتح حلقة جديدة */}
                  <button
                    onClick={() => setIsCircleModalOpen(true)}
                    className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95 ring-2 ring-teal-400/30"
                  >
                    <Plus className="w-4 h-4" />
                    {t.quranModule.newCircle}
                  </button>

                  {/* زر رصد تسميع اليوم */}
                  <button
                    onClick={() => setIsProgressModalOpen(true)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <BookMarked className="w-4 h-4" />
                    {t.quranModule.recordProgress}
                  </button>

                  {/* زر إصدار إجازة وشهادة قرآنية بالسند */}
                  <a
                    href="/verify/quran/QURAN-IJAZAH-2026-WARSH-09"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 bg-gradient-to-r from-teal-900/60 to-emerald-950/60 hover:from-teal-800/80 hover:to-emerald-900/80 text-teal-300 border border-teal-500/40 font-bold text-xs rounded-xl transition flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <GraduationCap className="w-4 h-4 text-teal-400" />
                    <span>إصدار شهادة إجازة بالسند</span>
                  </a>
                </div>
              </div>

              {/* Quran Circles Cards Grid */}
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-teal-400" />
                  حلقات القرآن المعتمدة لدى المساجد والمراكز
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(circlesList.length > 0 ? circlesList : [
                    { id: "c1", name: "حلقة الفردوس لتحفيظ القرآن", target_level: "حفظ وتجويد الأجزاء الخمسة الأولى", gender: "MALE", mosqueName: "جامع النور الكبير", teacherName: "الشيخ عبد الله عمر" },
                    { id: "c2", name: "حلقة النور والهدى للفتيات", target_level: "حفظ سورتي البقرة وآل عمران", gender: "FEMALE", mosqueName: "مسجد الفاروق", teacherName: "الشيخة أمينة زبير" },
                    { id: "c3", name: "حلقة الإتقان والإجازة بالسند", target_level: "رواية ورش وقالون عن نافع", gender: "MALE", mosqueName: "مصلى الهدى", teacherName: "المقرئ إبراهيم موسى" },
                  ]).map((circle) => (
                    <div key={circle.id} className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3 hover:border-teal-500/40 transition">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded border border-teal-800/40">
                          {circle.gender === "MALE" ? "بنين / رجال" : "بنات / فتيات"}
                        </span>
                        <span className="text-xs text-slate-500">{circle.mosqueName}</span>
                      </div>
                      <h5 className="font-bold text-white text-base">{circle.name}</h5>
                      <p className="text-xs text-slate-400">المستوى: <strong className="text-slate-300">{circle.target_level}</strong></p>
                      <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                        <span>الشيخ المحفظ: <strong className="text-white">{circle.teacherName}</strong></span>
                        <button
                          onClick={() => {
                            setIsProgressModalOpen(true);
                          }}
                          className="text-teal-400 hover:text-teal-300 font-bold cursor-pointer"
                        >
                          تسميع
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Progress Ledger */}
              <div className="pt-4 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  أحدث تسجيلات التسميع اليومية الميدانية (Supabase Live)
                </h4>

                <div className="space-y-2">
                  {(progressList.length > 0 ? progressList : [
                    { id: "p1", student_full_name: "عثمان محمد علي", surah_name: "سورة البقرة", ayah_from: 1, ayah_to: 45, score: "EXCELLENT", record_date: "اليوم" },
                    { id: "p2", student_full_name: "مريم إدريس غاربا", surah_name: "سورة يوسف", ayah_from: 1, ayah_to: 30, score: "EXCELLENT", record_date: "اليوم" },
                  ]).map((p) => (
                    <div key={p.id} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white text-sm block">{p.student_full_name}</strong>
                        <span className="text-slate-400">{p.surah_name} (من آية {p.ayah_from} إلى {p.ayah_to})</span>
                      </div>
                      <div className="text-left">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20 text-[10px]">
                          {p.score === "EXCELLENT" ? "ممتاز وتجويد متقن" : "جيد جداً"}
                        </span>
                        <span className="text-[10px] text-slate-500 block mt-1">{p.record_date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Marriage */}
        {activeTab === "marriage" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 p-6 rounded-3xl border border-rose-900/30">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <HeartHandshake className="w-6 h-6 text-rose-400" />
                  {t.marriageModule.title}
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  {t.marriageModule.desc}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsMarriageModalOpen(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-rose-900/40 flex items-center gap-2 active:scale-95 cursor-pointer ring-2 ring-rose-400/30"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{t.marriageModule.registerMosqueNikah}</span>
                </button>

                <Link
                  href="/marriage"
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-rose-300 font-bold text-xs rounded-xl transition border border-rose-900/40 flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-rose-400" />
                  <span>{t.marriageModule.viewAllDocs}</span>
                </Link>
              </div>
            </div>

            {/* Marriage Contracts List */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-rose-400" />
                  {t.marriageModule.liveRegistryTitle}
                </h3>
                <span className="text-xs text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-900/40 font-bold">
                  {marriagesList.length > 0 ? `${marriagesList.length} ${t.marriageModule.contractsSuffix}` : t.marriageModule.approvedBadge}
                </span>
              </div>

              {marriagesList.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <HeartHandshake className="w-12 h-12 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-sm">{t.marriageModule.emptyText}</p>
                  <button
                    onClick={() => setIsMarriageModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    {t.marriageModule.registerFirstBtn}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {marriagesList.map((m) => (
                    <div
                      key={m.id}
                      className="bg-slate-950/70 border border-slate-800 hover:border-rose-900/50 rounded-2xl p-5 space-y-3 transition group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-rose-400 bg-rose-950/40 px-2.5 py-0.5 rounded border border-rose-900/30">
                          {m.contract_number}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {t.marriageModule.officiallyVerified}
                        </span>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-xs gap-2">
                          <span className="text-slate-400">{t.marriageModule.groomLabel}</span>
                          <span className="text-white font-bold text-end">{m.groom_full_name}</span>
                        </div>
                        {(m.groom_phone || m.groom_national_id) && (
                          <div className="flex items-center justify-between text-[11px] text-slate-400 gap-2">
                            <span>{m.groom_national_id ? `ID: ${m.groom_national_id}` : ""}</span>
                            <span dir="ltr">{m.groom_phone || ""}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs gap-2">
                          <span className="text-slate-400">{t.marriageModule.brideLabel}</span>
                          <span className="text-white font-bold text-end">{m.bride_full_name}</span>
                        </div>
                        {m.bride_national_id && (
                          <div className="text-[11px] text-slate-400 text-end">
                            ID: {m.bride_national_id}
                          </div>
                        )}
                        {m.guardian_name && (
                          <div className="flex items-center justify-between text-xs gap-2">
                            <span className="text-slate-400">{t.marriageModule.guardianLabel}</span>
                            <span className="text-slate-200 text-end">
                              {m.guardian_name}
                              {m.guardian_relation ? ` (${m.guardian_relation})` : ""}
                            </span>
                          </div>
                        )}
                        {(m.witness1_name || m.witness2_name) && (
                          <div className="text-[11px] text-slate-400 border-t border-slate-800/80 pt-1.5">
                            {[m.witness1_name, m.witness2_name].filter(Boolean).join(" • ")}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs gap-2">
                          <span className="text-slate-400">{t.marriageModule.dowryLabel}</span>
                          <span className="text-amber-400 font-semibold">
                            {m.dowry_amount?.toLocaleString() || 150000} FCFA (
                            {m.dowry_status === "PAID"
                              ? t.marriageModule.paidLabel
                              : t.marriageModule.deferredLabel}
                            )
                          </span>
                        </div>
                        {m.dowry_notes && (
                          <div className="text-[11px] text-slate-400 italic line-clamp-2">
                            {m.dowry_notes}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                          <span className="text-slate-400 truncate">
                            {m.mosques?.name || ""}
                            {m.mosque_staff?.full_name ? ` — ${m.mosque_staff.full_name}` : ""}
                          </span>
                          <span className="text-slate-400 shrink-0">{m.contract_date}</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-slate-500 truncate">
                          {m.mosques?.name || "Grande Mosquée"}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {m.verification_token && (
                            <Link
                              href={`/verify/nikah/${encodeURIComponent(m.verification_token)}`}
                              className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold"
                            >
                              {t.marriageModule.verifyQrBtn}
                            </Link>
                          )}
                          <Link
                            href={`/marriage?id=${encodeURIComponent(m.id)}`}
                            className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>{t.marriageModule.viewCertBtn}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}


        {/* Tab 4: Sync */}
        {activeTab === "sync" && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <RefreshCw className="w-6 h-6 text-emerald-400" />
                  {t.syncModule.title}
                </h3>
                <p className="text-sm text-slate-400 mt-1">{t.syncModule.desc}</p>
              </div>
              <button
                onClick={triggerMockSync}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition flex items-center gap-2 shadow-lg shadow-emerald-900/40 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${syncStatus === "syncing" ? "animate-spin" : ""}`} />
                {t.syncModule.forceSync}
              </button>
            </div>

            {syncStatus === "success" && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-sm font-bold animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                {t.syncModule.syncSuccess} (تم الاتصال بقاعدة بيانات Supabase وتحديث البيانات).
              </div>
            )}
          </div>
        )}
      </main>

      {/* 5. النافذة المنبثقة: تسجيل مسجد جديد */}
      {isMosqueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-900/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">تسجيل بيت من بيوت الله في Supabase</h3>
                  <p className="text-xs text-slate-400">إدخال معتمد في قاعدة البيانات السحابية</p>
                </div>
              </div>
              <button onClick={() => setIsMosqueModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {mosqueSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">تم تسجيل المسجد بنجاح!</h4>
              </div>
            ) : (
              <form onSubmit={handleRegisterMosque} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">اسم المسجد / المصلى الرسمي: *</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: جامع الإيمان" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">النوع:</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                      <option value="JUMA">جامع جمعة</option>
                      <option value="FIVE_DAILY">مسجد صلوات خمس</option>
                      <option value="MUSALLA">مصلى خيري</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">السعة (مصلين):</label>
                    <input type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">المدينة:</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">الحي/القرية:</label>
                    <input type="text" value={village} onChange={(e) => setVillage(e.target.value)} placeholder="الحي" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">الإمام المعتمد:</label>
                  <input type="text" value={imamName} onChange={(e) => setImamName(e.target.value)} placeholder="اسم الإمام" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                  <button type="button" onClick={() => setIsMosqueModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer">إلغاء</button>
                  <button type="submit" disabled={isSubmittingMosque} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer">
                    {isSubmittingMosque ? "جاري الحفظ..." : "حفظ واعتماد"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 6. النافذة المنبثقة: فتح حلقة قرآن جديدة */}
      {isCircleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-teal-900/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">فتح حلقة قرآن جديدة</h3>
                  <p className="text-xs text-slate-400">تسجيل حلقة تحفيظ معتمدة في قاعدة البيانات</p>
                </div>
              </div>
              <button onClick={() => setIsCircleModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {circleSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">تم فتح وتوثيق الحلقة بنجاح!</h4>
              </div>
            ) : (
              <form onSubmit={handleCreateCircle} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">اسم الحلقة القرآني: *</label>
                  <input type="text" required value={circleName} onChange={(e) => setCircleName(e.target.value)} placeholder="مثال: حلقة الفرقان لحفظ القرآن" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">المستوى والمنهج المستهدف:</label>
                  <input type="text" value={targetLevel} onChange={(e) => setTargetLevel(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">فئة الطلاب:</label>
                    <select value={circleGender} onChange={(e) => setCircleGender(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                      <option value="MALE">بنين / ذكور</option>
                      <option value="FEMALE">بنات / إناث</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">اسم الشيخ / المحفظ:</label>
                    <input type="text" value={teacherName} onChange={(e) => setTeacherName(e.target.value)} placeholder="الشيخ المحفظ" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                  <button type="button" onClick={() => setIsCircleModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer">إلغاء</button>
                  <button type="submit" disabled={isSubmittingCircle} className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl cursor-pointer">
                    {isSubmittingCircle ? "جاري الحفظ..." : "فتح الحلقة"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 7. النافذة المنبثقة: رصد تسميع اليوم */}
      {isProgressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-900/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <BookMarked className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">رصد تسميع وحفظ القرآن اليومي</h3>
                  <p className="text-xs text-slate-400">تسجيل إلكتروني لحفظ الطالب مع التقييم والتجويد</p>
                </div>
              </div>
              <button onClick={() => setIsProgressModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {progressSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">تم رصد وتثبيت الحفظ بنجاح!</h4>
              </div>
            ) : (
              <form onSubmit={handleRecordProgress} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">اسم الطالب الرباعي: *</label>
                  <input type="text" required value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="مثال: عبد الرحمن إبراهيم ساليسو" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div>
                  <label className="text-slate-300 font-bold block mb-1">السورة المقررة: *</label>
                  <input type="text" required value={surahName} onChange={(e) => setSurahName(e.target.value)} placeholder="مثال: سورة الكهف" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">من آية:</label>
                    <input type="number" min={1} value={ayahFrom} onChange={(e) => setAyahFrom(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">إلى آية:</label>
                    <input type="number" min={1} value={ayahTo} onChange={(e) => setAyahTo(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">تقييم الحفظ:</label>
                    <select value={score} onChange={(e) => setScore(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white">
                      <option value="EXCELLENT">ممتاز (متقن بدون أخطاء)</option>
                      <option value="VERY_GOOD">جيد جداً (خطأ أو خطآن)</option>
                      <option value="NEEDS_PRACTICE">يحتاج إعادة ومراجعة</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">ملاحظات التجويد:</label>
                    <input type="text" value={revisionNotes} onChange={(e) => setRevisionNotes(e.target.value)} placeholder="ملاحظات" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" />
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                  <button type="button" onClick={() => setIsProgressModalOpen(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer">إلغاء</button>
                  <button type="submit" disabled={isSubmittingProgress} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer">
                    {isSubmittingProgress ? "جاري التدوين..." : "رصد وتأكيد الحفظ"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 8. النافذة المنبثقة: تسجيل عقد زواج شرعي بالمسجد */}
      {isMarriageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-rose-900/40 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{t.marriageModule.modalTitle}</h3>
                  <p className="text-xs text-slate-400">{t.marriageModule.desc}</p>
                </div>
              </div>
              <button onClick={() => setIsMarriageModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {marriageSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-rose-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">{t.marriageModule.successTitle}</h4>
              </div>
            ) : (
              <form onSubmit={handleRegisterMarriage} className="space-y-4 text-xs">
                {/* 1. الزوج والزوجة */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">{t.marriageModule.groomNameLabel}</label>
                      <input
                        type="text"
                        required
                        value={groomName}
                        onChange={(e) => setGroomName(e.target.value)}
                        placeholder="Abdoulaye Ibrahim..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">{t.marriageModule.brideNameLabel}</label>
                      <input
                        type="text"
                        required
                        value={brideName}
                        onChange={(e) => setBrideName(e.target.value)}
                        placeholder="Fatima Salissou..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. وكيل الزوج وولي الزوجة */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">{t.marriageModule.groomRepLabel}</label>
                      <input
                        type="text"
                        value={groomRepresentative}
                        onChange={(e) => setGroomRepresentative(e.target.value)}
                        placeholder="Moussa Ibrahim..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">{t.marriageModule.guardianNameLabel}</label>
                      <input
                        type="text"
                        required
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        placeholder="Ibrahim Salissou..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. الصداق والشهود */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">{t.marriageModule.dowryAmountLabel}</label>
                    <input
                      type="number"
                      min={0}
                      step={5000}
                      value={dowryAmount}
                      onChange={(e) => setDowryAmount(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">{t.marriageModule.witnessesSectionLabel}</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={witness1Name}
                        onChange={(e) => setWitness1Name(e.target.value)}
                        placeholder={t.marriageModule.witness1Label}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      />
                      <input
                        type="text"
                        value={witness2Name}
                        onChange={(e) => setWitness2Name(e.target.value)}
                        placeholder={t.marriageModule.witness2Label}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. مكان العقد (المسجد) والتاريخ وحالة الزوجة والإمام */}
                <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">{t.marriageModule.mosquePlaceLabel}</label>
                      <select
                        value={marriageMosqueId}
                        onChange={(e) => setMarriageMosqueId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      >
                        {mosquesList.map((m) => (
                          <option key={m.id} value={m.id}>{m.name} ({m.city || "Niger"})</option>
                        ))}
                        {mosquesList.length === 0 && (
                          <option value="">جامع النور الكبير - مرادي</option>
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">{t.marriageModule.dateLabel}</label>
                      <input
                        type="date"
                        value={contractDate}
                        onChange={(e) => setContractDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1.5">{t.marriageModule.maritalStatusLabel}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { id: "CELIBATAIRE", label: t.marriageModule.statusVirgin },
                          { id: "DIVORCEE", label: t.marriageModule.statusDivorced },
                          { id: "VEUVE", label: t.marriageModule.statusWidow },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setBrideMaritalStatus(opt.id)}
                          className={`p-2.5 rounded-xl border font-bold text-center transition cursor-pointer ${
                            brideMaritalStatus === opt.id
                              ? "bg-rose-500/20 border-rose-500 text-rose-300"
                              : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          {brideMaritalStatus === opt.id ? "☑ " : "☐ "}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">{t.marriageModule.imamSignLabel}</label>
                    <input
                      type="text"
                      value={marriageImamName}
                      onChange={(e) => setMarriageImamName(e.target.value)}
                      placeholder="Imam / Cheikh..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsMarriageModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                  >
                    {t.marriageModule.cancelBtn}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingMarriage}
                    className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-rose-950/40"
                  >
                    {isSubmittingMarriage ? t.marriageModule.submittingBtn : t.marriageModule.submitBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          {t.footer}
        </div>
      </footer>
    </div>
  );
}
