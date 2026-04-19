# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Iris Natural Cosméticas — a React Native e-commerce mobile app for a Bolivian cosmetics brand. Built with Expo SDK 54, React 19, and TypeScript. The backend is a Strapi CMS instance.

## Commands

| Task | Command |
|------|---------|
| Start dev server | `npx expo start` |
| Run on Android | `npx expo run:android` |
| Run on iOS | `npx expo run:ios` |
| Run on web | `npx expo start --web` |
| Lint | `npx expo lint` |

No test framework is configured.

## Architecture

### Navigation (3-level nesting)

```
Stack (app/_layout.tsx)
  └── Drawer (app/(drawer)/_layout.tsx)
        └── Tabs (app/(drawer)/(tabs)/_layout.tsx)
              ├── index (Home/Products) — visible tab
              ├── cart — visible tab with badge
              ├── faq, how-it-works, about, contact, location — drawer-only (hidden from tab bar)
              └── products/[slug]/ — stack push for product detail
```

The root layout wraps everything in `ThemeProvider` + `CartProvider`. The drawer has sectioned menu items defined in `components/drawer/drawer-items.tsx`.

### Data Layer

- **SWR** for all server state (products, pages). Hooks in `hooks/` (`useProducts`, `useProduct`, `useDynamicContent`).
- **Strapi CMS** backend at `EXPO_PUBLIC_API_URL` (defaults to `https://shop-strapi-cms.onrender.com`). The fetcher in `lib/api/fetcher.ts` includes a `spreadStrapiData` utility to unwrap Strapi's nested response format.
- **Dynamic zones**: CMS pages use a `dynamic_zone` array where each item has a `__component` field. The `DynamicZone` component (`components/dynamic-zone/dynamic-zone.tsx`) maps these to React components.

### State Management

- **Cart**: React Context in `contexts/cart-context.tsx` — the canonical cart with delivery option support. Import `useCart` from `@/contexts/cart-context`, NOT from `@/hooks/use-cart` (the hooks version is a legacy duplicate without delivery options).
- **UI state**: Local `useState`/`useCallback`.

### Path Alias

`@/*` maps to the project root (configured in `tsconfig.json`). All imports use this alias.

### Styling

- `StyleSheet.create()` throughout — no CSS-in-JS library, no Tailwind/NativeWind.
- Light/dark theming via `useColorScheme()` + `Colors` from `constants/theme.ts`.
- Platform-specific fonts via `Fonts` from the same theme file.
- Brand greens: `#22C55E` (drawer active), `#4CAF50` (product cards/buttons), `#25D366` (WhatsApp).

### Key Patterns

- **Screen UI separation**: Route files in `app/(drawer)/(tabs)/` are thin wrappers; actual screen implementations live in `app/ui/`.
- **Skeleton loading**: Each screen type has a matching skeleton component in `components/skeleton/`.
- **Parallax scroll**: `components/parallax-scroll-view.tsx` uses Reanimated for animated header scrolling.
- **Platform-specific files**: Icon components use `.ios.tsx` suffix for SF Symbols vs MaterialIcons on Android.
- **Barrel exports**: `components/index.ts` and `hooks/index.ts` re-export their contents.

### Build Config

- New Architecture enabled (`newArchEnabled: true`)
- React Compiler enabled (`experiments.reactCompiler: true`)
- Typed routes enabled (`experiments.typedRoutes: true`)
- Android edge-to-edge enabled

## Known Issues

- `app/ui/cart/index.tsx` contains unresolved merge conflict markers.
- Duplicate route files: `how-it-work.tsx` and `how-it-works.tsx` at the tab level.
- `contact.tsx` screen is a placeholder (renders only `<Text>Contact</Text>`).
- Currency is hardcoded to BOB in `ProductCard` despite the API returning a `currency` field.
