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
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import {
  ChartCard,
  DailyColumns,
  DailyLine,
  HorizontalBars,
  HourlyColumns,
} from "@/components/charts";
import { getCurrentUser } from "@/lib/session";
import {
  listProducts,
  listOrders,
  getVisitStats,
  getDailyVisits,
  getHourlyVisits,
  getOrderStats,
  getTopProducts,
  getTrafficSources,
  countClients,
} from "@/lib/data";
import { ORDER_STATUS_META, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const user = await getCurrentUser();

  const [
    products,
    orders,
    visits,
    clients,
    dailyVisits,
    hourlyVisits,
    orderStats,
    topProducts,
    sources,
  ] = await Promise.all([
    listProducts().catch(() => []),
    listOrders().catch(() => []),
    getVisitStats().catch(() => ({ total: 0, today: 0, last7Days: 0 })),
    countClients().catch(() => 0),
    getDailyVisits(30).catch(() => []),
    getHourlyVisits().catch(() => []),
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
    getTopProducts(30, 5).catch(() => []),
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
          href="/products"
          icon={Package}
        />
        <StatCard
          label="Pedidos"
          value={orderStats.total}
          href="/orders"
          icon={ShoppingBag}
        />
        <StatCard
          label="Por verificar"
          value={orderStats.pending}
          href="/orders"
          icon={FileText}
          hint="Pagos pendientes"
        />
        <StatCard
          label="Ingresos hoy"
          value={`Bs ${orderStats.today.revenue.toLocaleString("es-BO")}`}
          href="/sales"
          icon={Wallet}
          hint="Desde las 00:00 · no cancelados"
        />
        <StatCard
          label="Ganancias productos"
          value={`Bs ${orderStats.today.productProfit.toLocaleString("es-BO")}`}
          href="/sales"
          icon={Coins}
          hint="Precio original · hoy"
        />
        <StatCard
          label="Ganancias plataforma"
          value={`Bs ${orderStats.today.platformProfit.toLocaleString("es-BO")}`}
          href="/sales"
          icon={Percent}
          hint={`Markup ${orderStats.markupPercent}% · hoy`}
        />
        <StatCard
          label="Visitas hoy"
          value={visits.today}
          href="/visits"
          icon={Eye}
          hint={`Desde las 00:00 · 7 días ${visits.last7Days}`}
        />
        <StatCard
          label="Clientes"
          value={clients}
          href="/users"
          icon={Users}
          hint="Usuarios registrados"
        />
      </div>

      {/* Gráficos */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Visitas por día" subtitle="Últimos 30 días" href="/visits">
          <DailyLine data={dailyVisits} />
        </ChartCard>
        <ChartCard title="Pedidos por día" subtitle="Últimos 30 días" href="/orders">
          <DailyColumns data={orderStats.byDay} unit="pedido(s)" />
        </ChartCard>
        <ChartCard title="Visitas de hoy por hora">
          <HourlyColumns data={hourlyVisits} />
        </ChartCard>
        <ChartCard
          title="Productos más vistos"
          subtitle="Últimos 30 días"
          href="/top-products"
        >
          <HorizontalBars
            data={topProducts.map((p) => ({
              label: p.label || p.slug || "—",
              count: p.count,
            }))}
            unit="vistas"
          />
        </ChartCard>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <ChartCard title="Fuentes de tráfico" subtitle="Últimos 30 días" href="/visits">
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
            <Link href="/orders" className="text-xs text-brand hover:underline">
              Ver todos
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {orders.slice(0, 6).map((o) => {
              const meta = ORDER_STATUS_META[o.status];
              return (
                <Link
                  key={o.documentId}
                  href={`/orders/${o.documentId}`}
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
