"use client";

import React, { useState } from "react";
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Clock, 
  Calendar, 
  Radio, 
  Send, 
  CheckCircle2, 
  Plus, 
  Heart,
  Share2,
  ShieldCheck,
  UserCheck,
  X
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { FUNERALS_DICT } from "@/lib/module-i18n";

export default function FuneralsAndBurialPage() {
  const { currentLocale, isRtl } = useLocale();
  const dict = FUNERALS_DICT[currentLocale];

  const [broadcastSent, setBroadcastSent] = useState<string | null>(null);
  const [isFuneralModalOpen, setIsFuneralModalOpen] = useState(false);
  const [newDeceasedName, setNewDeceasedName] = useState("");
  const [newDeceasedAge, setNewDeceasedAge] = useState(65);
  const [newDeceasedGender, setNewDeceasedGender] = useState("ذكر");
  const [newPrayerTime, setNewPrayerTime] = useState("صلاة الجنازة بعد صلاة العصر");
  const [newMosqueName, setNewMosqueName] = useState("جامع النور الكبير - نيامي");
  const [newGraveyard, setNewGraveyard] = useState("مقبرة المسلمين المركزية الوقفية (Yantala)");
  const [newContactPerson, setNewContactPerson] = useState("");
  const [funeralSuccess, setFuneralSuccess] = useState(false);

  // سجل الجنائز والوفيات الحالية
  const [funerals, setFunerals] = useState([
    {
      id: "JANAZAH-2026-0038",
      deceasedName: "الحاج عبد الرحمن محمد ساليسو (رحمه الله)",
      gender: "ذكر",
      age: 72,
      prayerTime: "صلاة الجنازة بعد صلاة الظهر مباشرة",
      mosque: "جامع النور الكبير - نيامي",
      graveyard: "مقبرة المسلمين المركزية الوقفية (Yantala)",
      plotNumber: "القطاع ج - رقم 142",
      contactPerson: "الابن: محمد عبد الرحمن ساليسو (+227 90 22 33 44)",
      status: "SCHEDULED",
      broadcasted: true,
      carAssigned: "سيارة الجنائز الوقفية رقم 02",
    },
    {
      id: "JANAZAH-2026-0039",
      deceasedName: "الحاجة ميمونة إبراهيم غاربا (رحمها الله)",
      gender: "أنثى",
      age: 65,
      prayerTime: "صلاة الجنازة بعد صلاة العصر",
      mosque: "مسجد الفاروق عمر",
      graveyard: "مقبرة الهدى الوقفية",
      plotNumber: "القطاع أ - رقم 88",
      contactPerson: "الزوج: الحاج عثمان زبير (+227 96 11 88 55)",
      status: "WASHING",
      broadcasted: false,
      carAssigned: "بانتظار اكتمال التجهيز والتكفين",
    },
  ]);

  const handleSendBroadcast = (id: string, name: string) => {
    setBroadcastSent(id);
    setTimeout(() => setBroadcastSent(null), 4000);
  };

  return (
    <div 
      className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 selection:bg-slate-700 selection:text-white ${isRtl ? "rtl font-sans" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-700 to-slate-800 flex items-center justify-center shadow-lg shadow-black/40 border border-slate-700">
              <Building2 className="w-7 h-7 text-emerald-400 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                {dict.title}
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {dict.badge}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {dict.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsFuneralModalOpen(true)}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 active:scale-95 cursor-pointer ring-2 ring-emerald-400/30"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              {dict.addBtn}
            </button>
          </div>
        </div>

        {/* Broadcast Toast Alert */}
        {broadcastSent && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 text-emerald-400 text-sm font-bold animate-in fade-in">
            <Radio className="w-5 h-5 animate-pulse" />
            {dict.broadcastToast}
          </div>
        )}

        {/* Funerals Feed */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-emerald-400" />
            {dict.feedTitle}
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {funerals.map((f) => (
              <div 
                key={f.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-8 space-y-6 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40">
                        {f.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        {f.gender} - {f.age} {dict.years}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white">{f.deceasedName}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendBroadcast(f.id, f.deceasedName)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5"
                    >
                      <Radio className="w-4 h-4" />
                      {dict.broadcastBtn}
                    </button>
                    <button 
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: f.deceasedName,
                            text: `إنا لله وإنا إليه راجعون. صلاة الجنازة على ${f.deceasedName} بـ ${f.mosque} - ${f.prayerTime}`,
                          });
                        }
                      }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" /> {dict.prayerTimeLabel}
                    </span>
                    <strong className="text-white text-sm block">{f.prayerTime}</strong>
                    <span className="text-[11px] text-slate-500 block">{f.mosque}</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {dict.graveyardLabel}
                    </span>
                    <strong className="text-white text-sm block">{f.graveyard}</strong>
                    <span className="text-[11px] text-cyan-400 font-mono block">{dict.plotLabel} {f.plotNumber}</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-400" /> {dict.contactLabel}
                    </span>
                    <strong className="text-white text-xs block truncate">{f.contactPerson}</strong>
                    <span className="text-[11px] text-slate-500 block">{dict.contactNote}</span>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> {dict.transportLabel}
                    </span>
                    <strong className="text-white text-xs block">{f.carAssigned}</strong>
                    <span className="text-[11px] text-emerald-400 font-bold block">{dict.washHouse}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free Janazah Endowment Services Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" />
              {dict.endowmentTitle}
            </h3>
            <p className="text-xs text-slate-400">
              {dict.endowmentDesc}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition">
              {dict.washersGuide}
            </button>
            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition">
              {dict.cemeteriesMap}
            </button>
          </div>
        </div>

        {/* Modal: تسجيل حالة وفاة وجنازة جديدة */}
        {isFuneralModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">تسجيل حالة وفاة وجنازة وقفية</h3>
                    <p className="text-xs text-slate-400">تنسيق التجهيز وصلاة الجنازة وتخصيص القبر بالمقبرة</p>
                  </div>
                </div>
                <button onClick={() => setIsFuneralModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {funeralSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">تم قيد الجنازة وإدراجها في الجدول بنجاح!</h4>
                  <p className="text-xs text-slate-400">يمكنك الآن إرسال إشعار البث الموحد لأهالي الحي بنقرة زر.</p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newDeceasedName.trim()) return;
                    const newEntry = {
                      id: `JANAZAH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                      deceasedName: `${newDeceasedName.trim()} (رحمه الله)`,
                      gender: newDeceasedGender,
                      age: newDeceasedAge,
                      prayerTime: newPrayerTime,
                      mosque: newMosqueName,
                      graveyard: newGraveyard,
                      plotNumber: `القطاع ب - رقم ${Math.floor(50 + Math.random() * 150)}`,
                      contactPerson: newContactPerson || "أهل المتوفى بالمسجد",
                      status: "SCHEDULED",
                      broadcasted: false,
                      carAssigned: "سيارة الجنائز الوقفية رقم 01",
                    };
                    setFunerals([newEntry, ...funerals]);
                    setFuneralSuccess(true);
                    setTimeout(() => {
                      setFuneralSuccess(false);
                      setIsFuneralModalOpen(false);
                      setNewDeceasedName("");
                      setNewContactPerson("");
                    }, 1500);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-slate-300 font-bold block mb-1">اسم المتوفى الرباعي: *</label>
                      <input 
                        type="text" 
                        required 
                        value={newDeceasedName} 
                        onChange={(e) => setNewDeceasedName(e.target.value)} 
                        placeholder="مثال: عبد القادر عثمان" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">العمر التقريبي:</label>
                      <input 
                        type="number" 
                        value={newDeceasedAge} 
                        onChange={(e) => setNewDeceasedAge(Number(e.target.value))} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">الجنس:</label>
                      <select 
                        value={newDeceasedGender} 
                        onChange={(e) => setNewDeceasedGender(e.target.value)} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      >
                        <option value="ذكر">ذكر</option>
                        <option value="أنثى">أنثى</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">موعد صلاة الجنازة:</label>
                      <input 
                        type="text" 
                        value={newPrayerTime} 
                        onChange={(e) => setNewPrayerTime(e.target.value)} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">المسجد الذي ستُقام فيه الصلاة: *</label>
                    <input 
                      type="text" 
                      value={newMosqueName} 
                      onChange={(e) => setNewMosqueName(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">المقبرة الوقفية:</label>
                    <input 
                      type="text" 
                      value={newGraveyard} 
                      onChange={(e) => setNewGraveyard(e.target.value)} 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">بيانات وهاتف ولي أمر المتوفى للتنسيق:</label>
                    <input 
                      type="text" 
                      value={newContactPerson} 
                      onChange={(e) => setNewContactPerson(e.target.value)} 
                      placeholder="مثال: الابن أحمد (+227 90 00 00 00)" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                    <button 
                      type="button" 
                      onClick={() => setIsFuneralModalOpen(false)} 
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl cursor-pointer shadow-lg shadow-emerald-950/40"
                    >
                      تسجيل وتثبيت الجنازة
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
