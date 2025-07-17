import ProductCard from '@/app/ui/produk/product-card';
import { Product } from '@/app/lib/definitions';

// Fungsi untuk mengambil data produk dari API
// Kita menambahkan { cache: 'no-store' } untuk memastikan data selalu baru (dinamis)
async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/produk`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    // Ini akan menampilkan halaman error bawaan Next.js
    throw new Error('Gagal mengambil data produk dari API');
  }

  return res.json();
}

export default async function ProdukPage() {
  const products = await getProducts();

  return (
    <main className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
        Katalog Produk Kami
      </h1>
      <p className="text-center text-gray-600 mb-12">
        Temukan kue dan hidangan favorit Anda.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}
