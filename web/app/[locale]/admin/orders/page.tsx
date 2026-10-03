import { PageHeader } from "@/components/admin/page-header";
import { listOrders } from "@/lib/admin/data";
import { OrdersTable } from "./orders-table";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <PageHeader title="Pedidos" subtitle={`${orders.length} pedido(s)`} />
      <OrdersTable orders={orders} />
    </div>
  );
}
