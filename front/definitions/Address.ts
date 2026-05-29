export interface Address {
  id: number;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  department: string;
  notes?: string | null;
  isDefault?: boolean;
}

export interface AddressInput {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  department: string;
  notes?: string;
}
