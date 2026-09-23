import type { MetadataRoute } from "next";
import { siteMetadata } from "@/lib/next-metadata";

export default function robots(): MetadataRoute.Robots {
  const base = siteMetadata.url;
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Both locale trees (/es, /en) are crawlable; the staff panel is not.
      disallow: ["/api/", "/admin"]
    },
    sitemap: `${base}/sitemap.xml`
  };
}
