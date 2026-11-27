"use client";

import React from "react";
import Link from "next/link";
import { WifiOff, RefreshCw, Home } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

export default function OfflinePage() {
  const { currentLocale, isRtl } = useLocale();

  const text = {
    ar: {
      title: "أنت تعمل الآن دون اتصال بالإنترنت",
      desc: "هذه الصفحة غير محفوظة في الذاكرة المحلية بعد. يمكنك العودة للرئيسية أو إعادة المحاولة فور توفر الشبكة.",
      retry: "إعادة المحاولة",
      home: "العودة للرئيسية",
    },
    fr: {
      title: "Vous êtes actuellement hors-ligne",
      desc: "Cette page n'est pas encore en cache local. Revenez à l'accueil ou réessayez dès que la connexion revient.",
      retry: "Réessayer",
      home: "Retour à l'accueil",
    },
    ha: {
      title: "Kuna aiki ba tare da intanet ba yanzu",
      desc: "Ba a ajiye wannan shafin a waya ba tukuna. Koma gida ko sake gwadawa idan net ya dawo.",
      retry: "Sake gwadawa",
      home: "Koma Gida",
    },
  }[currentLocale];

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
          <WifiOff className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black text-white">{text.title}</h1>
        <p className="text-xs text-slate-400 leading-relaxed">{text.desc}</p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{text.retry}</span>
          </button>
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>{text.home}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
