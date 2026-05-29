/**
 * product controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::product.product',
  ({ strapi }) => ({
    // Publica un producto (usado por el backoffice).
    async publish(ctx) {
      const { documentId } = ctx.params;
      const result = await strapi
        .documents('api::product.product')
        .publish({ documentId });
      ctx.body = { data: result };
    },

    // Despublica un producto (vuelve a borrador).
    async unpublish(ctx) {
      const { documentId } = ctx.params;
      const result = await strapi
        .documents('api::product.product')
        .unpublish({ documentId });
      ctx.body = { data: result };
    },
  })
);
