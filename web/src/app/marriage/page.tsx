"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  ShieldCheck,
  QrCode,
  User,
  Coins,
  Calendar,
  Sparkles,
  Building2,
  Phone,
  RefreshCw,
  Plus,
  FileCheck2,
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { MARRIAGE_DICT } from "@/lib/module-i18n";
import { useIdentitySettings } from "@/lib/identity-settings";
import {
  PrintLetterhead,
  PrintOrientationControls,
} from "@/components/PrintLetterhead";

interface MarriageContractRecord {
  id: string;
  contract_number: string;
  verification_token: string;
  groom_full_name: string;
  groom_national_id?: string | null;
  groom_birth_date?: string | null;
  groom_phone?: string | null;
  bride_full_name: string;
  bride_national_id?: string | null;
  bride_birth_date?: string | null;
  guardian_name: string;
  guardian_relation?: string | null;
  witness1_name: string;
  witness2_name: string;
  dowry_amount: number | string;
  dowry_status?: string | null;
  dowry_notes?: string | null;
  contract_date: string;
  status?: string | null;
  mosques?: { name: string; city?: string | null } | null;
  mosque_staff?: { full_name: string; role?: string | null } | null;
}

export default function MarriageModule() {
  const { currentLocale, t, isRtl } = useLocale();
  const dict = MARRIAGE_DICT[currentLocale];
  const identity = useIdentitySettings();

  const [contracts, setContracts] = useState<MarriageContractRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [printOrientation, setPrintOrientation] = useState<
    "portrait" | "landscape"
  >("portrait");

  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/marriage");
      if (res.ok) {
        const data = await res.json();
        const list: MarriageContractRecord[] = Array.isArray(data?.contracts)
          ? data.contracts
          : [];
        setContracts(list);
        if (list.length > 0) {
          const params = new URLSearchParams(window.location.search);
          const requestedId = params.get("id");
          const match = requestedId
            ? list.find((c) => c.id === requestedId)
            : null;
          setSelectedId((prev) =>
            match
              ? match.id
              : prev && list.some((c) => c.id === prev)
                ? prev
                : list[0].id
          );
        }
      }
    } catch {
      // ignore network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      void fetchContracts();
    }, 0);
    return () => clearTimeout(id);
  }, [fetchContracts]);

  const handlePrintWithOrientation = (mode: "portrait" | "landscape") => {
    setPrintOrientation(mode);
    setTimeout(() => window.print(), 50);
  };

  const activeContract =
    contracts.find((c) => c.id === selectedId) || contracts[0] || null;

  const verifyPath = activeContract
    ? `/verify/nikah/${activeContract.verification_token}`
    : "/verify/nikah/demo";
  const verifyFullUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${verifyPath}`
      : verifyPath;

  const dowryStatusText = (status?: string | null) => {
    if (status === "DEFERRED") return t.marriageModule.deferredLabel;
    if (status === "PARTIAL") return "PARTIAL";
    return t.marriageModule.paidLabel;
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 print:bg-transparent print:text-slate-900 p-4 sm:p-8 print:p-0 selection:bg-emerald-500 selection:text-white ${isRtl ? "rtl font-sans" : "ltr"
        }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-5xl print:max-w-none print:w-full mx-auto space-y-6 print:space-y-2">
        <PrintLetterhead
          title={dict.title}
          subtitle={
            activeContract
              ? `${activeContract.contract_number} — ${activeContract.groom_full_name} & ${activeContract.bride_full_name}`
              : dict.subtitle
          }
          village={
            activeContract?.mosques
              ? `${activeContract.mosques.name}${activeContract.mosques.city
                ? ` (${activeContract.mosques.city})`
                : ""
              }`
              : identity.coordinationName
          }
          badge={dict.badge}
          locale={currentLocale}
          orientation={printOrientation}
          compact
        />

        {/* Screen-Only Header Bar */}
        <div className="print:hidden flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-900/30 shrink-0">
              <HeartHandshake className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex flex-wrap items-center gap-2">
                {dict.title}
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {dict.badge}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">{dict.subtitle}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/?tab=marriage"
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t.marriageModule.registerMosqueNikah}</span>
            </Link>
            <button
              type="button"
              onClick={() => void fetchContracts()}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              title="Refresh"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <PrintOrientationControls
              orientation={printOrientation}
              onPrint={handlePrintWithOrientation}
              locale={currentLocale}
            />
          </div>
        </div>

        {/* Contract Selector Bar (Screen Only) */}
        {contracts.length > 0 && (
          <div className="print:hidden bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {currentLocale === "ar"
                  ? "اختر عقد الزواج المسجل لعرض وطباعة شهادته الرسمية:"
                  : currentLocale === "ha"
                    ? "Zaɓi rajistar aure don buga takardar shaida:"
                    : "Sélectionner un contrat enregistré pour générer le certificat :"}
              </span>
            </div>
            <select
              value={activeContract?.id || ""}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-semibold sm:min-w-[320px]"
            >
              {contracts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.contract_number} — {c.groom_full_name} &amp;{" "}
                  {c.bride_full_name} ({c.contract_date})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Empty / Loading State */}
        {!loading && !activeContract ? (
          <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <HeartHandshake className="w-12 h-12 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">
              {t.marriageModule.emptyText}
            </p>
            <Link
              href="/?tab=marriage"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t.marriageModule.registerFirstBtn}</span>
            </Link>
          </div>
        ) : (
          activeContract && (
            /* Certificate Card Preview (Print-Clean & Compact 1-Page Official) */
            <div className="print-clean-card break-inside-avoid relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 print:bg-none print:bg-transparent border-2 border-emerald-500/40 print:border-2 print:border-emerald-700 rounded-3xl print:rounded-xl p-8 sm:p-10 print:p-4 shadow-2xl shadow-emerald-950/50 print:shadow-none">
              {/* Decorative Corner Ornaments (screen only) */}
              <div className="print:hidden absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
              <div className="print:hidden absolute bottom-0 left-0 w-32 h-32 bg-rose-500/5 rounded-tr-full pointer-events-none" />

              {/* Certificate Header */}
              <div className="text-center space-y-2 print:space-y-1 border-b border-slate-800 print:border-emerald-700/40 pb-6 print:pb-2.5">
                <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 print:py-0.5 rounded-full bg-emerald-500/10 print:bg-emerald-50 border border-emerald-500/20 print:border-emerald-700/40 text-emerald-400 print:text-emerald-800 text-xs print:text-[10.5px] font-semibold mb-1 print:mb-0">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    بسم الله الرحمن الرحيم — وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم
                    مِّنْ أَنفُسِكُمْ أَزْوَاجًا
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl print:text-lg font-black text-white print:text-slate-900 tracking-wide">
                  وثيقة عقد زواج شرعي إسلامي معتمد
                </h2>
                <p className="text-sm print:text-[11px] text-slate-400 print:text-slate-700 font-medium">
                  Certificat Officiel de Mariage Islamique (Nikah) — Takardar
                  Shaidar Daurin Aure
                </p>

                <div className="flex flex-wrap justify-center items-center gap-5 print:gap-4 text-xs print:text-[11px] text-slate-400 print:text-slate-800 pt-2 print:pt-1">
                  <span className="flex items-center gap-1.5 font-mono text-emerald-400 print:text-emerald-800 font-bold">
                    <ShieldCheck className="w-4 h-4" />{" "}
                    {activeContract.contract_number}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-500 print:text-slate-600" />{" "}
                    {activeContract.contract_date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-500 print:text-slate-600" />{" "}
                    {activeContract.mosques?.name || "جامع النور الكبير"}
                    {activeContract.mosques?.city
                      ? ` (${activeContract.mosques.city})`
                      : ""}
                  </span>
                </div>
              </div>

              {/* Parties Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-6 print:gap-2.5 py-6 print:py-2.5 border-b border-slate-800 print:border-slate-300">
                {/* الزوج */}
                <div className="bg-slate-950/60 print:bg-transparent p-5 print:p-2.5 rounded-2xl print:rounded-lg border border-slate-800/80 print:border-slate-300 space-y-2.5 print:space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs print:text-[11px] font-bold text-emerald-400 print:text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-4 h-4 print:w-3.5 print:h-3.5" /> بيانات الزوج (Époux / Miji)
                    </span>
                    {activeContract.groom_national_id && (
                      <span className="text-[10px] bg-slate-800 print:bg-slate-100 px-2 py-0.5 rounded text-slate-300 print:text-slate-800 font-mono border print:border-slate-300">
                        NNI: {activeContract.groom_national_id}
                      </span>
                    )}
                  </div>
                  <div className="text-lg print:text-sm font-bold text-white print:text-slate-900">
                    {activeContract.groom_full_name}
                  </div>
                  <div className="text-xs print:text-[11px] text-slate-400 print:text-slate-700 space-y-0.5">
                    {activeContract.groom_birth_date && (
                      <div>
                        تاريخ الميلاد / Né(e) le:{" "}
                        <strong className="text-slate-200 print:text-slate-900">
                          {activeContract.groom_birth_date}
                        </strong>
                      </div>
                    )}
                    {activeContract.groom_phone && (
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3 h-3 text-emerald-400 print:text-emerald-700" />
                        <span dir="ltr" className="font-mono">
                          {activeContract.groom_phone}
                        </span>
                      </div>
                    )}
                    <p>
                      الحالة: راشد، كامل الأهلية الشرعية، قبل الزواج برضاه التام.
                    </p>
                  </div>
                </div>

                {/* الزوجة */}
                <div className="bg-slate-950/60 print:bg-transparent p-5 print:p-2.5 rounded-2xl print:rounded-lg border border-slate-800/80 print:border-slate-300 space-y-2.5 print:space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs print:text-[11px] font-bold text-rose-400 print:text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-4 h-4 print:w-3.5 print:h-3.5" /> بيانات الزوجة (Épouse / Mata)
                    </span>
                    {activeContract.bride_national_id && (
                      <span className="text-[10px] bg-slate-800 print:bg-slate-100 px-2 py-0.5 rounded text-slate-300 print:text-slate-800 font-mono border print:border-slate-300">
                        NNI: {activeContract.bride_national_id}
                      </span>
                    )}
                  </div>
                  <div className="text-lg print:text-sm font-bold text-white print:text-slate-900">
                    {activeContract.bride_full_name}
                  </div>
                  <div className="text-xs print:text-[11px] text-slate-400 print:text-slate-700 space-y-0.5">
                    {activeContract.bride_birth_date && (
                      <div>
                        تاريخ الميلاد / Né(e) le:{" "}
                        <strong className="text-slate-200 print:text-slate-900">
                          {activeContract.bride_birth_date}
                        </strong>
                      </div>
                    )}
                    <p>
                      الولي الشرعي:{" "}
                      <strong className="text-slate-200 print:text-slate-900">
                        {activeContract.guardian_name}
                      </strong>
                      {activeContract.guardian_relation
                        ? ` (${activeContract.guardian_relation})`
                        : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Dowry & Witnesses Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-4 print:gap-2.5 py-6 print:py-2.5 border-b border-slate-800 print:border-slate-300">
                {/* المهر والصداق */}
                <div className="bg-slate-950/40 print:bg-transparent p-4 print:p-2.5 rounded-xl border border-slate-800 print:border-slate-300">
                  <span className="text-xs print:text-[11px] text-slate-400 print:text-slate-700 flex items-center gap-1.5 mb-0.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400 print:text-amber-700" />{" "}
                    الصداق والمهر الشرعي (Mahr)
                  </span>
                  <div className="text-xl print:text-sm font-black text-amber-400 print:text-slate-900">
                    {Number(
                      activeContract.dowry_amount || 150000
                    ).toLocaleString()}{" "}
                    FCFA
                  </div>
                  <span className="text-[11px] print:text-[10px] text-emerald-400 print:text-emerald-800 font-bold block mt-0.5">
                    {dowryStatusText(activeContract.dowry_status)}
                  </span>
                  {activeContract.dowry_notes && (
                    <span className="text-[10px] text-slate-400 print:text-slate-600 block mt-0.5">
                      {activeContract.dowry_notes}
                    </span>
                  )}
                </div>

                {/* الشاهد الأول */}
                <div className="bg-slate-950/40 print:bg-transparent p-4 print:p-2.5 rounded-xl border border-slate-800 print:border-slate-300">
                  <span className="text-xs print:text-[11px] text-slate-400 print:text-slate-700 block mb-0.5">
                    الشاهد الأول المعتمد (Témoin 1)
                  </span>
                  <div className="text-sm print:text-xs font-bold text-white print:text-slate-900">
                    {activeContract.witness1_name}
                  </div>
                  <span className="text-[10px] text-slate-500 print:text-slate-600 block mt-0.5">
                    حاضر وشهد على الإيجاب والقبول
                  </span>
                </div>

                {/* الشاهد الثاني */}
                <div className="bg-slate-950/40 print:bg-transparent p-4 print:p-2.5 rounded-xl border border-slate-800 print:border-slate-300">
                  <span className="text-xs print:text-[11px] text-slate-400 print:text-slate-700 block mb-0.5">
                    الشاهد الثاني المعتمد (Témoin 2)
                  </span>
                  <div className="text-sm print:text-xs font-bold text-white print:text-slate-900">
                    {activeContract.witness2_name}
                  </div>
                  <span className="text-[10px] text-slate-500 print:text-slate-600 block mt-0.5">
                    حاضر وشهد على الإيجاب والقبول
                  </span>
                </div>
              </div>

              {/* Certificate Footer & QR Verification */}
              <div className="pt-6 print:pt-2.5 flex flex-col md:flex-row print:flex-row items-center justify-between gap-6 print:gap-3">
                <div className="flex items-center gap-4 print:gap-3">
                  <a
                    href={verifyPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-24 h-24 print:w-16 print:h-16 bg-white p-1.5 print:p-1 rounded-2xl print:rounded-lg shadow-xl border border-slate-300 flex items-center justify-center hover:scale-105 transition cursor-pointer shrink-0"
                    title="اضغط للتحقق الفوري من الوثيقة"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(
                        verifyFullUrl
                      )}`}
                      alt={activeContract.verification_token}
                      className="w-full h-full object-contain"
                    />
                  </a>
                  <div className="space-y-1 print:space-y-0.5 text-xs print:text-[10.5px]">
                    <span className="font-bold text-white print:text-slate-900 flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-emerald-400 print:text-emerald-700" />
                      رمز التحقق الرقمي لمنع التزوير
                    </span>
                    <p className="text-slate-400 print:text-slate-700 text-[11px] print:text-[10px] max-w-xs">
                      مسح هذا الرمز بأي هاتف يفتح صفحة التحقق الرسمية للمنظومة
                      الوقفية لتأكيد صحة الوثيقة.
                    </p>
                    <a
                      href={verifyPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono text-emerald-400 print:text-emerald-800 hover:underline block"
                    >
                      Token: {activeContract.verification_token}
                    </a>
                  </div>
                </div>

                {/* Official Stamp & Imam Signature */}
                <div className="flex items-center gap-6 print:gap-4 text-center text-xs shrink-0">
                  <div className="space-y-1">
                    <span className="text-slate-400 print:text-slate-700 text-[11px] block">
                      الإمام المأذون المنعقد على يديه
                    </span>
                    <span className="font-bold text-white print:text-slate-900 block text-sm print:text-xs">
                      {activeContract.mosque_staff?.full_name ||
                        "الإمام المأذون بالمسجد"}
                    </span>
                    <span className="text-[11px] print:text-[10px] font-serif italic text-emerald-400 print:text-emerald-800 block">
                      &ldquo;تم العقد والإشهاد شرعاً&rdquo;
                    </span>
                  </div>

                  {identity.showStampOnPrint && identity.stampUrl ? (
                    <div className="w-24 h-24 print:w-16 print:h-16 flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={identity.stampUrl}
                        alt="Cachet Officiel"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-20 h-20 print:w-16 print:h-16 rounded-full border-2 border-dashed border-rose-500/40 print:border-emerald-700/60 flex items-center justify-center text-[10px] text-rose-400 print:text-emerald-800 font-bold rotate-12">
                      ختم المسجد
                      <br />
                      المعتمد
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        )}

        {(identity.footerMention || identity.legalRegistration) && (
          <div className="hidden print:flex items-center justify-between text-[9.5px] text-slate-500 pt-1.5 border-t border-slate-300">
            <span>{identity.footerMention}</span>
            <span>
              {[identity.legalRegistration, identity.phone]
                .filter(Boolean)
                .join(" • ")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
