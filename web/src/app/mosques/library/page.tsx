"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Library, 
  Search, 
  Barcode, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Bookmark, 
  Plus, 
  Sparkles,
  BookMarked,
  Filter,
  Users,
  X,
  Printer,
  RotateCcw,
  Share2,
  SlidersHorizontal,
  Layers,
  Wrench,
  HelpCircle,
  FileText,
  UserCheck,
  Check,
  Trash2,
  Calendar,
  Phone
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { LIBRARY_DICT } from "@/lib/module-i18n";

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  shelf: string;
  barcode: string;
  totalCopies: number;
  availableCopies: number;
  description?: string;
}

interface QuranItem {
  id: string;
  type: string;
  riwayah: string;
  totalCount: number;
  goodCondition: number;
  needsRestoration: number;
  location: string;
}

interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  borrower: string;
  phone: string;
  nationalId?: string;
  loanDate: string;
  dueDate: string;
  status: "ACTIVE" | "RETURNED";
  statusLabel: string;
  notes?: string;
}

const INITIAL_BOOKS: Book[] = [
  {
    id: "BK-2026-0104",
    title: "صحيح الإمام البخاري (طبعة محققة مع الفهارس)",
    author: "الإمام محمد بن إسماعيل البخاري",
    category: "الحديث الشريف وعلومه",
    shelf: "الخزانة أ - الرف 2",
    barcode: "978-9953-520-01-2",
    totalCopies: 4,
    availableCopies: 3,
    description: "طبعة دار ابن كثير الفاخرة بأربعة أجزاء مشكولة ومفهرسة بالأطراف."
  },
  {
    id: "BK-2026-0105",
    title: "بداية المجتهد ونهاية المقتصد في الفقه المقارن",
    author: "ابن رشد القرطبي",
    category: "الفقه وأصوله",
    shelf: "الخزانة ب - الرف 1",
    barcode: "978-9953-520-45-8",
    totalCopies: 3,
    availableCopies: 2,
    description: "كتاب جامع لأسباب اختلاف الفقهاء وأدلتهم المعتمدة."
  },
  {
    id: "BK-2026-0106",
    title: "تفسير القرآن العظيم (تفسير ابن كثير - 4 مجلدات)",
    author: "الحافظ ابن كثير الدمشقي",
    category: "التفسير وعلوم القرآن",
    shelf: "الخزانة ج - الرف 3",
    barcode: "978-9953-520-88-1",
    totalCopies: 5,
    availableCopies: 4,
    description: "أشهر تفاسير أهل السنة بالأثر مع تخريج الأحاديث."
  },
  {
    id: "BK-2026-0107",
    title: "موطأ الإمام مالك برواية يحيى بن يحيى الليثي",
    author: "الإمام مالك بن أنس",
    category: "الحديث والفقه المالكي",
    shelf: "الخزانة أ - الرف 4",
    barcode: "978-9953-520-99-9",
    totalCopies: 6,
    availableCopies: 5,
    description: "العمدة في المذهب المالكي والحديث النبوي الشريف لعلماء غرب أفريقيا."
  },
];

const INITIAL_QURAN: QuranItem[] = [
  {
    id: "QR-01",
    type: "مصحف جوامعي كبير (حجم التراويح والمنابر)",
    riwayah: "رواية ورش عن نافع",
    totalCount: 45,
    goodCondition: 42,
    needsRestoration: 3,
    location: "مقصورة الإمام وكراسي المحراب",
  },
  {
    id: "QR-02",
    type: "مصحف ربع / حجم عادي (للمصلين ورواد المسجد)",
    riwayah: "رواية حفص ورواية ورش",
    totalCount: 420,
    goodCondition: 395,
    needsRestoration: 25,
    location: "أرفف وأعمدة صحن المسجد",
  },
  {
    id: "QR-03",
    type: "أجزاء مفردة ومصاحف تعليمية (لحلقات القرآن للأطفال)",
    riwayah: "رواية قالون ورواية حفص",
    totalCount: 180,
    goodCondition: 160,
    needsRestoration: 20,
    location: "خزائن فصول حلقات التحفيظ",
  },
];

const INITIAL_LOANS: Loan[] = [
  {
    id: "LOAN-2026-0019",
    bookId: "BK-2026-0105",
    borrower: "طالب العلم: عبد القادر موسى تانكو",
    phone: "+227 91 44 55 66",
    nationalId: "NID-227-9081",
    bookTitle: "بداية المجتهد ونهاية المقتصد في الفقه المقارن",
    loanDate: "05 شوال 1447",
    dueDate: "19 شوال 1447",
    status: "ACTIVE",
    statusLabel: "قيد المطالعة (مستحق الإرجاع قريباً)",
    notes: "الجزء الأول - أمانة طالب علم بالمعهد"
  },
  {
    id: "LOAN-2026-0018",
    bookId: "BK-2026-0106",
    borrower: "الأستاذ: إدريس إبراهيم ساليفو",
    phone: "+227 96 33 22 11",
    nationalId: "NID-227-7742",
    bookTitle: "تفسير القرآن العظيم (تفسير ابن كثير - 4 مجلدات)",
    loanDate: "20 رمضان 1447",
    dueDate: "04 شوال 1447",
    status: "RETURNED",
    statusLabel: "أُرجع بحالة ممتازة",
    notes: "تم الفحص وتسليمه لأمين المكتبة"
  },
];

export default function MosqueLibraryPage() {
  const { currentLocale, isRtl } = useLocale();
  const dict = LIBRARY_DICT[currentLocale];

  const [activeTab, setActiveTab] = useState<"books" | "quran_copies" | "loans">("books");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // الحالات التفاعلية
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [quranInventory, setQuranInventory] = useState<QuranItem[]>(INITIAL_QURAN);
  const [loans, setLoans] = useState<Loan[]>(INITIAL_LOANS);

  // استرجاع البيانات من localStorage
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const b = localStorage.getItem("manara_library_books");
        if (b) setBooks(JSON.parse(b));
        const q = localStorage.getItem("manara_library_quran");
        if (q) setQuranInventory(JSON.parse(q));
        const l = localStorage.getItem("manara_library_loans");
        if (l) setLoans(JSON.parse(l));
      } catch (e) {
        console.warn("Storage load error", e);
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const saveBooks = (list: Book[]) => {
    setBooks(list);
    try { localStorage.setItem("manara_library_books", JSON.stringify(list)); } catch (e) {}
  };

  const saveQuran = (list: QuranItem[]) => {
    setQuranInventory(list);
    try { localStorage.setItem("manara_library_quran", JSON.stringify(list)); } catch (e) {}
  };

  const saveLoans = (list: Loan[]) => {
    setLoans(list);
    try { localStorage.setItem("manara_library_loans", JSON.stringify(list)); } catch (e) {}
  };

  // 1. مودال إضافة كتاب جديد
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newCategory, setNewCategory] = useState("الحديث الشريف وعلومه");
  const [newShelf, setNewShelf] = useState("الخزانة أ - الرف 1");
  const [newCopies, setNewCopies] = useState("3");
  const [newBarcode, setNewBarcode] = useState("");

  // 2. مودال تسجيل إعارة سريعة
  const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);
  const [selectedBookForLoan, setSelectedBookForLoan] = useState<Book | null>(null);
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerPhone, setBorrowerPhone] = useState("");
  const [borrowerId, setBorrowerId] = useState("");
  const [loanDurationDays, setLoanDurationDays] = useState("14");

  // 3. مودال بطاقة الباركود والبطاقة التعريفية للكتاب
  const [isBarcodeCardOpen, setIsBarcodeCardOpen] = useState(false);
  const [selectedBookForBarcode, setSelectedBookForBarcode] = useState<Book | null>(null);

  // 4. مودال طلب ترميم المصاحف أو طلب مصاحف جديدة
  const [isRestorationModalOpen, setIsRestorationModalOpen] = useState(false);
  const [selectedQuranForRestoration, setSelectedQuranForRestoration] = useState<QuranItem | null>(null);
  const [restorationCount, setRestorationCount] = useState("5");
  const [restorationNotes, setRestorationNotes] = useState("");
  const [requestSuccess, setRequestSuccess] = useState(false);

  // إضافة كتاب جديد
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) return;

    const copiesCount = parseInt(newCopies) || 1;
    const autoBarcode = newBarcode.trim() || `978-9953-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1 + Math.random() * 9)}`;

    const newBook: Book = {
      id: `BK-${Date.now().toString().slice(-4)}`,
      title: newTitle.trim(),
      author: newAuthor.trim(),
      category: newCategory,
      shelf: newShelf.trim(),
      barcode: autoBarcode,
      totalCopies: copiesCount,
      availableCopies: copiesCount,
      description: "كتاب موقوف للمطالعة والبحث العلمي بالمسجد."
    };

    saveBooks([newBook, ...books]);
    setIsAddBookOpen(false);
    setNewTitle("");
    setNewAuthor("");
    setNewBarcode("");
    setNewCopies("3");
  };

  // تسجيل إعارة سريعة
  const handleCreateLoan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookForLoan || !borrowerName.trim()) return;

    // تحديث عدد النسخ المتاحة للكتاب
    const updatedBooks = books.map(b => {
      if (b.id === selectedBookForLoan.id) {
        return {
          ...b,
          availableCopies: Math.max(0, b.availableCopies - 1)
        };
      }
      return b;
    });
    saveBooks(updatedBooks);

    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + (parseInt(loanDurationDays) || 14));

    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
    const loanDateStr = new Intl.DateTimeFormat("ar-EG", options).format(now);
    const dueDateStr = new Intl.DateTimeFormat("ar-EG", options).format(dueDate);

    const newLoan: Loan = {
      id: `LOAN-${Date.now().toString().slice(-4)}`,
      bookId: selectedBookForLoan.id,
      bookTitle: selectedBookForLoan.title,
      borrower: borrowerName.trim(),
      phone: borrowerPhone.trim() || "+227 -- -- -- --",
      nationalId: borrowerId.trim() || "NID-VERIFIED",
      loanDate: loanDateStr,
      dueDate: dueDateStr,
      status: "ACTIVE",
      statusLabel: "قيد المطالعة (مستحق الإرجاع)",
      notes: `المدة المحددة: ${loanDurationDays} يوماً`
    };

    saveLoans([newLoan, ...loans]);
    setIsLoanModalOpen(false);
    setBorrowerName("");
    setBorrowerPhone("");
    setBorrowerId("");
    setSelectedBookForLoan(null);
  };

  // إرجاع كتاب مستعار
  const handleReturnBook = (loanId: string) => {
    const targetLoan = loans.find(l => l.id === loanId);
    if (!targetLoan || targetLoan.status === "RETURNED") return;

    // تحديث سجل الإعارة
    const updatedLoans = loans.map(l => {
      if (l.id === loanId) {
        return {
          ...l,
          status: "RETURNED" as const,
          statusLabel: "أُرجع بحالة ممتازة إلى رفوف المكتبة"
        };
      }
      return l;
    });
    saveLoans(updatedLoans);

    // زيادة النسخ المتاحة للكتاب
    const updatedBooks = books.map(b => {
      if (b.id === targetLoan.bookId) {
        return {
          ...b,
          availableCopies: Math.min(b.totalCopies, b.availableCopies + 1)
        };
      }
      return b;
    });
    saveBooks(updatedBooks);
  };

  // تقديم طلب ترميم أو مصاحف جديدة
  const handleSendRestorationRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuranForRestoration) return;

    const count = parseInt(restorationCount) || 1;
    // تحديث حالة المصاحف التي ستحال للترميم
    const updatedQuran = quranInventory.map(q => {
      if (q.id === selectedQuranForRestoration.id) {
        return {
          ...q,
          needsRestoration: Math.max(0, q.needsRestoration - count),
          goodCondition: q.goodCondition + count
        };
      }
      return q;
    });

    setRequestSuccess(true);
    setTimeout(() => {
      saveQuran(updatedQuran);
      setRequestSuccess(false);
      setIsRestorationModalOpen(false);
      setRestorationNotes("");
    }, 1800);
  };

  // تصفية الكتب حسب الفئة والبحث
  const filteredBooks = books.filter(b => {
    const matchesCategory = categoryFilter === "ALL" || b.category === categoryFilter;
    const matchesSearch = 
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.barcode.includes(searchQuery) ||
      b.shelf.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div 
      className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 selection:bg-indigo-500 selection:text-white ${isRtl ? "rtl font-sans" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-900/30 shrink-0">
              <Library className="w-7 h-7 text-white stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex flex-wrap items-center gap-2">
                {dict.title}
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
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
              onClick={() => setIsAddBookOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>فهرسة كتاب جديد</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
          {[
            { id: "books", label: dict.tabBooks, icon: BookOpen, count: books.length },
            { id: "quran_copies", label: dict.tabQuran, icon: BookMarked, count: quranInventory.reduce((acc, q) => acc + q.totalCount, 0) },
            { id: "loans", label: dict.tabLoans, icon: Users, count: loans.filter(l => l.status === "ACTIVE").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as "books" | "quran_copies" | "loans")
              }
              className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 15)}...</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-800 text-indigo-400"}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* Tab 1: Books Catalog */}
        {/* ============================================================== */}
        {activeTab === "books" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 absolute top-3 right-3 text-slate-500" />
                <input
                  type="text"
                  placeholder={dict.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* فلتر التصنيفات الفقهية */}
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                <Filter className="w-4 h-4 text-slate-500 shrink-0" />
                {[
                  { id: "ALL", label: "جميع العلوم" },
                  { id: "الحديث الشريف وعلومه", label: "الحديث" },
                  { id: "الفقه وأصوله", label: "الفقه" },
                  { id: "التفسير وعلوم القرآن", label: "التفسير" },
                  { id: "الحديث والفقه المالكي", label: "المالكي" },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                      categoryFilter === cat.id
                        ? "bg-indigo-600 text-white shadow"
                        : "bg-slate-950 text-slate-400 hover:text-white"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBooks.map((b) => (
                <div 
                  key={b.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4 hover:border-indigo-500/40 transition shadow-lg group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-lg border border-indigo-800/40">
                        {b.category}
                      </span>
                      <button 
                        onClick={() => {
                          setSelectedBookForBarcode(b);
                          setIsBarcodeCardOpen(true);
                        }}
                        className="text-xs font-mono text-slate-400 hover:text-indigo-300 flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 cursor-pointer transition"
                        title="معاينة وطباعة بطاقة الباركود"
                      >
                        <Barcode className="w-3.5 h-3.5 text-indigo-400" />
                        <span>{b.barcode}</span>
                      </button>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition">{b.title}</h3>
                    <p className="text-xs text-slate-300">المؤلف: <strong className="text-white">{b.author}</strong></p>
                    <p className="text-xs text-slate-400">مكان الحفظ: <span className="text-indigo-300 font-mono">{b.shelf}</span></p>
                    
                    {b.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2">{b.description}</p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className={`font-bold ${b.availableCopies > 0 ? "text-emerald-400" : "text-amber-400"}`}>
                      متاح للإعارة: {b.availableCopies} من أصل {b.totalCopies} نسخة
                    </span>
                    
                    <button 
                      onClick={() => {
                        setSelectedBookForLoan(b);
                        setIsLoanModalOpen(true);
                      }}
                      disabled={b.availableCopies === 0}
                      className={`px-3.5 py-1.5 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                        b.availableCopies > 0
                          ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-900/30"
                          : "bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>{b.availableCopies > 0 ? "تسجيل إعارة سريعة" : "كافة النسخ معارة"}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* Tab 2: Quran Inventory */}
        {/* ============================================================== */}
        {activeTab === "quran_copies" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-indigo-400" />
                جرد المصاحف الوقفية وأجزاء التلاوة بالمسجد
              </h2>
              <span className="text-xs text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/40 font-bold">
                إجمالي المصاحف المسجلة: {quranInventory.reduce((acc, q) => acc + q.totalCount, 0)} مصحف
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quranInventory.map((item) => (
                <div 
                  key={item.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-lg hover:border-slate-700 transition"
                >
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40 inline-block">
                      {item.riwayah}
                    </span>
                    <h3 className="text-base font-bold text-white">{item.type}</h3>
                    <p className="text-xs text-slate-400">الموقع: {item.location}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-500 block">الإجمالي</span>
                      <strong className="text-white text-base font-mono">{item.totalCount}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-400 block">سليم وجاهز</span>
                      <strong className="text-emerald-400 text-base font-mono">{item.goodCondition}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 block">يحتاج تجليد</span>
                      <strong className="text-amber-400 text-base font-mono">{item.needsRestoration}</strong>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setSelectedQuranForRestoration(item);
                      setIsRestorationModalOpen(true);
                    }}
                    className="w-full py-2.5 bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-400" />
                    <span>طلب ترميم أو مصاحف جديدة</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* Tab 3: Loans */}
        {/* ============================================================== */}
        {activeTab === "loans" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" />
                سجل استعارة كتب الوقف لطلاب العلم والباحثين
              </h2>
              <span className="text-xs text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40 font-bold">
                {loans.filter(l => l.status === "ACTIVE").length} إعارة نشطة حالياً
              </span>
            </div>

            <div className="space-y-4">
              {loans.map((loan) => (
                <div 
                  key={loan.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg hover:border-slate-700 transition"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
                        {loan.id}
                      </span>
                      <strong className="text-sm font-bold text-white">{loan.borrower}</strong>
                      <span className="text-xs text-slate-400 font-mono" dir="ltr">({loan.phone})</span>
                    </div>

                    <p className="text-xs text-slate-200">
                      الكتاب المستعار: <strong className="text-indigo-300">{loan.bookTitle}</strong>
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
                      <span>تاريخ الإعارة: {loan.loanDate}</span>
                      <span>تاريخ الاستحقاق: <strong className="text-amber-400">{loan.dueDate}</strong></span>
                      {loan.notes && <span>• {loan.notes}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-xl text-center min-w-[160px] ${
                      loan.status === "RETURNED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {loan.statusLabel}
                    </span>

                    {loan.status === "ACTIVE" && (
                      <button
                        onClick={() => handleReturnBook(loan.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-1 cursor-pointer active:scale-95"
                        title="إثبات إرجاع الكتاب واستلامه"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>إثبات الإرجاع</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* Modal 1: فهرسة كتاب جديد */}
      {/* ============================================================== */}
      {isAddBookOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">فهرسة كتاب جديد في المكتبة المسجدية</h3>
              </div>
              <button 
                onClick={() => setIsAddBookOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddBook} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">عنوان الكتاب :</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: سبل السلام شرح بلوغ المرام"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">اسم المؤلف والمحقق :</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: الإمام الصنعاني"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">التصنيف العلمي :</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="الحديث الشريف وعلومه">الحديث الشريف وعلومه</option>
                    <option value="الفقه وأصوله">الفقه وأصوله</option>
                    <option value="التفسير وعلوم القرآن">التفسير وعلوم القرآن</option>
                    <option value="الحديث والفقه المالكي">الفقه المالكي</option>
                    <option value="العقيدة والتوحيد">العقيدة والتوحيد</option>
                    <option value="السيرة والتاريخ الإسلامي">السيرة والتاريخ</option>
                    <option value="اللغة العربية والمعاجم">اللغة العربية</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">مكان الحفظ (الخزانة والرف) :</label>
                  <input 
                    type="text" 
                    required
                    placeholder="مثال: الخزانة د - الرف 2"
                    value={newShelf}
                    onChange={(e) => setNewShelf(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">عدد النسخ المتوفرة :</label>
                  <input 
                    type="number" 
                    min="1"
                    max="100"
                    value={newCopies}
                    onChange={(e) => setNewCopies(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">الباركود الدولي (اختياري) :</label>
                  <input 
                    type="text" 
                    placeholder="تلقائي إن ترك فارغاً"
                    value={newBarcode}
                    onChange={(e) => setNewBarcode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow transition cursor-pointer"
                >
                  حفظ في فهرس المكتبة
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddBookOpen(false)}
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
      {/* Modal 2: تسجيل إعارة سريعة */}
      {/* ============================================================== */}
      {isLoanModalOpen && selectedBookForLoan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">تسجيل إعارة كتاب وقفي</h3>
              </div>
              <button 
                onClick={() => setIsLoanModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400">الكتاب المطلوب: <strong className="text-white">{selectedBookForLoan.title}</strong></div>
              <div className="text-slate-400">المؤلف: <span className="text-indigo-300">{selectedBookForLoan.author}</span></div>
              <div className="text-slate-400">الباركود: <span className="font-mono text-emerald-400">{selectedBookForLoan.barcode}</span></div>
            </div>

            <form onSubmit={handleCreateLoan} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">اسم المستعير الكامل (طالب العلم / الباحث) :</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: يحيى عثمان محمد"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">رقم الهاتف للتواصل :</label>
                  <input 
                    type="text" 
                    required
                    placeholder="+227 -- -- -- --"
                    value={borrowerPhone}
                    onChange={(e) => setBorrowerPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">مدة الإعارة :</label>
                  <select 
                    value={loanDurationDays}
                    onChange={(e) => setLoanDurationDays(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="7">أسبوع واحد (7 أيام)</option>
                    <option value="14">أسبوعان (14 يوماً)</option>
                    <option value="21">ثلاثة أسابيع (21 يوماً)</option>
                    <option value="30">شهر كامل (30 يوماً)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">رقم الهوية الوطنية / بطاقة الطالب (اختياري) :</label>
                <input 
                  type="text" 
                  placeholder="مثال: NID-227-XXXX"
                  value={borrowerId}
                  onChange={(e) => setBorrowerId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow transition cursor-pointer"
                >
                  تأكيد الإعارة وتسليم الكتاب
                </button>
                <button
                  type="button"
                  onClick={() => setIsLoanModalOpen(false)}
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
      {/* Modal 3: بطاقة الباركود والفهرسة للطباعة */}
      {/* ============================================================== */}
      {isBarcodeCardOpen && selectedBookForBarcode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setIsBarcodeCardOpen(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto">
                <Barcode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">بطاقة الفهرسة والباركود</h3>
              <p className="text-xs text-slate-400">لصاقة الوقف والرمز الشريطي للكتاب</p>
            </div>

            {/* بطاقة ملصق الكتاب للطباعة */}
            <div id="print-book-label" className="bg-white text-slate-950 p-4 rounded-2xl space-y-3 shadow-inner text-center border-2 border-slate-200">
              <div className="border-b border-dashed border-slate-300 pb-1.5">
                <span className="text-[10px] font-bold text-slate-500 block">وقف لله تعالى - مكتبة المسجد</span>
                <span className="text-xs font-black text-slate-900 block">{selectedBookForBarcode.title}</span>
              </div>

              {/* رمز الباركود الرسومي الفعلي */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex justify-center items-end gap-1 h-16 py-1">
                  {[3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 1].map((h, i) => (
                    <div 
                      key={i} 
                      className="bg-black" 
                      style={{ 
                        width: `${(i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1.5)}px`, 
                        height: `${h * 12 + 10}px` 
                      }} 
                    />
                  ))}
                </div>
                <span className="font-mono text-xs font-black text-slate-800 tracking-wider block mt-1">
                  {selectedBookForBarcode.barcode}
                </span>
              </div>

              <div className="text-[11px] text-slate-600 flex justify-between border-t border-slate-200 pt-1.5">
                <span>المؤلف: {selectedBookForBarcode.author}</span>
                <span className="font-bold text-slate-900">{selectedBookForBarcode.shelf}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة لصاقة الباركود</span>
              </button>

              <button 
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(`${selectedBookForBarcode.title} - باركود: ${selectedBookForBarcode.barcode} - موقع: ${selectedBookForBarcode.shelf}`);
                    alert("تم نسخ بيانات الكتاب والباركود!");
                  }
                }}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
                title="نسخ ومشاركة"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Modal 4: طلب ترميم أو مصاحف جديدة */}
      {/* ============================================================== */}
      {isRestorationModalOpen && selectedQuranForRestoration && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Wrench className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">طلب ترميم المصاحف أو توريد جديد</h3>
              </div>
              <button 
                onClick={() => setIsRestorationModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {requestSuccess ? (
              <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">تم إرسال الطلب واعتماده بنجاح!</h4>
                <p className="text-xs text-slate-300">تم تسجيل إحالة المصاحف إلى ورشة التجليد والصيانة الوقفية.</p>
              </div>
            ) : (
              <form onSubmit={handleSendRestorationRequest} className="space-y-4 text-xs">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-slate-400">النوع: <strong className="text-white">{selectedQuranForRestoration.type}</strong></div>
                  <div className="text-slate-400">الرواية: <span className="text-indigo-300">{selectedQuranForRestoration.riwayah}</span></div>
                  <div className="text-slate-400">المصاحف التي تحتاج ترميماً حالياً: <strong className="text-amber-400 font-mono">{selectedQuranForRestoration.needsRestoration}</strong> مصحف</div>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">العدد المراد إرساله للترميم أو استبداله :</label>
                  <input 
                    type="number" 
                    min="1"
                    max={selectedQuranForRestoration.needsRestoration || 100}
                    value={restorationCount}
                    onChange={(e) => setRestorationCount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">ملاحظات لورشة التجليد والصيانة :</label>
                  <textarea 
                    rows={3}
                    placeholder="مثال: تساقط أوراق السور الأخيرة، تمزق الغلاف الجلدي..."
                    value={restorationNotes}
                    onChange={(e) => setRestorationNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl shadow transition cursor-pointer"
                  >
                    تأكيد إرسال الطلب لورشة التجليد
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRestorationModalOpen(false)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
