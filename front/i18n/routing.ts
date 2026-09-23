import { defineRouting } from "next-intl/routing";

export const DEFAULT_LOCALE = "en";

export const locales = ["en", "es"];

// No locale segment in the URL: the locale comes from the NEXT_LOCALE cookie
// or the Accept-Language header.
export const localePrefix = "never" as const;

export const routing = defineRouting({
  locales,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix
});
