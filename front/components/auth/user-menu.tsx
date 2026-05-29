"use client";

import { useEffect, useRef, useState } from "react";
import { User as UserIcon } from "lucide-react";
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
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!user) {
    return (
      <Link
        href={`/${locale}/sign-in`}
        aria-label="Iniciar sesión"
        className="flex h-10 w-10 items-center justify-center hover:bg-secondary"
      >
        <UserIcon className="h-5 w-5" />
      </Link>
    );
  }

  const initial = (user.firstName?.[0] || user.email[0]).toUpperCase();
  const displayName =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Mi cuenta"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center bg-foreground text-xs font-semibold uppercase text-background hover:bg-foreground/90"
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 border border-border bg-background shadow-xl">
          <div className="border-b border-border px-4 py-3 text-xs">
            <p className="font-semibold">{displayName}</p>
            <p className="truncate text-muted-foreground">{user.email}</p>
          </div>
          <Link
            href={`/${locale}/account`}
            className="block px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-secondary"
            onClick={() => setOpen(false)}
          >
            Mi cuenta
          </Link>
          <Link
            href={`/${locale}/account/orders`}
            className="block px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] hover:bg-secondary"
            onClick={() => setOpen(false)}
          >
            Mis pedidos
          </Link>
          <button
            type="button"
            onClick={async () => {
              await logout();
              setOpen(false);
              router.push(`/${locale}`);
              router.refresh();
            }}
            className="block w-full border-t border-border px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.14em] hover:bg-secondary"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
