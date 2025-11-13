# 🧾 Inventaris UMKM — Frontend

Aplikasi inventaris untuk membantu pelaku UMKM dalam melakukan pencatatan dan pemantauan stok barang.  
Dibuat menggunakan React + Vite dengan dukungan Tailwind CSS dan shadcn/ui.

---

## 📂 Struktur Folder

### `src/`
Tempat semua **source code utama**.  
Semua yang akan dikompilasi dan ditampilkan di browser berada di sini.  
Di dalamnya kamu membuat **komponen, halaman, styling, routing**, dan sebagainya.

---

### `assets/`
Menyimpan **file statis** seperti gambar, logo, ikon, font, atau video.  
Contoh: `react.svg`, `vite.svg`, atau `logo-umkm.png`.

---

### `components/`
Berisi **potongan UI kecil (reusable components)** yang bisa digunakan berulang.  
Contoh: `Button.jsx`, `Card.jsx`, `Modal.jsx`, dll.

---

### `pages/`
Berisi **halaman besar** yang mewakili satu URL/route tertentu.  
Contoh:
- `/dashboard` → `Dashboard.jsx`
- `/barang` → `Barang.jsx`
- `/laporan` → `Laporan.jsx`

---

### `layouts/`
Berisi **struktur tampilan utama** yang membungkus semua halaman.  
Biasanya terdiri dari Sidebar, Navbar, dan konten halaman.  
Contoh: `MainLayout.jsx`.

---

### `routes/`
Berisi konfigurasi **rute (routing)** antar halaman.  
Menghubungkan URL ke komponen halaman.  
Contoh: `/barang` → `BarangPage`.

---

### `lib/`
Berisi **fungsi bantu (helper)**, konfigurasi, atau logika kecil.  
Misalnya:
- Konfigurasi `axios` untuk API.
- Fungsi `formatDate()`.
- Fungsi validasi sederhana.

---

### `.env` / `.env.example`
Berisi **konfigurasi rahasia** atau yang berbeda antar environment (development, staging, production).  
Contoh:
```env
VITE_API_BASE_URL=https://api.inventaris-umkm.my.id

## Tech Stack 
- React + Vite 
- Tailwind CSS 
- shadcn/ui 
- React Router 
- Axios


