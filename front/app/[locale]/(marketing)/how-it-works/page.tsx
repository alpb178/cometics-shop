import { Container } from "@/components/container/container-page";
import { HowItWorks } from "@/components/dynamic-zone/how-it-works";
import { HOW_IT_WORKS } from "@/lib/static-content";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata = pageMetadata["how-it-works"];

export default function HowItWorksPage() {
  return (
    <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
      <HowItWorks
        heading={HOW_IT_WORKS.heading}
        sub_heading={HOW_IT_WORKS.sub_heading}
        steps={HOW_IT_WORKS.steps}
      />
    </Container>
  );
}
