import { Container } from "@/components/container/container-page";
import { FAQ } from "@/components/dynamic-zone/faq";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { FAQ_HEADING } from "@/lib/static-content";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata = pageMetadata.faq;

export default async function FAQPage() {
  const response = await fetchContentType("faqs", {
    pagination: { pageSize: 200 }
  });

  const faqs: { question: string; answer: string }[] = response?.data ?? [];

  return (
    <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
      <FAQ heading={FAQ_HEADING} faqs={faqs} />
    </Container>
  );
}
