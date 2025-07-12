import { ListBulletIcon, PhoneIcon, CurrencyDollarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const steps = [
  {
    icon: ListBulletIcon,
    title: "1. Lihat Menu & Sesi PO",
    description: "Kunjungi halaman produk kami untuk melihat daftar kue dan masakan yang sedang dibuka untuk pre-order."
  },
  {
    icon: PhoneIcon,
    title: "2. Hubungi Kami via WhatsApp",
    description: "Pilih produk yang Anda inginkan, lalu klik tombol pesan untuk terhubung langsung dengan admin kami di WhatsApp."
  },
  {
    icon: CurrencyDollarIcon,
    title: "3. Lakukan Pembayaran",
    description: "Admin kami akan memberikan instruksi pembayaran. Lakukan transfer sesuai nominal yang tertera."
  },
  {
    icon: CheckCircleIcon,
    title: "4. Pesanan Diproses & Dikirim",
    description: "Setelah pembayaran dikonfirmasi, pesanan Anda akan segera kami proses dan siapkan untuk pengiriman sesuai jadwal."
  }
];

export default function CaraPesanPage() {
  return (
    <main className="bg-gray-50 py-16">
      <div className="container mx-auto px-6">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Cara Melakukan Pemesanan</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Hanya dengan beberapa langkah mudah, Anda sudah bisa menikmati kelezatan dari Dapur Mama.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md text-center">
              <step.icon className="w-16 h-16 mx-auto text-blue-500" />
              <h2 className="mt-6 text-2xl font-bold text-gray-800">{step.title}</h2>
              <p className="mt-2 text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
