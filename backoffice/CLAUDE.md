# CLAUDE.md — backoffice

Panel de administración (Next.js 15 App Router + TS + Tailwind) que consume la
API REST del Strapi en `../back`. Sigue el flujo de trabajo del `CLAUDE.md` raíz.

## Comandos

```bash
npm run dev          # dev server en :3001
npm run build        # build de producción
npm run type-check   # tsc --noEmit
npm run lint
```

## Convenciones

- **Server Components por defecto**; añade `"use client"` sólo cuando haga falta
  estado/interacción.
- Las lecturas a Strapi viven en `lib/data.ts`; las escrituras se hacen vía
  **Server Actions** en `app/(dashboard)/<sección>/actions.ts`.
- El cliente Strapi (`lib/strapi.ts`) es **server-only** y adjunta el JWT de la
  cookie de sesión (`lib/session.ts`).
- Las subidas de ficheros usan `uploadFiles()` → `/api/upload`, y luego se pasan
  los ids de media al crear/actualizar la entidad.
- Strapi v5: las escrituras afectan al **borrador**. Para publicar productos se
  usan rutas custom (`/products/:documentId/publish|unpublish`) definidas en
  `../back/src/api/product`.
- Las rutas están protegidas por `middleware.ts` (redirige a `/login` sin sesión).

## Datos / tipos

Los tipos de las entidades están en `lib/types.ts` y reflejan los content-types
de Strapi (Strapi v5 devuelve atributos aplanados, no dentro de `attributes`).
