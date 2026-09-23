"use client";

import { NAVBAR_ITEMS, NAVBAR_LOGO } from "@/lib/constants/navbar";
import { DesktopNavbar } from "./desktop-navbar";
import { MobileNavbar } from "./mobile-navbar";

export default function Navbar({ locale }: { locale: string }) {
  // Static navbar (config in lib/constants/navbar); does not depend on the DB.
  const leftNavbarItems = NAVBAR_ITEMS;
  const logo = NAVBAR_LOGO;

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
