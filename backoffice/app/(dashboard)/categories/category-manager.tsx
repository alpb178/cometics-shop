"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { RefreshButton } from "@/components/refresh-button";
import {
  AdminTable,
  ConfirmDialog,
  IconButton,
  SearchInput,
  SelectCheckbox,
} from "@/components/ui";
import { useSelection } from "@/lib/use-selection";
import { formatDate } from "@/lib/utils";
import type { Category } from "@/lib/types";
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

  const [newName, setNewName] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
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
  const pageIds = useMemo(
    () => pageRows.map((c) => c.documentId),
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
      {/* Crear + buscar */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!newName.trim()) return;
            run(async () => {
              await createCategoryAction(newName);
              setNewName("");
            });
          }}
        >
          <input
            className="input w-56"
            placeholder="Nueva categoría…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <button type="submit" className="btn-primary shrink-0" disabled={pending}>
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Añadir
          </button>
        </form>
        <SearchInput
          value={q}
          onChange={(v) => {
            setQ(v);
            setPage(1);
          }}
          placeholder="Buscar categoría…"
          className="w-full sm:w-56"
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

      {error && (
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
            <td className="px-4 py-3">
              {editingId === c.documentId ? (
                <div className="flex items-center gap-2">
                  <input
                    className="input max-w-xs"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    autoFocus
                  />
                  <IconButton
                    icon={Check}
                    label="Guardar"
                    disabled={pending}
                    onClick={() =>
                      run(async () => {
                        await updateCategoryAction(c.documentId, editName);
                        setEditingId(null);
                      })
                    }
                  />
                  <IconButton
                    icon={X}
                    label="Cancelar"
                    onClick={() => setEditingId(null)}
                  />
                </div>
              ) : (
                <span className="font-medium">{c.name}</span>
              )}
            </td>
            <td className="px-4 py-3 text-on-surface-variant">
              {c.createdAt ? formatDate(c.createdAt) : "—"}
            </td>
            <td className="px-4 py-3">
              <div className="flex items-center justify-end gap-1">
                <IconButton
                  icon={Pencil}
                  label={`Editar ${c.name}`}
                  onClick={() => {
                    setEditingId(c.documentId);
                    setEditName(c.name);
                  }}
                />
                <IconButton
                  icon={Trash2}
                  label={`Eliminar ${c.name}`}
                  variant="danger"
                  onClick={() => setToDelete(c)}
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
