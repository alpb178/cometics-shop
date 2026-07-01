/**
 * Rutas de page-visit.
 *
 * Solo se exponen endpoints custom (no el CRUD por defecto):
 *   - POST /page-visits/track  público (auth:false), lo usa el storefront.
 *   - GET  /page-visits/stats  protegido; requiere el permiso en el rol admin
 *     y además `ensureStaff` en el controller.
 */
export default {
  routes: [
    {
      method: "POST",
      path: "/page-visits/track",
      handler: "page-visit.track",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/page-visits/stats",
      handler: "page-visit.stats",
    },
    {
      method: "GET",
      path: "/page-visits/top",
      handler: "page-visit.top",
    },
  ],
};
