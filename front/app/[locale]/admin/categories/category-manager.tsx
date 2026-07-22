"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { Pagination } from "@/components/admin/pagination";
import { RefreshButton } from "@/components/admin/refresh-button";
import {
  AdminTable,
  ConfirmDialog,
  IconButton,
  Modal,
  SearchInput,
  SelectCheckbox,
} from "@/components/admin/ui";
import { useSelection } from "@/lib/admin/use-selection";
import { formatDate } from "@/lib/admin/admin-utils";
import type { Category } from "@/lib/admin/types";
import {
  bulkDeleteCategoriesAction,
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "./actions";

const PAGE_SIZE = 10;

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [toDelete, setToDelete] = useState<Category | null>(null);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return categories;
    return categories.filter((c) =>
      (c.name ?? "").toLowerCase().includes(term),
    );
  }, [categories, q]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageIds = useMemo(() => pageRows.map((c) => c.documentId), [pageRows]);
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
      <PageHeader
        title="Categorías"
        subtitle="Organiza los productos por categoría"
        action={
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setError(null);
              setName("");
              setCreateOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Nueva categoría
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          value={q}
          onChange={(v) => {
            setQ(v);
            setPage(1);
          }}
          placeholder="Buscar categoría…"
          className="w-full sm:w-64"
        />
        <div className="ml-auto flex items-center gap-2">
          {selected.size > 0 && (
            <button
              type="button"
              className="btn-danger"
              onClick={() => setConfirmBulk(true)}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar seleccionadas ({selected.size})
            </button>
          )}
          <RefreshButton />
        </div>
      </div>

      {error && !createOpen && !editTarget && !toDelete && !confirmBulk && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <AdminTable
        loading={pending}
        empty={
          categories.length === 0
            ? "Aún no hay categorías."
            : "Ninguna categoría coincide con la búsqueda."
        }
        headers={[
          <SelectCheckbox
            key="all"
            label="Seleccionar página"
            checked={allInPage}
            onChange={togglePage}
          />,
          "Nombre",
          "Alta",
          <span key="acc" className="block text-right">
            Acciones
          </span>,
        ]}
      >
        {pageRows.map((c) => (
          <tr key={c.documentId} className="hover:bg-surface-container-low">
            <td className="px-4 py-3">
              <SelectCheckbox
                label={`Seleccionar ${c.name}`}
                checked={selected.has(c.documentId)}
                onChange={() => toggleOne(c.documentId)}
              />
            </td>
            <td className="px-4 py-3 font-medium">{c.name}</td>
            <td className="px-4 py-3 text-on-surface-variant">
              {c.createdAt ? formatDate(c.createdAt) : "—"}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <IconButton
                  icon={Pencil}
                  label={`Editar ${c.name}`}
                  onClick={() => {
                    setError(null);
                    setName(c.name);
                    setEditTarget(c);
                  }}
                />
                <IconButton
                  icon={Trash2}
                  label={`Eliminar ${c.name}`}
                  variant="danger"
                  onClick={() => {
                    setError(null);
                    setToDelete(c);
                  }}
                />
              </div>
            </td>
          </tr>
        ))}
      </AdminTable>

      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))}
        total={filtered.length}
        limit={PAGE_SIZE}
        onPage={setPage}
      />

      {/* Crear */}
      {createOpen && (
        <Modal title="Nueva categoría" onClose={() => setCreateOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(
                () => createCategoryAction(name),
                () => setCreateOpen(false),
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className="label" htmlFor="cat-name">
                Nombre
              </label>
              <input
                id="cat-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="p. ej. Cuidado facial"
                required
                autoFocus
              />
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCreateOpen(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={pending}>
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                Crear categoría
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Editar */}
      {editTarget && (
        <Modal
          title={`Editar · ${editTarget.name}`}
          onClose={() => setEditTarget(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(
                () => updateCategoryAction(editTarget.documentId, name),
                () => setEditTarget(null),
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className="label" htmlFor="cat-edit-name">
                Nombre
              </label>
              <input
                id="cat-edit-name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setEditTarget(null)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={pending}>
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                Guardar cambios
              </button>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        open={Boolean(toDelete)}
        title="Eliminar categoría"
        message={`¿Eliminar "${toDelete?.name}"? Los productos asociados quedarán sin categoría.`}
        confirmLabel="Eliminar"
        pending={pending}
        error={error}
        onCancel={() => setToDelete(null)}
        onConfirm={() => {
          if (!toDelete) return;
          run(
            () => deleteCategoryAction(toDelete.documentId),
            () => setToDelete(null),
          );
        }}
      />

      <ConfirmDialog
        open={confirmBulk}
        title="Eliminar seleccionadas"
        message={`¿Eliminar ${selected.size} categoría(s)? Los productos asociados quedarán sin categoría.`}
        confirmLabel="Eliminar todas"
        pending={pending}
        error={error}
        onCancel={() => setConfirmBulk(false)}
        onConfirm={() =>
          run(
            () => bulkDeleteCategoriesAction([...selected]),
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
