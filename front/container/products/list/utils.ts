import { Product } from "@/definitions/Product";

export const groupProductsByCategory = (products: Product[]) => {
  const grouped: { [key: string]: Product[] } = {};
  const withoutCategory: Product[] = [];

  products?.forEach((product) => {
    const categoryName = product?.categories?.name || "";

    if (categoryName && categoryName.trim() !== "") {
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(product);
    } else {
      withoutCategory.push(product);
    }
  });

  if (withoutCategory.length > 0) {
    grouped["withoutCategory"] = withoutCategory;
  }

  return grouped;
};

export const PRODUCTS_TITLE = "En manos expertas la calidad esta garantizada";
export const PRODUCTS_DESCRIPTION =
  "Cada producto nace con un propósito claro, inspirado en una investigación dedicada sobre los beneficios que la naturaleza nos ofrece.";
