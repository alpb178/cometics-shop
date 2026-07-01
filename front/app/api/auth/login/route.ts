import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  let body: { identifier?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.identifier || !body.password) {
    return NextResponse.json(
      { error: "Email y contraseña son requeridos" },
      { status: 400 }
    );
  }

  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: body.identifier,
      password: body.password
    }),
    cache: "no-store"
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      {
        error:
          data?.error?.message ||
          "No se pudo iniciar sesión. Revisa tus datos."
      },
      { status: res.status }
    );
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, data.jwt, sessionCookieOptions());

  return NextResponse.json({ user: data.user });
}
