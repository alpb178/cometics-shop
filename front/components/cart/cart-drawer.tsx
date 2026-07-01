"use client";

import { useCart } from "@/context/cart-context";
import { formatPrice } from "@/lib/price";
import { strapiImage } from "@/lib/strapi/strapiImage";
import { X, Plus, Minus, Trash2, ShoppingBag, AlertTriangle, Shield, Lock, CheckCircle2, BadgeCheck } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { DeliveryOptions } from "../../container/products/product/components/delivery-options";
import { useDeliveryOption } from "@/hooks/useDeliveryOption";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, updateQuantity, removeFromCart, getCartTotal, clearCart } =
    useCart();
  const { deliveryOption, handleDeliveryChange } =
    useDeliveryOption();
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    productId?: number;
    isClearAll?: boolean;
  }>({ show: false });

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.setAttribute("data-cart-open", "true");

      return () => {
        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.body.removeAttribute("data-cart-open");
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

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
        // Show confirmation when quantity reaches 0
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
    <AnimatePresence>
      {isOpen && (
        <div
          data-testid="cart-drawer"
          className="fixed inset-0 z-[9999]"
          style={{
            isolation: "isolate",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            onWheel={(e) => e.stopPropagation()}
            className="fixed inset-0 bg-black/50 z-[9998]"
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0
            }}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-xl z-[9999] flex flex-col"
            style={{
              isolation: "isolate",
              position: "fixed",
              top: 0,
              right: 0,
              height: "100vh"
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-foreground" />
                <h2 className="text-lg font-semibold text-foreground">
                  Carrito de Compras
                </h2>
                {items.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </span>
                )}
                {items.length > 0 && (
                  <div className="flex items-center gap-1 ml-2 px-2 py-0.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-full">
                    <Lock className="w-3 h-3 text-green-600" />
                    <span className="text-xs font-medium text-green-700 dark:text-green-300">
                      Seguro
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button
                    onClick={() => setConfirmDelete({ show: true, isClearAll: true })}
                    className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                    aria-label="Clear cart"
                    title="Clear cart"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                  aria-label="Close cart"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div
              className="flex-1 overflow-y-auto p-4"
              onWheel={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
            >
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
                  <p className="text-lg font-medium text-foreground mb-2">
                    Tu carrito está vacío
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Agrega productos para comenzar
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 border border-border rounded-lg bg-card"
                    >
                      {/* Product Image */}
                      <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                        {item.product.images?.[0] && (
                          <Image
                            src={strapiImage(item.product.images[0].url)}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-foreground font-semibold mb-2">
                          {formatPrice({
                            price: item.product.price,
                            currency: item.product.currency ?? "BOB"
                          }).toString()}{" "}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-border rounded-lg">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.product.id,
                                  item.quantity,
                                  -1
                                )
                              }
                              className="p-1 hover:bg-primary/10 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4 text-foreground" />
                            </button>
                            <span className="px-3 py-1 text-sm font-medium text-foreground min-w-[40px] text-center">
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
                              className="p-1 hover:bg-primary/10 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4 text-foreground" />
                            </button>
                          </div>

                          <button
                            onClick={() => setConfirmDelete({ show: true, productId: item.product.id })}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive transition-colors ml-auto"
                            aria-label="Remove product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Subtotal */}
                        <p className="text-xs text-muted-foreground mt-2">
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
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div
                className="border-t border-border p-4 space-y-4 bg-card overflow-y-auto max-h-[60vh]"
                onWheel={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Delivery Options */}
                <div className="border-b border-border pb-4">
                  <DeliveryOptions
                    value={deliveryOption}
                    onChange={handleDeliveryChange}
                    showInfo={true}
                    className="mb-0"
                  />
                </div>

                {/* Summary */}
                <div className="space-y-2">
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
                      <span className="font-medium text-foreground">
                        A cotizar
                      </span>
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

                {/* Trust Indicators */}
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
                  
                  {/* Satisfaction Guarantee */}
                  <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <BadgeCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-green-900 dark:text-green-100 mb-1">
                          Garantía de satisfacción
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          Si no estás satisfecho con tu compra, te ayudamos a resolverlo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-2">
                  <Link
                    href="/checkout"
                    className="block w-full bg-foreground px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90"
                  >
                    Ir a checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
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
    </AnimatePresence>
  );
};
