"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  CheckCircle2,
  Award,
  Lock,
  Building2,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/infrastructure/supabase/client";

interface VerifiedQuranRecord {
  id: string;
  student_full_name: string;
  surah_name: string;
  ayah_from: number | null;
  ayah_to: number | null;
  score: string | null;
  record_date: string;
  quran_circles?: {
    name: string;
    mosques?: { name: string } | null;
    mosque_staff?: { full_name: string } | null;
  } | null;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function VerifyQuranCertificateContent() {
  const params = useParams();
  const token = decodeURIComponent((params?.token as string) || "");

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<VerifiedQuranRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function verify() {
      if (!token) {
        if (active) {
          setErrorMsg("لم يتم تمرير رقم شهادة أو سجل صالح.");
          setLoading(false);
        }
        return;
      }

      try {
        let query = supabase
          .from("quran_progress")
          .select(
            "id, student_full_name, surah_name, ayah_from, ayah_to, score, record_date, quran_circles(name, mosques(name), mosque_staff(full_name))"
          );

        if (UUID_REGEX.test(token)) {
          query = query.eq("id", token);
        } else {
          query = query.eq("idempotency_key", token);
        }

        const { data, error } = await query.maybeSingle();

        if (!active) return;

        if (error || !data) {
          setErrorMsg("لم يتم العثور على شهادة أو سجل قرآني مطابق لهذا الرمز.");
          setRecord(null);
        } else {
          setRecord(data as unknown as VerifiedQuranRecord);
        }
      } catch {
        if (active) {
          setErrorMsg("تعذر الاتصال بخادم التحقق القرآني حالياً.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    verify();
    return () => {
      active = false;
    };
  }, [token]);

  if (loading) {
    return (
      <div
        className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 gap-3"
        dir="rtl"
      >
        <div className="w-9 h-9 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">جاري فحص السجل القرآني المركزي...</p>
      </div>
    );
  }

  if (!record || errorMsg) {
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
          <h1 className="text-xl font-black text-white">الشهادة أو السجل غير موجود</h1>
          <p className="text-xs text-slate-400 leading-relaxed">{errorMsg}</p>
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-[11px] font-mono text-slate-400 break-all">
            {token || "NO_TOKEN"}
          </div>
          <Link
            href="/"
            className="inline-block text-xs font-bold text-teal-400 hover:text-teal-300 transition"
          >
            ← العودة لبوابة المنظومة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-teal-500 selection:text-white"
      dir="rtl"
    >
      <div className="max-w-lg w-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-teal-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 shadow-lg shadow-teal-500/10">
            <Award className="w-9 h-9" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-bold border border-teal-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> سجل تسميع وإجازة قرآنية موثقة
          </div>
          <h1 className="text-2xl font-black text-white">منظومة منارة للتحقق القرآني</h1>
          <p className="text-xs text-slate-400">
            إدارة شؤون القرآن الكريم والمدارس الدعوية - السجل المركزي المعتمد
          </p>
        </div>

        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">حالة التوثيق:</span>
            <span className="text-teal-400 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> موثق بتاريخ {record.record_date}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">اسم الطالب:</span>
              <span className="font-bold text-white text-base">{record.student_full_name}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-[11px] text-slate-400 block">السورة والآيات:</span>
                <span className="text-xs font-bold text-amber-400">
                  {record.surah_name}
                  {record.ayah_from && record.ayah_to
                    ? ` (${record.ayah_from} - ${record.ayah_to})`
                    : ""}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">التقدير:</span>
                <span className="text-xs font-bold text-emerald-400">
                  {record.score || "EXCELLENT"}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block">مركز التحفيظ والمسجد:</span>
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-teal-400" />{" "}
                {record.quran_circles?.name || "حلقة قرآنية"} -{" "}
                {record.quran_circles?.mosques?.name || "مسجد معتمد"}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">الشيخ المحفظ:</span>
              <span className="text-xs font-bold text-slate-200">
                {record.quran_circles?.mosque_staff?.full_name || "محفظ معتمد لدى الهيئة"}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>معرف السجل:</span>
            <span className="font-mono text-teal-400 font-bold">{record.id}</span>
          </div>
        </div>

        <p className="text-[11px] text-center text-slate-500 leading-relaxed">
          تم فحص هذا السجل ومطابقته في السجل القرآني المركزي لمنظومة &quot;منارة&quot;.
        </p>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-bold text-teal-400 hover:text-teal-300 transition"
          >
            ← العودة لبوابة المنظومة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyQuranCertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyQuranCertificateContent />
    </Suspense>
  );
}
