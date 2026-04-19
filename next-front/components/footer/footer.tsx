"use client";

import { Logo } from "@/components/logo/logo";
import { Link } from "next-view-transitions";
import { socials } from "../dynamic-zone/socials";
import { useAppMode } from "@/hooks/useAppMode";
import seoData from "@/lib/next-metadata";
import { MapPin, Phone } from "lucide-react";

export const Footer = ({ data, locale }: { data: any; locale: string }) => {
  const { isDark } = useAppMode();
  const logoIcon = !isDark ? data?.logo?.imageDark : data?.logo?.image;

  return (
    <footer className="mt-auto bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {data?.logo?.image && (
                <div className="flex-shrink-0">
                  <Logo image={logoIcon} />
                </div>
              )}
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {seoData.title}
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">
              Productos naturales de calidad para tu bienestar y belleza.
            </p>
            {/* Social Networks */}
            {data?.social_networks && data.social_networks.length > 0 && (
              <div className="flex flex-row gap-3">
                {data.social_networks.map((social: any) => (
                  <Link
                    href={social.link.URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    key={social.alias}
                    className="flex min-w-[44px] min-h-[44px] items-center justify-center rounded-lg bg-white hover:bg-primary/10 text-gray-600 hover:text-primary transition-all duration-200 shadow-sm hover:shadow-md"
                    aria-label={social.name}
                  >
                    <div className="w-5 h-5">
                      {socials[social.name as keyof typeof socials]?.icon}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Enlaces Rápidos
            </h3>
            <LinkSection links={data?.policy_links} locale={locale} />
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Contacto
            </h3>
            <div className="space-y-3">
              {process.env.NEXT_PUBLIC_ADDRESS && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    {process.env.NEXT_PUBLIC_ADDRESS}
                  </p>
                </div>
              )}
              {process.env.NEXT_PUBLIC_TIME && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-600">
                    {process.env.NEXT_PUBLIC_TIME}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Newsletter/Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Información
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Síguenos en nuestras redes sociales para estar al día con nuestras últimas ofertas y productos naturales.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              {data?.copyright && (
                <span>{data.copyright}</span>
              )}
              {data?.designed_developed_by && (
                <span className={data?.copyright ? " ml-2" : ""}>
                  {data.designed_developed_by}
                </span>
              )}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span>Todos los derechos reservados</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LinkSection = ({
  links,
  locale
}: {
  links: { text: string; URL: never | string }[];
  locale: string;
}) => (
  <nav className="flex flex-col space-y-3">
    {links &&
      links.length > 0 &&
      links.map((link) => (
        <Link
          key={link.text}
          className="text-sm text-gray-600 hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block w-fit"
          href={`${link.URL.startsWith("http") ? "" : `/${locale}`}${link.URL}`}
        >
          {link.text}
        </Link>
      ))}
  </nav>
);
