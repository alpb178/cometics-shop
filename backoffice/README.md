# Iris Natural — Backoffice

Panel de administración para gestionar la tienda: subir fotos y detalles de
productos, categorías, pedidos y contenido. Es una app **Next.js 15 (App
Router)** que consume la API REST del Strapi del monorepo (`../back`).

## Stack

- Next.js 15 + React 18 + TypeScript
- Tailwind CSS
- Autenticación contra Strapi (`/api/auth/local`, JWT en cookie httpOnly)

## Puesta en marcha

```bash
cd backoffice
cp .env.example .env.local        # ajusta NEXT_PUBLIC_STRAPI_URL
npm install
npm run dev                       # http://localhost:3001
```

Necesitas el backend Strapi corriendo (`cd ../back && npm run develop`).

## Variables de entorno

| Variable                 | Descripción                          |
| ------------------------ | ------------------------------------ |
| `NEXT_PUBLIC_STRAPI_URL` | URL del backend Strapi (ej. `http://localhost:1337`) |

## Acceso

El login usa **users-permissions** de Strapi (`/api/auth/local`), igual que la
tienda. El usuario que entre al backoffice debe tener un rol con permisos de
lectura/escritura sobre: `product`, `category`, `order`, `faq`, `payment-info`,
`social-network` y `upload`.

En Strapi: **Settings → Users & Permissions → Roles → (rol del editor)** y marca
las acciones `find`, `findOne`, `create`, `update`, `delete` de esas colecciones,
`upload` del plugin Upload, y las acciones custom **`product.publish` /
`product.unpublish`**.

## Publicar / despublicar productos

La REST API estándar de Strapi v5 sólo lee borradores o publicados, pero no
permite publicar. Por eso el backend (`../back`) expone dos rutas custom:

- `POST /api/products/:documentId/publish`
- `POST /api/products/:documentId/unpublish`

El listado de productos usa `status=draft`, que en Strapi v5 devuelve **todos**
los documentos, y muestra una etiqueta Publicado/Borrador.

## Estructura

```
app/
  login/                  # pantalla de acceso
  api/auth/               # login / logout (cookie de sesión)
  (dashboard)/
    page.tsx              # resumen
    products/             # CRUD + subida de fotos + publicar
    categories/           # CRUD
    orders/               # listado, detalle, cambio de estado
    content/              # datos de pago, FAQ, redes
lib/                      # cliente Strapi, tipos, helpers, acceso a datos
components/               # sidebar, header, botones reutilizables
```
