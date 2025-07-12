import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-white shadow-inner mt-16 py-8">
      <div className="container mx-auto px-6 text-center text-gray-600">
        <div className="flex justify-center space-x-6 mb-4">
          <Link href="/tentang-kami" className="hover:text-blue-500">
            Tentang Kami
          </Link>
          <Link href="/cara-pesan" className="hover:text-blue-500">
            Cara Pesan
          </Link>
          <Link href="/dashboard" className="hover:text-blue-500">
            Admin Login
          </Link>
        </div>
        <p>&copy; {new Date().getFullYear()} Dapur Mama. Semua Hak Cipta Dilindungi.</p>
      </div>
    </footer>
  );
}
