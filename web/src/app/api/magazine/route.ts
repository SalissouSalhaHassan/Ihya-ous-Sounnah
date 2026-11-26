import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
import { requireAuth } from "@/infrastructure/supabase/auth";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: articles, error } = await supabase
      .from("magazine_articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ articles: articles || [] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(["ADMIN", "SCHOLAR", "IMAM"]);
  if (!auth.ok) return auth.response;

  try {
    const body = await req.json();
    const {
      title,
      category,
      categoryLabel,
      author,
      summary,
      arabicText,
      frenchText,
      hausaText,
      clauses,
      images,
      publishedDate,
    } = body;

    if (!title || !summary) {
      return NextResponse.json({ error: "عنوان المقال والملخص مطلوبان" }, { status: 400 });
    }

    const { supabase, organizationId } = auth.context;
    let orgId = organizationId;
    if (!orgId) {
      const { data: org } = await supabase.from("organizations").select("id").limit(1).single();
      orgId = org?.id ?? null;
    }

    if (!orgId) {
      return NextResponse.json({ error: "لا توجد منظمة مفعّلة في قاعدة البيانات" }, { status: 400 });
    }

    const { data: article, error } = await supabase
      .from("magazine_articles")
      .insert({
        organization_id: orgId,
        title,
        category: category || "AWQAF",
        category_label: categoryLabel || "تقارير منارة",
        author: author || "هيئة التحرير - منارة",
        summary,
        arabic_text: arabicText || null,
        french_text: frenchText || null,
        hausa_text: hausaText || null,
        clauses_json: clauses ? JSON.stringify(clauses) : null,
        images_json: images ? JSON.stringify(images) : null,
        published_date: publishedDate || new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "SUCCESS", article }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(["ADMIN", "SCHOLAR"]);
  if (!auth.ok) return auth.response;

  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "معرف المقال مطلوب" }, { status: 400 });
    }

    const { error } = await auth.context.supabase
      .from("magazine_articles")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "DELETED" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
