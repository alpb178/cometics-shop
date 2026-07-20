import { Container } from "@/components/container/container-page";
import { StoryPanel } from "@/components/dynamic-zone/story-panel";
import { ABOUT_STORY } from "@/lib/static-content";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata = pageMetadata.about;

export default function AboutPage() {
  return (
    <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
      <StoryPanel storys={ABOUT_STORY} />
    </Container>
  );
}
