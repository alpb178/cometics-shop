import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  let body: {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "Email y contraseña son requeridos" },
      { status: 400 }
    );
  }

  const registerRes = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: body.email,
      email: body.email,
      password: body.password
    }),
    cache: "no-store"
  });

  const registerData = await registerRes.json();

  if (!registerRes.ok) {
    return NextResponse.json(
      {
        error:
          registerData?.error?.message ||
          "No se pudo crear la cuenta. Revisa tus datos."
      },
      { status: registerRes.status }
    );
  }

  const { jwt, user } = registerData as { jwt: string; user: any };

  let finalUser = user;
  if (body.firstName || body.lastName || body.phone) {
    const updateRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`
      },
      body: JSON.stringify({
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone
      }),
      cache: "no-store"
    });
    if (updateRes.ok) {
      finalUser = await updateRes.json();
    }
  }

  const store = await cookies();
  store.set(SESSION_COOKIE, jwt, sessionCookieOptions());

  return NextResponse.json({ user: finalUser });
}
