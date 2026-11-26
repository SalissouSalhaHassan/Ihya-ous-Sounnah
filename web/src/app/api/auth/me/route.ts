import { NextRequest, NextResponse } from "next/server";
import { getAuthContext } from "@/infrastructure/supabase/auth";

export async function GET(req: NextRequest) {
  const context = await getAuthContext(req);
  if (!context) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  return NextResponse.json({
    authenticated: true,
    userId: context.user.id,
    email: context.user.email || "",
    role: context.role,
    village: context.village,
    organizationId: context.organizationId,
  });
}
