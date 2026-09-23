import { SingleProduct } from "@/container/products/product/single-product";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import type { Metadata } from "next";
import { localizedAlternates, OG_LOCALE, toAppLocale } from "@/lib/seo-pages";
import { ProductJsonLd } from "@/components/seo/product-json-ld";

function stripHtml(html: string, maxLength = 160): string {
  const text = html?.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() || "";
  return text.length > maxLength ? text.slice(0, maxLength - 1) + "…" : text;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale: rawLocale } = await params;
  const locale = toAppLocale(rawLocale);
  const t = await getTranslations({ locale, namespace: "seo" });
  const product = await fetchContentType(
    "products",
    { filters: { slug } },
    true
  );
  if (!product) return { title: t("product.fallbackTitle") };
  const name = product.name || t("product.fallbackTitle");
  const description =
    stripHtml(product.description || "", 160) || t("site.description");
  const alternates = localizedAlternates(`/products/${slug}`, locale);
  const url = alternates.canonical as string;
  const image =
    product.images?.[0]?.url &&
    (product.images[0].url.startsWith("http")
      ? product.images[0].url
      : `${process.env.NEXT_PUBLIC_API_URL || ""}${product.images[0].url}`);
  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      url,
      type: "website",
      locale: OG_LOCALE[locale],
      images: image ? [{ url: image, alt: name }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description
    },
    alternates
  };
}

export default async function SingleProductPage({
  params
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale: rawLocale } = await params;
  const locale = toAppLocale(rawLocale);

  const product = await fetchContentType(
    "products",
    {
      filters: { slug }
    },
    true
  );

  if (!product) {
    redirect({ href: "/", locale });
  }

  return (
    <>
      <ProductJsonLd product={product} locale={locale} />
      <SingleProduct product={product} />
    </>
  );
}
