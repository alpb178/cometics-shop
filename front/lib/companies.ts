// CorpSC Group companies shown as "sites of interest" on the home page. Single,
// editable source. Iris Natural does NOT list itself; Tu Chamba appears in its
// place (each group site links to its siblings).

/** Also the key of the company's copy in `home.companies` (description and
 * the short ticker tagline, which are translated). */
export type CompanySlug = "corpsc" | "dando-muela" | "tu-chamba" | "invoices";

export interface Company {
  slug: CompanySlug;
  name: string;
  // Brand accent in the ticker. `background` is not reused because that is the
  // screenshot's color (almost black for several brands) and the dot would not
  // be visible on the strip's navy blue.
  accent: string;
  url: string;
  // Featured image in /public/empresas.
  image: string;
  // Background color while the image loads (avoids a white flash).
  background: string;
}

export const GROUP_COMPANIES: Company[] = [
  {
    slug: "corpsc",
    name: "CorpSC",
    accent: "#1668e3",
    url: "https://corpsc.com",
    image: "/empresas/corpsc-destacada.jpg",
    background: "#102136",
  },
  {
    slug: "dando-muela",
    name: "Dando Muela",
    accent: "#a78bfa",
    url: "https://dandomuela.com",
    image: "/empresas/dando-muela-destacada.jpg",
    background: "#111827",
  },
  {
    slug: "tu-chamba",
    name: "Tu Chamba",
    accent: "#00b473",
    url: "https://tu-chamba.corpsc.com",
    image: "/empresas/tu-chamba-destacada.jpg",
    background: "#004ac6",
  },
  {
    slug: "invoices",
    name: "Invoices",
    accent: "#2dd4bf",
    url: "https://invoices.corpsc.com/",
    image: "/empresas/invoices-destacada.png",
    background: "#0f766e",
  },
];
