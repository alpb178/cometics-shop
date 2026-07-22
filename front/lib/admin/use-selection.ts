"use client";

import { useCallback, useState } from "react";

/**
 * Selección por lotes que se conserva al cambiar de página o filtro
 * (mismo comportamiento que useSelection del admin de Tu Chamba).
 */
export function useSelection(pageIds: string[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const allInPage =
    pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  const toggleOne = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const togglePage = useCallback(() => {
    setSelected((prev) => {
      const next = new Set(prev);
      const everySelected = pageIds.every((id) => next.has(id));
      for (const id of pageIds) {
        if (everySelected) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  }, [pageIds]);

  const clear = useCallback(() => setSelected(new Set()), []);

  return { selected, allInPage, toggleOne, togglePage, clear };
}
