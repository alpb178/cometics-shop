/**
 * payment-info controller
 */

import { factories } from "@strapi/strapi";
import { ensureStaff } from "../../../utils/staff";

export default factories.createCoreController(
  "api::payment-info.payment-info",
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
