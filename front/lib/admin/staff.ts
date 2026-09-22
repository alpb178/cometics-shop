// Pertenencia a staff basada únicamente en el rol del usuario que devuelve la
// API en `/users/me` (`role.type`). Se usa solo desde código server-side.

export type StaffCheckUser = {
  role?: { type?: string | null } | null;
};

/** Es staff si su rol tiene type "admin" o "staff". */
export function isStaffUser(user: StaffCheckUser | null | undefined): boolean {
  const roleType = user?.role?.type;
  return roleType === "admin" || roleType === "staff";
}
