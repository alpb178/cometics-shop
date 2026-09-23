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
  /** Creation date (ISO). Used for sorting and flagging "new" items. */
  createdAt?: string;
  /** People who have viewed the detail page (social counter). */
  views?: number;
}
