"use client";

import React, { useState, useEffect } from "react";
import { 
  GraduationCap, 
  BookOpen, 
  Share2, 
  Search, 
  CheckCircle2, 
  HelpCircle, 
  Calendar, 
  Download, 
  User, 
  Sparkles,
  ShieldCheck,
  Building2,
  FileText,
  X,
  ArrowRight,
  Plus,
  Printer,
  Copy,
  Check,
  Phone,
  FileCheck2,
  Clock,
  Eye,
  Lock,
  Tag
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { FATWA_DICT } from "@/lib/module-i18n";

interface FatwaItem {
  id?: string;
  refCode: string;
  category: string;
  question: string;
  answer: string;
  evidence: string;
  scholarName: string;
  date: string;
  isPublic: boolean;
  status?: "PENDING" | "ANSWERED";
}

interface SermonItem {
  id: string;
  title: string;
  theme: string;
  suggestedDate: string;
  author: string;
  summary: string;
  fullText?: string;
  hadithRefs?: string[];
}

interface ReconciliationRecord {
  id: string;
  title: string;
  category: "نزاع وقفي ومساجد" | "صلح أسري وزوجي" | "معاملات تجارية ومالية";
  parties: string;
  arbitrators: string;
  sessionDate: string;
  location: string;
  status: "RESOLVED" | "IN_PROGRESS";
  statusLabel: string;
  summary: string;
  clauses: string[];
}

const INITIAL_FATWAS: FatwaItem[] = [
  {
    refCode: "FATWA-2026-0042",
    category: "فقه المعاملات المالية والزكاة",
    question: "ما هو الحكم الشرعي والضابط الفقهي في توزيع زكاة الأموال على هيئة بطاقات تموينية ذكية مشفرة للأسر الفقيرة بدلاً من النقد؟",
    answer: "يجوز شرعاً ولا حرج فيه، بل هو من المصلحة المعتبرة شرعاً إذا كان يضمن وصول عين المنفعة والسلع الأساسية (كالأرز والزيت والدقيق) للفقير ويحميه من تصريف المبالغ في غير وجه الحاجة، وقد قرر جمع من المحققين جواز إخراج القيمة أو السلع إذا كانت أصلح للفقير وأبعد عن الهدر.",
    evidence: "استدلالاً بفعل معاذ بن جبل رضي الله عنه مع أهل اليمن، وما قرره شيخ الإسلام ابن تيمية وأئمة الفقه في اعتبار مصلحة الآخذ.",
    scholarName: "فضيلة الشيخ الدكتور أحمدو تيجاني (Président du Conseil des Oulémas)",
    date: "12 شوال 1447",
    isPublic: true,
  },
  {
    refCode: "FATWA-2026-0038",
    category: "شؤون المساجد والأوقاف",
    question: "هل يجوز نقل فائض الطاقة الكهربائية المتولدة من منظومة الطاقة الشمسية الخاصة بالمسجد إلى بئر القرية الارتوازي المجاور؟",
    answer: "نعم يجوز ذلك ومندوب إليه شرعاً؛ لأن سقي الماء وعمارة المسجد كلاهما من سبل البر والوقف العام للمسلمين، وفضل الطاقة الشمسية يضيع هدراً إن لم يُستثمر، وصرف الفائض لبئر الماء يحقق مصلحة عامة وصدقة جارية لأهل القرية وعابري السبيل.",
    evidence: "قاعدة 'إعمال الوقف في مثله ومصلحته أولى من تعطيله'، وحديث 'أفضل الصدقة سقي الماء'.",
    scholarName: "الشيخ المفتي إبراهيم زبير (Mufti Régional)",
    date: "05 شوال 1447",
    isPublic: true,
  },
];

const INITIAL_SERMONS: SermonItem[] = [
  {
    id: "KHUTBAH-2026-16",
    title: "عمارة بيوت الله بالأخلاق والتكافل وسقيا الماء في البوادي",
    theme: "رقائق ومسؤولية مجتمعية",
    suggestedDate: "الجمعة 17 شوال 1447هـ",
    author: "مجلس العلماء وهيئة الإفتاء المركزية",
    summary: "الحث على صيانة المساجد ومصليات القرى، وفضل إيصال الماء الصالح للشرب للمناطق النائية، ورعاية أيتام المسلمين.",
    fullText: `الحمد لله الذي بنعمته تتم الصالحات، عَمَّر قلوب أوليائه بالإيمان، ونوَّر بيوته بتلاوة القرآن.
أما بعد عباد الله: فإن عمارة المساجد ليست بحصى بنيانها وزخرفة جدرانها فحسب، بل بعمارة الأرواح بالأخلاق الحسنة وبث روح التكافل وإغاثة الملهوف وسقيا الماء في البوادي والقرى العطشى.
قال النبي ﷺ: «من سقى مسلمًا على ظمإٍ سقاه الله من الرحيق المختوم»...`,
    hadithRefs: ["صحيح البخاري: كتاب المساقاة", "سنن أبي داود: باب فضل سقي الماء"]
  },
  {
    id: "KHUTBAH-2026-17",
    title: "أثر استقرار الأسرة وميثاق الزواج الغليظ في نهضة المجتمع",
    theme: "الأسرة والمجتمع",
    suggestedDate: "الجمعة 24 شوال 1447هـ",
    author: "لجنة التوجيه والإرشاد الأسري",
    summary: "بيان حقوق الزوجين، التحذير من غلاء المهور، وتيسير سبل الزواج في بيوت الله صيانة للشباب والفتيات.",
    fullText: `الحمد لله الذي جعل الزواج آية من آياته الكبرى وميثاقاً غليظاً مباركاً.
أيها المسلمون: إن قوام الأمم وصلاحها يبدأ من البيت المسلم القائم على المودة والرحمة والمعاشرة بالمعروف.
فاتقوا الله في أهليكم، ويسروا أمور الزواج ولا تغالوا في المهور فإن أعظم النكاح بركة أيسره مؤونة...`,
    hadithRefs: ["مسند أحمد: حديث بركة المهور", "صحيح مسلم: كتاب النكاح"]
  },
];

const INITIAL_RECONCILIATIONS: ReconciliationRecord[] = [
  {
    id: "RECON-2026-0001",
    title: "محضر الصلح الشرعي التاريخي لمسجد أبي بكر الصديق بمرادي (حي سورا بيلدي)",
    category: "نزاع وقفي ومساجد",
    parties: "إدارة جمعية إحياء السنة بمرادي & الشيخ ساني عبدو غلاديما ووفده",
    arbitrators: "كبير العلماء الإمام ألمو أنتومة (Sarkin Malammai) برعاية سلطنة مرادي",
    sessionDate: "07 أكتوبر 2026 / 1448هـ",
    location: "جامع الجمعة الكبير - عاصمة سلطنة مرادي",
    status: "RESOLVED",
    statusLabel: "تم الصلح وتوثيق المحضر النهائي المعتمد",
    summary: "إنهاء الخلاف الشرعي حول ولاية وإدارة مسجد أبي بكر الصديق وتثبيت الإمامة الراتبة بالتراضي التام وتجديد ميثاق الأخوة تحت إشراف السلطنة وهيئة العلماء.",
    clauses: [
      "إقرار الشيخ ساني عبدو غلاديما بصحة وثيقة تسليم المسجد لجمعية إحياء السنة بملء رضاه وبصفة دائمة.",
      "التأكيد على جمع كلمة المسلمين وصيانة المسجد من أي نزاع أو فرقة.",
      "إعادة تسيير إدارة المسجد للشيخ ساني ضمن صيغة تفاهم مؤطرة برعاية ومتابعة السلطنة.",
      "اعتماد محضر الصلح بوصفه وثيقة نهائية ملزمة للطرفين."
    ]
  },
  {
    id: "RECON-2026-0002",
    title: "محضر التراضي وفض نزاع بئر الوقف وحرم المسجد بقرية دان كولودو",
    category: "نزاع وقفي ومساجد",
    parties: "أهالي حارة البئر الشرقية & لجنة تسيير وقف المسجد",
    arbitrators: "الشيخ المفتي إبراهيم زبير وأعيان القرية",
    sessionDate: "02 شوال 1447هـ",
    location: "دار الإمام - مسجد الفاروق",
    status: "RESOLVED",
    statusLabel: "مكتمل وموقع بالأطراف",
    summary: "الاتفاق على خط سير شبكة أنابيب السقيا ومواعيد تشغيل مضخة الطاقة الشمسية لضمان وصول الماء بالتساوي لجميع الأهالي دون إضرار بحرم المسجد.",
    clauses: [
      "تخصيص صهريج البئر الرئيسي لميضأة المصلين خلال أوقات الصلوات الخمس.",
      "فتح محبس السقيا العام للأهالي يومياً من شروق الشمس حتى قبيل صلاة الظهر ومن العصر حتى المغرب.",
      "التزام جميع الأطراف بعدم التعدي على ألواح الطاقة الشمسية أو حرم المسجد الوقفي."
    ]
  }
];

export default function ScholarsFatwaPage() {
  const { currentLocale, isRtl } = useLocale();
  const dict = FATWA_DICT[currentLocale];

  const [activeTab, setActiveTab] = useState<"fatwa" | "sermons" | "reconciliation">("fatwa");
  const [searchQuery, setSearchQuery] = useState("");

  // البيانات المخزنة
  const [fatwas, setFatwas] = useState<FatwaItem[]>(INITIAL_FATWAS);
  const [sermons, setSermons] = useState<SermonItem[]>(INITIAL_SERMONS);
  const [reconciliations, setReconciliations] = useState<ReconciliationRecord[]>(INITIAL_RECONCILIATIONS);

  // استرجاع البيانات من localStorage وربط /api/fatwa و /api/auth/me
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ANSWERED" | "PENDING">("ALL");
  const [canAnswer, setCanAnswer] = useState(false);
  const [answeringFatwa, setAnsweringFatwa] = useState<FatwaItem | null>(null);
  const [answerText, setAnswerText] = useState("");
  const [evidenceText, setEvidenceText] = useState("");
  const [isSavingAnswer, setIsSavingAnswer] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const f = localStorage.getItem("manara_scholars_fatwas");
        if (f) setFatwas(JSON.parse(f));
        const s = localStorage.getItem("manara_scholars_sermons");
        if (s) setSermons(JSON.parse(s));
        const r = localStorage.getItem("manara_scholars_reconciliations");
        if (r) setReconciliations(JSON.parse(r));
      } catch (e) {
        console.warn("Storage load error", e);
      }
    }, 0);

    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((me) => {
        if (me?.authenticated && (me.role === "ADMIN" || me.role === "SCHOLAR")) {
          setCanAnswer(true);
        }
      })
      .catch(() => {});

    fetch("/api/fatwa")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!Array.isArray(data?.fatwas) || data.fatwas.length === 0) return;
        interface DbFatwa {
          id: string;
          ref_code: string;
          category: string;
          question: string;
          answer: string | null;
          evidence: string | null;
          scholar_name: string | null;
          created_at: string | null;
          is_public: boolean | null;
          status: string | null;
        }
        const liveItems: FatwaItem[] = (data.fatwas as DbFatwa[]).map((row) => ({
          id: row.id,
          refCode: row.ref_code,
          category: row.category || "شؤون عامة",
          question: row.question,
          answer:
            row.answer ||
            "قيد المراجعة والدراسة من قبل فضيلة المفتي المناوب بمجلس العلماء...",
          evidence: row.evidence || "سيتم إرفاق الأدلة الفقهية فور اعتماد الفتوى.",
          scholarName: row.scholar_name || "هيئة الفتوى والتدقيق الشرعي",
          date: row.created_at ? row.created_at.split("T")[0] : "اليوم",
          isPublic: row.is_public !== false,
          status: row.status === "ANSWERED" ? "ANSWERED" : "PENDING",
        }));
        setFatwas((prev) => {
          const seen = new Set(liveItems.map((i) => i.refCode));
          return [...liveItems, ...prev.filter((p) => !seen.has(p.refCode))];
        });
      })
      .catch(() => {});

    return () => clearTimeout(id);
  }, []);

  const saveFatwas = (list: FatwaItem[]) => {
    setFatwas(list);
    try { localStorage.setItem("manara_scholars_fatwas", JSON.stringify(list)); } catch (e) {}
  };

  const saveSermons = (list: SermonItem[]) => {
    setSermons(list);
    try { localStorage.setItem("manara_scholars_sermons", JSON.stringify(list)); } catch (e) {}
  };

  const saveReconciliations = (list: ReconciliationRecord[]) => {
    setReconciliations(list);
    try { localStorage.setItem("manara_scholars_reconciliations", JSON.stringify(list)); } catch (e) {}
  };

  // مودال 1: رفع استفتاء شرعي جديد
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionCategory, setNewQuestionCategory] = useState("فقه العبادات وأحكام الصلاة");
  const [askerName, setAskerName] = useState("");
  const [askerPhone, setAskerPhone] = useState("");
  const [questionSubmitted, setQuestionSubmitted] = useState(false);

  // مودال 2: تسجيل محضر صلح جديد
  const [isReconModalOpen, setIsReconModalOpen] = useState(false);
  const [reconTitle, setReconTitle] = useState("");
  const [reconCategory, setReconCategory] = useState<ReconciliationRecord["category"]>("نزاع وقفي ومساجد");
  const [reconParties, setReconParties] = useState("");
  const [reconArbitrators, setReconArbitrators] = useState("");
  const [reconLocation, setReconLocation] = useState("");
  const [reconSummary, setReconSummary] = useState("");
  const [reconClausesText, setReconClausesText] = useState("");

  // مودال 3: قراءة وتحميل خطبة الجمعة بالتفصيل
  const [selectedSermonForView, setSelectedSermonForView] = useState<SermonItem | null>(null);

  // مودال 4: استعراض وطباعة محضر الصلح
  const [selectedReconForView, setSelectedReconForView] = useState<ReconciliationRecord | null>(null);

  // حالة نسخ الرابط
  const [copiedRef, setCopiedRef] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedRef(id);
      setTimeout(() => setCopiedRef(null), 2000);
    }
  };

  // تقديم سؤال استفتاء وربطه بقاعدة البيانات
  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    let generatedRef = `FATWA-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await fetch("/api/fatwa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: newQuestionCategory,
          askerName: askerName.trim() || "مستفتٍ",
          question: newQuestionText.trim(),
          isPublic: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.fatwa?.ref_code) {
          generatedRef = data.fatwa.ref_code;
        }
      }
    } catch {
      // fallback to local storage if offline
    }

    const newFatwa: FatwaItem = {
      refCode: generatedRef,
      category: newQuestionCategory,
      question: newQuestionText.trim(),
      answer: "قيد المراجعة والدراسة من قبل فضيلة المفتي المناوب بمجلس العلماء...",
      evidence: "سيتم إرفاق الأدلة الفقهية فور اعتماد الفتوى.",
      scholarName: "هيئة الفتوى والتدقيق الشرعي",
      date: "اليوم",
      isPublic: true,
      status: "PENDING",
    };

    saveFatwas([newFatwa, ...fatwas]);
    setQuestionSubmitted(true);
    setTimeout(() => {
      setQuestionSubmitted(false);
      setIsQuestionModalOpen(false);
      setNewQuestionText("");
      setAskerName("");
      setAskerPhone("");
    }, 2000);
  };

  const handleSaveAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answeringFatwa || !answerText.trim()) return;
    setIsSavingAnswer(true);
    try {
      if (answeringFatwa.id) {
        await fetch("/api/fatwa", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: answeringFatwa.id,
            answer: answerText.trim(),
            evidence: evidenceText.trim() || undefined,
          }),
        });
      }
      const updated = fatwas.map((f) =>
        f.refCode === answeringFatwa.refCode
          ? {
              ...f,
              answer: answerText.trim(),
              evidence: evidenceText.trim() || f.evidence,
              status: "ANSWERED" as const,
            }
          : f
      );
      saveFatwas(updated);
      setAnsweringFatwa(null);
      setAnswerText("");
      setEvidenceText("");
    } finally {
      setIsSavingAnswer(false);
    }
  };

  // تسجيل محضر صلح جديد
  const handleCreateReconciliation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reconTitle.trim() || !reconParties.trim()) return;

    const clausesArray = reconClausesText
      .split("\n")
      .map(c => c.trim())
      .filter(c => c.length > 0);

    const newRecord: ReconciliationRecord = {
      id: `RECON-2026-${Date.now().toString().slice(-4)}`,
      title: reconTitle.trim(),
      category: reconCategory,
      parties: reconParties.trim(),
      arbitrators: reconArbitrators.trim() || "لجنة الصلح والتحكيم الشرعي بالمسجد",
      sessionDate: "اليوم",
      location: reconLocation.trim() || "جامع المركز الكبير",
      status: "RESOLVED",
      statusLabel: "تم الصلح وتوثيق المحضر النهائي",
      summary: reconSummary.trim(),
      clauses: clausesArray.length > 0 ? clausesArray : ["تم التراضي الكامل بين الطرفين وإسقاط كافة الدعاوى بنية خالصة لله."]
    };

    saveReconciliations([newRecord, ...reconciliations]);
    setIsReconModalOpen(false);
    setReconTitle("");
    setReconParties("");
    setReconArbitrators("");
    setReconLocation("");
    setReconSummary("");
    setReconClausesText("");

    // فتح المحضر للمعاينة والطباعة مباشرة
    setSelectedReconForView(newRecord);
  };

  return (
    <div 
      className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 selection:bg-teal-500 selection:text-white ${isRtl ? "rtl font-sans" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-teal-900/30 shrink-0">
              <GraduationCap className="w-7 h-7 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex flex-wrap items-center gap-2">
                {dict.title}
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  {dict.badge}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {dict.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setIsQuestionModalOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 active:scale-95 cursor-pointer ring-2 ring-teal-400/30"
            >
              <HelpCircle className="w-4 h-4" />
              <span>{dict.askBtn}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
          {[
            { id: "fatwa", label: dict.tabFatwa, icon: HelpCircle, count: fatwas.length },
            { id: "sermons", label: dict.tabSermons, icon: BookOpen, count: sermons.length },
            { id: "reconciliation", label: dict.tabRecon, icon: ShieldCheck, count: reconciliations.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as "fatwa" | "sermons" | "reconciliation");
                setSelectedCategory("ALL");
              }}
              className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-teal-600 text-white shadow-md shadow-teal-900/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 15)}...</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-800 text-teal-400"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar + Smart Sections / Categories */}
        <div className="space-y-3 bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute top-3.5 start-4 text-slate-500" />
            <input
              type="text"
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-11 pe-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {activeTab === "fatwa" && (() => {
            const uiLabels = {
              ar: { all: "كل الأقسام", answered: "معتمدة", pending: "بانتظار الإجابة" },
              fr: { all: "Toutes catégories", answered: "Validées", pending: "En attente" },
              ha: { all: "Dukkan sassan", answered: "An amsa", pending: "Ana jira" },
            }[currentLocale];
            const categories = Array.from(new Set(fatwas.map((f) => f.category)));
            return (
              <div className="flex flex-wrap items-center gap-2">
                {(["ALL", "ANSWERED", "PENDING"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                      statusFilter === st
                        ? "bg-emerald-600 text-white border-emerald-500"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600"
                    }`}
                  >
                    {st === "ALL" ? uiLabels.all : st === "ANSWERED" ? uiLabels.answered : uiLabels.pending}
                  </button>
                ))}
                <span className="text-slate-700">|</span>
                <button
                  type="button"
                  onClick={() => setSelectedCategory("ALL")}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                    selectedCategory === "ALL"
                      ? "bg-teal-600 text-white border-teal-500"
                      : "bg-slate-950 text-slate-400 border-slate-800 hover:text-white"
                  }`}
                >
                  {uiLabels.all} ({fatwas.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-teal-600 text-white border-teal-500"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-teal-500/40"
                    }`}
                  >
                    {cat} ({fatwas.filter((f) => f.category === cat).length})
                  </button>
                ))}
              </div>
            );
          })()}
        </div>

        {/* ============================================================== */}
        {/* Tab 1: Fatwa Ledger */}
        {/* ============================================================== */}
        {activeTab === "fatwa" && (() => {
          const cardText = {
            ar: {
              q: "سؤال:",
              a: "الجواب والفتوى المعتمدة:",
              ev: "التأصيل والدليل:",
              scholar: "المفتي المجيب:",
              share: "مشاركة الفتوى",
              copied: "تم النسخ بنجاح",
              answerBtn: "إجابة واعتماد",
              pendingBadge: "قيد المراجعة",
              answeredBadge: "فتوى معتمدة",
            },
            fr: {
              q: "Question :",
              a: "Réponse & Fatwa validée :",
              ev: "Preuve & Argumentaire :",
              scholar: "Mufti / Savant :",
              share: "Partager",
              copied: "Copié !",
              answerBtn: "Répondre & Valider",
              pendingBadge: "En attente",
              answeredBadge: "Validée",
            },
            ha: {
              q: "Tambaya:",
              a: "Amsa da Fatawa:",
              ev: "Dalili daga Alƙur'ani da Sunnah:",
              scholar: "Malami mai amsa:",
              share: "Raba Fatawa",
              copied: "An kwafe!",
              answerBtn: "Amsa Fatawa",
              pendingBadge: "Ana jira",
              answeredBadge: "An tabbatar",
            },
          }[currentLocale];

          return (
            <div className="space-y-4">
              {fatwas
                .filter((f) => {
                  const isAnswered = f.status !== "PENDING" && !f.answer.includes("قيد المراجعة");
                  if (statusFilter === "ANSWERED" && !isAnswered) return false;
                  if (statusFilter === "PENDING" && isAnswered) return false;
                  if (selectedCategory !== "ALL" && f.category !== selectedCategory) return false;
                  const q = searchQuery.toLowerCase();
                  return (
                    !q ||
                    f.question.toLowerCase().includes(q) ||
                    f.category.toLowerCase().includes(q) ||
                    f.refCode.toLowerCase().includes(q) ||
                    f.answer.toLowerCase().includes(q)
                  );
                })
                .map((fatwa) => {
                  const isPending =
                    fatwa.status === "PENDING" || fatwa.answer.includes("قيد المراجعة");
                  return (
                    <div
                      key={fatwa.refCode}
                      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-teal-500/40 transition shadow-lg"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-800/40">
                            {fatwa.refCode}
                          </span>
                          <span className="text-xs font-bold text-slate-300 bg-slate-800/70 px-2.5 py-1 rounded-lg">
                            {fatwa.category}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isPending
                                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                            }`}
                          >
                            {isPending ? cardText.pendingBadge : cardText.answeredBadge}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {fatwa.date}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-bold text-white flex items-start gap-2">
                          <span className="text-teal-400 font-black shrink-0">{cardText.q}</span>
                          <p className="leading-relaxed">{fatwa.question}</p>
                        </div>

                        <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                          <span className="text-emerald-400 font-bold block">{cardText.a}</span>
                          <p className="text-slate-300 leading-relaxed">{fatwa.answer}</p>

                          <div className="pt-2 border-t border-slate-800/80 text-slate-400">
                            <strong className="text-slate-300">{cardText.ev} </strong>
                            {fatwa.evidence}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-teal-400" />
                          {cardText.scholar} <strong className="text-white">{fatwa.scholarName}</strong>
                        </span>

                        <div className="flex items-center gap-3">
                          {canAnswer && (
                            <button
                              type="button"
                              onClick={() => {
                                setAnsweringFatwa(fatwa);
                                setAnswerText(isPending ? "" : fatwa.answer);
                                setEvidenceText(isPending ? "" : fatwa.evidence);
                              }}
                              className="px-3 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold cursor-pointer transition"
                            >
                              {cardText.answerBtn}
                            </button>
                          )}
                          <button
                            onClick={() =>
                              handleCopyText(
                                `[${fatwa.refCode}]\n${cardText.q} ${fatwa.question}\n${cardText.a} ${fatwa.answer}\n${cardText.scholar} ${fatwa.scholarName}`,
                                fatwa.refCode
                              )
                            }
                            className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1 cursor-pointer transition"
                          >
                            {copiedRef === fatwa.refCode ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">{cardText.copied}</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5" />
                                <span>{cardText.share}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          );
        })()}

        {answeringFatwa && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <form
              onSubmit={handleSaveAnswer}
              className="bg-slate-900 border border-teal-500/40 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-mono text-xs font-bold text-teal-400">
                  {answeringFatwa.refCode}
                </span>
                <button
                  type="button"
                  onClick={() => setAnsweringFatwa(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs font-bold text-white bg-slate-950 p-3 rounded-xl border border-slate-800">
                {answeringFatwa.question}
              </p>
              <textarea
                required
                rows={4}
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="الجواب والفتوى المعتمدة..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <input
                type="text"
                value={evidenceText}
                onChange={(e) => setEvidenceText(e.target.value)}
                placeholder="التأصيل والدليل الشرعي..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-teal-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAnsweringFatwa(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  {currentLocale === "ar" ? "إلغاء" : currentLocale === "ha" ? "Fasa" : "Annuler"}
                </button>
                <button
                  type="submit"
                  disabled={isSavingAnswer}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  {isSavingAnswer
                    ? "..."
                    : currentLocale === "ar"
                      ? "اعتماد الفتوى"
                      : currentLocale === "ha"
                        ? "Tabbatar"
                        : "Valider"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* Tab 2: Sermons Bank */}
        {/* ============================================================== */}
        {activeTab === "sermons" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                مكتبة خطب الجمعة النموذجية وتوحيد المحتوى الدعوي
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sermons
                .filter(s => 
                  s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.theme.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.summary.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((sermon) => (
                <div 
                  key={sermon.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-teal-500/40 transition shadow-lg group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-800/40">
                        {sermon.theme}
                      </span>
                      <span className="text-xs text-slate-500">{sermon.suggestedDate}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition">{sermon.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{sermon.summary}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">{sermon.author}</span>
                    
                    <button 
                      onClick={() => setSelectedSermonForView(sermon)}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-teal-600 text-slate-200 hover:text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5 text-teal-400 group-hover:text-white" />
                      <span>قراءة وتحميل الخطبة</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* Tab 3: Reconciliation (محاضر جلسات الصلح والتحكيم) */}
        {/* ============================================================== */}
        {activeTab === "reconciliation" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-6 rounded-3xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                  <ShieldCheck className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">لجنة التحكيم وفض المنازعات الشرعية والصلح بالمسجد</h3>
                  <p className="text-xs text-slate-400">توثيق جلسات الصلح الأسري وفض النزاعات العقارية والوقفية برعاية العلماء والسلطنة</p>
                </div>
              </div>

              <button 
                onClick={() => setIsReconModalOpen(true)}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>تسجيل محضر صلح جديد</span>
              </button>
            </div>

            <div className="space-y-4">
              {reconciliations
                .filter(r => 
                  r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  r.parties.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  r.id.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((recon) => (
                <div 
                  key={recon.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg hover:border-slate-700 transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-400 bg-teal-950/60 px-2.5 py-1 rounded-lg border border-teal-800/40">
                        {recon.id}
                      </span>
                      <span className="text-xs font-bold text-slate-300">
                        {recon.category}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {recon.sessionDate} • {recon.location}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-base font-bold text-white">{recon.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{recon.summary}</p>
                    
                    <div className="text-xs text-slate-400 pt-1">
                      <div>الأطراف المعنية: <strong className="text-slate-200">{recon.parties}</strong></div>
                      <div>هيئة التحكيم: <strong className="text-teal-300">{recon.arbitrators}</strong></div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-900/40">
                      ✓ {recon.statusLabel}
                    </span>

                    <button 
                      onClick={() => setSelectedReconForView(recon)}
                      className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>معاينة وطباعة المحضر الرسمي</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* Modal 1: رفع استفتاء شرعي لمجلس العلماء */}
      {/* ============================================================== */}
      {isQuestionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-teal-900/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">رفع استفتاء شرعي لمجلس العلماء</h3>
                  <p className="text-xs text-slate-400">يُحال السؤال للمفتي المختص وتُرسل الإجابة عبر الهاتف أو بنك الفتاوى</p>
                </div>
              </div>
              <button onClick={() => setIsQuestionModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {questionSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">تم استلام سؤالك وتوليد الكود المرجعي!</h4>
                <p className="text-xs text-slate-400">
                  الكود المرجعي: <span className="font-mono text-teal-400 font-bold">FATWA-2026-NIGER</span>
                </p>
                <p className="text-xs text-slate-500">سيقوم فضيلة المفتي بدراسة المسألة وتوثيق الجواب بالأدلة الشرعية.</p>
              </div>
            ) : (
              <form onSubmit={handleQuestionSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">تصنيف المسألة الفقهية: *</label>
                  <select 
                    value={newQuestionCategory} 
                    onChange={(e) => setNewQuestionCategory(e.target.value)} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="فقه العبادات وأحكام الصلاة">فقه العبادات وأحكام الصلاة والطهارة</option>
                    <option value="فقه المعاملات المالية والزكاة">فقه المعاملات المالية والزكاة والبيوع</option>
                    <option value="أحوال شخصية وزواج ونكاح">أحوال شخصية وزواج ونكاح وطلاق</option>
                    <option value="شؤون المساجد والأوقاف">شؤون المساجد والمصليات والأوقاف</option>
                    <option value="قضايا معاصرة ونوازل">قضايا معاصرة ونوازل دعوية</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">نص السؤال أو الاستفتاء بالتفصيل: *</label>
                  <textarea 
                    required 
                    rows={4} 
                    value={newQuestionText} 
                    onChange={(e) => setNewQuestionText(e.target.value)} 
                    placeholder="اكتب تفاصيل المسألة بوضوح مع ذكر الظروف والملابسات..." 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white leading-relaxed resize-none focus:outline-none focus:border-teal-500" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">اسم السائل (اختياري):</label>
                    <input 
                      type="text" 
                      value={askerName} 
                      onChange={(e) => setAskerName(e.target.value)} 
                      placeholder="فاعل خير" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-teal-500" 
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">رقم الهاتف أو WhatsApp لاستلام الجواب:</label>
                    <input 
                      type="text" 
                      value={askerPhone} 
                      onChange={(e) => setAskerPhone(e.target.value)} 
                      placeholder="+227 90 00 00 00" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-teal-500" 
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setIsQuestionModalOpen(false)} 
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-teal-900/40"
                  >
                    إرسال الاستفتاء للمفتي
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Modal 2: تسجيل محضر صلح جديد */}
      {/* ============================================================== */}
      {isReconModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-teal-900/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">تسجيل وتوثيق محضر صلح شرعي جديد</h3>
              </div>
              <button onClick={() => setIsReconModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReconciliation} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">موضوع المحضر أو النزاع : *</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: محضر صلح حول إدارة مسجد أو فض نزاع عقاري"
                  value={reconTitle}
                  onChange={(e) => setReconTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">تصنيف النزاع :</label>
                  <select 
                    value={reconCategory}
                    onChange={(e) =>
                      setReconCategory(
                        e.target.value as
                          | "نزاع وقفي ومساجد"
                          | "صلح أسري وزوجي"
                          | "معاملات تجارية ومالية"
                      )
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-teal-500"
                  >
                    <option value="نزاع وقفي ومساجد">نزاع وقفي ومساجد</option>
                    <option value="صلح أسري وزوجي">صلح أسري وزوجي</option>
                    <option value="معاملات تجارية ومالية">معاملات تجارية ومالية</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">مكان انعقاد الجلسة :</label>
                  <input 
                    type="text" 
                    placeholder="جامع السلطنة الكبير"
                    value={reconLocation}
                    onChange={(e) => setReconLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">أطراف النزاع والشهود : *</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: جمعية إحياء السنة بمرادي & الشيخ ساني عبدو غلاديما"
                  value={reconParties}
                  onChange={(e) => setReconParties(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">هيئة المحكمين والعلماء الراعية :</label>
                <input 
                  type="text" 
                  placeholder="مثال: فضيلة الشيخ الإمام ألمو أنتومة برعاية سلطان مرادي"
                  value={reconArbitrators}
                  onChange={(e) => setReconArbitrators(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">موجز القضية وأصل الخلاف :</label>
                <textarea 
                  rows={2}
                  placeholder="وصف مختصر لأصل النزاع وأسباب التداعي..."
                  value={reconSummary}
                  onChange={(e) => setReconSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">بنود الاتفاق والصلح الشرعي (كل بند في سطر) :</label>
                <textarea 
                  rows={3}
                  placeholder="1. إقرار الأطراف بالتراضي التام&#10;2. إسقاط كافة الشكاوى&#10;3. التزام الطرفين برعاية حرم المسجد"
                  value={reconClausesText}
                  onChange={(e) => setReconClausesText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-3 flex items-center gap-2 border-t border-slate-800">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold rounded-xl shadow transition cursor-pointer"
                >
                  اعتماد وتوثيق المحضر
                </button>
                <button
                  type="button"
                  onClick={() => setIsReconModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Modal 3: قراءة وتحميل خطبة الجمعة */}
      {/* ============================================================== */}
      {selectedSermonForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-teal-900/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-400" />
                <span className="font-mono text-xs text-teal-400 font-bold bg-teal-950/60 px-2.5 py-0.5 rounded border border-teal-800/40">
                  {selectedSermonForView.id}
                </span>
              </div>
              <button onClick={() => setSelectedSermonForView(null)} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="bg-teal-500/10 text-teal-300 px-3 py-1 rounded-full font-bold">{selectedSermonForView.theme}</span>
                <span>{selectedSermonForView.suggestedDate}</span>
              </div>

              <h3 className="text-xl font-black text-white">{selectedSermonForView.title}</h3>
              <p className="text-xs text-slate-400">إعداد واعتماد: {selectedSermonForView.author}</p>
            </div>

            {/* نص الخطبة الفعلي */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs leading-loose text-slate-200">
              <div className="border-b border-slate-800 pb-2 text-[11px] text-teal-400 font-bold">
                نص الخطبة المعتمدة للإلقاء المنبري:
              </div>
              <p className="whitespace-pre-line font-serif text-sm text-slate-100">
                {selectedSermonForView.fullText || selectedSermonForView.summary}
              </p>

              {selectedSermonForView.hadithRefs && (
                <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                  <span className="font-bold text-slate-300 block">التخريج والأحاديث المستشهد بها:</span>
                  {selectedSermonForView.hadithRefs.map((h, i) => (
                    <div key={i}>• {h}</div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة الخطبة بصيغة PDF</span>
              </button>

              <button 
                onClick={() => handleCopyText(`${selectedSermonForView.title}\n\n${selectedSermonForView.fullText || selectedSermonForView.summary}`, selectedSermonForView.id)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedRef === selectedSermonForView.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>تم النسخ</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>نسخ النص</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Modal 4: استعراض وطباعة محضر الصلح الرسمي */}
      {/* ============================================================== */}
      {selectedReconForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-teal-900/50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-400" />
                <span className="font-mono text-xs text-teal-400 font-bold bg-teal-950/60 px-2.5 py-0.5 rounded border border-teal-800/40">
                  {selectedReconForView.id}
                </span>
              </div>
              <button onClick={() => setSelectedReconForView(null)} className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* الوثيقة الرسمية للطباعة */}
            <div id="print-recon-doc" className="bg-white text-slate-950 p-6 rounded-2xl border-2 border-slate-300 space-y-4 shadow-inner">
              <div className="hidden print:block w-full mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/official-letterhead.jpg"
                  alt="Ihya'ous Sounnah — Coordination Régionale de Maradi"
                  className="w-full h-auto block"
                />
              </div>
              <div className="text-center border-b-2 border-dashed border-slate-300 pb-3 space-y-1">
                <span className="text-[10px] font-bold text-slate-500 block">الجمهورية الإسلامية - مجلس العلماء ولجان التحكيم والصلح الشرعي</span>
                <h3 className="text-base font-black text-slate-950">{selectedReconForView.title}</h3>
                <span className="text-xs text-emerald-800 font-bold block">«وَالصُّلْحُ خَيْرٌ» • وثيقة صلح شرعية ملزمة ومعتمدة</span>
              </div>

              <div className="text-xs space-y-2 text-slate-800">
                <div className="flex justify-between border-b border-slate-200 pb-1">
                  <span>تاريخ الجلسة: <strong>{selectedReconForView.sessionDate}</strong></span>
                  <span>المكان: <strong>{selectedReconForView.location}</strong></span>
                </div>
                <div>
                  <span className="text-slate-500">الأطراف المتصالحة: </span>
                  <strong className="text-slate-900">{selectedReconForView.parties}</strong>
                </div>
                <div>
                  <span className="text-slate-500">هيئة التحكيم المشرفة: </span>
                  <strong className="text-slate-900">{selectedReconForView.arbitrators}</strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 block mb-1">موجز الواقعة والنزاع:</strong>
                {selectedReconForView.summary}
              </div>

              <div className="space-y-1.5 text-xs text-slate-800">
                <strong className="text-slate-950 block">البنود والقرارات الشرعية المتفق عليها:</strong>
                {selectedReconForView.clauses.map((clause, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-bold">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{clause}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t-2 border-slate-300 grid grid-cols-2 text-center text-xs text-slate-700">
                <div>
                  <span className="block font-bold">توقيع أطراف الصلح والتراضي</span>
                  <div className="h-10 mt-1 flex items-center justify-center italic text-slate-400 font-serif">
                    (توقيع وإقرار بالرضا التام)
                  </div>
                </div>
                <div>
                  <span className="block font-bold">ختم واعتماد مجلس العلماء والسلطنة</span>
                  <div className="h-10 mt-1 flex items-center justify-center font-bold text-emerald-800">
                    [معتمد ومختوم رسمياً]
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة المحضر الرسمي المعتمد</span>
              </button>

              <button 
                onClick={() => handleCopyText(`[محضر صلح شرعي - ${selectedReconForView.id}]\n${selectedReconForView.title}\nالأطراف: ${selectedReconForView.parties}\nالمحكمين: ${selectedReconForView.arbitrators}`, selectedReconForView.id)}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {copiedRef === selectedReconForView.id ? "تم النسخ" : "نسخ المحضر"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
