import type { Metadata } from "next";
import { siteMetadata } from "./next-metadata";

const BASE = siteMetadata.url;

function makeMeta(path: string, title: string, description: string): Metadata {
  const url = `${BASE}/${path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const pageMetadata: Record<string, Metadata> = {
  contact: makeMeta(
    "contact",
    "Contacto",
    "Contáctanos. Iris Natural Cosmética, Santa Cruz de la Sierra, Bolivia. Horarios, dirección y WhatsApp."
  ),
  about: makeMeta(
    "about",
    "¿Quiénes Somos?",
    "Conoce a Iris Natural Cosmética. Productos naturales para el cuidado personal en Santa Cruz, Bolivia."
  ),
  faq: makeMeta(
    "faq",
    "Preguntas Frecuentes",
    "Preguntas frecuentes sobre productos naturales, envíos y pedidos. Iris Natural Cosmética."
  ),
  "how-it-works": makeMeta(
    "how-it-works",
    "¿Cómo funciona?",
    "Cómo comprar y recibir tus productos naturales. Proceso de pedido y envío, Iris Natural Cosmética."
  ),
  cart: {
    ...makeMeta(
      "cart",
      "Carrito",
      "Tu carrito de compras. Revisa los productos y completa tu pedido por WhatsApp."
    ),
    robots: { index: false, follow: true },
  },
  "policy-privacy": makeMeta(
    "policy-privacy",
    "Política de Privacidad",
    "Política de privacidad y tratamiento de datos. Iris Natural Cosmética."
  ),
};
