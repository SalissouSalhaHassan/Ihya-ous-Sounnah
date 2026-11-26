import { NextRequest, NextResponse } from "next/server";
import { createClient, type User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./server";

export type ManaraRole =
  | "ADMIN"
  | "IMAM"
  | "SCHOLAR"
  | "ACCOUNTANT"
  | "INSPECTOR"
  | "VIEWER";

export interface AuthContext {
  supabase: Awaited<ReturnType<typeof createSupabaseServerClient>>;
  user: User;
  role: ManaraRole;
  organizationId: string | null;
}

const VALID_ROLES: ManaraRole[] = [
  "ADMIN",
  "IMAM",
  "SCHOLAR",
  "ACCOUNTANT",
  "INSPECTOR",
  "VIEWER",
];

function extractRole(user: User): ManaraRole {
  // الاعتماد على app_metadata المحمي من طرف الخادم فقط، مع افتراضي VIEWER للأمان
  const raw = (user.app_metadata?.role as string | undefined) || "VIEWER";
  const upper = raw.toUpperCase() as ManaraRole;
  return VALID_ROLES.includes(upper) ? upper : "VIEWER";
}

function createBearerClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key";
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export async function getAuthContext(req?: NextRequest | Request): Promise<AuthContext | null> {
  const authHeader = req?.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : null;

  if (bearerToken) {
    const bearerClient = createBearerClient(bearerToken);
    const {
      data: { user },
      error,
    } = await bearerClient.auth.getUser(bearerToken);

    if (error || !user) {
      return null;
    }

    const organizationId =
      (user.app_metadata?.organization_id as string | undefined) || null;

    return {
      supabase: bearerClient as unknown as AuthContext["supabase"],
      user,
      role: extractRole(user),
      organizationId,
    };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const organizationId =
    (user.app_metadata?.organization_id as string | undefined) || null;

  return {
    supabase,
    user,
    role: extractRole(user),
    organizationId,
  };
}

export async function resolveOrganizationId(
  context: AuthContext
): Promise<string | null> {
  if (context.organizationId) {
    return context.organizationId;
  }
  const { data: org } = await context.supabase
    .from("organizations")
    .select("id")
    .limit(1)
    .maybeSingle();
  return org?.id ?? null;
}

export async function requireAuth(
  allowedRoles?: ManaraRole[],
  req?: NextRequest | Request
): Promise<
  | { ok: true; context: AuthContext }
  | { ok: false; response: NextResponse }
> {
  const context = await getAuthContext(req);

  if (!context) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "يجب تسجيل الدخول للقيام بهذه العملية (Unauthorized)" },
        { status: 401 }
      ),
    };
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    context.role !== "ADMIN" &&
    !allowedRoles.includes(context.role)
  ) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "ليس لديك الصلاحية الكافية لتنفيذ هذا الإجراء (Forbidden)" },
        { status: 403 }
      ),
    };
  }

  return { ok: true, context };
}
