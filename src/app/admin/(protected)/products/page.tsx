import { prisma } from "@/lib/db";
import { ProductsTable } from "./products-table";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      priceCents: true,
      stock: true,
      type: true,
    },
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Products</h1>
      <p style={{ opacity: 0.7 }}>
        Toggle publish status and edit server-trusted price/stock. Prices are stored in
        euro cents.
      </p>
      <ProductsTable products={products} />
    </div>
  );
}
