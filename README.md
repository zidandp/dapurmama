# DapurMama - Manajemen Produk (CRUD)

Aplikasi ini menyediakan fitur CRUD (Create, Read, Update, Delete) untuk produk, baik untuk admin maupun katalog publik.

---

## 1. Prasyarat

- Node.js v18+ (disarankan)
- pnpm (jika belum ada, install dengan: `npm install -g pnpm`)
- Database PostgreSQL (bisa pakai Neon, Supabase, atau lokal)

---

## 2. Instalasi Dependensi

```bash
npm install
```

---

## 3. Setup Database

1. **Buat database PostgreSQL** dan pastikan sudah berjalan.
2. **Jalankan migrasi** untuk membuat tabel produk:

   - Jika menggunakan CLI, jalankan perintah SQL berikut di database Anda:
     ```sql
     CREATE TABLE products (
         id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
         name VARCHAR(255) NOT NULL,
         description TEXT NOT NULL,
         price DECIMAL(10, 2) NOT NULL,
         image_url VARCHAR(255) NOT NULL,
         category VARCHAR(100) NOT NULL,
         is_available BOOLEAN DEFAULT true,
         created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
         updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
     );
     ```

3. **Atur environment variable** untuk koneksi database di file `.env`:
   ```
   DATABASE_URL=postgresql://username:password@host:port/database
   ```

---

## 4. Jalankan Server Pengembangan

```bash
pnpm dev
```

---

## 5. Akses Halaman Admin

Buka browser dan akses:

[http://localhost:3000/admin/product](http://localhost:3000/admin/product)

Di halaman ini, Anda dapat:

- Melihat semua produk
- Menambah produk baru
- Mengedit produk
- Menghapus produk

---

## 6. Lihat Katalog Produk Publik

Setiap perubahan di admin akan langsung tampil di katalog publik:

[http://localhost:3000/produk](http://localhost:3000/produk)

---

## 7. Struktur Data Produk

Data produk yang digunakan di API dan database memiliki struktur berikut:

```ts
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  isAvailable: boolean;
}
```

---

## 8. Troubleshooting

- Jika produk tidak muncul, pastikan koneksi database dan struktur tabel sudah benar.
- Jika ada error 500 saat tambah/edit produk, cek apakah kolom di database sudah sesuai dengan field pada kode backend.
- Untuk development, gunakan browser console dan terminal untuk melihat error detail.

---

**Selamat mencoba!.**
