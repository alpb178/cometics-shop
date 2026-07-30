"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Truck } from "lucide-react";
import {
  ONLINE_ORDER_PAYMENT_TEXT,
  SHIPPING_POLICY_TEXT
} from "@/lib/shipping";

const COOKIE_NAME = "iris_shipping_notice";
// Un año: el aviso es informativo, no tiene sentido repetirlo cada sesión.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Aviso flotante de bienvenida con la política de envío. Se muestra solo en la
 * primera visita: al pulsar "Continuar" se guarda una cookie y no vuelve a
 * aparecer.
 */
export const ShippingWelcome = () => {
  const [open, setOpen] = useState(false);

  // La cookie solo se puede leer en cliente, así que el aviso nunca se pinta
  // en el HTML del servidor: aparece tras montar y solo si no está marcada.
  useEffect(() => {
    const seen = document.cookie
      .split("; ")
      .some((c) => c.startsWith(`${COOKIE_NAME}=`));
    if (!seen) setOpen(true);
  }, []);

  const dismiss = useCallback(() => {
    document.cookie = `${COOKIE_NAME}=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, dismiss]);

  return (
    <AnimatePresence>
      {open && (
        // El contenedor posiciona y el hijo anima: si framer-motion escribiera
        // el transform sobre el mismo nodo que lo centra, lo pisaría.
        <div className="pointer-events-none fixed inset-x-4 top-20 z-[60] flex justify-center sm:top-24">
          <motion.div
            role="dialog"
            aria-modal="false"
            aria-labelledby="shipping-welcome-text"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto w-full max-w-md border border-border bg-card p-5 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <Truck
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                strokeWidth={1.75}
              />
              {/* El id envuelve los dos párrafos: aria-labelledby apunta aquí y
                  el nombre accesible del diálogo debe incluir ambos. */}
              <div id="shipping-welcome-text" className="space-y-2">
                <p className="text-sm leading-relaxed text-foreground">
                  {SHIPPING_POLICY_TEXT}
                </p>
                <p className="text-sm leading-relaxed text-foreground">
                  {ONLINE_ORDER_PAYMENT_TEXT}
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={dismiss}
                className="bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90"
              >
                Continuar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
