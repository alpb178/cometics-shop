import {
  IconBrandBluesky,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandSnapchat,
  IconBrandX
} from "@tabler/icons-react";

const iconClassName =
  "size-7 text-foreground/70 hover:text-primary transition-all duration-300 ease-in-out";
export const socials = {
  twitter: {
    title: "twitter",
    icon: <IconBrandX className={iconClassName} />
  },
  instagram: {
    title: "instagram",

    icon: <IconBrandInstagram className={iconClassName} />
  },
  linkedin: {
    title: "linkedin",
    icon: <IconBrandLinkedin className={iconClassName} />
  },
  x: {
    title: "x",
    icon: <IconBrandX className={iconClassName} />
  },
  facebook: {
    title: "facebook",
    icon: <IconBrandFacebook className={iconClassName} />
  },
  bluesky: {
    title: "bluesky",
    icon: <IconBrandBluesky className={iconClassName} />
  },
  snapchat: {
    title: "snapchat",
    icon: <IconBrandSnapchat className={iconClassName} />
  }
};
