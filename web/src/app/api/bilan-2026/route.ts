import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/infrastructure/supabase/auth";

export async function GET() {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const { supabase, user, role } = auth.context;
  const isAdmin = role === "ADMIN";

  try {
    let query = supabase
      .from("bilan_fiches_2026")
      .select("id, owner_user_id, owner_email, section_name, fait_a, payload_json, updated_at")
      .order("updated_at", { ascending: false });

    // عزل صارم للبيانات: القرية ترى بياناتها فقط، والآدمن يرى جميع القرى
    if (!isAdmin) {
      query = query.eq("owner_user_id", user.id);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const fiches = (data || []).map((row) => {
      let parsedPayload: Record<string, unknown> = {};
      try {
        parsedPayload = JSON.parse(row.payload_json);
      } catch {
        parsedPayload = {};
      }
      return {
        ...parsedPayload,
        id: row.id,
        ownerUserId: row.owner_user_id,
        ownerEmail: row.owner_email,
        sectionName: row.section_name,
        faitA: row.fait_a || "Maradi",
        updatedAt: row.updated_at,
      };
    });

    return NextResponse.json({
      isAdmin,
      role,
      userEmail: user.email,
      fiches,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const { supabase, user, role, organizationId } = auth.context;
  const isAdmin = role === "ADMIN";

  try {
    const body = await req.json();
    const { id, sectionName, faitA, ...restPayload } = body;

    if (!sectionName || String(sectionName).trim().length === 0) {
      return NextResponse.json(
        { error: "اسم القرية أو الشعبة مطلوب" },
        { status: 400 }
      );
    }

    let orgId = organizationId;
    if (!orgId) {
      const { data: org } = await supabase.from("organizations").select("id").limit(1).single();
      orgId = org?.id ?? null;
    }

    if (!orgId) {
      return NextResponse.json(
        { error: "لا توجد منظمة مفعّلة في قاعدة البيانات" },
        { status: 400 }
      );
    }

    const payloadJson = JSON.stringify({
      sectionName: String(sectionName).trim(),
      faitA: faitA || "Maradi",
      ...restPayload,
    });

    const isUuid =
      typeof id === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

    if (isUuid) {
      const { data: existing } = await supabase
        .from("bilan_fiches_2026")
        .select("id, owner_user_id")
        .eq("id", id)
        .maybeSingle();

      if (existing) {
        if (!isAdmin && existing.owner_user_id !== user.id) {
          return NextResponse.json(
            { error: "غير مسموح بتعديل بيانات قرية أخرى (Forbidden)" },
            { status: 403 }
          );
        }

        const { data: updated, error } = await supabase
          .from("bilan_fiches_2026")
          .update({
            section_name: String(sectionName).trim(),
            fait_a: faitA || "Maradi",
            payload_json: payloadJson,
            updated_at: new Date().toISOString(),
          })
          .eq("id", id)
          .select()
          .single();

        if (error) {
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ status: "UPDATED", id: updated.id });
      }
    }

    const { data: inserted, error } = await supabase
      .from("bilan_fiches_2026")
      .insert({
        organization_id: orgId,
        owner_user_id: user.id,
        owner_email: user.email || null,
        section_name: String(sectionName).trim(),
        fait_a: faitA || "Maradi",
        payload_json: payloadJson,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "CREATED", id: inserted.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth();
  if (!auth.ok) return auth.response;

  const { supabase, user, role } = auth.context;
  const isAdmin = role === "ADMIN";

  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "معرف الاستمارة مطلوب" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("bilan_fiches_2026")
      .select("id, owner_user_id")
      .eq("id", id)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ error: "الاستمارة غير موجودة" }, { status: 404 });
    }

    if (!isAdmin && existing.owner_user_id !== user.id) {
      return NextResponse.json(
        { error: "غير مسموح بحذف بيانات قرية أخرى (Forbidden)" },
        { status: 403 }
      );
    }

    const { error } = await supabase.from("bilan_fiches_2026").delete().eq("id", id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "DELETED" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
