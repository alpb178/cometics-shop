import type account from "./locales/es/account.json";
import type auth from "./locales/es/auth.json";
import type cart from "./locales/es/cart.json";
import type checkout from "./locales/es/checkout.json";
import type common from "./locales/es/common.json";
import type errors from "./locales/es/errors.json";
import type footer from "./locales/es/footer.json";
import type home from "./locales/es/home.json";
import type nav from "./locales/es/nav.json";
import type pages from "./locales/es/pages.json";
import type products from "./locales/es/products.json";
import type seo from "./locales/es/seo.json";
import type { routing } from "./i18n/routing";

// Type-checks message keys (`t("cart.title")`) and locales against the Spanish
// catalogue; scripts/check-messages.mjs keeps the English and Portuguese ones in sync.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: {
      account: typeof account;
      auth: typeof auth;
      cart: typeof cart;
      checkout: typeof checkout;
      common: typeof common;
      errors: typeof errors;
      footer: typeof footer;
      home: typeof home;
      nav: typeof nav;
      pages: typeof pages;
      products: typeof products;
      seo: typeof seo;
    };
  }
}
