"use client";

import React, { useState, useEffect } from "react";
import { Download, WifiOff, X } from "lucide-react";
import { useLocale } from "@/lib/locale-context";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaManager() {
  const { currentLocale, isRtl } = useLocale();
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    queueMicrotask(() => {
      setIsOffline(!navigator.onLine);
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };
    const onOnline = () => setIsOffline(false);
    const onOffline = () => setIsOffline(true);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstallPrompt(null);
    }
  };

  const labels = {
    ar: {
      offline: "وضع عدم الاتصال (PWA Offline)",
      installTitle: "تثبيت تطبيق Ihya'ous Sounnah",
      installDesc: "تثبيت سريع على الهاتف أو الكمبيوتر للعمل دون إنترنت",
      installBtn: "تثبيت التطبيق",
    },
    fr: {
      offline: "Mode Hors-ligne (PWA)",
      installTitle: "Installer l'application Ihya'ous Sounnah",
      installDesc: "Accès rapide et travail hors-ligne sur mobile et PC",
      installBtn: "Installer",
    },
    ha: {
      offline: "Yanayin Ba Net (PWA)",
      installTitle: "Sanya Manhajar Ihya'ous Sounnah",
      installDesc: "Shiga cikin sauri da aiki ko da babu intanet",
      installBtn: "Sanya Manhaja",
    },
  }[currentLocale];

  return (
    <>
      {isOffline && (
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className="print:hidden fixed top-3 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
        >
          <div className="pointer-events-auto inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/95 text-slate-950 text-xs font-black shadow-lg">
            <WifiOff className="w-3.5 h-3.5" />
            <span>{labels.offline}</span>
          </div>
        </div>
      )}

      {installPrompt && !dismissed && (
        <div
          dir={isRtl ? "rtl" : "ltr"}
          className="print:hidden fixed bottom-4 end-4 z-50 max-w-sm bg-slate-900/95 backdrop-blur-xl border border-emerald-500/40 rounded-2xl p-4 shadow-2xl flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-white truncate">
              {labels.installTitle}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {labels.installDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={handleInstall}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            {labels.installBtn}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="p-1 text-slate-400 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
