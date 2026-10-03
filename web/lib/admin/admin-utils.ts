import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { STRAPI_URL } from "./env";
import type {
  Currency,
  OrderStatus,
  StoreEventType,
  StrapiMedia
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Returns an absolute URL for a Strapi media item (local or Cloudinary). */
export function mediaUrl(
  media: StrapiMedia | null | undefined,
  size: "thumbnail" | "small" | "medium" | "full" = "full"
): string | null {
  if (!media) return null;
  const url =
    size !== "full" && media.formats?.[size]?.url
      ? media.formats[size]!.url
      : media.url;
  if (!url) return null;
  return url.startsWith("http") ? url : `${STRAPI_URL}${url}`;
}

const CURRENCY_LABEL: Record<Currency, string> = {
  BOB: "Bs",
  BS: "Bs",
  USD: "$"
};

export function formatPrice(
  value: number | null | undefined,
  currency: Currency = "BS"
): string {
  if (value == null) return "—";
  return `${CURRENCY_LABEL[currency] ?? ""} ${value.toLocaleString("es-BO")}`.trim();
}

/**
 * Date as dd/mm/yyyy hh:mm in Bolivia time (fixed UTC-4), built by hand.
 * Don't use toLocaleString here: Node and the browser format differently
 * (invisible ICU spaces), which breaks React hydration in the client
 * tables.
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  const d = new Date(parsed.getTime() - 4 * 60 * 60 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending_verification: {
    label: "Por verificar",
    className: "bg-amber-100 text-amber-800"
  },
  confirmed: { label: "Confirmado", className: "bg-blue-100 text-blue-800" },
  shipped: { label: "Enviado", className: "bg-indigo-100 text-indigo-800" },
  delivered: { label: "Entregado", className: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelado", className: "bg-red-100 text-red-800" }
};

/**
 * Store event labels. Shared by the interactions table in /admin/visits and
 * the dashboard's latest-events panel.
 */
export const EVENT_META: Record<
  StoreEventType,
  { label: string; className: string }
> = {
  product_view: {
    label: "Vio producto",
    className: "bg-blue-100 text-blue-800"
  },
  add_to_cart: {
    label: "Añadió al carrito",
    className: "bg-green-100 text-green-800"
  },
  cart_view: { label: "Abrió carrito", className: "bg-amber-100 text-amber-800" },
  group_click: {
    label: "Clic en sitio de interés",
    className: "bg-neutral-100 text-neutral-700"
  }
};
