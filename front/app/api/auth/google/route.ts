import { NextResponse } from "next/server";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Front-end callback for Google sign-in.
 *
 * Strapi redirects here after OAuth with `?access_token=<google_token>`.
 * We exchange that token for the Strapi JWT via
 * `/api/auth/google/callback` and store the session in the httpOnly cookie.
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
