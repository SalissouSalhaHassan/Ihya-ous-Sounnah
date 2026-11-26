"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Image as ImageIcon,
  Stamp,
  MapPin,
  FileText,
  Save,
  RotateCcw,
  Upload,
  Trash2,
  CheckCircle2,
  Phone,
  Mail,
  Globe,
  Building2,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { Locale } from "@/lib/i18n";
import {
  IdentitySettings,
  DEFAULT_IDENTITY_SETTINGS,
  loadIdentitySettings,
  saveIdentitySettings,
  resetIdentitySettings,
} from "@/lib/identity-settings";
import {
  PrintLetterhead,
  PrintSignatureFooter,
  PrintOrientationControls,
} from "@/components/PrintLetterhead";

const DICT: Record<
  Locale,
  {
    badge: string;
    title: string;
    subtitle: string;
    saveBtn: string;
    savedToast: string;
    resetBtn: string;
    printTestBtn: string;
    logoSectionTitle: string;
    logoSectionDesc: string;
    letterheadLabel: string;
    watermarkLabel: string;
    showWatermarkLabel: string;
    uploadBtn: string;
    restoreDefaultBtn: string;
    cachetSectionTitle: string;
    cachetSectionDesc: string;
    cachetUploadLabel: string;
    cachetEmpty: string;
    showStampLabel: string;
    removeStampBtn: string;
    coordsSectionTitle: string;
    coordsSectionDesc: string;
    orgNameLabel: string;
    coordNameLabel: string;
    presidentLabel: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    websiteLabel: string;
    mentionsSectionTitle: string;
    mentionsSectionDesc: string;
    orgSubtitleLabel: string;
    legalRegLabel: string;
    footerMentionLabel: string;
    previewTitle: string;
    previewDesc: string;
  }
> = {
  fr: {
    badge: "Identité Visuelle & Configuration Officielle",
    title: "Paramètres & Identité",
    subtitle:
      "Configurez le Logo Officiel, l'Image du Cachet, les Coordonnées et les Mentions légales utilisés sur tous les documents et impressions.",
    saveBtn: "Enregistrer les paramètres",
    savedToast: "Paramètres d'identité enregistrés avec succès !",
    resetBtn: "Réinitialiser par défaut",
    printTestBtn: "Aperçu d'impression",
    logoSectionTitle: "Logo Officiel",
    logoSectionDesc:
      "Bannière d'en-tête et logo en filigrane (arrière-plan) affichés sur chaque page imprimée.",
    letterheadLabel: "Bannière d'En-tête Officielle (Tête de lettre)",
    watermarkLabel: "Logo Officiel (Filigrane de page)",
    showWatermarkLabel: "Afficher le logo en filigrane sur chaque page imprimée",
    uploadBtn: "Importer une image",
    restoreDefaultBtn: "Image par défaut",
    cachetSectionTitle: "Image du Cachet",
    cachetSectionDesc:
      "Cachet officiel et signature de la Coordination Régionale apposés en bas des documents.",
    cachetUploadLabel: "Importer l'image du cachet (PNG transparent recommandé)",
    cachetEmpty: "Aucun cachet personnalisé importé pour le moment.",
    showStampLabel: "Apposer le cachet automatiquement sur les impressions officielles",
    removeStampBtn: "Supprimer le cachet",
    coordsSectionTitle: "Coordonnées",
    coordsSectionDesc:
      "Informations de contact, siège social et direction régionale.",
    orgNameLabel: "Nom de l'organisation",
    coordNameLabel: "Coordination / Section",
    presidentLabel: "Président de la C/R",
    addressLabel: "Siège Social / Adresse",
    phoneLabel: "Téléphones officiels",
    emailLabel: "Adresse e-mail",
    websiteLabel: "Site web",
    mentionsSectionTitle: "Mentions",
    mentionsSectionDesc:
      "Arrêté d'autorisation, dénomination complète et mentions légales de pied de page.",
    orgSubtitleLabel: "Dénomination officielle complète",
    legalRegLabel: "Arrêté / Référence légale",
    footerMentionLabel: "Mention de pied de page (Documents imprimés)",
    previewTitle: "Aperçu en direct de l'Identité Officielle",
    previewDesc: "Rendu visuel de la bannière, des coordonnées et du cachet.",
  },
  ar: {
    badge: "الهوية البصرية والإعدادات الرسمية",
    title: "الإعدادات والهوية (Paramètres & Identité)",
    subtitle:
      "إدارة الشعار الرسمي، صورة الختم، بيانات التواصل، والبيانات القانونية التي تظهر في جميع الوثائق والمطبوعات.",
    saveBtn: "حفظ الإعدادات",
    savedToast: "تم حفظ إعدادات الهوية الرسمية بنجاح!",
    resetBtn: "استعادة الافتراضي",
    printTestBtn: "معاينة الطباعة",
    logoSectionTitle: "الشعار الرسمي (Logo Officiel)",
    logoSectionDesc:
      "الترويسة الرسمية والشعار المائي الذي يظهر في خلفية كل صفحة عند الطباعة.",
    letterheadLabel: "صورة الترويسة الرسمية (أعلى الصفحة)",
    watermarkLabel: "الشعار الرسمي (العلامة المائية لكل صفحة)",
    showWatermarkLabel: "إظهار الشعار كخلفية مائية في كل صفحة مطبوعة",
    uploadBtn: "رفع صورة",
    restoreDefaultBtn: "الصورة الافتراضية",
    cachetSectionTitle: "صورة الختم (Image du Cachet)",
    cachetSectionDesc:
      "الختم الرسمي للتنسيقية الجهوية الذي يظهر في تذييل التوقيعات عند الطباعة.",
    cachetUploadLabel: "رفع صورة الختم الرسمي (يفضل PNG بخلفية شفافة)",
    cachetEmpty: "لم يتم رفع صورة ختم مخصصة بعد.",
    showStampLabel: "إظهار الختم الرسمي تلقائياً في أسفل المطبوعات",
    removeStampBtn: "إزالة الختم",
    coordsSectionTitle: "بيانات التواصل (Coordonnées)",
    coordsSectionDesc: "المقر الرئيسي، أرقام الهواتف، البريد الإلكتروني، والرئيس.",
    orgNameLabel: "اسم المؤسسة / الجمعية",
    coordNameLabel: "التنسيقية / القسم",
    presidentLabel: "رئيس التنسيقية الجهوية",
    addressLabel: "المقر الرئيسي / العنوان",
    phoneLabel: "أرقام الهواتف الرسمية",
    emailLabel: "البريد الإلكتروني",
    websiteLabel: "الموقع الإلكتروني",
    mentionsSectionTitle: "البيانات القانونية والتذييل (Mentions)",
    mentionsSectionDesc: "رقم الاعتماد القانوني، التسمية الكاملة، ونص التذييل الرسمي.",
    orgSubtitleLabel: "التسمية الرسمية الكاملة",
    legalRegLabel: "رقم القرار / الاعتماد القانوني",
    footerMentionLabel: "نص التذييل أسفل الوثائق المطبوعة",
    previewTitle: "معاينة حية للهوية الرسمية",
    previewDesc: "عرض مباشر للترويسة والبيانات والختم كما ستظهر في الوثائق.",
  },
  ha: {
    badge: "Shaidar Gidauniya da Saitunan Aiki",
    title: "Paramètres & Identité",
    subtitle:
      "Saita Tambarin Hukuma, Hoton Hatimi, Adireshi da Bayanan Doka da ke fitowa a kan dukkan takardu.",
    saveBtn: "Ajiye Saituna",
    savedToast: "An adana saitunan shaidar hukuma cikin nasara!",
    resetBtn: "Maido da na Asali",
    printTestBtn: "Gwajin Bugawa",
    logoSectionTitle: "Logo Officiel (Tambarin Hukuma)",
    logoSectionDesc:
      "Tambarin kan shafi da tambarin baya (watermark) da ke fitowa a kowane shafi.",
    letterheadLabel: "Hoton Kan Shafi na Hukuma",
    watermarkLabel: "Tambarin Baya (Watermark)",
    showWatermarkLabel: "Nuna tambarin baya a kowane shafi da aka buga",
    uploadBtn: "Sanya Hoto",
    restoreDefaultBtn: "Na Asali",
    cachetSectionTitle: "Image du Cachet (Hoton Hatimi)",
    cachetSectionDesc:
      "Hatimin hukuma da ke fitowa a ƙasan takardu kusa da sa hannun shugaba.",
    cachetUploadLabel: "Sanya hoton hatimi (PNG mara baya ya fi kyau)",
    cachetEmpty: "Ba a sanya hoton hatimi ba tukuna.",
    showStampLabel: "Sanya hatimi ta atomatik a kan takardun bugawa",
    removeStampBtn: "Cire Hatimi",
    coordsSectionTitle: "Coordonnées (Adireshi da Lambobi)",
    coordsSectionDesc: "Hedikwata, lambobin waya, imel, da sunan shugaba.",
    orgNameLabel: "Sunan Ƙungiya",
    coordNameLabel: "Sashe / Gudanarwa",
    presidentLabel: "Shugaban Gudanarwa (C/R)",
    addressLabel: "Adireshi / Hedikwata",
    phoneLabel: "Lambobin Waya",
    emailLabel: "Imel",
    websiteLabel: "Shafin Yanar Gizo",
    mentionsSectionTitle: "Mentions (Bayanan Doka)",
    mentionsSectionDesc: "Lambar izini (Arrêté) da bayanin ƙasan shafi.",
    orgSubtitleLabel: "Cikakken sunan ƙungiya na hukuma",
    legalRegLabel: "Lambar Izini (Arrêté)",
    footerMentionLabel: "Rubutun ƙasan shafi na takardu",
    previewTitle: "Duban Kai-tsaye na Shaidar Hukuma",
    previewDesc: "Yadda kan shafi, adireshi da hatimi za su fito.",
  },
};

export default function SettingsIdentityPage() {
  const { currentLocale, isRtl } = useLocale();
  const dict = DICT[currentLocale];

  const [form, setForm] = useState<IdentitySettings>(DEFAULT_IDENTITY_SETTINGS);
  const [savedNotice, setSavedNotice] = useState(false);
  const [printOrientation, setPrintOrientation] = useState<
    "portrait" | "landscape"
  >("portrait");

  const handlePrintWithOrientation = (mode: "portrait" | "landscape") => {
    setPrintOrientation(mode);
    setTimeout(() => window.print(), 50);
  };

  useEffect(() => {
    queueMicrotask(() => {
      setForm(loadIdentitySettings());
    });
  }, []);

  const handleImageUpload = (
    field: "letterheadUrl" | "logoUrl" | "stampUrl",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setForm((prev) => ({ ...prev, [field]: reader.result as string }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveIdentitySettings(form);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handleReset = () => {
    const defaults = resetIdentitySettings();
    setForm(defaults);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 print:bg-transparent print:text-slate-900 p-4 sm:p-8 print:p-0 ${
        isRtl ? "rtl font-sans" : "ltr"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl print:max-w-none print:w-full mx-auto space-y-6">
        <PrintLetterhead
          title={dict.title}
          subtitle={form.organizationSubtitle}
          village={form.coordinationName}
          badge={dict.badge}
          locale={currentLocale}
          orientation={printOrientation}
        />

        {/* Header */}
        <div className="print:hidden bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-950/50">
              <Settings className="w-7 h-7 text-slate-950 stroke-[2.3]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {dict.badge}
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
              onClick={handleReset}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{dict.resetBtn}</span>
            </button>
            <PrintOrientationControls
              orientation={printOrientation}
              onPrint={handlePrintWithOrientation}
              locale={currentLocale}
            />
            <button
              type="submit"
              form="identity-settings-form"
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{dict.saveBtn}</span>
            </button>
          </div>
        </div>

        {savedNotice && (
          <div className="print:hidden flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{dict.savedToast}</span>
          </div>
        )}

        <form
          id="identity-settings-form"
          onSubmit={handleSave}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* 1. Logo Officiel */}
          <section className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
            <div className="flex items-start gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white print:text-slate-900">
                  {dict.logoSectionTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {dict.logoSectionDesc}
                </p>
              </div>
            </div>

            {/* Letterhead Banner */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-300 print:text-slate-800">
                  {dict.letterheadLabel}
                </label>
                <div className="flex items-center gap-2 print:hidden">
                  <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{dict.uploadBtn}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload("letterheadUrl", e)}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        letterheadUrl: DEFAULT_IDENTITY_SETTINGS.letterheadUrl,
                      }))
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 text-[11px] font-bold cursor-pointer"
                  >
                    {dict.restoreDefaultBtn}
                  </button>
                </div>
              </div>
              <div className="bg-white rounded-xl p-2 border border-slate-700/60 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.letterheadUrl || "/images/official-letterhead.jpg"}
                  alt="Letterhead Preview"
                  className="w-full h-auto max-h-28 object-contain mx-auto"
                />
              </div>
            </div>

            {/* Watermark Logo */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-300 print:text-slate-800">
                  {dict.watermarkLabel}
                </label>
                <div className="flex items-center gap-2 print:hidden">
                  <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-400 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{dict.uploadBtn}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload("logoUrl", e)}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((p) => ({
                        ...p,
                        logoUrl: DEFAULT_IDENTITY_SETTINGS.logoUrl,
                      }))
                    }
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-400 text-[11px] font-bold cursor-pointer"
                  >
                    {dict.restoreDefaultBtn}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-white border border-slate-700/60 p-2 flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.logoUrl || "/images/official-logo-watermark.jpg"}
                    alt="Logo Officiel"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <label className="flex items-center gap-2.5 text-xs text-slate-300 print:text-slate-800 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.showWatermarkOnPrint}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        showWatermarkOnPrint: e.target.checked,
                      }))
                    }
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span>{dict.showWatermarkLabel}</span>
                </label>
              </div>
            </div>
          </section>

          {/* 2. Image du Cachet */}
          <section className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl flex flex-col justify-between">
            <div className="space-y-5">
              <div className="flex items-start gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Stamp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-white print:text-slate-900">
                    {dict.cachetSectionTitle}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {dict.cachetSectionDesc}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-36 h-36 rounded-2xl bg-white border-2 border-dashed border-slate-400 flex items-center justify-center p-3 shrink-0">
                  {form.stampUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={form.stampUrl}
                      alt="Image du Cachet"
                      className="max-w-full max-h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-slate-400 space-y-1">
                      <Stamp className="w-8 h-8 mx-auto opacity-40" />
                      <span className="text-[10px] block leading-tight">
                        {dict.cachetEmpty}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3 w-full">
                  <p className="text-xs text-slate-300 print:text-slate-700 font-semibold">
                    {dict.cachetUploadLabel}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 print:hidden">
                    <label className="px-4 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2 cursor-pointer">
                      <Upload className="w-4 h-4" />
                      <span>{dict.uploadBtn}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload("stampUrl", e)}
                        className="hidden"
                      />
                    </label>
                    {form.stampUrl && (
                      <button
                        type="button"
                        onClick={() =>
                          setForm((p) => ({ ...p, stampUrl: "" }))
                        }
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-rose-950/60 border border-slate-700 text-rose-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{dict.removeStampBtn}</span>
                      </button>
                    )}
                  </div>

                  <label className="flex items-center gap-2.5 text-xs text-slate-300 print:text-slate-800 cursor-pointer select-none pt-1">
                    <input
                      type="checkbox"
                      checked={form.showStampOnPrint}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          showStampOnPrint: e.target.checked,
                        }))
                      }
                      className="w-4 h-4 accent-emerald-500 rounded"
                    />
                    <span>{dict.showStampLabel}</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Live Mini Preview Box */}
            <div className="bg-slate-950/80 print:bg-slate-50 border border-slate-800 print:border-slate-300 rounded-2xl p-4 space-y-1.5">
              <div className="text-[11px] font-bold text-emerald-400 print:text-emerald-800 uppercase tracking-wider">
                {dict.previewTitle}
              </div>
              <p className="text-[11px] text-slate-400 print:text-slate-600">
                {dict.previewDesc}
              </p>
              <div className="pt-2 text-xs text-slate-200 print:text-slate-900 space-y-1">
                <div className="font-bold">
                  {form.organizationName} — {form.coordinationName}
                </div>
                <div className="text-[11px] text-slate-400 print:text-slate-700">
                  {form.address} • {form.phone}
                </div>
                <div className="text-[11px] text-amber-300 print:text-slate-800 font-mono">
                  {form.legalRegistration}
                </div>
              </div>
            </div>
          </section>

          {/* 3. Coordonnées */}
          <section className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-start gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white print:text-slate-900">
                  {dict.coordsSectionTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {dict.coordsSectionDesc}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{dict.orgNameLabel}</span>
                </label>
                <input
                  type="text"
                  value={form.organizationName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, organizationName: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  {dict.coordNameLabel}
                </label>
                <input
                  type="text"
                  value={form.coordinationName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, coordinationName: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{dict.presidentLabel}</span>
                </label>
                <input
                  type="text"
                  value={form.presidentName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, presidentName: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{dict.addressLabel}</span>
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{dict.phoneLabel}</span>
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{dict.emailLabel}</span>
                </label>
                <input
                  type="email"
                  dir="ltr"
                  value={form.email}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, email: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{dict.websiteLabel}</span>
                </label>
                <input
                  type="url"
                  dir="ltr"
                  value={form.website}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, website: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </section>

          {/* 4. Mentions */}
          <section className="print-clean-card bg-slate-900/75 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-start gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-white print:text-slate-900">
                  {dict.mentionsSectionTitle}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {dict.mentionsSectionDesc}
                </p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  {dict.orgSubtitleLabel}
                </label>
                <input
                  type="text"
                  value={form.organizationSubtitle}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      organizationSubtitle: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  {dict.legalRegLabel}
                </label>
                <input
                  type="text"
                  value={form.legalRegistration}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      legalRegistration: e.target.value,
                    }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">
                  {dict.footerMentionLabel}
                </label>
                <textarea
                  rows={3}
                  value={form.footerMention}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, footerMention: e.target.value }))
                  }
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </section>
        </form>

        <PrintSignatureFooter locale={currentLocale} />
      </div>
    </div>
  );
}
