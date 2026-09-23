import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  DEFAULT_LOCALE,
  LOCALE_TAGS,
  isAppLocale,
  locales,
  type AppLocale
} from "@/i18n/routing";
import { OG_LOCALES, siteMetadata } from "./next-metadata";

const BASE = siteMetadata.url;

/** Open Graph locale per app locale. */
export const OG_LOCALE = OG_LOCALES;

export function toAppLocale(value: string | undefined): AppLocale {
  return isAppLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Absolute URL of an unprefixed internal path (`""`, `/faq`, `/products/x`)
 * under the given locale.
 */
export function localizedUrl(path: string, locale: AppLocale): string {
  const clean = path === "/" ? "" : path;
  return `${BASE}/${locale}${clean}`;
}

/**
 * `alternates` for a page: canonical in its own locale plus hreflang links for
 * every locale. `x-default` points to the default (Spanish) version, which is
 * also where unprefixed legacy URLs are sent for crawlers.
 */
export function localizedAlternates(
  path: string,
  locale: AppLocale
): NonNullable<Metadata["alternates"]> {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[LOCALE_TAGS[l]] = localizedUrl(path, l);
  languages["x-default"] = localizedUrl(path, DEFAULT_LOCALE);
  return { canonical: localizedUrl(path, locale), languages };
}

/** Static pages with their own SEO entry in the `seo.pages` messages. */
export type SeoPageKey =
  | "home"
  | "contact"
  | "about"
  | "faq"
  | "how-it-works"
  | "cart"
  | "policy-privacy";

const PAGE_PATHS: Record<SeoPageKey, string> = {
  home: "",
  contact: "/contact",
  about: "/about",
  faq: "/faq",
  "how-it-works": "/how-it-works",
  cart: "/cart",
  "policy-privacy": "/policy-privacy"
};

const NO_INDEX: ReadonlySet<SeoPageKey> = new Set(["cart"]);

type LocaleParams = { params: Promise<{ locale: string }> };

/**
 * `generateMetadata` for a static page: localized title/description, canonical
 * and hreflang alternates. Usage: `export const generateMetadata = pageMetadataFor("faq");`
 */
export function pageMetadataFor(key: SeoPageKey) {
  return async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
    const locale = toAppLocale((await params).locale);
    const t = await getTranslations({ locale, namespace: "seo" });
    const title = t(`pages.${key}.title`);
    const description = t(`pages.${key}.description`);
    const alternates = localizedAlternates(PAGE_PATHS[key], locale);
    const url = alternates.canonical as string;

    return {
      title,
      description,
      alternates,
      openGraph: {
        title: key === "home" ? t("site.title") : title,
        description,
        url,
        type: "website",
        locale: OG_LOCALE[locale]
      },
      twitter: { card: "summary_large_image", title, description },
      ...(NO_INDEX.has(key) ? { robots: { index: false, follow: true } } : {})
    };
  };
}
