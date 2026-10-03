export interface PaymentInfo {
  qrImage?: {
    id: number;
    url: string;
    name?: string;
  } | null;
  bankName?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  accountType?: string | null;
  ci?: string | null;
  instructions?: string | null;
}
