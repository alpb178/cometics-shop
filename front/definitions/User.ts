export interface User {
  id: number;
  email: string;
  username: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  confirmed: boolean;
  blocked: boolean;
  createdAt?: string;
  updatedAt?: string;
  role?: { id?: number; name?: string; type?: string } | null;
  // Computed on the server (`getCurrentUser`): true if the user can access
  // the /admin panel (admin/staff role or email in STAFF_EMAILS).
  isStaff?: boolean;
}
