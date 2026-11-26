import { NextRequest, NextResponse } from "next/server";
import { requireAuth, resolveOrganizationId } from "@/infrastructure/supabase/auth";
import { cleanString, parseJsonBody, parsePositiveNumber } from "@/lib/validation";

// جلب قائمة المساجد من Supabase مع المنظمة التابعة لها
export async function GET(req: NextRequest) {
  const auth = await requireAuth(undefined, req);
  if (!auth.ok) return auth.response;

  const { supabase, organizationId } = auth.context;

  try {
    let query = supabase
      .from("mosques")
      .select("*, organizations(name, country)")
      .order("created_at", { ascending: false });

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data: mosques, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ mosques });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// تسجيل مسجد جديد مباشرة في Supabase
export async function POST(req: NextRequest) {
  const auth = await requireAuth(["ADMIN", "INSPECTOR", "IMAM"], req);
  if (!auth.ok) return auth.response;

  const { supabase } = auth.context;

  try {
    const parsed = await parseJsonBody<Record<string, unknown>>(req);
    if (!parsed.ok) return parsed.response;

    const { name, type, city, village, capacity, hasWaterWell, hasSolarPower, imamName } =
      parsed.data;

    const cleanName = cleanString(name, 255);
    if (!cleanName) {
      return NextResponse.json({ error: "اسم المسجد مطلوب" }, { status: 400 });
    }

    const orgId = await resolveOrganizationId(auth.context);
    if (!orgId) {
      return NextResponse.json({ error: "لا توجد منظمة مفعّلة في قاعدة البيانات" }, { status: 400 });
    }

    const { data: mosque, error } = await supabase
      .from("mosques")
      .insert({
        organization_id: orgId,
        name: cleanName,
        type: cleanString(type, 50) || "JUMA",
        city: cleanString(city, 100) || "Niamey",
        village: cleanString(village, 100),
        capacity: Math.round(parsePositiveNumber(capacity) ?? 100),
        has_water_well: Boolean(hasWaterWell),
        has_solar_power: Boolean(hasSolarPower),
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const cleanImam = cleanString(imamName, 255);
    // إذا تم تزويد اسم الإمام، يتم إدراجه في mosque_staff
    if (cleanImam && mosque) {
      await supabase.from("mosque_staff").insert({
        organization_id: orgId,
        mosque_id: mosque.id,
        full_name: cleanImam,
        role: "IMAM",
      });
    }

    return NextResponse.json({ status: "SUCCESS", mosque }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
