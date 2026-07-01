/**
 * social-network controller
 */

import { factories } from '@strapi/strapi'
import { ensureStaff } from '../../../utils/staff';

export default factories.createCoreController(
  'api::social-network.social-network',
  () => ({
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
    }
  })
);
