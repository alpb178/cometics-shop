import "@/styles/globals.scss";

import { libreFranklin, merriweatherGaramond } from "@/components/ui/fonts";
import LayoutApp from "@/app/layout-app";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { getMessages } from "next-intl/server";
import { Providers } from "../providers";
import { buildDefaultMetadata } from "@/lib/next-metadata";
import { OrganizationWebSiteJsonLd } from "@/components/seo/json-ld";
import { PageTracker } from "@/components/analytics/page-tracker";

export function generateMetadata(): Metadata {
  return buildDefaultMetadata();
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const messages = await getMessages();
  const { locale } = await params;

  return (
    <html lang={locale} className="light">
      <body
        className={cn(
          libreFranklin.variable,
          merriweatherGaramond.variable,
          "font-sans bg-background text-foreground antialiased h-full w-full"
        )}
      >
        <OrganizationWebSiteJsonLd />
        <PageTracker />
        <Providers locale={locale} messages={messages}>
          <LayoutApp>{children}</LayoutApp>
        </Providers>
      </body>
    </html>
  );
}
