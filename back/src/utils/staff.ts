type StaffCheckUser = {
  email?: string | null;
  role?: { type?: string | null } | null;
};

export function isStaffUser(user: StaffCheckUser | null | undefined): boolean {
  if (!user) return false;
  const staffEmails = (process.env.STAFF_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const email = (user.email || "").toLowerCase();
  if (email && staffEmails.includes(email)) return true;
  const roleType = user.role?.type;
  if (roleType === "admin" || roleType === "staff") return true;
  return false;
}

/**
 * Guard para acciones de controller que solo puede ejecutar personal staff.
 * Escribe la respuesta de error en `ctx` y devuelve `false` si no procede;
 * devuelve `true` si el usuario autenticado es staff.
 *
 *   if (!ensureStaff(ctx)) return;
 *   return await super.create(ctx);
 */
export function ensureStaff(ctx: any): boolean {
  const user = ctx?.state?.user;
  if (!user) {
    ctx.unauthorized();
    return false;
  }
  if (!isStaffUser(user)) {
    ctx.forbidden();
    return false;
  }
  return true;
}
