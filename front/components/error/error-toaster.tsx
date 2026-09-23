"use client";

import { useEffect } from "react";
import { Toaster, toast } from "sonner";
import { useTheme } from "@/context/theme-context";

/**
 * Catches the JS errors nobody handles —stray exceptions and rejected promises—
 * and shows them as a toast, besides rendering the <Toaster> used by the rest
 * of the app. Mounted only once from app/providers.tsx.
 */

/** The same error repeated (e.g. inside a loop) shows a single toast. */
const DEDUPE_MS = 5000;

/**
 * The detail is truncated: the message of a long stack would overflow the
 * toast.
 */
const MAX_DETAIL = 200;

/**
 * Browser noise with no usable information: cross-origin scripts (extensions,
 * third parties) arrive as "Script error." with no stack or line, and the
 * ResizeObserver loop fires with perfectly valid layouts.
 */
const IGNORED = [/^script error\.?$/i, /^resizeobserver loop/i];

function describe(reason: unknown): string {
  if (reason instanceof Error) return reason.message || reason.name;
  if (typeof reason === "string") return reason;
  try {
    return JSON.stringify(reason) ?? String(reason);
  } catch {
    // Circular references or throwing getters
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
        // The message as id: sonner updates the existing toast instead of
        // stacking duplicates if the error repeats.
        id: message,
        description:
          message.length > MAX_DETAIL
            ? `${message.slice(0, MAX_DETAIL)}…`
            : message
      });
    };

    const onError = (event: ErrorEvent) => {
      // Resource loading failures (a broken <img>, a 404 <script>) also fire
      // "error", but as an Event with no message: they are not code errors.
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
      // richColors is what makes sonner use the --error-* variables; without
      // it, error toasts fall back to the neutral style.
      richColors
      // Repo system colors (rgb + variable), square corners like the rest of
      // the UI. The red border tells the error apart from the neutral toast.
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
        // sonner forces border-radius:50% on the close button
        classNames: { closeButton: "!rounded-none" }
      }}
    />
  );
}
