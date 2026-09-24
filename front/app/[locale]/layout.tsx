import "@/styles/globals.scss";

import { libreFranklin, merriweatherGaramond } from "@/components/ui/fonts";
import { cn } from "@/lib/utils";
import { Metadata } from "next";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { LOCALE_TAGS, isAppLocale, routing } from "@/i18n/routing";
import { Providers } from "../providers";
import { buildDefaultMetadata } from "@/lib/next-metadata";
import { OrganizationWebSiteJsonLd } from "@/components/seo/json-ld";
import { PageTracker } from "@/components/analytics/page-tracker";
import { SiteAnalytics } from "@/components/analytics/site-analytics";

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildDefaultMetadata(isAppLocale(locale) ? locale : routing.defaultLocale);
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // `/xx/...` with an unknown locale is a 404, not a Spanish page.
  if (!isAppLocale(locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: "seo" });

  return (
    <html lang={LOCALE_TAGS[locale]} className="light">
      <body
        className={cn(
          libreFranklin.variable,
          merriweatherGaramond.variable,
          "font-sans bg-background text-foreground antialiased h-full w-full"
        )}
      >
        <OrganizationWebSiteJsonLd locale={locale} description={t("site.description")} />
        <PageTracker />
        {/* Renders nothing: sends the visit and clicks to the group hub. */}
        <SiteAnalytics />
        <Providers locale={locale} messages={messages}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
