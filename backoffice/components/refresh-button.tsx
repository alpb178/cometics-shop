"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

/** Recarga los datos de la página (router.refresh) con feedback de giro. */
export function RefreshButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      title="Actualizar"
      aria-label="Actualizar"
      className={cn(
        "inline-flex items-center justify-center rounded-lg border border-neutral-300 bg-white p-2 text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      disabled={pending}
      onClick={() => startTransition(() => router.refresh())}
    >
      <RefreshCw className={cn("h-4 w-4", pending && "animate-spin")} />
    </button>
  );
}
