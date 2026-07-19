"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  FileText,
  Eye,
  Users,
  TrendingUp,
  LogOut,
  Menu,
  X,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import type { AuthUser } from "@/lib/types";

// Navegación del panel.
const NAV: {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}[] = [
  { href: "/", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/products", label: "Productos", icon: Package },
  { href: "/categories", label: "Categorías", icon: Tags },
  { href: "/orders", label: "Pedidos", icon: ShoppingBag },
  { href: "/content", label: "Contenido", icon: FileText },
  { href: "/visits", label: "Visitas", icon: Eye },
  { href: "/top-products", label: "Top productos", icon: TrendingUp },
  { href: "/users", label: "Usuarios", icon: Users },
];

/**
 * Layout del panel con el mismo comportamiento que el AdminLayout de
 * Tu Chamba: riel de iconos colapsado que se expande superpuesto al
 * contenido — con hover/focus en escritorio (solo CSS) y con el botón ☰
 * en táctil (estado "pinned") — más cabecera sticky con menú de usuario.
 */
export function DashboardShell({
  user,
  children,
}: {
  user: AuthUser | null;
  children: ReactNode;
}) {
  const pathname = usePathname();
  // El menú vive colapsado como riel. Se expande con hover (CSS) o ☰.
  const [pinned, setPinned] = useState(false);
  // Al elegir una opción el menú se cierra al instante, aunque el cursor
  // siga encima: se apaga la expansión por hover hasta que el mouse salga.
  const [hoverEnabled, setHoverEnabled] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Al navegar, el menú vuelve a colapsarse.
  useEffect(() => {
    setPinned(false);
    setUserMenuOpen(false);
  }, [pathname]);

  // Escape también lo colapsa (y suelta el foco del ☰, que de otro modo
  // mantendría el riel expandido vía focus-within).
  useEffect(() => {
    if (!pinned) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setPinned(false);
      (document.activeElement as HTMLElement | null)?.blur?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pinned]);

  const expanded = pinned;
  const displayName = user?.username || user?.email || "Staff";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex min-h-screen">
      {/* Hueco del riel en el layout: el aside real es fijo y al expandirse
          se superpone al contenido sin empujarlo. */}
      <div className="w-16 shrink-0" aria-hidden="true" />

      {/* Fondo oscurecido solo en modo fijado (táctil). */}
      <div
        aria-hidden="true"
        onClick={() => setPinned(false)}
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          expanded ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Expansión con la curva "emphasized" de Material; anima también la
          sombra para que no aparezca de golpe al final. */}
      <aside
        onMouseLeave={() => setHoverEnabled(true)}
        className={`group fixed inset-y-0 left-0 z-50 flex flex-col overflow-hidden border-r border-outline-variant bg-surface-container-low transition-[width,box-shadow] duration-300 ease-[cubic-bezier(0.2,0,0,1)] ${
          hoverEnabled ? "hover:w-64 hover:shadow-xl focus-within:w-64" : ""
        } ${expanded ? "w-64 shadow-xl" : "w-16"}`}
      >
        {/* Cabecera del riel: ☰ fija el menú en táctil. */}
        <div className="flex h-16 shrink-0 items-center gap-2 border-b border-outline-variant px-3">
          <button
            type="button"
            onClick={() => setPinned((v) => !v)}
            aria-label={expanded ? "Cerrar el menú" : "Abrir el menú"}
            aria-expanded={expanded}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-surface-container-high hover:text-brand"
          >
            {expanded ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          {/* La etiqueta aparece con retardo (cuando el ancho ya avanzó) y
              se desvanece sin retardo al colapsar. */}
          <p
            className={`whitespace-nowrap text-sm font-medium text-neutral-500 transition-opacity duration-200 ease-out group-hover:opacity-100 group-hover:delay-100 group-focus-within:opacity-100 group-focus-within:delay-100 ${
              expanded ? "opacity-100" : "opacity-0"
            }`}
          >
            Menú
          </p>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                title={label}
                onClick={(e) => {
                  // Cierra el menú al elegir una opción (también si se
                  // navega a la página actual, donde pathname no cambia).
                  setPinned(false);
                  setHoverEnabled(false);
                  e.currentTarget.blur();
                }}
                className={`flex h-10 items-center gap-3 rounded-lg px-2 transition-all ${
                  active
                    ? "bg-brand-light font-bold text-brand-dark"
                    : "text-neutral-600 hover:bg-surface-container-high"
                }`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                  <Icon className="h-5 w-5" />
                </span>
                {/* Solo visible con el menú expandido; entra con retardo,
                    siguiendo al ancho, y sale sin él. */}
                <span
                  className={`whitespace-nowrap text-sm transition-opacity duration-200 ease-out group-hover:opacity-100 group-hover:delay-100 group-focus-within:opacity-100 group-focus-within:delay-100 ${
                    expanded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-outline-variant bg-white px-4 sm:px-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3"
            aria-label="Ir al inicio"
          >
            <Image
              src="/logo.png"
              alt="Iris Natural"
              width={32}
              height={32}
              className="shrink-0"
            />
            <span>
              <span className="block text-sm font-semibold leading-tight text-brand-dark">
                Iris Natural
              </span>
              <span className="block text-[11px] leading-none text-neutral-500">
                Backoffice
              </span>
            </span>
          </Link>

          {/* Avatar del usuario: al hacer click se abre el menú de sesión. */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-surface-container-high"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-light text-xs font-bold text-brand-dark">
                {initials}
              </span>
              <span className="hidden sm:inline">{displayName}</span>
              <ChevronDown className="h-4 w-4 text-neutral-500" />
            </button>

            {userMenuOpen && (
              <>
                {/* Click fuera cierra el menú. */}
                <div
                  aria-hidden="true"
                  className="fixed inset-0 z-40"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-outline-variant bg-white shadow-lg"
                >
                  <div className="border-b border-outline-variant px-4 py-3">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-neutral-500">
                      {user?.email}
                    </p>
                  </div>
                  <form action="/api/auth/logout" method="post">
                    <button
                      type="submit"
                      role="menuitem"
                      className="flex w-full items-center gap-2 px-4 py-3 text-sm text-error transition-colors hover:bg-surface-container-low"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
        <footer className="border-t border-outline-variant bg-surface-container-low px-6 py-4">
          <p className="text-center text-xs text-neutral-500">
            © {new Date().getFullYear()} Iris Natural — Panel de administración
          </p>
        </footer>
      </div>
    </div>
  );
}
