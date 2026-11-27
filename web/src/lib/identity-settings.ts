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

export const HQ_IDENTITY_KEY = "__hq__";
export const HQ_IDENTITY_LABEL = "Coordination Régionale de Maradi (Siège)";

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

const LEGACY_STORAGE_KEY = "ihyaous_sounnah_identity_settings_v1";
const VILLAGES_STORAGE_KEY = "ihyaous_sounnah_identity_villages_v1";
const ACTIVE_VILLAGE_KEY = "ihyaous_sounnah_active_village_v1";
const UPDATE_EVENT = "ihyaous:identity-updated";

function normalizeVillageKey(villageKey?: string | null): string {
  const clean = (villageKey || "").trim();
  return clean && clean !== HQ_IDENTITY_LABEL ? clean : HQ_IDENTITY_KEY;
}

function readAllVillageProfiles(): Record<string, Partial<IdentitySettings>> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(VILLAGES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") return parsed;
    }
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      return { [HQ_IDENTITY_KEY]: JSON.parse(legacy) };
    }
  } catch {
    // ignore
  }
  return {};
}

function writeAllVillageProfiles(
  profiles: Record<string, Partial<IdentitySettings>>
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(VILLAGES_STORAGE_KEY, JSON.stringify(profiles));
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function getActiveIdentityVillage(): string {
  if (typeof window === "undefined") return HQ_IDENTITY_KEY;
  return localStorage.getItem(ACTIVE_VILLAGE_KEY) || HQ_IDENTITY_KEY;
}

export function setActiveIdentityVillage(villageKey?: string | null): void {
  if (typeof window === "undefined") return;
  const key = normalizeVillageKey(villageKey);
  localStorage.setItem(ACTIVE_VILLAGE_KEY, key);
  window.dispatchEvent(new Event(UPDATE_EVENT));
}

export function listIdentityVillages(): string[] {
  const profiles = readAllVillageProfiles();
  const keys = Object.keys(profiles).filter((k) => k !== HQ_IDENTITY_KEY);
  return [HQ_IDENTITY_KEY, ...keys];
}

export function buildVillageDefaultSettings(
  villageKey?: string | null
): IdentitySettings {
  const key = normalizeVillageKey(villageKey);
  if (key === HQ_IDENTITY_KEY) {
    return DEFAULT_IDENTITY_SETTINGS;
  }
  return {
    ...DEFAULT_IDENTITY_SETTINGS,
    coordinationName: key,
    footerMention: `Document officiel — ${key} (Ihya'ous Sounnah)`,
  };
}

export function loadIdentitySettings(
  villageKey?: string | null
): IdentitySettings {
  if (typeof window === "undefined") return DEFAULT_IDENTITY_SETTINGS;
  const key = normalizeVillageKey(villageKey ?? getActiveIdentityVillage());
  const profiles = readAllVillageProfiles();
  const base = buildVillageDefaultSettings(key);
  const saved = profiles[key];
  if (!saved) return base;
  return { ...base, ...saved };
}

export function saveIdentitySettings(
  settings: IdentitySettings,
  villageKey?: string | null
): void {
  if (typeof window === "undefined") return;
  const key = normalizeVillageKey(villageKey ?? getActiveIdentityVillage());
  const profiles = readAllVillageProfiles();
  profiles[key] = settings;
  writeAllVillageProfiles(profiles);
  if (key === HQ_IDENTITY_KEY) {
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(settings));
  }
}

export function resetIdentitySettings(
  villageKey?: string | null
): IdentitySettings {
  const key = normalizeVillageKey(villageKey ?? getActiveIdentityVillage());
  if (typeof window !== "undefined") {
    const profiles = readAllVillageProfiles();
    delete profiles[key];
    writeAllVillageProfiles(profiles);
    if (key === HQ_IDENTITY_KEY) {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }
  return buildVillageDefaultSettings(key);
}

export function deleteIdentityVillage(villageKey: string): void {
  const key = normalizeVillageKey(villageKey);
  if (key === HQ_IDENTITY_KEY || typeof window === "undefined") return;
  const profiles = readAllVillageProfiles();
  delete profiles[key];
  writeAllVillageProfiles(profiles);
  if (getActiveIdentityVillage() === key) {
    setActiveIdentityVillage(HQ_IDENTITY_KEY);
  }
}

export function useIdentitySettings(
  villageKey?: string | null
): IdentitySettings {
  const [settings, setSettings] = useState<IdentitySettings>(
    DEFAULT_IDENTITY_SETTINGS
  );

  useEffect(() => {
    const sync = () => {
      setSettings(loadIdentitySettings(villageKey));
    };
    queueMicrotask(sync);
    window.addEventListener(UPDATE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(UPDATE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [villageKey]);

  return settings;
}
