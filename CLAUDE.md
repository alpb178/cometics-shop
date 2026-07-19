# CLAUDE.md — Iris Natural

## Flujo de trabajo obligatorio

Antes de cualquier cambio en este repo, sigue el flujo definido en [`FLUJO-TRABAJO-DEVS.md`](./FLUJO-TRABAJO-DEVS.md). Reglas no negociables:

- **Nunca** hacer push directo a `main` ni a `develop`. Están protegidas.
- Todo cambio sale de una rama `feature/*`, `fix/*`, `chore/*` creada desde `develop`.
- PRs van **siempre** primero a `develop` (staging). Solo de `develop` → `main` para producción.
- Usar **Squash and merge** al mergear PRs.
- Convención de commits: `feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`.
- PRs pequeños y enfocados — una sola cosa por PR.

## Crear una rama nueva

```bash
git checkout develop
git pull origin develop
git checkout -b feature/nombre-descriptivo
```

Nombres descriptivos (`feature/add-user-profile-images`), nunca genéricos (`feature/cambios`).

## Abrir un PR

Cuando el usuario pida abrir un PR, sigue la **Opción A** de `FLUJO-TRABAJO-DEVS.md`:

1. `git diff develop...HEAD` para analizar los cambios.
2. Leer `.github/PULL_REQUEST_TEMPLATE.md` (si existe) y rellenarlo con contenido real.
3. `gh pr create --base develop --assignee @me` con título y cuerpo generados.
4. Recordar al usuario asignar revisor desde GitHub.

PRs a `main` solo cuando el usuario lo pida explícitamente y el cambio ya esté validado en `develop`.

## Estructura del repo

- `front/` — Next.js (TypeScript), storefront
- `api/` — NestJS 10 + Prisma (reemplazó al backend Strapi en julio de 2026)
- `backoffice/` — Next.js, panel de administración
- `mobile/` — React Native (Expo)

Cada subcarpeta tiene su propio `CLAUDE.md` con detalles específicos del stack.
