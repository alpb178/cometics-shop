import { getRequestConfig } from "next-intl/server";
import { isAppLocale, routing } from "./routing";

// One JSON file per namespace under locales/<locale>/. Add the file for both
// locales and list its name here.
export const NAMESPACES = [
  "common",
  "nav",
  "footer",
  "home",
  "pages",
  "errors",
  "products",
  "cart",
  "checkout",
  "account",
  "auth",
  "seo"
] as const;

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  const requested = await requestLocale;
  const locale = isAppLocale(requested) ? requested : routing.defaultLocale;

  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => {
      const mod = await import(`../locales/${locale}/${ns}.json`);
      return [ns, mod.default] as const;
    })
  );

  return { locale, messages: Object.fromEntries(entries) };
});
