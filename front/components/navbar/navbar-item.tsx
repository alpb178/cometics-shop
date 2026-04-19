"use client";

import { cn } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  href: never;
  children: ReactNode;
  className?: string;
  target?: string;
};

export function NavbarItem({ children, href, target, className }: Props) {
  const pathname = usePathname();

  // Normalize paths for comparison (remove trailing slashes, handle locale)
  const normalizePath = (path: string) => {
    if (!path) return '/';
    // Remove locale prefix if present (e.g., /en, /es)
    const pathWithoutLocale = path.replace(/^\/(en|es)/, '') || '/';
    // Remove trailing slash except for root
    const normalized = pathWithoutLocale === '/' ? '/' : pathWithoutLocale.replace(/\/$/, '');
    return normalized;
  };

  const currentPath = normalizePath(pathname);
  const hrefPath = normalizePath(href as string);
  
  // Check if current path matches href exactly or starts with it (for nested routes)
  const isActive = currentPath === hrefPath || 
                   (hrefPath !== '/' && currentPath.startsWith(hrefPath + '/'));

  return (
    <Link
      href={href}
      className={cn(
        "relative flex justify-center items-center py-2 px-4 rounded-full leading-none transition-all duration-200 min-h-[44px]",
        "text-[15px] font-medium tracking-tight",
        isActive
          ? "text-primary font-semibold bg-primary/10"
          : "text-gray-700 hover:text-primary hover:bg-primary/5",
        className
      )}
      target={target}
      aria-current={isActive ? "page" : undefined}
    >
      <span className="relative z-10">{children}</span>
    </Link>
  );
}
