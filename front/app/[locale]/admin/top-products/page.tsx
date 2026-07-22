import { PageHeader } from "@/components/admin/page-header";
import { RefreshButton } from "@/components/admin/refresh-button";
import { getTopProducts, listProducts } from "@/lib/admin/data";
import { formatPrice, mediaUrl } from "@/lib/admin/admin-utils";
import { TopProductsTable, type TopProductRow } from "./top-products-table";

export const dynamic = "force-dynamic";

/** Ranking de productos más vistos (equivalente a "Top anuncios" de Tu Chamba). */
export default async function TopProductsPage() {
  const [top30, top7, products] = await Promise.all([
    getTopProducts(30, 50).catch(() => []),
    getTopProducts(7, 50).catch(() => []),
    listProducts().catch(() => []),
  ]);

  const views7 = new Map(top7.map((p) => [p.slug, p.count]));
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  const rows: TopProductRow[] = top30.map((t) => {
    const product = t.slug ? bySlug.get(t.slug) : undefined;
    return {
      slug: t.slug,
      label: t.label || t.slug || "—",
      thumb: product ? mediaUrl(product.image, "thumbnail") : null,
      price: product ? formatPrice(product.price, product.currency) : "—",
      editHref: product ? `/products/${product.documentId}/edit` : null,
      views30: t.count,
      views7: views7.get(t.slug) ?? 0,
    };
  });

  return (
    <div>
      <PageHeader
        title="Top productos"
        subtitle="Los productos más vistos en la tienda (últimos 30 días)"
        action={<RefreshButton />}
      />
      <TopProductsTable rows={rows} />
    </div>
  );
}
