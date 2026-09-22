import { notFound } from "next/navigation";
import { PageHeader } from "@/components/admin/page-header";
import { getProduct, listCategories } from "@/lib/admin/data";
import { ProductForm } from "../../product-form";
import { updateProductAction } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  const [product, categories] = await Promise.all([
    getProduct(documentId),
    listCategories()
  ]);

  if (!product) notFound();

  const action = updateProductAction.bind(null, documentId);

  return (
    <div>
      <PageHeader title="Editar producto" subtitle={product.name} />
      <ProductForm
        categories={categories}
        product={product}
        action={action}
      />
    </div>
  );
}
