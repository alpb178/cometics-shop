import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { requireUser } from "@/lib/auth/server";
import { LogoutButton } from "@/components/auth/logout-button";

export default async function AccountPage() {
  const user = await requireUser("/account");

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Mi cuenta
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            {fullName || user.email}
          </h1>
        </div>
        <LogoutButton />
      </header>

      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Email
          </dt>
          <dd className="mt-1 text-sm">{user.email}</dd>
        </div>
        {user.phone && (
          <div>
            <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Teléfono
            </dt>
            <dd className="mt-1 text-sm">{user.phone}</dd>
          </div>
        )}
      </dl>

      <nav className="mt-12 divide-y divide-border border-y border-border">
        <Link
          href="/account/orders"
          className="flex items-center justify-between py-5 text-sm font-medium transition-colors hover:text-primary"
        >
          Mis pedidos
          <ChevronRight className="h-4 w-4" />
        </Link>
        <Link
          href="/account/addresses"
          className="flex items-center justify-between py-5 text-sm font-medium transition-colors hover:text-primary"
        >
          Mis direcciones
          <ChevronRight className="h-4 w-4" />
        </Link>
      </nav>
    </section>
  );
}
