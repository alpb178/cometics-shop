import { siteMetadata } from "@/lib/next-metadata";
import type { Product } from "@/definitions/Product";

const SITE_URL = siteMetadata.url;

export function ProductJsonLd({
  product,
  locale,
}: {
  product: Product;
  locale: string;
}) {
  const imageUrl =
    product.images?.[0]?.url &&
    (product.images[0].url.startsWith("http")
      ? product.images[0].url
      : `${process.env.NEXT_PUBLIC_API_URL || ""}${product.images[0].url}`);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      typeof product.description === "string"
        ? product.description.replace(/<[^>]*>/g, "").slice(0, 500)
        : product.name,
    image: imageUrl ? [imageUrl] : [`${SITE_URL}/logo.png`],
    url: `${SITE_URL}/${locale}/products/${product.slug}`,
    sku: String(product.id),
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency || "BOB",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/${locale}/products/${product.slug}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
