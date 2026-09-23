import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales, type AppLocale } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://irisnatural.corpsc.com";
const SITE_NAME = "Iris Natural Cosmética";
const OG_IMAGE = `${SITE_URL}/logo.png`;
const OG_LOCALES: Record<AppLocale, string> = { es: "es_BO", en: "en_US" };

// Locale-independent site data. Localized copy (title, description, keywords)
// lives in the `seo` messages namespace.
export const siteMetadata = {
  name: SITE_NAME,
  url: SITE_URL,
  image: OG_IMAGE,
  openGraph: {
    type: "website" as const,
    siteName: SITE_NAME,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: SITE_NAME
      }
    ]
  },
  twitter: {
    card: "summary_large_image" as const,
    site: "@irisnaturalcosmetic"
  }
};

/**
 * Google Search Console verification code (meta tag).
 * Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in .env with the value Google gives you.
 */
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

/**
 * Build Next.js Metadata for the `[locale]` root layout (default for all pages).
 * Pages override title/description/alternates with their own values.
 */
export async function buildDefaultMetadata(locale: AppLocale): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "seo" });
  const home = `${SITE_URL}/${locale}`;
  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("site.title"),
      template: `%s | ${SITE_NAME}`
    },
    description: t("site.description"),
    keywords: t("site.keywords"),
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    openGraph: {
      type: siteMetadata.openGraph.type,
      locale: OG_LOCALES[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALES[l]),
      url: home,
      title: t("site.title"),
      description: t("site.ogDescription"),
      siteName: siteMetadata.openGraph.siteName,
      images: siteMetadata.openGraph.images
    },
    twitter: siteMetadata.twitter,
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png"
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true
      }
    },
    alternates: {
      canonical: home
    }
  };
  if (GOOGLE_VERIFICATION) {
    metadata.verification = { google: GOOGLE_VERIFICATION };
  }
  return metadata;
}
