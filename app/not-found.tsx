// app/not-found.tsx
import Link from 'next/link';
import { BookOpenIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-4 text-center p-8 bg-gray-50">
      <BookOpenIcon className="w-24 h-24 text-blue-400" />
      <h2 className="text-5xl font-bold text-gray-800">404</h2>
      <p className="text-xl text-gray-600 mt-2">
        Waduh, resep untuk halaman ini sepertinya hilang!
      </p>
      <p className="text-md text-gray-500">
        Halaman yang Anda cari tidak dapat ditemukan.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-400"
      >
        Kembali ke Beranda
      </Link>
    </main>
  );
}
