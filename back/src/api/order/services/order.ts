/**
 * order service
 */

import { factories } from "@strapi/strapi";
import { errors } from "@strapi/utils";

const { ValidationError } = errors;

type RawItem = {
  productId?: number | string;
  quantity?: number | string;
  imageUrl?: unknown;
};

type VerifiedItem = {
  productId: number;
  name: string;
  slug: string | null;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export default factories.createCoreService("api::order.order", ({ strapi }) => ({
  /**
   * Recalcula los importes de la orden a partir del precio REAL de cada producto
   * publicado en la base de datos. Nunca confía en los precios/totales que envía
   * el cliente. Lanza ValidationError (HTTP 400) si algún item es inválido o el
   * producto no existe / no está publicado.
   */
  async buildVerifiedOrderData(rawItems: unknown) {
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      throw new ValidationError("La orden no contiene items");
    }

    const items = rawItems as RawItem[];
    const ids = [
      ...new Set(
        items
          .map((i) => Number(i.productId))
          .filter((n) => Number.isInteger(n) && n > 0)
      )
    ];
    if (ids.length === 0) {
      throw new ValidationError("Items de la orden inválidos");
    }

    const products = (await strapi.entityService.findMany(
      "api::product.product",
      {
        filters: { id: { $in: ids }, publishedAt: { $notNull: true } },
        fields: ["id", "name", "slug", "price", "currency"]
      }
    )) as Array<{
      id: number;
      name: string;
      slug: string | null;
      price: number | null;
    }>;

    const byId = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const verifiedItems: VerifiedItem[] = items.map((raw) => {
      const productId = Number(raw.productId);
      const product = byId.get(productId);
      if (!product) {
        throw new ValidationError(`Producto no disponible: ${raw.productId}`);
      }
      const quantity = Number(raw.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new ValidationError("Cantidad inválida en la orden");
      }
      const price = Number(product.price) || 0;
      subtotal += price * quantity;
      return {
        productId: product.id,
        name: product.name,
        slug: product.slug ?? null,
        price,
        quantity,
        imageUrl: typeof raw.imageUrl === "string" ? raw.imageUrl : undefined
      };
    });

    const shippingCost = 0; // sin tarifa de envío configurable por ahora
    const total = subtotal + shippingCost;

    return { items: verifiedItems, subtotal, shippingCost, total };
  }
}));
