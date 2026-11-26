"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Phone,
  ShieldCheck,
  Plus,
  Printer,
  Download,
  Award,
  X,
  MapPin,
  Sparkles,
  Trash2,
  Edit3,
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { Locale } from "@/lib/i18n";
import {
  PrintLetterhead,
  PrintSignatureFooter,
  PrintOrientationControls,
} from "@/components/PrintLetterhead";

interface CommissionMember {
  num: string;
  fonction: string;
  name: string;
  contact: string;
  address?: string;
  email?: string;
  nationalId?: string;
  notes?: string;
}

interface Commission {
  id: string;
  title: string;
  shortTitle: string;
  badgeColor: string;
  members: CommissionMember[];
}

interface VillageDirectory {
  id: string;
  villageName: string;
  commissions: Commission[];
}

function createEmptyVillageCommissions(villageName: string): Commission[] {
  return [
    { id: "restauration", title: `COMMISSION RESTAURATION 2026 — ${villageName}`, shortTitle: "Restauration", badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30", members: [] },
    { id: "waqf", title: `COMMISSION INFRASTRUCTURES & WAQF 2026 — ${villageName}`, shortTitle: "Infrastructures & Waqf", badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30", members: [] },
    { id: "communication", title: `COMMISSION COMMUNICATION 2026 — ${villageName}`, shortTitle: "Communication", badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30", members: [] },
    { id: "ressources", title: `COMMISSION MOBILISATION DES RESSOURCES 2026 — ${villageName}`, shortTitle: "Ressources", badgeColor: "text-teal-400 bg-teal-500/10 border-teal-500/30", members: [] },
    { id: "hebergement", title: `COMMISSION HEBERGEMENT 2026 — ${villageName}`, shortTitle: "Hébergement", badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/30", members: [] },
    { id: "oulemas", title: `CONSEIL DES OULEMAS 2026 — ${villageName}`, shortTitle: "Conseil Oulémas", badgeColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30", members: [] },
    { id: "agaji", title: `REGIE DES AGAJIS (RRA) 2026 — ${villageName}`, shortTitle: "AGAJI (RRA)", badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/30", members: [] },
  ];
}

const INITIAL_COMMISSIONS: Commission[] = [
  {
    id: "restauration",
    title: "COMMISSION RESTAURATION 2026",
    shortTitle: "Restauration",
    badgeColor: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    members: [
      { num: "01", fonction: "Président", name: "Elhadji Idrissa Haladou", contact: "96 97 06 20" },
      { num: "02", fonction: "Vice Président", name: "Elhadji Tsahirou Daouda", contact: "96 29 95 72" },
      { num: "03", fonction: "Secrétaire général", name: "Maman Mansour", contact: "96 10 33 54" },
      { num: "04", fonction: "Secrétaire général adjoint", name: "Sani Ali", contact: "81 69 96 14" },
      { num: "05", fonction: "Membre", name: "Elhadji Boukari Ibrahim Bara", contact: "" },
      { num: "06", fonction: "Membre", name: "Elhadji Yaou Na Yaou", contact: "96 98 52 92" },
      { num: "07", fonction: "Membre", name: "Chapii Hachimou", contact: "94 45 71 94" },
      { num: "08", fonction: "Membre", name: "Tidjani Zakiya", contact: "97 07 09 50" },
      { num: "09", fonction: "Membre", name: "Boukari Dan Barno", contact: "" },
      { num: "10", fonction: "Membre", name: "Chaibou Djibo", contact: "96 98 77 28" },
      { num: "11", fonction: "Membre", name: "Halilou Dan Gambo", contact: "96 87 50 43" },
      { num: "12", fonction: "Membre", name: "Tassiou Youssoufa", contact: "96 97 26 77" },
      { num: "13", fonction: "Membre", name: "Elhadji Aboubacar Mai Taki", contact: "96 98 91 37" },
      { num: "14", fonction: "Membre", name: "Ado Souley", contact: "94 22 60 33" },
      { num: "15", fonction: "Membre", name: "Moussa Harouna", contact: "91 39 79 33" },
      { num: "16", fonction: "Membre", name: "Mourtala Youssoufa", contact: "96 13 78 38" },
      { num: "17", fonction: "Membre", name: "Tsayabou Salifou", contact: "74 66 75 25" },
      { num: "18", fonction: "Membre", name: "Sani Ibrahim", contact: "" },
      { num: "19", fonction: "Membre", name: "Dodo Pampo Bello", contact: "97 79 74 10" },
      { num: "20", fonction: "Membre", name: "Moussa Ado", contact: "91 53 04 24" },
      { num: "21", fonction: "Membre", name: "Mamane Abdou", contact: "96 87 85 23" },
      { num: "22", fonction: "Membre", name: "Sabiou Sani", contact: "92 47 30 03" },
      { num: "23", fonction: "Membre", name: "Inoussa Mai Wanki", contact: "99 44 97 46" },
      { num: "24", fonction: "Membre", name: "Elhadji Aboubacar Mai Ragouna", contact: "96 87 78 91" },
    ],
  },
  {
    id: "waqf",
    title: "COMMISSION EQUIPEMENT, INFRASTRUCTURES ET PROMOTION DE WAQF 2026",
    shortTitle: "Infrastructures & Waqf",
    badgeColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    members: [
      { num: "01", fonction: "Président", name: "Elh Tassiou Oumarou Komma", contact: "96 97 56 58" },
      { num: "02", fonction: "Vice-Président", name: "Elhadji Yaou Na Yaou", contact: "96 98 52 92" },
      { num: "03", fonction: "Secrétaire", name: "Elhadji Rabiou Yar Kassou", contact: "96 58 13 57" },
      { num: "04", fonction: "Caissier", name: "Elhadji Hamissou Mai-Magani", contact: "96 88 77 38" },
      { num: "05", fonction: "Membre", name: "Elhadji Hamza Gonda", contact: "96 97 30 02" },
      { num: "06", fonction: "Membre", name: "Hakilou Hamissou", contact: "96 89 82 28" },
      { num: "07", fonction: "Membre", name: "Aminou Saadou", contact: "96 47 25 70" },
      { num: "08", fonction: "Membre", name: "Larwanou Iro", contact: "96 27 72 62" },
      { num: "09", fonction: "Membre", name: "Aboubacar Saadou (Ingénieur)", contact: "96 28 66 78" },
      { num: "10", fonction: "Membre", name: "Oumarou Malan Idi", contact: "96 66 27 28" },
      { num: "11", fonction: "Membre", name: "Mourtala Sabiou", contact: "96 89 36 99" },
      { num: "12", fonction: "Membre", name: "Montaka Sani", contact: "" },
    ],
  },
  {
    id: "communication",
    title: "COMMISSION COMMUNICATION 2026",
    shortTitle: "Communication",
    badgeColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    members: [
      { num: "01", fonction: "Président", name: "Elhadji Habibou Saâdou", contact: "96 89 53 83" },
      { num: "02", fonction: "Vice-Président", name: "Mahamadou Ibrahim", contact: "94 24 12 07" },
      { num: "03", fonction: "Secrétaire", name: "Mamane Abdou", contact: "96 40 95 72" },
      { num: "04", fonction: "Membre", name: "Mamane Saidou", contact: "96 99 06 44" },
      { num: "05", fonction: "Membre", name: "Moutari Kalla", contact: "96 98 88 34" },
      { num: "06", fonction: "Membre", name: "Ibrahim Idi", contact: "96 43 17 40" },
      { num: "07", fonction: "Membre", name: "Saadou Souley", contact: "96 99 59 86" },
      { num: "08", fonction: "Membre", name: "Garba Salaou", contact: "96 27 09 10" },
      { num: "09", fonction: "Membre", name: "Elhadji Roufai", contact: "96 10 34 43" },
      { num: "10", fonction: "Membre", name: "Hamissou Adamou", contact: "96 87 40 90" },
      { num: "11", fonction: "Membre", name: "Abass Rabiou", contact: "96 97 14 97" },
    ],
  },
  {
    id: "ressources",
    title: "COMMISSION MOBILISATION DES RESSOURCES 2026",
    shortTitle: "Ressources",
    badgeColor: "text-teal-400 bg-teal-500/10 border-teal-500/30",
    members: [
      { num: "01", fonction: "Président", name: "Elhadji Saadou Dan Bago", contact: "96 88 11 70" },
      { num: "02", fonction: "Vice-Président", name: "Elh Hadi Tanimoune", contact: "" },
      { num: "03", fonction: "Secrétaire", name: "Elhadji Habibou Habou", contact: "96 08 88 67" },
      { num: "04", fonction: "Membre", name: "Maarou Sama", contact: "" },
      { num: "05", fonction: "Membre", name: "Elhadji Aboubacar Mai Taki", contact: "" },
      { num: "06", fonction: "Membre", name: "Elhadji Adamou Sai Ahankali", contact: "" },
      { num: "07", fonction: "Membre", name: "Elhadji Habibou Issa Dit Chougaba", contact: "" },
      { num: "08", fonction: "Membre", name: "Elhadji Halilou Oumarou Komma", contact: "" },
    ],
  },
  {
    id: "hebergement",
    title: "COMMISSION HEBERGEMENT 2026",
    shortTitle: "Hébergement",
    badgeColor: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    members: [
      { num: "01", fonction: "Président", name: "Elhadji Salissou Mai SG", contact: "96 97 92 32" },
      { num: "02", fonction: "Vice-Président", name: "Elhadji Hamissou Souley", contact: "94 67 59 19" },
      { num: "03", fonction: "Secrétaire", name: "Mamane Mato", contact: "96 40 96 58" },
      { num: "04", fonction: "Membre", name: "Elh Ousseini", contact: "" },
      { num: "05", fonction: "Membre", name: "Mal Lawi", contact: "" },
      { num: "06", fonction: "Membre", name: "Ousmane Kalgon Beta", contact: "96 55 43 32" },
      { num: "07", fonction: "Membre", name: "Elhadji Laoui", contact: "" },
      { num: "08", fonction: "Membre", name: "Hamissou Idi", contact: "" },
      { num: "09", fonction: "Membre", name: "Mamane Hadi Laouali", contact: "" },
      { num: "10", fonction: "Membre", name: "Elhadji Bassirou Souley", contact: "" },
      { num: "11", fonction: "Membre", name: "Mahamane Sani Tanko", contact: "" },
      { num: "12", fonction: "Membre", name: "Samaila Yacouba", contact: "" },
      { num: "13", fonction: "Membre", name: "Rabé Ousmane", contact: "" },
      { num: "14", fonction: "Membre", name: "Mahamane Sani Balla", contact: "" },
      { num: "15", fonction: "Membre", name: "Saadou Salaou", contact: "" },
      { num: "16", fonction: "Membre", name: "Mahamane Djamilou", contact: "" },
      { num: "17", fonction: "Membre", name: "Djamilou Hamidou", contact: "" },
      { num: "18", fonction: "Membre", name: "Ibrahim Aboubacar", contact: "" },
      { num: "19", fonction: "Membre", name: "Mahamane Sani Daouda", contact: "" },
      { num: "20", fonction: "Membre", name: "Issaka Dan Narba", contact: "" },
      { num: "21", fonction: "Membre", name: "Sani Issa", contact: "" },
      { num: "22", fonction: "Membre", name: "Salaou Issa", contact: "" },
      { num: "23", fonction: "Membre", name: "Tassiou Ibrahim", contact: "" },
      { num: "24", fonction: "Membre", name: "Ousmane Kataré", contact: "" },
    ],
  },
  {
    id: "oulemas",
    title: "CONSEIL REGIONAL DES OULEMAS 2026",
    shortTitle: "Conseil Oulémas",
    badgeColor: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    members: [
      { num: "01", fonction: "Président", name: "Malam Khalid Habibu", contact: "96 59 10 49" },
      { num: "02", fonction: "Vice-président", name: "Malam Hamza Lawali", contact: "96 05 19 56" },
      { num: "03", fonction: "Secrétaire", name: "—", contact: "" },
      { num: "04", fonction: "Secrétaire financier", name: "Malam Salisu Sani", contact: "98 87 01 22" },
      { num: "05", fonction: "Membre", name: "Malam Lawali Alhasan Kurte", contact: "96 25 67 13" },
      { num: "06", fonction: "Membre", name: "Malam Abubakar Ibrahim", contact: "96 97 99 62" },
      { num: "07", fonction: "Membre", name: "Malam Rabiu Abubakar", contact: "96 50 85 53" },
      { num: "08", fonction: "Membre", name: "Malam Isa Muhammad", contact: "96 66 10 37" },
      { num: "09", fonction: "Membre", name: "Malam Habibu Yahya", contact: "96 32 83 15" },
      { num: "10", fonction: "Membre", name: "Malam Musa Ousman", contact: "96 69 11 08" },
      { num: "11", fonction: "Membre", name: "Malam Oumar Muhammad", contact: "94 91 85 44" },
      { num: "12", fonction: "Membre", name: "Malam Mansir Huzaifa", contact: "96 26 47 01" },
      { num: "13", fonction: "Membre", name: "Malam Zabairu Ahmad", contact: "95 75 58 20" },
      { num: "14", fonction: "Membre", name: "Malam Isa Ahmad", contact: "95 51 95 82" },
      { num: "15", fonction: "Membre", name: "Malam Mahammad Lawali Abubakar", contact: "96 06 92 66" },
      { num: "16", fonction: "Membre", name: "Malam Tayyabu Ammani", contact: "96 47 74 86" },
      { num: "17", fonction: "Membre", name: "Alaramma Kabiru Yusufa", contact: "96 98 91 69" },
      { num: "18", fonction: "Membre", name: "Alaramma Aliyyu Habibu", contact: "96 19 35 49" },
      { num: "19", fonction: "Membre", name: "Alaramma Mourtala Habibu", contact: "95 80 59 74" },
      { num: "20", fonction: "Membre", name: "Alaramma Mustafa Rabiu", contact: "94 99 69 87" },
      { num: "21", fonction: "Membre", name: "Alaramma Izzuddini", contact: "94 23 70 38" },
    ],
  },
  {
    id: "agaji",
    title: "REGIE REGIONALE DES AGAJIS (RRA) 2026",
    shortTitle: "AGAJI (RRA)",
    badgeColor: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    members: [
      { num: "01", fonction: "Président", name: "Souleymane Hachimou", contact: "96 56 57 68" },
      { num: "02", fonction: "1er vice-président", name: "Noura Sani", contact: "99 37 11 11" },
      { num: "03", fonction: "2ème vice-président", name: "Chaibou Salihou", contact: "96 27 77 42" },
      { num: "04", fonction: "Secrétaire général", name: "Issaka Ousmane", contact: "91 78 97 79" },
      { num: "05", fonction: "Secrétaire général 1er Adjoint", name: "Rabiou Mantaou", contact: "97 63 77 92" },
      { num: "06", fonction: "Secrétaire général 2ème Adjoint", name: "Ismaila Hachimou", contact: "80 27 25 67" },
      { num: "07", fonction: "Secrétaire Financier", name: "Abousoufianou Ibrahim", contact: "96 89 27 28" },
      { num: "08", fonction: "Secrétaire Financier Adjoint", name: "Hamza Halilou", contact: "94 40 17 32" },
      { num: "09", fonction: "Commandant des ordres des Agaji", name: "Sani Garba", contact: "94 66 16 35" },
      { num: "10", fonction: "Commandant des ordres 1er Adjoint", name: "Idrissa Saley", contact: "99 34 81 81" },
      { num: "11", fonction: "Commandant des ordres 2ème Adjoint", name: "Zakaria A. Maman", contact: "96 18 99 54" },
      { num: "12", fonction: "Secrétaire à l'éducation et Formation", name: "Achirou Salifou", contact: "98 22 40 42" },
      { num: "13", fonction: "Secrétaire à l'éducation Adjoint", name: "Rabiou Abdoul Karim", contact: "96 70 22 34" },
      { num: "14", fonction: "Secrétaire ordre et discipline", name: "Ismaila Souleymane", contact: "94 08 13 94" },
      { num: "15", fonction: "Secrétaire ordre et discipline Adjoint", name: "Moustapha Aboubacar", contact: "96 70 85 37" },
      { num: "16", fonction: "Secrétaire affaires sociales & solidarité", name: "Tassiou Issa", contact: "96 90 98 12" },
      { num: "17", fonction: "Secrétaire affaires sociales (Adjoint)", name: "Saâdou Salaou", contact: "" },
      { num: "18", fonction: "Secrétaire à la communication", name: "Moussa Konaté", contact: "98 02 83 83" },
      { num: "19", fonction: "Secrétaire communication Adjoint", name: "Hamissou Sani", contact: "96 70 21 24" },
      { num: "20", fonction: "Secrétaire gestion du Patrimoine", name: "Rabilou Mamane", contact: "95 33 02 07" },
      { num: "21", fonction: "Secrétaire gestion Patrimoine Adjoint", name: "Sabiou Abdoulaye", contact: "91 86 86 30" },
      { num: "22", fonction: "Secrétaire aux affaires Juridiques", name: "Abdoul Aziz Aboubacar", contact: "94 08 88 24" },
      { num: "23", fonction: "Secrétaire affaires Juridiques Adjoint", name: "Daouda Djibril", contact: "84 19 30 70" },
      { num: "24", fonction: "Inspecteur Principal", name: "Ibrahim Abdou", contact: "96 83 11 11" },
      { num: "25", fonction: "Inspecteur Principal Adjoint", name: "Hinsa Idé", contact: "88 21 28 06" },
    ],
  },
];

const COMMISSIONS_DICT: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    badge: string;
    presidentCR: string;
    searchPlaceholder: string;
    addMemberBtn: string;
    exportBtn: string;
    printBtn: string;
    membersCount: string;
    colNum: string;
    colFunc: string;
    colName: string;
    colContact: string;
    modalTitle: string;
    saveMember: string;
    cancel: string;
    villagesLabel: string;
    addVillageBtn: string;
    batchVillagesBtn: string;
    batchVillagesTitle: string;
    batchVillagesDesc: string;
    batchVillagesPlaceholder: string;
    createVillagesBtn: string;
    emptyMembers: string;
    editModalTitle: string;
    colDetails: string;
    colActions: string;
    editBtn: string;
    deleteBtn: string;
    addressLabel: string;
    emailLabel: string;
    nationalIdLabel: string;
    notesLabel: string;
  }
> = {
  ar: {
    title: "دليل اللجان الجهوية والهيئات الرسمية 2026",
    subtitle: "جمعية إحياء السنة — التنسيقية الجهوية بمرادي (النيجر) — قرار رقم 0307/MI/D/DAPJ/DLP/2002",
    badge: "7 لجان • إدارة متعددة القرى",
    presidentCR: "رئيس التنسيقية الجهوية (C/R): الحاج رابيعو موسى تيلا",
    searchPlaceholder: "ابحث باسم العضو، الصفة، أو رقم الهاتف...",
    addMemberBtn: "إضافة عضو للجنة",
    exportBtn: "تصدير JSON",
    printBtn: "طباعة",
    membersCount: "عضو",
    colNum: "#",
    colFunc: "الصفة / الوظيفة",
    colName: "الاسم الكامل",
    colContact: "رقم الهاتف",
    modalTitle: "إضافة عضو جديد إلى اللجنة",
    saveMember: "حفظ العضو",
    cancel: "إلغاء",
    villagesLabel: "القرى والهيئات المسجلة:",
    addVillageBtn: "إضافة قرية / شعبة",
    batchVillagesBtn: "إضافة عدة قرى دفعة واحدة",
    batchVillagesTitle: "إضافة عدة قرى وتهيئة لجانها تلقائياً",
    batchVillagesDesc: "اكتب اسم كل قرية أو شعبة في سطر مستقل (سيتم إنشاء اللجان الـ 7 لكل قرية):",
    batchVillagesPlaceholder: "قرية كاولاد\nقرية مادارونفا\nقرية تساوا",
    createVillagesBtn: "إنشاء القرى واللجان",
    emptyMembers: "لا يوجد أعضاء مسجلون في هذه اللجنة للقرية المختارة بعد. اضغط «إضافة عضو للجنة».",
    editModalTitle: "تعديل البيانات الشخصية للعضو",
    colDetails: "البيانات الشخصية",
    colActions: "إجراءات",
    editBtn: "تعديل",
    deleteBtn: "حذف",
    addressLabel: "العنوان / الحي",
    emailLabel: "البريد الإلكتروني",
    nationalIdLabel: "رقم الهوية / CNI",
    notesLabel: "ملاحظات",
  },
  fr: {
    title: "Annuaire des Commissions Régionales & Gouvernance 2026",
    subtitle: "Ihya'ous Sounnah — Coordination Régionale de Maradi (Niger) — Arrêté N°0307/MI/D/DAPJ/DLP/2002",
    badge: "7 Commissions • Multi-Villages",
    presidentCR: "Le Président de la C/R : Elh Rabiou Moussa Tela",
    searchPlaceholder: "Rechercher par nom, fonction ou téléphone...",
    addMemberBtn: "Ajouter un membre",
    exportBtn: "Exporter JSON",
    printBtn: "Imprimer",
    membersCount: "membres",
    colNum: "N°",
    colFunc: "Fonction",
    colName: "Nom et Prénom",
    colContact: "Contact",
    modalTitle: "Ajouter un membre à la commission",
    saveMember: "Enregistrer",
    cancel: "Annuler",
    villagesLabel: "Villages & Sections :",
    addVillageBtn: "Ajouter village",
    batchVillagesBtn: "Ajout multiple (villages)",
    batchVillagesTitle: "Ajouter plusieurs villages avec leurs 7 commissions",
    batchVillagesDesc: "Saisissez un nom de village ou section par ligne :",
    batchVillagesPlaceholder: "Village Kaolack\nVillage Madarounfa\nVillage Tessaoua",
    createVillagesBtn: "Créer les villages",
    emptyMembers: "Aucun membre enregistré dans cette commission pour ce village. Cliquez sur « Ajouter un membre ».",
    editModalTitle: "Modifier les données personnelles du membre",
    colDetails: "Infos personnelles",
    colActions: "Actions",
    editBtn: "Modifier",
    deleteBtn: "Supprimer",
    addressLabel: "Adresse / Quartier",
    emailLabel: "Adresse e-mail",
    nationalIdLabel: "N° Pièce / CNI",
    notesLabel: "Notes",
  },
  ha: {
    title: "Rijistar Kwamitocin Shiyyar Maradi 2026",
    subtitle: "Ihya'ous Sounnah — Shiyyar Maradi (Nijar) — Lambar Rajista 0307/MI/D/DAPJ/DLP/2002",
    badge: "Kwamitoci 7 • Kauyuka da Yawa",
    presidentCR: "Shugaban C/R : Elh Rabiou Moussa Tela",
    searchPlaceholder: "Nemo da suna, mukami ko lambar waya...",
    addMemberBtn: "Kara mamba",
    exportBtn: "Fitar da JSON",
    printBtn: "Buga",
    membersCount: "mambobi",
    colNum: "N°",
    colFunc: "Mukami",
    colName: "Cikakken Suna",
    colContact: "Lambar Waya",
    modalTitle: "Kara sabon mamba a kwamiti",
    saveMember: "Ajiye",
    cancel: "Fasa",
    villagesLabel: "Kauyuka da Sassan:",
    addVillageBtn: "Kara kauye",
    batchVillagesBtn: "Kara kauyuka da yawa",
    batchVillagesTitle: "Kara kauyuka da yawa tare da kwamitocinsu",
    batchVillagesDesc: "Rubuta sunan kowane kauye a layi daban:",
    batchVillagesPlaceholder: "Kauyen Maradi\nKauyen Madarounfa\nKauyen Tessaoua",
    createVillagesBtn: "Bude kauyukan",
    emptyMembers: "Babu mambobi a wannan kwamitin tukuna. Danna « Kara mamba ».",
    editModalTitle: "Gyara bayanan mamba",
    colDetails: "Karin bayani",
    colActions: "Ayyuka",
    editBtn: "Gyara",
    deleteBtn: "Goge",
    addressLabel: "Adireshi / Unguwa",
    emailLabel: "Imel",
    nationalIdLabel: "Lambar Katin Shaida",
    notesLabel: "Bayani",
  },
};

const STORAGE_KEY = "ihyaous_commissions_villages_2026_v2";

const INITIAL_DIRECTORIES: VillageDirectory[] = [
  {
    id: "maradi-cr",
    villageName: "Coordination Régionale de Maradi (Siège)",
    commissions: INITIAL_COMMISSIONS,
  },
];

export default function Commissions2026Page() {
  const { currentLocale, isRtl } = useLocale();
  const dict = COMMISSIONS_DICT[currentLocale];

  const [directories, setDirectories] = useState<VillageDirectory[]>(INITIAL_DIRECTORIES);
  const [selectedVillageId, setSelectedVillageId] = useState<string>("maradi-cr");
  const [selectedId, setSelectedId] = useState<string>("restauration");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBatchVillagesOpen, setIsBatchVillagesOpen] = useState(false);
  const [batchVillagesText, setBatchVillagesText] = useState("");
  const [newFunc, setNewFunc] = useState("Membre");
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newNationalId, setNewNationalId] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [editingMemberIndex, setEditingMemberIndex] = useState<number | null>(null);
  const [printOrientation, setPrintOrientation] = useState<
    "portrait" | "landscape"
  >("portrait");

  const handlePrintWithOrientation = (mode: "portrait" | "landscape") => {
    setPrintOrientation(mode);
    setTimeout(() => window.print(), 50);
  };

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    queueMicrotask(() => {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDirectories(parsed);
        }
      } catch {
        // ignore
      }
    });
  }, []);

  const activeDirectory =
    directories.find((d) => d.id === selectedVillageId) || directories[0];
  const commissions = activeDirectory.commissions;
  const activeCommission =
    commissions.find((c) => c.id === selectedId) || commissions[0];

  const filteredMembers = activeCommission.members.filter((m) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.fonction.toLowerCase().includes(q) ||
      m.contact.toLowerCase().includes(q)
    );
  });

  const handleOpenAddMember = () => {
    setEditingMemberIndex(null);
    setNewFunc("Membre");
    setNewName("");
    setNewContact("");
    setNewAddress("");
    setNewEmail("");
    setNewNationalId("");
    setNewNotes("");
    setIsModalOpen(true);
  };

  const handleOpenEditMember = (m: CommissionMember, idx: number) => {
    setEditingMemberIndex(idx);
    setNewFunc(m.fonction);
    setNewName(m.name);
    setNewContact(m.contact);
    setNewAddress(m.address || "");
    setNewEmail(m.email || "");
    setNewNationalId(m.nationalId || "");
    setNewNotes(m.notes || "");
    setIsModalOpen(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const updatedDirs = directories.map((dir) => {
      if (dir.id !== activeDirectory.id) return dir;
      return {
        ...dir,
        commissions: dir.commissions.map((c) => {
          if (c.id !== activeCommission.id) return c;

          if (editingMemberIndex !== null && c.members[editingMemberIndex]) {
            const nextMembers = c.members.map((item, i) =>
              i === editingMemberIndex
                ? {
                  ...item,
                  fonction: newFunc.trim() || "Membre",
                  name: newName.trim(),
                  contact: newContact.trim(),
                  address: newAddress.trim() || undefined,
                  email: newEmail.trim() || undefined,
                  nationalId: newNationalId.trim() || undefined,
                  notes: newNotes.trim() || undefined,
                }
                : item
            );
            return { ...c, members: nextMembers };
          }

          const nextNum = String(c.members.length + 1).padStart(2, "0");
          return {
            ...c,
            members: [
              ...c.members,
              {
                num: nextNum,
                fonction: newFunc.trim() || "Membre",
                name: newName.trim(),
                contact: newContact.trim(),
                address: newAddress.trim() || undefined,
                email: newEmail.trim() || undefined,
                nationalId: newNationalId.trim() || undefined,
                notes: newNotes.trim() || undefined,
              },
            ],
          };
        }),
      };
    });

    setDirectories(updatedDirs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDirs));
    setEditingMemberIndex(null);
    setIsModalOpen(false);
  };

  const handleDeleteMember = (idx: number) => {
    const updatedDirs = directories.map((dir) => {
      if (dir.id !== activeDirectory.id) return dir;
      return {
        ...dir,
        commissions: dir.commissions.map((c) => {
          if (c.id !== activeCommission.id) return c;
          const remaining = c.members
            .filter((_, i) => i !== idx)
            .map((m, newIdx) => ({
              ...m,
              num: String(newIdx + 1).padStart(2, "0"),
            }));
          return { ...c, members: remaining };
        }),
      };
    });

    setDirectories(updatedDirs);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedDirs));
  };

  const handleBatchAddVillages = (e: React.FormEvent) => {
    e.preventDefault();
    const names = batchVillagesText
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (names.length === 0) return;

    const newDirs: VillageDirectory[] = names.map((vName, idx) => ({
      id: `village-${Date.now()}-${idx}`,
      villageName: vName,
      commissions: createEmptyVillageCommissions(vName),
    }));

    const updated = [...directories, ...newDirs];
    setDirectories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setSelectedVillageId(newDirs[0].id);
    setBatchVillagesText("");
    setIsBatchVillagesOpen(false);
  };

  const handleDeleteVillage = (id: string) => {
    if (id === "maradi-cr") return;
    const updated = directories.filter((d) => d.id !== id);
    setDirectories(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (selectedVillageId === id) {
      setSelectedVillageId("maradi-cr");
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(directories, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ihyaous-sounnah-commissions-villages-2026.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 print:bg-transparent print:text-slate-900 p-4 sm:p-8 print:p-0 ${isRtl ? "rtl font-sans" : "ltr"
        }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl print:max-w-none print:w-full mx-auto space-y-6 print:space-y-3">
        <PrintLetterhead
          title={dict.title}
          subtitle={activeCommission.title}
          village={activeDirectory.villageName}
          badge={dict.badge}
          locale={currentLocale}
          orientation={printOrientation}
        />

        {/* Header */}
        <div className="print:hidden bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/50">
              <Users className="w-7 h-7 text-slate-950 stroke-[2.4]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold mb-1">
                <Award className="w-3.5 h-3.5" /> {dict.badge}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">{dict.title}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{dict.subtitle}</p>
              <p className="text-xs text-emerald-400 font-bold mt-1">{dict.presidentCR}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 print:hidden">
            <button
              type="button"
              onClick={() => setIsBatchVillagesOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{dict.batchVillagesBtn}</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAddMember}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{dict.addMemberBtn}</span>
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
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

        {/* Multi-Village / Section Switcher Bar */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center gap-2.5 print:hidden">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            {dict.villagesLabel}
          </span>
          {directories.map((dir) => {
            const active = dir.id === activeDirectory.id;
            return (
              <div
                key={dir.id}
                className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-bold transition ${active
                  ? "bg-emerald-600 text-white border-emerald-500 shadow"
                  : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-600"
                  }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedVillageId(dir.id)}
                  className="cursor-pointer"
                >
                  {dir.villageName}
                </button>
                {dir.id !== "maradi-cr" && (
                  <button
                    type="button"
                    onClick={() => handleDeleteVillage(dir.id)}
                    className="ms-1 text-slate-300 hover:text-rose-300 cursor-pointer"
                    title="Delete village"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
          <button
            type="button"
            onClick={() => setIsBatchVillagesOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-dashed border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{dict.addVillageBtn}</span>
          </button>
        </div>

        {/* Commission Selector Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 print:hidden">
          {commissions.map((comm) => {
            const active = comm.id === activeCommission.id;
            return (
              <button
                key={comm.id}
                type="button"
                onClick={() => setSelectedId(comm.id)}
                className={`p-3.5 rounded-2xl border text-start transition cursor-pointer flex flex-col justify-between gap-2 ${active
                  ? "bg-slate-800 border-emerald-500/60 shadow-lg shadow-emerald-950/40"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                  }`}
              >
                <span className="text-xs font-black text-white line-clamp-2">
                  {comm.shortTitle}
                </span>
                <span
                  className={`inline-block self-start px-2 py-0.5 rounded-full text-[10px] font-bold border ${comm.badgeColor}`}
                >
                  {comm.members.length} {dict.membersCount}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + Active Commission Table */}
        <div className="print-clean-card print:rounded-lg bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 print:py-3 border-b border-slate-800 print:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400 print:text-emerald-700 shrink-0" />
              <h2 className="text-base font-black text-white print:text-slate-900">{activeCommission.title}</h2>
            </div>

            <div className="relative w-full sm:w-80 print:hidden">
              <Search className="w-4 h-4 text-slate-500 absolute start-3.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dict.searchPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <th className="py-3 px-4 text-start w-14">{dict.colNum}</th>
                  <th className="py-3 px-4 text-start">{dict.colFunc}</th>
                  <th className="py-3 px-4 text-start">{dict.colName}</th>
                  <th className="py-3 px-4 text-start">{dict.colContact}</th>
                  <th className="py-3 px-4 text-start">{dict.colDetails}</th>
                  <th className="py-3 px-4 text-end print:hidden">{dict.colActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs text-slate-400">
                      {dict.emptyMembers}
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m, idx) => {
                    const origIdx = activeCommission.members.indexOf(m);
                    const isLeader =
                      m.fonction.toLowerCase().includes("président") ||
                      m.fonction.toLowerCase().includes("commandant") ||
                      m.fonction.toLowerCase().includes("inspecteur");
                    return (
                      <tr key={`${m.num}-${idx}`} className="hover:bg-slate-800/40 transition">
                        <td className="py-3 px-4 font-mono text-slate-500">{m.num}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${isLeader
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-slate-800 text-slate-300"
                              }`}
                          >
                            {m.fonction}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-bold text-white print:text-slate-900 text-sm print:text-xs">{m.name}</td>
                        <td className="py-3 px-4">
                          {m.contact ? (
                            <a
                              href={`tel:+227${m.contact.replace(/\s+/g, "")}`}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 print:bg-transparent border border-slate-800 print:border-slate-300 text-emerald-400 print:text-slate-900 font-mono whitespace-nowrap hover:border-emerald-500/40 transition"
                            >
                              <Phone className="w-3 h-3" />
                              <span dir="ltr">{m.contact}</span>
                            </a>
                          ) : (
                            <span className="text-slate-600">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-[11px] text-slate-400">
                          {[m.address, m.nationalId, m.email].filter(Boolean).join(" • ") || "—"}
                        </td>
                        <td className="py-3 px-4 text-end print:hidden">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditMember(m, origIdx >= 0 ? origIdx : idx)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold flex items-center gap-1 cursor-pointer"
                              title={dict.editBtn}
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>{dict.editBtn}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteMember(origIdx >= 0 ? origIdx : idx)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-rose-400 font-bold flex items-center gap-1 cursor-pointer"
                              title={dict.deleteBtn}
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>{dict.deleteBtn}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <PrintSignatureFooter locale={currentLocale} />
      </div>

      {/* Add / Edit Member Comprehensive Personal Data Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                {editingMemberIndex !== null ? dict.editModalTitle : dict.modalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{dict.colFunc}</label>
                  <input
                    type="text"
                    value={newFunc}
                    onChange={(e) => setNewFunc(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{dict.colContact}</label>
                  <input
                    type="text"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    placeholder="96 -- -- --"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">{dict.colName} *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{dict.addressLabel}</label>
                  <input
                    type="text"
                    value={newAddress}
                    onChange={(e) => setNewAddress(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{dict.nationalIdLabel}</label>
                  <input
                    type="text"
                    value={newNationalId}
                    onChange={(e) => setNewNationalId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">{dict.emailLabel}</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">{dict.notesLabel}</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  {dict.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  {dict.saveMember}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Multi-Village Modal */}
      {isBatchVillagesOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{dict.batchVillagesTitle}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsBatchVillagesOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">{dict.batchVillagesDesc}</p>
            <form onSubmit={handleBatchAddVillages} className="space-y-4">
              <textarea
                rows={5}
                required
                value={batchVillagesText}
                onChange={(e) => setBatchVillagesText(e.target.value)}
                placeholder={dict.batchVillagesPlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBatchVillagesOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  {dict.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
                >
                  {dict.createVillagesBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
