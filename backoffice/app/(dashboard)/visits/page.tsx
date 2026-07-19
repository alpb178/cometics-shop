import { Eye, CalendarDays, CalendarClock } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { RefreshButton } from "@/components/refresh-button";
import {
  getVisitStats,
  getTopPaths,
  getTrafficSources,
  listStoreEvents,
} from "@/lib/data";
import { VisitsTables } from "./visits-tables";

export const dynamic = "force-dynamic";

export default async function VisitsPage() {
  const [stats, topPaths, sources, events] = await Promise.all([
    getVisitStats().catch(() => ({ total: 0, today: 0, last7Days: 0 })),
    getTopPaths(30, 50).catch(() => []),
    getTrafficSources(30).catch(() => []),
    listStoreEvents(100).catch(() => []),
  ]);

  const cards = [
    { label: "Total", value: stats.total, icon: Eye },
    { label: "Hoy", value: stats.today, icon: CalendarClock },
    { label: "Últimos 7 días", value: stats.last7Days, icon: CalendarDays },
  ];

  return (
    <div>
      <PageHeader
        title="Visitas"
        subtitle="Tráfico registrado en la tienda"
        action={<RefreshButton />}
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

      <VisitsTables topPaths={topPaths} sources={sources} events={events} />
    </div>
  );
}
