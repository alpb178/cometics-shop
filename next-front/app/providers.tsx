"use client";

import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "@/context/theme-context";
import { AppProvider } from "@/context/app-context";
import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ViewTransitions } from "next-view-transitions";
import { SlugProvider } from "./context/SlugContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";

const timeZone = "Europe/Madrid";

dayjs.extend(localizedFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault(timeZone);

export function Providers({
  children,
  locale,
  messages
}: Readonly<{
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}>) {
  dayjs.locale(locale);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
    >
      <AppProvider>
        <SlugProvider>
          <ViewTransitions>
            <CartProvider>
              <ThemeProvider>{children}</ThemeProvider>
              <SpeedInsights />
              <Analytics />
            </CartProvider>
          </ViewTransitions>
        </SlugProvider>
      </AppProvider>
    </NextIntlClientProvider>
  );
}
