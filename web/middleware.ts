import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_LOCALE, isAppLocale, locales, routing, type AppLocale } from "./i18n/routing";
import { SESSION_COOKIE } from "./lib/auth/session";

const intlMiddleware = createIntlMiddleware(routing);

/** Same cookie next-intl uses to remember the visitor's language. */
const LOCALE_COOKIE = "NEXT_LOCALE";

/** The staff panel: unprefixed, Spanish-only, rendered from `app/[locale]/admin`. */
const ADMIN_LOCALE: AppLocale = "es";

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

/** `/es/...` → "es"; unprefixed → null. */
function localeOfPath(pathname: string): AppLocale | null {
  const first = pathname.split("/")[1];
  return isAppLocale(first) ? first : null;
}

/**
 * Visitor's locale: the NEXT_LOCALE cookie (set by next-intl when a locale is
 * visited or chosen in the switcher), then Accept-Language, then Spanish.
 */
function detectLocale(req: NextRequest): AppLocale {
  const fromCookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (isAppLocale(fromCookie)) return fromCookie;

  const header = req.headers.get("accept-language");
  if (header) {
    const ranked = header
      .split(",")
      .map((part) => {
        const [tag, ...params] = part.trim().split(";");
        const q = params.find((p) => p.trim().startsWith("q="));
        return { tag: tag.trim().toLowerCase(), q: q ? Number(q.trim().slice(2)) || 0 : 1 };
      })
      .filter((entry) => entry.tag && entry.tag !== "*" && entry.q > 0)
      .sort((a, b) => b.q - a.q);
    for (const { tag } of ranked) {
      // Region variants fall back to the language: pt-BR, pt-PT → pt.
      const primary = tag.split("-")[0];
      if ((locales as readonly string[]).includes(primary)) return primary as AppLocale;
    }
  }
  return DEFAULT_LOCALE;
}

function redirectTo(req: NextRequest, pathname: string, status: 307 | 308): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  // `url.search` is kept as-is: query strings survive every redirect.
  const res = NextResponse.redirect(url, status);
  if (status === 308) {
    // The target depends on the visitor's language: keep shared caches from
    // serving one visitor's redirect to another.
    res.headers.set("Vary", "Accept-Language, Cookie");
  }
  return res;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Staff panel. Door check only: without the session cookie nobody gets in.
  // The real staff check (valid JWT + role) is done by `requireStaff()` in the
  // panel layout; here we just avoid rendering it without a session.
  if (isAdminPath(pathname)) {
    const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);
    if (!hasSession) {
      const url = req.nextUrl.clone();
      url.pathname = `/${detectLocale(req)}/sign-in`;
      url.search = `?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
    // Served from the `[locale]` tree without exposing a prefix in the URL.
    const url = req.nextUrl.clone();
    url.pathname = `/${ADMIN_LOCALE}${pathname}`;
    const headers = new Headers(req.headers);
    headers.set("X-NEXT-INTL-LOCALE", ADMIN_LOCALE);
    return NextResponse.rewrite(url, { request: { headers } });
  }

  const locale = localeOfPath(pathname);

  if (locale) {
    // `/es/admin/...` → the panel's canonical, unprefixed URL.
    const rest = pathname.slice(locale.length + 1) || "/";
    if (isAdminPath(rest)) return redirectTo(req, rest, 308);
    return intlMiddleware(req);
  }

  // `/`: pick the visitor's language; temporary, the answer varies per visitor.
  if (pathname === "/") return intlMiddleware(req);

  // Legacy unprefixed URL (indexed before locale prefixes existed, e.g.
  // `/products/x`, `/reset-password?code=...`): permanent redirect so search
  // engines move their index to the prefixed URL. Crawlers without
  // Accept-Language land on the Spanish (default) version.
  return redirectTo(req, `/${detectLocale(req)}${pathname}`, 308);
}

export const config = {
  // Skip API routes, Next internals and static files (anything with a dot).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"]
};
