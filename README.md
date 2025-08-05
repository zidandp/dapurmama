# Dapur Mama - Sistem Manajemen Pre-Order

![Dapur Mama Hero Image](https://placehold.co/1200x630/3B82F6/FFFFFF?text=Dapur%20Mama)

**Dapur Mama** adalah aplikasi web full-stack yang dibangun dengan Next.js, dirancang untuk mendigitalisasi dan menyederhanakan proses manajemen Pre-Order (PO) untuk usaha kuliner rumahan. Aplikasi ini menggantikan pencatatan manual di spreadsheet dengan sebuah dasbor admin yang intuitif dan menyediakan etalase produk yang menarik bagi pelanggan.

**[➡️ Kunjungi Live Demo](https://dmdapurmama.vercel.app/)**

---

## 🚀 Fitur Utama

Aplikasi ini memiliki dua alur pengguna utama: Admin (Pengelola) dan Pelanggan.

### Untuk Admin (Area Terproteksi)

- **🔐 Autentikasi Aman:** Sistem registrasi admin dilindungi oleh kode undangan rahasia dan login menggunakan JWT (JSON Web Tokens).
- **📊 Dasbor Utama:** Menampilkan ringkasan data penting (akan dikembangkan).
- **🍰 CRUD Manajemen Produk:** Fitur lengkap untuk menambah, melihat, mengedit, dan menghapus data master produk yang akan dijual. **(Memenuhi Syarat CRUD #1)**
- **🗓️ CRUD Manajemen Sesi PO:** Fitur lengkap untuk membuat "event" Pre-Order, menentukan periode aktif, dan memilih produk apa saja yang tersedia di sesi tersebut. **(Memenuhi Syarat CRUD #2)**
- **📦 Manajemen Pesanan:** Melihat daftar pesanan yang masuk dari pelanggan dan mengubah statusnya (akan dikembangkan).

### Untuk Pelanggan

- **🛍️ Katalog Dinamis:** Menampilkan Sesi PO yang sedang aktif dan produk yang tersedia berdasarkan data dari database.
- **🛒 Keranjang Belanja:** Pelanggan dapat menambahkan beberapa produk ke keranjang belanja.
- **💨 Alur Pemesanan Cepat:** Proses checkout sebagai tamu (_guest checkout_) yang mudah, hanya memerlukan nama dan nomor WhatsApp.
- **📄 Halaman Informasi:** Halaman statis seperti "Tentang Kami" dan "Kontak".

---

## 🛠️ Teknologi yang Digunakan

Proyek ini dibangun menggunakan tumpukan teknologi modern yang berfokus pada pengalaman developer dan performa.

| Kategori | Teknologi -
| **Framework** | Next.js 14 (App Router), React 18 -
| **Styling** | Tailwind CSS, shadcn/ui -
| **Database** | Vercel Postgres (Neon) & Prisma ORM -
| **Autentikasi** | JWT (Custom Implementation), bcrypt -
| **Deployment** | Vercel -

---

## 📖 Panduan untuk Reviewer

Untuk memudahkan proses review, berikut adalah panduan untuk memeriksa fungsionalitas utama sesuai dengan persyaratan tugas akhir.

### Kredensial & Setup Awal

1.  **Registrasi Admin:**
    - Buka halaman `/admin/register` (atau path registrasi yang sesuai).
    - Lakukan registrasi dengan email dan password Anda.
    - Anda akan membutuhkan **Kode Undangan Admin** yang tersimpan di file `.env` dengan key `ADMIN_INVITATION_CODE`.
2.  **Login Admin:**
    - Buka halaman `/admin/login`.
    - Masuk menggunakan akun yang baru saja Anda buat.

### Verifikasi Fitur Wajib

#### 1. CRUD #1: Manajemen Produk

- **Lokasi:** `/admin/produk`
- **Create:** Gunakan tombol "Tambah Produk Baru" untuk membuat produk baru. Isi semua field dan simpan. Verifikasi data baru muncul di tabel.
- **Read:** Pastikan semua produk dari database ditampilkan dengan benar di dalam tabel.
- **Update:** Gunakan tombol "Edit" pada salah satu produk. Ubah nama atau harganya, lalu simpan. Verifikasi perubahan tersebut di tabel.
- **Delete:** Gunakan tombol "Hapus" pada salah satu produk. Konfirmasi penghapusan dan verifikasi produk tersebut hilang dari tabel.

#### 2. CRUD #2: Manajemen Sesi PO

- **Lokasi:** `/admin/po-sessions`
- **Create:** Gunakan tombol "Buat Sesi PO Baru". Beri nama sesi, tentukan tanggal mulai dan selesai, dan pilih beberapa produk dari daftar yang tersedia. Simpan sesi.
- **Read:** Pastikan sesi PO yang baru dibuat muncul di tabel.
- **Update:** Gunakan tombol "Edit". Ubah nama sesi atau tambahkan/hapus produk yang dijual, lalu simpan. Verifikasi perubahannya.
- **Delete:** Gunakan tombol "Hapus" pada salah satu sesi PO dan verifikasi sesi tersebut hilang dari tabel.

#### 3. Alur Pemesanan Pelanggan (Guest Checkout)

- **Lokasi:** `/katalog`
- **Read:** Pastikan halaman katalog menampilkan Sesi PO yang berstatus "AKTIF".
- **Create (Order):**
  - Klik salah satu Sesi PO.
  - Tambahkan beberapa item ke keranjang belanja.
  - Buka keranjang, lalu lanjutkan ke proses checkout.
  - Isi form pemesanan (Nama & No. WhatsApp) dan kirim pesanan.
  - Verifikasi bahwa Anda diarahkan ke halaman konfirmasi.
- **Verifikasi di Admin:** Kembali ke dasbor admin, buka halaman manajemen pesanan (jika sudah ada) dan pastikan pesanan baru dari guest tadi tercatat di sistem.

---

## 🚀 Menjalankan Proyek Secara Lokal

Berikut adalah panduan untuk setup dan menjalankan proyek ini di lingkungan lokal.

### Prasyarat

- Node.js (v18 atau lebih baru)
- pnpm (atau package manager lain, namun `pnpm-lock.yaml` tersedia)
- Akun Vercel dan Neon untuk database PostgreSQL

### Langkah-langkah Instalasi

1.  **Clone repository:**

    ```bash
    git clone [https://github.com/URL_REPO_ANDA.git](https://github.com/URL_REPO_ANDA.git)
    cd dapurmama
    ```

2.  **Install dependensi:**

    ```bash
    pnpm install
    ```

3.  **Setup Environment Variables:**

    - Buat salinan dari `.env.example` dan beri nama `.env`.
      ```bash
      cp .env.example .env
      ```
    - Isi semua variabel yang dibutuhkan di dalam file `.env`, terutama `DATABASE_URL` dari Vercel/Neon dan `ADMIN_INVITATION_CODE` (buat kode rahasia Anda sendiri).

4.  **Migrasi Database:**

    - Jalankan perintah Prisma untuk menyinkronkan skema Anda dengan database Neon. Ini akan membuat semua tabel yang dibutuhkan.
      ```bash
      pnpm prisma migrate dev
      ```

5.  **(Opsional) Seed Database:**

    - Jika Anda ingin mengisi database dengan data awal, jalankan seed script.
      ```bash
      pnpm prisma db seed
      ```

6.  **Jalankan Server Development:**
    ```bash
    pnpm dev
    ```
    Aplikasi sekarang akan berjalan di `http://localhost:3000`.

---

## 📂 Struktur Proyek

- **`/app/admin`**: Berisi semua halaman dan layout yang dilindungi untuk dasbor admin.
- **`/app/api`**: Berisi semua API Route untuk backend, diorganisir berdasarkan resource (products, orders, dll).
- **`/app/(publik)`**: Berisi semua halaman publik yang bisa diakses oleh pelanggan (Home, Katalog, Tentang, dll).
- **`/components`**: Berisi semua komponen React yang digunakan ulang, diorganisir berdasarkan fitur atau kategori (layout, ui, products, dll).
- **`/lib`**: Berisi logika bisnis, koneksi database (Prisma client), definisi tipe, dan fungsi utilitas.
- **`/prisma`**: Berisi skema database (`schema.prisma`) dan file migrasi.

---

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file `LICENSE` untuk detail lebih lanjut.
