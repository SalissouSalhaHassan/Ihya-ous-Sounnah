"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  KeyRound,
  ShieldCheck,
  UserPlus,
  Search,
  Trash2,
  Save,
  Lock,
  CheckCircle2,
  X,
  RefreshCw,
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { Locale } from "@/lib/i18n";

interface AccessUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  village: string;
  createdAt: string;
  lastSignInAt: string | null;
}

const ROLES = [
  { value: "ADMIN", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  { value: "IMAM", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  { value: "SCHOLAR", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  { value: "ACCOUNTANT", color: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  { value: "INSPECTOR", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  { value: "VIEWER", color: "bg-slate-800 text-slate-300 border-slate-700" },
];

const ACCESS_DICT: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    badge: string;
    addUserBtn: string;
    refreshBtn: string;
    searchPlaceholder: string;
    colUser: string;
    colRole: string;
    colVillage: string;
    colActions: string;
    saveBtn: string;
    savedMsg: string;
    restrictedTitle: string;
    restrictedDesc: string;
    loginBtn: string;
    matrixTitle: string;
    modalTitle: string;
    emailLabel: string;
    passwordLabel: string;
    nameLabel: string;
    roleLabel: string;
    villageLabel: string;
    createBtn: string;
    cancelBtn: string;
  }
> = {
  ar: {
    title: "مركز التحكم بالصلاحيات والوصول (RBAC)",
    subtitle: "إدارة حسابات الأئمة، المفتين، أمناء الصندوق، وممثلي القرى وصلاحياتهم في المنصة",
    badge: "حوكمة وأمن الوصول",
    addUserBtn: "إضافة مستخدم جديد",
    refreshBtn: "تحديث القائمة",
    searchPlaceholder: "ابحث بالبريد، الاسم، أو القرية...",
    colUser: "المستخدم",
    colRole: "الدور / الصلاحية",
    colVillage: "القرية / الشعبة المسندة",
    colActions: "إجراءات",
    saveBtn: "حفظ",
    savedMsg: "تم تحديث صلاحيات المستخدم بنجاح",
    restrictedTitle: "صلاحية المشرف العام (ADMIN) مطلوبة",
    restrictedDesc: "هذا المركز مخصص حصرياً للمشرفين لإدارة أدوار الحسابات وعزل بيانات القرى.",
    loginBtn: "تسجيل الدخول بحساب ADMIN",
    matrixTitle: "مصفوفة الصلاحيات حسب الدور الوظيفي",
    modalTitle: "إنشاء حساب مستخدم بصلاحية محددة",
    emailLabel: "البريد الإلكتروني",
    passwordLabel: "كلمة المرور",
    nameLabel: "الاسم الكامل",
    roleLabel: "الدور الوظيفي",
    villageLabel: "القرية / الشعبة",
    createBtn: "إنشاء وتفعيل الحساب",
    cancelBtn: "إلغاء",
  },
  fr: {
    title: "Centre de Contrôle des Accès & Privilèges (RBAC)",
    subtitle: "Gestion des comptes imams, oulémas, trésoriers, représentants de villages et permissions",
    badge: "Gouvernance & Sécurité",
    addUserBtn: "Nouvel utilisateur",
    refreshBtn: "Actualiser",
    searchPlaceholder: "Rechercher par e-mail, nom ou village...",
    colUser: "Utilisateur",
    colRole: "Rôle / Privilège",
    colVillage: "Village / Section assignée",
    colActions: "Actions",
    saveBtn: "Enregistrer",
    savedMsg: "Privilèges mis à jour avec succès",
    restrictedTitle: "Accès réservé à l'Administrateur (ADMIN)",
    restrictedDesc: "Ce centre est réservé aux administrateurs pour gérer les rôles et l'isolation des villages.",
    loginBtn: "Se connecter en ADMIN",
    matrixTitle: "Matrice des permissions par rôle",
    modalTitle: "Créer un compte avec rôle attribué",
    emailLabel: "Adresse e-mail",
    passwordLabel: "Mot de passe",
    nameLabel: "Nom complet",
    roleLabel: "Rôle fonctionnel",
    villageLabel: "Village / Section",
    createBtn: "Créer et activer",
    cancelBtn: "Annuler",
  },
  ha: {
    title: "Cibiyar Kula da Izini da Masu Amfani (RBAC)",
    subtitle: "Gudanar da asusun limamai, malamai, ma'ajin kudi, da wakilan kauyuka",
    badge: "Tsaro da Izini",
    addUserBtn: "Kara sabon mai amfani",
    refreshBtn: "Sabunta",
    searchPlaceholder: "Nemo da imel, suna ko kauye...",
    colUser: "Mai amfani",
    colRole: "Matsayi / Izini",
    colVillage: "Kauye / Sashe",
    colActions: "Ayyuka",
    saveBtn: "Ajiye",
    savedMsg: "An sabunta izinin mai amfani cikin nasara",
    restrictedTitle: "Ana bukatar izinin ADMIN",
    restrictedDesc: "Wannan sashe na musamman ne ga masu kula (ADMIN) don saita izinin kauyuka.",
    loginBtn: "Shiga da asusun ADMIN",
    matrixTitle: "Jadawalin Izini bisa Matsayi",
    modalTitle: "Bude sabon asusu tare da izini",
    emailLabel: "Adireshin Imel",
    passwordLabel: "Kalmar Sirri",
    nameLabel: "Cikakken Suna",
    roleLabel: "Matsayi",
    villageLabel: "Kauye / Sashe",
    createBtn: "Bude Asusu",
    cancelBtn: "Fasa",
  },
};

export default function AccessControlPage() {
  const { currentLocale, isRtl } = useLocale();
  const dict = ACCESS_DICT[currentLocale];

  const [users, setUsers] = useState<AccessUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("IMAM");
  const [newVillage, setNewVillage] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      if (res.status === 401 || res.status === 403) {
        setAccessDenied(true);
        setUsers([]);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setAccessDenied(false);
        setUsers(data.users || []);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void loadUsers();
    });
  }, [loadUsers]);

  const handleUpdateUser = async (user: AccessUser) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        role: user.role,
        village: user.village,
        fullName: user.fullName,
      }),
    });
    if (res.ok) {
      setToast(dict.savedMsg);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: newEmail,
        password: newPassword,
        fullName: newName,
        role: newRole,
        village: newVillage,
      }),
    });
    if (res.ok) {
      setIsModalOpen(false);
      setNewEmail("");
      setNewPassword("");
      setNewName("");
      setNewVillage("");
      await loadUsers();
      setToast(dict.savedMsg);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleDeleteUser = async (id: string) => {
    const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      await loadUsers();
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      u.email.toLowerCase().includes(q) ||
      u.fullName.toLowerCase().includes(q) ||
      u.village.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 ${
        isRtl ? "rtl font-sans" : "ltr"
      }`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shrink-0 shadow-lg">
              <KeyRound className="w-7 h-7 text-slate-950 stroke-[2.4]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-bold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" /> {dict.badge}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white">{dict.title}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{dict.subtitle}</p>
            </div>
          </div>

          {!accessDenied && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>{dict.addUserBtn}</span>
              </button>
              <button
                type="button"
                onClick={() => void loadUsers()}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                <span>{dict.refreshBtn}</span>
              </button>
            </div>
          )}
        </div>

        {toast && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toast}</span>
          </div>
        )}

        {/* Access Denied / Login Prompt */}
        {accessDenied ? (
          <div className="bg-slate-900/70 border border-rose-500/30 rounded-3xl p-8 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-black text-white">{dict.restrictedTitle}</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto">{dict.restrictedDesc}</p>
            <Link
              href="/login"
              className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
            >
              {dict.loginBtn}
            </Link>
          </div>
        ) : (
          <>
            {/* Role Permissions Matrix */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h2 className="text-xs font-black text-slate-300 uppercase tracking-wider">
                {dict.matrixTitle}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 text-[11px]">
                {ROLES.map((r) => (
                  <div
                    key={r.value}
                    className={`p-3 rounded-xl border font-bold space-y-1 ${r.color}`}
                  >
                    <div>{r.value}</div>
                    <div className="text-[10px] opacity-80 font-normal">
                      {r.value === "ADMIN"
                        ? "Full Access + All Villages"
                        : r.value === "IMAM"
                        ? "Mosques, Nikah, Quran, Own Village"
                        : r.value === "SCHOLAR"
                        ? "Fatwa, Quran, Magazine"
                        : r.value === "ACCOUNTANT"
                        ? "Zakat & Donations"
                        : r.value === "INSPECTOR"
                        ? "Field Mosques & Own Village"
                        : "Read-Only"}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-sm font-black text-white">
                  {users.length} Users
                </span>
                <div className="relative w-full sm:w-80">
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
                    <tr className="bg-slate-950/70 text-slate-400 border-b border-slate-800">
                      <th className="py-3 px-4 text-start">{dict.colUser}</th>
                      <th className="py-3 px-4 text-start">{dict.colRole}</th>
                      <th className="py-3 px-4 text-start">{dict.colVillage}</th>
                      <th className="py-3 px-4 text-end">{dict.colActions}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">{u.fullName || "—"}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={u.role}
                            onChange={(e) =>
                              setUsers(
                                users.map((x) =>
                                  x.id === u.id ? { ...x, role: e.target.value } : x
                                )
                              )
                            }
                            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white font-bold"
                          >
                            {ROLES.map((r) => (
                              <option key={r.value} value={r.value}>
                                {r.value}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-4">
                          <input
                            type="text"
                            value={u.village}
                            onChange={(e) =>
                              setUsers(
                                users.map((x) =>
                                  x.id === u.id ? { ...x, village: e.target.value } : x
                                )
                              )
                            }
                            placeholder="Village / Section..."
                            className="w-full max-w-xs bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-white"
                          />
                        </td>
                        <td className="py-3 px-4 text-end">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => void handleUpdateUser(u)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Save className="w-3.5 h-3.5" />
                              <span>{dict.saveBtn}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => void handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-base text-white">{dict.modalTitle}</h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">{dict.nameLabel}</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">{dict.emailLabel}</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">{dict.passwordLabel}</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{dict.roleLabel}</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.value}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">{dict.villageLabel}</label>
                  <input
                    type="text"
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold cursor-pointer"
                >
                  {dict.cancelBtn}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                >
                  {dict.createBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
