import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE } from "./lib/auth/session";

const intlMiddleware = createIntlMiddleware({
  ...routing
});

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Puerta del panel: sin cookie de sesión no se entra a /admin. La
  // verificación real de staff (JWT válido + rol) la hace `requireStaff()` en
  // el layout del panel; aquí solo evitamos renderizarlo sin sesión.
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
