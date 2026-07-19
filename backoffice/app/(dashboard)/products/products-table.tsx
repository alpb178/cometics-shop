"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { Pagination } from "@/components/pagination";
import {
  AdminTable,
  Badge,
  ConfirmDialog,
  FilterSelect,
  IconButton,
  SearchInput,
  SelectCheckbox,
} from "@/components/ui";
import { useSelection } from "@/lib/use-selection";
import { formatPrice, mediaUrl } from "@/lib/utils";
import type { Category, Product } from "@/lib/types";
import {
  bulkDeleteProductsAction,
  deleteProductAction,
  togglePublishAction,
} from "./actions";

const PAGE_SIZE = 10;

export function ProductsTable({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const [toDelete, setToDelete] = useState<Product | null>(null);
  const [toToggle, setToToggle] = useState<Product | null>(null);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const filter = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      if (term && !(p.name ?? "").toLowerCase().includes(term)) return false;
      if (categoryId && String(p.categories?.id ?? "") !== categoryId)
        return false;
      const published = Boolean(p.publishedAt);
      if (status === "published" && !published) return false;
      if (status === "draft" && published) return false;
      return true;
    });
  }, [products, q, categoryId, status]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageIds = useMemo(
    () => pageRows.map((p) => p.documentId),
    [pageRows],
  );
  const { selected, allInPage, toggleOne, togglePage, clear } =
    useSelection(pageIds);

  function run(fn: () => Promise<void>, after?: () => void) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        after?.();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      }
    });
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          value={q}
          onChange={filter(setQ)}
          placeholder="Buscar por nombre…"
          className="w-full sm:w-64"
        />
        <FilterSelect
          value={categoryId}
          onChange={filter(setCategoryId)}
          allLabel="Todas las categorías"
          options={categories.map((c) => ({
            value: String(c.id),
            label: c.name,
          }))}
        />
        <FilterSelect
          value={status}
          onChange={filter(setStatus)}
          allLabel="Todos los estados"
          options={[
            { value: "published", label: "Publicado" },
            { value: "draft", label: "Borrador" },
          ]}
        />
        {selected.size > 0 && (
          <button
            type="button"
            className="btn-danger ml-auto"
            onClick={() => setConfirmBulk(true)}
          >
            <Trash2 className="h-4 w-4" />
            Eliminar seleccionados ({selected.size})
          </button>
        )}
      </div>

      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <AdminTable
        loading={pending}
        empty={
          products.length === 0
            ? "Aún no hay productos. Crea el primero."
            : "Ningún producto coincide con la búsqueda."
        }
        headers={[
          <SelectCheckbox
            key="all"
            label="Seleccionar página"
            checked={allInPage}
            onChange={togglePage}
          />,
          "Producto",
          "Categoría",
          "Precio",
          "Estado",
          "",
        ]}
      >
        {pageRows.map((p) => {
          const thumb = mediaUrl(p.image, "thumbnail");
          const published = Boolean(p.publishedAt);
          return (
            <tr key={p.documentId} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <SelectCheckbox
                  label={`Seleccionar ${p.name}`}
                  checked={selected.has(p.documentId)}
                  onChange={() => toggleOne(p.documentId)}
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
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
                <Badge
                  className={
                    published
                      ? "bg-green-100 text-green-800"
                      : "bg-neutral-100 text-neutral-600"
                  }
                >
                  {published ? "Publicado" : "Borrador"}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setToToggle(p)}
                  >
                    {published ? "Despublicar" : "Publicar"}
                  </button>
                  <Link
                    href={`/products/${p.documentId}/edit`}
                    className="btn-secondary"
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </Link>
                  <IconButton
                    icon={Trash2}
                    label={`Eliminar ${p.name}`}
                    variant="danger"
                    onClick={() => setToDelete(p)}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </AdminTable>

      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
        total={filtered.length}
        limit={PAGE_SIZE}
        onPage={setPage}
      />

      <ConfirmDialog
        open={Boolean(toToggle)}
        title={toToggle?.publishedAt ? "Despublicar producto" : "Publicar producto"}
        message={
          toToggle?.publishedAt
            ? `"${toToggle?.name}" dejará de verse en la tienda.`
            : `"${toToggle?.name}" pasará a estar visible en la tienda.`
        }
        confirmLabel={toToggle?.publishedAt ? "Despublicar" : "Publicar"}
        pending={pending}
        error={error}
        onCancel={() => setToToggle(null)}
        onConfirm={() => {
          if (!toToggle) return;
          run(
            () =>
              togglePublishAction(
                toToggle.documentId,
                !toToggle.publishedAt,
              ),
            () => setToToggle(null),
          );
        }}
      />

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar producto"
        message={`¿Eliminar "${toDelete?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        pending={pending}
        error={error}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          run(
            () => deleteProductAction(toDelete.documentId),
            () => setToDelete(null),
          );
        }}
      />

      <ConfirmDialog
        open={confirmBulk}
        title="Eliminar seleccionados"
        message={`¿Eliminar ${selected.size} producto(s)? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar todos"
        pending={pending}
        error={error}
        onCancel={() => setConfirmBulk(false)}
        onConfirm={() =>
          run(
            () => bulkDeleteProductsAction([...selected]),
            () => {
              setConfirmBulk(false);
              clear();
            },
          )
        }
      />
    </div>
  );
}
