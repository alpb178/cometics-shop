"use client";

import { useEffect, useRef, useState } from "react";
import {
  LayoutDashboard,
  LogOut,
  Package,
  User as UserIcon,
  UserCircle2
} from "lucide-react";
import { Link } from "next-view-transitions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export function UserMenu({ locale }: { locale: string }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) {
    return (
      <Link
        href={`/${locale}/sign-in`}
        aria-label="Iniciar sesión"
        className="flex h-10 w-10 items-center justify-center transition-colors hover:bg-secondary"
      >
        <UserIcon className="h-5 w-5" strokeWidth={1.5} />
      </Link>
    );
  }

  const initial = (user.firstName?.[0] || user.email[0]).toUpperCase();
  const displayName = [user.firstName, user.lastName]
    .filter(Boolean)
    .join(" ");
  const hasName = displayName.length > 0;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Mi cuenta"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold uppercase tracking-wider text-background transition-transform hover:scale-105"
      >
        {initial}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-12 z-50 w-72 overflow-hidden border border-border bg-background shadow-[0_8px_24px_-8px_rgba(0,0,0,0.12)]"
        >
          <div className="flex items-center gap-3 border-b border-border bg-secondary/40 px-5 py-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-semibold uppercase text-background">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              {hasName && (
                <p className="truncate text-sm font-semibold">{displayName}</p>
              )}
              <p
                className={`truncate ${
                  hasName ? "text-xs text-muted-foreground" : "text-sm font-semibold"
                }`}
              >
                {user.email}
              </p>
            </div>
          </div>

          <div className="py-2">
            <Link
              href={`/${locale}/account`}
              className="flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-secondary"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <UserCircle2 className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              Mi cuenta
            </Link>
            <Link
              href={`/${locale}/account/orders`}
              className="flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-secondary"
              onClick={() => setOpen(false)}
              role="menuitem"
            >
              <Package className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
              Mis pedidos
            </Link>
            {user.isStaff && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-5 py-2.5 text-sm transition-colors hover:bg-secondary"
                onClick={() => setOpen(false)}
                role="menuitem"
              >
                <LayoutDashboard
                  className="h-4 w-4 text-muted-foreground"
                  strokeWidth={1.5}
                />
                Panel de administración
              </Link>
            )}
          </div>

          <button
            type="button"
            onClick={async () => {
              await logout();
              setOpen(false);
              router.push(`/${locale}`);
              router.refresh();
            }}
            className="flex w-full items-center gap-3 border-t border-border px-5 py-3 text-left text-sm transition-colors hover:bg-secondary"
            role="menuitem"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
