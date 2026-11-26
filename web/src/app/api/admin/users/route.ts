import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  requireAuth,
  resolveOrganizationId,
  ManaraRole,
} from "@/infrastructure/supabase/auth";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || key.includes("your-")) {
    return null;
  }
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

const VALID_ROLES: ManaraRole[] = [
  "ADMIN",
  "IMAM",
  "SCHOLAR",
  "ACCOUNTANT",
  "INSPECTOR",
  "VIEWER",
];

export async function GET() {
  const auth = await requireAuth(["ADMIN"]);
  if (!auth.ok) return auth.response;

  const adminClient = getAdminClient();
  if (!adminClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY غير مضبوط في الخادم" },
      { status: 500 }
    );
  }

  try {
    const { data, error } = await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const users = (data?.users || []).map((u) => ({
      id: u.id,
      email: u.email || "",
      fullName: (u.user_metadata?.full_name as string) || "",
      role:
        (u.app_metadata?.role as string) ||
        (u.user_metadata?.role as string) ||
        "VIEWER",
      village:
        (u.app_metadata?.village as string) ||
        (u.user_metadata?.village as string) ||
        "",
      createdAt: u.created_at,
      lastSignInAt: u.last_sign_in_at || null,
    }));

    return NextResponse.json({ users });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(["ADMIN"]);
  if (!auth.ok) return auth.response;

  const adminClient = getAdminClient();
  if (!adminClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY غير مضبوط في الخادم" },
      { status: 500 }
    );
  }

  try {
    const { email, password, fullName, role, village } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    const safeRole: ManaraRole = VALID_ROLES.includes(role) ? role : "VIEWER";
    const orgId = await resolveOrganizationId(auth.context);

    const { data, error } = await adminClient.auth.admin.createUser({
      email: String(email).trim(),
      password: String(password),
      email_confirm: true,
      user_metadata: {
        full_name: String(fullName || "").trim() || "Ihya'ous Sounnah Staff",
        role: safeRole,
        village: String(village || "").trim(),
      },
      app_metadata: {
        role: safeRole,
        village: String(village || "").trim(),
        ...(orgId ? { organization_id: orgId } : {}),
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ status: "CREATED", id: data.user?.id }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAuth(["ADMIN"]);
  if (!auth.ok) return auth.response;

  const adminClient = getAdminClient();
  if (!adminClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY غير مضبوط في الخادم" },
      { status: 500 }
    );
  }

  try {
    const { userId, role, village, fullName } = await req.json();

    if (!userId || !role) {
      return NextResponse.json(
        { error: "معرف المستخدم والدور مطلوبان" },
        { status: 400 }
      );
    }

    const safeRole: ManaraRole = VALID_ROLES.includes(role) ? role : "VIEWER";
    const orgId = await resolveOrganizationId(auth.context);

    const { data, error } = await adminClient.auth.admin.updateUserById(userId, {
      app_metadata: {
        role: safeRole,
        village: String(village || "").trim(),
        ...(orgId ? { organization_id: orgId } : {}),
      },
      user_metadata: {
        ...(fullName ? { full_name: String(fullName).trim() } : {}),
        role: safeRole,
        village: String(village || "").trim(),
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ status: "UPDATED", id: data.user?.id });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAuth(["ADMIN"]);
  if (!auth.ok) return auth.response;

  const adminClient = getAdminClient();
  if (!adminClient) {
    return NextResponse.json(
      { error: "SUPABASE_SERVICE_ROLE_KEY غير مضبوط في الخادم" },
      { status: 500 }
    );
  }

  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "معرف المستخدم مطلوب" }, { status: 400 });
    }

    if (id === auth.context.user.id) {
      return NextResponse.json(
        { error: "لا يمكنك حذف حسابك الحالي" },
        { status: 400 }
      );
    }

    const { error } = await adminClient.auth.admin.deleteUser(id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ status: "DELETED" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
