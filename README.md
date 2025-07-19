# Cara Mengakses Halaman Manajemen Produk (CRUD)

Untuk meninjau dan menguji fungsionalitas Create, Read, Update, dan Delete (CRUD) pada produk, ikuti langkah-langkah berikut:

### 1. Instalasi Dependensi

Pastikan Anda memiliki `pnpm` terinstal. Jika belum, Anda bisa menginstalnya dengan `npm install -g pnpm`. Kemudian, instal dependensi proyek:

```bash
pnpm install
```

### 2. Jalankan Server Pengembangan

Setelah instalasi selesai, jalankan server pengembangan Next.js:

```bash
pnpm dev
```

### 3. Akses Halaman Admin

Buka browser Anda dan navigasikan ke alamat berikut:

**[http://localhost:3000/admin/produk](http://localhost:3000/admin/produk)**

Di halaman ini, Anda dapat melakukan operasi berikut:

- **Melihat semua produk** yang ada.
- **Menambah produk baru** dengan mengklik tombol "+ Tambah Produk Baru".
- **Mengedit produk** yang sudah ada dengan mengklik tombol "Edit" pada baris produk yang bersangkutan.
- **Menghapus produk** dengan mengklik tombol "Hapus".

### 4. Verifikasi di Halaman Publik

Setiap perubahan yang Anda buat di halaman admin (tambah, edit, hapus) akan langsung terlihat di halaman katalog produk publik yang dapat diakses di:

**[http://localhost:3000/produk](http://localhost:3000/produk)**
