import type { Core } from "@strapi/strapi";
import { seedAdminUser } from "./seeds/admin-user";
import { seedPermissions } from "./seeds/permissions";
import { seedGoogleProvider } from "./seeds/google-provider";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    // Application initialization
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    // Seeder: permisos del rol "authenticated" que usa el backoffice.
    await seedPermissions(strapi);
    // Seeder: usuario staff por defecto para el backoffice.
    await seedAdminUser(strapi);
    // Seeder: proveedor OAuth de Google (storefront).
    await seedGoogleProvider(strapi);
  },
};
