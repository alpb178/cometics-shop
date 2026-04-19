import { defineRouting, Pathnames } from "next-intl/routing";

export const DEFAULT_LOCALE = "en";

export const locales = ["en", "es"];

export const pathnames = {
  "/": "/",
  "/pathnames": {
    en: "/pathnames",
    es: "/pathnames"
  }
} satisfies Pathnames<typeof locales>;

// Use the default: `always`
export const localePrefix = "never" as const;

export const routing = defineRouting({
  locales,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix
});
