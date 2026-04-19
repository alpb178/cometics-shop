import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://irisnatural.corpsc.com";
const DEFAULT_TITLE = "Iris Natural Cosmética | Productos naturales en Santa Cruz, Bolivia";
const DEFAULT_DESCRIPTION =
  "Tienda de productos naturales para el cuidado personal y la belleza. Cosmética natural en Santa Cruz de la Sierra, Bolivia.";
const OG_IMAGE = `${SITE_URL}/logo.png`;
const KEYWORDS =
  "Cosmética natural, Belleza natural, Cuidado personal, Productos naturales, Santa Cruz Bolivia, Aceites naturales, Cuidado de la piel, Cuidado del cabello";

export const siteMetadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  url: SITE_URL,
  image: OG_IMAGE,
  keywords: KEYWORDS,
  openGraph: {
    type: "website" as const,
    siteName: "Iris Natural Cosmética",
    locale: "es_BO",
    alternateLocale: ["en_US"],
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Iris Natural Cosmética",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    site: "@irisnaturalcosmetic",
  },
};

/**
 * Google Search Console verification code (meta tag).
 * Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in .env with the value Google gives you.
 */
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

/**
 * Build Next.js Metadata for the root layout (default for all pages).
 */
export function buildDefaultMetadata(): Metadata {
  const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
      default: siteMetadata.title,
      template: `%s | Iris Natural Cosmética`,
    },
    description: siteMetadata.description,
    keywords: siteMetadata.keywords,
    authors: [{ name: "Iris Natural Cosmética", url: SITE_URL }],
    creator: "Iris Natural Cosmética",
    openGraph: {
      type: siteMetadata.openGraph.type,
      locale: siteMetadata.openGraph.locale,
      alternateLocale: siteMetadata.openGraph.alternateLocale,
      url: SITE_URL,
      title: siteMetadata.title,
      description:
        "En Iris Natural Cosmética creemos en el poder de la naturaleza para cuidar y realzar la belleza. Santa Cruz de la Sierra, Bolivia.",
      siteName: siteMetadata.openGraph.siteName,
      images: siteMetadata.openGraph.images,
    },
    twitter: siteMetadata.twitter,
    icons: {
      icon: "/logo.png",
      shortcut: "/logo.png",
      apple: "/logo.png",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: SITE_URL,
    },
  };
  if (GOOGLE_VERIFICATION) {
    metadata.verification = { google: GOOGLE_VERIFICATION };
  }
  return metadata;
}

/** Default export for backward compatibility (e.g. footer title). */
const seoData = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  image: OG_IMAGE,
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    ...siteMetadata.openGraph,
    title: siteMetadata.title,
    url: SITE_URL,
    description: siteMetadata.description,
  },
  twitter: siteMetadata.twitter,
};

export default seoData;
