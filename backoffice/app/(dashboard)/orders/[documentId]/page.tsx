import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrder } from "@/lib/data";
import { formatDate, mediaUrl } from "@/lib/utils";
import { StatusSelect } from "../status-select";
import { PaymentVerification } from "../payment-verification";

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
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
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

          {order.customerNotes && (
            <div className="card p-5">
              <h2 className="mb-1 font-medium">Notas del cliente</h2>
              <p className="text-sm text-neutral-600">{order.customerNotes}</p>
            </div>
          )}
        </div>

        {/* Lateral */}
        <div className="space-y-6">
          <PaymentVerification
            documentId={order.documentId}
            status={order.status}
            cancellationReason={order.cancellationReason}
          />

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
              <p className="text-neutral-600">{addr.phone}</p>
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
                <a
                  href={`https://www.google.com/maps?q=${order.destLat},${order.destLng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-brand hover:underline"
                >
                  Abrir en Google Maps
                </a>
              </div>
            )}

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
        </div>
      </div>
    </div>
  );
}
