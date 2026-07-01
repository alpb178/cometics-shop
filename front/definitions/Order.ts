import type { Address } from "./Address";

export type DeliveryMethod = "delivery" | "pickup";
export type PaymentMethod = "bank_transfer" | "qr";
export type OrderStatus =
  | "pending_verification"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface OrderItem {
  id?: number;
  productId: number;
  name: string;
  slug?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id: number;
  documentId?: string;
  orderNumber?: string;
  items: OrderItem[];
  shippingAddress?: Address | null;
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  shippingCost?: number | null;
  total: number;
  paymentMethod: PaymentMethod;
  paymentProof?: {
    id: number;
    url: string;
    name?: string;
  } | null;
  status: OrderStatus;
  customerNotes?: string | null;
  paymentReference?: string | null;
  cancellationReason?: string | null;
  createdAt: string;
  updatedAt: string;
}
