"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/sidebar";
import type { AuthUser } from "@/lib/types";

/**
 * Estructura responsive del panel.
 *  - Escritorio (lg+): sidebar fijo a la izquierda.
 *  - Móvil: barra superior con botón, sidebar como drawer deslizante + backdrop.
 */
export function DashboardShell({
  user,
  children
}: {
  user: AuthUser | null;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Cierra el drawer al navegar.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Evita el scroll del body cuando el drawer está abierto (móvil).
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="min-h-screen lg:flex">
      {/* Barra superior móvil */}
      <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-neutral-200 bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Abrir menú"
          className="rounded-lg p-1.5 text-neutral-600 hover:bg-neutral-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-semibold text-brand-dark">Iris Natural</span>
      </header>

      {/* Backdrop móvil */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar: drawer en móvil, fijo en escritorio */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-200 lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Cerrar menú"
          className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
        <Sidebar user={user} onNavigate={() => setOpen(false)} />
      </div>

      <main className="min-w-0 flex-1 overflow-x-hidden">
        <div className="px-4 py-6 sm:px-6 sm:py-8">{children}</div>
      </main>
    </div>
  );
}
