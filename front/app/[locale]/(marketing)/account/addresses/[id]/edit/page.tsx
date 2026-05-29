import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/server";
import { authFetch } from "@/lib/strapi/auth-fetch";
import { AddressForm } from "@/components/account/address-form";
import type { Address } from "@/definitions/Address";

export default async function EditAddressPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireUser(`/account/addresses/${id}/edit`);

  const res = await authFetch(`/api/addresses/${id}`);
  if (!res.ok) return notFound();
  const { data: address } = (await res.json()) as { data: Address };
  if (!address) return notFound();

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
          Editar dirección
        </h1>
      </header>

      <AddressForm mode="edit" initial={address} />
    </section>
  );
}
