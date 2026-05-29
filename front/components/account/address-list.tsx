"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Address } from "@/definitions/Address";

export function AddressList({
  initialAddresses
}: {
  initialAddresses: Address[];
}) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!window.confirm("¿Eliminar esta dirección?")) return;
    setDeleting(id);
    const res = await fetch(`/api/addresses/${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    if (res.ok) {
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      router.refresh();
    }
    setDeleting(null);
  }

  if (addresses.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Aún no tienes direcciones guardadas.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {addresses.map((addr) => (
        <li
          key={addr.id}
          className="border border-border p-5 text-sm"
        >
          <div className="mb-3 flex items-start justify-between gap-2">
            <p className="font-semibold">{addr.fullName}</p>
            {addr.isDefault && (
              <span className="border border-foreground px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]">
                Predeterminada
              </span>
            )}
          </div>
          <address className="not-italic text-muted-foreground">
            {addr.line1}
            {addr.line2 && (
              <>
                <br />
                {addr.line2}
              </>
            )}
            <br />
            {addr.city}, {addr.department}
            <br />
            Tel: {addr.phone}
          </address>

          <div className="mt-4 flex items-center gap-4 border-t border-border pt-3 text-xs">
            <Link
              href={`/account/addresses/${addr.id}/edit`}
              className="flex items-center gap-1 underline-offset-4 hover:underline"
            >
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </Link>
            <button
              type="button"
              onClick={() => handleDelete(addr.id)}
              disabled={deleting === addr.id}
              className="flex items-center gap-1 text-red-600 underline-offset-4 hover:underline disabled:opacity-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {deleting === addr.id ? "Eliminando…" : "Eliminar"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
