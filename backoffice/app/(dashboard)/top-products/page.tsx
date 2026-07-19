import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "@/components/ui";
import { getTopProducts, listProducts } from "@/lib/data";
import { formatPrice, mediaUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Ranking de productos más vistos (equivalente a "Top anuncios" de Tu Chamba). */
export default async function TopProductsPage() {
  const [top30, top7, products] = await Promise.all([
    getTopProducts(30, 20).catch(() => []),
    getTopProducts(7, 50).catch(() => []),
    listProducts().catch(() => []),
  ]);

  const views7 = new Map(top7.map((p) => [p.slug, p.count]));
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  return (
    <div>
      <PageHeader
        title="Top productos"
        subtitle="Los productos más vistos en la tienda (últimos 30 días)"
      />

      <DataTable
        minWidth={640}
        count={top30.length}
        empty="Todavía no hay vistas de producto registradas."
        headers={["#", "Producto", "Precio", "Vistas 30 días", "Vistas 7 días"]}
      >
        {top30.map((t, i) => {
          const product = t.slug ? bySlug.get(t.slug) : undefined;
          const thumb = product ? mediaUrl(product.image, "thumbnail") : null;
          return (
            <tr key={t.slug ?? i} className="hover:bg-neutral-50">
              <td className="px-4 py-3 font-mono text-neutral-400">{i + 1}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                    {thumb && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={thumb}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  {product ? (
                    <Link
                      href={`/products/${product.documentId}/edit`}
                      className="font-medium text-brand hover:underline"
                    >
                      {t.label || t.slug}
                    </Link>
                  ) : (
                    <span className="font-medium">{t.label || t.slug || "—"}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {product ? formatPrice(product.price, product.currency) : "—"}
              </td>
              <td className="px-4 py-3 font-semibold text-neutral-900">
                {t.count}
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {views7.get(t.slug) ?? 0}
              </td>
            </tr>
          );
        })}
      </DataTable>
    </div>
  );
}
