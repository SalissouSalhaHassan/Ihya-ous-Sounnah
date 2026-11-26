"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  HeartHandshake,
  Coins,
  ClipboardList,
  Award,
  KeyRound,
  Settings,
  RefreshCw,
  Droplet,
  Sun,
  Users,
  BookMarked,
  Car,
  Library,
  Scale,
  TrendingUp,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Wrench,
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { Locale } from "@/lib/i18n";
import { useIdentitySettings } from "@/lib/identity-settings";
import {
  PrintLetterhead,
  PrintSignatureFooter,
  PrintOrientationControls,
} from "@/components/PrintLetterhead";

interface MosqueSummary {
  id: string;
  name: string;
  city?: string | null;
  capacity?: number | null;
  has_water_well?: boolean | null;
  has_solar_power?: boolean | null;
}

interface MarriageSummary {
  id: string;
  contract_number: string;
  groom_full_name: string;
  bride_full_name: string;
  contract_date: string;
  dowry_amount?: number | string | null;
}

interface DonationSummary {
  id: string;
  donor_name?: string | null;
  amount: number | string;
  category?: string | null;
  receipt_number?: string | null;
  date_paid?: string | null;
}

interface BilanPayload {
  sectionName?: string;
  villages?: unknown[];
  reunions?: { y2025?: number; y2026?: number }[];
  preachers?: { y2025?: number; y2026?: number }[];
  mosquesSitu?: {
    daily2025?: { dur?: number; banco?: number; tole?: number; tiges?: number };
    daily2026?: { dur?: number; banco?: number; tole?: number; tiges?: number };
    friday2025?: { dur?: number; banco?: number; tole?: number; tiges?: number };
    friday2026?: { dur?: number; banco?: number; tole?: number; tiges?: number };
  }[];
  makarantas?: {
    boys2025?: number;
    girls2025?: number;
    boys2026?: number;
    girls2026?: number;
  }[];
  finInterne?: { y2025?: number; y2026?: number }[];
  finExterne?: { y2025?: number; y2026?: number }[];
  depensesA?: { y2025?: number; y2026?: number }[];
  depensesB?: { y2025?: number; y2026?: number }[];
}

interface BilanFicheRow {
  id: string;
  section_name?: string;
  updated_at?: string;
  payload?: BilanPayload;
}

interface BilanAggregates {
  fichesCount: number;
  villagesCount: number;
  reunions2025: number;
  reunions2026: number;
  preachers2025: number;
  preachers2026: number;
  mosquesBilan2025: number;
  mosquesBilan2026: number;
  students2025: number;
  students2026: number;
  recettes2025: number;
  recettes2026: number;
  depenses2025: number;
  depenses2026: number;
}

const EMPTY_AGGREGATES: BilanAggregates = {
  fichesCount: 0,
  villagesCount: 0,
  reunions2025: 0,
  reunions2026: 0,
  preachers2025: 0,
  preachers2026: 0,
  mosquesBilan2025: 0,
  mosquesBilan2026: 0,
  students2025: 0,
  students2026: 0,
  recettes2025: 0,
  recettes2026: 0,
  depenses2025: 0,
  depenses2026: 0,
};

const DICT: Record<
  Locale,
  {
    badge: string;
    title: string;
    subtitle: string;
    refreshBtn: string;
    systemOnline: string;
    systemOffline: string;
    kpiMosques: string;
    kpiCircles: string;
    kpiMarriages: string;
    kpiDonations: string;
    kpiBilanVillages: string;
    kpiCommissions: string;
    kpiFatwaMag: string;
    kpiCapacity: string;
    annualSectionTitle: string;
    annualSectionDesc: string;
    indicatorCol: string;
    y2025Col: string;
    y2026Col: string;
    diffCol: string;
    rowReunions: string;
    rowPreachers: string;
    rowMosques: string;
    rowStudents: string;
    rowRecettes: string;
    rowDepenses: string;
    rowSolde: string;
    modulesTitle: string;
    modulesDesc: string;
    recentMarriagesTitle: string;
    recentDonationsTitle: string;
    recentBilanTitle: string;
    emptyList: string;
    openModule: string;
  }
> = {
  fr: {
    badge: "Pilotage Exécutif • Exercice Annuel 2026",
    title: "Tableau de Bord Global 2026",
    subtitle:
      "Vue consolidée de l'ensemble de la plateforme : mosquées, écoles coraniques, mariages, finances, commissions et bilans annuels.",
    refreshBtn: "Actualiser",
    systemOnline: "Supabase Connecté",
    systemOffline: "Mode Hors-ligne",
    kpiMosques: "Mosquées Enregistrées",
    kpiCircles: "Cercles Coraniques & Éval.",
    kpiMarriages: "Contrats de Mariage (Nikah)",
    kpiDonations: "Zakat & Dons Collectés",
    kpiBilanVillages: "Fiches Bilan & Villages",
    kpiCommissions: "Membres Commissions",
    kpiFatwaMag: "Fatwas & Articles",
    kpiCapacity: "Capacité / Puits / Solaire",
    annualSectionTitle: "Synthèse Comparative Annuelle (2025 vs 2026)",
    annualSectionDesc:
      "Agrégation en temps réel des fiches Bilan 2026 soumises par les sections et villages.",
    indicatorCol: "Indicateur Clé",
    y2025Col: "Année 2025",
    y2026Col: "Année 2026",
    diffCol: "Évolution",
    rowReunions: "Réunions (Ordinaires & Extra.)",
    rowPreachers: "Prédicateurs & Enseignants",
    rowMosques: "Mosquées (Quotidiennes & Vendredi)",
    rowStudents: "Élèves Makaranta (Garçons & Filles)",
    rowRecettes: "Recettes Totales (FCFA)",
    rowDepenses: "Dépenses Totales (FCFA)",
    rowSolde: "Solde Net de l'Exercice (FCFA)",
    modulesTitle: "Accès Direct aux Modules de la Plateforme",
    modulesDesc: "Tous les services opérationnels et administratifs en un clic.",
    recentMarriagesTitle: "Derniers Contrats de Mariage",
    recentDonationsTitle: "Derniers Reçus Zakat & Dons",
    recentBilanTitle: "Dernières Fiches Bilan 2026",
    emptyList: "Aucune donnée enregistrée pour le moment.",
    openModule: "Ouvrir",
  },
  ar: {
    badge: "القيادة التنفيذية • العام الكامل 2026",
    title: "لوحة القيادة الشاملة (Tableau de Bord 2026)",
    subtitle:
      "نظرة موحدة وشاملة لجميع أقسام المنصة: المساجد، المدارس القرآنية، عقود الزواج، الزكاة والمالية، اللجان، والحصيلة السنوية.",
    refreshBtn: "تحديث البيانات",
    systemOnline: "متصل بقاعدة البيانات",
    systemOffline: "وضع عدم الاتصال",
    kpiMosques: "المساجد المسجلة",
    kpiCircles: "الحلقات القرآنية والتقييمات",
    kpiMarriages: "عقود الزواج الشرعية",
    kpiDonations: "إجمالي الزكاة والتبرعات",
    kpiBilanVillages: "تقارير الحصيلة والقرى",
    kpiCommissions: "أعضاء اللجان 2026",
    kpiFatwaMag: "الفتاوى ومقالات المجلة",
    kpiCapacity: "السعة / الآبار / الطاقة الشمسية",
    annualSectionTitle: "الملخص السنوي المقارن الشامل (2025 مقابل 2026)",
    annualSectionDesc:
      "تجميع آلي مباشر لبيانات الحصيلة السنوية المرفوعة من القرى والأقسام.",
    indicatorCol: "المؤشر الرئيسي",
    y2025Col: "سنة 2025",
    y2026Col: "سنة 2026",
    diffCol: "الفرق / النمو",
    rowReunions: "الاجتماعات (العادية والاستثنائية)",
    rowPreachers: "الدعاة والمدرسون",
    rowMosques: "المساجد (الخمس والجمعة)",
    rowStudents: "طلاب المكارانتا (بنين وبنات)",
    rowRecettes: "إجمالي المداخيل (FCFA)",
    rowDepenses: "إجمالي المصروفات (FCFA)",
    rowSolde: "الرصيد الصافي للعام (FCFA)",
    modulesTitle: "الوصول السريع لجميع وجهات المنصة",
    modulesDesc: "كافة الوحدات التشغيلية والإدارية والرقابية في مكان واحد.",
    recentMarriagesTitle: "أحدث عقود الزواج المسجلة",
    recentDonationsTitle: "أحدث سندات الزكاة والتبرعات",
    recentBilanTitle: "أحدث تقارير الحصيلة 2026",
    emptyList: "لا توجد سجلات مضافة حتى الآن.",
    openModule: "فتح",
  },
  ha: {
    badge: "Babban Tsarin Kulawa • Shekarar 2026",
    title: "Babban Allon Kulawa (Tableau de Bord 2026)",
    subtitle:
      "Cikakken bayanin dukkan sassan dandamali: masallatai, makarantun tsangaya, daurin aure, zakka, kwamitoci da rahoton shekara.",
    refreshBtn: "Sabunta",
    systemOnline: "Supabase Yana Aiki",
    systemOffline: "Yanayin Ba Net",
    kpiMosques: "Masallatai Masu Rajista",
    kpiCircles: "Azuzuwan Karatu",
    kpiMarriages: "Takardun Daurin Aure",
    kpiDonations: "Jimillar Zakka da Sadaka",
    kpiBilanVillages: "Rahoton Shekara da Ƙauyuka",
    kpiCommissions: "Mambobin Kwamitoci",
    kpiFatwaMag: "Fatawoyi da Labarai",
    kpiCapacity: "Yawan Mutane / Rijiyoyi / Hasken Rana",
    annualSectionTitle: "Kwatancin Ayyukan Shekara (2025 vs 2026)",
    annualSectionDesc:
      "Haɗaɗɗen rahoton ayyuka da kuɗi daga dukkan ƙauyuka da sassan 2026.",
    indicatorCol: "Babban Ma'auni",
    y2025Col: "Shekarar 2025",
    y2026Col: "Shekarar 2026",
    diffCol: "Canji",
    rowReunions: "Taruka (Na Yau da Kullum & Musamman)",
    rowPreachers: "Masu Wa'azi da Malamai",
    rowMosques: "Masallatai (Salloli 5 & Juma'a)",
    rowStudents: "Ɗaliban Makaranta (Maza & Mata)",
    rowRecettes: "Jimillar Kuɗin Shiga (FCFA)",
    rowDepenses: "Jimillar Kuɗin Fita (FCFA)",
    rowSolde: "Ragowar Kuɗi (FCFA)",
    modulesTitle: "Shiga Sassan Dandamali Kai-tsaye",
    modulesDesc: "Dukkan sassan gudanarwa a wuri guda.",
    recentMarriagesTitle: "Sabbin Daurin Aure",
    recentDonationsTitle: "Sabbin Takardun Zakka",
    recentBilanTitle: "Sabbin Rahotannin 2026",
    emptyList: "Babu bayanai tukuna.",
    openModule: "Buɗe",
  },
};

function aggregateBilan(fiches: BilanFicheRow[]): BilanAggregates {
  const agg: BilanAggregates = { ...EMPTY_AGGREGATES, fichesCount: fiches.length };
  for (const row of fiches) {
    const p = row.payload;
    if (!p) continue;
    agg.villagesCount += Array.isArray(p.villages) ? p.villages.length : 0;
    for (const r of p.reunions || []) {
      agg.reunions2025 += Number(r.y2025) || 0;
      agg.reunions2026 += Number(r.y2026) || 0;
    }
    for (const pr of p.preachers || []) {
      agg.preachers2025 += Number(pr.y2025) || 0;
      agg.preachers2026 += Number(pr.y2026) || 0;
    }
    for (const m of p.mosquesSitu || []) {
      agg.mosquesBilan2025 +=
        (Number(m.daily2025?.dur) || 0) +
        (Number(m.daily2025?.banco) || 0) +
        (Number(m.daily2025?.tole) || 0) +
        (Number(m.daily2025?.tiges) || 0) +
        (Number(m.friday2025?.dur) || 0) +
        (Number(m.friday2025?.banco) || 0) +
        (Number(m.friday2025?.tole) || 0) +
        (Number(m.friday2025?.tiges) || 0);
      agg.mosquesBilan2026 +=
        (Number(m.daily2026?.dur) || 0) +
        (Number(m.daily2026?.banco) || 0) +
        (Number(m.daily2026?.tole) || 0) +
        (Number(m.daily2026?.tiges) || 0) +
        (Number(m.friday2026?.dur) || 0) +
        (Number(m.friday2026?.banco) || 0) +
        (Number(m.friday2026?.tole) || 0) +
        (Number(m.friday2026?.tiges) || 0);
    }
    for (const mk of p.makarantas || []) {
      agg.students2025 += (Number(mk.boys2025) || 0) + (Number(mk.girls2025) || 0);
      agg.students2026 += (Number(mk.boys2026) || 0) + (Number(mk.girls2026) || 0);
    }
    for (const fi of p.finInterne || []) {
      agg.recettes2025 += Number(fi.y2025) || 0;
      agg.recettes2026 += Number(fi.y2026) || 0;
    }
    for (const fe of p.finExterne || []) {
      agg.recettes2025 += Number(fe.y2025) || 0;
      agg.recettes2026 += Number(fe.y2026) || 0;
    }
    for (const da of p.depensesA || []) {
      agg.depenses2025 += Number(da.y2025) || 0;
      agg.depenses2026 += Number(da.y2026) || 0;
    }
    for (const db of p.depensesB || []) {
      agg.depenses2025 += Number(db.y2025) || 0;
      agg.depenses2026 += Number(db.y2026) || 0;
    }
  }
  return agg;
}

export default function GlobalDashboardPage() {
  const { currentLocale, t, isRtl } = useLocale();
  const dict = DICT[currentLocale];
  const identity = useIdentitySettings();

  const [loading, setLoading] = useState(true);
  const [dbHealthy, setDbHealthy] = useState<boolean | null>(null);
  const [mosques, setMosques] = useState<MosqueSummary[]>([]);
  const [circlesCount, setCirclesCount] = useState(0);
  const [progressCount, setProgressCount] = useState(0);
  const [marriages, setMarriages] = useState<MarriageSummary[]>([]);
  const [donations, setDonations] = useState<DonationSummary[]>([]);
  const [bilanFiches, setBilanFiches] = useState<BilanFicheRow[]>([]);
  const [fatwasCount, setFatwasCount] = useState(0);
  const [articlesCount, setArticlesCount] = useState(0);
  const [commissionStats, setCommissionStats] = useState({
    villages: 1,
    members: 0,
  });
  const [printOrientation, setPrintOrientation] = useState<
    "portrait" | "landscape"
  >("landscape");

  const loadDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      const results = await Promise.allSettled([
        fetch("/api/supabase/health").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/mosques").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/quran/circles").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/quran/progress").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/marriage").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/donations").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/bilan-2026").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/fatwa").then((r) => (r.ok ? r.json() : null)),
        fetch("/api/magazine").then((r) => (r.ok ? r.json() : null)),
      ]);

      const val = (i: number) =>
        results[i]?.status === "fulfilled" ? results[i].value : null;

      const health = val(0);
      setDbHealthy(Boolean(health && (health.ok || health.status === "ok")));

      const mRes = val(1);
      setMosques(Array.isArray(mRes?.mosques) ? mRes.mosques : []);

      const cRes = val(2);
      setCirclesCount(Array.isArray(cRes?.circles) ? cRes.circles.length : 0);

      const pRes = val(3);
      setProgressCount(
        Array.isArray(pRes?.progress) ? pRes.progress.length : 0
      );

      const marRes = val(4);
      setMarriages(Array.isArray(marRes?.contracts) ? marRes.contracts : []);

      const dRes = val(5);
      setDonations(Array.isArray(dRes?.donations) ? dRes.donations : []);

      const bRes = val(6);
      setBilanFiches(Array.isArray(bRes?.fiches) ? bRes.fiches : []);

      const fRes = val(7);
      setFatwasCount(Array.isArray(fRes?.fatwas) ? fRes.fatwas.length : 0);

      const magRes = val(8);
      setArticlesCount(
        Array.isArray(magRes?.articles) ? magRes.articles.length : 0
      );

      if (typeof window !== "undefined") {
        try {
          const rawComm = localStorage.getItem(
            "ihyaous_sounnah_commissions_v2"
          );
          if (rawComm) {
            const dirs = JSON.parse(rawComm) as {
              commissions?: { members?: unknown[] }[];
            }[];
            if (Array.isArray(dirs)) {
              const totalMembers = dirs.reduce(
                (acc, d) =>
                  acc +
                  (d.commissions || []).reduce(
                    (cAcc, c) => cAcc + (c.members?.length || 0),
                    0
                  ),
                0
              );
              setCommissionStats({
                villages: dirs.length,
                members: totalMembers,
              });
            }
          }
        } catch {
          // ignore localStorage parse errors
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadDashboardData();
    });
  }, [loadDashboardData]);

  const handlePrintWithOrientation = (mode: "portrait" | "landscape") => {
    setPrintOrientation(mode);
    setTimeout(() => window.print(), 50);
  };

  const totalCapacity = mosques.reduce(
    (acc, m) => acc + (Number(m.capacity) || 0),
    0
  );
  const wellsCount = mosques.filter((m) => Boolean(m.has_water_well)).length;
  const solarCount = mosques.filter((m) => Boolean(m.has_solar_power)).length;
  const totalDonationsAmount = donations.reduce(
    (acc, d) => acc + (Number(d.amount) || 0),
    0
  );
  const bilanAgg = aggregateBilan(bilanFiches);
  const solde2025 = bilanAgg.recettes2025 - bilanAgg.depenses2025;
  const solde2026 = bilanAgg.recettes2026 - bilanAgg.depenses2026;

  const comparisonRows = [
    {
      label: dict.rowReunions,
      y25: bilanAgg.reunions2025,
      y26: bilanAgg.reunions2026,
      isMoney: false,
    },
    {
      label: dict.rowPreachers,
      y25: bilanAgg.preachers2025,
      y26: bilanAgg.preachers2026,
      isMoney: false,
    },
    {
      label: dict.rowMosques,
      y25: bilanAgg.mosquesBilan2025,
      y26: bilanAgg.mosquesBilan2026,
      isMoney: false,
    },
    {
      label: dict.rowStudents,
      y25: bilanAgg.students2025,
      y26: bilanAgg.students2026,
      isMoney: false,
    },
    {
      label: dict.rowRecettes,
      y25: bilanAgg.recettes2025,
      y26: bilanAgg.recettes2026,
      isMoney: true,
    },
    {
      label: dict.rowDepenses,
      y25: bilanAgg.depenses2025,
      y26: bilanAgg.depenses2026,
      isMoney: true,
    },
    {
      label: dict.rowSolde,
      y25: solde2025,
      y26: solde2026,
      isMoney: true,
      highlight: true,
    },
  ];

  const moduleCards = [
    {
      href: "/?tab=mosques",
      label: t.nav.mosques,
      icon: Building2,
      color: "text-emerald-400",
      stat: `${mosques.length}`,
    },
    {
      href: "/?tab=quran",
      label: t.nav.quran,
      icon: BookOpen,
      color: "text-teal-400",
      stat: `${circlesCount}`,
    },
    {
      href: "/marriage",
      label: t.nav.marriage,
      icon: HeartHandshake,
      color: "text-rose-400",
      stat: `${marriages.length}`,
    },
    {
      href: "/finance/zakat",
      label: t.sidebar.zakat,
      icon: Scale,
      color: "text-amber-400",
      stat: `${donations.length}`,
    },
    {
      href: "/bilan-2026",
      label: t.sidebar.bilan2026,
      icon: ClipboardList,
      color: "text-emerald-400",
      stat: `${bilanFiches.length}`,
    },
    {
      href: "/commissions",
      label: t.sidebar.commissions2026,
      icon: Award,
      color: "text-amber-400",
      stat: `${commissionStats.villages}`,
    },
    {
      href: "/mosques/maintenance",
      label: t.sidebar.maintenance,
      icon: Wrench,
      color: "text-emerald-400",
    },
    {
      href: "/mosques/security",
      label: t.sidebar.security,
      icon: Car,
      color: "text-blue-400",
    },
    {
      href: "/mosques/funerals",
      label: t.sidebar.funerals,
      icon: Users,
      color: "text-purple-400",
    },
    {
      href: "/scholars/fatwa",
      label: t.sidebar.scholars,
      icon: BookOpen,
      color: "text-amber-400",
      stat: `${fatwasCount}`,
    },
    {
      href: "/mosques/library",
      label: t.sidebar.library,
      icon: Library,
      color: "text-teal-400",
    },
    {
      href: "/magazine",
      label: t.sidebar.magazine,
      icon: BookMarked,
      color: "text-rose-400",
      stat: `${articlesCount}`,
    },
    {
      href: "/portal/project",
      label: t.sidebar.donorPortal,
      icon: Droplet,
      color: "text-cyan-400",
    },
    {
      href: "/access-control",
      label: t.sidebar.accessControl,
      icon: KeyRound,
      color: "text-rose-400",
    },
    {
      href: "/settings",
      label: t.sidebar.settings,
      icon: Settings,
      color: "text-cyan-400",
    },
  ];

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 print:bg-transparent print:text-slate-900 p-4 sm:p-8 print:p-0 ${
        isRtl ? "rtl font-sans" : "ltr"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl print:max-w-none print:w-full mx-auto space-y-6 print:space-y-4">
        <PrintLetterhead
          title={dict.title}
          subtitle={dict.subtitle}
          village={identity.coordinationName}
          badge={dict.badge}
          locale={currentLocale}
          orientation={printOrientation}
        />

        {/* Header */}
        <div className="print:hidden bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/50">
              <LayoutDashboard className="w-7 h-7 text-slate-950 stroke-[2.3]" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold">
                  <Calendar className="w-3 h-3" /> {dict.badge}
                </span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                    dbHealthy
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {dbHealthy ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {dbHealthy ? dict.systemOnline : dict.systemOffline}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                {dict.title}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 max-w-2xl">
                {dict.subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void loadDashboardData()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
              <span>{dict.refreshBtn}</span>
            </button>
            <PrintOrientationControls
              orientation={printOrientation}
              onPrint={handlePrintWithOrientation}
              locale={currentLocale}
            />
          </div>
        </div>

        {/* Top 8 Executive KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 print:gap-2.5">
          <div className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{dict.kpiMosques}</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {mosques.length}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Droplet className="w-3 h-3 text-cyan-400" /> {wellsCount}
              </span>
              <span className="flex items-center gap-1">
                <Sun className="w-3 h-3 text-amber-400" /> {solarCount}
              </span>
              <span>{totalCapacity.toLocaleString()} cap.</span>
            </div>
          </div>

          <div className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{dict.kpiCircles}</span>
              <BookOpen className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white">{circlesCount}</div>
            <div className="text-[11px] text-teal-400 font-semibold">
              {progressCount} éval. • {bilanAgg.students2026.toLocaleString()}{" "}
              élèves (2026)
            </div>
          </div>

          <div className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{dict.kpiMarriages}</span>
              <HeartHandshake className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {marriages.length}
            </div>
            <div className="text-[11px] text-rose-400 font-semibold">
              Nikah QR &amp; Certificats
            </div>
          </div>

          <div className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{dict.kpiDonations}</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400">
              {totalDonationsAmount.toLocaleString()}{" "}
              <span className="text-xs font-bold">FCFA</span>
            </div>
            <div className="text-[11px] text-slate-400">
              {donations.length} reçu(s)
            </div>
          </div>

          <div className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{dict.kpiBilanVillages}</span>
              <ClipboardList className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {bilanAgg.fichesCount}
            </div>
            <div className="text-[11px] text-emerald-400 font-semibold">
              {bilanAgg.villagesCount} villages / bureaux
            </div>
          </div>

          <div className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{dict.kpiCommissions}</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {commissionStats.members}
            </div>
            <div className="text-[11px] text-slate-400">
              {commissionStats.villages} section(s) / village(s)
            </div>
          </div>

          <div className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{dict.kpiFatwaMag}</span>
              <BookMarked className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">
              {fatwasCount + articlesCount}
            </div>
            <div className="text-[11px] text-slate-400">
              {fatwasCount} Fatwas • {articlesCount} Articles
            </div>
          </div>

          <div className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{dict.rowSolde}</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div
              className={`text-xl font-black ${
                solde2026 >= 0 ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {solde2026.toLocaleString()}{" "}
              <span className="text-xs font-bold">FCFA</span>
            </div>
            <div className="text-[11px] text-slate-400">
              2025: {solde2025.toLocaleString()} FCFA
            </div>
          </div>
        </div>

        {/* Annual Comparative Table (2025 vs 2026) */}
        <section className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>{dict.annualSectionTitle}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {dict.annualSectionDesc}
              </p>
            </div>
            <Link
              href="/bilan-2026"
              className="print:hidden px-3.5 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold inline-flex items-center gap-1.5 self-start"
            >
              <span>{dict.openModule} Bilan 2026</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-4 text-start">{dict.indicatorCol}</th>
                  <th className="py-3 px-4 text-end">{dict.y2025Col}</th>
                  <th className="py-3 px-4 text-end">{dict.y2026Col}</th>
                  <th className="py-3 px-4 text-end">{dict.diffCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {comparisonRows.map((row) => {
                  const diff = row.y26 - row.y25;
                  return (
                    <tr
                      key={row.label}
                      className={
                        row.highlight
                          ? "bg-emerald-950/30 font-bold"
                          : "hover:bg-slate-800/30"
                      }
                    >
                      <td className="py-3 px-4 font-bold text-white">
                        {row.label}
                      </td>
                      <td className="py-3 px-4 text-end font-mono text-slate-300">
                        {row.y25.toLocaleString()}
                        {row.isMoney ? " FCFA" : ""}
                      </td>
                      <td className="py-3 px-4 text-end font-mono font-bold text-emerald-400">
                        {row.y26.toLocaleString()}
                        {row.isMoney ? " FCFA" : ""}
                      </td>
                      <td
                        className={`py-3 px-4 text-end font-mono font-bold ${
                          diff > 0
                            ? "text-emerald-400"
                            : diff < 0
                            ? "text-rose-400"
                            : "text-slate-400"
                        }`}
                      >
                        {diff > 0 ? "+" : ""}
                        {diff.toLocaleString()}
                        {row.isMoney ? " FCFA" : ""}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Activity Feeds */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 print:gap-3">
          {/* Recent Marriages */}
          <div className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-rose-400" />
                <span>{dict.recentMarriagesTitle}</span>
              </h3>
              <Link
                href="/marriage"
                className="print:hidden text-[11px] font-bold text-rose-400 hover:underline"
              >
                {dict.openModule}
              </Link>
            </div>
            {marriages.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {dict.emptyList}
              </p>
            ) : (
              <div className="space-y-2">
                {marriages.slice(0, 5).map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">
                        {m.groom_full_name} &amp; {m.bride_full_name}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {m.contract_number}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {m.contract_date}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Donations */}
          <div className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>{dict.recentDonationsTitle}</span>
              </h3>
              <Link
                href="/finance/zakat"
                className="print:hidden text-[11px] font-bold text-amber-400 hover:underline"
              >
                {dict.openModule}
              </Link>
            </div>
            {donations.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {dict.emptyList}
              </p>
            ) : (
              <div className="space-y-2">
                {donations.slice(0, 5).map((d) => (
                  <div
                    key={d.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">
                        {d.donor_name || "Donateur"}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {d.receipt_number || d.category || "ZAKAT"}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
                      {Number(d.amount || 0).toLocaleString()} FCFA
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Bilan 2026 Fiches */}
          <div className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-emerald-400" />
                <span>{dict.recentBilanTitle}</span>
              </h3>
              <Link
                href="/bilan-2026"
                className="print:hidden text-[11px] font-bold text-emerald-400 hover:underline"
              >
                {dict.openModule}
              </Link>
            </div>
            {bilanFiches.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                {dict.emptyList}
              </p>
            ) : (
              <div className="space-y-2">
                {bilanFiches.slice(0, 5).map((f) => (
                  <div
                    key={f.id}
                    className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">
                        {f.section_name || f.payload?.sectionName || "Section"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {Array.isArray(f.payload?.villages)
                          ? `${f.payload.villages.length} villages`
                          : "Bilan 2026"}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {f.updated_at ? f.updated_at.slice(0, 10) : "2026"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* All Modules Directory (Screen Only) */}
        <section className="print:hidden bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div>
            <h2 className="text-base font-black text-white">
              {dict.modulesTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{dict.modulesDesc}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {moduleCards.map((mod) => (
              <Link
                key={mod.href}
                href={mod.href}
                className="p-3.5 rounded-2xl bg-slate-950/70 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition flex flex-col justify-between gap-2 group"
              >
                <div className="flex items-center justify-between">
                  <mod.icon className={`w-5 h-5 ${mod.color}`} />
                  {mod.stat !== undefined && (
                    <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono font-bold text-slate-300">
                      {mod.stat}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                    {mod.label}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <PrintSignatureFooter locale={currentLocale} />
      </div>
    </div>
  );
}
