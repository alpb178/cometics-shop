// Source of the traffic leaving this site towards its sibling group sites.
const SOURCE = "iris-natural";

// Tags the ticker links with UTM params so the destination site can measure how
// much attention the group strip brings. Existing URL params are kept; calling
// it twice gives the same result.
export function groupSiteUrl(url: string): string {
  const target = new URL(url);
  target.searchParams.set("utm_source", SOURCE);
  target.searchParams.set("utm_medium", "cintillo");
  target.searchParams.set("utm_campaign", "grupo-corpsc");
  return target.toString();
}

// Domain shown next to the name in the ticker: the visible link, without the
// protocol, without "www." and without the trailing slash.
export function siteDomain(url: string): string {
  return new URL(url).host.replace(/^www\./, "");
}
