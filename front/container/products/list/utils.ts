import { Product } from "@/definitions/Product";

export const groupProductsByCategory = (products: Product[]) => {
  const grouped: { [key: string]: Product[] } = {};
  const withoutCategory: Product[] = [];

  products?.forEach((product) => {
    // A product can have several categories; it appears under each one.
    const names = (product?.categories ?? [])
      .map((c) => c?.name?.trim())
      .filter((n): n is string => !!n);

    if (names.length > 0) {
      names.forEach((categoryName) => {
        if (!grouped[categoryName]) {
          grouped[categoryName] = [];
        }
        grouped[categoryName].push(product);
      });
    } else {
      withoutCategory.push(product);
    }
  });

  if (withoutCategory.length > 0) {
    grouped["withoutCategory"] = withoutCategory;
  }

  return grouped;
};
