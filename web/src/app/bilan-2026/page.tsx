"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Building2,
  Mic2,
  Package,
  Landmark,
  GraduationCap,
  Coins,
  Handshake,
  Plus,
  Trash2,
  Save,
  Printer,
  CheckCircle2,
  AlertTriangle,
  Download,
  LayoutGrid,
  FilePlus2,
  Search,
  Edit3,
  Sparkles,
  FileSpreadsheet,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import {
  PrintLetterhead,
  PrintSignatureFooter,
  PrintOrientationControls,
} from "@/components/PrintLetterhead";
import { Locale } from "@/lib/i18n";

type TabId =
  | "structure"
  | "predication"
  | "equipement"
  | "patrimoine"
  | "makaranta"
  | "finances"
  | "bilan";

interface YearRow {
  id: string;
  label: string;
  y2025: number;
  y2026: number;
  etat?: string;
}

interface VillageRow {
  id: string;
  localite: string;
  dateSetup: string;
  members: number;
  presidentContact: string;
}

interface MosqueSituationRow {
  id: string;
  localite: string;
  daily2025: { dur: number; semiDur: number; banco: number; tole: number; tiges: number };
  friday2026: { dur: number; semiDur: number; banco: number; tole: number; tiges: number };
}

interface MakarantaRow {
  id: string;
  name: string;
  createdAt: string;
  agrement: "OUI" | "NON";
  teachers: number;
  classes: number;
  nature: string;
  boys2026: number;
  girls2026: number;
  sabka2024G: number;
  sabka2024F: number;
  sabka2025G: number;
  sabka2025F: number;
  sabka2026G: number;
  sabka2026F: number;
}

interface RollingRow {
  id: string;
  designation: string;
  marque: string;
  etat: string;
  dateAcq: string;
}

interface BilanFiche {
  id: string;
  sectionName: string;
  faitA: string;
  updatedAt: string;
  villages: VillageRow[];
  reunions: YearRow[];
  commissions: YearRow[];
  preachers: YearRow[];
  serieA: YearRow[];
  serieB: YearRow[];
  mobilier: YearRow[];
  sonorisation: YearRow[];
  electrique: YearRow[];
  bureauEquip: YearRow[];
  rolling: RollingRow[];
  foncier: YearRow[];
  immobilier: YearRow[];
  mosquesSitu: MosqueSituationRow[];
  makarantas: MakarantaRow[];
  finInterne: YearRow[];
  finExterne: YearRow[];
  depensesA: YearRow[];
  depensesB: YearRow[];
  relAuthorities: string;
  relOng: string;
  pointsForts: string;
  pointsAmeliorer: string;
}

const BILAN_DICT: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    badge: string;
    sectionLabel: string;
    sectionPlaceholder: string;
    deadlineNote: string;
    saveBtn: string;
    savedToast: string;
    printBtn: string;
    exportBtn: string;
    diff: string;
    total: string;
    addRow: string;
    tabs: Record<TabId, string>;
    oulamaMismatch: string;
    oulamaMatch: string;
    recettesLabel: string;
    depensesLabel: string;
    soldeLabel: string;
    modeAdd: string;
    modeDisplay: string;
    submitToListBtn: string;
    newFicheBtn: string;
    submittedToast: string;
    searchFichesPlaceholder: string;
    totalFichesLabel: string;
    totalStudentsLabel: string;
    totalMosquesLabel: string;
    consolidatedTitle: string;
    noFichesYet: string;
    editFiche: string;
    deleteFiche: string;
    exportCsvBtn: string;
    smartAlertsTitle: string;
    saveAndNextBtn: string;
    batchAddBtn: string;
    batchTitle: string;
    batchDesc: string;
    batchPlaceholder: string;
    batchCreateBtn: string;
    cancel: string;
    villagesBarLabel: string;
  }
> = {
  ar: {
    title: "استمارة جمع بيانات الحصيلة السنوية والممتلكات 2026",
    subtitle: "جمعية إحياء السنة (Ihya'ous Sounnah) — التنسيقية الجهوية بمرادي، النيجر",
    badge: "الحصيلة والممتلكات 2026",
    sectionLabel: "الفرع / الشعبة / القرية:",
    sectionPlaceholder: "مثال: قرية كاولاد / شعبة مرادي...",
    deadlineNote: "آخر أجل للإرسال إلى أمانة التنسيقية الجهوية: 15 يناير 2027",
    saveBtn: "حفظ المسودة",
    savedToast: "تم حفظ بيانات الاستمارة محلياً بنجاح",
    printBtn: "طباعة",
    exportBtn: "تصدير JSON",
    diff: "الفرق",
    total: "المجموع",
    addRow: "إضافة سطر",
    tabs: {
      structure: "I. الهيكلة واللجان",
      predication: "II. الدعوة والوعظ",
      equipement: "III-V. التجهيزات والمركبات",
      patrimoine: "VI-VIII. العقارات والمساجد",
      makaranta: "X. مدارس القرآن",
      finances: "VII. الوضع المالي",
      bilan: "VIII-IX. الشراكات والتقييم",
    },
    oulamaMismatch: "تنبيه: مجموع الدعاة لا يطابق عدد أعضاء مجلس العلماء المسجل في القسم I.3",
    oulamaMatch: "متطابق مع عدد أعضاء مجلس العلماء",
    recettesLabel: "إجمالي المداخيل (2026)",
    depensesLabel: "إجمالي المصاريف (2026)",
    soldeLabel: "الرصيد الصافي (2026)",
    modeAdd: "قائمة الإضافة والإدخال",
    modeDisplay: "قائمة العرض والتحليل الذكي",
    submitToListBtn: "اعتماد وإضافة للعرض",
    newFicheBtn: "استمارة قرية جديدة",
    submittedToast: "تمت إضافة/تحديث استمارة القرية في قائمة العرض التجميعي بنجاح",
    searchFichesPlaceholder: "ابحث باسم القرية أو الشعبة...",
    totalFichesLabel: "إجمالي الاستمارات (القرى)",
    totalStudentsLabel: "إجمالي طلاب مكرنتا (2026)",
    totalMosquesLabel: "إجمالي مساجد الجمعة (2026)",
    consolidatedTitle: "سجل القرى والشعب المجمّع (تحديث تلقائي ذكي)",
    noFichesYet: "لا توجد استمارات مضافة بعد. ابدأ من «قائمة الإضافة» لإدخال بيانات القرى.",
    editFiche: "تعديل",
    deleteFiche: "حذف",
    exportCsvBtn: "تصدير CSV (Excel)",
    smartAlertsTitle: "التنبيهات والتدقيق الذكي التلقائي",
    saveAndNextBtn: "حفظ وإضافة قرية أخرى",
    batchAddBtn: "إضافة عدة قرى دفعة واحدة",
    batchTitle: "إنشاء استمارات لعدة قرى دفعة واحدة",
    batchDesc: "اكتب اسم كل قرية أو شعبة في سطر مستقل ليتم إنشاء استمارة خاصة بها تلقائياً:",
    batchPlaceholder: "قرية كاولاد\nقرية سابون غاري\nقرية مادارونفا",
    batchCreateBtn: "إنشاء الاستمارات للجميع",
    cancel: "إلغاء",
    villagesBarLabel: "التنقل السريع بين القرى:",
  },
  fr: {
    title: "Fiches de Collecte — Bilan des Activités & Patrimoine 2026",
    subtitle: "Association Ihya'ous Sounnah — Coordination Régionale de Maradi (Niger)",
    badge: "Bilan & Patrimoine 2026",
    sectionLabel: "Section / Sous-section / Village :",
    sectionPlaceholder: "Ex : Village Kaolack / Maradi Centre...",
    deadlineNote: "Date limite d'envoi au secrétariat de la CSR : 15 janvier 2027",
    saveBtn: "Brouillon",
    savedToast: "Questionnaire enregistré localement avec succès",
    printBtn: "Imprimer",
    exportBtn: "Exporter JSON",
    diff: "Différence",
    total: "Total",
    addRow: "Ajouter une ligne",
    tabs: {
      structure: "I. Structure & Commissions",
      predication: "II. Prédication",
      equipement: "III-V. Équipements & Véhicules",
      patrimoine: "VI-VIII. Foncier & Mosquées",
      makaranta: "X. Écoles Makaranta",
      finances: "VII. Situation Financière",
      bilan: "VIII-IX. Partenariat & Bilan",
    },
    oulamaMismatch: "Attention : le total des prédicateurs doit correspondre au Conseil des Oulémas (I.3)",
    oulamaMatch: "Conforme au Conseil des Oulémas",
    recettesLabel: "Total Recettes (2026)",
    depensesLabel: "Total Dépenses (2026)",
    soldeLabel: "Solde Net (2026)",
    modeAdd: "Saisie & Ajout (Formulaire)",
    modeDisplay: "Vue Consolidée & Analyse IA",
    submitToListBtn: "Valider & Ajouter à la liste",
    newFicheBtn: "Nouvelle fiche village",
    submittedToast: "Fiche ajoutée/mise à jour dans la vue consolidée avec succès",
    searchFichesPlaceholder: "Rechercher par village ou section...",
    totalFichesLabel: "Total Fiches / Villages",
    totalStudentsLabel: "Total Élèves Makaranta (2026)",
    totalMosquesLabel: "Total Mosquées Vendredi (2026)",
    consolidatedTitle: "Registre Consolidé des Villages & Sections",
    noFichesYet: "Aucune fiche enregistrée. Utilisez « Saisie & Ajout » pour ajouter plusieurs villages.",
    editFiche: "Modifier",
    deleteFiche: "Supprimer",
    exportCsvBtn: "Exporter CSV (Excel)",
    smartAlertsTitle: "Audit & Alertes Intelligentes Automatiques",
    saveAndNextBtn: "Enregistrer & Village suivant",
    batchAddBtn: "Ajout multiple (plusieurs villages)",
    batchTitle: "Créer des fiches pour plusieurs villages",
    batchDesc: "Saisissez un nom de village ou section par ligne pour générer chaque fiche :",
    batchPlaceholder: "Village Kaolack\nVillage Madarounfa\nVillage Guidan Roumdji",
    batchCreateBtn: "Créer toutes les fiches",
    cancel: "Annuler",
    villagesBarLabel: "Villages enregistrés :",
  },
  ha: {
    title: "Takardar Tattara Bayanan Ayyuka da Kadarori na 2026",
    subtitle: "Kungiyar Ihya'ous Sounnah — Shiyyar Maradi (Nijar)",
    badge: "Rahoton 2026",
    sectionLabel: "Sashe / Reshe / Kauye:",
    sectionPlaceholder: "Misali: Kauyen Maradi...",
    deadlineNote: "Ranar karshe ta aikawa zuwa sakatariyar CSR: 15 Janairu 2027",
    saveBtn: "Ajiye",
    savedToast: "An ajiye bayanan takardar cikin nasara",
    printBtn: "Buga",
    exportBtn: "Fitar da JSON",
    diff: "Bambanci",
    total: "Jimilla",
    addRow: "Kara layi",
    tabs: {
      structure: "I. Tsari da Kwamitoci",
      predication: "II. Wa'azi da Da'awa",
      equipement: "III-V. Kayan Aiki da Motoci",
      patrimoine: "VI-VIII. Filaye da Masallatai",
      makaranta: "X. Makarantun Makaranta",
      finances: "VII. Yanayin Kudi",
      bilan: "VIII-IX. Hulda da Kimantawa",
    },
    oulamaMismatch: "Gargadi: jimillar masu wa'azi ba ta yi daidai da Majalisar Malamai (I.3) ba",
    oulamaMatch: "Ya yi daidai da Majalisar Malamai",
    recettesLabel: "Jimillar Kudin Shiga (2026)",
    depensesLabel: "Jimillar Kashe Kudi (2026)",
    soldeLabel: "Ribar da ta rage (2026)",
    modeAdd: "Shigar da Bayanai (Kara)",
    modeDisplay: "Jerin Bayanai da Nazari",
    submitToListBtn: "Tabbatar da Kara a Jeri",
    newFicheBtn: "Sabuwar takardar kauye",
    submittedToast: "An kara takardar kauye a cikin jeri cikin nasara",
    searchFichesPlaceholder: "Nemo da sunan kauye ko sashe...",
    totalFichesLabel: "Jimillar Takardun Kauyuka",
    totalStudentsLabel: "Jimillar Daliban Makaranta (2026)",
    totalMosquesLabel: "Jimillar Masallatan Juma'a (2026)",
    consolidatedTitle: "Rijistar Kauyuka da Sassan da aka Tattara",
    noFichesYet: "Babu takarda tukuna. Yi amfani da bangaren kara bayanai don shigar da kauyuka da yawa.",
    editFiche: "Gyara",
    deleteFiche: "Goge",
    exportCsvBtn: "Fitar da CSV (Excel)",
    smartAlertsTitle: "Bincike da Gargadi na Kai Tsaye",
    saveAndNextBtn: "Ajiye & Kara wani kauye",
    batchAddBtn: "Kara kauyuka da yawa lokaci daya",
    batchTitle: "Bude takardu don kauyuka da yawa",
    batchDesc: "Rubuta sunan kowane kauye a layi daban:",
    batchPlaceholder: "Kauyen Maradi\nKauyen Madarounfa\nKauyen Tessaoua",
    batchCreateBtn: "Bude dukkan takardun",
    cancel: "Fasa",
    villagesBarLabel: "Kauyukan da aka shigar:",
  },
};

const STORAGE_KEY = "ihyaous_bilan_2026_v1";

function YearComparisonTable({
  title,
  rows,
  onChange,
  showEtat = false,
  diffLabel,
  totalLabel,
}: {
  title: string;
  rows: YearRow[];
  onChange: (updated: YearRow[]) => void;
  showEtat?: boolean;
  diffLabel: string;
  totalLabel: string;
}) {
  const sum2025 = rows.reduce((acc, r) => acc + (Number(r.y2025) || 0), 0);
  const sum2026 = rows.reduce((acc, r) => acc + (Number(r.y2026) || 0), 0);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 font-bold text-sm text-emerald-400">
        {title}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
              <th className="py-2.5 px-3 text-start w-10">#</th>
              <th className="py-2.5 px-3 text-start">البيان / Désignation</th>
              {showEtat && <th className="py-2.5 px-3 text-start w-32">الحالة / État</th>}
              <th className="py-2.5 px-3 text-center w-28">2025</th>
              <th className="py-2.5 px-3 text-center w-28">2026</th>
              <th className="py-2.5 px-3 text-center w-28">{diffLabel}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {rows.map((row, idx) => {
              const diff = (Number(row.y2026) || 0) - (Number(row.y2025) || 0);
              return (
                <tr key={row.id} className="hover:bg-slate-800/30">
                  <td className="py-2 px-3 text-slate-500 font-mono">{idx + 1}</td>
                  <td className="py-2 px-3 font-medium text-slate-200">{row.label}</td>
                  {showEtat && (
                    <td className="py-2 px-3">
                      <input
                        type="text"
                        value={row.etat || ""}
                        onChange={(e) =>
                          onChange(
                            rows.map((r) => (r.id === row.id ? { ...r, etat: e.target.value } : r))
                          )
                        }
                        placeholder="Bon / Moyen..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </td>
                  )}
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min={0}
                      value={row.y2025}
                      onChange={(e) =>
                        onChange(
                          rows.map((r) =>
                            r.id === row.id ? { ...r, y2025: Number(e.target.value) || 0 } : r
                          )
                        )
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-center text-white font-mono"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      min={0}
                      value={row.y2026}
                      onChange={(e) =>
                        onChange(
                          rows.map((r) =>
                            r.id === row.id ? { ...r, y2026: Number(e.target.value) || 0 } : r
                          )
                        )
                      }
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-center text-white font-mono"
                    />
                  </td>
                  <td
                    className={`py-2 px-3 text-center font-mono font-bold ${diff > 0
                      ? "text-emerald-400"
                      : diff < 0
                        ? "text-rose-400"
                        : "text-slate-500"
                      }`}
                  >
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-slate-950 font-bold text-white border-t border-slate-700">
              <td colSpan={showEtat ? 3 : 2} className="py-2.5 px-3 text-end text-emerald-400">
                {totalLabel}
              </td>
              <td className="py-2.5 px-3 text-center font-mono">{sum2025}</td>
              <td className="py-2.5 px-3 text-center font-mono">{sum2026}</td>
              <td className="py-2.5 px-3 text-center font-mono text-emerald-400">
                {sum2026 - sum2025 > 0 ? `+${sum2026 - sum2025}` : sum2026 - sum2025}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default function Bilan2026Page() {
  const { currentLocale, isRtl } = useLocale();
  const dict = BILAN_DICT[currentLocale];

  const [viewMode, setViewMode] = useState<"add" | "display">("add");
  const [fichesList, setFichesList] = useState<BilanFiche[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [assignedVillage, setAssignedVillage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchVillagesText, setBatchVillagesText] = useState("");
  const [isBatchCreating, setIsBatchCreating] = useState(false);
  const [editingFicheId, setEditingFicheId] = useState<string | null>(null);
  const [searchFiches, setSearchFiches] = useState("");
  const [activeTab, setActiveTab] = useState<TabId>("structure");
  const [sectionName, setSectionName] = useState("");
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // I.1 Villages
  const [villages, setVillages] = useState<VillageRow[]>([
    { id: "v1", localite: "", dateSetup: "", members: 0, presidentContact: "" },
  ]);

  // I.2 Réunions
  const [reunions, setReunions] = useState<YearRow[]>([
    { id: "r1", label: "Réunions ordinaires / اجتماعات عادية", y2025: 0, y2026: 0 },
    { id: "r2", label: "Réunions extraordinaires / اجتماعات استثنائية", y2025: 0, y2026: 0 },
  ]);

  // I.3 Commissions spécifiques
  const [commissions, setCommissions] = useState<YearRow[]>([
    { id: "c1", label: "Conseil des oulémas / مجلس العلماء", y2025: 0, y2026: 0 },
    { id: "c2", label: "Cellule d'organisation, assistance & sécurité (AGAJI)", y2025: 0, y2026: 0 },
    { id: "c3", label: "Commission mobilisation des ressources / تعبئة الموارد", y2025: 0, y2026: 0 },
    { id: "c4", label: "Commission arbitrage & réconciliation / الصلح والتحكيم", y2025: 0, y2026: 0 },
    { id: "c5", label: "Commission restauration / الإطعام", y2025: 0, y2026: 0 },
    { id: "c6", label: "Commission accueil / الاستقبال", y2025: 0, y2026: 0 },
    { id: "c7", label: "Commission hébergement / الإيواء", y2025: 0, y2026: 0 },
    { id: "c8", label: "Commission infrastructures & Waqf / البنية التحتية والوقف", y2025: 0, y2026: 0 },
    { id: "c9", label: "Présidents d'honneur / رؤساء شرفيون", y2025: 0, y2026: 0 },
    { id: "c10", label: "Conseillers / مستشارون", y2025: 0, y2026: 0 },
    { id: "c11", label: "Autres / أخرى", y2025: 0, y2026: 0 },
  ]);

  // II.1 Prédicateurs
  const [preachers, setPreachers] = useState<YearRow[]>([
    { id: "p1", label: "Qualifiés pour les prêches locaux", y2025: 0, y2026: 0 },
    { id: "p2", label: "Qualifiés pour les Wa'azin Jaha", y2025: 0, y2026: 0 },
    { id: "p3", label: "Qualifiés pour les Wa'azin Kassa", y2025: 0, y2026: 0 },
    { id: "p4", label: "Alaramma", y2025: 0, y2026: 0 },
  ]);

  // II.2 Série A
  const [serieA, setSerieA] = useState<YearRow[]>([
    { id: "sa1", label: "Tournée de prêche (zagayawa)", y2025: 0, y2026: 0 },
    { id: "sa2", label: "Prêche de coalition (wa'azin hadin guywa)", y2025: 0, y2026: 0 },
    { id: "sa3", label: "Wa'azin Jaha (Ihya'ous Sounnah)", y2025: 0, y2026: 0 },
    { id: "sa4", label: "Wa'azin Kassa (Ihya'ous Sounnah)", y2025: 0, y2026: 0 },
    { id: "sa5", label: "Sortie de prêche (fita)", y2025: 0, y2026: 0 },
    { id: "sa6", label: "Séminaire (daura)", y2025: 0, y2026: 0 },
  ]);

  // II.3 Série B
  const [serieB, setSerieB] = useState<YearRow[]>([
    { id: "sb1", label: "Walima", y2025: 0, y2026: 0 },
    { id: "sb2", label: "Conférence (Mohaddara)", y2025: 0, y2026: 0 },
    { id: "sb3", label: "Invitation (Gayyata)", y2025: 0, y2026: 0 },
    { id: "sb4", label: "Prêche radio", y2025: 0, y2026: 0 },
    { id: "sb5", label: "Cours (karatun litattafai)", y2025: 0, y2026: 0 },
  ]);

  // III.1 Mobilier, III.2 Sonorisation, III.3 Électrique, III.4 Autres, IX Bureau
  const [mobilier, setMobilier] = useState<YearRow[]>([
    { id: "m1", label: "Podium", etat: "", y2025: 0, y2026: 0 },
    { id: "m2", label: "Banc", etat: "", y2025: 0, y2026: 0 },
    { id: "m3", label: "Chaise", etat: "", y2025: 0, y2026: 0 },
    { id: "m4", label: "Salon", etat: "", y2025: 0, y2026: 0 },
    { id: "m5", label: "Table", etat: "", y2025: 0, y2026: 0 },
    { id: "m6", label: "Nattes", etat: "", y2025: 0, y2026: 0 },
  ]);

  const [sonorisation, setSonorisation] = useState<YearRow[]>([
    { id: "so1", label: "Haut-parleur", etat: "", y2025: 0, y2026: 0 },
    { id: "so2", label: "Microphone", etat: "", y2025: 0, y2026: 0 },
    { id: "so3", label: "Amplificateur", etat: "", y2025: 0, y2026: 0 },
    { id: "so4", label: "Radio", etat: "", y2025: 0, y2026: 0 },
  ]);

  const [electrique, setElectrique] = useState<YearRow[]>([
    { id: "el1", label: "Groupe électrique", etat: "", y2025: 0, y2026: 0 },
    { id: "el2", label: "Rallonge", etat: "", y2025: 0, y2026: 0 },
    { id: "el3", label: "Poteau électrique", etat: "", y2025: 0, y2026: 0 },
    { id: "el4", label: "Câble électrique", etat: "", y2025: 0, y2026: 0 },
    { id: "el5", label: "Ampoule", etat: "", y2025: 0, y2026: 0 },
    { id: "el6", label: "Lampadaire", etat: "", y2025: 0, y2026: 0 },
    { id: "el7", label: "Multiprise", etat: "", y2025: 0, y2026: 0 },
    { id: "el8", label: "Lampe torche", etat: "", y2025: 0, y2026: 0 },
  ]);

  const [bureauEquip, setBureauEquip] = useState<YearRow[]>([
    { id: "bu1", label: "Ordinateur", etat: "", y2025: 0, y2026: 0 },
    { id: "bu2", label: "Imprimante", etat: "", y2025: 0, y2026: 0 },
    { id: "bu3", label: "Armoire", etat: "", y2025: 0, y2026: 0 },
    { id: "bu4", label: "Chaise de bureau", etat: "", y2025: 0, y2026: 0 },
    { id: "bu5", label: "Bureau", etat: "", y2025: 0, y2026: 0 },
  ]);

  // V. Matériel roulant
  const [rolling, setRolling] = useState<RollingRow[]>([
    { id: "ro1", designation: "Voiture N°1", marque: "", etat: "", dateAcq: "" },
    { id: "ro2", designation: "Voiture N°2", marque: "", etat: "", dateAcq: "" },
    { id: "ro3", designation: "Moto", marque: "", etat: "", dateAcq: "" },
    { id: "ro4", designation: "Vélo", marque: "", etat: "", dateAcq: "" },
    { id: "ro5", designation: "Tricycle", marque: "", etat: "", dateAcq: "" },
  ]);

  // VI. Foncière & VII. Immobilière
  const [foncier, setFoncier] = useState<YearRow[]>([
    { id: "f1", label: "Parcelle", y2025: 0, y2026: 0 },
    { id: "f2", label: "Champ", y2025: 0, y2026: 0 },
    { id: "f3", label: "Jardin", y2025: 0, y2026: 0 },
    { id: "f4", label: "Terrain des grandes prières", y2025: 0, y2026: 0 },
  ]);

  const [immobilier, setImmobilier] = useState<YearRow[]>([
    { id: "im1", label: "Maison", y2025: 0, y2026: 0 },
    { id: "im2", label: "Villa", y2025: 0, y2026: 0 },
    { id: "im3", label: "Kiosque", y2025: 0, y2026: 0 },
    { id: "im4", label: "Boutique", y2025: 0, y2026: 0 },
    { id: "im5", label: "Fontaine", y2025: 0, y2026: 0 },
    { id: "im6", label: "Magasin", y2025: 0, y2026: 0 },
  ]);

  // VIII. Mosquées
  const [mosquesSitu, setMosquesSitu] = useState<MosqueSituationRow[]>([
    {
      id: "ms1",
      localite: "",
      daily2025: { dur: 0, semiDur: 0, banco: 0, tole: 0, tiges: 0 },
      friday2026: { dur: 0, semiDur: 0, banco: 0, tole: 0, tiges: 0 },
    },
  ]);

  // X. Makaranta
  const [makarantas, setMakarantas] = useState<MakarantaRow[]>([
    {
      id: "mk1",
      name: "",
      createdAt: "",
      agrement: "OUI",
      teachers: 0,
      classes: 0,
      nature: "",
      boys2026: 0,
      girls2026: 0,
      sabka2024G: 0,
      sabka2024F: 0,
      sabka2025G: 0,
      sabka2025F: 0,
      sabka2026G: 0,
      sabka2026F: 0,
    },
  ]);

  // VII. Finances
  const [finInterne, setFinInterne] = useState<YearRow[]>([
    { id: "fi1", label: "Cotisation", y2025: 0, y2026: 0 },
    { id: "fi2", label: "AGR", y2025: 0, y2026: 0 },
    { id: "fi3", label: "Activités agricoles", y2025: 0, y2026: 0 },
    { id: "fi4", label: "Collecte de peaux", y2025: 0, y2026: 0 },
  ]);

  const [finExterne, setFinExterne] = useState<YearRow[]>([
    { id: "fe1", label: "Quêtes", y2025: 0, y2026: 0 },
    { id: "fe2", label: "Zakat", y2025: 0, y2026: 0 },
    { id: "fe3", label: "Don", y2025: 0, y2026: 0 },
    { id: "fe4", label: "Subvention", y2025: 0, y2026: 0 },
  ]);

  const [depensesA, setDepensesA] = useState<YearRow[]>([
    { id: "da1", label: "Prêche (carburant, communiqués, invitations, restauration...)", y2025: 0, y2026: 0 },
    { id: "da2", label: "Mission / déplacement", y2025: 0, y2026: 0 },
    { id: "da3", label: "Aide sociale (malades, sinistrés, décès, don de sang...)", y2025: 0, y2026: 0 },
    { id: "da4", label: "Rémunération / gratification", y2025: 0, y2026: 0 },
    { id: "da5", label: "Appui aux oulémas et aux AGAJI", y2025: 0, y2026: 0 },
  ]);

  const [depensesB, setDepensesB] = useState<YearRow[]>([
    { id: "db1", label: "Fonctionnement (bureau, eau, électricité, téléphone, matériel...)", y2025: 0, y2026: 0 },
    { id: "db2", label: "Équipement / Infrastructures (mosquées, classes, forages, puits...)", y2025: 0, y2026: 0 },
    { id: "db3", label: "Organisation des réunions", y2025: 0, y2026: 0 },
  ]);

  // VIII & IX Partenariat & Bilan
  const [relAuthorities, setRelAuthorities] = useState("");
  const [relOng, setRelOng] = useState("");
  const [pointsForts, setPointsForts] = useState("");
  const [pointsAmeliorer, setPointsAmeliorer] = useState("");
  const [faitA, setFaitA] = useState("Maradi");

  const fetchServerFiches = useCallback(async () => {
    try {
      const res = await fetch("/api/bilan-2026");
      if (res.status === 401) {
        setRequiresLogin(true);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setRequiresLogin(false);
        setIsAdmin(Boolean(data.isAdmin));
        setAssignedVillage(data.village || null);
        setUserEmail(data.userEmail || null);
        if (!data.isAdmin && data.village) {
          setSectionName(data.village);
        }
        if (Array.isArray(data.fiches)) {
          setFichesList(data.fiches);
        }
      }
    } catch {
      // keep offline draft fallback
    }
  }, []);

  const [printOrientation, setPrintOrientation] = useState<
    "portrait" | "landscape"
  >("landscape");

  const handlePrintWithOrientation = (mode: "portrait" | "landscape") => {
    setPrintOrientation(mode);
    setTimeout(() => window.print(), 50);
  };

  // Load draft & server fiches (strictly isolated by user/role on server)
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    queueMicrotask(() => {
      void fetchServerFiches();
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.sectionName) setSectionName(parsed.sectionName);
        if (parsed.villages) setVillages(parsed.villages);
        if (parsed.reunions) setReunions(parsed.reunions);
        if (parsed.commissions) setCommissions(parsed.commissions);
        if (parsed.preachers) setPreachers(parsed.preachers);
        if (parsed.serieA) setSerieA(parsed.serieA);
        if (parsed.serieB) setSerieB(parsed.serieB);
        if (parsed.mobilier) setMobilier(parsed.mobilier);
        if (parsed.sonorisation) setSonorisation(parsed.sonorisation);
        if (parsed.electrique) setElectrique(parsed.electrique);
        if (parsed.bureauEquip) setBureauEquip(parsed.bureauEquip);
        if (parsed.rolling) setRolling(parsed.rolling);
        if (parsed.foncier) setFoncier(parsed.foncier);
        if (parsed.immobilier) setImmobilier(parsed.immobilier);
        if (parsed.mosquesSitu) setMosquesSitu(parsed.mosquesSitu);
        if (parsed.makarantas) setMakarantas(parsed.makarantas);
        if (parsed.finInterne) setFinInterne(parsed.finInterne);
        if (parsed.finExterne) setFinExterne(parsed.finExterne);
        if (parsed.depensesA) setDepensesA(parsed.depensesA);
        if (parsed.depensesB) setDepensesB(parsed.depensesB);
        if (parsed.relAuthorities) setRelAuthorities(parsed.relAuthorities);
        if (parsed.relOng) setRelOng(parsed.relOng);
        if (parsed.pointsForts) setPointsForts(parsed.pointsForts);
        if (parsed.pointsAmeliorer) setPointsAmeliorer(parsed.pointsAmeliorer);
        if (parsed.faitA) setFaitA(parsed.faitA);
      } catch {
        // ignore invalid storage
      }
    });
  }, []);

  const buildSnapshot = () => ({
    sectionName,
    villages,
    reunions,
    commissions,
    preachers,
    serieA,
    serieB,
    mobilier,
    sonorisation,
    electrique,
    bureauEquip,
    rolling,
    foncier,
    immobilier,
    mosquesSitu,
    makarantas,
    finInterne,
    finExterne,
    depensesA,
    depensesB,
    relAuthorities,
    relOng,
    pointsForts,
    pointsAmeliorer,
    faitA,
    updatedAt: new Date().toISOString(),
  });

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildSnapshot()));
    setSavedNotice(dict.savedToast);
    setTimeout(() => setSavedNotice(null), 2500);
  };

  const handleSubmitToList = async () => {
    const cleanName = sectionName.trim() || `Village / Section ${fichesList.length + 1}`;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/bilan-2026", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingFicheId,
          ...buildSnapshot(),
          sectionName: cleanName,
        }),
      });

      if (res.status === 401) {
        setRequiresLogin(true);
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (data?.id) setEditingFicheId(data.id);
        await fetchServerFiches();
        setSavedNotice(dict.submittedToast);
        setTimeout(() => setSavedNotice(null), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNewFiche = () => {
    setEditingFicheId(null);
    setSectionName("");
    setVillages([{ id: "v1", localite: "", dateSetup: "", members: 0, presidentContact: "" }]);
    setReunions(reunions.map((r) => ({ ...r, y2025: 0, y2026: 0 })));
    setCommissions(commissions.map((c) => ({ ...c, y2025: 0, y2026: 0 })));
    setPreachers(preachers.map((p) => ({ ...p, y2025: 0, y2026: 0 })));
    setSerieA(serieA.map((s) => ({ ...s, y2025: 0, y2026: 0 })));
    setSerieB(serieB.map((s) => ({ ...s, y2025: 0, y2026: 0 })));
    setFoncier(foncier.map((f) => ({ ...f, y2025: 0, y2026: 0 })));
    setImmobilier(immobilier.map((im) => ({ ...im, y2025: 0, y2026: 0 })));
    setMosquesSitu([
      {
        id: "ms1",
        localite: "",
        daily2025: { dur: 0, semiDur: 0, banco: 0, tole: 0, tiges: 0 },
        friday2026: { dur: 0, semiDur: 0, banco: 0, tole: 0, tiges: 0 },
      },
    ]);
    setMakarantas([
      {
        id: "mk1",
        name: "",
        createdAt: "",
        agrement: "OUI",
        teachers: 0,
        classes: 0,
        nature: "",
        boys2026: 0,
        girls2026: 0,
        sabka2024G: 0,
        sabka2024F: 0,
        sabka2025G: 0,
        sabka2025F: 0,
        sabka2026G: 0,
        sabka2026F: 0,
      },
    ]);
    setFinInterne(finInterne.map((f) => ({ ...f, y2025: 0, y2026: 0 })));
    setFinExterne(finExterne.map((f) => ({ ...f, y2025: 0, y2026: 0 })));
    setDepensesA(depensesA.map((d) => ({ ...d, y2025: 0, y2026: 0 })));
    setDepensesB(depensesB.map((d) => ({ ...d, y2025: 0, y2026: 0 })));
    setRelAuthorities("");
    setRelOng("");
    setPointsForts("");
    setPointsAmeliorer("");
    setActiveTab("structure");
    setViewMode("add");
  };

  const handleSaveAndNext = async () => {
    await handleSubmitToList();
    handleNewFiche();
  };

  const handleBatchCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const names = batchVillagesText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (names.length === 0) return;

    setIsBatchCreating(true);
    try {
      const baseSnap = buildSnapshot();
      for (const villageName of names) {
        await fetch("/api/bilan-2026", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...baseSnap,
            sectionName: villageName,
          }),
        });
      }
      await fetchServerFiches();
      setBatchVillagesText("");
      setIsBatchModalOpen(false);
      setSavedNotice(`${dict.submittedToast} (${names.length})`);
      setTimeout(() => setSavedNotice(null), 3000);
    } finally {
      setIsBatchCreating(false);
    }
  };

  const handleLoadFiche = (f: BilanFiche) => {
    setEditingFicheId(f.id);
    setSectionName(f.sectionName);
    setFaitA(f.faitA);
    setVillages(f.villages);
    setReunions(f.reunions);
    setCommissions(f.commissions);
    setPreachers(f.preachers);
    setSerieA(f.serieA);
    setSerieB(f.serieB);
    setMobilier(f.mobilier);
    setSonorisation(f.sonorisation);
    setElectrique(f.electrique);
    setBureauEquip(f.bureauEquip);
    setRolling(f.rolling);
    setFoncier(f.foncier);
    setImmobilier(f.immobilier);
    setMosquesSitu(f.mosquesSitu);
    setMakarantas(f.makarantas);
    setFinInterne(f.finInterne);
    setFinExterne(f.finExterne);
    setDepensesA(f.depensesA);
    setDepensesB(f.depensesB);
    setRelAuthorities(f.relAuthorities);
    setRelOng(f.relOng);
    setPointsForts(f.pointsForts);
    setPointsAmeliorer(f.pointsAmeliorer);
    setViewMode("add");
  };

  const handleDeleteFiche = async (id: string) => {
    try {
      const res = await fetch(`/api/bilan-2026?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchServerFiches();
        if (editingFicheId === id) setEditingFicheId(null);
      }
    } catch {
      // ignore
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "Section/Village",
      "Villages",
      "Reunions_2026",
      "Predicateurs_2026",
      "Mosquees_Vendredi_2026",
      "Eleves_Makaranta_2026",
      "Recettes_2026",
      "Depenses_2026",
    ];
    const lines = fichesList.map((f) => {
      const reun26 = f.reunions.reduce((a, r) => a + (Number(r.y2026) || 0), 0);
      const preach26 = f.preachers.reduce((a, r) => a + (Number(r.y2026) || 0), 0);
      const mosq26 = f.mosquesSitu.reduce(
        (a, m) =>
          a +
          m.friday2026.dur +
          m.friday2026.semiDur +
          m.friday2026.banco +
          m.friday2026.tole +
          m.friday2026.tiges,
        0
      );
      const studs26 = f.makarantas.reduce((a, mk) => a + mk.boys2026 + mk.girls2026, 0);
      const rec26 =
        f.finInterne.reduce((a, r) => a + (Number(r.y2026) || 0), 0) +
        f.finExterne.reduce((a, r) => a + (Number(r.y2026) || 0), 0);
      const dep26 =
        f.depensesA.reduce((a, r) => a + (Number(r.y2026) || 0), 0) +
        f.depensesB.reduce((a, r) => a + (Number(r.y2026) || 0), 0);
      return [
        `"${f.sectionName.replace(/"/g, '""')}"`,
        f.villages.length,
        reun26,
        preach26,
        mosq26,
        studs26,
        rec26,
        dep26,
      ].join(",");
    });
    const blob = new Blob([[headers.join(","), ...lines].join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ihyaous-sounnah-bilan-consolide-2026.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(buildSnapshot(), null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ihyaous-sounnah-bilan-2026-${sectionName || "csr"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const oulamaCount2026 = commissions.find((c) => c.id === "c1")?.y2026 || 0;
  const preachersTotal2026 = preachers.reduce((acc, p) => acc + (Number(p.y2026) || 0), 0);
  const totalRecettes2026 =
    finInterne.reduce((a, r) => a + (Number(r.y2026) || 0), 0) +
    finExterne.reduce((a, r) => a + (Number(r.y2026) || 0), 0);
  const totalDepenses2026 =
    depensesA.reduce((a, r) => a + (Number(r.y2026) || 0), 0) +
    depensesB.reduce((a, r) => a + (Number(r.y2026) || 0), 0);

  const tabsMeta: { id: TabId; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "structure", icon: Building2 },
    { id: "predication", icon: Mic2 },
    { id: "equipement", icon: Package },
    { id: "patrimoine", icon: Landmark },
    { id: "makaranta", icon: GraduationCap },
    { id: "finances", icon: Coins },
    { id: "bilan", icon: Handshake },
  ];

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 print:bg-transparent print:text-slate-900 p-4 sm:p-8 print:p-0 ${isRtl ? "rtl font-sans" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl print:max-w-none print:w-full mx-auto space-y-6 print:space-y-3">
        <PrintLetterhead
          title={dict.title}
          subtitle={dict.subtitle}
          village={sectionName || undefined}
          badge={dict.badge}
          locale={currentLocale}
          orientation={printOrientation}
        />

        {/* Official Header */}
        <div className="print:hidden bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/50">
                <ClipboardList className="w-7 h-7 text-slate-950 stroke-[2.4]" />
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold mb-1">
                  {dict.badge}
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white">{dict.title}</h1>
                <p className="text-xs text-slate-400 mt-0.5">{dict.subtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 print:hidden">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitToList}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSubmitting ? "..." : dict.submitToListBtn}</span>
              </button>
              {isAdmin && (
                <>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSaveAndNext}
                    className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 disabled:opacity-60 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{dict.saveAndNextBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsBatchModalOpen(true)}
                    className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{dict.batchAddBtn}</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{dict.saveBtn}</span>
              </button>
              <button
                type="button"
                onClick={handleExportJson}
                className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{dict.exportBtn}</span>
              </button>
              <PrintOrientationControls
                orientation={printOrientation}
                onPrint={handlePrintWithOrientation}
                locale={currentLocale}
              />
            </div>
          </div>

          {/* Role-Based Isolation Banner */}
          {requiresLogin ? (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  يجب تسجيل الدخول بحساب القرية أو المشرف لحفظ وعرض البيانات المعزولة بأمان.
                </span>
              </div>
              <Link
                href="/login"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-center shrink-0"
              >
                تسجيل الدخول / Connexion
              </Link>
            </div>
          ) : (
            <div
              className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between gap-2 ${isAdmin
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-slate-950 border-slate-800 text-slate-300"
                }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {isAdmin
                    ? `ADMIN — وضع المشرف العام: عرض مجمّع لجميع القرى (${fichesList.length})`
                    : `وضع القرية المعزول — تظهر بيانات قريتك فقط (${assignedVillage || userEmail || "Village"})`}
                </span>
              </div>
            </div>
          )}

          {/* Smart Dual Mode Switcher: Add vs Consolidated Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 print:hidden">
            <button
              type="button"
              onClick={() => setViewMode("add")}
              className={`py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${viewMode === "add"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
                }`}
            >
              <FilePlus2 className="w-4 h-4" />
              <span>{dict.modeAdd}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("display")}
              className={`py-2.5 px-4 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${viewMode === "display"
                ? "bg-teal-600 text-white shadow-md"
                : "text-slate-400 hover:text-white"
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>{dict.modeDisplay}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-950/60 text-emerald-300 font-mono">
                {fichesList.length}
              </span>
            </button>
          </div>

          {viewMode === "add" && (
            <div className="space-y-4 pt-3 border-t border-slate-800">
              {fichesList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-slate-400">
                    {dict.villagesBarLabel}
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={handleNewFiche}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${editingFicheId === null
                        ? "bg-emerald-600 text-white border-emerald-500"
                        : "bg-slate-950 text-emerald-400 border-slate-800 hover:border-emerald-500/40"
                        }`}
                    >
                      + {dict.newFicheBtn}
                    </button>
                  )}
                  {fichesList.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleLoadFiche(f)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition cursor-pointer ${editingFicheId === f.id
                        ? "bg-teal-600 text-white border-teal-500"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600"
                        }`}
                    >
                      {f.sectionName}
                    </button>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1">
                    {dict.sectionLabel}
                  </label>
                  <input
                    type="text"
                    value={sectionName}
                    readOnly={!isAdmin && Boolean(assignedVillage)}
                    onChange={(e) => setSectionName(e.target.value)}
                    placeholder={dict.sectionPlaceholder}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 read-only:opacity-80"
                  />
                </div>
                <div className="flex items-end">
                  <div className="w-full bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-xl px-4 py-2.5 text-xs font-bold">
                    {dict.deadlineNote}
                  </div>
                </div>
              </div>
            </div>
          )}

          {savedNotice && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{savedNotice}</span>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* DISPLAY MODE: Smart Consolidated Multi-Village Analytics       */}
        {/* ============================================================== */}
        {viewMode === "display" && (() => {
          const filteredFiches = fichesList.filter((f) =>
            f.sectionName.toLowerCase().includes(searchFiches.trim().toLowerCase())
          );

          const sumStudents = fichesList.reduce(
            (acc, f) => acc + f.makarantas.reduce((s, m) => s + m.boys2026 + m.girls2026, 0),
            0
          );
          const sumMosques = fichesList.reduce(
            (acc, f) =>
              acc +
              f.mosquesSitu.reduce(
                (s, m) =>
                  s +
                  m.friday2026.dur +
                  m.friday2026.semiDur +
                  m.friday2026.banco +
                  m.friday2026.tole +
                  m.friday2026.tiges,
                0
              ),
            0
          );
          const sumRecettes = fichesList.reduce(
            (acc, f) =>
              acc +
              f.finInterne.reduce((s, r) => s + (Number(r.y2026) || 0), 0) +
              f.finExterne.reduce((s, r) => s + (Number(r.y2026) || 0), 0),
            0
          );
          const sumDepenses = fichesList.reduce(
            (acc, f) =>
              acc +
              f.depensesA.reduce((s, r) => s + (Number(r.y2026) || 0), 0) +
              f.depensesB.reduce((s, r) => s + (Number(r.y2026) || 0), 0),
            0
          );

          const smartAlerts = fichesList.flatMap((f) => {
            const alerts: string[] = [];
            const oul = f.commissions.find((c) => c.id === "c1")?.y2026 || 0;
            const pr = f.preachers.reduce((a, p) => a + (Number(p.y2026) || 0), 0);
            if (oul !== pr) {
              alerts.push(`${f.sectionName}: Oulémas (${oul}) ≠ Prédicateurs (${pr})`);
            }
            const rec =
              f.finInterne.reduce((a, r) => a + (Number(r.y2026) || 0), 0) +
              f.finExterne.reduce((a, r) => a + (Number(r.y2026) || 0), 0);
            const dep =
              f.depensesA.reduce((a, r) => a + (Number(r.y2026) || 0), 0) +
              f.depensesB.reduce((a, r) => a + (Number(r.y2026) || 0), 0);
            if (dep > rec) {
              alerts.push(`${f.sectionName}: Dépenses (${dep}) > Recettes (${rec})`);
            }
            return alerts;
          });

          return (
            <div className="space-y-6">
              {/* Consolidated KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <span className="text-xs text-slate-400 block">{dict.totalFichesLabel}</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    {fichesList.length}
                  </span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <span className="text-xs text-slate-400 block">{dict.totalMosquesLabel}</span>
                  <span className="text-2xl font-black text-cyan-400 font-mono">{sumMosques}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <span className="text-xs text-slate-400 block">{dict.totalStudentsLabel}</span>
                  <span className="text-2xl font-black text-teal-400 font-mono">{sumStudents}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                  <span className="text-xs text-slate-400 block">{dict.soldeLabel}</span>
                  <span className="text-xl font-black text-white font-mono">
                    {(sumRecettes - sumDepenses).toLocaleString()} XOF
                  </span>
                </div>
              </div>

              {/* Smart Audit Alerts */}
              {smartAlerts.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                  <div className="text-xs font-black text-amber-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{dict.smartAlertsTitle} ({smartAlerts.length})</span>
                  </div>
                  <ul className="text-xs text-amber-200/90 space-y-1 list-disc list-inside">
                    {smartAlerts.map((al, i) => (
                      <li key={i}>{al}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Search & Consolidated Actions */}
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <h2 className="text-sm font-black text-white">{dict.consolidatedTitle}</h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute start-3 top-2.5" />
                      <input
                        type="text"
                        value={searchFiches}
                        onChange={(e) => setSearchFiches(e.target.value)}
                        placeholder={dict.searchFichesPlaceholder}
                        className="bg-slate-950 border border-slate-800 rounded-xl ps-9 pe-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleExportCsv}
                      disabled={fichesList.length === 0}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-emerald-400 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>{dict.exportCsvBtn}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleNewFiche}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{dict.newFicheBtn}</span>
                    </button>
                  </div>
                </div>

                {filteredFiches.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-400">{dict.noFichesYet}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
                          <th className="py-3 px-4 text-start">{dict.sectionLabel}</th>
                          <th className="py-3 px-3 text-center">Mosquées 2026</th>
                          <th className="py-3 px-3 text-center">Makaranta 2026</th>
                          <th className="py-3 px-3 text-center">Recettes 2026</th>
                          <th className="py-3 px-3 text-center">Dépenses 2026</th>
                          <th className="py-3 px-4 text-end">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {filteredFiches.map((f) => {
                          const mosq = f.mosquesSitu.reduce(
                            (a, m) =>
                              a +
                              m.friday2026.dur +
                              m.friday2026.semiDur +
                              m.friday2026.banco +
                              m.friday2026.tole +
                              m.friday2026.tiges,
                            0
                          );
                          const studs = f.makarantas.reduce(
                            (a, mk) => a + mk.boys2026 + mk.girls2026,
                            0
                          );
                          const rec =
                            f.finInterne.reduce((a, r) => a + (Number(r.y2026) || 0), 0) +
                            f.finExterne.reduce((a, r) => a + (Number(r.y2026) || 0), 0);
                          const dep =
                            f.depensesA.reduce((a, r) => a + (Number(r.y2026) || 0), 0) +
                            f.depensesB.reduce((a, r) => a + (Number(r.y2026) || 0), 0);
                          return (
                            <tr key={f.id} className="hover:bg-slate-800/40">
                              <td className="py-3 px-4 font-bold text-white">{f.sectionName}</td>
                              <td className="py-3 px-3 text-center font-mono text-cyan-400">
                                {mosq}
                              </td>
                              <td className="py-3 px-3 text-center font-mono text-teal-400">
                                {studs}
                              </td>
                              <td className="py-3 px-3 text-center font-mono text-emerald-400">
                                {rec.toLocaleString()}
                              </td>
                              <td className="py-3 px-3 text-center font-mono text-rose-400">
                                {dep.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-end">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleLoadFiche(f)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>{dict.editFiche}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteFiche(f.id)}
                                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-rose-400 font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    <span>{dict.deleteFiche}</span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* ADD MODE: 7-Section Structured Data Entry                      */}
        {/* ============================================================== */}
        {viewMode === "add" && (
          <>
            {/* Section Tabs */}
            <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800 overflow-x-auto print:hidden">
              {tabsMeta.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3.5 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition flex items-center gap-2 cursor-pointer ${active
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/50"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/70"
                      }`}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" />
                    <span>{dict.tabs[tab.id]}</span>
                  </button>
                );
              })}
            </div>

            {/* I. Structure */}
            {activeTab === "structure" && (
              <div className="space-y-6">
                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-400">
                      I.1 Bureaux des villages / مكاتب القرى
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setVillages([
                          ...villages,
                          {
                            id: `v-${Date.now()}`,
                            localite: "",
                            dateSetup: "",
                            members: 0,
                            presidentContact: "",
                          },
                        ])
                      }
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> {dict.addRow}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
                          <th className="py-2.5 px-3 text-start w-10">#</th>
                          <th className="py-2.5 px-3 text-start">Localité</th>
                          <th className="py-2.5 px-3 text-start">Date mise en place</th>
                          <th className="py-2.5 px-3 text-center w-28">Membres</th>
                          <th className="py-2.5 px-3 text-start">Nom du président + contact</th>
                          <th className="py-2.5 px-3 w-10" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {villages.map((v, idx) => (
                          <tr key={v.id}>
                            <td className="py-2 px-3 text-slate-500 font-mono">{idx + 1}</td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={v.localite}
                                onChange={(e) =>
                                  setVillages(
                                    villages.map((x) =>
                                      x.id === v.id ? { ...x, localite: e.target.value } : x
                                    )
                                  )
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="date"
                                value={v.dateSetup}
                                onChange={(e) =>
                                  setVillages(
                                    villages.map((x) =>
                                      x.id === v.id ? { ...x, dateSetup: e.target.value } : x
                                    )
                                  )
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="number"
                                min={0}
                                value={v.members}
                                onChange={(e) =>
                                  setVillages(
                                    villages.map((x) =>
                                      x.id === v.id
                                        ? { ...x, members: Number(e.target.value) || 0 }
                                        : x
                                    )
                                  )
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-center text-white font-mono"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={v.presidentContact}
                                onChange={(e) =>
                                  setVillages(
                                    villages.map((x) =>
                                      x.id === v.id ? { ...x, presidentContact: e.target.value } : x
                                    )
                                  )
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                              />
                            </td>
                            <td className="py-2 px-3">
                              {villages.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => setVillages(villages.filter((x) => x.id !== v.id))}
                                  className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <YearComparisonTable
                  title="I.2 Réunions (Ordinaires & Extraordinaires)"
                  rows={reunions}
                  onChange={setReunions}
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />

                <YearComparisonTable
                  title="I.3 Situation des commissions spécifiques"
                  rows={commissions}
                  onChange={setCommissions}
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
              </div>
            )}

            {/* II. Prédication */}
            {activeTab === "predication" && (
              <div className="space-y-6">
                <div
                  className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2 ${preachersTotal2026 === oulamaCount2026
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-300"
                    }`}
                >
                  {preachersTotal2026 === oulamaCount2026 ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                  )}
                  <span>
                    {preachersTotal2026 === oulamaCount2026 ? dict.oulamaMatch : dict.oulamaMismatch} (
                    {preachersTotal2026} / {oulamaCount2026})
                  </span>
                </div>

                <YearComparisonTable
                  title="II.1 Situation des prédicateurs"
                  rows={preachers}
                  onChange={setPreachers}
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
                <YearComparisonTable
                  title="II.2 Activités de prêches : Série A"
                  rows={serieA}
                  onChange={setSerieA}
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
                <YearComparisonTable
                  title="II.3 Activités de prêches : Série B"
                  rows={serieB}
                  onChange={setSerieB}
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
              </div>
            )}

            {/* III-V. Équipements & Matériel roulant */}
            {activeTab === "equipement" && (
              <div className="space-y-6">
                <YearComparisonTable
                  title="III.1 Mobilier"
                  rows={mobilier}
                  onChange={setMobilier}
                  showEtat
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
                <YearComparisonTable
                  title="III.2 Matériel de sonorisation"
                  rows={sonorisation}
                  onChange={setSonorisation}
                  showEtat
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
                <YearComparisonTable
                  title="III.3 Matériel électrique"
                  rows={electrique}
                  onChange={setElectrique}
                  showEtat
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
                <YearComparisonTable
                  title="IX. Matériel de bureau"
                  rows={bureauEquip}
                  onChange={setBureauEquip}
                  showEtat
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />

                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 font-bold text-sm text-emerald-400">
                    V. Situation du matériel roulant
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
                          <th className="py-2.5 px-3 text-start">#</th>
                          <th className="py-2.5 px-3 text-start">Désignation</th>
                          <th className="py-2.5 px-3 text-start">Marque</th>
                          <th className="py-2.5 px-3 text-start">État</th>
                          <th className="py-2.5 px-3 text-start">Date d&apos;acquisition</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {rolling.map((r, idx) => (
                          <tr key={r.id}>
                            <td className="py-2 px-3 text-slate-500 font-mono">{idx + 1}</td>
                            <td className="py-2 px-3 font-medium text-white">{r.designation}</td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={r.marque}
                                onChange={(e) =>
                                  setRolling(
                                    rolling.map((x) =>
                                      x.id === r.id ? { ...x, marque: e.target.value } : x
                                    )
                                  )
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="text"
                                value={r.etat}
                                onChange={(e) =>
                                  setRolling(
                                    rolling.map((x) =>
                                      x.id === r.id ? { ...x, etat: e.target.value } : x
                                    )
                                  )
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white"
                              />
                            </td>
                            <td className="py-2 px-3">
                              <input
                                type="date"
                                value={r.dateAcq}
                                onChange={(e) =>
                                  setRolling(
                                    rolling.map((x) =>
                                      x.id === r.id ? { ...x, dateAcq: e.target.value } : x
                                    )
                                  )
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-white"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* VI-VIII. Foncier, Immobilier & Mosquées */}
            {activeTab === "patrimoine" && (
              <div className="space-y-6">
                <YearComparisonTable
                  title="VI. Propriété foncière"
                  rows={foncier}
                  onChange={setFoncier}
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
                <YearComparisonTable
                  title="VII. Propriété immobilière"
                  rows={immobilier}
                  onChange={setImmobilier}
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />

                <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
                  <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-sm text-emerald-400">
                      VIII. Situation des mosquées (2025 vs 2026)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setMosquesSitu([
                          ...mosquesSitu,
                          {
                            id: `ms-${Date.now()}`,
                            localite: "",
                            daily2025: { dur: 0, semiDur: 0, banco: 0, tole: 0, tiges: 0 },
                            friday2026: { dur: 0, semiDur: 0, banco: 0, tole: 0, tiges: 0 },
                          },
                        ])
                      }
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> {dict.addRow}
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
                          <th className="py-2 px-2 text-start">Localité</th>
                          <th className="py-2 px-1 text-center">2025 Dur</th>
                          <th className="py-2 px-1 text-center">2025 Semi</th>
                          <th className="py-2 px-1 text-center">2025 Banco</th>
                          <th className="py-2 px-1 text-center">2025 Tôle</th>
                          <th className="py-2 px-1 text-center">2025 Tiges</th>
                          <th className="py-2 px-1 text-center text-emerald-400">2026 Dur</th>
                          <th className="py-2 px-1 text-center text-emerald-400">2026 Semi</th>
                          <th className="py-2 px-1 text-center text-emerald-400">2026 Banco</th>
                          <th className="py-2 px-1 text-center text-emerald-400">2026 Tôle</th>
                          <th className="py-2 px-1 text-center text-emerald-400">2026 Tiges</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {mosquesSitu.map((ms) => (
                          <tr key={ms.id}>
                            <td className="py-2 px-2 min-w-[140px]">
                              <input
                                type="text"
                                value={ms.localite}
                                onChange={(e) =>
                                  setMosquesSitu(
                                    mosquesSitu.map((x) =>
                                      x.id === ms.id ? { ...x, localite: e.target.value } : x
                                    )
                                  )
                                }
                                className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white"
                              />
                            </td>
                            {(["dur", "semiDur", "banco", "tole", "tiges"] as const).map((k) => (
                              <td key={`d-${k}`} className="py-2 px-1">
                                <input
                                  type="number"
                                  min={0}
                                  value={ms.daily2025[k]}
                                  onChange={(e) =>
                                    setMosquesSitu(
                                      mosquesSitu.map((x) =>
                                        x.id === ms.id
                                          ? {
                                            ...x,
                                            daily2025: {
                                              ...x.daily2025,
                                              [k]: Number(e.target.value) || 0,
                                            },
                                          }
                                          : x
                                      )
                                    )
                                  }
                                  className="w-14 bg-slate-950 border border-slate-800 rounded px-1 py-1 text-center text-white font-mono"
                                />
                              </td>
                            ))}
                            {(["dur", "semiDur", "banco", "tole", "tiges"] as const).map((k) => (
                              <td key={`f-${k}`} className="py-2 px-1">
                                <input
                                  type="number"
                                  min={0}
                                  value={ms.friday2026[k]}
                                  onChange={(e) =>
                                    setMosquesSitu(
                                      mosquesSitu.map((x) =>
                                        x.id === ms.id
                                          ? {
                                            ...x,
                                            friday2026: {
                                              ...x.friday2026,
                                              [k]: Number(e.target.value) || 0,
                                            },
                                          }
                                          : x
                                      )
                                    )
                                  }
                                  className="w-14 bg-slate-950 border border-slate-800 rounded px-1 py-1 text-center text-white font-mono"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* X. Makaranta */}
            {activeTab === "makaranta" && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-400">
                    X. Situation des écoles : Makaranta (Identification, Effectifs & Sabka)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setMakarantas([
                        ...makarantas,
                        {
                          id: `mk-${Date.now()}`,
                          name: "",
                          createdAt: "",
                          agrement: "OUI",
                          teachers: 0,
                          classes: 0,
                          nature: "",
                          boys2026: 0,
                          girls2026: 0,
                          sabka2024G: 0,
                          sabka2024F: 0,
                          sabka2025G: 0,
                          sabka2025F: 0,
                          sabka2026G: 0,
                          sabka2026F: 0,
                        },
                      ])
                    }
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> {dict.addRow}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
                        <th className="py-2 px-2 text-start">Dénomination</th>
                        <th className="py-2 px-2 text-center">Agrément</th>
                        <th className="py-2 px-2 text-center">Enseignants</th>
                        <th className="py-2 px-2 text-center">Classes</th>
                        <th className="py-2 px-2 text-center">Garçons 2026</th>
                        <th className="py-2 px-2 text-center">Filles 2026</th>
                        <th className="py-2 px-2 text-center text-emerald-400">Ensemble</th>
                        <th className="py-2 px-2 text-center">Sabka 2026 (G+F)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {makarantas.map((mk) => (
                        <tr key={mk.id}>
                          <td className="py-2 px-2 min-w-[160px]">
                            <input
                              type="text"
                              value={mk.name}
                              onChange={(e) =>
                                setMakarantas(
                                  makarantas.map((x) =>
                                    x.id === mk.id ? { ...x, name: e.target.value } : x
                                  )
                                )
                              }
                              placeholder="Nom Makaranta..."
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <select
                              value={mk.agrement}
                              onChange={(e) =>
                                setMakarantas(
                                  makarantas.map((x) =>
                                    x.id === mk.id
                                      ? { ...x, agrement: e.target.value as "OUI" | "NON" }
                                      : x
                                  )
                                )
                              }
                              className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white"
                            >
                              <option value="OUI">OUI</option>
                              <option value="NON">NON</option>
                            </select>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min={0}
                              value={mk.teachers}
                              onChange={(e) =>
                                setMakarantas(
                                  makarantas.map((x) =>
                                    x.id === mk.id
                                      ? { ...x, teachers: Number(e.target.value) || 0 }
                                      : x
                                  )
                                )
                              }
                              className="w-16 bg-slate-950 border border-slate-800 rounded px-1 py-1 text-center text-white font-mono"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min={0}
                              value={mk.classes}
                              onChange={(e) =>
                                setMakarantas(
                                  makarantas.map((x) =>
                                    x.id === mk.id
                                      ? { ...x, classes: Number(e.target.value) || 0 }
                                      : x
                                  )
                                )
                              }
                              className="w-16 bg-slate-950 border border-slate-800 rounded px-1 py-1 text-center text-white font-mono"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min={0}
                              value={mk.boys2026}
                              onChange={(e) =>
                                setMakarantas(
                                  makarantas.map((x) =>
                                    x.id === mk.id
                                      ? { ...x, boys2026: Number(e.target.value) || 0 }
                                      : x
                                  )
                                )
                              }
                              className="w-16 bg-slate-950 border border-slate-800 rounded px-1 py-1 text-center text-white font-mono"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min={0}
                              value={mk.girls2026}
                              onChange={(e) =>
                                setMakarantas(
                                  makarantas.map((x) =>
                                    x.id === mk.id
                                      ? { ...x, girls2026: Number(e.target.value) || 0 }
                                      : x
                                  )
                                )
                              }
                              className="w-16 bg-slate-950 border border-slate-800 rounded px-1 py-1 text-center text-white font-mono"
                            />
                          </td>
                          <td className="py-2 px-2 text-center font-mono font-bold text-emerald-400">
                            {mk.boys2026 + mk.girls2026}
                          </td>
                          <td className="py-2 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                min={0}
                                value={mk.sabka2026G}
                                onChange={(e) =>
                                  setMakarantas(
                                    makarantas.map((x) =>
                                      x.id === mk.id
                                        ? { ...x, sabka2026G: Number(e.target.value) || 0 }
                                        : x
                                    )
                                  )
                                }
                                className="w-12 bg-slate-950 border border-slate-800 rounded px-1 py-1 text-center text-white font-mono"
                              />
                              <input
                                type="number"
                                min={0}
                                value={mk.sabka2026F}
                                onChange={(e) =>
                                  setMakarantas(
                                    makarantas.map((x) =>
                                      x.id === mk.id
                                        ? { ...x, sabka2026F: Number(e.target.value) || 0 }
                                        : x
                                    )
                                  )
                                }
                                className="w-12 bg-slate-950 border border-slate-800 rounded px-1 py-1 text-center text-white font-mono"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VII. Finances */}
            {activeTab === "finances" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <span className="text-xs text-slate-400 block">{dict.recettesLabel}</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      {totalRecettes2026.toLocaleString()} XOF
                    </span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <span className="text-xs text-slate-400 block">{dict.depensesLabel}</span>
                    <span className="text-xl font-black text-rose-400 font-mono">
                      {totalDepenses2026.toLocaleString()} XOF
                    </span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
                    <span className="text-xs text-slate-400 block">{dict.soldeLabel}</span>
                    <span className="text-xl font-black text-white font-mono">
                      {(totalRecettes2026 - totalDepenses2026).toLocaleString()} XOF
                    </span>
                  </div>
                </div>

                <YearComparisonTable
                  title="VII.1 Source de financement : effort interne"
                  rows={finInterne}
                  onChange={setFinInterne}
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
                <YearComparisonTable
                  title="VII.2 Source de financement : apport externe"
                  rows={finExterne}
                  onChange={setFinExterne}
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
                <YearComparisonTable
                  title="VII.3 Dépenses : Type A"
                  rows={depensesA}
                  onChange={setDepensesA}
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
                <YearComparisonTable
                  title="VII.4 Dépenses : Type B"
                  rows={depensesB}
                  onChange={setDepensesB}
                  diffLabel={dict.diff}
                  totalLabel={dict.total}
                />
              </div>
            )}

            {/* VIII-IX. Partenariat & Bilan */}
            {activeTab === "bilan" && (
              <div className="bg-slate-900/70 border border-slate-800 rounded-3xl p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1.5">
                    VIII.1 Relation avec les autorités administratives et coutumières
                  </label>
                  <textarea
                    rows={3}
                    value={relAuthorities}
                    onChange={(e) => setRelAuthorities(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1.5">
                    VIII.2 Relation avec les associations et ONG
                  </label>
                  <textarea
                    rows={3}
                    value={relOng}
                    onChange={(e) => setRelOng(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-teal-400 mb-1.5">
                      IX. Points forts de la gestion 2026
                    </label>
                    <textarea
                      rows={4}
                      value={pointsForts}
                      onChange={(e) => setPointsForts(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-400 mb-1.5">
                      Points à améliorer (difficultés rencontrées)
                    </label>
                    <textarea
                      rows={4}
                      value={pointsAmeliorer}
                      onChange={(e) => setPointsAmeliorer(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Fait à :</span>
                    <input
                      type="text"
                      value={faitA}
                      onChange={(e) => setFaitA(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <span className="text-slate-400 font-bold">Le Président (signature et cachet)</span>
                </div>
              </div>
            )}
          </>
        )}

        <PrintSignatureFooter locale={currentLocale} />
      </div>

      {/* Batch Multi-Village Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{dict.batchTitle}</span>
            </h3>
            <p className="text-xs text-slate-400">{dict.batchDesc}</p>
            <form onSubmit={handleBatchCreate} className="space-y-4">
              <textarea
                rows={6}
                required
                value={batchVillagesText}
                onChange={(e) => setBatchVillagesText(e.target.value)}
                placeholder={dict.batchPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  {dict.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isBatchCreating}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold cursor-pointer"
                >
                  {isBatchCreating ? "..." : dict.batchCreateBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
