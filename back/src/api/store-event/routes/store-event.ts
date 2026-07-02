/**
 * Rutas de store-event.
 *
 * Solo endpoints custom (no el CRUD por defecto):
 *   - POST /store-events/track   público (auth:false), lo usa el storefront.
 *   - GET  /store-events/recent  protegido; requiere el permiso en el rol admin
 *     y además `ensureStaff` en el controller.
 */
export default {
  routes: [
    {
      method: "POST",
      path: "/store-events/track",
      handler: "store-event.track",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/store-events/recent",
      handler: "store-event.recent",
    },
  ],
};
