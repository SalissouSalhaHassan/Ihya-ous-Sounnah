"use client";

import { useState, useEffect } from "react";

export interface IdentitySettings {
  organizationName: string;
  organizationSubtitle: string;
  coordinationName: string;
  presidentName: string;
  letterheadUrl: string;
  logoUrl: string;
  stampUrl: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  legalRegistration: string;
  footerMention: string;
  showWatermarkOnPrint: boolean;
  showStampOnPrint: boolean;
}

export const DEFAULT_IDENTITY_SETTINGS: IdentitySettings = {
  organizationName: "Ihya'ous Sounnah",
  organizationSubtitle:
    "Association pour la Prédication, l'Éducation et l'Enseignement de l'Islam au Niger",
  coordinationName: "Coordination Régionale de Maradi",
  presidentName: "Elh Rabiou Moussa Tela",
  letterheadUrl: "/images/official-letterhead.jpg",
  logoUrl: "/images/official-logo-watermark.jpg",
  stampUrl: "",
  address: "Maradi (Quartier Ali Dan Sôfo) BP : .... Maradi (NIGER)",
  phone: "96 88 09 22 – 93 96 97 01 – 90 12 78 81",
  email: "contact@ihyaoussounnah.ne",
  website: "https://ihyaoussounnah.ne",
  legalRegistration: "ARRETE N°0507/MISD/DAJ/DLR/2002",
  footerMention:
    "Document officiel — Coordination Régionale de Maradi (Ihya'ous Sounnah)",
  showWatermarkOnPrint: true,
  showStampOnPrint: true,
};

const STORAGE_KEY = "ihyaous_sounnah_identity_settings_v1";
const UPDATE_EVENT = "ihyaous:identity-updated";

export function loadIdentitySettings(): IdentitySettings {
  if (typeof window === "undefined") return DEFAULT_IDENTITY_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_IDENTITY_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<IdentitySettings>;
    return { ...DEFAULT_IDENTITY_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_IDENTITY_SETTINGS;
  }
}

export function saveIdentitySettings(settings: IdentitySettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function resetIdentitySettings(): IdentitySettings {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event(UPDATE_EVENT));
  }
  return DEFAULT_IDENTITY_SETTINGS;
}

export function useIdentitySettings(): IdentitySettings {
  const [settings, setSettings] = useState<IdentitySettings>(
    DEFAULT_IDENTITY_SETTINGS
  );

  useEffect(() => {
    const sync = () => {
      setSettings(loadIdentitySettings());
    };
    queueMicrotask(sync);
    window.addEventListener(UPDATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(UPDATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return settings;
}
