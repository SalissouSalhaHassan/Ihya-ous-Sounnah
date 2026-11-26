import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim();
    const cleanPassword = String(password);
    const cleanName = String(fullName || "").trim() || "Ihya'ous Sounnah Member";
    // التسجيل العام يُنشئ دائماً بحساب VIEWER؛ ترقية الصلاحيات تتم حصراً عبر الإدارة (/api/admin/users)
    const safeRole = "VIEWER";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // استخدام Admin API عند توفر Service Role Key لتفادي حد رسائل البريد (email rate limit) وتفعيل الحساب مباشرة
    if (supabaseUrl && serviceRoleKey && !serviceRoleKey.includes("your-")) {
      const adminClient = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

      const { data, error } = await adminClient.auth.admin.createUser({
        email: cleanEmail,
        password: cleanPassword,
        email_confirm: true,
        user_metadata: {
          full_name: cleanName,
          role: safeRole,
        },
        app_metadata: {
          role: safeRole,
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(
        {
          status: "SUCCESS",
          user: {
            id: data.user?.id,
            email: data.user?.email,
          },
        },
        { status: 201 }
      );
    }

    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: {
        data: {
          full_name: cleanName,
          role: safeRole,
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        status: "SUCCESS",
        user: {
          id: data.user?.id,
          email: data.user?.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: `تعذر إنشاء الحساب: ${String(err)}` },
      { status: 500 }
    );
  }
}
