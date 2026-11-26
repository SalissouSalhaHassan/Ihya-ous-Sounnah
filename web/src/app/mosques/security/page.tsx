"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Car, 
  Bike, 
  QrCode, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  ShieldCheck, 
  WifiOff, 
  Building2,
  PhoneCall,
  Package,
  Plus,
  X,
  Printer,
  Share2,
  LogOut,
  Camera,
  RefreshCw,
  Send,
  MessageSquare,
  Eye,
  Check,
  ChevronRight,
  Filter,
  UserCheck,
  ArrowRight
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { SECURITY_DICT } from "@/lib/module-i18n";

interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  typeCode: "car" | "moto";
  ownerName: string;
  ownerPhone: string;
  entryTime: string;
  status: "PARKED" | "EXITED";
  statusLabel: string;
  passCode: string;
  notes?: string;
}

interface Incident {
  id: string;
  type: string;
  location: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  severityLabel: string;
  reportedAt: string;
  guard: string;
  status: "INVESTIGATING" | "RESOLVED";
  statusLabel: string;
  description: string;
  actionTaken?: string;
}

interface LostItem {
  id: string;
  item: string;
  category: string;
  foundLocation: string;
  foundAt: string;
  status: "SAFEKEEPING" | "RETURNED";
  statusLabel: string;
  finderName: string;
  claimedBy?: string;
  claimDate?: string;
  claimNationalId?: string;
}

export default function MosqueSecurityPage() {
  const { currentLocale, isRtl } = useLocale();
  const dict = SECURITY_DICT[currentLocale];

  const [activeTab, setActiveTab] = useState<"parking" | "incidents" | "lost_found">("parking");
  const [searchQuery, setSearchQuery] = useState("");

  // سجل المركبات
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "PARK-2026-0412",
      plateNumber: "RN-8941-2A",
      type: "سيارة (Voiture)",
      typeCode: "car",
      ownerName: "الحاج إبراهيم تانجا",
      ownerPhone: "+227 90 12 34 56",
      entryTime: "12:15 م (قبل صلاة الظهر)",
      status: "PARKED",
      statusLabel: "متواجدة بأمان في الموقف",
      passCode: "QR-PASS-9081",
      notes: "مركونة في الموقف رقم A-04"
    },
    {
      id: "PARK-2026-0413",
      plateNumber: "MOTO-7731-B",
      type: "دراجة نارية (Moto)",
      typeCode: "moto",
      ownerName: "عمران عبد الله سيسيه",
      ownerPhone: "+227 96 44 22 11",
      entryTime: "12:22 م",
      status: "PARKED",
      statusLabel: "متواجدة بأمان في الموقف",
      passCode: "QR-PASS-9082",
      notes: "موقف الدراجات الشمالي"
    },
    {
      id: "PARK-2026-0409",
      plateNumber: "RN-5510-1C",
      type: "سيارة (Voiture)",
      typeCode: "car",
      ownerName: "الشيخ داودا مصطفى",
      ownerPhone: "+227 88 55 99 00",
      entryTime: "11:45 ص",
      status: "EXITED",
      statusLabel: "تم التحقق والمغادرة بسلام",
      passCode: "QR-PASS-9078",
      notes: "غادر بعد صلاة الجمعة"
    },
  ]);

  // سجل البلاغات الأمنية
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: "INC-2026-0012",
      type: "إغلاق ممر طوارئ للإسعاف",
      location: "البوابة الغربية - بجوار مصلى الجنائز",
      severity: "CRITICAL",
      severityLabel: "حرج - يتطلب تدخلاً فورياً",
      reportedAt: "منذ 15 دقيقة",
      guard: "حارس البوابة: مامادو غاربا",
      status: "INVESTIGATING",
      statusLabel: "جاري التواصل مع صاحب المركبة",
      description: "سيارة مركونة في ممر دخول سيارات الإسعاف تعيق وصولها للبوابة الغربية."
    },
    {
      id: "INC-2026-0011",
      type: "اشتباه في حقيبة متروكة بساحة المسجد",
      location: "أروقة المئذنة الشمالية",
      severity: "HIGH",
      severityLabel: "مهم",
      reportedAt: "أمس بعد صلاة العشاء",
      guard: "رجل الأمن: عبد الرشيد عثمان",
      status: "RESOLVED",
      statusLabel: "تم فحصها واتضح أنها أمتعة معتكف وسُلمت له",
      description: "حقيبة سوداء متوسطة تركت دون صاحب، تم معاينتها والتعرف على صاحبها.",
      actionTaken: "تم التواصل مع صاحبها وتسليمها له بعد مراجعة هويته."
    },
  ]);

  // سجل الأمانات والمفقودات
  const [lostItems, setLostItems] = useState<LostItem[]>([
    {
      id: "LOST-2026-0034",
      item: "مصحف مذهب ومحفظة جلدية بنية",
      category: "كتب ومحافظ",
      foundLocation: "الصف الثاني خلف الإمام",
      foundAt: "صلاة فجر اليوم",
      status: "SAFEKEEPING",
      statusLabel: "محفوظة في خزينة أمانات المسجد",
      finderName: "المؤذن الحاج بلال"
    },
    {
      id: "LOST-2026-0033",
      item: "هاتف محمول سامسونج أسود",
      category: "إلكترونيات",
      foundLocation: "ميضأة الرجال",
      foundAt: "أمس بعد صلاة المغرب",
      status: "RETURNED",
      statusLabel: "تم تسليمه لصاحبه بوصل رسمي",
      finderName: "خادم المسجد ساليفو",
      claimedBy: "محمد يحيى المودن",
      claimDate: "أمس 08:30 م",
      claimNationalId: "NID-227-8910"
    },
  ]);

  // LocalStorage Persistence
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const v = localStorage.getItem("manara_security_vehicles");
        if (v) setVehicles(JSON.parse(v));
        const inc = localStorage.getItem("manara_security_incidents");
        if (inc) setIncidents(JSON.parse(inc));
        const l = localStorage.getItem("manara_security_lost");
        if (l) setLostItems(JSON.parse(l));
      } catch (e) {
        console.warn("Storage load error", e);
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const saveVehicles = (list: Vehicle[]) => {
    setVehicles(list);
    try { localStorage.setItem("manara_security_vehicles", JSON.stringify(list)); } catch (e) {}
  };

  const saveIncidents = (list: Incident[]) => {
    setIncidents(list);
    try { localStorage.setItem("manara_security_incidents", JSON.stringify(list)); } catch (e) {}
  };

  const saveLostItems = (list: LostItem[]) => {
    setLostItems(list);
    try { localStorage.setItem("manara_security_lost", JSON.stringify(list)); } catch (e) {}
  };

  // حالة النوافذ المنبثقة (Modals)
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedVehicleForQr, setSelectedVehicleForQr] = useState<Vehicle | null>(null);

  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false);
  const [newPlate, setNewPlate] = useState("");
  const [newType, setNewType] = useState<"car" | "moto">("car");
  const [newOwnerName, setNewOwnerName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosReason, setSosReason] = useState("طوارئ صحية وإسعاف");
  const [sosLocation, setSosLocation] = useState("الصحن الداخلي للمسجد");
  const [sosNotes, setSosNotes] = useState("");
  const [sosSentSuccess, setSosSentSuccess] = useState(false);

  const [isNewIncidentOpen, setIsNewIncidentOpen] = useState(false);
  const [incType, setIncType] = useState("");
  const [incLocation, setIncLocation] = useState("");
  const [incSeverity, setIncSeverity] = useState<"CRITICAL" | "HIGH" | "MEDIUM">("HIGH");
  const [incGuard, setIncGuard] = useState("حارس الأمن المناوب");
  const [incDesc, setIncDesc] = useState("");

  const [isNewLostItemOpen, setIsNewLostItemOpen] = useState(false);
  const [lostItemTitle, setLostItemTitle] = useState("");
  const [lostCategory, setLostCategory] = useState("متنوعات");
  const [lostLoc, setLostLoc] = useState("");
  const [lostFinder, setLostFinder] = useState("");

  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedLostItem, setSelectedLostItem] = useState<LostItem | null>(null);
  const [claimantName, setClaimantName] = useState("");
  const [claimantId, setClaimantId] = useState("");

  // تسجيل مركبة جديدة
  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlate.trim()) return;

    const newV: Vehicle = {
      id: `PARK-${Date.now().toString().slice(-4)}`,
      plateNumber: newPlate.toUpperCase().trim(),
      type: newType === "car" ? "سيارة (Voiture)" : "دراجة نارية (Moto)",
      typeCode: newType,
      ownerName: newOwnerName.trim() || "مصلي كرام",
      ownerPhone: newPhone.trim() || "+227 -- -- -- --",
      entryTime: new Intl.DateTimeFormat("ar-EG", { hour: "2-digit", minute: "2-digit", hour12: true }).format(new Date()),
      status: "PARKED",
      statusLabel: "متواجدة بأمان في الموقف",
      passCode: `QR-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: newNotes.trim()
    };

    const updated = [newV, ...vehicles];
    saveVehicles(updated);
    setIsAddVehicleOpen(false);
    setNewPlate("");
    setNewOwnerName("");
    setNewPhone("");
    setNewNotes("");

    // فتح تذكرة الـ QR تلقائياً لطباعتها أو مسحها
    setSelectedVehicleForQr(newV);
    setIsQrModalOpen(true);
  };

  // تغيير حالة المركبة (تسجيل خروج / إعادة دخول)
  const handleToggleVehicleStatus = (vehicleId: string) => {
    const updated = vehicles.map(v => {
      if (v.id === vehicleId) {
        const isNowExited = v.status === "PARKED";
        return {
          ...v,
          status: isNowExited ? ("EXITED" as const) : ("PARKED" as const),
          statusLabel: isNowExited ? "تم التحقق والمغادرة بسلام" : "متواجدة بأمان في الموقف"
        };
      }
      return v;
    });
    saveVehicles(updated);
  };

  // إرسال نداء SOS طوارئ
  const handleSendSos = (e: React.FormEvent) => {
    e.preventDefault();
    setSosSentSuccess(true);

    // إضافة بلاغ فوري في السجل
    const newInc: Incident = {
      id: `SOS-${Date.now().toString().slice(-4)}`,
      type: `نداء استغاثة طارئ: ${sosReason}`,
      location: sosLocation,
      severity: "CRITICAL",
      severityLabel: "حرج جداً - استغاثة فورية",
      reportedAt: "الآن",
      guard: "منظومة الاستجابة السريعة (SOS)",
      status: "INVESTIGATING",
      statusLabel: "جاري استدعاء الإسعاف والفرق الطبية",
      description: sosNotes || "تم إطلاق نداء الطوارئ من لوحة التحكم لتوجيه المساعدين والمسؤولين فوراً."
    };

    saveIncidents([newInc, ...incidents]);

    setTimeout(() => {
      setSosSentSuccess(false);
      setIsSosModalOpen(false);
      setSosNotes("");
    }, 2000);
  };

  // إضافة بلاغ أمني
  const handleAddIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incType.trim()) return;

    const newInc: Incident = {
      id: `INC-${Date.now().toString().slice(-4)}`,
      type: incType.trim(),
      location: incLocation.trim() || "ساحة المسجد",
      severity: incSeverity,
      severityLabel: incSeverity === "CRITICAL" ? "حرج - يتطلب تدخلاً فورياً" : incSeverity === "HIGH" ? "مهم" : "متوسط",
      reportedAt: "الآن",
      guard: incGuard.trim() || "الحارس المناوب",
      status: "INVESTIGATING",
      statusLabel: "قيد المتابعة والمعالجة",
      description: incDesc.trim() || "بلاغ مسجل للمتابعة الأمنية."
    };

    saveIncidents([newInc, ...incidents]);
    setIsNewIncidentOpen(false);
    setIncType("");
    setIncLocation("");
    setIncDesc("");
  };

  // حل البلاغ الأمني
  const handleResolveIncident = (incId: string) => {
    const updated = incidents.map(inc => {
      if (inc.id === incId) {
        return {
          ...inc,
          status: "RESOLVED" as const,
          statusLabel: "تمت المعالجة والإغلاق بسلام",
          actionTaken: "تم إنهاء الإجراء بنجاح وتأمين الموقع."
        };
      }
      return inc;
    });
    saveIncidents(updated);
  };

  // إضافة أمانة / مفقود جديد
  const handleAddLostItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostItemTitle.trim()) return;

    const newItem: LostItem = {
      id: `LOST-${Date.now().toString().slice(-4)}`,
      item: lostItemTitle.trim(),
      category: lostCategory,
      foundLocation: lostLoc.trim() || "صحن المسجد",
      foundAt: "اليوم",
      status: "SAFEKEEPING",
      statusLabel: "محفوظة في خزينة أمانات المسجد",
      finderName: lostFinder.trim() || "فاعل خير"
    };

    saveLostItems([newItem, ...lostItems]);
    setIsNewLostItemOpen(false);
    setLostItemTitle("");
    setLostLoc("");
    setLostFinder("");
  };

  // تسليم الأمانة لصاحبها بوصل
  const handleClaimItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLostItem || !claimantName.trim()) return;

    const updated = lostItems.map(item => {
      if (item.id === selectedLostItem.id) {
        return {
          ...item,
          status: "RETURNED" as const,
          statusLabel: "تم تسليمه لصاحبه بوصل رسمي",
          claimedBy: claimantName.trim(),
          claimNationalId: claimantId.trim() || "تم التحقق بالمعاينة",
          claimDate: "الآن"
        };
      }
      return item;
    });

    saveLostItems(updated);
    setIsClaimModalOpen(false);
    setClaimantName("");
    setClaimantId("");
    setSelectedLostItem(null);
  };

  return (
    <div 
      className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 selection:bg-rose-500 selection:text-white ${isRtl ? "rtl font-sans" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-900/30 shrink-0">
              <ShieldAlert className="w-7 h-7 text-white stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white flex flex-wrap items-center gap-2">
                {dict.title}
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  {dict.badge}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {dict.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => setIsSosModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-900/40 transition flex items-center gap-2 active:scale-95 cursor-pointer ring-2 ring-rose-500/30 animate-pulse"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>إرسال نداء طوارئ (SOS)</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
          {[
            { id: "parking", label: dict.tabParking, icon: Car, count: vehicles.filter(v => v.status === "PARKED").length },
            { id: "incidents", label: dict.tabIncidents, icon: AlertTriangle, count: incidents.filter(i => i.status === "INVESTIGATING").length },
            { id: "lost_found", label: dict.tabLost, icon: Package, count: lostItems.filter(l => l.status === "SAFEKEEPING").length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(tab.id as "parking" | "incidents" | "lost_found")
              }
              className={`flex-1 py-3 px-3 sm:px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-rose-600 text-white shadow-md shadow-rose-900/40"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.slice(0, 15)}...</span>
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-800 text-rose-400"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search & Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-9 pl-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {activeTab === "parking" && (
              <button 
                onClick={() => setIsAddVehicleOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>تسجيل دخول مركبة جديدة</span>
              </button>
            )}
            {activeTab === "incidents" && (
              <button 
                onClick={() => setIsNewIncidentOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>تسجيل بلاغ أمني جديد</span>
              </button>
            )}
            {activeTab === "lost_found" && (
              <button 
                onClick={() => setIsNewLostItemOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>تسجيل مفقود جديد</span>
              </button>
            )}
          </div>
        </div>

        {/* ============================================================== */}
        {/* Tab 1: Vehicle Parking */}
        {/* ============================================================== */}
        {activeTab === "parking" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <WifiOff className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">نظام حارس البوابة الذكي (Gate Scanner) يعمل أوفلاين</h3>
                  <p className="text-xs text-slate-400">مسح لوحات المركبات وتوليد بطاقات الوقوف مستمر حتى في انقطاع شبكة المسجد كلياً</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1.5 rounded-xl border border-emerald-800/40">
                  {vehicles.filter(v => v.status === "PARKED").length} مركبة بالموقف الآن
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {vehicles
                .filter(v => 
                  v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  v.ownerPhone.includes(searchQuery) ||
                  v.ownerName.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((v) => (
                <div 
                  key={v.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-rose-500/30 transition shadow-lg"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-black text-white bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 tracking-wider">
                        {v.plateNumber}
                      </span>
                      {v.typeCode === "car" ? (
                        <Car className="w-5 h-5 text-slate-400" />
                      ) : (
                        <Bike className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="text-slate-400 flex justify-between">
                        <span>نوع المركبة:</span>
                        <strong className="text-slate-200">{v.type}</strong>
                      </div>
                      <div className="text-slate-400 flex justify-between">
                        <span>صاحب المركبة:</span>
                        <strong className="text-slate-200">{v.ownerName}</strong>
                      </div>
                      <div className="text-slate-400 flex justify-between">
                        <span>وقت الدخول:</span>
                        <strong className="text-slate-200">{v.entryTime}</strong>
                      </div>
                      <div className="text-slate-400 flex justify-between">
                        <span>هاتف المصلي:</span>
                        <strong className="text-emerald-400 font-mono" dir="ltr">{v.ownerPhone}</strong>
                      </div>
                      {v.notes && (
                        <div className="text-[11px] text-slate-400 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                          {v.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleToggleVehicleStatus(v.id)}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1 ${
                        v.status === "PARKED"
                          ? "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700"
                      }`}
                      title="انقر لتغيير الحالة (دخول / خروج)"
                    >
                      <LogOut className="w-3 h-3" />
                      <span>{v.statusLabel}</span>
                    </button>

                    <button 
                      onClick={() => {
                        setSelectedVehicleForQr(v);
                        setIsQrModalOpen(true);
                      }}
                      className="text-xs font-bold text-rose-400 hover:text-rose-300 flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-500/20 cursor-pointer transition active:scale-95"
                    >
                      <QrCode className="w-3.5 h-3.5" /> 
                      <span>تذكرة QR</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* Tab 2: Incidents */}
        {/* ============================================================== */}
        {activeTab === "incidents" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                البلاغات الأمنية ونوبات الحراسة المسجدية
              </h2>
              <span className="text-xs text-rose-400 font-bold bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800/40">
                {incidents.filter(i => i.status === "INVESTIGATING").length} بلاغ قيد المتابعة
              </span>
            </div>

            <div className="space-y-4">
              {incidents
                .filter(i => 
                  i.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  i.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  i.id.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((inc) => (
                <div 
                  key={inc.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg hover:border-slate-700 transition"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-800/40">
                        {inc.id}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        inc.severity === "CRITICAL" ? "bg-red-950/80 text-red-400 border border-red-800/50" :
                        inc.severity === "HIGH" ? "bg-amber-950/80 text-amber-400 border border-amber-800/50" :
                        "bg-slate-800 text-slate-300"
                      }`}>
                        {inc.severityLabel}
                      </span>
                      <span className="text-xs text-slate-500">• {inc.reportedAt}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{inc.type}</h4>
                    <p className="text-xs text-slate-300">{inc.description}</p>
                    <p className="text-[11px] text-slate-400">{inc.location} - مسجل بواسطة: <strong className="text-slate-300">{inc.guard}</strong></p>
                    
                    {inc.actionTaken && (
                      <p className="text-[11px] text-emerald-400 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-900/40">
                        ✓ الإجراء المتخذ: {inc.actionTaken}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-xl text-center min-w-[150px] ${
                      inc.status === "RESOLVED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse"
                    }`}>
                      {inc.statusLabel}
                    </span>

                    {inc.status === "INVESTIGATING" && (
                      <button
                        onClick={() => handleResolveIncident(inc.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1 active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تمت المعالجة</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* Tab 3: Lost & Found */}
        {/* ============================================================== */}
        {activeTab === "lost_found" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                أرشيف المفقودات والأمانات المتروكة في المسجد
              </h2>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                {lostItems.filter(l => l.status === "SAFEKEEPING").length} أمانة قيد الحفظ
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lostItems
                .filter(item => 
                  item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.foundLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.id.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => (
                <div 
                  key={item.id}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-lg hover:border-slate-700 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded border border-emerald-800/40">
                        {item.id}
                      </span>
                      <span className="text-xs text-slate-500">{item.foundAt}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{item.item}</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        مكان العثور: <strong className="text-slate-300">{item.foundLocation}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        سُلّمت بواسطة: {item.finderName}
                      </p>
                    </div>

                    {item.claimedBy && (
                      <div className="text-[11px] bg-emerald-950/40 p-2 rounded-xl border border-emerald-900/40 text-emerald-300 space-y-0.5">
                        <div className="font-bold">✓ تم التسليم لصاحبه: {item.claimedBy}</div>
                        <div className="text-slate-400">الهوية / الوصل: {item.claimNationalId} • التاريخ: {item.claimDate}</div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === "SAFEKEEPING" 
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    }`}>
                      {item.statusLabel}
                    </span>

                    {item.status === "SAFEKEEPING" ? (
                      <button 
                        onClick={() => {
                          setSelectedLostItem(item);
                          setIsClaimModalOpen(true);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>تسليم بوصل استلام</span>
                      </button>
                    ) : (
                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-400" /> مكتمل ومسلّم
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ============================================================== */}
      {/* Modal 1: بطاقة وتذكرة الـ QR للمركبة مع إمكانية الطباعة والمشاركة */}
      {/* ============================================================== */}
      {isQrModalOpen && selectedVehicleForQr && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative">
            <button 
              onClick={() => setIsQrModalOpen(false)}
              className="absolute top-4 left-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400 mx-auto">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-white">بطاقة دخول الموقف الرقمية</h3>
              <p className="text-xs text-slate-400">تذكرة التحقق الأمني لمواقف الجامع</p>
            </div>

            {/* بطاقة التذكرة للطباعة */}
            <div id="print-ticket" className="bg-white text-slate-950 p-5 rounded-2xl space-y-4 shadow-inner text-center border-2 border-slate-200">
              <div className="border-b border-dashed border-slate-300 pb-2">
                <span className="text-[10px] font-bold text-slate-500 block">منظومة منارة لرعاية المساجد والأوقاف</span>
                <span className="text-xs font-black text-slate-900 block">جامع ومركز حي السلام - مرادي</span>
              </div>

              {/* باركود QR مرئي بمربعات أنيقة */}
              <div className="p-3 bg-slate-50 rounded-xl inline-block border border-slate-200">
                <div className="w-36 h-36 bg-slate-950 p-2.5 rounded-lg flex flex-col justify-between mx-auto shadow">
                  <div className="flex justify-between">
                    <div className="w-8 h-8 border-4 border-white bg-slate-950 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white" />
                    </div>
                    <div className="w-8 h-8 border-4 border-white bg-slate-950 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center font-mono text-[10px] font-black text-white tracking-widest">
                    {selectedVehicleForQr.passCode}
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="w-8 h-8 border-4 border-white bg-slate-950 flex items-center justify-center">
                      <div className="w-3 h-3 bg-white" />
                    </div>
                    <div className="w-4 h-4 bg-emerald-400 rounded-sm" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-lg font-black tracking-widest text-slate-950 block bg-slate-100 py-1 rounded-lg">
                  {selectedVehicleForQr.plateNumber}
                </span>
                <span className="text-xs font-bold text-slate-700 block">{selectedVehicleForQr.type}</span>
                <div className="text-[11px] text-slate-500 pt-1 flex justify-between border-t border-slate-200">
                  <span>الدخول: {selectedVehicleForQr.entryTime}</span>
                  <span className="font-mono">{selectedVehicleForQr.id}</span>
                </div>
              </div>

              <div className="text-[9px] text-slate-500 border-t border-dashed border-slate-300 pt-2">
                * يرجى إبراز هذا الكود لحارس البوابة عند المغادرة لاستلام المركبة بأمان.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة التذكرة</span>
              </button>

              <button 
                onClick={() => {
                  if (typeof navigator !== "undefined" && navigator.clipboard) {
                    navigator.clipboard.writeText(`تذكرة موقف المسجد رقم ${selectedVehicleForQr.plateNumber} كود: ${selectedVehicleForQr.passCode}`);
                    alert("تم نسخ تفاصيل التذكرة بنجاح!");
                  }
                }}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer"
                title="نسخ ومشاركة"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Modal 2: تسجيل دخول مركبة جديدة */}
      {/* ============================================================== */}
      {isAddVehicleOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Car className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">تسجيل دخول مركبة إلى مواقف المسجد</h3>
              </div>
              <button 
                onClick={() => setIsAddVehicleOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">رقم لوحة المركبة (Immatriculation) :</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: RN-8941-2A أو MOTO-551"
                  value={newPlate}
                  onChange={(e) => setNewPlate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase placeholder-slate-600 focus:outline-none focus:border-emerald-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">نوع المركبة :</label>
                  <select 
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as "car" | "moto")}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="car">سيارة (Voiture)</option>
                    <option value="moto">دراجة نارية (Moto)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">هاتف المصلي (اختياري) :</label>
                  <input 
                    type="text" 
                    placeholder="+227 -- -- -- --"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">اسم المصلي أو السائق :</label>
                <input 
                  type="text" 
                  placeholder="مثال: الحاج عبد القادر"
                  value={newOwnerName}
                  onChange={(e) => setNewOwnerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">ملاحظات / مكان الركن :</label>
                <input 
                  type="text" 
                  placeholder="مثال: الموقف الشرقي بالقرب من الباب رقم 3"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl shadow transition cursor-pointer"
                >
                  حفظ وتوليد تذكرة الـ QR
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddVehicleOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Modal 3: إرسال نداء استغاثة SOS */}
      {/* ============================================================== */}
      {isSosModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-rose-600/50 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-600 text-white rounded-xl animate-bounce">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">إرسال نداء طوارئ واستغاثة (SOS)</h3>
                  <p className="text-[11px] text-rose-400">تنبيه فرق الحراسة والإسعاف وإدارة المسجد</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSosModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sosSentSuccess ? (
              <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">تم إرسال نداء الطوارئ بنجاح!</h4>
                <p className="text-xs text-slate-300">تم إشعار الحراس وفرق الإسعاف وتسجيل الحالة في لوحة البلاغات الحرجة.</p>
              </div>
            ) : (
              <form onSubmit={handleSendSos} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">نوع حالة الطوارئ :</label>
                  <select 
                    value={sosReason}
                    onChange={(e) => setSosReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500 font-bold"
                  >
                    <option value="طوارئ صحية وإسعاف">طوارئ صحية وإغماء (Besoin d&apos;ambulance)</option>
                    <option value="إغلاق ممر طوارئ للإسعاف">إغلاق ممر طوارئ أو حريق (Obstruction voie)</option>
                    <option value="اشتباه أمني أو عبث بمركبات">اشتباه أمني أو محاولة سرقة (Sécurité)</option>
                    <option value="تزاحم وتدافع غير طبيعي">تزاحم وتدافع في الأبواب</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">الموقع المحدد داخل/حول المسجد :</label>
                  <input 
                    type="text" 
                    required
                    value={sosLocation}
                    onChange={(e) => setSosLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">تفاصيل إضافية للتدخل السريع :</label>
                  <textarea 
                    rows={3}
                    placeholder="اكتب وصفاً سريعاً لتوجيه المسعفين أو حراس البوابات..."
                    value={sosNotes}
                    onChange={(e) => setSosNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>إطلاق النداء فوراً (Diffuser l&apos;alerte)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSosModalOpen(false)}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Modal 4: تسجيل بلاغ أمني جديد */}
      {/* ============================================================== */}
      {isNewIncidentOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">تسجيل بلاغ أمني / حادثة</h3>
              </div>
              <button 
                onClick={() => setIsNewIncidentOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddIncident} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">عنوان البلاغ :</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: محاولة فتح دراجة نارية بدون تذكرة"
                  value={incType}
                  onChange={(e) => setIncType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">درجة الخطورة :</label>
                  <select 
                    value={incSeverity}
                    onChange={(e) =>
                      setIncSeverity(e.target.value as "CRITICAL" | "HIGH" | "MEDIUM")
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="CRITICAL">حرج (Urgence absolue)</option>
                    <option value="HIGH">مهم (Important)</option>
                    <option value="MEDIUM">متوسط (Moyen)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">اسم الحارس المناوب :</label>
                  <input 
                    type="text" 
                    value={incGuard}
                    onChange={(e) => setIncGuard(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">الموقع :</label>
                <input 
                  type="text" 
                  placeholder="مثال: البوابة الشمالية بجوار الميضأة"
                  value={incLocation}
                  onChange={(e) => setIncLocation(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">وصف الحادثة :</label>
                <textarea 
                  rows={3}
                  placeholder="شرح ملخص لما تمت ملاحظته والإجراءات الأولية..."
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow transition cursor-pointer"
                >
                  حفظ وتسجيل البلاغ
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewIncidentOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Modal 5: تسجيل مفقود جديد */}
      {/* ============================================================== */}
      {isNewLostItemOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">تسجيل أمانة أو مفقود في المسجد</h3>
              </div>
              <button 
                onClick={() => setIsNewLostItemOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddLostItem} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">وصف الشيء المعثور عليه :</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: ساعة يد فضية، نظارة طبية، حقيبة صغيرة..."
                  value={lostItemTitle}
                  onChange={(e) => setLostItemTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">التصنيف :</label>
                  <select 
                    value={lostCategory}
                    onChange={(e) => setLostCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="إلكترونيات">إلكترونيات وهواتف</option>
                    <option value="كتب ومحافظ">محافظ ومصاحف</option>
                    <option value="مفاتيح">مفاتيح وبطاقات</option>
                    <option value="ملبوسات">ملابس وأحذية</option>
                    <option value="متنوعات">متنوعات أخرى</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">اسم من عثر عليها :</label>
                  <input 
                    type="text" 
                    placeholder="مثال: فاعل خير / خادم المسجد"
                    value={lostFinder}
                    onChange={(e) => setLostFinder(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">مكان العثور عليها بدقة :</label>
                <input 
                  type="text" 
                  placeholder="مثال: رف الأحذية عند المدخل الرئيسي"
                  value={lostLoc}
                  onChange={(e) => setLostLoc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition cursor-pointer"
                >
                  حفظ في سجل الأمانات
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewLostItemOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* Modal 6: تسليم أمانة بوصل استلام رسمي */}
      {/* ============================================================== */}
      {isClaimModalOpen && selectedLostItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">تسليم أمانة بوصل استلام رسمي</h3>
              </div>
              <button 
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
              <div className="text-slate-400">الأمانة المستلمة: <strong className="text-white">{selectedLostItem.item}</strong></div>
              <div className="text-slate-400">الرقم المرجعي: <strong className="text-emerald-400 font-mono">{selectedLostItem.id}</strong></div>
            </div>

            <form onSubmit={handleClaimItem} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">الاسم الكامل للمستلم :</label>
                <input 
                  type="text" 
                  required
                  placeholder="اسم صاحب الأمانة الشرعي"
                  value={claimantName}
                  onChange={(e) => setClaimantName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">رقم بطاقة الهوية الوطنية أو الهاتف :</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: NID-227-XXXX أو رقم الهاتف مع التأكد من الأوصاف"
                  value={claimantId}
                  onChange={(e) => setClaimantId(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow transition cursor-pointer"
                >
                  تأكيد التسليم وتوثيق الوصل
                </button>
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
