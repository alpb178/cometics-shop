import { PageHeader } from "@/components/admin/page-header";
import { listCategories } from "@/lib/admin/data";
import { ProductForm } from "../product-form";
import { createProductAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await listCategories();

  return (
    <div>
      <PageHeader title="Nuevo producto" subtitle="Sube las fotos y los detalles" />
      <ProductForm categories={categories} action={createProductAction} />
    </div>
  );
}
