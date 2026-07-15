"use client";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/price";
import { getImageSrc } from "@/lib/strapi/strapiImage";
import { Plus, Minus, X, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/track-event";
import { ShippingNotice } from "@/components/shipping-notice";

export function CartPage({ locale }: { locale: string }) {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const [confirm, setConfirm] = useState<{
    show: boolean;
    productId?: number;
    clearAll?: boolean;
  }>({ show: false });

  // Registra la apertura del carrito (una vez por montaje).
  useEffect(() => {
    trackEvent("cart_view");
  }, []);

  const handleQuantity = (
    productId: number,
    currentQuantity: number,
    delta: number
  ) => {
    const item = items.find((it) => it.product.id === productId);
    if (!item) return;
    const next = currentQuantity + delta;
    if (next > 0) updateQuantity(item.product, next);
    else setConfirm({ show: true, productId });
  };

  const onConfirm = () => {
    if (confirm.clearAll) clearCart();
    else if (confirm.productId) removeFromCart(confirm.productId);
    setConfirm({ show: false });
  };

  const itemCount = items.reduce((acc, it) => acc + it.quantity, 0);
  const currency = items[0]?.product.currency ?? "BOB";

  return (
    <section className="mx-auto w-full max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-10">
      <header className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Tu pedido
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Carrito{" "}
            {items.length > 0 && (
              <span className="text-base font-normal text-muted-foreground">
                ({itemCount} {itemCount === 1 ? "artículo" : "artículos"})
              </span>
            )}
          </h1>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => setConfirm({ show: true, clearAll: true })}
            className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Vaciar carrito
          </button>
        )}
      </header>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <ShoppingBag
            className="mb-4 h-10 w-10 text-foreground"
            strokeWidth={1.25}
          />
          <p className="mb-2 font-display text-2xl text-foreground">
            Tu carrito está vacío
          </p>
          <p className="mb-8 max-w-md text-sm text-muted-foreground">
            Cuando añadas productos los verás aquí.
          </p>
          <Link
            href={`/${locale}/`}
            className="bg-foreground px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-background hover:bg-foreground/90"
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <>
          <ShippingNotice className="mb-8" />
          <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
            <ul className="divide-y divide-border border-y border-border">
              {items.map((item) => (
                <motion.li
                  key={item.product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-5 py-6"
                >
                  <Link
                    href={`/${locale}/products/${item.product.slug}`}
                    className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-secondary sm:w-32"
                    aria-label={`Ver ${item.product.name}`}
                  >
                    {item.product.images?.[0] && (
                      <Image
                        src={getImageSrc(item.product.images[0].url)}
                        alt={item.product.name}
                        fill
                        sizes="128px"
                        className="object-cover"
                      />
                    )}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <Link
                        href={`/${locale}/products/${item.product.slug}`}
                        className="text-sm font-semibold text-foreground hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          setConfirm({ show: true, productId: item.product.id })
                        }
                        className="-mr-1 flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                        aria-label={`Quitar ${item.product.name}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {item.product.categories?.name && (
                      <p className="mt-0.5 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                        {item.product.categories.name}
                      </p>
                    )}

                    <p className="mt-3 text-sm font-bold text-foreground">
                      {formatPrice({
                        price: item.product.price,
                        currency: item.product.currency ?? "BOB"
                      }).toString()}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <div
                        className="inline-flex items-center border border-border"
                        role="group"
                        aria-label="Cantidad"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantity(item.product.id, item.quantity, -1)
                          }
                          className="flex h-9 w-9 items-center justify-center text-foreground hover:bg-secondary"
                          aria-label="Reducir"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-[40px] text-center text-sm font-semibold text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleQuantity(item.product.id, item.quantity, 1)
                          }
                          className="flex h-9 w-9 items-center justify-center text-foreground hover:bg-secondary"
                          aria-label="Aumentar"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-foreground">
                        {formatPrice({
                          price: item.product.price * item.quantity,
                          currency: item.product.currency ?? "BOB"
                        }).toString()}
                      </p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>

            <aside className="lg:sticky lg:top-32 lg:h-fit">
              <div className="border border-border p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-foreground">
                  Resumen
                </p>

                <dl className="mt-4 space-y-2 border-t border-border pt-6 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-medium text-foreground">
                      {formatPrice({
                        price: getCartTotal(),
                        currency
                      }).toString()}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-4">
                    <dt className="text-base font-semibold text-foreground">
                      Total
                    </dt>
                    <dd className="text-base font-bold text-foreground">
                      {formatPrice({
                        price: getCartTotal(),
                        currency
                      }).toString()}
                    </dd>
                  </div>
                </dl>

                <div className="mt-6">
                  <Link
                    href="/checkout"
                    className="block w-full bg-foreground px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90"
                  >
                    Ir a checkout
                  </Link>
                </div>

                <p className="mt-4 text-xs text-muted-foreground">
                  Elegirás el método de entrega y de pago en el checkout.
                </p>
              </div>
            </aside>
          </div>
        </>
      )}

      <AnimatePresence>
        {confirm.show && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirm({ show: false })}
              className="fixed inset-0 z-[10000] bg-foreground/40"
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-md bg-background p-6 shadow-2xl">
                <p className="font-display text-xl text-foreground">
                  {confirm.clearAll
                    ? "¿Vaciar el carrito?"
                    : "¿Quitar este producto?"}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {confirm.clearAll
                    ? "Se eliminarán todos los artículos del carrito."
                    : "El artículo se eliminará de tu carrito."}
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirm({ show: false })}
                    className="border border-foreground/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-foreground hover:border-foreground"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-background hover:bg-foreground/90"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
