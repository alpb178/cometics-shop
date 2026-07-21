import { ProductList } from "@/container/products/list";
import { BrandHero } from "@/components/hero/brand-hero";
import { GroupCompanies } from "@/components/group-companies/group-companies";
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
    type: "website"
  }
};

export default async function HomePage() {
  const products = await fetchContentType("products");

  if (!products || !products.data) {
    return (
      <>
        <BrandHero />
        <section className="mx-auto w-full max-w-screen-2xl px-4 py-20 text-center sm:px-6 lg:px-10">
          <p className="text-sm text-muted-foreground">
            No se pudieron cargar los productos. Por favor, intenta más tarde.
          </p>
        </section>
      </>
    );
  }

  // Contador social: personas (sesiones) que han visto el detalle de cada
  // producto. Best-effort: si falla, las tarjetas simplemente no lo muestran.
  const viewsBySlug: Record<string, number> = {};
  try {
    const res = await fetch(
      new URL("api/store-events/product-views", process.env.NEXT_PUBLIC_API_URL),
      { cache: "no-store" }
    );
    if (res.ok) {
      const json = await res.json();
      for (const r of json?.data ?? []) {
        if (r?.slug) viewsBySlug[r.slug] = r.count ?? 0;
      }
    }
  } catch {
    // best-effort
  }

  const items = (products.data as any[]).map((p) => ({
    ...p,
    views: viewsBySlug[p.slug] ?? 0
  }));

  return (
    <>
      <BrandHero />
      <div id="productos">
        <ProductList products={items} />
      </div>
      <GroupCompanies />
    </>
  );
}
