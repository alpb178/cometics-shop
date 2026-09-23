import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/server";
import { authFetch } from "@/lib/strapi/auth-fetch";
import type { Order } from "@/definitions/Order";
import { formatAmount } from "@/lib/price";

// Payment methods with a label in `account.orders.paymentMethod`.
// `bank_transfer` is legacy: orders created before the switch to cash/QR.
const PAYMENT_METHODS = ["cash", "qr", "bank_transfer"] as const;
type PaymentLabelKey = (typeof PAYMENT_METHODS)[number];

function isPaymentLabelKey(value: string): value is PaymentLabelKey {
  return (PAYMENT_METHODS as readonly string[]).includes(value);
}

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
  const t = await getTranslations("account.orders");
  const dateLocale = (await getLocale()) === "en" ? "en-US" : "es-BO";

  // scope=mine: even if the user is staff, the account area can only open
  // the detail of their own orders (404 otherwise).
  const res = await authFetch(
    `/api/orders/${id}?scope=mine&populate[shippingAddress]=true&populate[paymentProof]=true&populate[items]=true`
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
        {t("backToOrders")}
      </Link>

      <header className="mt-6 mb-10 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {t("orderNumber", { id: order.id })}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t(`status.${order.status}`)}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString(dateLocale, {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </p>
      </header>

      <div className="space-y-10">
        <div>
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t("products")}
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
                      Bs {formatAmount(item.price)} × {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold">
                  Bs {formatAmount(Number(item.price) * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t("delivery")}
            </h2>
            <p className="text-sm">
              {order.deliveryMethod === "delivery"
                ? t("deliveryHome")
                : t("deliveryPickup")}
            </p>
            {order.shippingAddress && (
              <address className="not-italic mt-2 text-sm text-muted-foreground">
                {order.shippingAddress.fullName}
                <br />
                {order.shippingAddress.line1 && (
                  <>
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 && (
                      <>, {order.shippingAddress.line2}</>
                    )}
                    <br />
                  </>
                )}
                {(order.shippingAddress.city ||
                  order.shippingAddress.department) && (
                  <>
                    {[
                      order.shippingAddress.city,
                      order.shippingAddress.department
                    ]
                      .filter(Boolean)
                      .join(", ")}
                    <br />
                  </>
                )}
                {t("phoneLine", { phone: order.shippingAddress.phone })}
                {order.shippingAddress.ci && (
                  <>
                    <br />
                    {t("ciLine", { ci: order.shippingAddress.ci })}
                  </>
                )}
              </address>
            )}
          </div>

          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              {t("payment")}
            </h2>
            <p className="text-sm">
              {isPaymentLabelKey(order.paymentMethod)
                ? t(`paymentMethod.${order.paymentMethod}`)
                : order.paymentMethod}
            </p>
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
                    alt={t("paymentProofAlt")}
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
              <dt className="text-muted-foreground">{t("subtotal")}</dt>
              <dd>Bs {formatAmount(order.subtotal)}</dd>
            </div>
            {order.shippingCost != null && (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("shipping")}</dt>
                <dd>Bs {formatAmount(order.shippingCost)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>{t("total")}</dt>
              <dd>Bs {formatAmount(order.total)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
