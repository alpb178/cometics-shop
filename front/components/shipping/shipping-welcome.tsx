"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Truck } from "lucide-react";
import { useTranslations } from "next-intl";

const PARAGRAPHS = ["shipping", "payment"] as const;

const COOKIE_NAME = "iris_shipping_notice";
// One year: the notice is informational, no point repeating it every session.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

/**
 * Floating welcome notice with the shipping policy. Shown only on the first
 * visit: pressing "Continuar" stores a cookie and it does not appear again.
 */
export const ShippingWelcome = () => {
  const [open, setOpen] = useState(false);
  const t = useTranslations("home.shippingWelcome");

  // The cookie can only be read on the client, so the notice is never painted
  // in the server HTML: it appears after mounting and only if it is not
  // flagged.
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
        // The container positions and the child animates: if framer-motion
        // wrote the transform on the same node that centers it, it would
        // overwrite it.
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
              {/* The id wraps both paragraphs: aria-labelledby points here
                  and the dialog's accessible name must include both. */}
              <div id="shipping-welcome-text" className="space-y-2">
                {PARAGRAPHS.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-relaxed text-foreground"
                  >
                    {t(paragraph)}
                  </p>
                ))}
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={dismiss}
                className="bg-foreground px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90"
              >
                {t("continue")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
