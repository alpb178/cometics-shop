import { Container } from "@/components/container/container-page";
import { FormNextToSection } from "@/components/dynamic-zone/form-next-to-section";
import { CONTACT } from "@/lib/static-content";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata = pageMetadata.contact;

export default function ContactPage() {
  return (
    <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
      <FormNextToSection
        heading={CONTACT.heading}
        sub_heading={CONTACT.sub_heading}
        form={CONTACT.form}
        section={null}
        social_networks={CONTACT.socialNetworks}
      />
    </Container>
  );
}
