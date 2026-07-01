import type { Core } from "@strapi/strapi";

/**
 * Seeder de roles y permisos de users-permissions.
 *
 * Define dos roles de aplicación además de los de Strapi (public/authenticated):
 *
 *   - "client": clientes del storefront (`front/`). Navegan el catálogo, crean y
 *     ven SUS pedidos y direcciones, y suben el comprobante de pago.
 *   - "admin":  personal del backoffice (`backoffice/`). Todo lo del cliente más
 *     la gestión de catálogo, pedidos y contenido, y `user.find` (necesario para
 *     popular la relación `user` en los pedidos).
 *
 * Además:
 *   - Marca "client" como rol por defecto del registro (`auth/register`).
 *   - Migra los usuarios que sigan en el rol "authenticated" (o sin rol): los
 *     emails en STAFF_EMAILS pasan a "admin", el resto a "client".
 *
 * En users-permissions un permiso está concedido por la simple EXISTENCIA de la
 * fila `{ action, role }`. Este seeder crea lo que falte; es idempotente.
 *
 * Nota de seguridad: solo se conceden escrituras (create/update/delete) para los
 * content-types cuyo controller protege esas acciones con `ensureStaff`.
 */

const ROLE_UID = "plugin::users-permissions.role";
const PERMISSION_UID = "plugin::users-permissions.permission";
const USER_UID = "plugin::users-permissions.user";

// Acciones básicas que todo usuario autenticado necesita (los roles nuevos no
// las traen por defecto, a diferencia del rol "authenticated").
const COMMON_AUTH = [
  "plugin::users-permissions.user.me",
  "plugin::users-permissions.auth.changePassword",
];

// Lecturas de catálogo y contenido. Las necesita también el cliente porque, una
// vez logueado, navega con SU rol (no con el rol "public").
const CATALOG_READ = [
  "api::product.product.find",
  "api::product.product.findOne",
  "api::category.category.find",
  "api::category.category.findOne",
  "api::faq.faq.find",
  "api::faq.faq.findOne",
  "api::social-network.social-network.find",
  "api::social-network.social-network.findOne",
  "api::payment-info.payment-info.find",
];

// Rol "client": storefront.
const CLIENT_ACTIONS = [
  ...COMMON_AUTH,
  ...CATALOG_READ,
  // Pedidos propios (el controller filtra find/findOne por usuario).
  "api::order.order.create",
  "api::order.order.find",
  "api::order.order.findOne",
  // Direcciones propias (el controller valida el dueño).
  "api::address.address.create",
  "api::address.address.find",
  "api::address.address.findOne",
  "api::address.address.update",
  "api::address.address.delete",
  // Subida del comprobante de pago.
  "plugin::upload.content-api.upload",
];

// Rol "admin": backoffice. Las mutaciones están protegidas por `ensureStaff`.
const ADMIN_ACTIONS = [
  ...COMMON_AUTH,
  ...CATALOG_READ,
  // Productos (incluye rutas custom publish/unpublish).
  "api::product.product.create",
  "api::product.product.update",
  "api::product.product.delete",
  "api::product.product.publish",
  "api::product.product.unpublish",
  // Categorías.
  "api::category.category.create",
  "api::category.category.update",
  "api::category.category.delete",
  // Pedidos (todos; find/findOne devuelven todo a staff en el controller).
  "api::order.order.create",
  "api::order.order.find",
  "api::order.order.findOne",
  "api::order.order.update",
  "api::order.order.delete",
  // Datos de pago (single type).
  "api::payment-info.payment-info.update",
  "api::payment-info.payment-info.delete",
  // FAQs.
  "api::faq.faq.create",
  "api::faq.faq.update",
  "api::faq.faq.delete",
  // Redes sociales (mutaciones protegidas por ensureStaff en su controller).
  "api::social-network.social-network.create",
  "api::social-network.social-network.update",
  "api::social-network.social-network.delete",
  // Direcciones: find/findOne para popular `shippingAddress` en pedidos.
  "api::address.address.find",
  "api::address.address.findOne",
  // Necesario para popular la relación `user` en los pedidos. El listado directo
  // `/api/users` queda restringido a staff mediante la extensión de
  // users-permissions (src/extensions/users-permissions/strapi-server.ts).
  "plugin::users-permissions.user.find",
  // Alta de usuarios staff desde el backoffice (POST /api/users). También
  // restringido a staff en la misma extensión.
  "plugin::users-permissions.user.create",
  // Necesario para que el backoffice pueda pedir `/api/users/me?populate=role`
  // (requireStaff / login). Popular la relación `role` exige este scope.
  "plugin::users-permissions.role.find",
  // KPI y sección de visitas del dashboard (GET /api/page-visits/stats, /top y
  // /sources). El registro de visitas (POST /page-visits/track) es público vía
  // auth:false, no necesita permiso de rol.
  "api::page-visit.page-visit.stats",
  "api::page-visit.page-visit.top",
  "api::page-visit.page-visit.sources",
  // Tabla de interacciones del backoffice (GET /store-events/recent). El
  // registro (POST /store-events/track) es público vía auth:false.
  "api::store-event.store-event.recent",
  // Subida de imágenes (comprobantes, imágenes de producto).
  "plugin::upload.content-api.upload",
];

// Rol "public": acciones de autenticación OAuth (Google) para visitantes
// anónimos. Son las que usa el flujo /connect/:provider y su callback.
const PUBLIC_ACTIONS = [
  "plugin::users-permissions.auth.connect",
  "plugin::users-permissions.auth.callback",
];

async function ensureRole(
  strapi: Core.Strapi,
  role: { name: string; type: string; description: string },
): Promise<{ id: number; type: string }> {
  const existing = await strapi.db
    .query(ROLE_UID)
    .findOne({ where: { type: role.type } });
  if (existing) return existing;

  const created = await strapi.db.query(ROLE_UID).create({ data: role });
  strapi.log.info(`[seed:roles] Rol "${role.type}" creado.`);
  return created;
}

async function grantActions(
  strapi: Core.Strapi,
  role: { id: number; type: string },
  actions: string[],
): Promise<void> {
  let created = 0;
  for (const action of actions) {
    const existing = await strapi.db
      .query(PERMISSION_UID)
      .findOne({ where: { action, role: role.id } });
    if (!existing) {
      await strapi.db
        .query(PERMISSION_UID)
        .create({ data: { action, role: role.id } });
      created += 1;
    }
  }
  strapi.log.info(
    `[seed:permissions] Rol "${role.type}": ${created} permiso(s) nuevo(s), ` +
      `${actions.length - created} ya existente(s).`,
  );
}

/** Marca "client" como rol por defecto para nuevos registros. */
async function setDefaultRole(strapi: Core.Strapi): Promise<void> {
  const store = strapi.store({ type: "plugin", name: "users-permissions" });
  const advanced = ((await store.get({ key: "advanced" })) || {}) as Record<
    string,
    unknown
  >;
  if (advanced.default_role !== "client") {
    await store.set({
      key: "advanced",
      value: { ...advanced, default_role: "client" },
    });
    strapi.log.info('[seed:roles] Rol por defecto del registro => "client".');
  }
}

/** Mueve usuarios de "authenticated" (o sin rol) a admin/client. Idempotente. */
async function migrateUsers(
  strapi: Core.Strapi,
  adminRoleId: number,
  clientRoleId: number,
): Promise<void> {
  const staffEmails = (process.env.STAFF_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const authRole = await strapi.db
    .query(ROLE_UID)
    .findOne({ where: { type: "authenticated" } });
  const authRoleId = authRole?.id;

  // Usuarios en "authenticated" o sin rol asignado.
  const users = await strapi.db.query(USER_UID).findMany({
    where: authRoleId
      ? { $or: [{ role: authRoleId }, { role: null }] }
      : { role: null },
    populate: ["role"],
  });

  let toAdmin = 0;
  let toClient = 0;
  for (const u of users) {
    const target = staffEmails.includes((u.email || "").toLowerCase())
      ? adminRoleId
      : clientRoleId;
    await strapi.db
      .query(USER_UID)
      .update({ where: { id: u.id }, data: { role: target } });
    if (target === adminRoleId) toAdmin += 1;
    else toClient += 1;
  }

  if (toAdmin || toClient) {
    strapi.log.info(
      `[seed:roles] Migrados ${toAdmin} usuario(s) a "admin" y ${toClient} a "client".`,
    );
  }
}

export async function seedPermissions(strapi: Core.Strapi): Promise<void> {
  const adminRole = await ensureRole(strapi, {
    name: "Admin",
    type: "admin",
    description: "Personal del backoffice (staff).",
  });
  const clientRole = await ensureRole(strapi, {
    name: "Client",
    type: "client",
    description: "Clientes del storefront.",
  });

  await grantActions(strapi, adminRole, ADMIN_ACTIONS);
  await grantActions(strapi, clientRole, CLIENT_ACTIONS);

  // Rol "public": acciones necesarias para el login OAuth (Google).
  const publicRole = await strapi.db
    .query(ROLE_UID)
    .findOne({ where: { type: "public" } });
  if (publicRole) {
    await grantActions(strapi, publicRole, PUBLIC_ACTIONS);
  }

  await setDefaultRole(strapi);
  await migrateUsers(strapi, adminRole.id, clientRole.id);
}
