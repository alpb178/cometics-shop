"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  FileText,
  Eye,
  Users,
  QrCode,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthUser } from "@/lib/types";

const NAV = [
  { href: "/", label: "Inicio", icon: LayoutDashboard, exact: true },
  { href: "/products", label: "Productos", icon: Package },
  { href: "/categories", label: "Categorías", icon: Tags },
  { href: "/orders", label: "Pedidos", icon: ShoppingBag },
  { href: "/content", label: "Contenido", icon: FileText },
  { href: "/payment-qr", label: "QR de pago", icon: QrCode },
  { href: "/visits", label: "Visitas", icon: Eye },
  { href: "/users", label: "Usuarios", icon: Users }
];

export function Sidebar({
  user,
  onNavigate
}: {
  user: AuthUser | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-60 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-6 py-5">
        <p className="text-lg font-semibold text-brand-dark">Iris Natural</p>
        <p className="text-xs text-neutral-500">Backoffice</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-brand-light text-brand-dark"
                  : "text-neutral-600 hover:bg-neutral-100"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-neutral-200 p-3">
        {user && (
          <p className="px-3 pb-2 text-xs text-neutral-500">
            {user.email || user.username}
          </p>
        )}
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </form>
      </div>
    </aside>
  );
}
