import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container/container-page";
import { StoryPanel } from "@/components/dynamic-zone/story-panel";
import { POLICY_STORY } from "@/lib/static-content";
import { pageMetadataFor } from "@/lib/seo-pages";

export const generateMetadata = pageMetadataFor("policy-privacy");

export default async function PolicyPrivacyPage() {
  const t = await getTranslations("pages.policy.story");
  const storys = POLICY_STORY.map((key) => ({
    tittle: t(`${key}.title`),
    description: t(`${key}.description`)
  }));

  return (
    <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
      <StoryPanel storys={storys} />
    </Container>
  );
}
