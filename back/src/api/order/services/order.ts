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
   *
   * Precios: se aplica un markup global (invisible) a cada producto — el precio
   * cobrado es `base × (1 + markupPercent/100)`.
   * Envío: si el pedido es delivery FUERA de Santa Cruz (provincia), se suma un
   * costo fijo (provinceShippingCost). La condición de "provincia" se verifica en
   * el servidor por coordenadas; si no hay coordenadas, se usa el flag del cliente
   * como respaldo (el pedido pasa igualmente por verificación manual de staff).
   */
  async buildVerifiedOrderData(
    rawItems: unknown,
    opts: {
      deliveryMethod?: string;
      lat?: unknown;
      lng?: unknown;
      clientIsProvince?: unknown;
    } = {}
  ) {
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

    // Configuración de precios/envío (markup global + envío a provincia).
    const pricing = strapi.service("api::pricing-setting.pricing-setting") as {
      getSettings: () => Promise<{
        markupPercent: number;
        provinceShippingCost: number;
        scCenterLat: number;
        scCenterLng: number;
        scRadiusKm: number;
      }>;
      isProvince: (s: unknown, lat: unknown, lng: unknown) => boolean | null;
    };
    const settings = await pricing.getSettings();
    const markupFactor = 1 + Number(settings.markupPercent || 0) / 100;
    const round2 = (n: number) => Math.round(n * 100) / 100;

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
      // Precio cobrado = base × markup (invisible para el cliente).
      const price = round2((Number(product.price) || 0) * markupFactor);
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
    subtotal = round2(subtotal);

    // Envío a provincia: solo para delivery fuera de Santa Cruz.
    let shippingCost = 0;
    if (opts.deliveryMethod === "delivery") {
      const verified = pricing.isProvince(settings, opts.lat, opts.lng);
      const isProvince =
        verified !== null ? verified : Boolean(opts.clientIsProvince);
      if (isProvince) shippingCost = round2(Number(settings.provinceShippingCost) || 0);
    }

    const total = round2(subtotal + shippingCost);

    return { items: verifiedItems, subtotal, shippingCost, total };
  }
}));
