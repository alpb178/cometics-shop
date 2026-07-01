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
 */
export default (plugin: any) => {
  const originalFind = plugin.controllers.user.find;
  const originalFindOne = plugin.controllers.user.findOne;

  plugin.controllers.user.find = async (ctx: any) => {
    if (!ensureStaff(ctx)) return;
    return originalFind(ctx);
  };

  plugin.controllers.user.findOne = async (ctx: any) => {
    if (!ensureStaff(ctx)) return;
    return originalFindOne(ctx);
  };

  return plugin;
};
