import { Eye, CalendarDays, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getVisitStats, getTopPaths } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function VisitsPage() {
  const [stats, topPaths] = await Promise.all([
    getVisitStats().catch(() => ({ total: 0, today: 0, last7Days: 0 })),
    getTopPaths(30, 15).catch(() => [])
  ]);

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
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
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
    </div>
  );
}
