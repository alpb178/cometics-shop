import type { Core } from "@strapi/strapi";

/**
 * Seeder de un usuario staff del backoffice (plugin users-permissions).
 *
 * Este usuario inicia sesión vía `POST /api/auth/local` (el mismo flujo que usa
 * el backoffice). Se le asigna el rol "admin" (creado por `seedPermissions`), que
 * `isStaffUser` (ver `src/utils/staff.ts`) reconoce como staff. `STAFF_EMAILS`
 * sigue funcionando como override.
 *
 * Es idempotente: si ya existe un usuario con ese email no hace nada.
 *
 * Variables de entorno (todas opcionales, con valores por defecto para dev):
 *   SEED_ADMIN_EMAIL     — email del usuario (default: admin@irisnatural.com)
 *   SEED_ADMIN_PASSWORD  — contraseña (default: ChangeMe1234!)
 *   SEED_ADMIN_USERNAME  — username (default: admin)
 */

const USER_UID = "plugin::users-permissions.user";
const ROLE_UID = "plugin::users-permissions.role";

const DEFAULT_EMAIL = "admin@irisnatural.com";
const DEFAULT_PASSWORD = "ChangeMe1234!";
const DEFAULT_USERNAME = "admin";

export async function seedAdminUser(strapi: Core.Strapi): Promise<void> {
  const email = (process.env.SEED_ADMIN_EMAIL || DEFAULT_EMAIL)
    .trim()
    .toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || DEFAULT_PASSWORD;
  const username = process.env.SEED_ADMIN_USERNAME || DEFAULT_USERNAME;

  if (password.length < 6) {
    strapi.log.error(
      "[seed:admin-user] SEED_ADMIN_PASSWORD debe tener al menos 6 caracteres. Se omite el seeder.",
    );
    return;
  }

  // Rol: preferimos "admin" (creado por seedPermissions); si no, "staff" o
  // "authenticated" como respaldo.
  const adminRole = await strapi.db
    .query(ROLE_UID)
    .findOne({ where: { type: "admin" } });
  const staffRole = await strapi.db
    .query(ROLE_UID)
    .findOne({ where: { type: "staff" } });
  const authenticatedRole = await strapi.db
    .query(ROLE_UID)
    .findOne({ where: { type: "authenticated" } });

  const role = adminRole || staffRole || authenticatedRole;
  if (!role) {
    strapi.log.error(
      '[seed:admin-user] No se encontró un rol "admin", "staff" ni "authenticated". Se omite el seeder.',
    );
    return;
  }

  // Si ya existe: no lo recreamos, pero SÍ garantizamos que esté en el rol admin
  // (auto-reparación por si una migración previa lo dejó en otro rol).
  const existing = await strapi.db
    .query(USER_UID)
    .findOne({ where: { email }, populate: ["role"] });

  if (existing) {
    if (existing.role?.id !== role.id) {
      await strapi.db
        .query(USER_UID)
        .update({ where: { id: existing.id }, data: { role: role.id } });
      strapi.log.info(
        `[seed:admin-user] Usuario "${email}" reasignado al rol "${role.type}".`,
      );
    } else {
      strapi.log.info(
        `[seed:admin-user] El usuario "${email}" ya existe con rol "${role.type}". Nada que hacer.`,
      );
    }
    return;
  }

  // `user.add` hashea la contraseña automáticamente (ensureHashedPasswords).
  await strapi
    .plugin("users-permissions")
    .service("user")
    .add({
      username,
      email,
      password,
      provider: "local",
      confirmed: true,
      blocked: false,
      role: role.id,
    });

  strapi.log.info(
    `[seed:admin-user] Usuario staff creado: "${email}" (rol: ${role.type}).`,
  );

  // Aviso si el email no está reconocido como staff.
  const staffEmails = (process.env.STAFF_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (
    role.type !== "admin" &&
    role.type !== "staff" &&
    !staffEmails.includes(email)
  ) {
    strapi.log.warn(
      `[seed:admin-user] "${email}" NO está en STAFF_EMAILS ni tiene rol "admin": ` +
        "no podrá operar el backoffice. Añádelo a STAFF_EMAILS en .env.",
    );
  }

  if (password === DEFAULT_PASSWORD) {
    strapi.log.warn(
      "[seed:admin-user] Se usó la contraseña por defecto. Cámbiala vía " +
        "SEED_ADMIN_PASSWORD o desde el perfil tras el primer login.",
    );
  }
}
