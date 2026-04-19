
import { Product } from "@/definitions/Product";
import { ProductItem } from "./ProductItem";
import { logsStrapi } from "@/lib/strapi/logs";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export const ProductShows = ({ products }: { products: Product[] }) => {
  const router = useRouter();
  const locale = useLocale();
  const handleClick = async (product: Product) => {
    try {
      router.push(`/${locale}/products/${product.slug}`);
      await logsStrapi(
        "User Clicked Product Details on Product List",
        `Product Name: ${product.name}`
      );
    } catch {
      () => {};
    }
  };
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {products?.map((product) => (
        <div
          key={`${product.slug}`}
          className="flex h-full cursor-pointer"
          onClick={() => handleClick(product)}
        >
          <ProductItem product={product} />
        </div>
      ))}
    </div>
  );
};
