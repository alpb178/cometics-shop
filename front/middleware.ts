import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE } from "./lib/auth/session";

const intlMiddleware = createIntlMiddleware({
  ...routing
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Panel gate: without a session cookie there's no entry to /admin. The real
  // staff check (valid JWT + role) is done by `requireStaff()` in the panel
  // layout; here we only avoid rendering it without a session.
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      url.search = `?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"]
};
