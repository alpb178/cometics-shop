// CorpSC Group companies shown as "sites of interest" on the home page. Single,
// editable source. Iris Natural does NOT list itself; Tu Chamba appears in its
// place (each group site links to its siblings).

export interface Company {
  slug: string;
  name: string;
  description: string;
  // Short description shown next to the link in the ticker (the long one
  // doesn't fit in the strip).
  tagline: string;
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
    description:
      "Crear tu web, app a tu medida con los mejores precios.",
    tagline: "Convertimos tus ideas en productos digitales",
    accent: "#1668e3",
    url: "https://corpsc.com",
    image: "/empresas/corpsc-destacada.jpg",
    background: "#102136",
  },
  {
    slug: "dando-muela",
    name: "Dando Muela",
    description:
      "App para conectar con personas. Descárgala y empieza a chatear.",
    tagline: "Conoce gente y chatea",
    accent: "#a78bfa",
    url: "https://dandomuela.com",
    image: "/empresas/dando-muela-destacada.jpg",
    background: "#111827",
  },
  {
    slug: "tu-chamba",
    name: "Tu Chamba",
    description:
      "El portal boliviano para encontrar y publicar empleos de forma rápida y segura.",
    tagline: "Empleos en Bolivia",
    accent: "#00b473",
    url: "https://tu-chamba.corpsc.com",
    image: "/empresas/tu-chamba-destacada.jpg",
    background: "#004ac6",
  },
  {
    slug: "invoices",
    name: "Invoices",
    description:
      "Portal para generar y gestionar tus facturas de forma rápida y sencilla.",
    tagline: "Factura en PDF en minutos",
    accent: "#2dd4bf",
    url: "https://invoices.corpsc.com/",
    image: "/empresas/invoices-destacada.png",
    background: "#0f766e",
  },
];
