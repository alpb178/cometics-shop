import { unstable_noStore as noStore } from "next/cache";

/**
 * Resolves image src: public paths (e.g. /logo.png) are returned as-is;
 * Strapi paths get the API URL prefix.
 */
export function getImageSrc(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/") && !url.startsWith("/uploads")) return url;
  return strapiImage(url);
}

export function strapiImage(url: string): string {
  noStore();
  if (url?.startsWith("/")) {
    if (
      !process.env.NEXT_PUBLIC_API_URL &&
      document?.location.host.endsWith(".strapidemo.com")
    ) {
      return `https://${document.location.host.replace(
        "client-",
        "api-"
      )}${url}`;
    }

    return process.env.NEXT_PUBLIC_API_URL + url;
  }
  return url;
}
