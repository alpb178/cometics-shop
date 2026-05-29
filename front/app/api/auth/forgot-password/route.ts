import { NextResponse } from "next/server";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!body.email) {
    return NextResponse.json(
      { error: "El email es requerido" },
      { status: 400 }
    );
  }

  const res = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: body.email }),
    cache: "no-store"
  });

  // Strapi devuelve 200 incluso si el email no existe (para no filtrar).
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(
      {
        error:
          data?.error?.message ||
          "No se pudo enviar el email de recuperación."
      },
      { status: res.status }
    );
  }

  return NextResponse.json({ ok: true });
}
