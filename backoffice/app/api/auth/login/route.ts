import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { strapiLogin } from "@/lib/strapi";
import {
  SESSION_COOKIE,
  USER_COOKIE,
  sessionCookieOptions
} from "@/lib/session";

function staffEmails(): string[] {
  return (process.env.STAFF_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function POST(req: Request) {
  let body: { identifier?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  if (!body.identifier || !body.password) {
    return NextResponse.json(
      { error: "Email y contraseña son requeridos" },
      { status: 400 }
    );
  }

  try {
    const { jwt, user } = await strapiLogin(body.identifier, body.password);

    const allowedEmails = staffEmails();
    if (
      allowedEmails.length > 0 &&
      !allowedEmails.includes((user.email || "").toLowerCase())
    ) {
      return NextResponse.json(
        { error: "Esta cuenta no tiene acceso al panel." },
        { status: 403 }
      );
    }

    const store = await cookies();
    store.set(SESSION_COOKIE, jwt, sessionCookieOptions());
    store.set(
      USER_COOKIE,
      JSON.stringify({
        id: user.id,
        username: user.username,
        email: user.email
      }),
      { ...sessionCookieOptions(), httpOnly: false }
    );
    return NextResponse.json({ user });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "No se pudo iniciar sesión. Revisa tus datos.";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
