"use client";

import { NAVBAR_ITEMS, NAVBAR_LOGO } from "@/lib/constants/navbar";
import { motion } from "framer-motion";
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
    <motion.nav
      className="top-0 z-50 fixed inset-x-0 w-full max-w-[100vw]"
      aria-label="Main navigation bar"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <DesktopNavbar
        locale={locale}
        leftNavbarItems={leftNavbarItems}
        logo={logo}
      />

      <div className="lg:hidden flex items-center w-full h-full">
        <MobileNavbar
          locale={locale}
          leftNavbarItems={leftNavbarItems}
          logo={logo}
        />
      </div>
    </motion.nav>
  );
}
