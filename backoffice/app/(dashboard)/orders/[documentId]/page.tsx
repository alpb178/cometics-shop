import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { ConfirmButton } from "@/components/confirm-button";
import { getOrder } from "@/lib/data";
import { formatDate, mediaUrl } from "@/lib/utils";
import { StatusSelect } from "../status-select";
import { PaymentVerification } from "../payment-verification";
import { PhoneActions } from "../phone-actions";
import { deleteOrderFromDetailAction } from "../actions";

export const dynamic = "force-dynamic";

const DELIVERY_LABEL: Record<string, string> = {
  delivery: "Envío a domicilio",
  pickup: "Recojo en tienda"
};
const PAYMENT_LABEL: Record<string, string> = {
  cash: "Efectivo",
  qr: "Pago QR",
  // Legado: pedidos antiguos creados antes del cambio a efectivo/QR.
  bank_transfer: "Transferencia bancaria"
};
const PAYMENT_BADGE: Record<string, string> = {
  cash: "bg-green-100 text-green-800",
  qr: "bg-blue-100 text-blue-800",
  bank_transfer: "bg-neutral-100 text-neutral-700"
};

export default async function OrderDetailPage({
  params
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const order = await getOrder(documentId);
  if (!order) notFound();

  const proof = mediaUrl(order.paymentProof);
  const addr = order.shippingAddress;
  // La verificación de pago y el comprobante solo aplican a pagos por QR; en
  // efectivo no hay nada que verificar online (el estado se cambia abajo).
  const isQr = order.paymentMethod === "qr";

  // La API expone el precio original (sin markup) solo a staff. Con él
  // desglosamos el subtotal en ganancia de productos + ganancia de plataforma.
  const hasOriginal = order.items?.some((it) => it.originalPrice != null);
  const originalSubtotal =
    order.items?.reduce(
      (acc, it) => acc + (it.originalPrice ?? it.price) * it.quantity,
      0
    ) ?? 0;
  const platformProfit =
    Math.round((Number(order.subtotal) - originalSubtotal) * 100) / 100;
  const markupLabel =
    order.markupPercent != null
      ? order.markupPercent
      : originalSubtotal > 0
        ? Math.round((platformProfit / originalSubtotal) * 100)
        : 0;
  const bs = (n: number) => `Bs ${n.toLocaleString("es-BO")}`;

  return (
    <div>
      <Link
        href="/orders"
        className="mb-4 inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Pedidos
      </Link>

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-semibold">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            {formatDate(order.createdAt)} · {DELIVERY_LABEL[order.deliveryMethod]}{" "}
            · {PAYMENT_LABEL[order.paymentMethod]}
          </p>
        </div>
        <ConfirmButton
          action={async () => {
            "use server";
            await deleteOrderFromDetailAction(order.documentId);
          }}
          confirmMessage={`¿Eliminar el pedido ${order.orderNumber}? Esta acción no se puede deshacer.`}
        >
          Eliminar pedido
        </ConfirmButton>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          {/* Items */}
          <div className="card overflow-hidden">
            <h2 className="border-b border-neutral-100 px-5 py-3 font-medium">
              Artículos
            </h2>
            <ul className="divide-y divide-neutral-100">
              {order.items?.map((it) => (
                <li
                  key={it.id}
                  className="flex items-center gap-3 px-5 py-3 text-sm"
                >
                  <div className="h-12 w-12 overflow-hidden rounded-lg bg-neutral-100">
                    {it.imageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={it.imageUrl}
                        alt={it.name}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{it.name}</p>
                    <p className="text-neutral-500">
                      {it.quantity} × Bs {Number(it.price).toLocaleString("es-BO")}
                    </p>
                  </div>
                  <span className="font-medium">
                    Bs{" "}
                    {(Number(it.price) * it.quantity).toLocaleString("es-BO")}
                  </span>
                </li>
              ))}
            </ul>
            <div className="space-y-1 border-t border-neutral-100 px-5 py-3 text-sm">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span>Bs {Number(order.subtotal).toLocaleString("es-BO")}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Envío</span>
                <span>
                  Bs {Number(order.shippingCost ?? 0).toLocaleString("es-BO")}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold">
                <span>Total</span>
                <span>Bs {Number(order.total).toLocaleString("es-BO")}</span>
              </div>
            </div>
          </div>

          {/* Desglose de ganancias (solo staff: la API incluye el precio
              original únicamente para el backoffice). */}
          {hasOriginal && (
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
                <h2 className="font-medium">Desglose de ganancias</h2>
                <span className="badge bg-brand-light text-brand">
                  Markup {markupLabel}%
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[34rem] text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-400">
                      <th className="px-5 py-2 text-left font-medium">Producto</th>
                      <th className="px-3 py-2 text-center font-medium">Cant.</th>
                      <th className="px-3 py-2 text-right font-medium">
                        P. original
                      </th>
                      <th className="px-3 py-2 text-right font-medium">P. venta</th>
                      <th className="px-5 py-2 text-right font-medium">Ganancia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {order.items?.map((it) => {
                      const orig = it.originalPrice ?? it.price;
                      const gain = (Number(it.price) - orig) * it.quantity;
                      return (
                        <tr key={it.id}>
                          <td className="px-5 py-2.5">{it.name}</td>
                          <td className="px-3 py-2.5 text-center text-neutral-500">
                            {it.quantity}
                          </td>
                          <td className="px-3 py-2.5 text-right text-neutral-500">
                            {bs(orig)}
                          </td>
                          <td className="px-3 py-2.5 text-right text-neutral-500">
                            {bs(Number(it.price))}
                          </td>
                          <td className="px-5 py-2.5 text-right font-medium text-brand">
                            {bs(gain)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 divide-y divide-neutral-100 border-t border-neutral-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                <div className="px-5 py-4">
                  <p className="text-xs text-neutral-400">Ganancia productos</p>
                  <p className="mt-1 text-xl font-semibold text-neutral-900">
                    {bs(originalSubtotal)}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    A precio original
                  </p>
                </div>
                <div className="bg-brand-light px-5 py-4">
                  <p className="text-xs text-neutral-500">Ganancia plataforma</p>
                  <p className="mt-1 text-xl font-semibold text-brand">
                    {bs(platformProfit)}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    Markup {markupLabel}%
                  </p>
                </div>
                <div className="px-5 py-4">
                  <p className="text-xs text-neutral-400">Subtotal vendido</p>
                  <p className="mt-1 text-xl font-semibold text-neutral-900">
                    {bs(Number(order.subtotal))}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-400">Sin envío</p>
                </div>
              </div>
            </div>
          )}

          {order.customerNotes && (
            <div className="card p-5">
              <h2 className="mb-1 font-medium">Notas del cliente</h2>
              <p className="text-sm text-neutral-600">{order.customerNotes}</p>
            </div>
          )}
        </div>

        {/* Lateral */}
        <div className="min-w-0 space-y-6">
          {isQr && (
            <PaymentVerification
              documentId={order.documentId}
              status={order.status}
              cancellationReason={order.cancellationReason}
            />
          )}

          <div className="card p-5">
            <StatusSelect documentId={order.documentId} current={order.status} />
          </div>

          <div className="card p-5">
            <h2 className="mb-2 font-medium">Pago</h2>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`badge text-sm ${
                  PAYMENT_BADGE[order.paymentMethod] ??
                  "bg-neutral-100 text-neutral-700"
                }`}
              >
                {PAYMENT_LABEL[order.paymentMethod] ?? order.paymentMethod}
              </span>
              <span className="text-sm text-neutral-500">
                {DELIVERY_LABEL[order.deliveryMethod]}
              </span>
            </div>
          </div>

          {addr && (
            <div className="card p-5 text-sm">
              <h2 className="mb-2 font-medium">Envío</h2>
              <p className="font-medium">{addr.fullName}</p>
              {addr.phone && (
                <>
                  <p className="text-neutral-600">{addr.phone}</p>
                  <PhoneActions phone={addr.phone} />
                </>
              )}
              {addr.ci && (
                <p className="text-neutral-600">CI: {addr.ci}</p>
              )}
              {addr.line1 && (
                <p className="mt-1 text-neutral-600">
                  {addr.line1}
                  {addr.line2 ? `, ${addr.line2}` : ""}
                </p>
              )}
              {(addr.city || addr.department) && (
                <p className="text-neutral-600">
                  {[addr.city, addr.department].filter(Boolean).join(", ")}
                </p>
              )}
              {addr.notes && (
                <p className="mt-1 text-neutral-500">{addr.notes}</p>
              )}
            </div>
          )}

          {order.deliveryMethod === "delivery" &&
            order.destLat != null &&
            order.destLng != null && (
              <div className="card p-5 text-sm">
                <h2 className="mb-2 font-medium">Ubicación de entrega</h2>
                <p className="mb-2 font-mono text-neutral-600">
                  {order.destLat.toFixed(6)}, {order.destLng.toFixed(6)}
                </p>
                <div className="overflow-hidden rounded-lg border border-neutral-200">
                  <iframe
                    title="Mapa de entrega"
                    src={`https://maps.google.com/maps?q=${order.destLat},${order.destLng}&z=16&output=embed`}
                    className="h-56 w-full"
                    loading="lazy"
                  />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <a
                    href={`https://www.google.com/maps?q=${order.destLat},${order.destLng}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand hover:underline"
                  >
                    Abrir en Google Maps
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Ubicación de entrega del pedido ${order.orderNumber}: https://www.google.com/maps?q=${order.destLat},${order.destLng}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    Compartir por WhatsApp
                  </a>
                </div>
              </div>
            )}

          {isQr && (
          <div className="card p-5">
            <h2 className="mb-2 font-medium">Comprobante de pago</h2>
            {order.paymentReference && (
              <p className="mb-3 text-sm">
                <span className="text-neutral-500">Nº comprobante: </span>
                <span className="font-mono">{order.paymentReference}</span>
              </p>
            )}
            {proof ? (
              <a href={proof} target="_blank" rel="noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={proof}
                  alt="Comprobante de pago"
                  className="w-full rounded-lg border border-neutral-200"
                />
              </a>
            ) : (
              <p className="text-sm text-neutral-400">Sin comprobante.</p>
            )}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}
