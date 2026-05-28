import { CartPage as CartPageContent } from "@/components/cart/cart-page";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata = pageMetadata.cart;

export default async function CartPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <CartPageContent locale={locale} />;
}
