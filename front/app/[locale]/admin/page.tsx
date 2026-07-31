import Link from "next/link";
import {
  Package,
  ShoppingBag,
  FileText,
  Eye,
  Users,
  Wallet,
  Coins,
  Percent,
} from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import {
  ChartCard,
  DailyColumns,
  DailyLine,
  HorizontalBars,
} from "@/components/admin/charts";
import { getCurrentUser } from "@/lib/admin/session";
import {
  listProducts,
  listOrders,
  getVisitStats,
  getDailyVisits,
  getOrderStats,
  getTopProducts,
  getTrafficSources,
  countClients,
  listStoreEvents,
} from "@/lib/admin/data";
import {
  EVENT_META,
  ORDER_STATUS_META,
  formatDate,
} from "@/lib/admin/admin-utils";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const user = await getCurrentUser();

  const [
    products,
    orders,
    visits,
    clients,
    dailyVisits,
    recentEvents,
    orderStats,
    topProductsToday,
    sources,
  ] = await Promise.all([
    listProducts().catch(() => []),
    listOrders().catch(() => []),
    getVisitStats().catch(() => ({ total: 0, today: 0, last7Days: 0 })),
    countClients().catch(() => 0),
    getDailyVisits(30).catch(() => []),
    listStoreEvents(8).catch(() => []),
    getOrderStats(30).catch(() => ({
      total: 0,
      pending: 0,
      revenue: 0,
      productProfit: 0,
      platformProfit: 0,
      markupPercent: 10,
      today: { orders: 0, revenue: 0, productProfit: 0, platformProfit: 0 },
      days: 30,
      byDay: [],
    })),
    getTopProducts(1, 5, "today").catch(() => []),
    getTrafficSources(30).catch(() => []),
  ]);

  return (
    <div>
      <PageHeader
        title={`Hola${user?.username ? `, ${user.username}` : ""} 👋`}
        subtitle="Resumen de la tienda"
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        <StatCard
          label="Productos"
          value={products.length}
          href="/admin/products"
          icon={Package}
        />
        <StatCard
          label="Pedidos"
          value={orderStats.total}
          href="/admin/orders"
          icon={ShoppingBag}
        />
        <StatCard
          label="Por verificar"
          value={orderStats.pending}
          href="/admin/orders"
          icon={FileText}
          hint="Pagos pendientes"
        />
        <StatCard
          label="Ingresos hoy"
          value={`Bs ${orderStats.today.revenue.toLocaleString("es-BO")}`}
          href="/admin/sales"
          icon={Wallet}
          hint="Desde las 00:00 · no cancelados"
        />
        <StatCard
          label="Ganancias productos"
          value={`Bs ${orderStats.today.productProfit.toLocaleString("es-BO")}`}
          href="/admin/sales"
          icon={Coins}
          hint="Precio original · hoy"
        />
        <StatCard
          label="Ganancias plataforma"
          value={`Bs ${orderStats.today.platformProfit.toLocaleString("es-BO")}`}
          href="/admin/sales"
          icon={Percent}
          hint={`Markup ${orderStats.markupPercent}% · hoy`}
        />
        <StatCard
          label="Visitas hoy"
          value={visits.today}
          href="/admin/visits"
          icon={Eye}
          hint={`Desde las 00:00 · 7 días ${visits.last7Days}`}
        />
        <StatCard
          label="Clientes"
          value={clients}
          href="/admin/users"
          icon={Users}
          hint="Usuarios registrados"
        />
      </div>

      {/* Gráficos */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Visitas por día" subtitle="Últimos 30 días" href="/admin/visits">
          <DailyLine data={dailyVisits} />
        </ChartCard>
        <ChartCard title="Pedidos por día" subtitle="Últimos 30 días" href="/admin/orders">
          <DailyColumns data={orderStats.byDay} unit="pedido(s)" />
        </ChartCard>
        <ChartCard
          title="Productos más vistos hoy"
          subtitle="Desde las 00:00"
          href="/admin/top-products"
        >
          <HorizontalBars
            data={topProductsToday.map((p) => ({
              label: p.label || p.slug || "—",
              count: p.count,
            }))}
            unit="vistas"
          />
        </ChartCard>

        {/* Últimos eventos registrados */}
        <div className="card p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-neutral-700">
              Últimos eventos registrados
            </h3>
            <Link href="/admin/visits" className="text-xs text-brand hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentEvents.map((e) => {
              const meta = EVENT_META[e.type];
              return (
                <div
                  key={e.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <span className={`badge ${meta?.className ?? ""}`}>
                    {meta?.label ?? e.type}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm text-neutral-700">
                    {e.label || e.productSlug || e.path || "—"}
                    {e.quantity && e.quantity > 1 ? (
                      <span className="text-neutral-400"> × {e.quantity}</span>
                    ) : null}
                  </span>
                  <span className="shrink-0 text-xs text-neutral-400">
                    {formatDate(e.createdAt)}
                  </span>
                </div>
              );
            })}
            {recentEvents.length === 0 && (
              <p className="py-6 text-center text-sm text-neutral-400">
                Aún no hay eventos registrados.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Fuentes de tráfico" subtitle="Últimos 30 días" href="/admin/visits">
          <HorizontalBars
            data={sources
              .slice(0, 6)
              .map((s) => ({ label: s.source, count: s.count }))}
            unit="visitas"
          />
        </ChartCard>

        {/* Últimos pedidos */}
        <div className="card p-5">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-sm font-semibold text-neutral-700">
              Últimos pedidos
            </h3>
            <Link href="/admin/orders" className="text-xs text-brand hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {orders.slice(0, 6).map((o) => {
              const meta = ORDER_STATUS_META[o.status];
              return (
                <Link
                  key={o.documentId}
                  href={`/admin/orders/${o.documentId}`}
                  className="flex items-center justify-between gap-3 py-2.5 transition hover:bg-neutral-50"
                >
                  <span className="font-mono text-sm">{o.orderNumber}</span>
                  <span className="hidden text-xs text-neutral-400 sm:block">
                    {formatDate(o.createdAt)}
                  </span>
                  <span className={`badge ${meta.className}`}>{meta.label}</span>
                </Link>
              );
            })}
            {orders.length === 0 && (
              <p className="py-6 text-center text-sm text-neutral-400">
                Aún no hay pedidos.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
