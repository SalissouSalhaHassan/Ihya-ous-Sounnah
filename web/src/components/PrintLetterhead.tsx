"use client";

import React, { useState, useEffect } from "react";
import { Printer } from "lucide-react";
import { useIdentitySettings } from "@/lib/identity-settings";

interface PrintLetterheadProps {
  title: string;
  subtitle?: string;
  village?: string;
  badge?: string;
  locale?: "ar" | "fr" | "ha";
  orientation?: "portrait" | "landscape";
  compact?: boolean;
}

export function PrintLetterhead({
  title,
  subtitle,
  village,
  badge,
  locale = "fr",
  orientation = "portrait",
  compact = false,
}: PrintLetterheadProps) {
  const identity = useIdentitySettings();
  const isRtl = locale === "ar";
  const dateLabel =
    locale === "ar"
      ? "تاريخ الطباعة"
      : locale === "ha"
      ? "Ranar Bugawa"
      : "Imprimé le";
  const villageLabel =
    locale === "ar"
      ? "القرية / القسم"
      : locale === "ha"
      ? "Ƙauye / Sashe"
      : "Village / Section";

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    queueMicrotask(() => {
      setFormattedDate(
        new Date().toLocaleDateString(locale === "ar" ? "ar-NE" : "fr-FR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
      );
    });
  }, [locale]);

  return (
    <div
      className={`hidden print:block border-b-2 border-emerald-700 w-full ${
        compact ? "mb-2 pb-1.5" : "mb-3 pb-2.5"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <style type="text/css" media="print">
        {`@page { size: A4 ${orientation}; margin: 0; }`}
      </style>
      {/* Official Letterhead Banner - full width matching table */}
      <div className={`w-full ${compact ? "mb-1.5" : "mb-2"}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={identity.letterheadUrl || "/images/official-letterhead.jpg"}
          alt={`${identity.organizationName} — ${identity.coordinationName}`}
          className={`w-full h-auto block ${compact ? "max-h-24 object-fill" : ""}`}
        />
      </div>

      {/* Document Title & Metadata Bar */}
      <div
        className={`flex items-end justify-between gap-4 bg-slate-50 border border-slate-300 rounded-lg ${
          compact ? "px-3 py-1.5" : "px-4 py-2.5"
        }`}
      >
        <div className="min-w-0">
          {badge && (
            <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-0.5">
              {badge}
            </div>
          )}
          <h2 className="text-base font-extrabold text-slate-900 leading-snug">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-slate-700 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="text-end shrink-0 text-[11px] text-slate-700 space-y-0.5">
          {village && (
            <div>
              <span className="font-bold text-slate-900">{villageLabel}:</span>{" "}
              <span>{village}</span>
            </div>
          )}
          <div>
            <span className="font-bold text-slate-900">{dateLabel}:</span>{" "}
            <span suppressHydrationWarning>{formattedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PrintSignatureFooterProps {
  locale?: "ar" | "fr" | "ha";
}

export function PrintSignatureFooter({
  locale = "fr",
}: PrintSignatureFooterProps) {
  const identity = useIdentitySettings();
  const isRtl = locale === "ar";
  const labels =
    locale === "ar"
      ? {
          left: "الأمين العام / المقرر",
          center: "أمين الصندوق",
          right: "رئيس التنسيقية الجهوية (مرادي)",
        }
      : locale === "ha"
      ? {
          left: "Sakatare",
          center: "Ma'ajin Kuɗi",
          right: "Shugaban Gudanarwa (Maradi)",
        }
      : {
          left: "Le Secrétaire",
          center: "Le Trésorier",
          right: "Le Président de la C/R (Maradi)",
        };

  return (
    <div
      className="hidden print:block mt-8 pt-4 border-t border-slate-300 text-xs text-slate-800 break-inside-avoid"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="grid grid-cols-3 gap-6">
        <div className="text-center">
          <div className="font-bold mb-10">{labels.left}</div>
          <div className="border-t border-dashed border-slate-400 pt-1 text-[10px] text-slate-500">
            Signature &amp; Cachet
          </div>
        </div>
        <div className="text-center">
          <div className="font-bold mb-10">{labels.center}</div>
          <div className="border-t border-dashed border-slate-400 pt-1 text-[10px] text-slate-500">
            Signature &amp; Cachet
          </div>
        </div>
        <div className="text-center relative">
          <div className="font-bold mb-1">{labels.right}</div>
          <div className="h-12 flex items-center justify-center">
            {identity.showStampOnPrint && identity.stampUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={identity.stampUrl}
                alt="Cachet Officiel"
                className="h-14 w-auto object-contain opacity-90"
              />
            ) : (
              <span className="text-[10px] text-slate-400 italic">
                {identity.presidentName}
              </span>
            )}
          </div>
          <div className="border-t border-dashed border-slate-400 pt-1 text-[10px] text-slate-500">
            Signature &amp; Cachet
          </div>
        </div>
      </div>

      {(identity.footerMention || identity.legalRegistration) && (
        <div className="mt-4 pt-2 border-t border-slate-200 flex items-center justify-between text-[9.5px] text-slate-500">
          <span>{identity.footerMention}</span>
          <span>
            {[identity.legalRegistration, identity.phone]
              .filter(Boolean)
              .join(" • ")}
          </span>
        </div>
      )}
    </div>
  );
}

interface PrintOrientationControlsProps {
  orientation: "portrait" | "landscape";
  onPrint: (orientation: "portrait" | "landscape") => void;
  locale?: "ar" | "fr" | "ha";
}

export function PrintOrientationControls({
  orientation,
  onPrint,
  locale = "fr",
}: PrintOrientationControlsProps) {
  const portraitLabel =
    locale === "ar"
      ? "طباعة عمودي (Portrait)"
      : locale === "ha"
      ? "Buga Tsaye (Portrait)"
      : "Portrait";
  const landscapeLabel =
    locale === "ar"
      ? "طباعة أفقي (Landscape)"
      : locale === "ha"
      ? "Buga Kwance (Landscape)"
      : "Landscape";

  return (
    <div className="inline-flex items-center rounded-xl bg-slate-950 border border-slate-700 p-1 gap-1 print:hidden">
      <button
        type="button"
        onClick={() => onPrint("portrait")}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
          orientation === "portrait"
            ? "bg-emerald-600 text-white shadow"
            : "text-slate-300 hover:bg-slate-800"
        }`}
      >
        <Printer className="w-3.5 h-3.5" />
        <span>{portraitLabel}</span>
      </button>
      <button
        type="button"
        onClick={() => onPrint("landscape")}
        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
          orientation === "landscape"
            ? "bg-emerald-600 text-white shadow"
            : "text-slate-300 hover:bg-slate-800"
        }`}
      >
        <Printer className="w-3.5 h-3.5 rotate-90" />
        <span>{landscapeLabel}</span>
      </button>
    </div>
  );
}
