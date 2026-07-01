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
}
