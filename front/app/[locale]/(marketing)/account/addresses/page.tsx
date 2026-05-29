import Link from "next/link";
import { requireUser } from "@/lib/auth/server";
import { authFetch } from "@/lib/strapi/auth-fetch";
import type { Address } from "@/definitions/Address";
import { AddressList } from "@/components/account/address-list";

export default async function AddressesPage() {
  await requireUser("/account/addresses");

  const res = await authFetch(
    "/api/addresses?sort[0]=isDefault:desc&sort[1]=createdAt:desc&pagination[pageSize]=50"
  );
  const addresses: Address[] = res.ok
    ? ((await res.json()) as { data: Address[] }).data
    : [];

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
      <Link
        href="/account"
        className="text-xs uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Mi cuenta
      </Link>

      <header className="mt-6 mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Mi cuenta
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Mis direcciones
          </h1>
        </div>
        <Link
          href="/account/addresses/new"
          className="bg-foreground px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-background transition-colors hover:bg-foreground/90"
        >
          Nueva dirección
        </Link>
      </header>

      <AddressList initialAddresses={addresses} />
    </section>
  );
}
