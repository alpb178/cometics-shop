# CLAUDE.md — backoffice

Panel de administración (Next.js 15 App Router + TS + Tailwind) que consume la
API NestJS en `../api` (compatible con el contrato Strapi v5 que este panel
siempre usó). Sigue el flujo de trabajo del `CLAUDE.md` raíz.

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
- Productos: **una sola versión** por producto (se eliminó el draft & publish
  heredado de Strapi). Las ediciones se guardan en sitio y la tienda las ve al
  instante; la visibilidad en tienda la controla el flag `visible` (no hay
  publicar/despublicar). Ver `../api/src/products`.
- Las rutas están protegidas por `middleware.ts` (redirige a `/login` sin sesión).
- **Kit de UI compartido** (usar siempre en listados, no reinventar):
  `components/ui.tsx` (`DataTable`, `Badge`, `IconButton`, `SelectCheckbox`,
  `SearchInput`, `FilterSelect`, `Modal`, `ConfirmDialog`),
  `components/pagination.tsx` y el hook `lib/use-selection.ts` (selección por
  lotes que persiste entre páginas/filtros). Patrón de referencia:
  `app/(dashboard)/products/products-table.tsx` — búsqueda + filtros +
  paginación client-side sobre datos cargados por el Server Component,
  mutaciones vía Server Actions con `useTransition` + `router.refresh()`,
  confirmaciones con `ConfirmDialog` (nunca `window.confirm`).

## Datos / tipos

Los tipos de las entidades están en `lib/types.ts` y reflejan los content-types
de Strapi (Strapi v5 devuelve atributos aplanados, no dentro de `attributes`).
