import Link from "next/link";
import { Package, Tags, ShoppingBag, FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { getCurrentUser } from "@/lib/session";
import { listProducts, listCategories, listOrders } from "@/lib/data";
import { ORDER_STATUS_META } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const user = await getCurrentUser();

  const [products, categories, orders] = await Promise.all([
    listProducts().catch(() => []),
    listCategories().catch(() => []),
    listOrders().catch(() => [])
  ]);

  const pending = orders.filter(
    (o) => o.status === "pending_verification"
  ).length;

  const stats = [
    {
      label: "Productos",
      value: products.length,
      href: "/products",
      icon: Package
    },
    {
      label: "Categorías",
      value: categories.length,
      href: "/categories",
      icon: Tags
    },
    {
      label: "Pedidos",
      value: orders.length,
      href: "/orders",
      icon: ShoppingBag
    },
    {
      label: "Por verificar",
      value: pending,
      href: "/orders",
      icon: FileText
    }
  ];

  return (
    <div>
      <PageHeader
        title={`Hola${user?.username ? `, ${user.username}` : ""} 👋`}
        subtitle="Resumen de la tienda"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map(({ label, value, href, icon: Icon }) => (
          <Link key={label} href={href} className="card p-5 transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <Icon className="h-5 w-5 text-brand" />
              <span className="text-2xl font-semibold">{value}</span>
            </div>
            <p className="mt-2 text-sm text-neutral-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Últimos pedidos</h2>
          <Link href="/orders" className="text-sm text-brand hover:underline">
            Ver todos
          </Link>
        </div>
        <div className="card divide-y divide-neutral-100">
          {orders.slice(0, 5).map((o) => {
            const meta = ORDER_STATUS_META[o.status];
            return (
              <Link
                key={o.documentId}
                href={`/orders/${o.documentId}`}
                className="flex items-center justify-between px-5 py-3 transition hover:bg-neutral-50"
              >
                <span className="font-mono text-sm">{o.orderNumber}</span>
                <span className={`badge ${meta.className}`}>{meta.label}</span>
              </Link>
            );
          })}
          {orders.length === 0 && (
            <p className="px-5 py-6 text-center text-sm text-neutral-400">
              Aún no hay pedidos.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
