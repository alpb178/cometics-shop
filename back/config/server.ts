export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'http://localhost:1337'),
  // Strapi 5 lee `server.proxy.koa` (no `server.proxy`). En Render el TLS
  // termina en el proxy y llega HTTP a la app; con `koa: true` Koa confía en
  // `X-Forwarded-Proto: https` y `request.secure` pasa a true, evitando el
  // error "Cannot send secure cookie over unencrypted connection" al setear
  // la cookie de sesión (secure en producción) durante el OAuth de Google.
  proxy: { koa: true },
  app: {
    keys: env.array('APP_KEYS') || ["tobemodified1", "tobemodified2"],
  },
});
