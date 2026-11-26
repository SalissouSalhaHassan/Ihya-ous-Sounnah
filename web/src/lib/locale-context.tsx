"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Locale, translations } from "./i18n";

const STORAGE_KEY = "ihyaous_locale";

interface LocaleContextValue {
  locale: Locale;
  currentLocale: Locale;
  setLocale: (lang: Locale) => void;
  setCurrentLocale: (lang: Locale) => void;
  t: (typeof translations)[Locale];
  isRtl: boolean;
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function isValidLocale(val: string | null): val is Locale {
  return val === "ar" || val === "fr" || val === "ha";
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (!isValidLocale(saved) || saved === "ar") return;
    const raf = requestAnimationFrame(() => {
      setLocaleState(saved);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && isValidLocale(e.newValue)) {
        setLocaleState(e.newValue);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setLocale = useCallback((lang: Locale) => {
    setLocaleState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }, []);

  const value: LocaleContextValue = {
    locale,
    currentLocale: locale,
    setLocale,
    setCurrentLocale: setLocale,
    t: translations[locale],
    isRtl: locale === "ar",
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return ctx;
}
