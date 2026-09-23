import { defineRouting } from "next-intl/routing";

export const DEFAULT_LOCALE = "es";

export const locales = ["es", "en"] as const;

export type AppLocale = (typeof locales)[number];

// Every public URL carries its locale (`/es/...`, `/en/...`). Unprefixed URLs
// are redirected by the middleware (see middleware.ts).
export const localePrefix = "always" as const;

export const routing = defineRouting({
  locales,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix
});

export function isAppLocale(value: unknown): value is AppLocale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}
