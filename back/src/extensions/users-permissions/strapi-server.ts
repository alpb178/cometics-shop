import { ensureStaff } from "../../utils/staff";

/**
 * Extensión del plugin users-permissions.
 *
 * El rol "admin" necesita el permiso `plugin::users-permissions.user.find` para
 * poder popular la relación `user` en las órdenes desde el backoffice (ver
 * `src/seeds/permissions.ts` y el visitor `throw-restricted-relations` de Strapi).
 *
 * Pero ese permiso también habilita el listado directo `GET /api/users` (y
 * `GET /api/users/:id`). Para que ningún no-staff pueda listar usuarios (aunque
 * en el futuro se le conceda el permiso a otro rol), restringimos esas acciones
 * a staff. La populación de relaciones NO pasa por estos controllers, así que las
 * órdenes siguen mostrando el usuario correctamente.
 *
 * `create` se expone al backoffice para dar de alta usuarios staff (rol "admin").
 * Se restringe a staff igual que las lecturas y se fuerza `confirmed: true` por
 * defecto para que el usuario creado pueda iniciar sesión sin confirmación por
 * email. La contraseña la hashea `users-permissions` al crear.
 */
export default (plugin: any) => {
  const originalFind = plugin.controllers.user.find;
  const originalFindOne = plugin.controllers.user.findOne;
  const originalCreate = plugin.controllers.user.create;

  plugin.controllers.user.find = async (ctx: any) => {
    if (!ensureStaff(ctx)) return;
    return originalFind(ctx);
  };

  plugin.controllers.user.findOne = async (ctx: any) => {
    if (!ensureStaff(ctx)) return;
    return originalFindOne(ctx);
  };

  plugin.controllers.user.create = async (ctx: any) => {
    if (!ensureStaff(ctx)) return;
    // `confirmed` por defecto true; el body del backoffice puede sobrescribirlo.
    ctx.request.body = { confirmed: true, ...(ctx.request.body || {}) };
    return originalCreate(ctx);
  };

  return plugin;
};
