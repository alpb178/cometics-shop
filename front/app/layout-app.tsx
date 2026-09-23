"use client";

import { useLocale } from "next-intl";
import { Footer } from "../components/footer/footer";
import { HelpButton } from "../components/help/help-button";
import { ShippingWelcome } from "@/components/shipping/shipping-welcome";
import Navbar from "@/components/navbar";
import { GroupTicker } from "@/components/group-companies/group-ticker";

interface LayoutAppProps {
  children: React.ReactNode;
}

export default function LayoutApp({ children }: LayoutAppProps) {
  const locale = useLocale();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <GroupTicker />
      <Navbar locale={locale} />

      <div className="flex-1">{children}</div>

      <Footer locale={locale} />
      <HelpButton />
      <ShippingWelcome />
    </div>
  );
}
