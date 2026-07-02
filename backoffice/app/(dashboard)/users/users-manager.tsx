"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  KeyRound,
  Loader2,
  Trash2,
  UserPlus,
  X
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { formatDate } from "@/lib/utils";
import type { AppRole, UserRow } from "@/lib/types";
import {
  createUserAction,
  deleteUserAction,
  setUserPasswordAction
} from "./actions";

function roleBadge(role: AppRole | null) {
  if (!role) return { label: "—", className: "bg-neutral-100 text-neutral-600" };
  if (role.type === "admin")
    return { label: "Admin", className: "bg-brand-light text-brand-dark" };
  if (role.type === "client")
    return { label: "Cliente", className: "bg-blue-100 text-blue-800" };
  return { label: role.name, className: "bg-neutral-100 text-neutral-600" };
}

function roleLabel(role: AppRole): string {
  if (role.type === "admin") return "Administrador (staff)";
  if (role.type === "client") return "Cliente";
  return role.name;
}

/** Modal simple (overlay + tarjeta). */
function Modal({
  title,
  onClose,
  children
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function UsersManager({
  users,
  roles,
  currentUserId
}: {
  users: UserRow[];
  roles: AppRole[];
  currentUserId: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [createOpen, setCreateOpen] = useState(false);
  const [pwdUser, setPwdUser] = useState<UserRow | null>(null);
  const [detailUser, setDetailUser] = useState<UserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Estado del formulario de contraseña.
  const [newPassword, setNewPassword] = useState("");

  const selectableRoles = roles.filter(
    (r) => r.type === "admin" || r.type === "client"
  );
  const defaultRole =
    selectableRoles.find((r) => r.type === "admin")?.id ??
    selectableRoles[0]?.id;

  function run(fn: () => Promise<void>, onDone?: () => void) {
    setError(null);
    startTransition(async () => {
      try {
        await fn();
        onDone?.();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
      }
    });
  }

  return (
    <div>
      <PageHeader
        title="Usuarios"
        subtitle={`${users.length} usuario(s)`}
        action={
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setError(null);
              setCreateOpen(true);
            }}
          >
            <UserPlus className="h-4 w-4" />
            Nuevo usuario
          </button>
        }
      />

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Alta</th>
              <th className="px-4 py-3 text-right font-medium">Acciones</th>
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
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="Ver detalles"
                        className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                        onClick={() => setDetailUser(u)}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Setear contraseña"
                        className="rounded p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                        onClick={() => {
                          setError(null);
                          setNewPassword("");
                          setPwdUser(u);
                        }}
                      >
                        <KeyRound className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title="Eliminar"
                        disabled={u.id === currentUserId}
                        className="rounded p-1.5 text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                        onClick={() => {
                          setError(null);
                          setDeleteTarget(u);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-10 text-center text-neutral-400"
                >
                  Aún no hay usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Crear usuario */}
      {createOpen && (
        <Modal title="Nuevo usuario" onClose={() => setCreateOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              run(
                () => createUserAction(fd),
                () => setCreateOpen(false)
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className="label" htmlFor="username">
                Usuario
              </label>
              <input id="username" name="username" className="input" required />
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
                {selectableRoles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {roleLabel(r)}
                  </option>
                ))}
              </select>
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCreateOpen(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={pending}>
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                Crear usuario
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Setear contraseña */}
      {pwdUser && (
        <Modal
          title={`Contraseña · ${pwdUser.username}`}
          onClose={() => setPwdUser(null)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run(
                () => setUserPasswordAction(pwdUser.id, newPassword),
                () => setPwdUser(null)
              );
            }}
            className="space-y-4"
          >
            <div>
              <label className="label" htmlFor="newpwd">
                Nueva contraseña
              </label>
              <input
                id="newpwd"
                type="password"
                className="input"
                minLength={8}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoFocus
              />
              <p className="mt-1 text-xs text-neutral-500">Mínimo 8 caracteres.</p>
            </div>
            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setPwdUser(null)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={pending}>
                {pending && <Loader2 className="h-4 w-4 animate-spin" />}
                Guardar contraseña
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Ver detalles */}
      {detailUser && (
        <Modal
          title="Detalles del usuario"
          onClose={() => setDetailUser(null)}
        >
          <dl className="space-y-2 text-sm">
            <Detail label="Usuario" value={detailUser.username} />
            <Detail label="Email" value={detailUser.email} />
            <Detail
              label="Rol"
              value={roleBadge(detailUser.role).label}
            />
            <Detail
              label="Proveedor"
              value={detailUser.provider || "local"}
            />
            <Detail
              label="Estado"
              value={
                detailUser.blocked
                  ? "Bloqueado"
                  : detailUser.confirmed
                    ? "Confirmado"
                    : "Sin confirmar"
              }
            />
            <Detail label="Alta" value={formatDate(detailUser.createdAt)} />
            <Detail label="ID" value={String(detailUser.id)} />
          </dl>
          <div className="mt-5 flex justify-end">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setDetailUser(null)}
            >
              Cerrar
            </button>
          </div>
        </Modal>
      )}

      {/* Eliminar */}
      {deleteTarget && (
        <Modal title="Eliminar usuario" onClose={() => setDeleteTarget(null)}>
          <p className="text-sm text-neutral-600">
            ¿Eliminar a{" "}
            <span className="font-semibold">{deleteTarget.username}</span> (
            {deleteTarget.email})? Esta acción no se puede deshacer.
          </p>
          {error && (
            <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setDeleteTarget(null)}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn-danger"
              disabled={pending}
              onClick={() =>
                run(
                  () => deleteUserAction(deleteTarget.id),
                  () => setDeleteTarget(null)
                )
              }
            >
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              Eliminar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-neutral-100 pb-2">
      <dt className="text-neutral-500">{label}</dt>
      <dd className="text-right font-medium text-neutral-800">{value}</dd>
    </div>
  );
}
