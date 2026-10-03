// Staff membership based solely on the user role returned by the API at
// `/users/me` (`role.type`). Only used from server-side code.

export type StaffCheckUser = {
  role?: { type?: string | null } | null;
};

/** Staff if their role type is "admin" or "staff". */
export function isStaffUser(user: StaffCheckUser | null | undefined): boolean {
  const roleType = user?.role?.type;
  return roleType === "admin" || roleType === "staff";
}
