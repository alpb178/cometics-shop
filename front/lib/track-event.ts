/**
 * Envía una interacción del storefront a `/api/track-event` (same-origin), que
 * la reenvía a Strapi. Best-effort: usa `sendBeacon` cuando está disponible y
 * nunca lanza (el tracking no debe afectar a la UX).
 */
export type StoreEventType = "product_view" | "add_to_cart" | "cart_view";

export interface TrackEventPayload {
  label?: string;
  productSlug?: string;
  quantity?: number;
}

export function trackEvent(
  type: StoreEventType,
  payload: TrackEventPayload = {}
): void {
  if (typeof window === "undefined") return;

  const body = JSON.stringify({
    type,
    path: window.location.pathname,
    ...payload
  });

  try {
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        "/api/track-event",
        new Blob([body], { type: "application/json" })
      );
      return;
    }
    fetch("/api/track-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true
    }).catch(() => {});
  } catch {
    // best-effort
  }
}
