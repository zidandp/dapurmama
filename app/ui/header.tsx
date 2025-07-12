// app/ui/header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white shadow-md mb-4">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Dapur Mama
        </Link>
        <div className="flex space-x-6">
                <Link
                  href="/"
                  className="text-gray-600 hover:text-blue-500"
                >
                  Beranda
                </Link>
                <Link
                  href="/produk"
                  className="text-gray-600 hover:text-blue-500"
                >
                  Produk
                </Link>
                <Link
                  href="/tentang-kami"
                  className="text-gray-600 hover:text-blue-500"
                >
                  Tentang Kami
                </Link>
                <Link
                  href="/cara-pesan"
                  className="text-gray-600 hover:text-blue-500"
                >
                  Cara Pesan
                </Link>
              </div>
      </nav>
    </header>
  );
}
