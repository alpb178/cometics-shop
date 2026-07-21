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

/**
 * Inserta una transformación de tamaño en una URL de Cloudinary.
 * Si la URL no es de Cloudinary (p. ej. Strapi/local), la devuelve sin tocar.
 *
 * @example
 * cloudinaryResize(url, 1088, 976)
 * // .../upload/w_1088,h_976,c_fill,g_auto,q_auto,f_auto/v.../file.jpg
 */
export function cloudinaryResize(
  url: string | undefined,
  width: number,
  height: number,
  crop: "fill" | "fit" | "pad" = "fill"
): string {
  if (!url) return "";
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return url;
  }
  const transform = `w_${width},h_${height},c_${crop},g_auto,q_auto,f_auto`;
  return url.replace("/upload/", `/upload/${transform}/`);
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
