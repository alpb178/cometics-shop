import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container/container-page";
import { HowItWorks } from "@/components/dynamic-zone/how-it-works";
import { HOW_IT_WORKS_STEPS } from "@/lib/static-content";
import { pageMetadataFor } from "@/lib/seo-pages";

export const generateMetadata = pageMetadataFor("how-it-works");

export default async function HowItWorksPage() {
  const t = await getTranslations("pages.howItWorks");
  const steps = HOW_IT_WORKS_STEPS.map((key) => ({
    title: t(`steps.${key}.title`),
    description: t(`steps.${key}.description`)
  }));

  return (
    <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
      <HowItWorks heading={t("heading")} sub_heading="" steps={steps} />
    </Container>
  );
}
