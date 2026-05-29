import "server-only";
import {
  strapiDelete,
  strapiGet,
  strapiSend
} from "./strapi";
import type {
  Category,
  Faq,
  Order,
  OrderStatus,
  PaymentInfo,
  Product,
  SocialNetwork
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
  status: OrderStatus
): Promise<void> {
  await strapiSend("PUT", `/api/orders/${documentId}`, { status });
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
