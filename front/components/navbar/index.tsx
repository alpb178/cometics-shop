"use client";

import { NAVBAR_ITEMS, NAVBAR_LOGO } from "@/lib/constants/navbar";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";

export default function Navbar({
  locale,
  data
}: {
  locale: string;
  /** Optional API data; when absent, static config is used (avoids API load) */
  data?: { left_navbar_items?: any[]; right_navbar_items?: any[]; logo?: any } | null;
}) {
  const leftNavbarItems = data?.left_navbar_items?.length
    ? data.left_navbar_items
    : NAVBAR_ITEMS;
  const logo = data?.logo ?? NAVBAR_LOGO;

  if (
    !leftNavbarItems?.length &&
    (data?.right_navbar_items?.length === 0 || !data)
  ) {
    return null;
  }

  return (
    <header
      className="sticky top-0 z-50 w-full bg-background"
      aria-label="Main navigation bar"
    >
      <DesktopNavbar
        locale={locale}
        leftNavbarItems={leftNavbarItems}
        logo={logo}
      />

      <div className="lg:hidden">
        <MobileNavbar
          locale={locale}
          leftNavbarItems={leftNavbarItems}
          logo={logo}
        />
      </div>
    </header>
  );
}
