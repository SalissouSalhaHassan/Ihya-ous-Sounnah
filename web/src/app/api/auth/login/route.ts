import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email).trim(),
      password: String(password),
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json({
      status: "SUCCESS",
      accessToken: data.session?.access_token || null,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        fullName: (data.user?.user_metadata?.full_name as string) || "",
        role: (data.user?.app_metadata?.role as string) || "VIEWER",
        organizationId: (data.user?.app_metadata?.organization_id as string) || null,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: `تعذر الاتصال بخادم المصادقة: ${String(err)}` },
      { status: 500 }
    );
  }
}
