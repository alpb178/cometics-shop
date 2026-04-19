import { Container } from "@/components/container/container-page";
import { ProductList } from "@/container/products/list";
import { BrandHero } from "@/components/hero/brand-hero";
import fetchContentType from "@/lib/strapi/fetchContentType";
import type { Metadata } from "next";
import { siteMetadata } from "@/lib/next-metadata";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Descubre productos naturales de calidad para tu cuidado personal. Iris Natural Cosmética, Santa Cruz de la Sierra, Bolivia.",
  alternates: { canonical: siteMetadata.url },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.url,
    type: "website",
  },
};

export default async function HomePage() {
  const products = await fetchContentType("products");

  // Handle case when products fetch fails
  if (!products || !products.data) {
    return (
      <>
        <BrandHero />
        <Container>
          <div id="productos" className="py-20 text-center">
            <p className="text-gray-600">No se pudieron cargar los productos. Por favor, intenta más tarde.</p>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <BrandHero />
      <Container>
        <div id="productos">
          <ProductList products={products.data} />
        </div>
      </Container>
    </>
  );
}
