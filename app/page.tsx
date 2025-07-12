import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/app/lib/placeholder-data';
import ProductCard from '@/app/ui/produk/product-card';

export default function HomePage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] flex items-center justify-center text-center text-white bg-gray-800">
        <Image
          src="/hero-desktop.png"
          alt="Aneka kue lezat dari Dapur Mama"
          fill
          priority
          style={{objectFit:"cover"}}
          className="absolute z-0 opacity-40"
        />
        <div className="relative z-10 p-8">
          <h1 className="text-5xl md:text-6xl font-extrabold drop-shadow-md">
            Kue Kualitas Premium, Dibuat Penuh Cinta
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto drop-shadow-sm">
            Pesan aneka kue dan masakan rumahan untuk momen spesial Anda. Pre-order sekarang dan nikmati kelezatan otentik dari Dapur Mama.
          </p>
          <Link
            href="#produk"
            className="mt-8 inline-block rounded-lg bg-blue-500 px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-105 hover:bg-blue-400"
          >
            Lihat Menu Terbaru
          </Link>
        </div>
      </section>

      {/* Product Gallery Section */}
      <section id="produk" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Produk Terlaris Kami
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
