import { Locale } from "./i18n";

export const FUNERALS_DICT: Record<
  Locale,
  {
    title: string;
    badge: string;
    subtitle: string;
    addBtn: string;
    broadcastToast: string;
    feedTitle: string;
    years: string;
    broadcastBtn: string;
    prayerTimeLabel: string;
    graveyardLabel: string;
    plotLabel: string;
    contactLabel: string;
    contactNote: string;
    transportLabel: string;
    washHouse: string;
    endowmentTitle: string;
    endowmentDesc: string;
    washersGuide: string;
    cemeteriesMap: string;
    modalTitle: string;
    modalSubtitle: string;
    successMsg: string;
    deceasedNameLabel: string;
    ageLabel: string;
    genderLabel: string;
    prayerLabel: string;
    cancel: string;
    submit: string;
  }
> = {
  ar: {
    title: "شؤون الجنائز والتجهيز والمقابر الإسلامية",
    badge: "خدمة وقفية مجانية",
    subtitle: "تنسيق مواعيد صلاة الجنازة، بث التنبيهات الفورية لأهالي الحي، وتوثيق سجلات القبور بالمقابر الوقفية",
    addBtn: "تسجيل حالة وفاة وجنازة جديدة",
    broadcastToast: "تم إرسال بث الجنازة الموحد بنجاح عبر إشعارات التطبيق ورسائل WhatsApp لأهالي المنطقة.",
    feedTitle: "مواعيد صلاة الجنائز والتنسيق الميداني اليوم",
    years: "سنة",
    broadcastBtn: "بث إشعار الجنازة للحي",
    prayerTimeLabel: "وقت صلاة الجنازة",
    graveyardLabel: "المقبرة الوقفية",
    plotLabel: "رقم وموقع القبر:",
    contactLabel: "مندوب الأسرة والتعازي",
    contactNote: "للتنسيق ومواساة ذويه",
    transportLabel: "خدمات النقل والتكفين",
    washHouse: "مغسلة المسجد المركزية",
    endowmentTitle: "صندوق الوقف الخيري لتجهيز الجنائز والأكفان",
    endowmentDesc: "توفير الأكفان المجانية، سيارات نقل الموتى، وأعمال حفر القبور للأسر المتعففة إكراماً لموتى المسلمين.",
    washersGuide: "دليل المغسلين المعتمدين",
    cemeteriesMap: "خريطة وسجل المقابر (GIS)",
    modalTitle: "تسجيل حالة وفاة وجنازة وقفية",
    modalSubtitle: "تنسيق التجهيز وصلاة الجنازة وتخصيص القبر بالمقبرة",
    successMsg: "تم تسجيل حالة الجنازة بنجاح",
    deceasedNameLabel: "اسم المتوفى (رحمه الله)",
    ageLabel: "العمر",
    genderLabel: "الجنس",
    prayerLabel: "موعد صلاة الجنازة",
    cancel: "إلغاء",
    submit: "اعتماد ونشر الجنازة",
  },
  fr: {
    title: "Services Funéraires & Cimetières Waqf",
    badge: "Service Waqf Gratuit",
    subtitle: "Coordination des prières funéraires (Janazah), alertes de quartier et registre des cimetières Waqf",
    addBtn: "Enregistrer un décès / Janazah",
    broadcastToast: "L'alerte Janazah a été diffusée avec succès via l'application et WhatsApp aux habitants du quartier.",
    feedTitle: "Horaires des prières funéraires aujourd'hui",
    years: "ans",
    broadcastBtn: "Diffuser l'alerte au quartier",
    prayerTimeLabel: "Heure de la prière (Janazah)",
    graveyardLabel: "Cimetière Waqf",
    plotLabel: "Numéro de tombe :",
    contactLabel: "Représentant de la famille",
    contactNote: "Pour coordination et condoléances",
    transportLabel: "Transport & Linceul",
    washHouse: "Salle mortuaire centrale",
    endowmentTitle: "Fonds Waqf d'entraide funéraire",
    endowmentDesc: "Fourniture gratuite de linceuls, transport funéraire et préparation des tombes pour les familles nécessiteuses.",
    washersGuide: "Annuaire des laveurs agréés",
    cemeteriesMap: "Carte des cimetières (GIS)",
    modalTitle: "Nouvel enregistrement funéraire Waqf",
    modalSubtitle: "Planification de la prière funéraire et attribution de la tombe",
    successMsg: "Dossier funéraire enregistré avec succès",
    deceasedNameLabel: "Nom complet du défunt",
    ageLabel: "Âge",
    genderLabel: "Sexe",
    prayerLabel: "Heure de la prière Janazah",
    cancel: "Annuler",
    submit: "Valider et publier",
  },
  ha: {
    title: "Sha'anin Jana'iza da Makabartun Wakafi",
    badge: "Hidimar Wakafi Kyauta",
    subtitle: "Tsara lokacin sallar jana'iza, sanarwar gaggawa ga unguwa, da rijistar makabartu",
    addBtn: "Yi rijistar sabuwar jana'iza",
    broadcastToast: "An tura sanarwar jana'iza cikin nasara ta manhaja da WhatsApp ga mutanen unguwa.",
    feedTitle: "Jadawalin sallar jana'iza a yau",
    years: "shekaru",
    broadcastBtn: "Tura sanarwar jana'iza",
    prayerTimeLabel: "Lokacin sallar jana'iza",
    graveyardLabel: "Makabartar Wakafi",
    plotLabel: "Lambar kabari:",
    contactLabel: "Wakilin iyali",
    contactNote: "Don gaisuwa da daidaitawa",
    transportLabel: "Motar gawa da likkafani",
    washHouse: "Wurin wankin gawa na masallaci",
    endowmentTitle: "Asusun Wakafi na Likkafani da Jana'iza",
    endowmentDesc: "Bayar da likkafani kyauta, motar daukar gawa, da hakar kabari ga marasa karfi.",
    washersGuide: "Jerin masu wankin gawa",
    cemeteriesMap: "Taswirar makabartu (GIS)",
    modalTitle: "Rijistar mamaci da jana'iza",
    modalSubtitle: "Tsara sallar jana'iza da ware kabari a makabarta",
    successMsg: "An yi rijistar jana'iza cikin nasara",
    deceasedNameLabel: "Sunan mamaci",
    ageLabel: "Shekaru",
    genderLabel: "Jinsi",
    prayerLabel: "Lokacin sallar jana'iza",
    cancel: "Fasa",
    submit: "Ajiye da wallafawa",
  },
};

export const PROJECT_DICT: Record<
  Locale,
  {
    headerTitle: string;
    headerSub: string;
    shareBtn: string;
    gpsBadge: string;
    donorLabel: string;
    donorBlessing: string;
    progressLabel: string;
    stagesTitle: string;
    doneBadge: string;
    pendingBadge: string;
    galleryTitle: string;
    gallerySub: string;
    photoVerified: string;
    footer: string;
  }
> = {
  ar: {
    headerTitle: "بوابة المتبرع الشفافة",
    headerSub: "توثيق الأثر المباشر للمشاريع والآبار",
    shareBtn: "مشاركة الأثر",
    gpsBadge: "تقرير موثق بالأقمار الصناعية و GPS",
    donorLabel: "المتبرع الكريم",
    donorBlessing: "تقبل الله طاعتكم",
    progressLabel: "نسبة الإنجاز الميداني الإجمالية",
    stagesTitle: "مراحل التنفيذ الميداني للمشروع",
    doneBadge: "مكتمل بنجاح",
    pendingBadge: "قيد العمل",
    galleryTitle: "معرض التوثيق الميداني بالصور",
    gallerySub: "تحديث أسبوعي مستمر",
    photoVerified: "موثقة ومطابقة لإحداثيات الموقع الرسمي للبئر",
    footer: "Ihya'ous Sounnah للشفافية وتوثيق الأوقاف والمشاريع الخيرية © 2026",
  },
  fr: {
    headerTitle: "Portail Donateurs Transparent",
    headerSub: "Suivi en direct de l'impact des projets et puits",
    shareBtn: "Partager l'impact",
    gpsBadge: "Rapport vérifié par satellite & GPS",
    donorLabel: "Généreux Donateur",
    donorBlessing: "Qu'Allah accepte votre œuvre",
    progressLabel: "Avancement global sur le terrain",
    stagesTitle: "Étapes de réalisation sur le terrain",
    doneBadge: "Terminé avec succès",
    pendingBadge: "En cours",
    galleryTitle: "Galerie de documentation terrain",
    gallerySub: "Mise à jour hebdomadaire",
    photoVerified: "Vérifiée et conforme aux coordonnées GPS officielles du puits",
    footer: "Ihya'ous Sounnah — Transparence des Awqaf et Projets © 2026",
  },
  ha: {
    headerTitle: "Kofar Masu Taimako",
    headerSub: "Bibiyar ayyukan rijiyoyi da masallatai kai tsaye",
    shareBtn: "Raba sakamako",
    gpsBadge: "Rahoto mai shaidar GPS da tauraron dan adam",
    donorLabel: "Mai Taimako",
    donorBlessing: "Allah ya karbi ibadarku",
    progressLabel: "Adadin kammaluwar aiki gaba daya",
    stagesTitle: "Matakan gudanar da aikin",
    doneBadge: "An kammala",
    pendingBadge: "Ana aiki",
    galleryTitle: "Hotunan aikin da aka yi",
    gallerySub: "Ana sabuntawa kowane mako",
    photoVerified: "An tabbatar da daidaiton hoton da wurin GPS",
    footer: "Ihya'ous Sounnah — Gaskiya da Rikon Amana © 2026",
  },
};

export const ZAKAT_DICT: Record<
  Locale,
  {
    title: string;
    badge: string;
    subtitle: string;
    nisabBadge: string;
    calcTitle: string;
    cashLabel: string;
    goldLabel: string;
    tradeLabel: string;
    debtsLabel: string;
    summaryTitle: string;
    totalWealthLabel: string;
    nisabThresholdLabel: string;
    eligibleBadge: string;
    notEligibleBadge: string;
    zakatDueLabel: string;
    issueReceiptBtn: string;
    disbursementsTitle: string;
    disbursementsSub: string;
    modalBadge: string;
    modalTitle: string;
    modalSub: string;
    receiptNoLabel: string;
    payerLabel: string;
    amountLabel: string;
    categoryLabel: string;
    treasurerNote: string;
    blessing: string;
    printBtn: string;
    closeBtn: string;
  }
> = {
  ar: {
    title: "منظومة الزكاة الذكية والمصارف الشرعية",
    badge: "دقة فقهية 100%",
    subtitle: "حاسبة نصاب الذهب والفضة وعروض التجارة وإصدار سندات القبض الموثقة",
    nisabBadge: "نصاب الذهب (85 غرام):",
    calcTitle: "حاسبة الزكاة الشرعية التفاعلية",
    cashLabel: "الأموال النقدية والمدخرات (XOF)",
    goldLabel: "الذهب الخالص (بالغرام)",
    tradeLabel: "عروض التجارة والبضائع (XOF)",
    debtsLabel: "الديون المستحقة عليك حالاً (XOF)",
    summaryTitle: "الوعاء الزكوي والمقدار الواجب",
    totalWealthLabel: "إجمالي الثروة الخاضعة للزكاة:",
    nisabThresholdLabel: "حد النصاب الشرعي اليوم:",
    eligibleBadge: "تجب عليك الزكاة (بلغ النصاب)",
    notEligibleBadge: "دون النصاب الشرعي",
    zakatDueLabel: "مقدار الزكاة الواجبة (2.5%):",
    issueReceiptBtn: "إصدار سند قبض زكاة رسمي",
    disbursementsTitle: "سجل توزيع الزكاة على المصارف الشرعية",
    disbursementsSub: "توثيق الصرف الميداني عبر لجان المساجد",
    modalBadge: "سند قبض شرعي معتمد - خالٍ من الشبهات",
    modalTitle: "إيصال استلام زكاة مال شرعية",
    modalSub: "صادر عن حساب الزكاة والصدقات الموحد - Ihya'ous Sounnah",
    receiptNoLabel: "رقم الإيصال المتسلسل:",
    payerLabel: "اسم المزكي الكريم:",
    amountLabel: "مقدار الزكاة المستلمة:",
    categoryLabel: "المصرف الشرعي الموجه إليه:",
    treasurerNote: "اعتماد أمين الصندوق والخزينة الوقفية",
    blessing: "أجزل الله لكم الأجر وبارك في مالكم",
    printBtn: "طباعة الإيصال الرسمي (PDF)",
    closeBtn: "إغلاق",
  },
  fr: {
    title: "Système Intelligent de Zakat & Distribution",
    badge: "Conformité Charia 100%",
    subtitle: "Calculateur du Nisab or/argent/commerce et émission de reçus officiels vérifiés",
    nisabBadge: "Nisab Or (85g) :",
    calcTitle: "Calculateur Interactif de Zakat",
    cashLabel: "Liquidités et épargne (XOF)",
    goldLabel: "Or pur (en grammes)",
    tradeLabel: "Marchandises commerciales (XOF)",
    debtsLabel: "Dettes exigibles immédiatement (XOF)",
    summaryTitle: "Assiette Zakatable & Montant Dû",
    totalWealthLabel: "Patrimoine net imposable :",
    nisabThresholdLabel: "Seuil du Nisab aujourd'hui :",
    eligibleBadge: "Zakat obligatoire (Nisab atteint)",
    notEligibleBadge: "En dessous du Nisab",
    zakatDueLabel: "Montant de la Zakat due (2,5%) :",
    issueReceiptBtn: "Émettre un reçu officiel de Zakat",
    disbursementsTitle: "Registre des distributions aux 8 catégories",
    disbursementsSub: "Traçabilité des versements via les comités de mosquées",
    modalBadge: "Reçu officiel certifié — Zakat Al-Mal",
    modalTitle: "Quittance de Paiement de la Zakat",
    modalSub: "Compte unifié Zakat & Sadaqat — Ihya'ous Sounnah",
    receiptNoLabel: "Numéro de reçu :",
    payerLabel: "Nom du donateur :",
    amountLabel: "Montant de la Zakat perçue :",
    categoryLabel: "Catégorie bénéficiaire :",
    treasurerNote: "Visé par le Trésorier Waqf",
    blessing: "Qu'Allah vous récompense et bénisse vos biens",
    printBtn: "Imprimer le reçu officiel (PDF)",
    closeBtn: "Fermer",
  },
  ha: {
    title: "Tsarin Zakka da Raba Tallafi",
    badge: "Daidai da Shari'a 100%",
    subtitle: "Lissafin Nisabin zinariya da kasuwanci tare da fitar da rasidin Zakka",
    nisabBadge: "Nisabin Zinariya (85g):",
    calcTitle: "Na'urar Lissafin Zakka",
    cashLabel: "Kudin hannu da ajiya (XOF)",
    goldLabel: "Zinariya (a gram)",
    tradeLabel: "Kayan kasuwanci (XOF)",
    debtsLabel: "Basussukan da ke kanka (XOF)",
    summaryTitle: "Jimillar Dukiya da Zakkar da ta Wajaba",
    totalWealthLabel: "Jimillar dukiyar Zakka:",
    nisabThresholdLabel: "Adadin Nisabi a yau:",
    eligibleBadge: "Zakka ta wajaba (An kai Nisabi)",
    notEligibleBadge: "Bai kai Nisabi ba",
    zakatDueLabel: "Zakkar da za a fitar (2.5%):",
    issueReceiptBtn: "Fitar da rasidin Zakka na hukuma",
    disbursementsTitle: "Rijistar raba Zakka ga rukunai takwas",
    disbursementsSub: "Bin diddigin rabo ta kwamitocin masallatai",
    modalBadge: "Rasidin Zakka na hukuma",
    modalTitle: "Takardar Karbar Zakkar Dukiya",
    modalSub: "Asusun Zakka da Sadaka — Ihya'ous Sounnah",
    receiptNoLabel: "Lambar rasidi:",
    payerLabel: "Sunan mai Zakka:",
    amountLabel: "Adadin Zakkar da aka karba:",
    categoryLabel: "Rukunin masu karba:",
    treasurerNote: "Sahalewar Ma'ajin Wakafi",
    blessing: "Allah ya saka da alheri ya albarkaci dukiya",
    printBtn: "Buga rasidi (PDF)",
    closeBtn: "Rufe",
  },
};

export const MAINTENANCE_DICT: Record<
  Locale,
  {
    title: string;
    badge: string;
    subtitle: string;
    newTicketBtn: string;
    ticketsTitle: string;
    statusOpen: string;
    statusInProgress: string;
    statusResolved: string;
    markResolved: string;
    modalTitle: string;
    mosqueLabel: string;
    issueLabel: string;
    priorityLabel: string;
    cancel: string;
    submit: string;
    statTotal: string;
    statCritical: string;
    statInProgress: string;
    statResolved: string;
    filterAll: string;
    filterCritical: string;
    filterInProgress: string;
    filterPending: string;
    filterResolved: string;
    searchPlaceholder: string;
    logTitle: string;
    matchingCount: string;
    photosLabel: string;
    estCostLabel: string;
    techLabel: string;
    viewReportBtn: string;
    villageScopeBanner: string;
  }
> = {
  ar: {
    title: "مكتب الصيانة وتجهيزات المساجد",
    badge: "نظام التذاكر الميداني",
    subtitle: "متابعة أعطال الصوتيات، الطاقة الشمسية، السباكة، وتذاكر الفحص الميداني",
    newTicketBtn: "فتح تذكرة صيانة جديدة",
    ticketsTitle: "تذاكر الصيانة والأعطال الجارية",
    statusOpen: "مفتوحة",
    statusInProgress: "قيد التنفيذ",
    statusResolved: "تم الإصلاح",
    markResolved: "تأكيد الإصلاح",
    modalTitle: "رفع بلاغ عطل أو طلب صيانة",
    mosqueLabel: "اسم المسجد",
    issueLabel: "وصف العطل أو الصيانة",
    priorityLabel: "درجة الأولوية",
    cancel: "إلغاء",
    submit: "إرسال التذكرة",
    statTotal: "إجمالي بلاغات هذا الشهر",
    statCritical: "أعطال حرجة قبل الجمعة",
    statInProgress: "مشاريع صيانة قيد التنفيذ",
    statResolved: "تم إنجازها بنجاح",
    filterAll: "كافة التذاكر",
    filterCritical: "حرجة قبل الجمعة",
    filterInProgress: "قيد التنفيذ",
    filterPending: "بانتظار الميزانية",
    filterResolved: "مكتملة",
    searchPlaceholder: "بحث بالمسجد أو العطل أو الحي...",
    logTitle: "سجل التذاكر والزيارات الميدانية للمفتشين",
    matchingCount: "بلاغات مطابقة",
    photosLabel: "صور توثيق (قبل وبعد)",
    estCostLabel: "التكلفة التقديرية:",
    techLabel: "المكلف:",
    viewReportBtn: "عرض التقرير والصور",
    villageScopeBanner: "سجلات الصيانة المعزولة للقرية:",
  },
  fr: {
    title: "Maintenance & Équipements des Mosquées",
    badge: "Système de Tickets Terrain",
    subtitle: "Suivi des pannes audio, énergie solaire, plomberie et visites d'inspection",
    newTicketBtn: "Nouveau ticket de maintenance",
    ticketsTitle: "Tickets de maintenance en cours",
    statusOpen: "Ouvert",
    statusInProgress: "En cours",
    statusResolved: "Résolu",
    markResolved: "Marquer résolu",
    modalTitle: "Signaler un incident technique",
    mosqueLabel: "Nom de la mosquée",
    issueLabel: "Description de la panne",
    priorityLabel: "Priorité",
    cancel: "Annuler",
    submit: "Envoyer le ticket",
    statTotal: "Total des tickets ce mois",
    statCritical: "Pannes critiques (avant Vendredi)",
    statInProgress: "Travaux en cours",
    statResolved: "Résolus avec succès",
    filterAll: "Tous les tickets",
    filterCritical: "Critiques",
    filterInProgress: "En cours",
    filterPending: "En attente budget",
    filterResolved: "Terminés",
    searchPlaceholder: "Rechercher par mosquée, panne ou quartier...",
    logTitle: "Journal des tickets et visites d'inspection",
    matchingCount: "tickets correspondants",
    photosLabel: "photos (avant / après)",
    estCostLabel: "Coût estimé :",
    techLabel: "Responsable :",
    viewReportBtn: "Voir rapport & photos",
    villageScopeBanner: "Tickets isolés pour le village :",
  },
  ha: {
    title: "Gyara da Kula da Kayan Masallatai",
    badge: "Tsarin Rahoton Gyara",
    subtitle: "Bibiyar matsalar lasifika, hasken rana, famfo da duba masallatai",
    newTicketBtn: "Buɗe sabon rahoton gyara",
    ticketsTitle: "Rahotannin gyara da ke gudana",
    statusOpen: "A buɗe",
    statusInProgress: "Ana gyara",
    statusResolved: "An gyara",
    markResolved: "Tabbatar an gyara",
    modalTitle: "Tura rahoton matsala",
    mosqueLabel: "Sunan masallaci",
    issueLabel: "Bayanin matsalar",
    priorityLabel: "Gaggawa",
    cancel: "Fasa",
    submit: "Tura rahoto",
    statTotal: "Jimillar rahotanni a wannan watan",
    statCritical: "Matsalolin gaggawa kafin Juma'a",
    statInProgress: "Ayyukan gyara da ke gudana",
    statResolved: "An kammala cikin nasara",
    filterAll: "Dukkan rahotanni",
    filterCritical: "Na gaggawa",
    filterInProgress: "Ana gyara",
    filterPending: "Ana jiran kasafi",
    filterResolved: "An kammala",
    searchPlaceholder: "Nemo da sunan masallaci ko matsala...",
    logTitle: "Rijistar rahotanni da ziyarar dubawa",
    matchingCount: "rahotanni da suka dace",
    photosLabel: "hotunan shaida (kafin/bayan)",
    estCostLabel: "Kudin da ake tsammani:",
    techLabel: "Mai kula:",
    viewReportBtn: "Duba rahoto da hotuna",
    villageScopeBanner: "Rahotannin gyara na ƙauye:",
  },
};

export const SECURITY_DICT: Record<
  Locale,
  {
    title: string;
    badge: string;
    subtitle: string;
    tabParking: string;
    tabIncidents: string;
    tabLost: string;
    searchPlaceholder: string;
    sosBtn: string;
    addVehicleBtn: string;
    addIncidentBtn: string;
    addLostBtn: string;
    gateOfflineTitle: string;
    gateOfflineDesc: string;
    parkedCountLabel: string;
    vehicleTypeLabel: string;
    ownerLabel: string;
    entryTimeLabel: string;
    phoneLabel: string;
    qrTicketBtn: string;
    parkedStatus: string;
    exitedStatus: string;
    villageScopeBanner: string;
  }
> = {
  ar: {
    title: "أمن المسجد وتأمين مواقف المركبات",
    badge: "حراسة وبوابات QR",
    subtitle: "تنظيم مواقف السيارات والدراجات أيام الجمعة والتراويح، البلاغات الأمنية، وسجل المفقودات",
    tabParking: "مواقف المركبات",
    tabIncidents: "البلاغات الأمنية",
    tabLost: "المفقودات والأمانات",
    searchPlaceholder: "بحث برقم اللوحة أو الغرض...",
    sosBtn: "إرسال نداء طوارئ (SOS)",
    addVehicleBtn: "تسجيل دخول مركبة جديدة",
    addIncidentBtn: "تسجيل بلاغ أمني جديد",
    addLostBtn: "تسجيل مفقود جديد",
    gateOfflineTitle: "نظام حارس البوابة الذكي (Gate Scanner) يعمل أوفلاين",
    gateOfflineDesc: "مسح لوحات المركبات وتوليد بطاقات الوقوف مستمر حتى في انقطاع شبكة المسجد كلياً",
    parkedCountLabel: "مركبة بالموقف الآن",
    vehicleTypeLabel: "نوع المركبة:",
    ownerLabel: "صاحب المركبة:",
    entryTimeLabel: "وقت الدخول:",
    phoneLabel: "هاتف المصلي:",
    qrTicketBtn: "تذكرة QR",
    parkedStatus: "متواجدة بأمان في الموقف",
    exitedStatus: "تم التحقق والمغادرة بسلام",
    villageScopeBanner: "سجلات الأمن والمواقف للقرية:",
  },
  fr: {
    title: "Sécurité & Gestion des Parkings",
    badge: "Contrôle & Tickets QR",
    subtitle: "Gestion des parkings voitures/motos (Jumu'a & Tarawih), incidents et objets trouvés",
    tabParking: "Stationnement",
    tabIncidents: "Incidents de sécurité",
    tabLost: "Objets trouvés",
    searchPlaceholder: "Rechercher par plaque ou objet...",
    sosBtn: "Alerte d'urgence (SOS)",
    addVehicleBtn: "Enregistrer un véhicule",
    addIncidentBtn: "Signaler un incident",
    addLostBtn: "Enregistrer un objet trouvé",
    gateOfflineTitle: "Contrôle d'accès Gate Scanner (Mode Hors-ligne)",
    gateOfflineDesc: "Le scan des plaques et la génération de tickets QR fonctionnent même sans connexion Internet",
    parkedCountLabel: "véhicule(s) stationné(s)",
    vehicleTypeLabel: "Type de véhicule :",
    ownerLabel: "Propriétaire :",
    entryTimeLabel: "Heure d'entrée :",
    phoneLabel: "Téléphone :",
    qrTicketBtn: "Ticket QR",
    parkedStatus: "Stationné en sécurité",
    exitedStatus: "Vérifié & Sorti",
    villageScopeBanner: "Sécurité & parking isolés pour :",
  },
  ha: {
    title: "Tsaron Masallaci da Ajiye Motoci",
    badge: "Kula da Kofofi QR",
    subtitle: "Tsara wurin ajiye motoci da babura, rahoton tsaro, da kayan da suka bata",
    tabParking: "Wurin Ajiye Mota",
    tabIncidents: "Rahoton Tsaro",
    tabLost: "Kayan da suka Bata",
    searchPlaceholder: "Nemo da lambar mota ko kaya...",
    sosBtn: "Tura kiran gaggawa (SOS)",
    addVehicleBtn: "Yi rijistar shigar mota",
    addIncidentBtn: "Yi rijistar rahoton tsaro",
    addLostBtn: "Yi rijistar abin da ya ɓata",
    gateOfflineTitle: "Tsarin Gate Scanner yana aiki ba tare da net ba",
    gateOfflineDesc: "Ana ci gaba da duba lambobin motoci da bayar da katin QR ko da babu intanet",
    parkedCountLabel: "motoci a wurin ajiya yanzu",
    vehicleTypeLabel: "Nau'in abin hawa:",
    ownerLabel: "Mai abin hawa:",
    entryTimeLabel: "Lokacin shiga:",
    phoneLabel: "Lambar waya:",
    qrTicketBtn: "Katin QR",
    parkedStatus: "Yana ajiye lafiya",
    exitedStatus: "An duba kuma ya fita",
    villageScopeBanner: "Bayanan tsaro na ƙauyen:",
  },
};

export const LIBRARY_DICT: Record<
  Locale,
  {
    title: string;
    badge: string;
    subtitle: string;
    tabBooks: string;
    tabQuran: string;
    tabLoans: string;
    searchPlaceholder: string;
  }
> = {
  ar: {
    title: "المكتبة المسجدية وجرد المصاحف",
    badge: "الوقف العلمي",
    subtitle: "فهرسة الكتب الشرعية، جرد نسخ المصحف الشريف بروايتي ورش وحفص، ومتابعة الإعارات",
    tabBooks: "الكتب والمراجع",
    tabQuran: "جرد المصاحف",
    tabLoans: "سجل الإعارات",
    searchPlaceholder: "ابحث في المكتبة أو المصاحف...",
  },
  fr: {
    title: "Bibliothèque & Inventaire des Corans",
    badge: "Waqf Scientifique",
    subtitle: "Catalogage des ouvrages islamiques, inventaire des Mushafs (Warch/Hafs) et suivi des prêts",
    tabBooks: "Livres & Références",
    tabQuran: "Inventaire Corans",
    tabLoans: "Registre des prêts",
    searchPlaceholder: "Rechercher un livre ou un Mushaf...",
  },
  ha: {
    title: "Laburare da Kula da Alkur'ani",
    badge: "Wakafin Ilmi",
    subtitle: "Jerin littattafan addini, kirga mushafai (Warsh/Hafs), da bin diddigin aro",
    tabBooks: "Littattafai",
    tabQuran: "Kirga Mushafai",
    tabLoans: "Rijistar Aro",
    searchPlaceholder: "Nemo littafi ko mushafi...",
  },
};

export const FATWA_DICT: Record<
  Locale,
  {
    title: string;
    badge: string;
    subtitle: string;
    askBtn: string;
    tabFatwa: string;
    tabSermons: string;
    tabRecon: string;
    searchPlaceholder: string;
  }
> = {
  ar: {
    title: "مجلس العلماء وهيئة الإفتاء والصلح",
    badge: "المرجعية الشرعية",
    subtitle: "بنك الفتاوى الموثقة، خطب الجمعة الموحدة، وتوثيق جلسات الصلح والتحكيم",
    askBtn: "رفع استفتاء شرعي جديد",
    tabFatwa: "بنك الفتاوى",
    tabSermons: "خطب الجمعة",
    tabRecon: "محاضر الصلح",
    searchPlaceholder: "ابحث في الفتاوى أو الخطب...",
  },
  fr: {
    title: "Conseil des Oulémas, Fatwas & Médiation",
    badge: "Référence Religieuse",
    subtitle: "Banque de fatwas certifiées, sermons du vendredi unifiés et procès-verbaux de réconciliation",
    askBtn: "Poser une question (Fatwa)",
    tabFatwa: "Banque de Fatwas",
    tabSermons: "Sermons (Khutbah)",
    tabRecon: "Médiation & Sulh",
    searchPlaceholder: "Rechercher une fatwa ou un sermon...",
  },
  ha: {
    title: "Majalisar Malamai, Fatawa da Sulhu",
    badge: "Hukumar Shari'a",
    subtitle: "Fatawoyin malamai, hudubobin Juma'a, da rubutattun yarjejeniyar sulhu",
    askBtn: "Tura tambayar fatawa",
    tabFatwa: "Fatawoyi",
    tabSermons: "Hudubobin Juma'a",
    tabRecon: "Yarjejeniyar Sulhu",
    searchPlaceholder: "Nemo fatawa ko huduba...",
  },
};

export const MARRIAGE_DICT: Record<
  Locale,
  {
    title: string;
    badge: string;
    subtitle: string;
    printBtn: string;
    formTitle: string;
    previewTitle: string;
  }
> = {
  ar: {
    title: "إدارة عقود الزواج الشرعية والشهادات",
    badge: "وثيقة QR مشفرة",
    subtitle: "تحرير عقود النكاح بالمسجد وإصدار الوثائق الرسمية الموثقة برمز تحقق رقمي",
    printBtn: "طباعة الشهادة الرسمية",
    formTitle: "بيانات عقد القران الشرعي",
    previewTitle: "معاينة وثيقة الزواج الرسمية",
  },
  fr: {
    title: "Contrats de Mariage (Nikah) & Certificats",
    badge: "Certificat QR Sécurisé",
    subtitle: "Rédaction des actes de mariage à la mosquée et édition des certificats officiels",
    printBtn: "Imprimer le certificat officiel",
    formTitle: "Informations de l'acte de mariage",
    previewTitle: "Aperçu du certificat officiel",
  },
  ha: {
    title: "Daurin Aure a Masallaci da Takardu",
    badge: "Takardar QR ta Tsaro",
    subtitle: "Rubuta daurin aure a masallaci tare da fitar da shaidar aure ta hukuma",
    printBtn: "Buga takardar aure",
    formTitle: "Bayanin daurin aure",
    previewTitle: "Samfurin takardar aure",
  },
};
