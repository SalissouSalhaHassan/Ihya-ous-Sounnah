import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  resolveOrganizationId,
  resolveVillageMosqueIds,
} from "@/infrastructure/supabase/auth";

// جلب حلقات القرآن الكريم (مع عزل القرية لغير الآدمن)
export async function GET(req: NextRequest) {
  const auth = await requireAuth(undefined, req);
  if (!auth.ok) return auth.response;

  const { supabase, organizationId } = auth.context;

  try {
    const villageMosqueIds = await resolveVillageMosqueIds(auth.context);
    if (villageMosqueIds !== null && villageMosqueIds.length === 0) {
      return NextResponse.json({ circles: [] });
    }

    let query = supabase
      .from("quran_circles")
      .select("*, mosques(name), mosque_staff(full_name)")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }
    if (villageMosqueIds !== null) {
      query = query.in("mosque_id", villageMosqueIds);
    }

    const { data: circles, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ circles });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// إنشاء حلقة تحفيظ قرآنية جديدة
export async function POST(req: NextRequest) {
  const auth = await requireAuth(["ADMIN", "IMAM", "SCHOLAR"], req);
  if (!auth.ok) return auth.response;

  const { supabase } = auth.context;

  try {
    const body = await req.json();
    const { name, targetLevel, gender, mosqueId, teacherName } = body;

    if (!name) {
      return NextResponse.json({ error: "اسم الحلقة مطلوب" }, { status: 400 });
    }

    const orgId = await resolveOrganizationId(auth.context);
    if (!orgId) {
      return NextResponse.json({ error: "لا توجد منظمة مفعّلة في قاعدة البيانات" }, { status: 400 });
    }

    const { data: mosque } = await supabase
      .from("mosques")
      .select("id")
      .eq("organization_id", orgId)
      .limit(1)
      .maybeSingle();

    const msqId = mosqueId || mosque?.id;
    if (!msqId) {
      return NextResponse.json({ error: "يرجى تسجيل مسجد أولاً قبل إنشاء الحلقة" }, { status: 400 });
    }

    // إضافة الشيخ/المحفظ إذا وجد
    let teacherId = null;
    if (teacherName) {
      const { data: staff } = await supabase
        .from("mosque_staff")
        .insert({
          organization_id: orgId,
          mosque_id: msqId,
          full_name: teacherName,
          role: "TEACHER",
        })
        .select("id")
        .single();
      teacherId = staff?.id || null;
    }

    const { data: circle, error } = await supabase
      .from("quran_circles")
      .insert({
        organization_id: orgId,
        mosque_id: msqId,
        teacher_id: teacherId,
        name,
        target_level: targetLevel || "حفظ وتجويد عام",
        gender: gender || "MALE",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "SUCCESS", circle }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
