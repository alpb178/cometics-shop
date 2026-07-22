import LayoutApp from "@/app/layout-app";

// Chrome del storefront (navbar/footer/ayuda). Vive aquí, no en el layout raíz
// de `[locale]`, para que el segmento `/admin` NO lo herede y tenga su propio
// shell de panel.
export default function MarketingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <LayoutApp>{children}</LayoutApp>;
}
