import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  let body: {
    code?: string;
    password?: string;
    passwordConfirmation?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.code || !body.password || !body.passwordConfirmation) {
    return NextResponse.json(
      { error: "Faltan datos requeridos" },
      { status: 400 }
    );
  }

  const res = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: body.code,
      password: body.password,
      passwordConfirmation: body.passwordConfirmation
    }),
    cache: "no-store"
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json(
      {
        error:
          data?.error?.message ||
          "No se pudo restablecer la contraseña. El enlace puede haber expirado."
      },
      { status: res.status }
    );
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, data.jwt, sessionCookieOptions());

  return NextResponse.json({ user: data.user });
}
