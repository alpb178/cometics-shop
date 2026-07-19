import "server-only";
import {
  strapiDelete,
  strapiGet,
  strapiPostRaw,
  strapiPutRaw,
  strapiSend
} from "./strapi";
import type {
  AppRole,
  Category,
  DayPoint,
  Faq,
  HourPoint,
  Order,
  OrderStats,
  OrderStatus,
  PaymentInfo,
  PricingSetting,
  Product,
  SocialNetwork,
  StoreEvent,
  TopPath,
  TopProduct,
  TrafficSource,
  UserRow,
  VisitStats
} from "./types";

interface ListResponse<T> {
  data: T[];
}
interface SingleResponse<T> {
  data: T;
}

const PRODUCT_POPULATE =
  "populate[image]=true&populate[images]=true&populate[categories]=true";

// `status=draft` en Strapi v5 devuelve la versión borrador de TODOS los
// documentos (publicados o no), que es justo lo que un panel admin necesita.
const ALL = "status=draft";

/* ----------------------------- Productos ----------------------------- */

export async function listProducts(): Promise<Product[]> {
  const res = await strapiGet<ListResponse<Product>>(
    `/api/products?${ALL}&${PRODUCT_POPULATE}&sort=createdAt:desc&pagination[pageSize]=200`
  );
  return res.data ?? [];
}

export async function getProduct(documentId: string): Promise<Product | null> {
  const res = await strapiGet<SingleResponse<Product>>(
    `/api/products/${documentId}?${ALL}&${PRODUCT_POPULATE}`
  );
  return res.data ?? null;
}

export interface ProductInput {
  name: string;
  price: number | null;
  currency: string;
  description: string | null;
  image: number | null;
  images: number[];
  categories: number | null;
}

export async function createProduct(input: ProductInput): Promise<Product> {
  const res = await strapiSend<SingleResponse<Product>>(
    "POST",
    `/api/products?${PRODUCT_POPULATE}`,
    input
  );
  return res.data;
}

export async function updateProduct(
  documentId: string,
  input: Partial<ProductInput>
): Promise<Product> {
  const res = await strapiSend<SingleResponse<Product>>(
    "PUT",
    `/api/products/${documentId}?${PRODUCT_POPULATE}`,
    input
  );
  return res.data;
}

export async function deleteProduct(documentId: string): Promise<void> {
  await strapiDelete(`/api/products/${documentId}`);
}

export async function setProductPublished(
  documentId: string,
  published: boolean
): Promise<void> {
  // Ruta custom añadida en back/ (Document Service publish/unpublish).
  await strapiSend(
    "POST",
    `/api/products/${documentId}/${published ? "publish" : "unpublish"}`,
    {}
  );
}

/* ----------------------------- Categorías ----------------------------- */

export async function listCategories(): Promise<Category[]> {
  const res = await strapiGet<ListResponse<Category>>(
    `/api/categories?sort=name:asc&pagination[pageSize]=200`
  );
  return res.data ?? [];
}

export async function createCategory(name: string): Promise<Category> {
  const res = await strapiSend<SingleResponse<Category>>(
    "POST",
    "/api/categories",
    { name }
  );
  return res.data;
}

export async function updateCategory(
  documentId: string,
  name: string
): Promise<Category> {
  const res = await strapiSend<SingleResponse<Category>>(
    "PUT",
    `/api/categories/${documentId}`,
    { name }
  );
  return res.data;
}

export async function deleteCategory(documentId: string): Promise<void> {
  await strapiDelete(`/api/categories/${documentId}`);
}

/* ------------------------------- Pedidos ------------------------------ */

const ORDER_POPULATE =
  "populate[items]=true&populate[shippingAddress]=true&populate[paymentProof]=true&populate[user]=true";

export async function listOrders(): Promise<Order[]> {
  const res = await strapiGet<ListResponse<Order>>(
    `/api/orders?${ORDER_POPULATE}&sort=createdAt:desc&pagination[pageSize]=200`
  );
  return res.data ?? [];
}

export async function getOrder(documentId: string): Promise<Order | null> {
  const res = await strapiGet<SingleResponse<Order>>(
    `/api/orders/${documentId}?${ORDER_POPULATE}`
  );
  return res.data ?? null;
}

export async function updateOrderStatus(
  documentId: string,
  status: OrderStatus,
  cancellationReason?: string
): Promise<void> {
  const data: { status: OrderStatus; cancellationReason?: string } = { status };
  if (cancellationReason !== undefined) {
    data.cancellationReason = cancellationReason;
  }
  await strapiSend("PUT", `/api/orders/${documentId}`, data);
}

export async function deleteOrder(documentId: string): Promise<void> {
  await strapiDelete(`/api/orders/${documentId}`);
}

/* ------------------------------ Contenido ----------------------------- */

export async function getPaymentInfo(): Promise<PaymentInfo | null> {
  const res = await strapiGet<SingleResponse<PaymentInfo>>(
    `/api/payment-info?populate[qrImage]=true`
  );
  return res.data ?? null;
}

export interface PaymentInfoInput {
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  accountType: string | null;
  ci: string | null;
  instructions: string | null;
  qrImage?: number | null;
}

export async function updatePaymentInfo(
  input: PaymentInfoInput
): Promise<void> {
  // Single type: PUT sin documentId.
  await strapiSend("PUT", "/api/payment-info", input);
}

/* --------------------- Precios / envío (config) ----------------------- */

const PRICING_DEFAULTS: PricingSetting = {
  markupPercent: 10,
  provinceShippingCost: 17,
  scCenterLat: -17.7833,
  scCenterLng: -63.1821,
  scRadiusKm: 15
};

export async function getPricingSetting(): Promise<PricingSetting> {
  const res = await strapiGet<SingleResponse<PricingSetting>>(
    `/api/pricing-setting`
  );
  return res.data ?? { ...PRICING_DEFAULTS };
}

export async function updatePricingSetting(
  input: PricingSetting
): Promise<void> {
  // Single type: PUT sin documentId.
  await strapiSend("PUT", "/api/pricing-setting", input);
}

export async function listFaqs(): Promise<Faq[]> {
  const res = await strapiGet<ListResponse<Faq>>(
    `/api/faqs?pagination[pageSize]=200`
  );
  return res.data ?? [];
}

export async function createFaq(
  question: string,
  answer: string
): Promise<Faq> {
  const res = await strapiSend<SingleResponse<Faq>>("POST", "/api/faqs", {
    question,
    answer
  });
  return res.data;
}

export async function updateFaq(
  documentId: string,
  question: string,
  answer: string
): Promise<Faq> {
  const res = await strapiSend<SingleResponse<Faq>>(
    "PUT",
    `/api/faqs/${documentId}`,
    { question, answer }
  );
  return res.data;
}

export async function deleteFaq(documentId: string): Promise<void> {
  await strapiDelete(`/api/faqs/${documentId}`);
}

export async function listSocials(): Promise<SocialNetwork[]> {
  const res = await strapiGet<ListResponse<SocialNetwork>>(
    `/api/social-networks?${ALL}&populate[link]=true&pagination[pageSize]=200`
  );
  return res.data ?? [];
}

/* ------------------------------- Visitas ------------------------------ */

export async function getVisitStats(): Promise<VisitStats> {
  const res = await strapiGet<SingleResponse<VisitStats>>(
    `/api/page-visits/stats`
  );
  return res.data ?? { total: 0, today: 0, last7Days: 0 };
}

export async function getTopPaths(
  days = 30,
  limit = 10
): Promise<TopPath[]> {
  const res = await strapiGet<ListResponse<TopPath>>(
    `/api/page-visits/top?days=${days}&limit=${limit}`
  );
  return res.data ?? [];
}

export async function getTrafficSources(days = 30): Promise<TrafficSource[]> {
  const res = await strapiGet<ListResponse<TrafficSource>>(
    `/api/page-visits/sources?days=${days}`
  );
  return res.data ?? [];
}

export async function getDailyVisits(days = 30): Promise<DayPoint[]> {
  const res = await strapiGet<ListResponse<DayPoint>>(
    `/api/page-visits/daily?days=${days}`
  );
  return res.data ?? [];
}

export async function getHourlyVisits(): Promise<HourPoint[]> {
  const res = await strapiGet<ListResponse<HourPoint>>(
    `/api/page-visits/hourly`
  );
  return res.data ?? [];
}

export async function getTopProducts(
  days = 30,
  limit = 10
): Promise<TopProduct[]> {
  const res = await strapiGet<ListResponse<TopProduct>>(
    `/api/store-events/top-products?days=${days}&limit=${limit}`
  );
  return res.data ?? [];
}

export async function getOrderStats(days = 30): Promise<OrderStats> {
  const res = await strapiGet<SingleResponse<OrderStats>>(
    `/api/orders/stats?days=${days}`
  );
  return (
    res.data ?? { total: 0, pending: 0, revenue: 0, days, byDay: [] }
  );
}

/* --------------------------- Interacciones ---------------------------- */

export async function listStoreEvents(limit = 100): Promise<StoreEvent[]> {
  const res = await strapiGet<ListResponse<StoreEvent>>(
    `/api/store-events/recent?limit=${limit}`
  );
  return res.data ?? [];
}

/* ------------------------------- Usuarios ----------------------------- */

// `GET /api/users` (users-permissions) devuelve un array plano, no `{ data }`.
// Acceso restringido a staff en la extensión del plugin (back/).
export async function listUsers(): Promise<UserRow[]> {
  const users = await strapiGet<UserRow[]>(`/api/users?populate=role`);
  // Ordenar por fecha de alta (desc) en el servidor Next para no depender de
  // los query params de paginación/orden de users-permissions.
  return (users ?? [])
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

// Roles de users-permissions. La ruta NO fija prefix vacío, así que usa el
// prefijo del plugin: `/api/users-permissions/roles`. Devuelve `{ roles: [] }`.
export async function listRoles(): Promise<AppRole[]> {
  const res = await strapiGet<{ roles: AppRole[] }>(
    `/api/users-permissions/roles`
  );
  return res.roles ?? [];
}

export interface CreateUserInput {
  username: string;
  email: string;
  password: string;
  role: number;
}

export async function createUser(input: CreateUserInput): Promise<UserRow> {
  // El body va sin envoltorio `{ data }`; `confirmed` lo fuerza además la
  // extensión del backend por si acaso.
  return await strapiPostRaw<UserRow>("/api/users", {
    ...input,
    confirmed: true
  });
}

/** Setea la contraseña de un usuario (users-permissions la hashea). */
export async function setUserPassword(
  id: number,
  password: string
): Promise<void> {
  await strapiPutRaw(`/api/users/${id}`, { password });
}

/** Cambia el rol de un usuario. */
export async function setUserRole(id: number, role: number): Promise<void> {
  await strapiPutRaw(`/api/users/${id}`, { role });
}

export async function deleteUser(id: number): Promise<void> {
  await strapiDelete(`/api/users/${id}`);
}

/** Nº de clientes registrados (rol "client"), excluye staff/admin. */
export async function countClients(): Promise<number> {
  const users = await listUsers();
  return users.filter((u) => u.role?.type === "client").length;
}
