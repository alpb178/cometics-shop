// Contenido estático del CMS (antes venía de la API vía dynamic zones).
// Se mantiene el aspecto visual reutilizando los componentes de render.

type StoryItem = {
  tittle: string;
  description: string;
  image?: { url: string };
};

type FormInput = {
  type: string;
  name: string;
  placeholder: string | null;
  label: string;
  required: boolean | null;
};

export const HOW_IT_WORKS: {
  heading: string;
  sub_heading: string;
  steps: { title: string; description: string }[];
} = {
  heading: "¿ Cómo funciona ?",
  sub_heading: "",
  steps: [
    {
      title: "Revisa nuestro catálogo",
      description:
        "Empieza explorando todos nuestros productos. Puedes ver fotos, descripciones, beneficios y precios para elegir lo que más te guste."
    },
    {
      title: "Agrega tus productos al carrito",
      description:
        "Cuando encuentres algo que te encante, simplemente añádelo al carrito. Puedes seleccionar uno o varios productos."
    },
    {
      title: "Elige cómo quieres recibir tu pedido",
      description:
        "Antes de confirmar, selecciona si prefieres:  Entrega a domicilio, o  Recoger tu pedido en nuestra sede."
    },
    {
      title: "Confirma tu pedido por WhatsApp",
      description:
        "Cuando estés listo, haz clic en el botón de WhatsApp. Allí nos enviarás tu lista de productos y podremos ayudarte directamente."
    },
    {
      title: "Recibe la cotización del envío (solo si elegiste domicilio)",
      description:
        "Si deseas entrega a domicilio, te calculamos el costo según tu ubicación y te enviamos el total a pagar."
    },
    {
      title: "Recibe la confirmación si vas a recoger tu pedido",
      description:
        "Si prefieres recogerlo, te confirmamos la dirección, el horario y la disponibilidad para que pases sin problema."
    },
    {
      title: "Realiza tu pago de manera sencilla",
      description:
        "Puedes pagar en efectivo o mediante código QR, según te resulte más cómodo."
    },
    {
      title: "Recibe tus productos",
      description:
        "Si elegiste domicilio, te llevamos tu pedido hasta donde estés.  Si elegiste recoger, te esperamos en nuestra sede con tu pedido listo."
    }
  ]
};

export const ABOUT_STORY: StoryItem[] = [
  {
    tittle: "¿ Quiénes somos  ?",
    description:
      "Somos un emprendimiento apasionado por la belleza natural saludable, creamos productos con activos 100% naturales. Contamos con un equipo de profesionales con experiencia y comprometidos con nuestros clientes , nos decicamos a elaborar productos que respetan , cuidan tu piel y el medio ambiente.",
    image: {
      url: "https://res.cloudinary.com/dqo4p3wa7/image/upload/v1765804164/Whats_App_Image_2025_12_15_at_09_08_34_e9897dd33e.jpg"
    }
  },
  {
    tittle: "Misión",
    description:
      "Producir y comercializar cosmética natural, artesanal y ecológica con ingredientes orgánicos y libres de crueldad animal, buscando satisfacer las necesidades de nuestros clientes,  con productos de belleza más sanos y sostenibles.",
    image: {
      url: "https://res.cloudinary.com/dqo4p3wa7/image/upload/v1765804442/Whats_App_Image_2025_12_15_at_09_08_34_2_d7ecb392d3.jpg"
    }
  },
  {
    tittle: "Visión",
    description:
      "Ser un referente en innovación y calidad de cosméticos naturales elaborados artesanalmente ,  ofreciendo soluciones efectivas y respetuosas con la salud y el medio ambiente , comunicar los valores de la marca a través de experiencias y contenido de valor, y utilizar estrategias de marketing digital para alcanzar a un público más amplio, incluso ofreciendo una tienda online con asesoría personalizada.",
    image: {
      url: "https://res.cloudinary.com/dqo4p3wa7/image/upload/v1765804479/Whats_App_Image_2025_12_15_at_09_08_34_1_a92cdfcefb.jpg"
    }
  }
];

export const POLICY_STORY: StoryItem[] = [
  {
    tittle: "¿Recopilamos información personal?",
    description:
      "No recopilamos información personal de nuestros clientes. No guardamos nombres, correos, teléfonos ni direcciones."
  },
  {
    tittle: "¿Qué información se analiza?",
    description:
      "Podemos analizar datos de navegación de manera anónima, como las páginas visitadas y el comportamiento en el sitio, únicamente para mejorar la experiencia y el funcionamiento de la web."
  },
  {
    tittle: "¿Cómo protegemos la información?",
    description:
      "Aunque no guardamos datos personales, tomamos medidas técnicas para mantener la seguridad de la información anónima y garantizar que tu experiencia de navegación sea segura."
  },
  {
    tittle: "¿Qué pasa si actualizamos esta política?",
    description:
      "Cualquier cambio será publicado en esta sección de la web. Te recomendamos revisarla periódicamente para estar al tanto de las actualizaciones."
  }
];

export const CONTACT: {
  heading: string;
  sub_heading: string;
  form: { inputs: FormInput[] };
  socialNetworks: { name: string; alias: string; link: { URL: string } }[];
} = {
  socialNetworks: [
    {
      name: "facebook",
      alias: "facebook",
      link: { URL: "https://www.facebook.com/share/17TNotEwBn/" }
    },
    {
      name: "instagram",
      alias: "instagram",
      link: {
        URL: "https://www.instagram.com/irisnaturalcosmetica_oficial?igsh=Nm5nOGFvOTFzbjNk"
      }
    },
    {
      name: "tiktok",
      alias: "tiktok",
      link: {
        URL: "https://www.tiktok.com/@irisnatural_cosmetica?_r=1&_t=ZM-91U9prI2xuC"
      }
    }
  ],
  heading: "Contacténos",
  sub_heading:
    "“Cada producto nace con un propósito claro, inspirado en una investigación dedicada sobre los beneficios que la naturaleza nos ofrece.”",
  form: {
    inputs: [
      {
        type: "text",
        name: "name",
        placeholder: null,
        label: "Nombre",
        required: true
      },
      {
        type: "email",
        name: "email",
        placeholder: null,
        label: "Correo electrónico",
        required: null
      },
      {
        type: "textarea",
        name: "comments",
        placeholder: null,
        label: "Comentarios",
        required: true
      },
      {
        type: "submit",
        name: "send",
        placeholder: null,
        label: "Contáctenos",
        required: null
      }
    ]
  }
};

export const FAQ_HEADING = "Preguntas Frecuentes";
