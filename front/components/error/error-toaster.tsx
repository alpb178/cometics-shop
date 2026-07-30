"use client";

import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useTheme } from "@/context/theme-context";

/**
 * Captura los errores de JS que nadie maneja —excepciones sueltas y promesas
 * rechazadas— y los muestra como toast, además de renderizar el <Toaster> que
 * usa el resto de la app. Se monta una sola vez desde app/providers.tsx.
 */

/** Un mismo error repetido (p.ej. dentro de un bucle) muestra un solo toast. */
const DEDUPE_MS = 5000;

/** El detalle se recorta: el mensaje de un stack largo desbordaría el toast. */
const MAX_DETAIL = 200;

/**
 * Ruido del navegador sin información aprovechable: los scripts de otro origen
 * (extensiones, terceros) llegan como "Script error." sin stack ni línea, y el
 * bucle de ResizeObserver salta con layouts perfectamente válidos.
 */
const IGNORED = [/^script error\.?$/i, /^resizeobserver loop/i];

function describe(reason: unknown): string {
  if (reason instanceof Error) return reason.message || reason.name;
  if (typeof reason === "string") return reason;
  try {
    return JSON.stringify(reason) ?? String(reason);
  } catch {
    // Referencias circulares o getters que lanzan
    return String(reason);
  }
}

export function ErrorToaster() {
  const { theme } = useTheme();

  useEffect(() => {
    const lastShown = new Map<string, number>();

    const show = (reason: unknown) => {
      const message = describe(reason).trim();
      if (!message || IGNORED.some((pattern) => pattern.test(message))) return;

      const now = Date.now();
      const previous = lastShown.get(message);
      if (previous && now - previous < DEDUPE_MS) return;
      lastShown.set(message, now);

      toast.error("Algo salió mal", {
        // El mensaje como id: sonner actualiza el toast existente en vez de
        // apilar duplicados si el error se repite.
        id: message,
        description:
          message.length > MAX_DETAIL
            ? `${message.slice(0, MAX_DETAIL)}…`
            : message
      });
    };

    const onError = (event: ErrorEvent) => {
      // Los fallos de carga de recursos (una <img> rota, un <script> 404) también
      // disparan "error", pero como Event sin mensaje: no son errores de código.
      if (!(event instanceof ErrorEvent)) return;
      show(event.error ?? event.message);
    };
    const onRejection = (event: PromiseRejectionEvent) => show(event.reason);

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return (
    <Toaster
      theme={theme}
      position="bottom-right"
      closeButton
      // richColors es lo que hace que sonner use las variables --error-*;
      // sin él, los toasts de error caen al estilo neutro.
      richColors
      // Colores del sistema del repo (rgb + variable), esquinas rectas como el
      // resto de la UI. El borde rojo distingue el error del toast neutro.
      style={
        {
          "--border-radius": "0px",
          "--normal-bg": "rgb(var(--background))",
          "--normal-text": "rgb(var(--foreground))",
          "--normal-border": "rgb(var(--border))",
          "--error-bg": "rgb(var(--background))",
          "--error-text": "rgb(var(--foreground))",
          "--error-border": "rgb(var(--destructive))"
        } as React.CSSProperties
      }
      toastOptions={{
        className: "font-sans",
        // sonner fuerza border-radius:50% en el botón de cerrar
        classNames: { closeButton: "!rounded-none" }
      }}
    />
  );
}
