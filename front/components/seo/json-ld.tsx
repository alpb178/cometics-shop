import { siteMetadata } from "@/lib/next-metadata";

const SITE_URL = siteMetadata.url;

export function OrganizationWebSiteJsonLd({
  locale,
  description
}: {
  locale: string;
  description: string;
}) {
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
        description,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Santa Cruz de la Sierra",
          addressCountry: "BO",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: `${SITE_URL}/${locale}`,
        name: "Iris Natural Cosmética",
        description,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: locale,
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${SITE_URL}/${locale}?q={search_term_string}`,
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
