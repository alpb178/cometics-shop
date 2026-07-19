"use client";

import { useState } from "react";
import { Globe, MousePointerClick } from "lucide-react";
import { Pagination } from "@/components/pagination";
import { AdminTable, Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type {
  StoreEvent,
  StoreEventType,
  TopPath,
  TrafficSource,
} from "@/lib/types";

const PAGE_SIZE = 10;

const EVENT_META: Record<StoreEventType, { label: string; className: string }> =
  {
    product_view: {
      label: "Vio producto",
      className: "bg-blue-100 text-blue-800",
    },
    add_to_cart: {
      label: "Añadió al carrito",
      className: "bg-green-100 text-green-800",
    },
    cart_view: {
      label: "Abrió carrito",
      className: "bg-amber-100 text-amber-800",
    },
  };

function usePage<T>(rows: T[]) {
  const [page, setPage] = useState(1);
  return {
    page,
    setPage,
    pageRows: rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    pagination: {
      page,
      totalPages: Math.max(1, Math.ceil(rows.length / PAGE_SIZE)),
      total: rows.length,
      limit: PAGE_SIZE,
    },
  };
}

function BarCell({ value, max }: { value: number; max: number }) {
  return (
    <div className="mt-1 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-surface-container-low">
      <div
        className="h-full rounded-full bg-brand"
        style={{ width: `${max ? (value / max) * 100 : 0}%` }}
      />
    </div>
  );
}

export function VisitsTables({
  topPaths,
  sources,
  events,
}: {
  topPaths: TopPath[];
  sources: TrafficSource[];
  events: StoreEvent[];
}) {
  const paths = usePage(topPaths);
  const src = usePage(sources);
  const ev = usePage(events);

  const maxPath = topPaths.reduce((m, p) => Math.max(m, p.count), 0);
  const maxSource = sources.reduce((m, s) => Math.max(m, s.count), 0);

  return (
    <>
      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">
          Páginas más visitadas
          <span className="ml-2 text-sm font-normal text-neutral-400">
            (últimos 30 días)
          </span>
        </h2>
        <AdminTable
          empty="Aún no hay visitas registradas."
          headers={["Página", <span key="v" className="block text-right">Visitas</span>]}
        >
          {paths.pageRows.map((p) => (
            <tr key={p.path} className="hover:bg-surface-container-low">
              <td className="px-4 py-3">
                <span className="font-mono text-neutral-700">{p.path}</span>
                <BarCell value={p.count} max={maxPath} />
              </td>
              <td className="px-4 py-3 text-right font-semibold text-neutral-700">
                {p.count}
              </td>
            </tr>
          ))}
        </AdminTable>
        <Pagination {...paths.pagination} onPage={paths.setPage} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Globe className="h-5 w-5 text-brand" />
          Origen del tráfico
          <span className="ml-1 text-sm font-normal text-neutral-400">
            (últimos 30 días)
          </span>
        </h2>
        <AdminTable
          empty="Aún no hay datos de origen."
          headers={["Fuente", <span key="v" className="block text-right">Visitas</span>]}
        >
          {src.pageRows.map((s) => (
            <tr key={s.source} className="hover:bg-surface-container-low">
              <td className="px-4 py-3">
                <span className="font-medium text-neutral-700">{s.source}</span>
                <BarCell value={s.count} max={maxSource} />
              </td>
              <td className="px-4 py-3 text-right font-semibold text-neutral-700">
                {s.count}
              </td>
            </tr>
          ))}
        </AdminTable>
        <Pagination {...src.pagination} onPage={src.setPage} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <MousePointerClick className="h-5 w-5 text-brand" />
          Interacciones
          <span className="ml-1 text-sm font-normal text-neutral-400">
            (últimas {events.length})
          </span>
        </h2>
        <AdminTable
          empty="Aún no hay interacciones registradas."
          headers={["Acción", "Producto", "Sesión", "Fecha"]}
        >
          {ev.pageRows.map((e) => {
            const meta = EVENT_META[e.type];
            return (
              <tr key={e.id} className="hover:bg-surface-container-low">
                <td className="px-4 py-3">
                  <Badge className={meta?.className ?? ""}>
                    {meta?.label ?? e.type}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {e.label || "—"}
                  {e.quantity && e.quantity > 1 ? (
                    <span className="text-neutral-400"> × {e.quantity}</span>
                  ) : null}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-400">
                  {e.sessionId ? e.sessionId.slice(0, 8) : "—"}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {formatDate(e.createdAt)}
                </td>
              </tr>
            );
          })}
        </AdminTable>
        <Pagination {...ev.pagination} onPage={ev.setPage} />
      </div>
    </>
  );
}
