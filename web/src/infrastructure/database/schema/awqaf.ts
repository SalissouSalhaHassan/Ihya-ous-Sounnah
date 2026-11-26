import {
  pgTable,
  varchar,
  text,
  integer,
  doublePrecision,
  boolean,
  timestamp,
  date,
  decimal,
  uuid,
  index,
} from "drizzle-orm/pg-core";

// ==========================================
// 1. المنظمات والهيئات الوقفية الشريكة (Multi-Tenancy)
// ==========================================
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  code: varchar("code", { length: 50 }).unique().notNull(), // مثل: AWQAF-NIGER-01
  country: varchar("country", { length: 100 }).notNull(),
  region: varchar("region", { length: 100 }),
  defaultLanguage: varchar("default_language", { length: 10 }).default("ar"), // ar, fr, ha
  contactEmail: varchar("contact_email", { length: 150 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  logoUrl: text("logo_url"),
  isActive: boolean("is_active").default(true),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==========================================
// 2. سجل المساجد والمصليات (Mosques & Facilities)
// ==========================================
export const mosques = pgTable("mosques", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).default("JUMA"), // JUMA, FIVE_DAILY, MUSALLA
  city: varchar("city", { length: 100 }),
  village: varchar("village", { length: 100 }),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  capacity: integer("capacity").default(100),
  hasWaterWell: boolean("has_water_well").default(false),
  hasSolarPower: boolean("has_solar_power").default(false),
  hasWomenArea: boolean("has_women_area").default(false),
  status: varchar("status", { length: 50 }).default("ACTIVE"),
  // حقول دعم المزامنة والعمل المنقطع
  version: integer("version").default(1),
  clientUpdatedAt: timestamp("client_updated_at").defaultNow(),
  serverSyncedAt: timestamp("server_synced_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  deletedAt: timestamp("deleted_at"),
}, (table) => [
  index("mosque_org_idx").on(table.organizationId),
]);

// ==========================================
// 3. كادر المسجد (الأئمة، الخطباء، المأذونون، والحراس)
// ==========================================
export const mosqueStaff = pgTable("mosque_staff", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  mosqueId: uuid("mosque_id").references(() => mosques.id).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(), // IMAM, KHATIB, MUEZZIN, NIKAH_OFFICER, GUARD, CARETAKER
  phone: varchar("phone", { length: 50 }),
  nationalId: varchar("national_id", { length: 50 }),
  monthlyStipend: decimal("monthly_stipend", { precision: 12, scale: 2 }).default("0.00"),
  preferredLanguage: varchar("preferred_language", { length: 10 }).default("ar"), // ar, fr, ha
  status: varchar("status", { length: 50 }).default("ACTIVE"),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("staff_mosque_idx").on(table.mosqueId),
  index("staff_org_idx").on(table.organizationId),
]);

// ==========================================
// 4. حلقات تحفيظ القرآن والمدارس الدعوية
// ==========================================
export const quranCircles = pgTable("quran_circles", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  mosqueId: uuid("mosque_id").references(() => mosques.id).notNull(),
  teacherId: uuid("teacher_id").references(() => mosqueStaff.id),
  name: varchar("name", { length: 255 }).notNull(),
  targetLevel: varchar("target_level", { length: 100 }), // BEGINNER, JUZ_AMMA, MEMORIZATION, IJAZAH
  gender: varchar("gender", { length: 20 }), // MALE, FEMALE, MIXED_KIDS
  status: varchar("status", { length: 50 }).default("ACTIVE"),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==========================================
// 5. سجل تسميع وحفظ القرآن اليومي (Offline-Ready)
// ==========================================
export const quranProgress = pgTable("quran_progress", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  circleId: uuid("circle_id").references(() => quranCircles.id).notNull(),
  studentFullName: varchar("student_full_name", { length: 255 }).notNull(),
  studentPhone: varchar("student_phone", { length: 50 }),
  recordDate: date("record_date").notNull(),
  surahName: varchar("surah_name", { length: 100 }).notNull(),
  ayahFrom: integer("ayah_from"),
  ayahTo: integer("ayah_to"),
  score: varchar("score", { length: 50 }), // EXCELLENT, VERY_GOOD, NEEDS_PRACTICE
  revisionNotes: text("revision_notes"),
  idempotencyKey: varchar("idempotency_key", { length: 150 }).unique(),
  version: integer("version").default(1),
  clientUpdatedAt: timestamp("client_updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("quran_circle_idx").on(table.circleId),
  index("quran_date_idx").on(table.recordDate),
]);

// ==========================================
// 6. مشاريع الآبار والإنشاءات وكفالة الأيتام
// ==========================================
export const charityProjects = pgTable("charity_projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // WATER_WELL, MOSQUE_BUILD, ORPHAN, FOOD_BASKET
  donorName: varchar("donor_name", { length: 255 }),
  donorPhone: varchar("donor_phone", { length: 50 }),
  budget: decimal("budget", { precision: 14, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("XOF"),
  currentStage: varchar("current_stage", { length: 100 }).default("INITIATED"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  completionPercentage: integer("completion_percentage").default(0),
  reportToken: varchar("report_token", { length: 100 }).unique().notNull(), // رابط المتبرع الشفاف
  status: varchar("status", { length: 50 }).default("IN_PROGRESS"),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==========================================
// 7. التبرعات والزكاة وسندات القبض (Append-Only)
// ==========================================
export const donations = pgTable("donations", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  projectId: uuid("project_id").references(() => charityProjects.id),
  mosqueId: uuid("mosque_id").references(() => mosques.id),
  donorName: varchar("donor_name", { length: 255 }),
  donorPhone: varchar("donor_phone", { length: 50 }),
  amount: decimal("amount", { precision: 14, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("XOF"),
  category: varchar("category", { length: 50 }).default("GENERAL"), // MOSQUE_BUILD, WATER_WELL, ZAKAT, SADAQAH
  receiptNumber: varchar("receipt_number", { length: 100 }).unique().notNull(),
  idempotencyKey: varchar("idempotency_key", { length: 150 }).unique(),
  datePaid: timestamp("date_paid").defaultNow(),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==========================================
// 8. عقود الزواج الشرعية بالمسجد (Immutable Records)
// ==========================================
export const marriageContracts = pgTable("marriage_contracts", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  mosqueId: uuid("mosque_id").references(() => mosques.id).notNull(),
  imamId: uuid("imam_id").references(() => mosqueStaff.id).notNull(),
  contractNumber: varchar("contract_number", { length: 100 }).unique().notNull(),
  
  // بيانات الزوجين
  groomFullName: varchar("groom_full_name", { length: 255 }).notNull(),
  groomNationalId: varchar("groom_national_id", { length: 50 }),
  groomBirthDate: date("groom_birth_date"),
  groomPhone: varchar("groom_phone", { length: 50 }),
  
  brideFullName: varchar("bride_full_name", { length: 255 }).notNull(),
  brideNationalId: varchar("bride_national_id", { length: 50 }),
  brideBirthDate: date("bride_birth_date"),

  // الولي والشهود
  guardianName: varchar("guardian_name", { length: 255 }).notNull(),
  guardianRelation: varchar("guardian_relation", { length: 100 }),
  witness1Name: varchar("witness1_name", { length: 255 }).notNull(),
  witness2Name: varchar("witness2_name", { length: 255 }).notNull(),

  // المهر
  dowryAmount: decimal("dowry_amount", { precision: 14, scale: 2 }).notNull(),
  dowryStatus: varchar("dowry_status", { length: 50 }).default("PAID"), // PAID, PARTIAL, DEFERRED
  dowryNotes: text("dowry_notes"),
  contractDate: date("contract_date").notNull(),
  
  // التحقق والرموز الرقمية
  verificationToken: varchar("verification_token", { length: 100 }).unique().notNull(),
  certificateLanguage: varchar("certificate_language", { length: 20 }).default("ar_fr"), // ar, ar_fr, ar_ha
  certificateUrl: text("certificate_url"),
  status: varchar("status", { length: 50 }).default("OFFICIALLY_REGISTERED"),
  
  idempotencyKey: varchar("idempotency_key", { length: 150 }).unique(),
  version: integer("version").default(1),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("marriage_mosque_idx").on(table.mosqueId),
  index("marriage_token_idx").on(table.verificationToken),
]);

// ==========================================
// 9. طابور المزامنة المركزية وحركات الأوفلاين (Sync Outbox Audit)
// ==========================================
export const syncOutboxQueue = pgTable("sync_outbox_queue", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  deviceId: varchar("device_id", { length: 100 }).notNull(),
  staffId: uuid("staff_id").references(() => mosqueStaff.id),
  entityType: varchar("entity_type", { length: 50 }).notNull(), // MOSQUE, QURAN_PROGRESS, MARRIAGE, DONATION
  entityId: uuid("entity_id").notNull(),
  action: varchar("action", { length: 20 }).notNull(), // INSERT, UPDATE, MERGE
  payload: text("payload").notNull(),
  idempotencyKey: varchar("idempotency_key", { length: 150 }).unique().notNull(),
  status: varchar("status", { length: 20 }).default("PROCESSED"), // PROCESSED, CONFLICT_RESOLVED
  processedAt: timestamp("processed_at").defaultNow(),
});

// ==========================================
// 10. الفتاوى والاستفتاءات الشرعية (Fatwa & Scholars)
// ==========================================
export const fatwaQuestions = pgTable("fatwa_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  refCode: varchar("ref_code", { length: 100 }).unique().notNull(),
  category: varchar("category", { length: 120 }).notNull(),
  askerName: varchar("asker_name", { length: 255 }),
  question: text("question").notNull(),
  answer: text("answer"),
  evidence: text("evidence"),
  scholarName: varchar("scholar_name", { length: 255 }),
  isPublic: boolean("is_public").default(true),
  status: varchar("status", { length: 30 }).default("PENDING"), // PENDING, ANSWERED
  createdAt: timestamp("created_at").defaultNow(),
  answeredAt: timestamp("answered_at"),
});

// ==========================================
// 11. مقالات وتقارير مجلة منارة (Magazine Articles)
// ==========================================
export const magazineArticles = pgTable("magazine_articles", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  title: varchar("title", { length: 500 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(), // AWQAF, QURAN, PROJECTS, DAWAH, COMMUNITY
  categoryLabel: varchar("category_label", { length: 120 }),
  author: varchar("author", { length: 255 }).notNull(),
  summary: text("summary").notNull(),
  arabicText: text("arabic_text"),
  frenchText: text("french_text"),
  hausaText: text("hausa_text"),
  clausesJson: text("clauses_json"),
  imagesJson: text("images_json"),
  views: integer("views").default(0),
  publishedDate: varchar("published_date", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==========================================
// 12. استمارات الحصيلة السنوية والممتلكات (Bilan 2026 - Village Isolated)
// ==========================================
export const bilanFiches2026 = pgTable("bilan_fiches_2026", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id).notNull(),
  ownerUserId: uuid("owner_user_id").notNull(),
  ownerEmail: varchar("owner_email", { length: 255 }),
  sectionName: varchar("section_name", { length: 255 }).notNull(),
  faitA: varchar("fait_a", { length: 150 }),
  payloadJson: text("payload_json").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("bilan_owner_idx").on(table.ownerUserId),
]);
