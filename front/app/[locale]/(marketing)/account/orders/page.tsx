import Link from "next/link";
import { ChevronRight } from "lucide-react";
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

export default async function OrdersPage() {
  await requireUser("/account/orders");

  const res = await authFetch(
    "/api/orders?sort[0]=createdAt:desc&pagination[pageSize]=50"
  );
  const data = res.ok
    ? ((await res.json()) as { data: Order[] })
    : { data: [] as Order[] };

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
      <header className="mb-10 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Mi cuenta
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Mis pedidos
        </h1>
      </header>

      {data.data.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Todavía no tienes pedidos.{" "}
          <Link href="/" className="underline-offset-4 hover:underline">
            Empieza a comprar
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
                    Pedido #{order.id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("es-BO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}{" "}
                    · {STATUS_LABELS[order.status]}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold">
                    Bs {Number(order.total).toFixed(2)}
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
