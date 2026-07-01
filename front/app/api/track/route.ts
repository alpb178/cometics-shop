import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;
const SESSION_COOKIE = "iris_sid";
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Recibe las visitas del storefront (same-origin) y las reenvía a Strapi.
 * Gestiona un identificador de sesión anónimo (cookie httpOnly) para poder
 * distinguir visitantes sin exponer datos personales. El tracking nunca debe
 * romper la navegación: los errores hacia Strapi se ignoran.
 */
export async function POST(req: Request) {
  let body: { path?: string; referrer?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const path = typeof body.path === "string" ? body.path.slice(0, 512) : "";
  if (!path) return NextResponse.json({ ok: false }, { status: 400 });

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
    await fetch(`${STRAPI_URL}/api/page-visits/track`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "user-agent": req.headers.get("user-agent") || ""
      },
      body: JSON.stringify({
        path,
        referrer:
          typeof body.referrer === "string"
            ? body.referrer.slice(0, 512)
            : undefined,
        sessionId: sid
      }),
      cache: "no-store"
    });
  } catch {
    // El tracking es best-effort: no propagar errores.
  }

  return res;
}
