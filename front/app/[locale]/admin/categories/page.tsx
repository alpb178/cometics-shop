import { listCategories } from "@/lib/admin/data";
import { CategoryManager } from "./category-manager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await listCategories();
  // El PageHeader (con el botón "Nueva categoría") lo renderiza el manager.
  return <CategoryManager categories={categories} />;
}
