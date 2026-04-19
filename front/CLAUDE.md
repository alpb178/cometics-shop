# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Iris Natural — e-commerce website built with **Next.js 15** (App Router), **React 18**, **TypeScript** (strict mode), and **Strapi** as the headless CMS. Deployed on Vercel. The site is a bilingual (English/Spanish) product catalog with WhatsApp-based ordering for a business in Santa Cruz de la Sierra, Bolivia.

## Commands

```bash
npm run dev          # Start dev server (port 3000)
npm run build        # Production build
npm run lint         # ESLint (next/core-web-vitals + unused-imports plugin)
npm run tsc          # TypeScript check (--noEmit)
npm run clean        # Delete .next + node_modules, reinstall
```

**Package manager:** pnpm (pnpm-lock.yaml). `.npmrc` sets `legacy-peer-deps=true`. Node >=22 required.

## Architecture

### Routing

Next.js App Router with `[locale]` dynamic segment and `(marketing)` route group:

```
app/[locale]/(marketing)/                   # Home
app/[locale]/(marketing)/products/[slug]/    # Product detail
app/[locale]/(marketing)/about|contact|faq|how-it-works|policy-privacy/
```

Locale detection via `next-intl` middleware (locales: `en`, `es`; prefix strategy: `"never"` — no `/en/` or `/es/` in URLs). Configuration in `i18n/routing.ts`, translations in `locales/{en,es}/common.json`.

### Data Fetching — Strapi CMS

Two fetch paths for Strapi REST API (`NEXT_PUBLIC_API_URL`):

- **Server Components** — `lib/strapi/fetchContentType.ts` (uses `draftMode()`, `cache: "no-store"`)
- **Client Components** — `lib/strapi/fetchContentTypeClient.ts` + `hooks/useStrapiData.ts` hook

Both use `qs` for query serialization. `spreadStrapiData()` unwraps Strapi's `{ data: [...] }` envelope.

### State Management — React Context

Provider chain in `app/providers.tsx`:

- **AppContext** (`context/app-context.tsx`) — global CMS data (navbar, footer, logo)
- **CartContext** (`context/cart-context.tsx`) — shopping cart (in-memory, no persistence)
- **ThemeContext** (`context/theme-context.tsx`) — light/dark mode (forces light on mobile <1024px)
- **SlugContext** (`app/context/SlugContext.tsx`) — localized slug storage

### Component Organization

- `components/` — reusable UI and feature components (navbar, footer, hero, cards, forms, icons, etc.)
- `components/ui/` — animated/visual components (globe, sparkles, canvas-reveal) and font definitions
- `container/` — page-level compositions (e.g., `container/products/list/`, `container/products/product/`)
- `definitions/` — TypeScript interfaces (Product, Category, Image)

### Styling

**Tailwind CSS 3.4** with SCSS (`styles/globals.scss`). Class-based dark mode. CSS variable color system (primary, secondary, accent, etc.) defined in `:root` and `.dark`. Fonts: Inter (body) + Poppins (headers) via `next/font/google`. Animations via `framer-motion` and `tailwindcss-animate`.

Use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) for conditional class names.

### Key Libraries

- **3D/Graphics:** three.js, @react-three/fiber, three-globe
- **Animation:** framer-motion, next-view-transitions, tsparticles
- **UI:** @headlessui/react, lucide-react, @tabler/icons-react
- **Forms:** react-hook-form
- **Maps:** maplibre-gl, @vis.gl/react-maplibre

## Code Conventions

- **Formatting:** Prettier — double quotes, no trailing commas
- **Imports:** ESLint enforces no unused imports (unused vars prefixed with `_` are allowed)
- **Path alias:** `@/*` maps to project root
- **Border radius:** Default is 0 (square-first design)
- **Remote images:** Configured for Cloudinary and the Strapi host in `next.config.mjs`
