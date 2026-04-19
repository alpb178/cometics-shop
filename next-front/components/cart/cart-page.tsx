"use client";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/price";
import { getImageSrc } from "@/lib/strapi/strapiImage";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  AlertTriangle,
  Shield,
  Lock,
  CheckCircle2,
  BadgeCheck,
  ArrowLeft
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { DeliveryOptions } from "../../container/products/product/components/delivery-options";
import { useDeliveryOption } from "@/hooks/useDeliveryOption";
import { CartWhatsapp } from "./cart-whatsapp";
import { useState } from "react";

export function CartPage({ locale }: { locale: string }) {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const { deliveryOption, handleDeliveryChange, getDeliveryText } =
    useDeliveryOption();
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    productId?: number;
    isClearAll?: boolean;
  }>({ show: false });

  const handleQuantityChange = (
    productId: number,
    currentQuantity: number,
    delta: number
  ) => {
    const item = items.find((item) => item.product.id === productId);
    if (item) {
      const newQuantity = currentQuantity + delta;
      if (newQuantity > 0) {
        updateQuantity(item.product, newQuantity);
      } else {
        setConfirmDelete({ show: true, productId });
      }
    }
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.isClearAll) {
      clearCart();
    } else if (confirmDelete.productId) {
      removeFromCart(confirmDelete.productId);
    }
    setConfirmDelete({ show: false });
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ show: false });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/`}
            className="flex min-w-[44px] min-h-[44px] items-center justify-center rounded-lg hover:bg-muted transition-colors text-foreground"
            aria-label="Volver a productos"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-foreground" />
            <h1 className="text-2xl font-bold text-foreground">
              Carrito de Compras
            </h1>
            {items.length > 0 && (
              <span className="text-sm text-muted-foreground">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
            {items.length > 0 && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-full">
                <Lock className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-700 dark:text-green-300">
                  Seguro
                </span>
              </div>
            )}
          </div>
        </div>
        {items.length > 0 && (
          <button
            onClick={() => setConfirmDelete({ show: true, isClearAll: true })}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors text-sm font-medium"
            aria-label="Clear cart"
          >
            <Trash2 className="w-4 h-4" />
            Vaciar carrito
          </button>
        )}
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-border rounded-xl bg-card">
          <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <p className="text-lg font-medium text-foreground mb-2">
            Tu carrito está vacío
          </p>
          <p className="text-sm text-muted-foreground mb-6">
            Agrega productos para comenzar
          </p>
          <Link
            href={`/${locale}/products`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr,360px]">
          {/* Items list */}
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 p-4 border border-border rounded-xl bg-card"
              >
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                  {item.product.images?.[0] && (
                    <Image
                      src={getImageSrc(item.product.images[0].url)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-base mb-1 line-clamp-2">
                    {item.product.name}
                  </h3>
                  <p className="text-base text-foreground font-semibold mb-3">
                    {formatPrice({
                      price: item.product.price,
                      currency: item.product.currency ?? "BOB"
                    }).toString()}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity,
                            -1
                          )
                        }
                        className="p-2 hover:bg-primary/10 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4 text-foreground" />
                      </button>
                      <span className="px-3 py-1 text-sm font-medium text-foreground min-w-[44px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(
                            item.product.id,
                            item.quantity,
                            1
                          )
                        }
                        className="p-2 hover:bg-primary/10 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4 text-foreground" />
                      </button>
                    </div>
                    <button
                      onClick={() =>
                        setConfirmDelete({
                          show: true,
                          productId: item.product.id
                        })
                      }
                      className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                      aria-label="Remove product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Subtotal:{" "}
                    <span className="font-semibold text-foreground">
                      {formatPrice({
                        price: item.product.price * item.quantity,
                        currency: item.product.currency ?? "BOB"
                      }).toString()}
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary sidebar */}
          <div className="lg:sticky lg:top-24 h-fit space-y-6 border border-border rounded-xl bg-card p-6">
            <DeliveryOptions
              value={deliveryOption}
              onChange={handleDeliveryChange}
              showInfo={true}
              className="mb-0"
            />

            <div className="space-y-2 border-t border-border pt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium text-foreground">
                  {formatPrice({
                    price: getCartTotal(),
                    currency: items[0]?.product.currency ?? "BOB"
                  }).toString()}
                </span>
              </div>
              {deliveryOption === "delivery" && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Envío:</span>
                  <span className="font-medium text-foreground">A cotizar</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className="text-lg font-semibold text-foreground">
                  Total:
                </span>
                <span className="text-xl font-bold text-foreground">
                  {formatPrice({
                    price: getCartTotal(),
                    currency: items[0]?.product.currency ?? "BOB"
                  }).toString()}
                  {deliveryOption === "delivery" && (
                    <span className="text-sm text-muted-foreground font-normal ml-1">
                      + envío
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span className="text-xs">Compra segura y protegida</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs">Garantía de satisfacción</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span className="text-xs">Datos protegidos</span>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <BadgeCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-1">
                      Garantía de satisfacción
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-300">
                      Si no estás satisfecho con tu compra, te ayudamos a
                      resolverlo.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <CartWhatsapp messageDelivery={getDeliveryText()} />
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {confirmDelete.show && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelDelete}
              className="fixed inset-0 bg-black/50 z-[10000]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-[10001] flex items-center justify-center p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-card border border-border rounded-lg shadow-xl max-w-md w-full p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {confirmDelete.isClearAll
                        ? "¿Eliminar todos los productos?"
                        : "¿Eliminar este producto?"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {confirmDelete.isClearAll
                        ? "Esta acción eliminará todos los productos de tu carrito. ¿Estás seguro?"
                        : "Esta acción eliminará el producto de tu carrito. ¿Estás seguro?"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={handleCancelDelete}
                    className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
