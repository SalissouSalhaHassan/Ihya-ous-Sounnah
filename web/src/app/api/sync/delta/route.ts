import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, resolveOrganizationId } from "@/infrastructure/supabase/auth";

interface SyncBatchItem {
  id: string;
  entityType:
    | "MOSQUE"
    | "QURAN_PROGRESS"
    | "MARRIAGE"
    | "MARRIAGE_CONTRACT"
    | "DONATION"
    | "SECURITY_GATE"
    | "FUNERAL"
    | "FATWA_QUESTION";
  entityId: string;
  action: "insert" | "update" | "delete";
  payload: Record<string, unknown>;
  idempotencyKey: string;
  createdAt: string;
  version: number;
}

interface SyncDeltaRequest {
  deviceId: string;
  staffId?: string;
  organizationId?: string;
  lastSyncCheckpoint?: string;
  batch: SyncBatchItem[];
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  const auth = await requireAuth(
    ["ADMIN", "IMAM", "INSPECTOR", "SCHOLAR", "ACCOUNTANT"],
    req
  );
  if (!auth.ok) return auth.response;

  const { supabase } = auth.context;

  try {
    const body: SyncDeltaRequest = await req.json();
    const { deviceId, staffId, organizationId, lastSyncCheckpoint, batch } = body;

    if (!deviceId || !Array.isArray(batch)) {
      return NextResponse.json(
        { error: "Missing deviceId or batch in sync payload" },
        { status: 400 }
      );
    }

    // عزل المنظمة: الأولوية لمنظمة المستخدم الموثق
    const orgId =
      auth.context.organizationId ||
      (organizationId && UUID_REGEX.test(organizationId) ? organizationId : null) ||
      (await resolveOrganizationId(auth.context));

    if (!orgId) {
      return NextResponse.json(
        { error: "No organization configured in database" },
        { status: 400 }
      );
    }

    const validStaffId = staffId && UUID_REGEX.test(staffId) ? staffId : null;
    const processedIds: string[] = [];
    const failedIds: { id: string; error: string }[] = [];
    const conflictResolutions: { id: string; rule: string; outcome: string }[] = [];

    for (const item of batch) {
      try {
        // 1. التحقق من عدم تكرار العملية (Idempotency Check)
        const { data: existingOutbox } = await supabase
          .from("sync_outbox_queue")
          .select("id")
          .eq("idempotency_key", item.idempotencyKey)
          .maybeSingle();

        if (existingOutbox) {
          processedIds.push(item.id);
          conflictResolutions.push({
            id: item.id,
            rule: "IDEMPOTENCY_DEDUPLICATION",
            outcome: "ALREADY_PROCESSED",
          });
          continue;
        }

        let rule = "OUTBOX_ARCHIVED";
        let outcome = "PROCESSED";

        if (item.entityType === "MOSQUE") {
          const { error } = await supabase.from("mosques").insert({
            id: UUID_REGEX.test(item.entityId) ? item.entityId : undefined,
            organization_id: orgId,
            name: String(item.payload.name || "مسجد ميداني"),
            type: String(item.payload.type || "JUMA"),
            city: item.payload.city ? String(item.payload.city) : null,
            capacity: Number(item.payload.capacity) || 100,
          });
          if (error) throw new Error(error.message);
          rule = "FIELD_LEVEL_MERGE";
          outcome = "INSERTED";
        } else if (item.entityType === "QURAN_PROGRESS") {
          const { data: circle } = await supabase
            .from("quran_circles")
            .select("id")
            .limit(1)
            .single();

          if (circle?.id) {
            const rawDate = item.payload.date
              ? String(item.payload.date).split("T")[0]
              : new Date().toISOString().split("T")[0];
            const { error } = await supabase.from("quran_progress").insert({
              organization_id: orgId,
              circle_id: circle.id,
              student_full_name: String(
                item.payload.studentName || item.payload.studentFullName || "طالب"
              ),
              record_date: rawDate,
              surah_name: String(item.payload.surahName || "سورة البقرة"),
              score: String(item.payload.score || "EXCELLENT"),
              idempotency_key: item.idempotencyKey,
            });
            if (error) throw new Error(error.message);
          }
          rule = "FIELD_WINS_ATTENDANCE";
          outcome = "UPDATED_FROM_FIELD";
        } else if (
          item.entityType === "MARRIAGE" ||
          item.entityType === "MARRIAGE_CONTRACT"
        ) {
          const requestedMosqueId =
            typeof item.payload.mosqueId === "string" &&
            UUID_REGEX.test(item.payload.mosqueId)
              ? item.payload.mosqueId
              : null;
          const { data: mosque } = requestedMosqueId
            ? { data: { id: requestedMosqueId } }
            : await supabase
                .from("mosques")
                .select("id")
                .eq("organization_id", orgId)
                .limit(1)
                .single();
          const { data: staff } = await supabase
            .from("mosque_staff")
            .select("id")
            .eq("organization_id", orgId)
            .limit(1)
            .single();

          if (mosque?.id && staff?.id) {
            const token = `NIKAH-${randomBytes(6).toString("hex").toUpperCase()}`;
            const contractNumber = String(
              item.payload.contractNumber ||
                `NIKAH-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`
            );
            const { error } = await supabase.from("marriage_contracts").insert({
              organization_id: orgId,
              mosque_id: mosque.id,
              imam_id: staff.id,
              contract_number: contractNumber,
              groom_full_name: String(item.payload.groomFullName || ""),
              bride_full_name: String(item.payload.brideFullName || ""),
              guardian_name: String(item.payload.guardianName || "الولي"),
              witness1_name: String(item.payload.witness1Name || "الشاهد الأول"),
              witness2_name: String(item.payload.witness2Name || "الشاهد الثاني"),
              dowry_amount: Number(item.payload.dowryAmount) || 0,
              dowry_status: String(item.payload.dowryStatus || "PAID"),
              dowry_notes: item.payload.dowryNotes ? String(item.payload.dowryNotes) : null,
              contract_date: String(
                item.payload.contractDate || new Date().toISOString().split("T")[0]
              ),
              verification_token: token,
              idempotency_key: item.idempotencyKey,
              status: "OFFICIALLY_REGISTERED",
            });
            if (error) throw new Error(error.message);
          }
          rule = "IMMUTABLE_NIKAH_LOCK";
          outcome = "OFFICIALLY_REGISTERED";
        } else if (item.entityType === "DONATION") {
          const receiptNumber = `REC-${randomBytes(4).toString("hex").toUpperCase()}`;
          const { error } = await supabase.from("donations").insert({
            organization_id: orgId,
            donor_name: item.payload.donorName ? String(item.payload.donorName) : null,
            amount: Number(item.payload.amount) || 0,
            category: String(item.payload.category || "GENERAL"),
            receipt_number: receiptNumber,
            idempotency_key: item.idempotencyKey,
          });
          if (error) throw new Error(error.message);
          rule = "APPEND_ONLY_FINANCIAL";
          outcome = "COMMITTED";
        } else if (item.entityType === "FATWA_QUESTION") {
          const refCode = String(
            item.payload.refCode ||
              `FATWA-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`
          );
          const { error } = await supabase.from("fatwa_questions").insert({
            organization_id: orgId,
            ref_code: refCode,
            category: String(item.payload.category || "شؤون عامة"),
            asker_name: item.payload.askerName ? String(item.payload.askerName) : "مستفتٍ ميداني",
            question: String(item.payload.question || ""),
            is_public: item.payload.isPublic !== false,
            status: "PENDING",
          });
          if (error) throw new Error(error.message);
          rule = "FATWA_SUBMISSION_SYNC";
          outcome = "INSERTED";
        } else if (
          item.entityType === "SECURITY_GATE" ||
          item.entityType === "FUNERAL"
        ) {
          rule = "OUTBOX_ARCHIVED_PENDING_TABLE";
          outcome = "ARCHIVED_IN_OUTBOX";
        }

        // 2. تسجيل الحركة في طابور المراجعة المركزي (Sync Outbox Audit)
        await supabase.from("sync_outbox_queue").insert({
          organization_id: orgId,
          device_id: deviceId,
          staff_id: validStaffId,
          entity_type: item.entityType,
          entity_id: UUID_REGEX.test(item.entityId) ? item.entityId : orgId,
          action: item.action.toUpperCase(),
          payload: JSON.stringify(item.payload),
          idempotency_key: item.idempotencyKey,
          status: "PROCESSED",
        });

        conflictResolutions.push({ id: item.id, rule, outcome });
        processedIds.push(item.id);
      } catch (itemError) {
        failedIds.push({ id: item.id, error: String(itemError) });
      }
    }

    // 3. جلب التحديثات من السيرفر منذ آخر نقطة مزامنة (مع عزل المنظمة)
    let mosquesQuery = supabase
      .from("mosques")
      .select("*")
      .eq("organization_id", orgId)
      .order("updated_at", { ascending: false })
      .limit(20);
    if (lastSyncCheckpoint) {
      mosquesQuery = mosquesQuery.gt("updated_at", lastSyncCheckpoint);
    }
    const { data: updatedMosques } = await mosquesQuery;

    const serverNow = new Date().toISOString();

    return NextResponse.json({
      status: failedIds.length === 0 ? "SUCCESS" : "PARTIAL_SUCCESS",
      syncedCount: processedIds.length,
      processedIds,
      failedIds,
      conflictResolutions,
      newCheckpoint: serverNow,
      serverDelta: {
        updatedMosques: updatedMosques || [],
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process delta sync", details: String(error) },
      { status: 500 }
    );
  }
}
