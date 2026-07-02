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
      // La relación `user` no se puede fijar en el body vía content-API (Strapi
      // v5 la rechaza: "Invalid key user"). Se crea con el Document Service
      // asignando el dueño server-side, con whitelist de campos del cliente.
      const body = (ctx.request.body?.data || {}) as Record<string, unknown>;
      const ALLOWED = [
        "fullName",
        "phone",
        "line1",
        "line2",
        "city",
        "department",
        "ci",
        "notes",
        "isDefault",
      ];
      const data: Record<string, unknown> = { user: user.id };
      for (const key of ALLOWED) if (key in body) data[key] = body[key];

      const entity = await strapi
        .documents("api::address.address")
        .create({ data });
      const sanitized = await this.sanitizeOutput(entity, ctx);
      return this.transformResponse(sanitized);
    },

    async find(ctx) {
      const user = ctx.state.user;
      if (!user) return ctx.unauthorized();
      // SUS direcciones. No se inyecta el filtro `user` en ctx.query porque la
      // validación de query del content-API lo rechaza ("Invalid key user"); se
      // filtra en la capa de servicio (Document Service).
      const entities = await strapi.documents("api::address.address").findMany({
        filters: { user: { id: user.id } },
        sort: "createdAt:desc"
      });
      const sanitized = await this.sanitizeOutput(entities, ctx);
      return this.transformResponse(sanitized);
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
