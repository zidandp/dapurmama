import { products } from '@/app/lib/placeholder-data';
import ProductCard from '@/app/ui/produk/product-card';

export default function ProdukPage() {
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
