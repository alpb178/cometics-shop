/**
 * Rutas custom para publicar / despublicar productos desde el backoffice.
 * Recuerda dar permiso a estas acciones en Settings → Roles del rol que use el panel.
 */

export default {
  routes: [
    {
      method: 'POST',
      path: '/products/:documentId/publish',
      handler: 'product.publish',
    },
    {
      method: 'POST',
      path: '/products/:documentId/unpublish',
      handler: 'product.unpublish',
    },
  ],
};
