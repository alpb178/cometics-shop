"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import type { Category } from "@/lib/types";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction
} from "./actions";

export function CategoryManager({ categories }: { categories: Category[] }) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(fn: () => Promise<void>) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      }
    });
  }

  return (
    <div className="card max-w-xl">
      {/* Crear */}
      <form
        className="flex gap-2 border-b border-neutral-100 p-4"
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
          className="input"
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

      {error && (
        <p className="border-b border-neutral-100 bg-red-50 px-4 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <ul className="divide-y divide-neutral-100">
        {categories.map((c) => (
          <li key={c.documentId} className="flex items-center gap-2 px-4 py-3">
            {editingId === c.documentId ? (
              <>
                <input
                  className="input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  autoFocus
                />
                <button
                  className="btn-primary shrink-0"
                  disabled={pending}
                  onClick={() =>
                    run(async () => {
                      await updateCategoryAction(c.documentId, editName);
                      setEditingId(null);
                    })
                  }
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  className="btn-secondary shrink-0"
                  onClick={() => setEditingId(null)}
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 font-medium">{c.name}</span>
                <button
                  className="btn-secondary shrink-0"
                  onClick={() => {
                    setEditingId(c.documentId);
                    setEditName(c.name);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  className="btn-danger shrink-0"
                  disabled={pending}
                  onClick={() => {
                    if (!window.confirm(`¿Eliminar "${c.name}"?`)) return;
                    run(() => deleteCategoryAction(c.documentId));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </li>
        ))}
        {categories.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-neutral-400">
            Aún no hay categorías.
          </li>
        )}
      </ul>
    </div>
  );
}
