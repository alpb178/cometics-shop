import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import { requireUser } from "@/lib/auth/server";
import { authFetch } from "@/lib/strapi/auth-fetch";
import type { Order } from "@/definitions/Order";
import { formatAmount } from "@/lib/price";
import { INTL_LOCALES } from "@/i18n/routing";
import { toAppLocale } from "@/lib/seo-pages";

export default async function OrdersPage() {
  await requireUser("/account/orders");
  const t = await getTranslations("account");
  const dateLocale = INTL_LOCALES[toAppLocale(await getLocale())];

  // scope=mine: this view shares its endpoint with the admin panel; without the
  // parameter a staff account would see every customer's orders here.
  const res = await authFetch(
    "/api/orders?scope=mine&sort[0]=createdAt:desc&pagination[pageSize]=50"
  );
  const data = res.ok
    ? ((await res.json()) as { data: Order[] })
    : { data: [] as Order[] };

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
      <header className="mb-10 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          {t("eyebrow")}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          {t("orders.title")}
        </h1>
      </header>

      {data.data.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          {t("orders.empty")}{" "}
          <Link href="/" className="underline-offset-4 hover:underline">
            {t("orders.startShopping")}
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {data.data.map((order) => (
            <li key={order.id}>
              <Link
                href={`/account/orders/${order.id}`}
                className="flex items-center justify-between py-5 transition-colors hover:text-primary"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {t("orders.orderNumber", { id: order.id })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString(dateLocale, {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}{" "}
                    · {t(`orders.status.${order.status}`)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold">
                    Bs {formatAmount(order.total)}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
