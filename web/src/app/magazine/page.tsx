"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Newspaper, 
  Plus, 
  Calendar, 
  User, 
  Share2, 
  MessageCircle, 
  Image as ImageIcon, 
  Sparkles, 
  Filter, 
  Tag, 
  Eye, 
  CheckCircle2, 
  X,
  ArrowRight,
  BookOpen,
  Building2,
  Droplet,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Copy,
  Printer,
  FileText,
  Languages,
  Layers,
  Check,
  Edit3,
  Trash2,
  SlidersHorizontal,
  Upload,
  UploadCloud
} from "lucide-react";
import { LOCALES, Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/locale-context";

interface ArticleImage {
  url: string;
  caption: string;
}

interface Article {
  id: string;
  title: string;
  category: "AWQAF" | "QURAN" | "PROJECTS" | "DAWAH" | "COMMUNITY";
  categoryLabel: string;
  author: string;
  date: string;
  readTime: string;
  images: ArticleImage[];
  summary: string;
  arabicText?: string;
  frenchText?: string;
  hausaText?: string;
  clauses?: string[];
  views: number;
  signatories?: { role: string; name: string; status: string }[];
}

// قواميس ترجمة واجهة المجلة باللغات الثلاث
const MAGAZINE_DICT = {
  ar: {
    appTitle: "مجلة منارة الإخبارية",
    badge: "ذكية • مصورة • تفاعلية",
    tagline: "منصة توثيق ونشر أخبار عمارة المساجد، حلقات القرآن، وثائق الصلح والمشاريع الإغاثية",
    publishBtn: "نشر خبر أو مقال جديد",
    homeBtn: "الرئيسية",
    categories: {
      ALL: "جميع التقارير والأخبار",
      AWQAF: "وثائق ومحاضر الصلح",
      PROJECTS: "الآبار والمشاريع",
      QURAN: "حلقات القرآن والإجازات",
      DAWAH: "القوافل الدعوية",
    },
    searchPlaceholder: "ابحث في الأخبار والوثائق بالاسم أو الكلمة...",
    featuredBadge: "وثيقة الغلاف والتقرير الرسمي المميز",
    readFullBtn: "فتح واستعراض التقرير والصور بالكامل",
    gridTitle: "سجل المقالات والتقارير الميدانية المصورة",
    publishedCount: "تقارير منشورة",
    readBtn: "فتح وقراءة",
    editBtn: "تعديل الخبر",
    deleteBtn: "حذف",
    readViews: "قراءة",
    printTitle: "طباعة التقرير",
    copyTitle: "نسخ الرابط",
    closeBtn: "إغلاق",
    shareWhatsapp: "مشاركة الخبر عبر WhatsApp",
    summaryTitle: "الموجز والبيان الصحفي:",
    clausesTitle: "البنود والقرارات التي تم الاتفاق والتراضي عليها:",
    modalAddTitle: "إضافة تقرير مصور أو خبر جديد",
    modalEditTitle: "تعديل وضبط التقرير الإخباري",
    savePublishBtn: "اعتماد ونشر التقرير فوراً",
    saveEditBtn: "حفظ التعديلات والتحديث",
    cancelBtn: "إلغاء",
    formTitle: "عنوان التقرير أو المقال الإخباري:",
    formCategory: "تصنيف المقال:",
    formAuthor: "اسم الكاتب أو الجهة المصدرة:",
    formImages: "روابط الصور الميدانية المرفقة (صور متعددة):",
    addImageBtn: "+ إضافة صورة أخرى",
    formSummary: "الموجز الصحفي السريع:",
    formArabic: "نص التقرير بالعربية (RTL):",
    formFrench: "نص التقرير بالفرنسية (Français - LTR):",
    formHausa: "نص التقرير بلغة الهوسا (Harshen Hausa - LTR):",
    tabArabic: "البيان بالعربية",
    tabFrench: "Texte en Français",
    tabHausa: "Bayani da Hausa",
  },
  fr: {
    appTitle: "Magazine Manara Actualités",
    badge: "Intelligent • Illustré • Interactif",
    tagline: "Plateforme de documentation des mosquées, cercles coraniques et réconciliation",
    publishBtn: "Publier un nouvel article",
    homeBtn: "Accueil",
    categories: {
      ALL: "Toutes les actualités",
      AWQAF: "Actes de réconciliation",
      PROJECTS: "Puits & Projets",
      QURAN: "Cercles du Coran",
      DAWAH: "Caravanes de Da'wah",
    },
    searchPlaceholder: "Rechercher un rapport, un mot-clé...",
    featuredBadge: "À la Une - Rapport Officiel",
    readFullBtn: "Lire le rapport complet et photos",
    gridTitle: "Répertoire des articles et rapports terrain",
    publishedCount: "rapports publiés",
    readBtn: "Lire l'article",
    editBtn: "Modifier",
    deleteBtn: "Supprimer",
    readViews: "vues",
    printTitle: "Imprimer",
    copyTitle: "Copier le lien",
    closeBtn: "Fermer",
    shareWhatsapp: "Partager via WhatsApp",
    summaryTitle: "Résumé exécutif du rapport :",
    clausesTitle: "Clauses et décisions convenues :",
    modalAddTitle: "Publier un nouvel article illustré",
    modalEditTitle: "Modifier et ajuster le rapport",
    savePublishBtn: "Publier le rapport",
    saveEditBtn: "Enregistrer les modifications",
    cancelBtn: "Annuler",
    formTitle: "Titre de l'article ou du rapport :",
    formCategory: "Catégorie :",
    formAuthor: "Auteur ou organisme :",
    formImages: "Liens des photos (photos multiples) :",
    addImageBtn: "+ Ajouter une autre photo",
    formSummary: "Résumé court :",
    formArabic: "Texte en arabe :",
    formFrench: "Texte en français :",
    formHausa: "Texte en haoussa :",
    tabArabic: "En Arabe",
    tabFrench: "En Français",
    tabHausa: "En Haoussa",
  },
  ha: {
    appTitle: "Mujallar Manara ta Labarai",
    badge: "Mai Fasaha • Hotuna • Aiki kai tsaye",
    tagline: "Dandalin yada labaran masallatai, tsangaya, sasantawa da ayyukan alheri",
    publishBtn: "Buga Sabon Labari",
    homeBtn: "Babban Shafi",
    categories: {
      ALL: "Dukkan Labarai da Rahotanni",
      AWQAF: "Takardun Sasantawa",
      PROJECTS: "Rijiyoyi da Masallatai",
      QURAN: "Karatun Alkur'ani",
      DAWAH: "Wa'azi da Fadakarwa",
    },
    searchPlaceholder: "Nemo labari ko takarda...",
    featuredBadge: "Babban Labarin Murfi",
    readFullBtn: "Bude cikakken bayani da hotuna",
    gridTitle: "Jerin labarai da rahotannin zahiri",
    publishedCount: "rahotannin da aka buga",
    readBtn: "Karanta Labari",
    editBtn: "Gyara Labari",
    deleteBtn: "Goge",
    readViews: "karatu",
    printTitle: "Buga Takarda",
    copyTitle: "Kwafi Link",
    closeBtn: "Rufe",
    shareWhatsapp: "Tura ta WhatsApp",
    summaryTitle: "Takaitaccen Bayani :",
    clausesTitle: "Abubuwan da aka cimma matsaya a kai :",
    modalAddTitle: "Buga Sabon Rahoto da Hotuna",
    modalEditTitle: "Gyara Bayanin Labari",
    savePublishBtn: "Buga Labarin Yanzu",
    saveEditBtn: "Ajiye Gyara",
    cancelBtn: "Fasa",
    formTitle: "Taken Labari ko Rahoto :",
    formCategory: "Sashe :",
    formAuthor: "Marubuci ko kungiya :",
    formImages: "Hotunan Rahoton (masu yawa) :",
    addImageBtn: "+ Kara wani hoton",
    formSummary: "Takaitaccen bayani :",
    formArabic: "Bayanin Larabci :",
    formFrench: "Bayanin Faransanci :",
    formHausa: "Bayanin Hausa :",
    tabArabic: "Da Larabci",
    tabFrench: "Da Faransanci",
    tabHausa: "Da Harshen Hausa",
  }
};

const INITIAL_ARTICLES: Article[] = [
    {
      id: "ART-IHYA-01",
      title: "بيان الصلح الرسمي وإدارة مسجد أبي بكر الصديق بمرادي (Rubutaccen Bayani: Masallacin Abubakar Sidik)",
      category: "AWQAF",
      categoryLabel: "وثائق الصلح والمساجد",
      author: "Coordination Régionale de Maradi - Ihya'ous Sounnah",
      date: "07 أكتوبر 2026 / 1448هـ",
      readTime: "4 دقائق",
      images: [
        {
          url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
          caption: "جلسة الصلح التاريخية بجامع سلطنة مرادي الكبير برئاسة كبير العلماء الإمام ألمو أنتومة"
        },
        {
          url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
          caption: "وفد جمعية إحياء السنة وأئمة مساجد الجمعة خلال توقيع محضر التراضي"
        },
        {
          url: "https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1200&q=80",
          caption: "جامع أبي بكر الصديق بحي سورا بيلدي بمدينة مرادي"
        }
      ],
      summary: "وثيقة ومحضر الصلح الشرعي التاريخي المنعقد بجامع سلطنة مرادي الكبير برئاسة إمام العلماء الأستاذ ألمو أنتومة وبحضور وفد جمعية إحياء السنة وممثلي السلطنة لإنهاء النزاع حول ولاية وإدارة مسجد أبي بكر الصديق بحي سورا بيلدي.",
      arabicText: `عُقد في عاصمة سلطنة مرادي بجامع الجمعة الكبير، برعاية وتوجيه سامٍ من سلطان مرادي، اجتماع صلح مبارك برئاسة فضيلة كبير العلماء (Sarkin Malammai) الإمام ألمو أنتومة.

وقد حضر الاجتماع وفد رسمي من أعيان السلطنة، وأئمة مساجد الجمعة بمرادي، ووفد جمعية إحياء السنة (Ihya'ous Sounnah)، إلى جانب الشيخ ساني عبدو غلاديما ووفده.

افتتحت الجلسة بآيات من الذكر الحكيم والتذكير بتقوى الله والحرص على جمع شمل المسلمين وصيانة بيوت الله من الفرقة، حيث تم التوصل إلى اتفاق تام بالصلح وتوثيق محضر رسمي معتمد.`,
      frenchText: `Le mercredi 7 octobre 2026, s'est tenue dans la Grande Mosquée du Sultanat de Maradi une assemblée solennelle de réconciliation sous l'égide de l'Imam Almu Antoma, *Sarkin Malammai* du Sultanat de Katsina-Maradi.

L'objectif de cette rencontre était de sceller un accord définitif et pacifique entre l'association *Ihya'ous Sounnah* et Malam Sani Abdu Galadima concernant la tutelle et la gestion de la Mosquée Aboubacar Sidik située au quartier Soura Bildi.

À l'issue des échanges cordiaux et fraternels conduits par les dignitaires et imams, un accord consensuel a été signé garantissant la paix sociale, la souveraineté du culte et la gestion concertée du lieu de prière sous la supervision de l'autorité royale.`,
      hausaText: `A ranar Laraba, 7 ga watan Oktoba, 2026, an gudanar da wani zaman taro a babban Masallacin Juma'a na Masarautar Maraɗi, da misalin ƙarfe 10:30 na safe, ƙarƙashin jagorancin Imam Malam Almu Antoma, *Sarkin Malammai* na Masarautar Katsina-Maraɗi. 

Manufar wannen taron ita ce neman sulhu kan taƙaddamar da ke tsakanin ƙungiyar *Ihya'ous Sounnah* da Malam Sani Abdu Galadima dangane da halaccin Masallacin Abubacar Sidik, wanda ke unguwar Soura Bildi.

Daga cikin waɗanda suka halarci taron akwai:
▪ Wakilan Masarautar Katsina-Maradi,
▪ Limaman waɗansu masallatan Juma'a daban-daban na birnin Maraɗi,
▪ Malam Sani Abdu Galadima da tawagarsa,
▪ Da kuma wakilan ƙungiyar *Ihya'ous Sounnah* ta Maraɗi.`,
      clauses: [
        "إقرار الشيخ ساني عبدو غلاديما بصحة وثيقة تسليم مسجد أبي بكر الصديق لجمعية إحياء السنة بملء رضاه وبصفة نهائية ودائمة.",
        "الاعتراف بأن التراجع أو التشكيك في صحة توقيع وثائق المسجد كان تصرفاً غير صائب وتسبب في التباس، والالتزام بحسمه نهائياً.",
        "التأكيد على أن أي محاولة لإثارة الخلاف أو تعطيل رسالة المسجد والجمعة أمر مرفوض شرعاً ونظاماً، ووجوب الحفاظ على أمن المسجد وسكينته.",
        "موافقة جمعية إحياء السنة – تقديراً لرعاية السلطان ولحمة الأمة – على إعادة إدارة المسجد للشيخ ساني ضمن صيغة تفاهم مشتركة ومؤطرة تحت إشراف السلطنة."
      ],
      signatories: [
        { role: "المتنازل والمقر الشرعي", name: "Malam Sani Abdu Galadima", status: "توقيع وإقرار تام" },
        { role: "عن جمعية إحياء السنة", name: "Shugaban Ihya'ous Sounnah", status: "قبول الصلح والتفاهم" },
        { role: "محرر المحضر الرسمي", name: "Suley Abdu", status: "تدوين وتوثيق الجلسة" },
        { role: "رئيس الجلسة (كبير العلماء)", name: "Imam Almu Antoma", status: "Sarkin Malammai (اعتماد)" }
      ],
      views: 3120,
    },
    {
      id: "ART-01",
      title: "تدشين مجمع النور الوقفي وحفر 3 آبار ارتوازية في إقليم طاوا",
      category: "PROJECTS",
      categoryLabel: "مشاريع الآبار والأوقاف",
      author: "وفد الأوقاف الميداني",
      date: "14 رجب 1447هـ / 2026",
      readTime: "3 دقائق",
      images: [
        {
          url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
          caption: "تدفق المياه العذبة من البئر الارتوازي بالطاقة الشمسية"
        },
        {
          url: "https://images.unsplash.com/photo-1577705998148-6da4f3963bc8?auto=format&fit=crop&w=1200&q=80",
          caption: "فرحة أهالي القرية وتوزيع مصاحف مجمع النور"
        }
      ],
      summary: "بحضور أهالي القرى المجاورة، تم افتتاح مجمع النور الذي يضم مسجداً جامعاً، محطة مياه تعمل بالطاقة الشمسية، ومدرسة قرآنية لأكثر من 200 طالب.",
      arabicText: "شهد إقليم طاوا اليوم حدثاً إيمانياً مباركاً تمثل في افتتاح وتدشين مجمع النور الوقفي الخيري، والذي يتألف من جامع يتسع لأكثر من 500 مصلٍ، ومحطة سقيا مياه متطورة تسحب المياه العذبة من عمق 70 متراً لتوفير مياه الشرب النقية لما يربو على 1500 نسمة من أهالي القرى النائية. كما تم تزويد المجمع بمنظومة إنارة شمسية مستقلة لحفظ استمرارية الشعائر وحلقات القرآن الكريم دون انقطاع.",
      frenchText: "Inauguration réussie du complexe Al-Nour dans la région de Tahoua avec 3 forages artésiens solaires, une grande mosquée et une école coranique pour plus de 200 élèves.",
      hausaText: "Bude babban rukunin Masallacin Al-Nour da rijiyoyin burtsatse masu amfani da hasken rana a yankin Tahoua.",
      clauses: [
        "توفير مياه الشرب النقية لأكثر من 1500 نسمة.",
        "منظومة طاقة شمسية مستدامة 2400 واط تعمل على مدار الساعة.",
        "مدرسة قرآنية ملحقة تضم 4 فصول دراسية مجهزة بالكامل."
      ],
      views: 1240,
    },
    {
      id: "ART-02",
      title: "تخريج 45 حافظاً وحافظة بروايتي ورش وقالون بمدرسة الإمام مالك",
      category: "QURAN",
      categoryLabel: "حلقات القرآن والمدارس",
      author: "إدارة الحلقات القرآنية",
      date: "10 رجب 1447هـ / 2026",
      readTime: "4 دقائق",
      images: [
        {
          url: "https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80",
          caption: "الحفظة الخريجون يتسلمون إجازات السند المتصل الرقمية بـ QR Code"
        }
      ],
      summary: "أقامت الهيئة حفلاً تكريمياً مهيباً لتتويج الدفعة السنوية لحفظة كتاب الله ومنحهم الإجازات القرآنية المسندة بباركود التوثيق الرقمي.",
      arabicText: "في أجواء إيمانية عامرة، احتفلت مدرسة الإمام مالك القرآنية بتخريج كوكبة مباركة من حفظة كتاب الله تعالى، شملت 25 طالباً و20 طالبة أتموا حفظ القرآن الكريم كاملاً وتجويده وإتقان مخارج الحروف. وقد تسلم الخريجون شهادات الإجازة بالسند المتصل المعتمدة بـ QR Code الصادرة من منظومة منارة والتي تتيح التحقق الفوري من مصداقية السند ومقرئيه.",
      frenchText: "Cérémonie de remise des diplômes et Ijazah pour 45 mémorisateurs du Saint Coran selon les lectures Warsh et Qaloun.",
      hausaText: "Saukar karatu da bada shaidar haddar Alkur'ani mai girma ga dalibai 45 a makarantar Imam Malik.",
      clauses: [
        "منح 45 شهادة إجازة بالسند المتصل إلى رسول الله ﷺ.",
        "اعتماد روايتي ورش وقالون عن نافع المدني.",
        "ربط كافة الشهادات بنظام التحقق السحابي الفوري ضد التزوير."
      ],
      views: 980,
    }
];

export default function MagazinePage() {
  const { currentLocale, setCurrentLocale, isRtl } = useLocale();
  const dict = MAGAZINE_DICT[currentLocale] || MAGAZINE_DICT.ar;

  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // المقال المعروض للقراءة
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);
  
  // لغة النص داخل نافذة القراءة (AR / FR / HA)
  const [activeLangTab, setActiveLangTab] = useState<"AR" | "FR" | "HA">("AR");
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg" | "xl">("base");
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  // نافذة الإضافة أو التعديل
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // حقول النموذج
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<Article["category"]>("AWQAF");
  const [formAuthor, setFormAuthor] = useState("إدارة الإعلام والنشر الوقفي");
  const [formSummary, setFormSummary] = useState("");
  const [formArabicText, setFormArabicText] = useState("");
  const [formFrenchText, setFormFrenchText] = useState("");
  const [formHausaText, setFormHausaText] = useState("");
  const [formImagesList, setFormImagesList] = useState<string[]>([""]);

  // قائمة المقالات مع حفظ دائم في localStorage
  const [articles, setArticles] = useState<Article[]>(INITIAL_ARTICLES);

  // استرجاع المقالات المحفوظة عند فتح الصفحة لأول مرة
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        const saved = localStorage.getItem("manara_magazine_articles");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setArticles(parsed);
          }
        }
      } catch (e) {
        console.warn("Could not read from localStorage", e);
      }
    }, 0);
    return () => clearTimeout(id);
  }, []);

  // دالة الحفظ الدائم في الذاكرة المحلية
  const saveArticlesToStorage = (updatedArticles: Article[]) => {
    setArticles(updatedArticles);
    try {
      localStorage.setItem("manara_magazine_articles", JSON.stringify(updatedArticles));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }
  };

  // فتح نافذة الإضافة
  const handleOpenAddModal = () => {
    setIsEditingMode(false);
    setEditingArticleId(null);
    setFormTitle("");
    setFormCategory("AWQAF");
    setFormAuthor("إدارة الإعلام والنشر الوقفي");
    setFormSummary("");
    setFormArabicText("");
    setFormFrenchText("");
    setFormHausaText("");
    setFormImagesList([""]);
    setIsFormModalOpen(true);
  };

  // فتح نافذة التعديل والضبط
  const handleOpenEditModal = (article: Article) => {
    setIsEditingMode(true);
    setEditingArticleId(article.id);
    setFormTitle(article.title);
    setFormCategory(article.category);
    setFormAuthor(article.author);
    setFormSummary(article.summary);
    setFormArabicText(article.arabicText || "");
    setFormFrenchText(article.frenchText || "");
    setFormHausaText(article.hausaText || "");
    setFormImagesList(article.images.map(img => img.url));
    setIsFormModalOpen(true);
  };

  // حذف مقال
  const handleDeleteArticle = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الخبر أو المقال؟")) {
      try {
        await fetch(`/api/magazine?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        });
      } catch {
        // continue local cleanup
      }
      const updated = articles.filter(a => a.id !== id);
      saveArticlesToStorage(updated);
      if (readingArticle?.id === id) {
        setReadingArticle(null);
      }
    }
  };

  // إضافة حقل صورة
  const handleAddImageField = () => {
    setFormImagesList([...formImagesList, ""]);
  };

  const handleImageChange = (index: number, val: string) => {
    const updated = [...formImagesList];
    updated[index] = val;
    setFormImagesList(updated);
  };

  const handleRemoveImage = (index: number) => {
    setFormImagesList(formImagesList.filter((_, i) => i !== index));
  };

  // دالة تصغير وضغط الصورة قبل الحفظ لتجنب امتلاء الذاكرة وسرعة المعالجة
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1280;
          const MAX_HEIGHT = 960;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // تحويل الصورة إلى JPEG مضغوط بجودة ممتازة وخفيفة
            resolve(canvas.toDataURL("image/jpeg", 0.85));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => {
          resolve(e.target?.result as string);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // منطق رفع الصور مباشرة من جهاز الحاسوب (دفعة واحدة مع المعاينة الفورية)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingImages(true);

    try {
      const fileList = Array.from(files);
      // معالجة كافة الصور بالتوازي وتجهيزها
      const newBase64Images = await Promise.all(
        fileList.map((file) => compressImage(file))
      );

      // دمج الصور الجديدة المرفوعة مع الحالية
      setFormImagesList((prev) => {
        const existingClean = prev.filter((p) => p.trim().length > 0);
        return [...existingClean, ...newBase64Images];
      });
    } catch (err) {
      console.error("خطأ أثناء رفع ومعالجة الصور:", err);
    } finally {
      setIsUploadingImages(false);
      e.target.value = "";
    }
  };

  // حفظ المقال (إضافة جديدة أو تعديل) مع الحفظ الدائم
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim()) return;

    const validImages = formImagesList
      .filter((url) => url.trim().length > 0)
      .map((url, idx) => ({
        url: url.trim(),
        caption: `صورة رقم ${idx + 1}`
      }));

    if (validImages.length === 0) {
      validImages.push({
        url: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=1200&q=80",
        caption: "صورة الخبر الرسمية"
      });
    }

    if (isEditingMode && editingArticleId) {
      // تحديث مقال قائم
      const updatedList = articles.map(art => {
        if (art.id === editingArticleId) {
          const updated: Article = {
            ...art,
            title: formTitle.trim(),
            category: formCategory,
            author: formAuthor.trim(),
            summary: formSummary.trim(),
            arabicText: formArabicText.trim() || undefined,
            frenchText: formFrenchText.trim() || undefined,
            hausaText: formHausaText.trim() || undefined,
            images: validImages,
          };
          if (readingArticle?.id === editingArticleId) {
            setReadingArticle(updated);
          }
          return updated;
        }
        return art;
      });
      saveArticlesToStorage(updatedList);
    } else {
      // إضافة مقال جديد وربطه بالخادم
      let serverId = `ART-${Date.now().toString().slice(-4)}`;
      const catLabel =
        formCategory === "PROJECTS" ? dict.categories.PROJECTS :
        formCategory === "QURAN" ? dict.categories.QURAN :
        formCategory === "DAWAH" ? dict.categories.DAWAH : dict.categories.AWQAF;

      try {
        const res = await fetch("/api/magazine", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle.trim(),
            category: formCategory,
            categoryLabel: catLabel,
            author: formAuthor.trim() || "إدارة التحرير والإعلام",
            summary: formSummary.trim(),
            arabicText: formArabicText.trim() || formSummary.trim(),
            frenchText: formFrenchText.trim() || undefined,
            hausaText: formHausaText.trim() || undefined,
            images: validImages,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.article?.id) serverId = data.article.id;
        }
      } catch {
        // fallback to local storage
      }

      const newArt: Article = {
        id: serverId,
        title: formTitle.trim(),
        category: formCategory,
        categoryLabel: catLabel,
        author: formAuthor.trim() || "إدارة التحرير والإعلام",
        date: "اليوم",
        readTime: "3 دقائق",
        images: validImages,
        summary: formSummary.trim(),
        arabicText: formArabicText.trim() || formSummary.trim(),
        frenchText: formFrenchText.trim() || undefined,
        hausaText: formHausaText.trim() || undefined,
        views: 1,
      };
      saveArticlesToStorage([newArt, ...articles]);
    }

    setIsFormModalOpen(false);
  };

  // نسخ الرابط
  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // فلترة المقالات
  const filteredArticles = articles.filter((art) => {
    const matchesCat = selectedCategory === "ALL" || art.category === selectedCategory;
    const matchesQuery = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div 
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white ${isRtl ? "rtl font-sans" : "ltr"}`}
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* 1. Header with Trilingual Switcher */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/90 border-b border-emerald-900/40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Newspaper className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                {dict.appTitle}
                <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {dict.badge}
                </span>
              </span>
              <p className="text-xs text-slate-400 hidden sm:block">
                {dict.tagline}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* محول اللغات الثلاث المعتمدة */}
            <div className="flex bg-slate-800/95 rounded-xl p-1 border border-slate-700/80 shadow-inner">
              {[
                { code: "ar", label: "العربية" },
                { code: "fr", label: "Français" },
                { code: "ha", label: "Hausa" },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setCurrentLocale(lang.code as Locale)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 flex items-center gap-1 cursor-pointer ${
                    currentLocale === lang.code
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{lang.label}</span>
                </button>
              ))}
            </div>

            <button 
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 active:scale-95 cursor-pointer ring-2 ring-emerald-400/30"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden md:inline">{dict.publishBtn}</span>
            </button>

            <Link
              href="/"
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 transition"
            >
              {dict.homeBtn}
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Main Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        
        {/* Category Filters & Quick Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-3xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
            {[
              { id: "ALL", label: dict.categories.ALL },
              { id: "AWQAF", label: dict.categories.AWQAF },
              { id: "PROJECTS", label: dict.categories.PROJECTS },
              { id: "QURAN", label: dict.categories.QURAN },
              { id: "DAWAH", label: dict.categories.DAWAH },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                    : "bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="w-full md:w-80">
            <input 
              type="text"
              placeholder={dict.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
            />
          </div>
        </div>

        {/* Featured Cover Story */}
        {filteredArticles.length > 0 && selectedCategory === "ALL" && !searchQuery && (
          <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/95 to-emerald-950/40 border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
                  <Sparkles className="w-3.5 h-3.5" /> {dict.featuredBadge}
                </div>
                
                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                  {filteredArticles[0].title}
                </h2>
                
                <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {filteredArticles[0].summary}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-2">
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                    <User className="w-4 h-4" /> {filteredArticles[0].author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-slate-500" /> {filteredArticles[0].date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-slate-500" /> {filteredArticles[0].images.length} صور
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4 text-slate-500" /> {filteredArticles[0].views} {dict.readViews}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <button 
                    onClick={() => {
                      setReadingArticle(filteredArticles[0]);
                      setActiveImageIndex(0);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-xl transition flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>{dict.readFullBtn}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>

                  <button 
                    onClick={() => handleOpenEditModal(filteredArticles[0])}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{dict.editBtn}</span>
                  </button>
                </div>
              </div>

              {/* Gallery Preview on Cover */}
              <div className="lg:col-span-5 relative group">
                <div className="h-72 rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-800 relative">
                  <img 
                    src={filteredArticles[0].images[0].url} 
                    alt={filteredArticles[0].title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-3 right-3 left-3 bg-slate-900/90 backdrop-blur-sm p-2.5 rounded-xl border border-slate-700/60 text-[11px] text-slate-200">
                    {filteredArticles[0].images[0].caption}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid List */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              {dict.gridTitle}
            </h3>
            <span className="text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40 font-bold">
              {filteredArticles.length} {dict.publishedCount}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div 
                key={article.id}
                className="bg-slate-900/70 border border-slate-800 hover:border-emerald-500/40 rounded-3xl overflow-hidden flex flex-col justify-between transition-all hover:-translate-y-1 shadow-xl group"
              >
                <div>
                  {/* Photo Header with Badge */}
                  <div className="h-52 overflow-hidden relative">
                    <img 
                      src={article.images[0]?.url} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 right-3 flex items-center gap-2">
                      <span className="text-[10px] font-bold bg-slate-950/85 backdrop-blur-sm px-2.5 py-1 rounded-lg text-emerald-400 border border-emerald-800/40 shadow">
                        {article.categoryLabel}
                      </span>
                    </div>

                    {article.images.length > 1 && (
                      <span className="absolute bottom-3 left-3 text-[10px] font-bold bg-slate-950/85 backdrop-blur-sm px-2 py-0.5 rounded-lg text-white border border-slate-700 flex items-center gap-1">
                        <ImageIcon className="w-3 h-3 text-emerald-400" /> {article.images.length} صور
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{article.date}</span>
                      <span>{article.readTime}</span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-emerald-400 transition line-clamp-2 leading-snug">
                      {article.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-800/80 flex items-center justify-between text-xs mt-3">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleOpenEditModal(article)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 rounded-lg transition"
                      title={dict.editBtn}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteArticle(article.id)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 rounded-lg transition"
                      title={dict.deleteBtn}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button 
                    onClick={() => {
                      setReadingArticle(article);
                      setActiveImageIndex(0);
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-emerald-600 text-slate-200 hover:text-white rounded-xl font-bold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <span>{dict.readBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 3. Modal: Read Full Article with Trilingual Tabbed Viewer */}
      {readingArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto max-h-[95vh] overflow-y-auto">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                  {readingArticle.categoryLabel}
                </span>

                {/* Font Size Adjuster */}
                <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button 
                    onClick={() => setFontSize("sm")}
                    className={`px-2 py-0.5 rounded ${fontSize === "sm" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
                    title="خط صغير"
                  >
                    A-
                  </button>
                  <button 
                    onClick={() => setFontSize("base")}
                    className={`px-2 py-0.5 rounded ${fontSize === "base" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
                    title="خط عادي"
                  >
                    A
                  </button>
                  <button 
                    onClick={() => setFontSize("lg")}
                    className={`px-2 py-0.5 rounded ${fontSize === "lg" ? "bg-emerald-600 text-white" : "text-slate-400"}`}
                    title="خط كبير ومريح"
                  >
                    A+
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenEditModal(readingArticle)}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl border border-slate-700 flex items-center gap-1 text-xs font-bold"
                  title="تعديل هذا الخبر"
                >
                  <Edit3 className="w-4 h-4" />
                  <span className="hidden sm:inline">{dict.editBtn}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                  title={dict.printTitle}
                >
                  <Printer className="w-4 h-4" />
                </button>
                
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700"
                  title={dict.copyTitle}
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>

                <button 
                  onClick={() => setReadingArticle(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800 hover:bg-rose-600/80 transition"
                  title={dict.closeBtn}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Article Title & Metadata */}
            <div className="space-y-3">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {readingArticle.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-emerald-400" /> {readingArticle.author}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-500" /> {readingArticle.date}</span>
                <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-slate-500" /> {readingArticle.views} {dict.readViews}</span>
              </div>
            </div>

            {/* 📸 Smart Photo Carousel & Gallery */}
            <div className="space-y-3">
              <div className="h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-800 relative bg-slate-950 flex items-center justify-center">
                <img 
                  src={readingArticle.images[activeImageIndex]?.url} 
                  alt="صورة المقال"
                  className="w-full h-full object-cover transition-all duration-300"
                />

                {readingArticle.images.length > 1 && (
                  <>
                    <button 
                      onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : readingArticle.images.length - 1))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-emerald-600 text-white shadow-xl transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setActiveImageIndex((prev) => (prev < readingArticle.images.length - 1 ? prev + 1 : 0))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-slate-950/80 hover:bg-emerald-600 text-white shadow-xl transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-0 inset-x-0 bg-slate-950/90 backdrop-blur-md p-3 text-xs text-slate-300 flex items-center justify-between border-t border-slate-800">
                  <span>{readingArticle.images[activeImageIndex]?.caption}</span>
                  <span className="font-mono text-[10px] text-emerald-400 font-bold">
                    {activeImageIndex + 1} / {readingArticle.images.length}
                  </span>
                </div>
              </div>

              {readingArticle.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {readingArticle.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`h-16 w-24 rounded-xl overflow-hidden border-2 shrink-0 transition ${
                        activeImageIndex === idx ? "border-emerald-500 scale-95 shadow-md" : "border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt="مصغرة" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Official Signatories Badge if exists */}
            {readingArticle.signatories && readingArticle.signatories.length > 0 && (
              <div className="bg-slate-950 p-5 rounded-2xl border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                  <span className="font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    الموقعون والمعتمدون على محضر الصلح الرسمي
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">سلطنة مرادي • جمعية إحياء السنة</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                  {readingArticle.signatories.map((sig, idx) => (
                    <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <span className="text-[10px] text-slate-400 block mb-1">{sig.role}</span>
                      <span className="font-bold text-white text-xs block">{sig.name}</span>
                      <span className="text-[9px] text-emerald-400 block mt-1">{sig.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Language Switcher Tabs for Text (AR / FR / HA) */}
            <div className="flex border-b border-slate-800 gap-4 text-xs font-bold">
              <button
                onClick={() => setActiveLangTab("AR")}
                className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
                  activeLangTab === "AR" 
                    ? "border-emerald-500 text-emerald-400" 
                    : "border-transparent text-slate-400 hover:text-white"
                }`}
              >
                <Languages className="w-4 h-4" />
                <span>{dict.tabArabic} (العربية)</span>
              </button>
              
              {readingArticle.frenchText && (
                <button
                  onClick={() => setActiveLangTab("FR")}
                  className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
                    activeLangTab === "FR" 
                      ? "border-emerald-500 text-emerald-400" 
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  <span>{dict.tabFrench} (Français)</span>
                </button>
              )}

              {readingArticle.hausaText && (
                <button
                  onClick={() => setActiveLangTab("HA")}
                  className={`pb-3 border-b-2 flex items-center gap-1.5 transition ${
                    activeLangTab === "HA" 
                      ? "border-emerald-500 text-emerald-400" 
                      : "border-transparent text-slate-400 hover:text-white"
                  }`}
                >
                  <Languages className="w-4 h-4" />
                  <span>{dict.tabHausa} (Hausa)</span>
                </button>
              )}
            </div>

            {/* Article Content with Dynamic Font Size */}
            <div className={`space-y-4 leading-relaxed ${
              fontSize === "sm" ? "text-xs" :
              fontSize === "base" ? "text-sm" :
              fontSize === "lg" ? "text-base" : "text-lg"
            }`}>
              
              {/* Executive Summary Callout */}
              <div className="bg-emerald-950/20 border border-emerald-900/40 p-4 rounded-2xl text-emerald-200">
                <strong className="block text-xs font-bold text-emerald-400 mb-1">{dict.summaryTitle}</strong>
                <p>{readingArticle.summary}</p>
              </div>

              {/* Main Body Text (AR / FR / HA) */}
              {activeLangTab === "AR" && (
                <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-slate-200 space-y-4" dir="rtl">
                  <p className="whitespace-pre-line leading-relaxed">{readingArticle.arabicText}</p>

                  {readingArticle.clauses && readingArticle.clauses.length > 0 && (
                    <div className="pt-4 space-y-2">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2 mb-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        {dict.clausesTitle}
                      </h4>
                      <div className="grid grid-cols-1 gap-2.5">
                        {readingArticle.clauses.map((clause, idx) => (
                          <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800/80 flex items-start gap-3">
                            <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="text-slate-200 leading-normal">{clause}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeLangTab === "FR" && (
                <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-slate-200 font-sans leading-relaxed" dir="ltr">
                  <p className="whitespace-pre-line">{readingArticle.frenchText}</p>
                </div>
              )}

              {activeLangTab === "HA" && (
                <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 text-slate-200 font-sans leading-relaxed" dir="ltr">
                  <p className="whitespace-pre-line">{readingArticle.hausaText}</p>
                </div>
              )}

            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <a 
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(readingArticle.title + '\n' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{dict.shareWhatsapp}</span>
              </a>

              <button
                onClick={() => setReadingArticle(null)}
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                {dict.closeBtn}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 4. Modal: Add OR Edit Article with Trilingual Input Support */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsFormModalOpen(false)}
              className="absolute top-5 left-5 text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 border-b border-slate-800 pb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                {isEditingMode ? <Edit3 className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
                {isEditingMode ? dict.modalEditTitle : dict.modalAddTitle}
              </div>
              <h3 className="text-xl font-black text-white">
                {isEditingMode ? "تعديل وضبط بيانات المقال والصور" : dict.modalAddTitle}
              </h3>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">{dict.formTitle}</label>
                <input 
                  type="text" 
                  required
                  placeholder="مثال: محضر صلح أو تدشين مشروع..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 font-bold block mb-1">{dict.formCategory}</label>
                  <select
                    value={formCategory}
                    onChange={(e) =>
                      setFormCategory(
                        e.target.value as "AWQAF" | "QURAN" | "PROJECTS" | "DAWAH"
                      )
                    }
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="AWQAF">{dict.categories.AWQAF}</option>
                    <option value="PROJECTS">{dict.categories.PROJECTS}</option>
                    <option value="QURAN">{dict.categories.QURAN}</option>
                    <option value="DAWAH">{dict.categories.DAWAH}</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-bold block mb-1">{dict.formAuthor}</label>
                  <input 
                    type="text" 
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Multi-Image Upload & Management */}
              <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-emerald-400 font-bold flex items-center gap-1.5 text-xs">
                    <ImageIcon className="w-4 h-4" /> {dict.formImages}
                  </label>
                  <span className="text-[10px] text-slate-500 font-normal">
                    (JPG, PNG, WebP)
                  </span>
                </div>

                {/* زر ومنطقة رفع الصور مباشرة من الحاسوب */}
                <div className="relative">
                  <input
                    type="file"
                    id="local-image-upload"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="local-image-upload"
                    className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 rounded-xl cursor-pointer transition-all duration-200 group text-center"
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center text-emerald-400 transition">
                      {isUploadingImages ? (
                        <div className="w-5 h-5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <UploadCloud className="w-6 h-6 animate-pulse" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        {isUploadingImages ? "جاري معالجة ورفع الصور..." : "انقر هنا لاختيار صور من جهاز الحاسوب (أو اسحبها إلى هنا)"}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        Cliquez pour importer des photos du PC / Danna nan don loda hotuna daga kwamfuta
                      </span>
                    </div>
                  </label>
                </div>

                {/* شبكة معاينة الصور المرفوعة الحالية مع زر الحذف */}
                {formImagesList.filter(u => u.trim().length > 0).length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-400 block">
                      الصور المرفقة ({formImagesList.filter(u => u.trim().length > 0).length}):
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {formImagesList.map((url, idx) => {
                        if (!url.trim()) return null;
                        return (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-700 bg-slate-900 aspect-video shadow-md">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={url}
                              alt={`مرفق ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(idx)}
                                className="p-1.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                title="حذف هذه الصورة"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="text-[10px]">حذف</span>
                              </button>
                            </div>
                            <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] px-1.5 py-0.5 rounded text-white font-mono">
                              #{idx + 1}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* خيار إضافي: إدخال رابط خارجي يدوياً */}
                <div className="pt-2 border-t border-slate-900 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">أو يمكنك إدخال روابط صور خارجية مباشرة:</span>
                    <button
                      type="button"
                      onClick={handleAddImageField}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-bold cursor-pointer transition"
                    >
                      + إضافة رابط
                    </button>
                  </div>
                  {formImagesList.map((url, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input 
                        type="text" 
                        placeholder={`رابط صورة رقم ${idx + 1} (https://...) أو Base64`}
                        value={url}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">{dict.formSummary}</label>
                <textarea 
                  required
                  rows={2}
                  placeholder="موجز مكثف يظهر في بطاقة الخبر..."
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* نصوص اللغات الثلاث في نموذج النشر والضبط */}
              <div className="space-y-3 bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 block mb-1">
                  نصوص التقرير باللغات الثلاث (العربية / الفرنسية / الهوسا):
                </span>

                <div>
                  <label className="text-slate-400 block mb-1">{dict.formArabic}</label>
                  <textarea 
                    rows={3}
                    placeholder="التفاصيل الكاملة بالعربية..."
                    value={formArabicText}
                    onChange={(e) => setFormArabicText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-400 block mb-1">{dict.formFrench}</label>
                    <textarea 
                      rows={3}
                      placeholder="Texte en Français..."
                      value={formFrenchText}
                      onChange={(e) => setFormFrenchText(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">{dict.formHausa}</label>
                    <textarea 
                      rows={3}
                      placeholder="Bayani da harshen Hausa..."
                      value={formHausaText}
                      onChange={(e) => setFormHausaText(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-sans"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
                >
                  {isEditingMode ? dict.saveEditBtn : dict.savePublishBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  {dict.cancelBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        مجلة منارة الإخبارية والتوثيقية - المنظومة الشاملة لإدارة المراكز الدعوية ورعاية المساجد © 2026
      </footer>
    </div>
  );
}
