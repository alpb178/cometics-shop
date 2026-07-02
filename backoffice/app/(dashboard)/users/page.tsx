import Link from "next/link";
import { UserPlus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { listUsers } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import type { AppRole } from "@/lib/types";

export const dynamic = "force-dynamic";

function roleBadge(role: AppRole | null) {
  if (!role) return { label: "—", className: "bg-neutral-100 text-neutral-600" };
  if (role.type === "admin")
    return { label: "Admin", className: "bg-brand-light text-brand-dark" };
  if (role.type === "client")
    return { label: "Cliente", className: "bg-blue-100 text-blue-800" };
  return { label: role.name, className: "bg-neutral-100 text-neutral-600" };
}

export default async function UsersPage() {
  const users = await listUsers();

  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle={`${users.length} usuario(s)`}
        action={
          <Link href="/users/new" className="btn-primary">
            <UserPlus className="h-4 w-4" />
            Nuevo usuario
          </Link>
        }
      />

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Alta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((u) => {
              const badge = roleBadge(u.role);
              return (
                <tr key={u.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">
                    {u.username}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${badge.className}`}>
                      {badge.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.blocked ? (
                      <span className="badge bg-red-100 text-red-800">
                        Bloqueado
                      </span>
                    ) : u.confirmed ? (
                      <span className="badge bg-green-100 text-green-800">
                        Confirmado
                      </span>
                    ) : (
                      <span className="badge bg-amber-100 text-amber-800">
                        Sin confirmar
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {formatDate(u.createdAt)}
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-neutral-400"
                >
                  Aún no hay usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
