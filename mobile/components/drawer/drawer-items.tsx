import { HOME_URL } from "@/lib/constant/route";

export const sharedItems = [
  {
    label: "Productos",
    icon: "list-outline",
    route: HOME_URL,
  },
];

export const aboutAppItems = [
  {
    label: "¿ Cómo funciona ?",
    icon: "clipboard-outline",
    route: "/(drawer)/(tabs)/how-it-works",
  },
  {
    label: "Preguntas Frecuentes",
    icon: "help-circle-outline",
    route: "/(drawer)/(tabs)/faq",
  },
];

export const aboutUsItems = [
  {
    label: "¿ Quiénes Somos ?",
    icon: "information-circle",
    route: "/(drawer)/(tabs)/about",
  },
  {
    label: "Contactos",
    icon: "people",
    route: "/(drawer)/(tabs)/contact",
  },
];

export const locationItems = [
  {
    label: "Donde estamos",
    icon: "location-outline",
    route: "/(drawer)/(tabs)/location",
  },
];
