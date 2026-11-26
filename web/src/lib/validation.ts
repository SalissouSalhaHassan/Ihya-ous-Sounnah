import { NextResponse } from "next/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_REGEX.test(value);
}

/**
 * قراءة جسم الطلب JSON بأمان وإرجاع 400 عند وجود صيغة غير صالحة
 */
export async function parseJsonBody<T = Record<string, unknown>>(
  req: Request
): Promise<{ ok: true; data: T } | { ok: false; response: NextResponse }> {
  try {
    const data = (await req.json()) as T;
    if (!data || typeof data !== "object") {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "صيغة البيانات المرسلة غير صالحة" },
          { status: 400 }
        ),
      };
    }
    return { ok: true, data };
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "تعذر قراءة بيانات JSON في الطلب" },
        { status: 400 }
      ),
    };
  }
}

export function cleanString(value: unknown, maxLength = 500): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}

export function parsePositiveNumber(value: unknown): number | null {
  const num = Number(value);
  if (!Number.isFinite(num) || num <= 0) return null;
  return num;
}
