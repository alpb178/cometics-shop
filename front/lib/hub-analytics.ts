/**
 * Group sites, by domain.
 *
 * The canonical slug registry lives in the hub (`api/prisma/seed.ts` in
 * corpsc-admin) and decides the name each click is stored under. It is
 * duplicated here instead of being read from this site's ticker because a
 * different slug ("dando-muela" instead of "dandomuela") would split the same
 * metric into two buckets that nobody would reconcile later.
 *
 * Domains are compared without "www.": it is the same site.
 */
const GROUP_SITES: Record<string, string> = {
  "corpsc.com": "corpsc",
  "take.corpsc.com": "take",
  "invoices.corpsc.com": "invoices",
  "irisnatural.corpsc.com": "iris-natural",
  "humancore.corpsc.com": "humancore",
  "histolword.corpsc.com": "histolword",
  "tu-chamba.corpsc.com": "tu-chamba",
  "dandomuela.com": "dandomuela",
  "kods.ai": "kods-ai",
  "popyplan.com": "popyplan",
  "zendinit.com": "zendinit",
  "orlegitech.com": "orlegitech",
  "tikneo.com": "tikneo",
  "calculum.ai": "calculum",
  "emasex.com": "emasex",
};

/**
 * `null` if the link does not go to a group site: an anchor, a mailto, another
 * website.
 *
 * Resolved WITHOUT a fallback base on purpose. With one, a relative link
 * (`/empleos`) would resolve against this site's own domain and be counted as
 * an outbound click to ourselves.
 */
export function resolveGroupSite(href: string, ownHost?: string): string | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const host = url.host.replace(/^www\./, "");
  // A link to this same site is navigation, not an outbound click.
  if (ownHost && host === ownHost.replace(/^www\./, "")) return null;

  return GROUP_SITES[host] ?? null;
}
