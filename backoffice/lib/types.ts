// Tipos compartidos para las entidades de Strapi que gestiona el backoffice.
// Strapi v5 devuelve los atributos aplanados (no anidados en `attributes`).

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiMedia {
  id: number;
  documentId?: string;
  name: string;
  url: string;
  mime?: string;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
  };
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  createdAt?: string;
}

export type Currency = "BOB" | "USD" | "BS";

export interface Product {
  id: number;
  documentId: string;
  name: string;
  price: number | null;
  slug: string | null;
  currency: Currency;
  description: string | null;
  image: StrapiMedia | null;
  images: StrapiMedia[] | null;
  categories: Category[];
  visible: boolean;
  discount: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  name: string;
  slug?: string;
  price: number;
  /** Precio original sin markup. Solo lo devuelve la API a staff. */
  originalPrice?: number | null;
  quantity: number;
  imageUrl?: string;
}

export type OrderStatus =
  | "pending_verification"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Address {
  id: number;
  documentId: string;
  fullName: string;
  phone: string;
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  department?: string | null;
  ci?: string | null;
  notes?: string | null;
}

export interface OrderUser {
  id: number;
  username?: string;
  email?: string;
}

export interface Order {
  id: number;
  documentId: string;
  orderNumber: string;
  deliveryMethod: "delivery" | "pickup";
  paymentMethod: "cash" | "qr" | "bank_transfer";
  subtotal: number;
  shippingCost: number | null;
  total: number;
  status: OrderStatus;
  customerNotes: string | null;
  items: OrderItem[];
  shippingAddress: Address | null;
  paymentProof: StrapiMedia | null;
  paymentReference: string | null;
  cancellationReason: string | null;
  destLat: number | null;
  destLng: number | null;
  /** Markup de la plataforma en %. Solo lo devuelve la API a staff. */
  markupPercent?: number | null;
  user: OrderUser | null;
  createdAt: string;
  updatedAt: string;
}

export interface Faq {
  id: number;
  documentId: string;
  question: string;
  answer: string;
}

export interface VisitStats {
  total: number;
  today: number;
  last7Days: number;
}

export interface TopPath {
  path: string;
  count: number;
}

export interface DayPoint {
  date: string; // YYYY-MM-DD
  count: number;
  revenue?: number;
}

export interface HourPoint {
  hour: number; // 0–23
  count: number;
}

export interface TopProduct {
  slug: string | null;
  label: string | null;
  count: number;
}

/** Clics en una tarjeta de "Sitios de interés" (label = nombre del sitio). */
export interface GroupClick {
  label: string | null;
  count: number;
}

export interface OrderStats {
  total: number;
  pending: number;
  revenue: number;
  /** Ganancia de las ventas a precio original (subtotal sin markup). */
  productProfit: number;
  /** Ganancia de la plataforma (el markup añadido sobre el precio original). */
  platformProfit: number;
  /** Markup aplicado por la plataforma, en %. */
  markupPercent: number;
  /** Totales del día de hoy (desde las 00:00 hora de Bolivia). */
  today: {
    orders: number;
    revenue: number;
    productProfit: number;
    platformProfit: number;
  };
  days: number;
  byDay: DayPoint[];
}

export interface PricingSetting {
  markupPercent: number;
  provinceShippingCost: number;
  scCenterLat: number;
  scCenterLng: number;
  scRadiusKm: number;
}

export interface TrafficSource {
  source: string;
  count: number;
}

export type StoreEventType = "product_view" | "add_to_cart" | "cart_view";

export interface StoreEvent {
  id: number;
  type: StoreEventType;
  label: string | null;
  productSlug: string | null;
  quantity: number | null;
  path: string | null;
  sessionId: string | null;
  createdAt: string;
}

export type SocialName =
  | "instagram"
  | "x"
  | "facebook"
  | "linkedin"
  | "bluesky"
  | "snapchat";

export interface SocialNetwork {
  id: number;
  documentId: string;
  alias: string;
  name: SocialName;
  link: { text?: string; URL?: string } | null;
  publishedAt: string | null;
}

export interface PaymentInfo {
  id: number;
  documentId: string;
  qrImage: StrapiMedia | null;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  accountType: string | null;
  ci: string | null;
  instructions: string | null;
}

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

/** Rol de users-permissions (public/authenticated/admin/client). */
export interface AppRole {
  id: number;
  name: string;
  type: string;
}

/** Usuario tal como lo devuelve `GET /api/users?populate=role` (array plano). */
export interface UserRow {
  id: number;
  username: string;
  email: string;
  provider: string | null;
  confirmed: boolean;
  blocked: boolean;
  role: AppRole | null;
  createdAt: string;
}
