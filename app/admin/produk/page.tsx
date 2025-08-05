import { ProductDataTable } from '@/components/admin/products/ProductDataTable';

export default function AdminProductsPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <ProductDataTable />
    </main>
  );
}
