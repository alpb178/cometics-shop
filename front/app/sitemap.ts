import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/next-metadata";
import fetchContentType from "@/lib/strapi/fetchContentType";

const BASE = siteMetadata.url;

const STATIC_PATHS = [
  "",
  "contact",
  "about",
  "faq",
  "how-it-works",
  "policy-privacy",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path ? `${BASE}/${path}` : BASE,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  try {
    const productsRes = await fetchContentType("products");
    const products = Array.isArray(productsRes?.data) ? productsRes.data : [];
    const slugs = products
      .map((p: { slug?: string }) => p?.slug)
      .filter(Boolean) as string[];

    for (const slug of slugs) {
      entries.push({
        url: `${BASE}/products/${slug}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch {
    // omit product URLs if API fails
  }

  return entries;
}
