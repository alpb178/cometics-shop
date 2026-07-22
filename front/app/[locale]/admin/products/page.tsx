import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/page-header";
import { listCategories, listProducts } from "@/lib/admin/data";
import { ProductsTable } from "./products-table";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    listProducts(),
    listCategories(),
  ]);

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle={`${products.length} producto(s)`}
        action={
          <Link href="/products/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            Nuevo producto
          </Link>
        }
      />
      <ProductsTable products={products} categories={categories} />
    </div>
  );
}
