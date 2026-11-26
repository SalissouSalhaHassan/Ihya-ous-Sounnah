"use client";

import React, { useState } from "react";
import { 
  Droplet, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  Calendar, 
  Share2, 
  Camera, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Coins
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { PROJECT_DICT } from "@/lib/module-i18n";

export default function DonorPortalPage() {
  const { currentLocale, isRtl } = useLocale();
  const dict = PROJECT_DICT[currentLocale];

  // بيانات المشروع الخيري التوثيقي
  const project = {
    title: "مشروع حفر بئر ارتوازي رقم 42 (Puits Artésien Al-Nour)",
    donorName: "فاعل خير - بالنيابة عن الوالدين رحمهما الله",
    location: "قرية كاولاد - إقليم طاوا (Tahoua - Niger)",
    budget: "4,500,000 XOF",
    completionPercentage: 85,
    status: "مرحلة التركيب النهائي والتشغيل",
    stages: [
      { name: "الدراسة الهيدرولوجية وتحديد النقطة", date: "10 رجب 1447", done: true },
      { name: "أعمال الحفر العميق وتنزيل الأنابيب", date: "24 رجب 1447", done: true },
      { name: "تركيب مضخة الطاقة الشمسية والخزان", date: "05 شعبان 1447", done: true },
      { name: "بناء الحوض وتثبيت اللوحة الرخامية والتدشين", date: "جاري التنفيذ", done: false },
    ],
    photos: [
      { title: "بداية الحفر وتدفق الماء العذب", stage: "المرحلة 2", url: "/photos/well_drill.jpg" },
      { title: "تركيب الألواح الشمسية والخزان المرتفع", stage: "المرحلة 3", url: "/photos/solar_tank.jpg" },
      { title: "فرحة أهالي القرية وسقيا الماشية", stage: "المرحلة 3", url: "/photos/community_joy.jpg" },
    ],
  };

  return (
    <div 
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white ${isRtl ? "rtl font-sans" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Top Header */}
      <header className="border-b border-cyan-900/30 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-18 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 flex items-center justify-center shadow-lg shadow-cyan-900/20">
              <Droplet className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-black text-lg text-white">منصة منارة الشفافة</span>
              <span className="text-[10px] block text-cyan-400">بوابة متابعة أثر التبرعات المباشرة</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: project.title, url: window.location.href });
                }
              }}
              className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{dict.shareBtn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full space-y-8">
        
        {/* Project Hero Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-900/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> {dict.gpsBadge}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{project.title}</h1>
              <p className="text-sm text-slate-300 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-cyan-400" /> {project.location}
              </p>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center min-w-[160px]">
              <span className="text-xs text-slate-400 block mb-1">{dict.donorLabel}</span>
              <span className="font-bold text-white text-sm block">{project.donorName}</span>
              <span className="text-[11px] text-cyan-400 font-bold block mt-1">{dict.donorBlessing}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="pt-6 space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">{dict.progressLabel}</span>
              <span className="text-cyan-400 text-sm">{project.completionPercentage}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-1000 shadow-lg shadow-cyan-500/40"
                style={{ width: `${project.completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Milestone Stages Timeline */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            {dict.stagesTitle}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.stages.map((stage, idx) => (
              <div 
                key={idx}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                  stage.done 
                    ? "bg-cyan-950/20 border-cyan-800/40 text-slate-200" 
                    : "bg-slate-950/40 border-slate-800/80 text-slate-400"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-white">
                      {idx + 1}
                    </span>
                    {stage.done ? (
                      <span className="text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-800">
                        {dict.doneBadge}
                      </span>
                    ) : (
                      <span className="text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-800">
                        {dict.pendingBadge}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white mb-2">{stage.name}</h4>
                </div>
                <span className="text-[11px] text-slate-500 mt-3 block">{stage.date}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Media Gallery (Before, During, and After) */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" />
              {dict.galleryTitle}
            </h3>
            <span className="text-xs text-slate-400">{dict.gallerySub}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {project.photos.map((item, idx) => (
              <div 
                key={idx} 
                className="group relative bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-cyan-500/50 transition-all"
              >
                <div className="h-48 bg-gradient-to-tr from-slate-900 to-cyan-950/60 flex items-center justify-center text-slate-600 relative">
                  <Droplet className="w-12 h-12 text-cyan-500/20 group-hover:scale-110 transition duration-300" />
                  <span className="absolute top-3 right-3 text-[10px] font-bold bg-slate-900/80 px-2.5 py-1 rounded-lg text-cyan-400 border border-cyan-800/40">
                    {item.stage}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-white text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{dict.photoVerified}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        {dict.footer}
      </footer>
    </div>
  );
}
