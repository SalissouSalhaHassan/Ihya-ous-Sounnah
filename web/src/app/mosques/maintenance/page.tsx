"use client";

import React, { useState } from "react";
import { 
  Building2, 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Camera, 
  DollarSign, 
  Plus, 
  Sun, 
  Droplet, 
  Volume2,
  Sparkles,
  Filter,
  Calendar,
  X,
  Check,
  ArrowRight,
  ShieldCheck,
  FileText
} from "lucide-react";
import { useLocale } from "@/lib/locale-context";
import { MAINTENANCE_DICT } from "@/lib/module-i18n";

export default function MaintenanceTicketsPage() {
  const { currentLocale, isRtl } = useLocale();
  const dict = MAINTENANCE_DICT[currentLocale];

  // تذاكر الصيانة الميدانية
  const [tickets, setTickets] = useState([
    {
      id: "TCK-2026-0041",
      mosqueName: "جامع النور الكبير (Grande Mosquée En-Nour)",
      location: "حي السلام - نيامي",
      issueType: "صيانة منظومة الصوتيات والميكروفونات",
      category: "صوتيات",
      icon: Volume2,
      priority: "CRITICAL",
      priorityLabel: "عاجل - قبل الجمعة",
      status: "IN_PROGRESS",
      statusLabel: "قيد التنفيذ الميداني",
      estimatedCost: "85,000 XOF",
      technician: "المهندس إبراهيم عثمان",
      dateReported: "14 شوال 1447",
      photosCount: 3,
      beforePhoto: "صوتيات المنبر متهالكة وبها تشويش مستمر قبل الجمعة",
      afterPhoto: "تم استبدال الكابلات ومكسر الصوت بانتظار الفحص النهائي",
      notes: "تم تأمين مكبر صوت احتياطي مؤقت لحين اكتمال التركيب",
    },
    {
      id: "TCK-2026-0042",
      mosqueName: "مسجد الفاروق عمر (Mosquée Al-Farouq)",
      location: "قرية دان كولودو",
      issueType: "صيانة عوازل ألواح الطاقة الشمسية واستبدال بطارية",
      category: "طاقة شمسية",
      icon: Sun,
      priority: "HIGH",
      priorityLabel: "أولوية مرتفعة",
      status: "PENDING_APPROVAL",
      statusLabel: "بانتظار اعتماد الميزانية",
      estimatedCost: "240,000 XOF",
      technician: "فريق صيانة الطاقة المتجددة",
      dateReported: "13 شوال 1447",
      photosCount: 4,
      beforePhoto: "انخفاض جهد البطاريات إلى 10V وعطل في منظم الشحن",
      afterPhoto: "تجهيز بطاريتي جل 200Ah مع قواطع حماية جديدة",
      notes: "المسجد يعتمد كلياً على الطاقة الشمسية لإنارة الفجر والعشاء",
    },
    {
      id: "TCK-2026-0039",
      mosqueName: "مصلى الهدى الخيري (Musalla Al-Huda)",
      location: "ضواحي مرادي",
      issueType: "إصلاح تسريب مضخة المياه وتبديل حنفيات الميضأة",
      category: "سباكة ومياه",
      icon: Droplet,
      priority: "MEDIUM",
      priorityLabel: "أولوية متوسطة",
      status: "RESOLVED",
      statusLabel: "مكتمل ومعتمد",
      estimatedCost: "45,000 XOF",
      technician: "المعلم يحيى تانكو",
      dateReported: "10 شوال 1447",
      photosCount: 2,
      beforePhoto: "تسريب حاد في خزان الميضأة وهدر للمياه",
      afterPhoto: "تم تغيير السباكة بالكامل وعزل الخزان بمادة الإيبوكسي",
      notes: "تمت زيارة التفتيش الميداني وتأكيد اكتمال الصيانة بنجاح",
    },
  ]);

  // نافذة إضافة بلاغ جديد
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMosqueName, setNewMosqueName] = useState("جامع النور الكبير - نيامي");
  const [newLocation, setNewLocation] = useState("حي السلام - نيامي");
  const [newIssueType, setNewIssueType] = useState("");
  const [newCategory, setNewCategory] = useState("صوتيات");
  const [newPriority, setNewPriority] = useState("CRITICAL");
  const [newEstimatedCost, setNewEstimatedCost] = useState("75,000");
  const [newTechnician, setNewTechnician] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [addSuccess, setAddSuccess] = useState(false);

  // نافذة عرض التقرير والصور التوثيقية
  const [selectedTicket, setSelectedTicket] = useState<(typeof tickets)[number] | null>(null);

  // ميزات الفلترة والبحث السريع
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredTickets = tickets.filter((t) => {
    const matchesFilter = 
      filterStatus === "ALL" ? true :
      filterStatus === "CRITICAL" ? t.priority === "CRITICAL" :
      t.status === filterStatus;
    
    const matchesSearch = 
      t.mosqueName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.issueType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  // تحديث حالة التذكرة مباشرة
  const handleUpdateStatus = (id: string, newStatus: string, newStatusLabel: string) => {
    setTickets(tickets.map((t) => t.id === id ? { ...t, status: newStatus, statusLabel: newStatusLabel } : t));
    if (selectedTicket && selectedTicket.id === id) {
      setSelectedTicket({ ...selectedTicket, status: newStatus, statusLabel: newStatusLabel });
    }
  };

  return (
    <div 
      className={`min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 selection:bg-amber-500 selection:text-white ${isRtl ? "rtl font-sans" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur border border-slate-800 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-900/30">
              <Wrench className="w-7 h-7 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                {dict.title}
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {dict.badge}
                </span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {dict.subtitle}
              </p>
            </div>
          </div>

          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-2 active:scale-95 cursor-pointer ring-2 ring-amber-400/30"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            {dict.newTicketBtn}
            رفع بلاغ صيانة جديد
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "إجمالي بلاغات هذا الشهر", value: (tickets.length + 25).toString(), icon: Wrench, color: "text-amber-400" },
            { label: "أعطال حرجة قبل الجمعة", value: tickets.filter(t => t.priority === "CRITICAL").length.toString(), icon: AlertTriangle, color: "text-rose-400" },
            { label: "مشاريع صيانة قيد التنفيذ", value: tickets.filter(t => t.status === "IN_PROGRESS").length.toString(), icon: Clock, color: "text-cyan-400" },
            { label: "تم إنجازها بنجاح", value: tickets.filter(t => t.status === "RESOLVED").length.toString(), icon: CheckCircle2, color: "text-emerald-400" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center gap-4 hover:border-slate-700 transition">
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
              <div>
                <div className="text-xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tickets Filter & Search Bar - ميزة إضافية ذكية */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "ALL", label: "كافة التذاكر", count: tickets.length },
              { id: "CRITICAL", label: "حرجة قبل الجمعة", count: tickets.filter(t => t.priority === "CRITICAL").length },
              { id: "IN_PROGRESS", label: "قيد التنفيذ", count: tickets.filter(t => t.status === "IN_PROGRESS").length },
              { id: "PENDING_APPROVAL", label: "بانتظار الميزانية", count: tickets.filter(t => t.status === "PENDING_APPROVAL").length },
              { id: "RESOLVED", label: "مكتملة", count: tickets.filter(t => t.status === "RESOLVED").length },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  filterStatus === f.id
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-900/20"
                    : "bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                <span>{f.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  filterStatus === f.id ? "bg-slate-950/20 text-slate-950" : "bg-slate-900 text-slate-400"
                }`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="بحث بالمسجد أو العطل أو الحي..."
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 w-full sm:w-56"
            />
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              سجل التذاكر والزيارات الميدانية للمفتشين
            </h2>
            <span className="text-xs text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800/40 font-bold">
              {filteredTickets.length} بلاغات مطابقة
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredTickets.map((ticket) => (
              <div 
                key={ticket.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-800/40">
                      {ticket.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      ticket.priority === "CRITICAL"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/30"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    }`}>
                      {ticket.priorityLabel}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" /> {ticket.dateReported}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <ticket.icon className="w-5 h-5 text-amber-400" />
                      {ticket.issueType}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <strong className="text-slate-200">{ticket.mosqueName}</strong> - {ticket.location}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Camera className="w-3.5 h-3.5 text-cyan-400" /> {ticket.photosCount} صور توثيق (قبل وبعد)
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> التكلفة التقديرية: <strong className="text-white">{ticket.estimatedCost}</strong>
                    </span>
                    <span className="text-slate-400">
                      المكلف: <strong className="text-slate-200">{ticket.technician}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col items-end justify-between gap-3 min-w-[180px]">
                  <button
                    onClick={() => {
                      if (ticket.status === "PENDING_APPROVAL") {
                        handleUpdateStatus(ticket.id, "IN_PROGRESS", "قيد التنفيذ الميداني");
                      } else if (ticket.status === "IN_PROGRESS") {
                        handleUpdateStatus(ticket.id, "RESOLVED", "مكتمل ومعتمد");
                      }
                    }}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl text-center w-full block transition cursor-pointer ${
                      ticket.status === "RESOLVED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        : ticket.status === "IN_PROGRESS"
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20"
                    }`}
                  >
                    {ticket.statusLabel}
                  </button>

                  <button 
                    onClick={() => setSelectedTicket(ticket)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-400" />
                    <span>عرض التقرير والصور</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal 1: نافذة رفع بلاغ صيانة جديد */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-900 border border-amber-900/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">رفع بلاغ صيانة وتجهيز مسجد</h3>
                    <p className="text-xs text-slate-400">تسجيل عطل ميداني وتوجيه التكليف للمهندس المختص</p>
                  </div>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {addSuccess ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-amber-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">تم قيد تذكرة الصيانة بنجاح!</h4>
                  <p className="text-xs text-slate-400">تم تعيين رقم البلاغ وإشعار فريق الصيانة الميداني للمسجد.</p>
                </div>
              ) : (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newIssueType.trim()) return;

                    const newTicketItem = {
                      id: `TCK-2026-00${Math.floor(45 + Math.random() * 50)}`,
                      mosqueName: newMosqueName.trim(),
                      location: newLocation.trim(),
                      issueType: newIssueType.trim(),
                      category: newCategory,
                      icon: newCategory === "طاقة شمسية" ? Sun : newCategory === "سباكة ومياه" ? Droplet : Volume2,
                      priority: newPriority,
                      priorityLabel: newPriority === "CRITICAL" ? "عاجل - قبل الجمعة" : newPriority === "HIGH" ? "أولوية مرتفعة" : "أولوية متوسطة",
                      status: "IN_PROGRESS",
                      statusLabel: "قيد التنفيذ الميداني",
                      estimatedCost: `${newEstimatedCost} XOF`,
                      technician: newTechnician.trim() || "مهندس الصيانة الميداني المعتمد",
                      dateReported: "اليوم",
                      photosCount: 2,
                      beforePhoto: "صورة المعاينة الأولية للعطل الميداني",
                      afterPhoto: "بانتظار اكتمال الإصلاحات وتوثيق مرحلة ما بعد الصيانة",
                      notes: newNotes.trim() || "تم استلام البلاغ ومباشرة أعمال المعاينة الفنية.",
                    };

                    setTickets([newTicketItem, ...tickets]);
                    setAddSuccess(true);
                    setTimeout(() => {
                      setAddSuccess(false);
                      setIsAddModalOpen(false);
                      setNewIssueType("");
                      setNewNotes("");
                    }, 1500);
                  }}
                  className="space-y-4 text-xs"
                >
                  <div>
                    <label className="text-slate-300 font-bold block mb-1">اسم المسجد / المصلى: *</label>
                    <input 
                      type="text" 
                      required 
                      value={newMosqueName} 
                      onChange={(e) => setNewMosqueName(e.target.value)} 
                      placeholder="مثال: جامع النور الكبير" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">الموقع / الحي: *</label>
                      <input 
                        type="text" 
                        required 
                        value={newLocation} 
                        onChange={(e) => setNewLocation(e.target.value)} 
                        placeholder="مثال: حي السلام - نيامي" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">تصنيف العطل والتجهيز:</label>
                      <select 
                        value={newCategory} 
                        onChange={(e) => setNewCategory(e.target.value)} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      >
                        <option value="صوتيات">صوتيات وميكروفونات</option>
                        <option value="طاقة شمسية">طاقة شمسية وإنارة</option>
                        <option value="سباكة ومياه">مياه وميضأة وآبار</option>
                        <option value="تكييف وتهوية">تكييف ومراوح المسجد</option>
                        <option value="فرش وترميم">فرش وسجاد وعزل أسطح</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">وصف العطل أو التجهيز المطلوب: *</label>
                    <input 
                      type="text" 
                      required 
                      value={newIssueType} 
                      onChange={(e) => setNewIssueType(e.target.value)} 
                      placeholder="مثال: استبدال مايك المنبر وعزل لوحات الطاقة الشمسية" 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">درجة الأهمية:</label>
                      <select 
                        value={newPriority} 
                        onChange={(e) => setNewPriority(e.target.value)} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                      >
                        <option value="CRITICAL">عاجل - قبل الجمعة</option>
                        <option value="HIGH">أولوية مرتفعة</option>
                        <option value="MEDIUM">أولوية متوسطة</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">التكلفة التقديرية (XOF):</label>
                      <input 
                        type="text" 
                        value={newEstimatedCost} 
                        onChange={(e) => setNewEstimatedCost(e.target.value)} 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 font-bold block mb-1">الفني / المهندس المكلف:</label>
                      <input 
                        type="text" 
                        value={newTechnician} 
                        onChange={(e) => setNewTechnician(e.target.value)} 
                        placeholder="فريق الصيانة" 
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 font-bold block mb-1">ملاحظات المعاينة الميدانية:</label>
                    <textarea 
                      rows={2} 
                      value={newNotes} 
                      onChange={(e) => setNewNotes(e.target.value)} 
                      placeholder="أي ملاحظات تخص فحص الموقع أو متطلبات الفنيين..." 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white resize-none" 
                    />
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
                    <button 
                      type="button" 
                      onClick={() => setIsAddModalOpen(false)} 
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl cursor-pointer"
                    >
                      إلغاء
                    </button>
                    <button 
                      type="submit" 
                      className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl cursor-pointer shadow-lg shadow-amber-950/40"
                    >
                      تأكيد وحفظ البلاغ
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Modal 2: نافذة تقرير الصيانة المصور (قبل وبعد) والاعتماد */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-slate-900 border border-amber-900/40 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      تقرير المعاينة والصيانة المصور
                      <span className="text-xs font-mono text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/30">
                        {selectedTicket.id}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400">{selectedTicket.mosqueName} • {selectedTicket.location}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* بطاقة ملخص البلاغ */}
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-amber-400" />
                    {selectedTicket.issueType}
                  </h4>
                  <span className={`px-2.5 py-0.5 text-[11px] font-bold rounded-lg border ${
                    selectedTicket.status === "RESOLVED"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                  }`}>
                    {selectedTicket.statusLabel}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                  <div>المكلف: <strong className="text-white block">{selectedTicket.technician}</strong></div>
                  <div>التكلفة: <strong className="text-emerald-400 block">{selectedTicket.estimatedCost}</strong></div>
                  <div>تاريخ البلاغ: <strong className="text-slate-300 block">{selectedTicket.dateReported}</strong></div>
                </div>
              </div>

              {/* مقارنة الصور التوثيقية (قبل الصيانة وبعدها) */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Camera className="w-4 h-4 text-cyan-400" />
                  التوثيق الميداني بالصور (قبل الصيانة وبعدها):
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* قبل */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-rose-900/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> حالة العطل (قبل الصيانة)
                      </span>
                      <span className="text-[10px] text-slate-500">معاينة المفتش</span>
                    </div>
                    <div className="h-32 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-3 text-center">
                      <Camera className="w-8 h-8 text-rose-400/40 mb-2" />
                      <p className="text-xs text-slate-300 font-medium">{selectedTicket.beforePhoto || "صورة رصد العطل قبل التدخل"}</p>
                    </div>
                  </div>

                  {/* بعد */}
                  <div className="bg-slate-950/80 p-4 rounded-2xl border border-emerald-900/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> الإنجاز والتجهيز (بعد الصيانة)
                      </span>
                      <span className="text-[10px] text-slate-500">توثيق الفني</span>
                    </div>
                    <div className="h-32 bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-3 text-center">
                      <CheckCircle2 className="w-8 h-8 text-emerald-400/40 mb-2" />
                      <p className="text-xs text-slate-300 font-medium">{selectedTicket.afterPhoto || "صورة اكتمال الصيانة وتشغيل المنظومة"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ملاحظات المهندس وتحديث الحالة */}
              {selectedTicket.notes && (
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                  <span className="text-slate-400 block font-bold mb-1">الملاحظات الفنية الميدانية:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedTicket.notes}</p>
                </div>
              )}

              {/* أزرار الإجراءات */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  {selectedTicket.status !== "RESOLVED" && (
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, "RESOLVED", "مكتمل ومعتمد")}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40"
                    >
                      <Check className="w-4 h-4" />
                      <span>اعتماد الإنجاز وإغلاق البلاغ</span>
                    </button>
                  )}
                  {selectedTicket.status === "PENDING_APPROVAL" && (
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, "IN_PROGRESS", "قيد التنفيذ الميداني")}
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Clock className="w-4 h-4" />
                      <span>الموافقة وبدء التنفيذ</span>
                    </button>
                  )}
                </div>

                <button 
                  onClick={() => setSelectedTicket(null)} 
                  className="px-5 py-2 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl cursor-pointer hover:bg-slate-700"
                >
                  إغلاق التقرير
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
