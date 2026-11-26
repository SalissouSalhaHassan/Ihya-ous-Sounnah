"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Droplet,
  MapPin,
  CheckCircle2,
  Sparkles,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/infrastructure/supabase/client";

interface CharityProject {
  id: string;
  title: string;
  category: string;
  donor_name: string | null;
  budget: string;
  currency: string | null;
  current_stage: string | null;
  latitude: number | null;
  longitude: number | null;
  completion_percentage: number | null;
  report_token: string;
  status: string | null;
}

function DynamicDonorProjectContent() {
  const params = useParams();
  const token = decodeURIComponent((params?.token as string) || "");

  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<CharityProject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function loadProject() {
      if (!token) {
        if (active) {
          setErrorMsg("رمز متابعة المشروع غير مرفق في الرابط.");
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("charity_projects")
          .select(
            "id, title, category, donor_name, budget, currency, current_stage, latitude, longitude, completion_percentage, report_token, status"
          )
          .eq("report_token", token)
          .maybeSingle();

        if (!active) return;

        if (error || !data) {
          setErrorMsg("لم يتم العثور على مشروع خيري مرتبط برمز المتابعة هذا.");
          setProject(null);
        } else {
          setProject(data as CharityProject);
        }
      } catch {
        if (active) {
          setErrorMsg("تعذر الاتصال بقاعدة بيانات المشاريع حالياً.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();
    return () => {
      active = false;
    };
  }, [token]);

  const handleShareWhatsApp = () => {
    const currentUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `تقبل الله طاعتكم! يمكنكم متابعة مراحل إنجاز وتوثيق مشروعكم عبر منصة منارة الوقفية:\n${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4"
        dir="rtl"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-slate-400">جاري تحميل وثيقة المشروع الوقفي...</span>
        </div>
      </div>
    );
  }

  if (!project || errorMsg) {
    return (
      <div
        className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4"
        dir="rtl"
      >
        <div className="max-w-lg w-full bg-slate-900 border-2 border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-9 h-9" />
            </div>
          </div>
          <h1 className="text-xl font-black text-white">المشروع غير موجود</h1>
          <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-[11px] font-mono text-slate-400 break-all">
            {token || "NO_TOKEN"}
          </div>
          <Link
            href="/"
            className="inline-block text-xs font-bold text-cyan-400 hover:text-cyan-300 transition"
          >
            ← العودة لبوابة المنظومة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const pct = Math.min(100, Math.max(0, project.completion_percentage ?? 0));

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-white rtl font-sans"
      dir="rtl"
    >
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
              onClick={handleShareWhatsApp}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <MessageCircle className="w-4 h-4" />
              <span>مشاركة عبر WhatsApp</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full space-y-8">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-cyan-950/40 border border-cyan-900/40 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold rounded-full">
                <Sparkles className="w-3.5 h-3.5" /> Token: {project.report_token}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">{project.title}</h1>
              {project.latitude != null && project.longitude != null && (
                <p className="text-sm text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-cyan-400" /> {project.latitude}, {project.longitude}
                </p>
              )}
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 text-center min-w-[180px]">
              <span className="text-xs text-slate-400 block mb-1">المتبرع الكريم</span>
              <span className="font-bold text-white text-sm block">
                {project.donor_name || "فاعل خير"}
              </span>
              <span className="text-[11px] text-cyan-400 font-bold block mt-1">
                {project.budget} {project.currency || "XOF"}
              </span>
            </div>
          </div>

          <div className="pt-6 space-y-3">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-300">
                المرحلة الحالية: {project.current_stage || project.status || "IN_PROGRESS"}
              </span>
              <span className="text-cyan-400 text-sm">{pct}%</span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-1000 shadow-lg shadow-cyan-500/40"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <span>التصنيف: {project.category}</span>
          </div>
          <Link href="/" className="text-xs font-bold text-cyan-400 hover:text-cyan-300 transition">
            ← العودة للرئيسية
          </Link>
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        منظومة منارة للشفافية وتوثيق الأوقاف والمشاريع الخيرية © 2026
      </footer>
    </div>
  );
}

export default function DynamicDonorProjectPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-400">جاري تحميل وثيقة المشروع الوقفي...</span>
          </div>
        </div>
      }
    >
      <DynamicDonorProjectContent />
    </Suspense>
  );
}
