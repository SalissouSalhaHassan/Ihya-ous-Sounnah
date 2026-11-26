import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
import { requireAuth } from "@/infrastructure/supabase/auth";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: fatwas, error } = await supabase
      .from("fatwa_questions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ fatwas: fatwas || [] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const body = await req.json();
    const { category, askerName, question, isPublic } = body;

    if (!question || String(question).trim().length < 5) {
      return NextResponse.json({ error: "نص الاستفتاء الشرعي مطلوب" }, { status: 400 });
    }

    const { data: org } = await supabase.from("organizations").select("id").limit(1).single();
    if (!org?.id) {
      return NextResponse.json({ error: "لا توجد منظمة مفعّلة في قاعدة البيانات" }, { status: 400 });
    }

    const refCode = `FATWA-${new Date().getFullYear()}-${randomBytes(3).toString("hex").toUpperCase()}`;

    const { data: fatwa, error } = await supabase
      .from("fatwa_questions")
      .insert({
        organization_id: org.id,
        ref_code: refCode,
        category: category || "شؤون عامة",
        asker_name: askerName || "مستفتٍ",
        question: String(question).trim(),
        is_public: isPublic !== false,
        status: "PENDING",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "SUCCESS", fatwa }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(["ADMIN", "SCHOLAR"]);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const { id, answer, evidence, scholarName } = body;

    if (!id || !answer) {
      return NextResponse.json({ error: "معرف الفتوى ونص الجواب مطلوبان" }, { status: 400 });
    }

    const { data: fatwa, error } = await auth.context.supabase
      .from("fatwa_questions")
      .update({
        answer,
        evidence: evidence || null,
        scholar_name: scholarName || auth.context.user.email || "عضو هيئة الإفتاء",
        status: "ANSWERED",
        answered_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "SUCCESS", fatwa });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
