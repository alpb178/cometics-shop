/**
 * address controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::address.address",
  ({ strapi }) => ({
    async create(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();
      ctx.request.body.data = { ...(ctx.request.body.data || {}), user: user.id };
      return await super.create(ctx);
    },

    async find(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();
      ctx.query.filters = {
        ...(ctx.query.filters || {}),
        user: user.id
      };
      return await super.find(ctx);
    },

    async findOne(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();
      const { id } = ctx.params;
      const entity = await strapi.entityService.findOne(
        "api::address.address",
        id,
        { populate: { user: true } }
      );
      if (!entity || (entity as any).user?.id !== user.id) {
        return ctx.notFound();
      }
      return await super.findOne(ctx);
    },

    async update(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();
      const { id } = ctx.params;
      const entity = await strapi.entityService.findOne(
        "api::address.address",
        id,
        { populate: { user: true } }
      );
      if (!entity || (entity as any).user?.id !== user.id) {
        return ctx.notFound();
      }
      return await super.update(ctx);
    },

    async delete(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();
      const { id } = ctx.params;
      const entity = await strapi.entityService.findOne(
        "api::address.address",
        id,
        { populate: { user: true } }
      );
      if (!entity || (entity as any).user?.id !== user.id) {
        return ctx.notFound();
      }
      return await super.delete(ctx);
    }
  })
);
