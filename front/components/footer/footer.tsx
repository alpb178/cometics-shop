"use client";

import { Link } from "next-view-transitions";
import seoData from "@/lib/next-metadata";
import { ArrowRight } from "lucide-react";
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok
} from "@tabler/icons-react";
import { SOCIAL_LINKS } from "@/lib/static-content";

type FooterLink = { text: string; URL: string };

const POLICY_LINKS: FooterLink[] = [
  { text: "Política de privacidad", URL: "/policy-privacy" }
];

// currentColor: heredan el color del enlace (claro sobre el footer oscuro).
const SOCIAL_ICON: Record<string, React.ReactNode> = {
  facebook: <IconBrandFacebook className="size-6" />,
  instagram: <IconBrandInstagram className="size-6" />,
  tiktok: <IconBrandTiktok className="size-6" />
};

export const Footer = ({ locale }: { locale: string }) => {
  return (
    <footer className="mt-24 bg-foreground text-background">
      <div className="mx-auto max-w-screen-2xl px-6 py-14 sm:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <FooterColumn title="Atención">
            <FooterLink href={`/${locale}/contact`}>Contacto</FooterLink>
            <FooterLink href={`/${locale}/faq`}>Preguntas frecuentes</FooterLink>
            <FooterLink href={`/${locale}/how-it-works`}>Cómo comprar</FooterLink>
          </FooterColumn>

          <FooterColumn title="La marca">
            <FooterLink href={`/${locale}/about`}>Nuestra historia</FooterLink>
            <FooterLink href={`/${locale}`}>Productos</FooterLink>
            {process.env.NEXT_PUBLIC_ADDRESS && (
              <li className="text-sm text-background/70">
                {process.env.NEXT_PUBLIC_ADDRESS}
              </li>
            )}
          </FooterColumn>

          <FooterColumn title="Legal">
            {POLICY_LINKS.map((link) => (
              <FooterLink
                key={link.text}
                href={
                  link.URL.startsWith("http")
                    ? link.URL
                    : `/${locale}${link.URL}`
                }
              >
                {link.text}
              </FooterLink>
            ))}
          </FooterColumn>

          <div className="col-span-2 flex flex-col gap-5 md:col-span-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em]">
              Síguenos
            </p>

            <form
              className="flex w-full items-center gap-2 border-b border-background/30 pb-2"
              onSubmit={(e) => e.preventDefault()}
              aria-label="Newsletter"
            >
              <input
                type="email"
                placeholder="Tu email para novedades"
                className="flex-1 bg-transparent text-sm text-background placeholder:text-background/60 focus:outline-none"
                aria-label="Tu email"
              />
              <button
                type="submit"
                aria-label="Suscribirse"
                className="flex h-9 w-9 items-center justify-center text-background hover:text-background/70"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map((s) => (
                <Link
                  key={s.name}
                  href={s.link.URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="text-background/80 transition-colors hover:text-background"
                >
                  {SOCIAL_ICON[s.name]}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-background/20 pt-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-background/70">{seoData.title}</span>
          </div>
          <p className="text-xs text-background/60">
            © {new Date().getFullYear()} {seoData.title}. Todos los derechos
            reservados.
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
