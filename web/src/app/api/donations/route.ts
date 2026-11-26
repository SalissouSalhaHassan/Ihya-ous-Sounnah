import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth, resolveOrganizationId } from "@/infrastructure/supabase/auth";
import {
  cleanString,
  isValidUuid,
  parseJsonBody,
  parsePositiveNumber,
} from "@/lib/validation";

export async function GET(req: NextRequest) {
  const auth = await requireAuth(["ADMIN", "ACCOUNTANT", "IMAM"], req);
  if (!auth.ok) return auth.response;

  const { supabase, organizationId } = auth.context;

  try {
    let query = supabase
      .from("donations")
      .select("*")
      .order("date_paid", { ascending: false })
      .limit(50);

    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    const { data: donations, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ donations: donations || [] });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAuth(["ADMIN", "ACCOUNTANT", "IMAM"], req);
  if (!auth.ok) return auth.response;

  try {
    const parsed = await parseJsonBody<Record<string, unknown>>(req);
    if (!parsed.ok) return parsed.response;

    const { donorName, donorPhone, amount, currency, category, projectId, mosqueId } =
      parsed.data;

    const validAmount = parsePositiveNumber(amount);
    if (!validAmount) {
      return NextResponse.json({ error: "مبلغ التبرع أو الزكاة مطلوب" }, { status: 400 });
    }

    const { supabase } = auth.context;
    const orgId = await resolveOrganizationId(auth.context);

    if (!orgId) {
      return NextResponse.json({ error: "لا توجد منظمة مفعّلة في قاعدة البيانات" }, { status: 400 });
    }

    const receiptNumber = `ZAKAT-${new Date().getFullYear()}-${randomBytes(4).toString("hex").toUpperCase()}`;

    const { data: donation, error } = await supabase
      .from("donations")
      .insert({
        organization_id: orgId,
        project_id: isValidUuid(projectId) ? projectId : null,
        mosque_id: isValidUuid(mosqueId) ? mosqueId : null,
        donor_name: cleanString(donorName, 255) || "فاعل خير",
        donor_phone: cleanString(donorPhone, 50),
        amount: validAmount,
        currency: cleanString(currency, 10) || "XOF",
        category: cleanString(category, 50) || "ZAKAT",
        receipt_number: receiptNumber,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ status: "SUCCESS", donation }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
