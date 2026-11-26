import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  resolveOrganizationId,
  resolveVillageMosqueIds,
} from "@/infrastructure/supabase/auth";

// جلب سجل التسميع اليومي (مع عزل القرية لغير الآدمن)
export async function GET(req: NextRequest) {
  const auth = await requireAuth(undefined, req);
  if (!auth.ok) return auth.response;

  const { supabase, organizationId } = auth.context;

  try {
    const villageMosqueIds = await resolveVillageMosqueIds(auth.context);
    let villageCircleIds: string[] | null = null;
    if (villageMosqueIds !== null) {
      if (villageMosqueIds.length === 0) {
        return NextResponse.json({ progress: [] });
      }
      const { data: circles } = await supabase
        .from("quran_circles")
        .select("id")
        .in("mosque_id", villageMosqueIds);
      villageCircleIds = (circles || []).map((c) => c.id as string);
      if (villageCircleIds.length === 0) {
        return NextResponse.json({ progress: [] });
      }
    }

    let query = supabase
      .from("quran_progress")
      .select("*, quran_circles(name)")
      .order("created_at", { ascending: false })
      .limit(20);

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }
    if (villageCircleIds !== null) {
      query = query.in("circle_id", villageCircleIds);
    }

    const { data: progress, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ progress });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// رصد وتدوين تسميع وحفظ جديد
export async function POST(req: NextRequest) {
  const auth = await requireAuth(["ADMIN", "IMAM", "SCHOLAR"], req);
  if (!auth.ok) return auth.response;

  const { supabase } = auth.context;

  try {
    const body = await req.json();
    const { studentFullName, surahName, ayahFrom, ayahTo, score, revisionNotes, circleId } = body;

    if (!studentFullName || !surahName) {
      return NextResponse.json({ error: "اسم الطالب والسورة مطلوبان" }, { status: 400 });
    }

    const orgId = await resolveOrganizationId(auth.context);
    if (!orgId) {
      return NextResponse.json({ error: "لا توجد منظمة مفعّلة في قاعدة البيانات" }, { status: 400 });
    }

    let { data: circle } = await supabase
      .from("quran_circles")
      .select("id")
      .eq("organization_id", orgId)
      .limit(1)
      .maybeSingle();

    const clId = circleId || circle?.id;

    if (!clId) {
      const { data: mosque } = await supabase
        .from("mosques")
        .select("id")
        .eq("organization_id", orgId)
        .limit(1)
        .maybeSingle();

      if (!mosque?.id) {
        return NextResponse.json({ error: "يرجى تسجيل مسجد وحلقة تحفيظ أولاً" }, { status: 400 });
      }

      const { data: newCl } = await supabase
        .from("quran_circles")
        .insert({
          organization_id: orgId,
          mosque_id: mosque.id,
          name: "حلقة الإتقان العامة",
          target_level: "حفظ ومراجعة",
        })
        .select("id")
        .single();
      circle = newCl;
    }

    const today = new Date().toISOString().split("T")[0];

    const { data: record, error } = await supabase
      .from("quran_progress")
      .insert({
        organization_id: orgId,
        circle_id: clId || circle?.id,
        student_full_name: studentFullName,
        record_date: today,
        surah_name: surahName,
        ayah_from: Number(ayahFrom) || 1,
        ayah_to: Number(ayahTo) || 10,
        score: score || "EXCELLENT",
        revision_notes: revisionNotes || null,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "SUCCESS", record }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
