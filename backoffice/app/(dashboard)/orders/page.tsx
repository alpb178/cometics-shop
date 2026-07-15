import Link from "next/link";
import { ConfirmButton } from "@/components/confirm-button";
import { PageHeader } from "@/components/page-header";
import { listOrders } from "@/lib/data";
import { formatDate, ORDER_STATUS_META } from "@/lib/utils";
import { deleteOrderAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const orders = await listOrders();

  return (
    <div>
      <PageHeader title="Pedidos" subtitle={`${orders.length} pedido(s)`} />

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {orders.map((o) => {
              const meta = ORDER_STATUS_META[o.status];
              return (
                <tr key={o.documentId} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/orders/${o.documentId}`}
                      className="font-mono text-brand hover:underline"
                    >
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {o.user?.email || o.shippingAddress?.fullName || "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    Bs {Number(o.total).toLocaleString("es-BO")}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${meta.className}`}>
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end">
                      <ConfirmButton
                        action={async () => {
                          "use server";
                          await deleteOrderAction(o.documentId);
                        }}
                        confirmMessage={`¿Eliminar el pedido ${o.orderNumber}? Esta acción no se puede deshacer.`}
                      >
                        Eliminar
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-neutral-400"
                >
                  Aún no hay pedidos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
