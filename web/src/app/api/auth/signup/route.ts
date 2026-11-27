import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";
import {
  getAuthContext,
  resolveOrganizationId,
  ManaraRole,
} from "@/infrastructure/supabase/auth";

const VALID_ROLES: ManaraRole[] = [
  "ADMIN",
  "IMAM",
  "SCHOLAR",
  "ACCOUNTANT",
  "INSPECTOR",
  "VIEWER",
];

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName, role, village, adminCode } =
      await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim();
    const cleanPassword = String(password);
    const cleanName = String(fullName || "").trim() || "Ihya'ous Sounnah Member";
    const cleanVillage = String(village || "").trim();
    const requestedUpper = String(role || "VIEWER").toUpperCase() as ManaraRole;
    const requestedRole: ManaraRole = VALID_ROLES.includes(requestedUpper)
      ? requestedUpper
      : "VIEWER";

    const currentAuth = await getAuthContext(req);
    const isCurrentAdmin = currentAuth?.role === "ADMIN";
    const setupCode = process.env.ADMIN_SETUP_CODE;
    const hasValidAdminCode =
      Boolean(setupCode) && String(adminCode || "").trim() === setupCode;

    if (requestedRole === "ADMIN" && !isCurrentAdmin && !hasValidAdminCode) {
      return NextResponse.json(
        {
          error:
            "إنشاء حساب ADMIN يتطلب تسجيل الدخول بحساب مشرف حالي أو إدخال رمز التفعيل السري (ADMIN_SETUP_CODE).",
        },
        { status: 403 }
      );
    }

    // المشرف الحالي أو رمز التفعيل يمنح الدور المطلوب؛ التسجيل العام يأخذ VIEWER حتى يعتمده المشرف
    const safeRole: ManaraRole =
      isCurrentAdmin || (requestedRole === "ADMIN" && hasValidAdminCode)
        ? requestedRole
        : "VIEWER";

    const orgId = currentAuth ? await resolveOrganizationId(currentAuth) : null;

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
          requested_role: requestedRole,
          ...(cleanVillage ? { village: cleanVillage } : {}),
        },
        app_metadata: {
          role: safeRole,
          ...(cleanVillage ? { village: cleanVillage } : {}),
          ...(orgId ? { organization_id: orgId } : {}),
        },
      });

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
      }

      return NextResponse.json(
        {
          status: "SUCCESS",
          assignedRole: safeRole,
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
          requested_role: requestedRole,
          ...(cleanVillage ? { village: cleanVillage } : {}),
        },
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        status: "SUCCESS",
        assignedRole: safeRole,
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
