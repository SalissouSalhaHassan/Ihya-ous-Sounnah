import { NextResponse } from "next/server";
import { supabase } from "@/infrastructure/supabase/client";

export async function GET() {
  try {
    // اختبار الاتصال الحي مع سحابة Supabase دون كشف بيانات المنظمات
    const { count, error } = await supabase
      .from("organizations")
      .select("id", { count: "exact", head: true });

    return NextResponse.json({
      status: "CONNECTED",
      tableCheck: error ? error.message : "TABLE_READY",
      organizationsCount: count ?? 0,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json({
      status: "ERROR",
      error: String(err),
    }, { status: 500 });
  }
}
