import {
  Eye,
  CalendarDays,
  CalendarClock,
  Globe,
  MousePointerClick
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import {
  getVisitStats,
  getTopPaths,
  getTrafficSources,
  listStoreEvents
} from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { StoreEventType } from "@/lib/types";

export const dynamic = "force-dynamic";

const EVENT_META: Record<
  StoreEventType,
  { label: string; className: string }
> = {
  product_view: {
    label: "Vio producto",
    className: "bg-blue-100 text-blue-800"
  },
  add_to_cart: {
    label: "Añadió al carrito",
    className: "bg-green-100 text-green-800"
  },
  cart_view: { label: "Abrió carrito", className: "bg-amber-100 text-amber-800" }
};

export default async function VisitsPage() {
  const [stats, topPaths, sources, events] = await Promise.all([
    getVisitStats().catch(() => ({ total: 0, today: 0, last7Days: 0 })),
    getTopPaths(30, 15).catch(() => []),
    getTrafficSources(30).catch(() => []),
    listStoreEvents(100).catch(() => [])
  ]);

  const maxSource = sources.reduce((m, s) => Math.max(m, s.count), 0);

  const cards = [
    { label: "Total", value: stats.total, icon: Eye },
    { label: "Hoy", value: stats.today, icon: CalendarClock },
    { label: "Últimos 7 días", value: stats.last7Days, icon: CalendarDays }
  ];

  const maxCount = topPaths.reduce((m, p) => Math.max(m, p.count), 0);

  return (
    <div>
      <PageHeader
        title="Visitas"
        subtitle="Tráfico registrado en la tienda"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="card p-5">
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-brand" />
              <span className="text-2xl font-semibold">{value}</span>
            </div>
            <p className="mt-2 text-sm text-neutral-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">
          Páginas más visitadas
          <span className="ml-2 text-sm font-normal text-neutral-400">
            (últimos 30 días)
          </span>
        </h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Página</th>
                <th className="px-4 py-3 text-right font-medium">Visitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {topPaths.map((p) => (
                <tr key={p.path} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-neutral-700">
                        {p.path}
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{
                          width: `${maxCount ? (p.count / maxCount) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-neutral-700">
                    {p.count}
                  </td>
                </tr>
              ))}
              {topPaths.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-10 text-center text-neutral-400"
                  >
                    Aún no hay visitas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Origen del tráfico */}
      <div className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <Globe className="h-5 w-5 text-brand" />
          Origen del tráfico
          <span className="ml-1 text-sm font-normal text-neutral-400">
            (últimos 30 días)
          </span>
        </h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Fuente</th>
                <th className="px-4 py-3 text-right font-medium">Visitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sources.map((s) => (
                <tr key={s.source} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-neutral-700">
                      {s.source}
                    </span>
                    <div className="mt-1 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-brand"
                        style={{
                          width: `${maxSource ? (s.count / maxSource) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-neutral-700">
                    {s.count}
                  </td>
                </tr>
              ))}
              {sources.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    className="px-4 py-10 text-center text-neutral-400"
                  >
                    Aún no hay datos de origen.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interacciones */}
      <div className="mt-8">
        <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <MousePointerClick className="h-5 w-5 text-brand" />
          Interacciones
          <span className="ml-1 text-sm font-normal text-neutral-400">
            (últimas {events.length})
          </span>
        </h2>
        <div className="card overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Acción</th>
                <th className="px-4 py-3 font-medium">Producto</th>
                <th className="px-4 py-3 font-medium">Sesión</th>
                <th className="px-4 py-3 font-medium">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {events.map((e) => {
                const meta = EVENT_META[e.type];
                return (
                  <tr key={e.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <span className={`badge ${meta?.className ?? ""}`}>
                        {meta?.label ?? e.type}
                      </span>
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
              {events.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-neutral-400"
                  >
                    Aún no hay interacciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
