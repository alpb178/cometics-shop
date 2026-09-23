"use client";

import { ErrorToaster } from "@/components/error/error-toaster";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { ThemeProvider } from "@/context/theme-context";
import dayjs from "dayjs";
import "dayjs/locale/es";
import localizedFormat from "dayjs/plugin/localizedFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import { ViewTransitions } from "next-view-transitions";
import { SlugProvider } from "./context/SlugContext";
import type { AppLocale } from "@/i18n/routing";
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
  locale: AppLocale;
  messages: AbstractIntlMessages;
}>) {
  dayjs.locale(locale);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone={timeZone}
    >
      <SlugProvider>
        <ViewTransitions>
          <AuthProvider>
            <CartProvider>
              <ThemeProvider>
                {children}
                {/* Inside ThemeProvider: the toaster follows the active theme */}
                <ErrorToaster />
              </ThemeProvider>
              <SpeedInsights />
              <Analytics />
            </CartProvider>
          </AuthProvider>
        </ViewTransitions>
      </SlugProvider>
    </NextIntlClientProvider>
  );
}
