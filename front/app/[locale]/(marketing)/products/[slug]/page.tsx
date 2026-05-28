import { SingleProduct } from "@/container/products/product/single-product";
import fetchContentType from "@/lib/strapi/fetchContentType";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { siteMetadata } from "@/lib/next-metadata";
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
  const { slug } = await params;
  const product = await fetchContentType(
    "products",
    { filters: { slug } },
    true
  );
  if (!product) return { title: "Producto" };
  const name = product.name || "Producto";
  const description =
    stripHtml(product.description || "", 160) || siteMetadata.description;
  const url = `${siteMetadata.url}/products/${slug}`;
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
      images: image ? [{ url: image, alt: name }] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description
    },
    alternates: { canonical: url }
  };
}

export default async function SingleProductPage({
  params
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;

  const product = await fetchContentType(
    "products",
    {
      filters: { slug }
    },
    true
  );

  if (!product) {
    redirect("/");
  }

  return (
    <>
      <ProductJsonLd product={product} locale={locale} />
      <SingleProduct product={product} />
    </>
  );
}
