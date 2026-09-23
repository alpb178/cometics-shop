import { CartPage as CartPageContent } from "@/components/cart/cart-page";
import { pageMetadataFor } from "@/lib/seo-pages";

export const generateMetadata = pageMetadataFor("cart");

export default function CartPage() {
  return <CartPageContent />;
}
