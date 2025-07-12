// app/produk/[id]/page.tsx
import { products } from "@/app/lib/placeholder-data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const whatsappMessage = `Halo Dapur Mama, saya tertarik untuk memesan ${product.name}.`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=6281234567890&text=${encodeURIComponent(whatsappMessage)}`; // Ganti dengan nomor WA Anda

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/produk" className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
          <span>Kembali ke Katalog</span>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="relative w-full h-96 rounded-lg bg-gray-200 shadow-lg overflow-hidden">
           <Image
              src="/hero-desktop.png" // Placeholder image
              alt={`Gambar ${product.name}`}
              fill
              style={{objectFit:"cover"}}
              priority
            />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-5xl font-extrabold text-gray-800">{product.name}</h1>
          <p className="mt-4 text-lg text-gray-600">
            {product.description}
          </p>
          <p className="mt-6 text-4xl font-bold text-blue-600">
            Rp {product.price.toLocaleString("id-ID")}
          </p>

          <div className="mt-10">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-3 rounded-lg bg-green-500 px-8 py-4 text-xl font-bold text-white transition-transform hover:scale-105 hover:bg-green-600"
            >
              <ChatBubbleBottomCenterTextIcon className="w-7 h-7" />
              <span>Pesan via WhatsApp</span>
            </a>
            <p className="text-center text-sm text-gray-500 mt-4">Klik untuk langsung terhubung dengan admin kami.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
