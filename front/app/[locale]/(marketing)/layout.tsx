import LayoutApp from "@/app/layout-app";

// Storefront chrome (navbar/footer/help). It lives here, not in the `[locale]`
// root layout, so the `/admin` segment does NOT inherit it and keeps its own
// panel shell.
export default function MarketingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <LayoutApp>{children}</LayoutApp>;
}
