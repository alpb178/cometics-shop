// Empresas del Grupo CorpSC que se muestran como "sitios de interés" en la
// home. Fuente única, editable. Iris Natural NO se lista a sí misma; en su
// lugar figura Tu Chamba (cada sitio del grupo enlaza a sus hermanos).

export interface Company {
  slug: string;
  name: string;
  description: string;
  url: string;
  // Imagen destacada en /public/empresas.
  image: string;
  // Color de fondo mientras carga la imagen (evita un flash en blanco).
  background: string;
}

export const GROUP_COMPANIES: Company[] = [
  {
    slug: "corpsc",
    name: "CorpSC",
    description:
      "Crear tu web, app a tu medida con los mejores precios.",
    url: "https://corpsc.com",
    image: "/empresas/corpsc-destacada.jpg",
    background: "#102136",
  },
  {
    slug: "dando-muela",
    name: "Dando Muela",
    description:
      "App para conectar con personas. Descárgala y empieza a chatear.",
    url: "https://dandomuela.com",
    image: "/empresas/dando-muela-destacada.jpg",
    background: "#111827",
  },
  {
    slug: "tu-chamba",
    name: "Tu Chamba",
    description:
      "El portal boliviano para encontrar y publicar empleos de forma rápida y segura.",
    url: "https://tu-chamba.corpsc.com",
    image: "/empresas/tu-chamba-destacada.jpg",
    background: "#004ac6",
  },
  {
    slug: "invoices",
    name: "Invoices",
    description:
      "Portal para generar y gestionar tus facturas de forma rápida y sencilla.",
    url: "https://invoices.corpsc.com/",
    image: "/empresas/invoices-destacada.png",
    background: "#0f766e",
  },
];
