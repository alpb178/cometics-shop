import { headers } from "next/headers";

export async function getPathname(): Promise<string> {
  const headersList = await headers();

  const pathnameFromHeader = headersList.get("x-pathname");
  if (pathnameFromHeader) {
    return pathnameFromHeader;
  }

  const urlFromHeader = headersList.get("x-url");
  if (urlFromHeader) {
    try {
      return new URL(urlFromHeader).pathname;
    } catch {}
  }

  const referer = headersList.get("referer");
  if (referer) {
    try {
      return new URL(referer).pathname;
    } catch {}
  }

  return "";
}
