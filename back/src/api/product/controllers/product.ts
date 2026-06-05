/**
 * product controller
 */

import { factories } from '@strapi/strapi';
import { ensureStaff } from '../../../utils/staff';

export default factories.createCoreController(
  'api::product.product',
  ({ strapi }) => ({
    async create(ctx) {
      if (!ensureStaff(ctx)) return;
      return await super.create(ctx);
    },

    async update(ctx) {
      if (!ensureStaff(ctx)) return;
      return await super.update(ctx);
    },

    async delete(ctx) {
      if (!ensureStaff(ctx)) return;
      return await super.delete(ctx);
    },

    // Publica un producto (usado por el backoffice).
    async publish(ctx) {
      if (!ensureStaff(ctx)) return;
      const { documentId } = ctx.params;
      const result = await strapi
        .documents('api::product.product')
        .publish({ documentId });
      ctx.body = { data: result };
    },

    // Despublica un producto (vuelve a borrador).
    async unpublish(ctx) {
      if (!ensureStaff(ctx)) return;
      const { documentId } = ctx.params;
      const result = await strapi
        .documents('api::product.product')
        .unpublish({ documentId });
      ctx.body = { data: result };
    },
  })
);
