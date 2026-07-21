import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;
const SESSION_COOKIE = "iris_sid";
const ONE_YEAR = 60 * 60 * 24 * 365;

const ALLOWED_TYPES = [
  "product_view",
  "add_to_cart",
  "cart_view",
  "group_click"
] as const;
type EventType = (typeof ALLOWED_TYPES)[number];

/**
 * Recibe interacciones del storefront (same-origin) y las reenvía a Strapi.
 * Comparte la cookie de sesión anónima `iris_sid` con `/api/track` para poder
 * correlacionar eventos y visitas sin datos personales. Best-effort: nunca
 * rompe la navegación.
 */
export async function POST(req: Request) {
  let body: {
    type?: string;
    label?: string;
    productSlug?: string;
    quantity?: number;
    path?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const type = body.type;
  if (!type || !ALLOWED_TYPES.includes(type as EventType)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const store = await cookies();
  let sid = store.get(SESSION_COOKIE)?.value;
  const res = NextResponse.json({ ok: true });
  if (!sid) {
    sid = crypto.randomUUID();
    res.cookies.set(SESSION_COOKIE, sid, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR,
      path: "/"
    });
  }

  try {
    await fetch(`${STRAPI_URL}/api/store-events/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        label:
          typeof body.label === "string" ? body.label.slice(0, 255) : undefined,
        productSlug:
          typeof body.productSlug === "string"
            ? body.productSlug.slice(0, 255)
            : undefined,
        quantity:
          typeof body.quantity === "number" ? body.quantity : undefined,
        path: typeof body.path === "string" ? body.path.slice(0, 512) : undefined,
        sessionId: sid
      }),
      cache: "no-store"
    });
  } catch {
    // Best-effort: no propagar errores de tracking.
  }

  return res;
}
