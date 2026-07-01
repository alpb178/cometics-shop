import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Callback del front para el login con Google.
 *
 * Strapi redirige aquí tras el OAuth con `?access_token=<token_google>`.
 * Intercambiamos ese token por el JWT de Strapi vía
 * `/api/auth/google/callback` y guardamos la sesión en la cookie httpOnly.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const accessToken = url.searchParams.get("access_token");
  const origin = url.origin;

  if (!accessToken) {
    return NextResponse.redirect(`${origin}/sign-in?error=google`);
  }

  try {
    const res = await fetch(
      `${STRAPI_URL}/api/auth/google/callback?access_token=${encodeURIComponent(
        accessToken
      )}`,
      { cache: "no-store" }
    );
    const data = await res.json();

    if (!res.ok || !data?.jwt) {
      return NextResponse.redirect(`${origin}/sign-in?error=google`);
    }

    const response = NextResponse.redirect(`${origin}/`);
    response.cookies.set(SESSION_COOKIE, data.jwt, sessionCookieOptions());
    return response;
  } catch {
    return NextResponse.redirect(`${origin}/sign-in?error=google`);
  }
}
