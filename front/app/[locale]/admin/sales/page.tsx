import { PageHeader } from "@/components/admin/page-header";
import { getPricingSetting, listOrders } from "@/lib/admin/data";
import { SalesTable } from "./sales-table";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const [orders, pricing] = await Promise.all([
    listOrders().catch(() => []),
    getPricingSetting().catch(() => ({ markupPercent: 10 })),
  ]);

  return (
    <div>
      <PageHeader
        title="Ventas"
        subtitle="Desglose de ganancias por pedido"
      />
      <SalesTable orders={orders} markupPercent={pricing.markupPercent} />
    </div>
  );
}
