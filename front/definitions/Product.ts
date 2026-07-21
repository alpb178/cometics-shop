import { Category } from "./Category";

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: any;
  images: any[];
  categories?: Category[];
  currency?: string;
  featured?: boolean;
  isNew?: boolean;
  discount?: number;
  /** Fecha de creación (ISO). Usada para ordenar y marcar "nuevos". */
  createdAt?: string;
  /** Personas que han visto el detalle (contador social). */
  views?: number;
}
