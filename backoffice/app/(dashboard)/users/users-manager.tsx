"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, KeyRound, Loader2, Trash2, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Pagination } from "@/components/pagination";
import {
  Badge,
  ConfirmDialog,
  DataTable,
  FilterSelect,
  IconButton,
  Modal,
  SearchInput,
  SelectCheckbox,
} from "@/components/ui";
import { useSelection } from "@/lib/use-selection";
import { formatDate } from "@/lib/utils";
import type { AppRole, UserRow } from "@/lib/types";
import {
  bulkDeleteUsersAction,
  createUserAction,
  deleteUserAction,
  setUserPasswordAction,
} from "./actions";

const PAGE_SIZE = 20;

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

export function UsersManager({
  users,
  roles,
  currentUserId,
}: {
  users: UserRow[];
  roles: AppRole[];
  currentUserId: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [pwdUser, setPwdUser] = useState<UserRow | null>(null);
  const [detailUser, setDetailUser] = useState<UserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const selectableRoles = roles.filter(
    (r) => r.type === "admin" || r.type === "client",
  );
  const defaultRole =
    selectableRoles.find((r) => r.type === "admin")?.id ??
    selectableRoles[0]?.id;

  const filter = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter && (u.role?.type ?? "") !== roleFilter) return false;
      if (!term) return true;
      return `${u.username ?? ""} ${u.email ?? ""}`
        .toLowerCase()
        .includes(term);
    });
  }, [users, q, roleFilter]);

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageIds = useMemo(
    () =>
      pageRows.filter((u) => u.id !== currentUserId).map((u) => String(u.id)),
    [pageRows, currentUserId],
  );
  const { selected, allInPage, toggleOne, togglePage, clear } =
    useSelection(pageIds);

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

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <SearchInput
          value={q}
          onChange={filter(setQ)}
          placeholder="Buscar por usuario o email…"
          className="w-full sm:w-64"
        />
        <FilterSelect
          value={roleFilter}
          onChange={filter(setRoleFilter)}
          allLabel="Todos los roles"
          options={selectableRoles.map((r) => ({
            value: r.type,
            label: roleLabel(r),
          }))}
        />
        {selected.size > 0 && (
          <button
            type="button"
            className="btn-danger ml-auto"
            onClick={() => setConfirmBulk(true)}
          >
            <Trash2 className="h-4 w-4" />
            Eliminar seleccionados ({selected.size})
          </button>
        )}
      </div>

      {error && !createOpen && !pwdUser && !deleteTarget && !confirmBulk && (
        <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <DataTable
        minWidth={760}
        busy={pending}
        count={pageRows.length}
        empty={
          users.length === 0
            ? "Aún no hay usuarios."
            : "Ningún usuario coincide con la búsqueda."
        }
        headers={[
          <SelectCheckbox
            key="all"
            label="Seleccionar página"
            checked={allInPage}
            onChange={togglePage}
          />,
          "Usuario",
          "Email",
          "Rol",
          "Estado",
          "Alta",
          <span key="acc" className="block text-right">
            Acciones
          </span>,
        ]}
      >
        {pageRows.map((u) => {
          const badge = roleBadge(u.role);
          return (
            <tr key={u.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <SelectCheckbox
                  label={`Seleccionar ${u.username}`}
                  checked={selected.has(String(u.id))}
                  disabled={u.id === currentUserId}
                  onChange={() => toggleOne(String(u.id))}
                />
              </td>
              <td className="px-4 py-3 font-medium text-neutral-900">
                {u.username}
              </td>
              <td className="px-4 py-3 text-neutral-600">{u.email}</td>
              <td className="px-4 py-3">
                <Badge className={badge.className}>{badge.label}</Badge>
              </td>
              <td className="px-4 py-3">
                {u.blocked ? (
                  <Badge className="bg-red-100 text-red-800">Bloqueado</Badge>
                ) : u.confirmed ? (
                  <Badge className="bg-green-100 text-green-800">
                    Confirmado
                  </Badge>
                ) : (
                  <Badge className="bg-amber-100 text-amber-800">
                    Sin confirmar
                  </Badge>
                )}
              </td>
              <td className="px-4 py-3 text-neutral-600">
                {formatDate(u.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <IconButton
                    icon={Eye}
                    label="Ver detalles"
                    onClick={() => setDetailUser(u)}
                  />
                  <IconButton
                    icon={KeyRound}
                    label="Setear contraseña"
                    onClick={() => {
                      setError(null);
                      setNewPassword("");
                      setPwdUser(u);
                    }}
                  />
                  <IconButton
                    icon={Trash2}
                    label="Eliminar"
                    variant="danger"
                    disabled={u.id === currentUserId}
                    onClick={() => {
                      setError(null);
                      setDeleteTarget(u);
                    }}
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </DataTable>

      <Pagination
        page={page}
        total={filtered.length}
        limit={PAGE_SIZE}
        onPage={setPage}
      />

      {/* Crear usuario */}
      {createOpen && (
        <Modal title="Nuevo usuario" onClose={() => setCreateOpen(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              run(
                () => createUserAction(fd),
                () => setCreateOpen(false),
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
                () => setPwdUser(null),
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
        <Modal title="Detalles del usuario" onClose={() => setDetailUser(null)}>
          <dl className="space-y-2 text-sm">
            <Detail label="Usuario" value={detailUser.username} />
            <Detail label="Email" value={detailUser.email} />
            <Detail label="Rol" value={roleBadge(detailUser.role).label} />
            <Detail label="Proveedor" value={detailUser.provider || "local"} />
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

      {/* Eliminar individual */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Eliminar usuario"
        message={
          <>
            ¿Eliminar a{" "}
            <span className="font-semibold">{deleteTarget?.username}</span> (
            {deleteTarget?.email})? Esta acción no se puede deshacer.
          </>
        }
        confirmLabel="Eliminar"
        pending={pending}
        error={error}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          run(
            () => deleteUserAction(deleteTarget.id),
            () => setDeleteTarget(null),
          );
        }}
      />

      {/* Eliminar seleccionados */}
      <ConfirmDialog
        open={confirmBulk}
        title="Eliminar seleccionados"
        message={`¿Eliminar ${selected.size} usuario(s)? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar todos"
        pending={pending}
        error={error}
        onCancel={() => setConfirmBulk(false)}
        onConfirm={() =>
          run(
            () => bulkDeleteUsersAction([...selected].map(Number)),
            () => {
              setConfirmBulk(false);
              clear();
            },
          )
        }
      />
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
