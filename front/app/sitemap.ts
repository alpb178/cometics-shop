import type { MetadataRoute } from "next";
import { locales } from "@/i18n/routing";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { localizedUrl } from "@/lib/seo-pages";

const STATIC_PATHS = [
  "",
  "/contact",
  "/about",
  "/faq",
  "/how-it-works",
  "/policy-privacy"
];

/** Every locale's URL for a path, as `hreflang` alternates. */
function languagesFor(path: string): Record<string, string> {
  return Object.fromEntries(locales.map((l) => [l, localizedUrl(path, l)]));
}

/** One entry per locale; each lists all locale versions as alternates. */
function entriesFor(
  path: string,
  lastModified: Date,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  priority: number
): MetadataRoute.Sitemap {
  const languages = languagesFor(path);
  return locales.map((locale) => ({
    url: localizedUrl(path, locale),
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages }
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap((path) =>
    entriesFor(path, now, path === "" ? "weekly" : "monthly", path === "" ? 1 : 0.8)
  );

  try {
    const productsRes = await fetchContentType("products");
    const products = Array.isArray(productsRes?.data) ? productsRes.data : [];
    const slugs = products
      .map((p: { slug?: string }) => p?.slug)
      .filter(Boolean) as string[];

    for (const slug of slugs) {
      entries.push(...entriesFor(`/products/${slug}`, now, "weekly", 0.7));
    }
  } catch {
    // omit product URLs if API fails
  }

  return entries;
}
