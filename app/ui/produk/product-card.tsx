import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/app/lib/placeholder-data';

// Karena kita belum punya gambar produk, kita buat placeholder sederhana
const PlaceholderImage = () => (
  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
    <span className="text-gray-400">Gambar Segera Hadir</span>
  </div>
);

export default function ProductCard({ product }: { product: typeof products[0] }) {
  return (
    <Link href={`/produk/${product.id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        <div className="relative">
          <PlaceholderImage />
        </div>
        <div className="p-6">
          <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-500 transition-colors">
            {product.name}
          </h3>
          <p className="mt-2 text-gray-600 h-12 overflow-hidden">
            {product.description}
          </p>
          <p className="mt-4 text-xl font-semibold text-blue-600">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
        </div>
      </div>
    </Link>
  );
}
