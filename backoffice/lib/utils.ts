import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { STRAPI_URL } from "./strapi";
import type { Currency, OrderStatus, StrapiMedia } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Devuelve una URL absoluta para un media de Strapi (local o Cloudinary). */
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

export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("es-BO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
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
