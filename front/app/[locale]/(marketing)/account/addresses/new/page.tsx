import Link from "next/link";
import { requireUser } from "@/lib/auth/server";
import { AddressForm } from "@/components/account/address-form";

export default async function NewAddressPage() {
  await requireUser("/account/addresses/new");

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-16 lg:py-24">
      <Link
        href="/account/addresses"
        className="text-xs uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:underline"
      >
        ← Mis direcciones
      </Link>

      <header className="mt-6 mb-10 border-b border-border pb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Mi cuenta
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Nueva dirección
        </h1>
      </header>

      <AddressForm mode="create" />
    </section>
  );
}
