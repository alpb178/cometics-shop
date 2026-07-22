"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";

/** Botón que ejecuta una server action tras confirmar. */
export function ConfirmButton({
  action,
  confirmMessage,
  children,
  className = "btn-danger"
}: {
  action: () => Promise<void>;
  confirmMessage: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex flex-col items-end">
      <button
        type="button"
        className={className}
        disabled={pending}
        onClick={() => {
          if (!window.confirm(confirmMessage)) return;
          setError(null);
          startTransition(async () => {
            try {
              await action();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Error");
            }
          });
        }}
      >
        {pending && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
      {error && <span className="mt-1 text-xs text-red-600">{error}</span>}
    </span>
  );
}
