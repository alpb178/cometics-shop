import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/server";
import { authFetch } from "@/lib/strapi/auth-fetch";
import type { Order } from "@/definitions/Order";

const STATUS_LABELS: Record<Order["status"], string> = {
  pending_verification: "Pendiente de verificación",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado"
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Efectivo",
  qr: "Pago por QR",
  // Legado: pedidos anteriores al cambio a efectivo/QR.
  bank_transfer: "Transferencia bancaria"
};

const STRAPI_URL = process.env.NEXT_PUBLIC_API_URL;

function mediaUrl(url?: string | null) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${STRAPI_URL}${url}`;
}

export default async function OrderDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireUser(`/account/orders/${id}`);

  const res = await authFetch(
    `/api/orders/${id}?populate[shippingAddress]=true&populate[paymentProof]=true&populate[items]=true`
  );

  if (!res.ok) return notFound();
  const { data: order } = (await res.json()) as { data: Order };
  if (!order) return notFound();

  const proofUrl = mediaUrl(order.paymentProof?.url);

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
      <Link
        href="/account/orders"
        className="text-xs uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Volver a mis pedidos
      </Link>

      <header className="mt-6 mb-10 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Pedido #{order.id}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {STATUS_LABELS[order.status]}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString("es-BO", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </p>
      </header>

      <div className="space-y-10">
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Productos
          </h2>
          <ul className="divide-y divide-border border-y border-border">
            {order.items?.map((item, i) => (
              <li
                key={item.id ?? `${item.productId}-${i}`}
                className="flex items-center justify-between gap-4 py-4"
              >
                <div className="flex items-center gap-4">
                  {item.imageUrl && (
                    <div className="relative h-16 w-16 overflow-hidden bg-secondary">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Bs {Number(item.price).toFixed(2)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  Bs {(Number(item.price) * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Entrega
            </h2>
            <p className="text-sm">
              {order.deliveryMethod === "delivery"
                ? "Envío a domicilio"
                : "Recoger en tienda"}
            </p>
            {order.shippingAddress && (
              <address className="not-italic mt-2 text-sm text-muted-foreground">
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.line1}
                {order.shippingAddress.line2 && (
                  <>
                    , {order.shippingAddress.line2}
                  </>
                )}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.department}
                <br />
                Tel: {order.shippingAddress.phone}
              </address>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Pago
            </h2>
            <p className="text-sm">{PAYMENT_LABELS[order.paymentMethod]}</p>
            {proofUrl && (
              <a
                href={proofUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block"
              >
                <div className="relative h-32 w-32 overflow-hidden border border-border bg-secondary">
                  <Image
                    src={proofUrl}
                    alt="Comprobante de pago"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              </a>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>Bs {Number(order.subtotal).toFixed(2)}</dd>
            </div>
            {order.shippingCost != null && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Envío</dt>
                <dd>Bs {Number(order.shippingCost).toFixed(2)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>Total</dt>
              <dd>Bs {Number(order.total).toFixed(2)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
