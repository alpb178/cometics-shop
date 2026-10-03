import { getTranslations } from "next-intl/server";
import { Container } from "@/components/container/container-page";
import { FAQ } from "@/components/dynamic-zone/faq";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { pageMetadataFor } from "@/lib/seo-pages";

export const generateMetadata = pageMetadataFor("faq");

export default async function FAQPage() {
  const t = await getTranslations("pages.faq");
  const response = await fetchContentType("faqs", {
    pagination: { pageSize: 200 }
  });

  const faqs: { question: string; answer: string }[] = response?.data ?? [];

  return (
    <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
      <FAQ heading={t("heading")} faqs={faqs} />
    </Container>
  );
}
