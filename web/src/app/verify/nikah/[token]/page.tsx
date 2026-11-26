"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ShieldCheck,
  CheckCircle2,
  Building2,
  Lock,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/infrastructure/supabase/client";

interface VerifiedContract {
  contract_number: string;
  groom_full_name: string;
  bride_full_name: string;
  contract_date: string;
  verification_token: string;
  status: string;
  mosques?: { name: string } | null;
  mosque_staff?: { full_name: string } | null;
}

function VerifyNikahContent() {
  const params = useParams();
  const token = decodeURIComponent((params?.token as string) || "");

  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState<VerifiedContract | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function verify() {
      if (!token) {
        if (active) {
          setErrorMsg("لم يتم تمرير رمز تحقق صالح في الرابط.");
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("marriage_contracts")
          .select(
            "contract_number, groom_full_name, bride_full_name, contract_date, verification_token, status, mosques(name), mosque_staff(full_name)"
          )
          .eq("verification_token", token)
          .maybeSingle();

        if (!active) return;

        if (error || !data) {
          setErrorMsg("لم يتم العثور على عقد زواج مسجل بهذا الرمز في السجل المركزي.");
          setContract(null);
        } else {
          setContract(data as unknown as VerifiedContract);
        }
      } catch {
        if (active) {
          setErrorMsg("تعذر الاتصال بخادم التحقق حالياً. يرجى المحاولة لاحقاً.");
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
        <div className="w-9 h-9 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-slate-400">جاري مطابقة البصمة الرقمية في السجل المركزي...</p>
      </div>
    );
  }

  if (!contract || errorMsg) {
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
          <h1 className="text-xl font-black text-white">وثيقة غير موثقة أو غير موجودة</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            {errorMsg || "تعذر التحقق من صحة هذا الرمز."}
          </p>
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-[11px] font-mono text-slate-400 break-all">
            {token || "NO_TOKEN"}
          </div>
          <Link
            href="/"
            className="inline-block text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            ← العودة لبوابة المنظومة الرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 selection:bg-emerald-500 selection:text-white"
      dir="rtl"
    >
      <div className="max-w-lg w-full bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="w-9 h-9" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> وثيقة رسمية معتمدة وموثقة
          </div>
          <h1 className="text-2xl font-black text-white">منظومة منارة للتحقق الرقمي</h1>
          <p className="text-xs text-slate-400">
            الهيئة العامة للأوقاف والشؤون الإسلامية - سجل الأحوال الشخصية
          </p>
        </div>

        <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-4 text-sm">
          <div className="flex justify-between items-center pb-3 border-b border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">حالة التوثيق:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> {contract.status || "OFFICIALLY_REGISTERED"}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs text-slate-400 block mb-0.5">الزوجان المباركان:</span>
              <span className="font-bold text-white text-base">
                {contract.groom_full_name} 💍 {contract.bride_full_name}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <span className="text-[11px] text-slate-400 block">رقم العقد المعتمد:</span>
                <span className="font-mono text-xs font-bold text-slate-200">
                  {contract.contract_number}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block">تاريخ انعقاد القران:</span>
                <span className="text-xs font-bold text-slate-200">{contract.contract_date}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-slate-400 block">المسجد المنعقد به العقد:</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5" />{" "}
                {contract.mosques?.name || "مسجد معتمد لدى الهيئة"}
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block">الإمام المأذون المنعقد على يديه:</span>
              <span className="text-xs font-bold text-slate-200">
                {contract.mosque_staff?.full_name || "مأذون شرعي معتمد"}
              </span>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>رمز البصمة الرقمية:</span>
            <span className="font-mono text-slate-400">{contract.verification_token}</span>
          </div>
        </div>

        <p className="text-[11px] text-center text-slate-500 leading-relaxed">
          هذه الوثيقة صادرة ومعتمدة إلكترونياً من خادم &quot;منظومة منارة&quot;، وهي صك رسمي معتمد لإثبات الزواج الشرعي خالية من أي شبهة تزوير.
        </p>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition"
          >
            ← العودة لبوابة المنظومة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyNikahPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyNikahContent />
    </Suspense>
  );
}
