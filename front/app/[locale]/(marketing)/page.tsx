import { getTranslations } from "next-intl/server";
import { ProductList } from "@/container/products/list";
import { BrandHero } from "@/components/hero/brand-hero";
import { GroupCompanies } from "@/components/group-companies/group-companies";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { pageMetadataFor } from "@/lib/seo-pages";

export const generateMetadata = pageMetadataFor("home");

export default async function HomePage() {
  const products = await fetchContentType("products");
  const t = await getTranslations("home");

  if (!products || !products.data) {
    return (
      <>
        <BrandHero />
        <section className="mx-auto w-full max-w-screen-2xl px-4 py-20 text-center sm:px-6 lg:px-10">
          <p className="text-sm text-muted-foreground">
            {t("productsError")}
          </p>
        </section>
      </>
    );
  }

  // Social counter: people (sessions) who have viewed each product's detail.
  // Best-effort: if it fails, the cards simply don't show it.
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
