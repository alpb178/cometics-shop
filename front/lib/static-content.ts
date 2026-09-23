// Static page content (it used to come from the API via dynamic zones).
// The look is preserved by reusing the render components. The copy lives in
// the `pages` messages namespace; this file only holds the structure (order,
// keys, images, links) so both locales share it.

/** Steps of the "How it works" page, in order (keys of `pages.howItWorks.steps`). */
export const HOW_IT_WORKS_STEPS = [
  "catalog",
  "cart",
  "delivery",
  "confirm",
  "quote",
  "pickup",
  "payment",
  "receive"
] as const;

/** Sections of the "About us" page (keys of `pages.about.story`). */
export const ABOUT_STORY: {
  key: "whoWeAre" | "mission" | "vision";
  image: { url: string };
}[] = [
  {
    key: "whoWeAre",
    image: {
      url: "https://res.cloudinary.com/dqo4p3wa7/image/upload/v1765804164/Whats_App_Image_2025_12_15_at_09_08_34_e9897dd33e.jpg"
    }
  },
  {
    key: "mission",
    image: {
      url: "https://res.cloudinary.com/dqo4p3wa7/image/upload/v1765804442/Whats_App_Image_2025_12_15_at_09_08_34_2_d7ecb392d3.jpg"
    }
  },
  {
    key: "vision",
    image: {
      url: "https://res.cloudinary.com/dqo4p3wa7/image/upload/v1765804479/Whats_App_Image_2025_12_15_at_09_08_34_1_a92cdfcefb.jpg"
    }
  }
];

/** Sections of the privacy policy page (keys of `pages.policy.story`). */
export const POLICY_STORY = [
  "collect",
  "analyzed",
  "protect",
  "updates"
] as const;

export interface SocialLink {
  name: string;
  alias: string;
  link: { URL: string };
}

/** Single source for social networks (footer and contact). */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: "facebook",
    alias: "facebook",
    link: { URL: "https://www.facebook.com/share/1EYPuYeR6Y/" }
  },
  {
    name: "instagram",
    alias: "instagram",
    link: {
      URL: "https://www.instagram.com/irisnaturalcosmetica_oficial?igsh=Nm5nOGFvOTFzbjNk"
    }
  },
  {
    name: "tiktok",
    alias: "tiktok",
    link: {
      URL: "https://www.tiktok.com/@irisnatural_cosmetica?_r=1&_t=ZS-98CeE3ULaXg"
    }
  }
];

/** Contact form fields (labels in `pages.contact.form.<name>`). */
export const CONTACT_FORM_INPUTS: {
  type: "text" | "email" | "textarea" | "submit";
  name: "name" | "email" | "comments" | "send";
  required: boolean | null;
}[] = [
  { type: "text", name: "name", required: true },
  { type: "email", name: "email", required: null },
  { type: "textarea", name: "comments", required: true },
  { type: "submit", name: "send", required: null }
];
