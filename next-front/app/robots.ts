import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/next-metadata";

export default function robots(): MetadataRoute.Robots {
  const base = siteMetadata.url;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
