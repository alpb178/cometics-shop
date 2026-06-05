// Lógica de pertenencia a staff, espejo de la del backend (`back/src/utils/staff.ts`).
// `STAFF_EMAILS` es una variable de servidor (sin prefijo NEXT_PUBLIC_), por lo que
// este módulo solo debe usarse desde código server-side.

export type StaffCheckUser = {
  email?: string | null;
  role?: { type?: string | null } | null;
};

/** Es staff si su email está en STAFF_EMAILS o tiene un rol de Strapi con type "staff". */
export function isStaffUser(user: StaffCheckUser | null | undefined): boolean {
  if (!user) return false;
  const staffEmails = (process.env.STAFF_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const email = (user.email || "").toLowerCase();
  if (email && staffEmails.includes(email)) return true;
  if (user.role?.type === "staff") return true;
  return false;
}
