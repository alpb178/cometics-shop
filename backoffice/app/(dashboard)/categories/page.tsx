import { PageHeader } from "@/components/page-header";
import { listCategories } from "@/lib/data";
import { CategoryManager } from "./category-manager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await listCategories();

  return (
    <div>
      <PageHeader
        title="Categorías"
        subtitle="Organiza los productos por categoría"
      />
      <CategoryManager categories={categories} />
    </div>
  );
}
