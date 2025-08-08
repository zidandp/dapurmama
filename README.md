# Dapur Mama - Sistem Manajemen Pre-Order

![Dapur Mama Hero Image](https://placehold.co/1200x630/3B82F6/FFFFFF?text=Dapur%20Mama)

**Dapur Mama** adalah aplikasi web full-stack yang dibangun dengan Next.js, dirancang untuk mendigitalisasi dan menyederhanakan proses manajemen Pre-Order (PO) untuk usaha kuliner rumahan. Aplikasi ini menggantikan pencatatan manual di spreadsheet dengan sebuah dasbor admin yang intuitif dan menyediakan etalase produk yang menarik bagi pelanggan.

**[➡️ Kunjungi Live Demo](https://dmdapurmama.vercel.app/)**

---

## 🚀 Fitur yang Sudah Tersedia

Aplikasi ini memiliki dua alur pengguna utama: Admin (Pengelola) dan Pelanggan.

### 🔧 Untuk Admin (Area Terproteksi)

#### ✅ Fitur yang Sudah Implementasi Lengkap:

- **🔐 Autentikasi Aman:**

  - Registrasi admin dengan kode undangan rahasia
  - Login menggunakan JWT (JSON Web Tokens)
  - **Akses:** `/admin` → otomatis redirect ke dashboard/login

- **📊 Dashboard Analytics:**

  - Overview statistik bisnis (total produk, sesi PO aktif, pesanan hari ini, revenue)
  - Grafik tren penjualan 7 hari terakhir
  - Chart distribusi status pesanan
  - Top 5 produk terlaris
  - 5 pesanan terbaru
  - **Akses:** `/admin/dashboard`

- **🍰 CRUD Manajemen Produk (LENGKAP):**

  - Create: Tambah produk baru dengan foto, nama, harga, deskripsi, kategori
  - Read: Tampilan tabel dengan pagination, sorting, dan search
  - Update: Edit semua data produk
  - Delete: Hapus produk dengan konfirmasi
  - **Akses:** `/admin/produk`

- **🗓️ CRUD Manajemen Sesi PO (LENGKAP):**

  - Create: Buat sesi PO baru dengan nama, periode aktif, dan pilih produk
  - Read: Tabel sesi PO dengan status (DRAFT/ACTIVE/CLOSED)
  - Update: Edit nama, tanggal, status, dan produk yang dijual
  - Delete: Hapus sesi PO dengan konfirmasi
  - **Akses:** `/admin/po-sessions`

- **📦 CRUD Manajemen Pesanan (LENGKAP):**
  - Read: Tabel semua pesanan dengan detail lengkap
  - Update: Ubah status pesanan (PENDING → CONFIRMED → PROCESSING → READY → COMPLETED)
  - Delete: Hapus pesanan dengan konfirmasi
  - Filter berdasarkan status dan tanggal
  - **Akses:** `/admin/orders`

### 🛍️ Untuk Pelanggan (Area Publik)

#### ✅ Fitur yang Sudah Implementasi Lengkap:

- **🏠 Halaman Beranda:**

  - Hero section dengan CTA
  - Kategori produk
  - Testimonial pelanggan
  - **Akses:** `/`

- **🛍️ Katalog Produk:**

  - Menampilkan semua produk yang tersedia
  - Filter berdasarkan kategori
  - Search produk
  - **Akses:** `/katalog`

- **🛒 Keranjang Belanja:**

  - Tambah/kurang quantity produk
  - Hapus item dari keranjang
  - Hitung total otomatis
  - Persistent cart (tersimpan di localStorage)
  - **Akses:** Icon keranjang di header

- **📝 Proses Pemesanan (Guest Checkout):**

  - Form isian nama, nomor telepon, alamat, dan catatan
  - Validasi form lengkap
  - Generate nomor pesanan otomatis (format: DM-YYMMDD-XXXX)
  - Konfirmasi pesanan berhasil
  - **Akses:** Dari keranjang → "Lanjut ke Checkout"

- **🔍 Lacak Pesanan:**

  - Input nomor pesanan untuk tracking
  - Timeline visual status pesanan
  - Detail pesanan dan item
  - Estimasi waktu selesai
  - **Akses:** `/track` atau link "Lacak Pesanan" di header

- **📄 Halaman Informasi:**
  - **Tentang Kami:** `/tentang`
  - **Kontak:** `/kontak`

---

## 🎯 Cara Mengakses & Testing

### 👨‍💼 Testing Area Admin

1. **Akses Admin Panel:**

   ```
   Buka: /admin
   (Otomatis redirect ke login jika belum masuk)
   ```

2. **Login Admin:**

   - Email: `admin@example.com`
   - Password: `admin123`
   - Atau buat akun baru di `/admin/register` dengan kode undangan

3. **Testing CRUD Operations:**

   **a. Manajemen Produk (`/admin/produk`):**

   - ✅ Create: Klik "Tambah Produk" → isi form → simpan
   - ✅ Read: Lihat tabel produk dengan pagination & search
   - ✅ Update: Klik "Edit" → ubah data → simpan
   - ✅ Delete: Klik "Hapus" → konfirmasi

   **b. Manajemen Sesi PO (`/admin/po-sessions`):**

   - ✅ Create: Klik "Buat Sesi PO" → set nama, tanggal, pilih produk
   - ✅ Read: Lihat semua sesi dengan status
   - ✅ Update: Edit sesi → ubah status ke ACTIVE
   - ✅ Delete: Hapus sesi yang tidak diperlukan

   **c. Manajemen Pesanan (`/admin/orders`):**

   - ✅ Read: Lihat semua pesanan masuk
   - ✅ Update: Ubah status pesanan dari PENDING → COMPLETED
   - ✅ Delete: Hapus pesanan tertentu

### 🛒 Testing Area Pelanggan

1. **Browse Produk:**

   ```
   Beranda: /
   Katalog: /katalog
   ```

2. **Proses Pemesanan Lengkap:**

   - Buka `/katalog`
   - Pilih beberapa produk → tambah ke keranjang
   - Klik icon keranjang di header
   - Klik "Lanjut ke Checkout"
   - Isi form pemesanan → submit
   - Catat nomor pesanan yang muncul

3. **Lacak Pesanan:**

   - Buka `/track`
   - Masukkan nomor pesanan (format: DM-YYMMDD-XXXX)
   - Lihat detail dan timeline status

4. **Testing Flow Lengkap:**
   ```
   Customer: Buat pesanan → dapatkan nomor pesanan
   Admin: Lihat pesanan baru di /admin/orders → ubah status
   Customer: Track pesanan → lihat perubahan status
   ```

---

## 🛠️ Teknologi yang Digunakan

| Kategori             | Teknologi                           |
| -------------------- | ----------------------------------- |
| **Framework**        | Next.js 14 (App Router), React 18   |
| **Styling**          | Tailwind CSS, shadcn/ui             |
| **Database**         | Vercel Postgres (Neon) & Prisma ORM |
| **Autentikasi**      | JWT (Custom Implementation), bcrypt |
| **State Management** | React Context (Cart, Auth)          |
| **Form Handling**    | React Hook Form + Zod validation    |
| **Deployment**       | Vercel                              |

---

## 🚀 Menjalankan Proyek Secara Lokal

### Prasyarat

- Node.js (v18 atau lebih baru)
- pnpm (atau npm/yarn)
- Database PostgreSQL (bisa pakai Neon/Vercel)

### Langkah-langkah Instalasi

1. **Clone repository:**

   ```bash
   git clone [https://github.com/zidandp/dapurmama.git]
   cd dapurmama
   ```

2. **Install dependensi:**

   ```bash
   npm install
   ```

3. **Setup Environment Variables:**

   ```bash
   cp .env.example .env
   ```

   Isi variabel di `.env`:

   **📋 Cara mendapatkan konfigurasi database:**

   1. **Buat akun di [Neon](https://neon.tech)**
   2. **Buat database baru** di dashboard Neon
   3. **Copy connection strings** dari dashboard Neon
   4. **Ganti semua placeholder** (`your_user`, `your_password`, dll) dengan nilai sebenarnya dari Neon

4. **Setup Database:**

   ```bash
   pnpm prisma migrate dev
   pnpm prisma db seed    # (opsional, untuk data awal)
   ```

5. **Jalankan Development Server:**
   ```bash
   pnpm dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`

---

## 📂 Struktur Proyek

```
├── app/
│   ├── admin/           # Protected admin area
│   │   ├── dashboard/   # Analytics dashboard
│   │   ├── produk/      # Product management
│   │   ├── po-sessions/ # PO session management
│   │   ├── orders/      # Order management
│   │   └── login/       # Admin authentication
│   ├── api/             # Backend API routes
│   ├── track/           # Public order tracking
│   ├── katalog/         # Product catalog
│   ├── tentang/         # About page
│   └── kontak/          # Contact page
├── components/          # Reusable React components
├── lib/                 # Business logic & utilities
├── prisma/              # Database schema & migrations
└── hooks/               # Custom React hooks
```

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.
