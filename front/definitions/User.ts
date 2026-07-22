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
  // Calculado en el servidor (`getCurrentUser`): true si el usuario tiene
  // acceso al panel /admin (rol admin/staff o email en STAFF_EMAILS).
  isStaff?: boolean;
}
