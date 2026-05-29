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
  if (user.role?.type === "staff") return true;
  return false;
}
