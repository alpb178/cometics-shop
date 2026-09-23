import { Image } from "@/definitions/Image";
import { useTranslations } from "next-intl";
import { TransitionLink as Link } from "@/components/i18n/transition-link";

import { getImageSrc } from "@/lib/strapi/strapiImage";
import { BlurImage } from "../blur-image/blur-image";

// `locale` is accepted for backwards compatibility; the link adds the prefix.
export const Logo = ({ image }: { image?: Image; locale?: string }) => {
  const t = useTranslations("nav");
  if (image) {
    return (
      <Link
        href="/"
        aria-label={t("goHome")}
        className="z-20 relative flex items-center space-x-2 mr-4 min-w-max font-normal text-foreground text-sm"
      >
        <BlurImage
          src={getImageSrc(image?.url)}
          alt={image.alternativeText}
          width={200}
          height={200}
          className="mr-2 rounded-xl w-16 h-16 object-contain"
        />
      </Link>
    );
  }

  return;
};
