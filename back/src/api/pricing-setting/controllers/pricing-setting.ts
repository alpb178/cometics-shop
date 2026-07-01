/**
 * pricing-setting controller
 */

import { factories } from "@strapi/strapi";
import { ensureStaff } from "../../../utils/staff";

export default factories.createCoreController(
  "api::pricing-setting.pricing-setting",
  () => ({
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
