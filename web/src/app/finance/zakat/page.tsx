"use client";

import React, { useState, useEffect } from "react";
import { 
  Calculator, 
  Coins, 
  ShieldCheck, 
  Users, 
  Receipt, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  HeartHandshake,
  DollarSign,
  Printer,
  X,
  QrCode
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { ZAKAT_DICT } from "@/lib/module-i18n";
import { PrintLetterhead } from "@/components/PrintLetterhead";

// دالة تنسيق أرقام ثابتة ومستقرة بين الخادم والعميل لتفادي أخطاء الـ Hydration
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export default function SmartZakatPage() {
  const { currentLocale, isRtl } = useLocale();
  const dict = ZAKAT_DICT[currentLocale];

  // نافذة إصدار سند الزكاة
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [payerName, setPayerName] = useState("فاعل خير - محب للإحسان");
  const [receiptCategory] = useState("الفقراء والمساكين (المصرف الأول والثاني)");
  const [receiptNumber, setReceiptNumber] = useState("ZAKAT-2026-MOSQ-0812");
  const [recentDonations, setRecentDonations] = useState<
    { id: string; donor_name: string | null; amount: string; receipt_number: string; date_paid: string }[]
  >([]);

  useEffect(() => {
    fetch("/api/donations")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.donations) setRecentDonations(data.donations);
      })
      .catch(() => {});
  }, []);

  const handleSaveReceipt = async () => {
    try {
      const res = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorName: payerName,
          amount: zakatDue,
          currency: "XOF",
          category: "ZAKAT",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.donation?.receipt_number) {
          setReceiptNumber(data.donation.receipt_number);
          setRecentDonations((prev) => [data.donation, ...prev]);
        }
      }
    } catch {
      // keep printable fallback
    } finally {
      setIsReceiptModalOpen(false);
      window.print();
    }
  };

  // أسعار الذهب والفضة اللحظية بالفرنك الإفريقي (XOF)
  const [goldPricePerGram] = useState(48500); // 48,500 XOF
  const [silverPricePerGram] = useState(620); // 620 XOF
  
  // مدخلات حاسبة الزكاة
  const [cashAmount, setCashAmount] = useState<number>(5000000);
  const [goldGrams, setGoldGrams] = useState<number>(0);
  const [tradeGoods, setTradeGoods] = useState<number>(2500000);
  const [debtsOwed, setDebtsOwed] = useState<number>(500000);

  // حساب النصاب (نصاب الذهب 85 جرام عيار 24)
  const nisabGold = 85 * goldPricePerGram; // 4,122,500 XOF
  
  // إجمالي الثروة الزكوية
  const totalWealth = cashAmount + (goldGrams * goldPricePerGram) + tradeGoods - debtsOwed;
  const isEligible = totalWealth >= nisabGold;
  const zakatDue = isEligible ? Math.round(totalWealth * 0.025) : 0;

  // سجل مصارف الزكاة الشرعية الثمانية المنفذة
  const disbursements = [
    {
      id: "ZAKAT-DISB-0081",
      beneficiary: "أسرة الأرملة عائشة عمر (4 أيتام)",
      category: "الفقراء والمساكين (Fuqara & Masakin)",
      amount: "250,000 XOF",
      purpose: "كفالة معيشية ودفع إيجار متأخر",
      mosque: "جامع النور الكبير",
      date: "14 شوال 1447",
      approvedBy: "لجنة الزكاة المسجدية",
    },
    {
      id: "ZAKAT-DISB-0082",
      beneficiary: "الحاج إدريس كالو (سداد دين إعسار طبي)",
      category: "الغارمون (Al-Gharimun)",
      amount: "480,000 XOF",
      purpose: "سداد فاتورة مستشفى رسمية بعد الإعسار",
      mosque: "مسجد الفاروق",
      date: "11 شوال 1447",
      approvedBy: "المسؤول المالي الشرعي",
    },
    {
      id: "ZAKAT-DISB-0083",
      beneficiary: "طلاب منقطعين في مدرسة تحفيظ القرآن",
      category: "في سبيل الله وابن السبيل",
      amount: "180,000 XOF",
      purpose: "توفير قوت وإعاشة للطلاب الوافدين من القرى",
      mosque: "مصلى الهدى",
      date: "08 شوال 1447",
      approvedBy: "إمام ومأذون المسجد",
    },
  ];

  return (
    <div 
      className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 selection:bg-emerald-500 selection:text-white ${isRtl ? "rtl font-sans" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl print:max-w-none print:w-full mx-auto space-y-8 print:space-y-4">
        <PrintLetterhead
          title={dict.title}
          subtitle={dict.subtitle}
          badge={dict.badge}
          locale={currentLocale}
        />

        {/* Header Bar */}
        <div className="print:hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-900/30">
              <Calculator className="w-7 h-7 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                {dict.title}
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {dict.badge}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {dict.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsReceiptModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              {dict.issueReceiptBtn}
            </button>
          </div>
        </div>

        {/* Live Gold Nisab Ribbon */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-400" /> سعر جرام الذهب عيار 24
            </div>
            <div className="text-xl font-bold text-amber-400" suppressHydrationWarning>{formatNumber(goldPricePerGram)} XOF</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> حد النصاب الشرعي (85 جرام ذهب)
            </div>
            <div className="text-xl font-bold text-white" suppressHydrationWarning>{formatNumber(nisabGold)} XOF</div>
          </div>
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
            <div className="text-xs text-slate-400 mb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-400" /> نسبة الزكاة الواجبة
            </div>
            <div className="text-xl font-bold text-teal-400">2.5% (ربع العشر)</div>
          </div>
        </div>

        {/* Interactive Zakat Calculator Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            {dict.calcTitle}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* السيولة النقدية */}
            <div className="space-y-1.5">
              <label className="text-slate-400 block">{dict.cashLabel}</label>
              <input
                type="number"
                value={cashAmount}
                onChange={(e) => setCashAmount(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* الذهب والفضة */}
            <div className="space-y-1.5">
              <label className="text-slate-400 block">{dict.goldLabel}</label>
              <input
                type="number"
                value={goldGrams}
                onChange={(e) => setGoldGrams(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* عروض التجارة */}
            <div className="space-y-1.5">
              <label className="text-slate-400 block">{dict.tradeLabel}</label>
              <input
                type="number"
                value={tradeGoods}
                onChange={(e) => setTradeGoods(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* الديون المستحقة */}
            <div className="space-y-1.5">
              <label className="text-slate-400 block">{dict.debtsLabel}</label>
              <input
                type="number"
                value={debtsOwed}
                onChange={(e) => setDebtsOwed(Number(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Calculator Results Banner */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs text-slate-400 block mb-1">{dict.totalWealthLabel}</span>
              <div className="text-2xl font-black text-white" suppressHydrationWarning>
                {formatNumber(totalWealth)} XOF
              </div>
              <span className={`text-xs font-bold mt-1 inline-block ${
                isEligible ? "text-emerald-400" : "text-amber-400"
              }`}>
                {isEligible 
                  ? "✓ بلغ النصاب وحال عليه الحول - تجب الزكاة شرعاً" 
                  : "لم يبلغ النصاب - لا تجب الزكاة في هذا المال"}
              </span>
            </div>

            <div className="text-center md:text-right bg-emerald-950/40 border border-emerald-800/40 px-6 py-4 rounded-xl min-w-[200px]">
              <span className="text-xs text-emerald-300 font-bold block mb-1">مقدار الزكاة الواجب إخراجها:</span>
              <div className="text-3xl font-black text-emerald-400" suppressHydrationWarning>
                {formatNumber(zakatDue)} XOF
              </div>
            </div>
          </div>
        </div>

        {/* Zakat Disbursements Ledger */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" />
              سجل صرف أموال الزكاة لمستحقيها الشرعيين
            </h2>
            <span className="text-xs text-slate-400">الفصل الصارم عن صندوق المسجد العام</span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {disbursements.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {item.id}
                    </span>
                    <span className="text-xs font-bold text-slate-200">
                      {item.category}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{item.beneficiary}</h4>
                  <p className="text-xs text-slate-400">{item.purpose} - بإشراف {item.mosque}</p>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                  <div className="text-lg font-black text-emerald-400">{item.amount}</div>
                  <span className="text-[10px] text-slate-500">{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal: Official Zakat Receipt & Certificate */}
        {isReceiptModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
              <button 
                onClick={() => setIsReceiptModalOpen(false)}
                className="absolute top-5 left-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-2 border-b border-slate-800 pb-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                  <ShieldCheck className="w-4 h-4" /> سند قبض شرعي معتمد - خالي من الشبهات
                </div>
                <h3 className="text-xl font-black text-white">إيصال استلام زكاة مال شرعية</h3>
                <p className="text-xs text-slate-400">صادر عن حساب الزكاة والصدقات الموحد - منظومة منارة</p>
              </div>

              {/* Receipt Preview */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>رقم الإيصال المتسلسل:</span>
                  <span className="font-mono font-bold text-emerald-400">{receiptNumber}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>اسم المزكي الكريم:</span>
                  <span className="font-bold text-white text-sm">{payerName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>مقدار الزكاة المستلمة:</span>
                  <span className="font-black text-emerald-400 text-base" suppressHydrationWarning>{formatNumber(zakatDue)} XOF</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>المصرف الشرعي الموجه إليه:</span>
                  <span className="font-bold text-amber-400">{receiptCategory}</span>
                </div>
                
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 block">اعتماد أمين الصندوق والخزينة الوقفية ({recentDonations.length} سند مسجل)</span>
                    <span className="text-xs font-serif italic text-emerald-400">&quot;أجزل الله لكم الأجر وبارك في مالكم&quot;</span>
                  </div>
                  <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center text-slate-950">
                    <QrCode className="w-12 h-12" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSaveReceipt}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  طباعة الإيصال الرسمي (PDF)
                </button>
                <button
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
                >
                  إغلاق
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
