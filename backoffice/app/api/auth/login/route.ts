import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { strapiLogin, STRAPI_URL } from "@/lib/strapi";
import { isStaffUser, type StaffCheckUser } from "@/lib/staff";
import {
  SESSION_COOKIE,
  USER_COOKIE,
  sessionCookieOptions
} from "@/lib/session";

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

    // Verificación de staff OBLIGATORIA (fail-closed). Se trae el rol para
    // soportar tanto STAFF_EMAILS como un rol de Strapi con type "staff".
    let staffUser: StaffCheckUser = { email: user.email };
    try {
      const meRes = await fetch(`${STRAPI_URL}/api/users/me?populate=role`, {
        headers: { Authorization: `Bearer ${jwt}` },
        cache: "no-store"
      });
      if (meRes.ok) staffUser = (await meRes.json()) as StaffCheckUser;
    } catch {
      // Si /users/me falla, se evalúa solo contra STAFF_EMAILS con el email del login.
    }

    if (!isStaffUser(staffUser)) {
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
