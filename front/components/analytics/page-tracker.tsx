"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Registra una visita cada vez que cambia la ruta. Envía la traza a
 * `/api/track` (same-origin), que la reenvía a Strapi. Usa `sendBeacon` cuando
 * está disponible para no bloquear la navegación.
 */
export function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;
    if (lastTracked.current === pathname) return;
    lastTracked.current = pathname;

    const payload = JSON.stringify({
      path: pathname,
      referrer: document.referrer || undefined
    });

    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track",
        new Blob([payload], { type: "application/json" })
      );
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true
      }).catch(() => {});
    }
  }, [pathname]);

  return null;
}
