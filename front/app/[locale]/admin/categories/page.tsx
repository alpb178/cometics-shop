import { listCategories } from "@/lib/admin/data";
import { CategoryManager } from "./category-manager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await listCategories();
  // The PageHeader (with the "Nueva categoría" button) is rendered by the manager.
  return <CategoryManager categories={categories} />;
}
