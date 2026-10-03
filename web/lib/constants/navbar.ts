/**
 * Static navbar configuration. Used to avoid API calls for global nav data.
 * Update this file when nav items or logo need to change.
 */

/** Label key in the `nav.items` messages. */
export type NavItemKey = "products" | "howItWorks" | "faq" | "about" | "contact";

export interface NavItem {
  /** Unprefixed internal path; the locale prefix is added by the link. */
  URL: string;
  labelKey: NavItemKey;
  target?: string;
}

export interface NavbarLogo {
  image?: {
    url: string;
    alternativeText?: string;
  };
  imageDark?: {
    url: string;
    alternativeText?: string;
  };
}

/** Public path for logo (from /public) or full URL */
const LOGO_SRC = "/logo.png";

export const NAVBAR_ITEMS: NavItem[] = [
  { URL: "/", labelKey: "products" },
  { URL: "/how-it-works", labelKey: "howItWorks" },
  { URL: "/faq", labelKey: "faq" },
  { URL: "/about", labelKey: "about" },
  { URL: "/contact", labelKey: "contact" }
];

export const NAVBAR_LOGO: NavbarLogo = {
  image: { url: LOGO_SRC, alternativeText: "Iris Natural cosmética" },
  imageDark: { url: LOGO_SRC, alternativeText: "Iris Natural cosmética" }
};
