import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { ConfirmButton } from "@/components/confirm-button";
import { listProducts } from "@/lib/data";
import { formatPrice, mediaUrl } from "@/lib/utils";
import { deleteProductAction, togglePublishAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await listProducts();

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle={`${products.length} producto(s)`}
        action={
          <Link href="/products/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Link>
        }
      />

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="px-4 py-3 font-medium">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {products.map((p) => {
              const thumb = mediaUrl(p.image, "thumbnail");
              const published = Boolean(p.publishedAt);
              return (
                <tr key={p.documentId} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 overflow-hidden rounded-lg bg-neutral-100">
                        {thumb && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumb}
                            alt={p.name}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {p.categories?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatPrice(p.price, p.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`badge ${
                        published
                          ? "bg-green-100 text-green-800"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <ConfirmButton
                        action={async () => {
                          "use server";
                          await togglePublishAction(p.documentId, !published);
                        }}
                        confirmMessage={
                          published
                            ? `¿Despublicar "${p.name}"?`
                            : `¿Publicar "${p.name}"?`
                        }
                        className="btn-secondary"
                      >
                        {published ? "Despublicar" : "Publicar"}
                      </ConfirmButton>
                      <Link
                        href={`/products/${p.documentId}/edit`}
                        className="btn-secondary"
                      >
                        <Pencil className="h-4 w-4" />
                        Editar
                      </Link>
                      <ConfirmButton
                        action={async () => {
                          "use server";
                          await deleteProductAction(p.documentId);
                        }}
                        confirmMessage={`¿Eliminar "${p.name}"? Esta acción no se puede deshacer.`}
                      >
                        Borrar
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-neutral-400"
                >
                  Aún no hay productos. Crea el primero.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
