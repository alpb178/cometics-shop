import { siteMetadata } from "@/lib/next-metadata";

const SITE_URL = siteMetadata.url;

export function OrganizationWebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Iris Natural Cosmética",
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/logo.png`,
        },
        description: siteMetadata.description,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Santa Cruz de la Sierra",
          addressCountry: "BO",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Iris Natural Cosmética",
        description: siteMetadata.description,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: ["es", "en"],
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
