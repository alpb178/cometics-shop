/**
 * Static navbar configuration. Used to avoid API calls for global nav data.
 * Update this file when nav items or logo need to change.
 */

export interface NavItem {
  URL: string;
  text: string;
  target?: string;
  children?: { URL: string; text: string; target?: string }[];
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
  { URL: "/", text: "Productos" },
  { URL: "/how-it-works", text: "¿Cómo funciona?" },
  { URL: "/faq", text: "Preguntas Frecuentes" },
  { URL: "/about", text: "¿Quiénes Somos?" },
  { URL: "/contact", text: "Contactos" }
];

export const NAVBAR_LOGO: NavbarLogo = {
  image: { url: LOGO_SRC, alternativeText: "Iris Natural cosmética" },
  imageDark: { url: LOGO_SRC, alternativeText: "Iris Natural cosmética" }
};
