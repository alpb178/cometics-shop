"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { AppRole } from "@/lib/types";

type SaveAction = (formData: FormData) => Promise<void>;

/** Etiqueta amigable por tipo de rol de la app. */
function roleLabel(role: AppRole): string {
  if (role.type === "admin") return "Administrador (staff)";
  if (role.type === "client") return "Cliente";
  return role.name;
}

export function UserForm({
  roles,
  action
}: {
  roles: AppRole[];
  action: SaveAction;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Solo ofrecemos los roles de la aplicación (admin/client), no public ni
  // authenticated. El rol admin queda preseleccionado.
  const selectable = roles.filter(
    (r) => r.type === "admin" || r.type === "client"
  );
  const defaultRole =
    selectable.find((r) => r.type === "admin")?.id ?? selectable[0]?.id;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      await action(formData);
      router.refresh();
    } catch (err) {
      // redirect() lanza NEXT_REDIRECT: debe propagarse, no tratarse como error.
      if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
      setError(err instanceof Error ? err.message : "No se pudo crear el usuario");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-xl space-y-4 p-5">
      <div>
        <label className="label" htmlFor="username">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          className="input"
          autoComplete="off"
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="input"
          autoComplete="off"
          required
        />
      </div>

      <div>
        <label className="label" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="input"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <p className="mt-1 text-xs text-neutral-500">Mínimo 8 caracteres.</p>
      </div>

      <div>
        <label className="label" htmlFor="role">
          Rol
        </label>
        <select
          id="role"
          name="role"
          className="input"
          defaultValue={defaultRole}
          required
        >
          {selectable.map((r) => (
            <option key={r.id} value={r.id}>
              {roleLabel(r)}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-neutral-500">
          Los administradores tienen acceso a este backoffice.
        </p>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          Crear usuario
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => router.push("/users")}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
