"use client";

import { useTranslations } from "next-intl";
import { TransitionLink as Link } from "@/components/i18n/transition-link";
import { siteMetadata } from "@/lib/next-metadata";
import { ArrowRight } from "lucide-react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok
} from "@tabler/icons-react";
import { SOCIAL_LINKS } from "@/lib/static-content";

type FooterLink = { labelKey: "privacyPolicy"; URL: string };

const POLICY_LINKS: FooterLink[] = [
  { labelKey: "privacyPolicy", URL: "/policy-privacy" }
];

// Icons in the brand color (currentColor = the link's text-primary).
const SOCIAL_ICON: Record<string, React.ReactNode> = {
  facebook: <IconBrandFacebook className="size-5" />,
  instagram: <IconBrandInstagram className="size-5" />,
  tiktok: <IconBrandTiktok className="size-5" />
};

// `locale` is accepted for backwards compatibility; links add the prefix.
export const Footer = (_props: { locale: string }) => {
  const t = useTranslations("footer");
  return (
    <footer className="mt-24 bg-foreground text-background">
      <div className="mx-auto max-w-screen-2xl px-6 py-14 sm:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <FooterColumn title={t("support.title")}>
            <FooterLink href="/contact">{t("support.contact")}</FooterLink>
            <FooterLink href="/faq">{t("support.faq")}</FooterLink>
            <FooterLink href="/how-it-works">{t("support.howToBuy")}</FooterLink>
          </FooterColumn>

          <FooterColumn title={t("brand.title")}>
            <FooterLink href="/about">{t("brand.ourStory")}</FooterLink>
            <FooterLink href="/">{t("brand.products")}</FooterLink>
            {process.env.NEXT_PUBLIC_ADDRESS && (
              <li className="text-sm text-background/70">
                {process.env.NEXT_PUBLIC_ADDRESS}
              </li>
            )}
          </FooterColumn>

          <FooterColumn title={t("legal.title")}>
            {POLICY_LINKS.map((link) => (
              <FooterLink
                key={link.labelKey}
                href={link.URL}
              >
                {t(`legal.${link.labelKey}`)}
              </FooterLink>
            ))}
          </FooterColumn>

          <div className="col-span-2 flex flex-col gap-5 md:col-span-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
              {t("followUs")}
            </p>

            <form
              className="flex w-full items-center gap-2 border-b border-background/30 pb-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label={t("newsletter.label")}
            >
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="flex-1 bg-transparent text-sm text-background placeholder:text-background/60 focus:outline-none"
                aria-label={t("newsletter.emailLabel")}
              />
              <button
                type="submit"
                aria-label={t("newsletter.subscribe")}
                className="flex h-9 w-9 items-center justify-center text-background hover:text-background/70"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <Link
                  key={s.name}
                  href={s.link.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-black shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  {SOCIAL_ICON[s.name]}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-background/20 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-background/70">{siteMetadata.name}</span>
          </div>
          <p className="text-xs text-background/60">
            {t("copyright", {
              year: new Date().getFullYear(),
              name: siteMetadata.name
            })}
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-background">
      {title}
    </p>
    <ul className="space-y-3">{children}</ul>
  </div>
);

const FooterLink = ({
  href,
  children
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <Link
      href={href}
      className="text-sm text-background/80 transition-colors hover:text-background"
    >
      {children}
    </Link>
  </li>
);
