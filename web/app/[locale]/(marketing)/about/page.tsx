import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container/container-page";
import { StoryPanel } from "@/components/dynamic-zone/story-panel";
import { ABOUT_STORY } from "@/lib/static-content";
import { pageMetadataFor } from "@/lib/seo-pages";

export const generateMetadata = pageMetadataFor("about");

export default async function AboutPage() {
  const t = await getTranslations("pages.about.story");
  const storys = ABOUT_STORY.map(({ key, image }) => ({
    tittle: t(`${key}.title`),
    description: t(`${key}.description`),
    image
  }));

  return (
    <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
      <StoryPanel storys={storys} />
    </Container>
  );
}
