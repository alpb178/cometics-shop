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
  /** Last point the customer picked on the map for this address. */
  lat?: number | null;
  lng?: number | null;
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
  lat?: number;
  lng?: number;
}
