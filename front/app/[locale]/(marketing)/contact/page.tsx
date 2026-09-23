import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container/container-page";
import { FormNextToSection } from "@/components/dynamic-zone/form-next-to-section";
import { CONTACT_FORM_INPUTS, SOCIAL_LINKS } from "@/lib/static-content";
import { pageMetadataFor } from "@/lib/seo-pages";

export const generateMetadata = pageMetadataFor("contact");

export default async function ContactPage() {
  const t = await getTranslations("pages.contact");
  const form = {
    inputs: CONTACT_FORM_INPUTS.map((input) => ({
      ...input,
      placeholder: null,
      label: t(`form.${input.name}`)
    }))
  };

  return (
    <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
      <FormNextToSection
        heading={t("heading")}
        sub_heading={t("subHeading")}
        form={form}
        section={null}
        social_networks={SOCIAL_LINKS}
      />
    </Container>
  );
}
