import { defineRouting } from "next-intl/routing";

export const DEFAULT_LOCALE = "es";

export const locales = ["es", "en", "pt"] as const;

export type AppLocale = (typeof locales)[number];

/**
 * BCP 47 tag of each locale, for `<html lang>`, hreflang and date formatting.
 * The URL segment stays short (`/pt`); the content is Brazilian Portuguese.
 */
export const LOCALE_TAGS: Record<AppLocale, string> = {
  es: "es",
  en: "en",
  pt: "pt-BR"
};

/** Locale for `Intl` date/number formatting (Spanish follows Bolivia). */
export const INTL_LOCALES: Record<AppLocale, string> = {
  es: "es-BO",
  en: "en-US",
  pt: "pt-BR"
};

// Every public URL carries its locale (`/es/...`, `/en/...`, `/pt/...`).
// Unprefixed URLs are redirected by the middleware (see middleware.ts).
export const localePrefix = "always" as const;

export const routing = defineRouting({
  locales,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix,
  // hreflang alternates are emitted in the HTML (lib/seo-pages.ts) with full
  // BCP 47 tags (`pt-BR`); next-intl's `Link` header would announce bare
  // locale codes (`pt`) and contradict them.
  alternateLinks: false
});

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
