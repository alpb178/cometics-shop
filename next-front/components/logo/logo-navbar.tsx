import { Image } from "@/definitions/Image";
import { DEFAULT_LOCALE } from "@/i18n/routing";
import { Link } from "next-view-transitions";

import { getImageSrc } from "@/lib/strapi/strapiImage";
import { BlurImage } from "../blur-image/blur-image";

export const LogoNavbar = ({
  image,
  locale
}: {
  image?: Image;
  locale?: string;
}) => {
  if (image) {
    return (
      <Link
        href={`/${locale || DEFAULT_LOCALE}`}
        className="z-20 relative flex items-center space-x-2 mr-4 min-w-max font-normal text-foreground text-sm hover:opacity-80 transition-opacity duration-200"
        aria-label="Go to home"
      >
        <BlurImage
          src={getImageSrc(image?.url)}
          alt={image.alternativeText}
          width={200}
          height={200}
          className="mr-2 rounded-xl w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 object-contain"
        />
      </Link>
    );
  }

  return;
};
