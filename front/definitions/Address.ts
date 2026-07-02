export interface Address {
  id: number;
  fullName: string;
  phone: string;
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  department?: string | null;
  ci?: string | null;
  notes?: string | null;
  isDefault?: boolean;
}

export interface AddressInput {
  fullName: string;
  phone: string;
  line1?: string;
  line2?: string;
  city?: string;
  department?: string;
  ci?: string;
  notes?: string;
}
