export interface AuthenticatedUser {
  id: number;
  documentId: string | null;
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  confirmed: boolean | null;
  blocked: boolean | null;
  roleType: string | null;
  roleId: number | null;
}

const STAFF_ROLE_TYPES = new Set(["admin", "staff"]);

/** Same rule as back/src/utils/staff.ts: email in STAFF_EMAILS or admin/staff role. */
export function isStaffUser(user: AuthenticatedUser | null | undefined): boolean {
  if (!user) return false;
  const staffEmails = (process.env.STAFF_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (user.email && staffEmails.includes(user.email.toLowerCase())) return true;
  return user.roleType ? STAFF_ROLE_TYPES.has(user.roleType) : false;
}
