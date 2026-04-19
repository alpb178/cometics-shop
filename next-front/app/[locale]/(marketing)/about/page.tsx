import { Container } from "@/components/container/container-page";
import PageContent from "@/lib/shared/PageContent";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { pageMetadata } from "@/lib/seo-pages";

export const metadata = pageMetadata.about;

export default async function AboutPage() {
  const pageData = await fetchContentType(
    "pages",
    {
      filters: {
        slug: "about",
        locale: "en"
      }
    },
    true
  );

  return <Container className="mt-0 mb-0 md:mt-20 md:mb-10">
    <PageContent pageData={pageData} />
  </Container>
  ;
}
