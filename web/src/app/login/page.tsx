"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  LogIn,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Languages,
  Sparkles,
  Building2,
  BookOpen,
  HeartHandshake,
  Wifi,
  WifiOff,
  User,
  Briefcase,
} from "lucide-react";
import { LOCALES, Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-context";

const LOGIN_DICT: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    backHome: string;
    signInTab: string;
    signUpTab: string;
    fullNameLabel: string;
    fullNamePlaceholder: string;
    roleLabel: string;
    emailLabel: string;
    passwordLabel: string;
    signInBtn: string;
    signUpBtn: string;
    loadingSignIn: string;
    loadingSignUp: string;
    signUpSuccess: string;
    networkError: string;
    genericError: string;
    heroBadge: string;
    heroTitle: string;
    heroDesc: string;
    feature1: string;
    feature2: string;
    feature3: string;
    onlineStatus: string;
    offlineStatus: string;
    strengthWeak: string;
    strengthMedium: string;
    strengthStrong: string;
    roles: { value: string; label: string }[];
  }
> = {
  ar: {
    title: "بوابة الدخول الموحدة",
    subtitle: "Ihya'ous Sounnah للأوقاف والدعوة",
    backHome: "الرئيسية",
    signInTab: "تسجيل الدخول",
    signUpTab: "حساب جديد",
    fullNameLabel: "الاسم الكامل",
    fullNamePlaceholder: "الشيخ / المسؤول الميداني...",
    roleLabel: "الصفة الوظيفية",
    emailLabel: "البريد الإلكتروني",
    passwordLabel: "كلمة المرور",
    signInBtn: "دخول للمنصة",
    signUpBtn: "إنشاء الحساب",
    loadingSignIn: "جاري التحقق من الجلسة...",
    loadingSignUp: "جاري إنشاء الحساب...",
    signUpSuccess: "تم إنشاء الحساب بنجاح! يمكنك تسجيل الدخول الآن.",
    networkError:
      "تعذر الاتصال بخادم المصادقة (Supabase). تأكد من اتصال الإنترنت وصحة رابط المشروع في ملف .env.local.",
    genericError: "حدث خطأ أثناء المصادقة. يرجى التحقق من البيانات والمحاولة مجدداً.",
    heroBadge: "منظومة سحابية وميدانية متكاملة",
    heroTitle: "إدارة الأوقاف والمساجد وحلقات القرآن بثقة وشفافية",
    heroDesc:
      "بوابة موحدة للأئمة، المفتين، المحاسبين والمفتشين لمتابعة المساجد، عقود النكاح الموثقة، والزكاة بتكامل تام مع تطبيق الجوال.",
    feature1: "توثيق عقود النكاح والإجازات القرآنية برموز تحقق مشفرة",
    feature2: "محرك مزامنة ميداني مقاوم لانقطاع الإنترنت (Offline-First)",
    feature3: "حوكمة مالية شفافة لمصارف الزكاة ومشاريع الآبار",
    onlineStatus: "خادم المصادقة متصل",
    offlineStatus: "تعذر الوصول لخادم المصادقة",
    strengthWeak: "ضعيفة",
    strengthMedium: "متوسطة",
    strengthStrong: "قوية",
    roles: [
      { value: "IMAM", label: "إمام / مأذون شرعي" },
      { value: "SCHOLAR", label: "عالم / مفتي" },
      { value: "ACCOUNTANT", label: "أمين صندوق / محاسب زكاة" },
      { value: "INSPECTOR", label: "مفتش ميداني" },
    ],
  },
  fr: {
    title: "Portail d'Accès Unifié",
    subtitle: "Ihya'ous Sounnah Awqaf & Dawah",
    backHome: "Accueil",
    signInTab: "Connexion",
    signUpTab: "Nouveau compte",
    fullNameLabel: "Nom complet",
    fullNamePlaceholder: "Imam / Responsable terrain...",
    roleLabel: "Rôle fonctionnel",
    emailLabel: "Adresse e-mail",
    passwordLabel: "Mot de passe",
    signInBtn: "Accéder à la plateforme",
    signUpBtn: "Créer le compte",
    loadingSignIn: "Vérification en cours...",
    loadingSignUp: "Création du compte...",
    signUpSuccess: "Compte créé avec succès ! Vous pouvez maintenant vous connecter.",
    networkError:
      "Impossible de joindre le serveur d'authentification (Supabase). Vérifiez votre connexion et NEXT_PUBLIC_SUPABASE_URL.",
    genericError: "Erreur d'authentification. Veuillez vérifier vos identifiants.",
    heroBadge: "Système Cloud & Terrain Intégré",
    heroTitle: "Gestion des Mosquées, Awqaf et Écoles Coraniques",
    heroDesc:
      "Espace sécurisé dédié aux imams, oulémas, comptables et inspecteurs avec synchronisation hors-ligne.",
    feature1: "Certification numérique des mariages (Nikah) et Ijazah",
    feature2: "Synchronisation terrain résistante aux coupures réseau",
    feature3: "Transparence financière totale pour la Zakat et les puits",
    onlineStatus: "Serveur Auth connecté",
    offlineStatus: "Serveur Auth inaccessible",
    strengthWeak: "Faible",
    strengthMedium: "Moyenne",
    strengthStrong: "Forte",
    roles: [
      { value: "IMAM", label: "Imam / Officier Nikah" },
      { value: "SCHOLAR", label: "Ouléma / Mufti" },
      { value: "ACCOUNTANT", label: "Trésorier / Comptable Zakat" },
      { value: "INSPECTOR", label: "Inspecteur terrain" },
    ],
  },
  ha: {
    title: "Kofar Shiga Ta Tsari",
    subtitle: "Ihya'ous Sounnah Awqaf & Dawah",
    backHome: "Gida",
    signInTab: "Shiga",
    signUpTab: "Sabon Asusu",
    fullNameLabel: "Cikakken Suna",
    fullNamePlaceholder: "Liman / Jami'in kula...",
    roleLabel: "Matsayi / Aiki",
    emailLabel: "Adireshin Imel",
    passwordLabel: "Kalmar Sirri",
    signInBtn: "Shiga Manhaja",
    signUpBtn: "Bude Asusu",
    loadingSignIn: "Ana dubawa...",
    loadingSignUp: "Ana bude asusu...",
    signUpSuccess: "An bude asusu cikin nasara! Yanzu za ka iya shiga.",
    networkError:
      "Ba a iya haɗuwa da uwar garken tantancewa (Supabase) ba. Duba intanet ko .env.local.",
    genericError: "An samu kuskure. Duba imel da kalmar sirri ka sake gwadawa.",
    heroBadge: "Tsarin Zamani na Aiki da ko Ba Net",
    heroTitle: "Kula da Masallatai, Tsangaya da Ayyukan Zakka",
    heroDesc:
      "Kofar shiga ta musamman ga limamai, malamai, ma'ajin kudi da masu duba ayyuka.",
    feature1: "Takardun aure na zamani da shaidar karatu masu lambar sirri",
    feature2: "Aiki ba tare da intanet ba tare da aika bayanai daga baya",
    feature3: "Gaskiya da rikon amana wajen raba Zakka da gina rijiyoyi",
    onlineStatus: "Uwar garke yana aiki",
    offlineStatus: "Ba a samu haɗin uwar garke ba",
    strengthWeak: "Mai rauni",
    strengthMedium: "Matsakaici",
    strengthStrong: "Mai karfi",
    roles: [
      { value: "IMAM", label: "Liman / Mai daurin aure" },
      { value: "SCHOLAR", label: "Malami / Mufti" },
      { value: "ACCOUNTANT", label: "Ma'ajin Zakka" },
      { value: "INSPECTOR", label: "Mai duba ayyuka" },
    ],
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { locale, setLocale, isRtl } = useLocale();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("IMAM");
  const [loading, setLoading] = useState(false);
  const [authHealth, setAuthHealth] = useState<"checking" | "online" | "offline">("checking");
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  const t = LOGIN_DICT[locale];

  useEffect(() => {
    let active = true;
    fetch("/api/supabase/health")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active) return;
        const urlOk =
          data?.supabaseUrl &&
          !String(data.supabaseUrl).includes("your-project");
        setAuthHealth(urlOk && data?.status === "CONNECTED" ? "online" : "offline");
      })
      .catch(() => {
        if (active) setAuthHealth("offline");
      });
    return () => {
      active = false;
    };
  }, []);

  const passwordStrength =
    password.length === 0
      ? 0
      : password.length < 6
      ? 1
      : password.length < 10 || !/[0-9]/.test(password)
      ? 2
      : 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === "signin") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          const errText = String(data?.error || "");
          const isNet = errText.toLowerCase().includes("fetch");
          setMessage({
            type: "error",
            text: isNet ? t.networkError : errText || t.genericError,
          });
        } else {
          router.push("/");
          router.refresh();
        }
      } else {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim(),
            password,
            fullName: fullName.trim() || "Ihya'ous Sounnah Staff",
            role,
          }),
        });
        const data = await res.json();
        if (!res.ok) {
          const errText = String(data?.error || "");
          const isNet = errText.toLowerCase().includes("fetch");
          setMessage({
            type: "error",
            text: isNet ? t.networkError : errText || t.genericError,
          });
        } else {
          setMessage({ type: "success", text: t.signUpSuccess });
          setMode("signin");
        }
      }
    } catch (err) {
      const msg = String(err).toLowerCase();
      setMessage({
        type: "error",
        text: msg.includes("failed to fetch") ? t.networkError : t.genericError,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-10 selection:bg-emerald-500 selection:text-white"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* Ambient Background Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(16 185 129) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden">
        {/* Brand & Highlights Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 p-7 sm:p-9 flex flex-col justify-between border-b lg:border-b-0 lg:border-e border-slate-800/80 space-y-8">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.heroBadge}</span>
              </div>
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  authHealth === "online"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : authHealth === "offline"
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                    : "bg-slate-800 border-slate-700 text-slate-400"
                }`}
              >
                {authHealth === "online" ? (
                  <Wifi className="w-3 h-3" />
                ) : (
                  <WifiOff className="w-3 h-3" />
                )}
                <span>
                  {authHealth === "online"
                    ? t.onlineStatus
                    : authHealth === "offline"
                    ? t.offlineStatus
                    : "..."}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3.5 pt-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ShieldCheck className="w-7 h-7 text-slate-950 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Ihya&apos;ous Sounnah
                </h2>
                <p className="text-xs text-emerald-400 font-medium">{t.subtitle}</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug">
                {t.heroTitle}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.heroDesc}</p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <Building2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{t.feature1}</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <BookOpen className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
              <span>{t.feature2}</span>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-300">
              <HeartHandshake className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{t.feature3}</span>
            </div>
          </div>
        </div>

        {/* Auth Form Panel */}
        <div className="lg:col-span-7 p-7 sm:p-10 flex flex-col justify-center space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-white">{t.title}</h1>
              <p className="text-xs text-slate-400 mt-0.5">{t.subtitle}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1">
                <Languages className="w-3.5 h-3.5 text-emerald-400 mx-1.5" />
                {LOCALES.map((loc) => (
                  <button
                    key={loc.code}
                    type="button"
                    onClick={() => setLocale(loc.code)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                      locale === loc.code
                        ? "bg-emerald-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {loc.code.toUpperCase()}
                  </button>
                ))}
              </div>

              <Link
                href="/"
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition flex items-center gap-1.5"
              >
                <span>{t.backHome}</span>
                {isRtl ? (
                  <ArrowLeft className="w-3.5 h-3.5" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" />
                )}
              </Link>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setMessage(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                mode === "signin"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.signInTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setMessage(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                mode === "signup"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-950/50"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {t.signUpTab}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {t.fullNameLabel}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute start-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t.fullNamePlaceholder}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    {t.roleLabel}
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-500 absolute start-3.5 top-3" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition"
                    >
                      {t.roles.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute start-3.5 top-3" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="imam@ihyaus-sounnah.org"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(2,6,23)] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute start-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl ps-10 pe-11 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition [&:-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(2,6,23)] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="Toggle password visibility"
                  className="absolute end-3 top-2.5 p-1 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {mode === "signup" && password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-3 gap-1.5 h-1.5">
                    <div
                      className={`rounded-full ${
                        passwordStrength >= 1 ? "bg-rose-500" : "bg-slate-800"
                      }`}
                    />
                    <div
                      className={`rounded-full ${
                        passwordStrength >= 2 ? "bg-amber-500" : "bg-slate-800"
                      }`}
                    />
                    <div
                      className={`rounded-full ${
                        passwordStrength >= 3 ? "bg-emerald-500" : "bg-slate-800"
                      }`}
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">
                    {passwordStrength === 1
                      ? t.strengthWeak
                      : passwordStrength === 2
                      ? t.strengthMedium
                      : t.strengthStrong}
                  </span>
                </div>
              )}
            </div>

            {message && (
              <div
                className={`p-3.5 rounded-xl text-xs font-bold border leading-relaxed ${
                  message.type === "error"
                    ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                    : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-60 text-white font-black text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              {mode === "signin" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{loading ? t.loadingSignIn : t.signInBtn}</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? t.loadingSignUp : t.signUpBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
