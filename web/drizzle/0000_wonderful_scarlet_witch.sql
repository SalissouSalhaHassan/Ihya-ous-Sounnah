CREATE TABLE "charity_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"category" varchar(50) NOT NULL,
	"donor_name" varchar(255),
	"donor_phone" varchar(50),
	"budget" numeric(14, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'XOF',
	"current_stage" varchar(100) DEFAULT 'INITIATED',
	"latitude" double precision,
	"longitude" double precision,
	"completion_percentage" integer DEFAULT 0,
	"report_token" varchar(100) NOT NULL,
	"status" varchar(50) DEFAULT 'IN_PROGRESS',
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "charity_projects_report_token_unique" UNIQUE("report_token")
);
--> statement-breakpoint
CREATE TABLE "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"project_id" uuid,
	"mosque_id" uuid,
	"donor_name" varchar(255),
	"donor_phone" varchar(50),
	"amount" numeric(14, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'XOF',
	"category" varchar(50) DEFAULT 'GENERAL',
	"receipt_number" varchar(100) NOT NULL,
	"idempotency_key" varchar(150),
	"date_paid" timestamp DEFAULT now(),
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "donations_receipt_number_unique" UNIQUE("receipt_number"),
	CONSTRAINT "donations_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "marriage_contracts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"mosque_id" uuid NOT NULL,
	"imam_id" uuid NOT NULL,
	"contract_number" varchar(100) NOT NULL,
	"groom_full_name" varchar(255) NOT NULL,
	"groom_national_id" varchar(50),
	"groom_birth_date" date,
	"groom_phone" varchar(50),
	"bride_full_name" varchar(255) NOT NULL,
	"bride_national_id" varchar(50),
	"bride_birth_date" date,
	"guardian_name" varchar(255) NOT NULL,
	"guardian_relation" varchar(100),
	"witness1_name" varchar(255) NOT NULL,
	"witness2_name" varchar(255) NOT NULL,
	"dowry_amount" numeric(14, 2) NOT NULL,
	"dowry_status" varchar(50) DEFAULT 'PAID',
	"dowry_notes" text,
	"contract_date" date NOT NULL,
	"verification_token" varchar(100) NOT NULL,
	"certificate_language" varchar(20) DEFAULT 'ar_fr',
	"certificate_url" text,
	"status" varchar(50) DEFAULT 'OFFICIALLY_REGISTERED',
	"idempotency_key" varchar(150),
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "marriage_contracts_contract_number_unique" UNIQUE("contract_number"),
	CONSTRAINT "marriage_contracts_verification_token_unique" UNIQUE("verification_token"),
	CONSTRAINT "marriage_contracts_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "mosque_staff" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"mosque_id" uuid NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	"phone" varchar(50),
	"national_id" varchar(50),
	"monthly_stipend" numeric(12, 2) DEFAULT '0.00',
	"preferred_language" varchar(10) DEFAULT 'ar',
	"status" varchar(50) DEFAULT 'ACTIVE',
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "mosques" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) DEFAULT 'JUMA',
	"city" varchar(100),
	"village" varchar(100),
	"latitude" double precision,
	"longitude" double precision,
	"capacity" integer DEFAULT 100,
	"has_water_well" boolean DEFAULT false,
	"has_solar_power" boolean DEFAULT false,
	"has_women_area" boolean DEFAULT false,
	"status" varchar(50) DEFAULT 'ACTIVE',
	"version" integer DEFAULT 1,
	"client_updated_at" timestamp DEFAULT now(),
	"server_synced_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(50) NOT NULL,
	"country" varchar(100) NOT NULL,
	"region" varchar(100),
	"default_language" varchar(10) DEFAULT 'ar',
	"contact_email" varchar(150),
	"contact_phone" varchar(50),
	"logo_url" text,
	"is_active" boolean DEFAULT true,
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "organizations_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "quran_circles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"mosque_id" uuid NOT NULL,
	"teacher_id" uuid,
	"name" varchar(255) NOT NULL,
	"target_level" varchar(100),
	"gender" varchar(20),
	"status" varchar(50) DEFAULT 'ACTIVE',
	"version" integer DEFAULT 1,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "quran_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"circle_id" uuid NOT NULL,
	"student_full_name" varchar(255) NOT NULL,
	"student_phone" varchar(50),
	"record_date" date NOT NULL,
	"surah_name" varchar(100) NOT NULL,
	"ayah_from" integer,
	"ayah_to" integer,
	"score" varchar(50),
	"revision_notes" text,
	"idempotency_key" varchar(150),
	"version" integer DEFAULT 1,
	"client_updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "quran_progress_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "sync_outbox_queue" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"organization_id" uuid NOT NULL,
	"device_id" varchar(100) NOT NULL,
	"staff_id" uuid,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" uuid NOT NULL,
	"action" varchar(20) NOT NULL,
	"payload" text NOT NULL,
	"idempotency_key" varchar(150) NOT NULL,
	"status" varchar(20) DEFAULT 'PROCESSED',
	"processed_at" timestamp DEFAULT now(),
	CONSTRAINT "sync_outbox_queue_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
ALTER TABLE "charity_projects" ADD CONSTRAINT "charity_projects_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_project_id_charity_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."charity_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "donations" ADD CONSTRAINT "donations_mosque_id_mosques_id_fk" FOREIGN KEY ("mosque_id") REFERENCES "public"."mosques"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marriage_contracts" ADD CONSTRAINT "marriage_contracts_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marriage_contracts" ADD CONSTRAINT "marriage_contracts_mosque_id_mosques_id_fk" FOREIGN KEY ("mosque_id") REFERENCES "public"."mosques"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "marriage_contracts" ADD CONSTRAINT "marriage_contracts_imam_id_mosque_staff_id_fk" FOREIGN KEY ("imam_id") REFERENCES "public"."mosque_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mosque_staff" ADD CONSTRAINT "mosque_staff_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mosque_staff" ADD CONSTRAINT "mosque_staff_mosque_id_mosques_id_fk" FOREIGN KEY ("mosque_id") REFERENCES "public"."mosques"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mosques" ADD CONSTRAINT "mosques_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quran_circles" ADD CONSTRAINT "quran_circles_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quran_circles" ADD CONSTRAINT "quran_circles_mosque_id_mosques_id_fk" FOREIGN KEY ("mosque_id") REFERENCES "public"."mosques"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quran_circles" ADD CONSTRAINT "quran_circles_teacher_id_mosque_staff_id_fk" FOREIGN KEY ("teacher_id") REFERENCES "public"."mosque_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quran_progress" ADD CONSTRAINT "quran_progress_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quran_progress" ADD CONSTRAINT "quran_progress_circle_id_quran_circles_id_fk" FOREIGN KEY ("circle_id") REFERENCES "public"."quran_circles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_outbox_queue" ADD CONSTRAINT "sync_outbox_queue_organization_id_organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organizations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sync_outbox_queue" ADD CONSTRAINT "sync_outbox_queue_staff_id_mosque_staff_id_fk" FOREIGN KEY ("staff_id") REFERENCES "public"."mosque_staff"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "marriage_mosque_idx" ON "marriage_contracts" USING btree ("mosque_id");--> statement-breakpoint
CREATE INDEX "marriage_token_idx" ON "marriage_contracts" USING btree ("verification_token");--> statement-breakpoint
CREATE INDEX "staff_mosque_idx" ON "mosque_staff" USING btree ("mosque_id");--> statement-breakpoint
CREATE INDEX "staff_org_idx" ON "mosque_staff" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "mosque_org_idx" ON "mosques" USING btree ("organization_id");--> statement-breakpoint
CREATE INDEX "quran_circle_idx" ON "quran_progress" USING btree ("circle_id");--> statement-breakpoint
CREATE INDEX "quran_date_idx" ON "quran_progress" USING btree ("record_date");