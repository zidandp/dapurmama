import Image from 'next/image';

export default function TentangKamiPage() {
  return (
    <main className="bg-white py-12">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Cerita di Balik Dapur Mama</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Lebih dari sekadar bisnis, Dapur Mama adalah perwujudan cinta dan semangat untuk berbagi kelezatan otentik yang diracik dari resep warisan keluarga.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative w-full h-80 rounded-lg overflow-hidden shadow-lg">
             <Image
                src="/hero-mobile.png" // Menggunakan gambar yang ada sebagai placeholder
                alt="Suasana Dapur Mama"
                fill
                style={{objectFit:"cover"}}
              />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Dari Dapur Rumahan, Untuk Anda</h2>
            <p className="mt-4 text-gray-700">
              Semuanya berawal dari dapur kecil kami, tempat aroma kue panggang dan bumbu masakan berpadu menciptakan kenangan. Setiap produk yang kami hasilkan dibuat dengan bahan-bahan pilihan berkualitas terbaik, tanpa kompromi rasa. Kami percaya bahwa makanan yang baik berasal dari hati yang tulus.
            </p>
            <p className="mt-4 text-gray-700">
              Misi kami sederhana: menyajikan hidangan yang tidak hanya lezat di lidah, tetapi juga menghangatkan hati, seolah-olah Anda sedang menikmati masakan seorang ibu.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

