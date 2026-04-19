import { CartPage as CartPageContent } from "@/components/cart/cart-page";
import { Container } from "@/components/container/container-page";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata = pageMetadata.cart;

export default async function CartPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
      <CartPageContent locale={locale} />
    </Container>
  );
}
