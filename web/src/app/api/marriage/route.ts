import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, resolveOrganizationId } from "@/infrastructure/supabase/auth";

// جلب عقود الزواج المسجلة
export async function GET(req: NextRequest) {
  const auth = await requireAuth(undefined, req);
  if (!auth.ok) return auth.response;

  const { supabase, organizationId } = auth.context;

  try {
    let query = supabase
      .from("marriage_contracts")
      .select("*, mosques(name, city), mosque_staff(full_name, role)")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data: contracts, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ contracts });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// تسجيل عقد قران شرعي جديد في Supabase
export async function POST(req: NextRequest) {
  const auth = await requireAuth(["ADMIN", "IMAM"], req);
  if (!auth.ok) return auth.response;

  const { supabase } = auth.context;

  try {
    const body = await req.json();
    const {
      groomFullName,
      groomNationalId,
      groomBirthDate,
      groomPhone,
      brideFullName,
      brideNationalId,
      brideBirthDate,
      guardianName,
      guardianRelation,
      witness1Name,
      witness2Name,
      dowryAmount,
      dowryStatus,
      dowryNotes,
      contractDate,
      certificateLanguage,
      mosqueId,
      imamId,
      imamName,
    } = body;

    if (!groomFullName || !brideFullName || !guardianName) {
      return NextResponse.json(
        { error: "بيانات الزوجين والولي مطلوبة" },
        { status: 400 }
      );
    }

    // 1. ضمان وجود المنظمة
    const orgId = await resolveOrganizationId(auth.context);
    if (!orgId) {
      return NextResponse.json(
        { error: "لا توجد منظمة مفعّلة في قاعدة البيانات" },
        { status: 400 }
      );
    }

    // 2. ضمان وجود المسجد
    let msqId: string | undefined = mosqueId || undefined;
    if (msqId) {
      const { data: existingMosque } = await supabase
        .from("mosques")
        .select("id")
        .eq("id", msqId)
        .maybeSingle();
      if (!existingMosque) msqId = undefined;
    }
    if (!msqId) {
      const { data: firstMosque } = await supabase
        .from("mosques")
        .select("id")
        .limit(1)
        .maybeSingle();
      if (firstMosque) {
        msqId = firstMosque.id;
      } else {
        const { data: createdMosque, error: msqErr } = await supabase
          .from("mosques")
          .insert({
            organization_id: orgId,
            name: "جامع النور الكبير",
            city: "Maradi",
            country: "Niger",
          })
          .select("id")
          .single();
        if (msqErr || !createdMosque) {
          return NextResponse.json(
            { error: msqErr?.message || "تعذر تهيئة المسجد الافتراضي" },
            { status: 500 }
          );
        }
        msqId = createdMosque.id;
      }
    }

    // 3. ضمان وجود سجل صالح للإمام/المأذون في mosque_staff لتجنب خطأ Foreign Key
    let imId: string | undefined = imamId || undefined;
    if (imId) {
      const { data: existingStaff } = await supabase
        .from("mosque_staff")
        .select("id")
        .eq("id", imId)
        .maybeSingle();
      if (!existingStaff) imId = undefined;
    }

    const cleanImamName =
      typeof imamName === "string" && imamName.trim() ? imamName.trim() : "";

    if (!imId && cleanImamName) {
      const { data: matchedStaff } = await supabase
        .from("mosque_staff")
        .select("id")
        .eq("mosque_id", msqId)
        .eq("full_name", cleanImamName)
        .limit(1)
        .maybeSingle();

      if (matchedStaff) {
        imId = matchedStaff.id;
      } else {
        const { data: newStaff, error: staffErr } = await supabase
          .from("mosque_staff")
          .insert({
            organization_id: orgId,
            mosque_id: msqId,
            full_name: cleanImamName,
            role: "IMAM",
            status: "ACTIVE",
          })
          .select("id")
          .single();
        if (staffErr || !newStaff) {
          return NextResponse.json(
            { error: staffErr?.message || "تعذر تسجيل بيانات المأذون/الإمام" },
            { status: 500 }
          );
        }
        imId = newStaff.id;
      }
    }

    if (!imId) {
      const { data: mosqueStaffRow } = await supabase
        .from("mosque_staff")
        .select("id")
        .eq("mosque_id", msqId)
        .limit(1)
        .maybeSingle();

      if (mosqueStaffRow) {
        imId = mosqueStaffRow.id;
      } else {
        const { data: anyStaff } = await supabase
          .from("mosque_staff")
          .select("id")
          .limit(1)
          .maybeSingle();

        if (anyStaff) {
          imId = anyStaff.id;
        } else {
          const { data: fallbackStaff, error: fallbackErr } = await supabase
            .from("mosque_staff")
            .insert({
              organization_id: orgId,
              mosque_id: msqId,
              full_name: cleanImamName || "الإمام المأذون بالمسجد",
              role: "IMAM",
              status: "ACTIVE",
            })
            .select("id")
            .single();
          if (fallbackErr || !fallbackStaff) {
            return NextResponse.json(
              {
                error:
                  fallbackErr?.message || "تعذر إنشاء سجل الإمام المأذون",
              },
              { status: 500 }
            );
          }
          imId = fallbackStaff.id;
        }
      }
    }

    const year = new Date().getFullYear();
    const contractNumber = `NIKAH-${year}-MOSQ-${randomBytes(3)
      .toString("hex")
      .toUpperCase()}`;
    const verificationToken = `TOKEN-${randomBytes(6)
      .toString("hex")
      .toUpperCase()}`;

    const { data: contract, error } = await supabase
      .from("marriage_contracts")
      .insert({
        organization_id: orgId,
        mosque_id: msqId,
        imam_id: imId,
        contract_number: contractNumber,
        groom_full_name: groomFullName,
        groom_national_id: groomNationalId || null,
        groom_birth_date: groomBirthDate || null,
        groom_phone: groomPhone || null,
        bride_full_name: brideFullName,
        bride_national_id: brideNationalId || null,
        bride_birth_date: brideBirthDate || null,
        guardian_name: guardianName,
        guardian_relation: guardianRelation || "الوالد",
        witness1_name: witness1Name || "الشاهد الأول",
        witness2_name: witness2Name || "الشاهد الثاني",
        dowry_amount: Number(dowryAmount) || 150000,
        dowry_status: dowryStatus || "PAID",
        dowry_notes: dowryNotes || null,
        contract_date: contractDate || new Date().toISOString().split("T")[0],
        verification_token: verificationToken,
        certificate_language: certificateLanguage || "ar_fr",
        status: "OFFICIALLY_REGISTERED",
      })
      .select("*, mosques(name, city), mosque_staff(full_name, role)")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "SUCCESS", contract }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
