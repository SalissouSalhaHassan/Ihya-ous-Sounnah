import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/infrastructure/supabase/server";

export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
    return NextResponse.json({ status: "SIGNED_OUT" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
