# COMOPAY Admin Panel

Dashboard administrasi untuk platform **COMOPAY**, dibangun menggunakan Next.js 14. Dashboard ini memungkinkan administrator untuk mengelola instansi lapangan, memantau transaksi keuangan, dan melihat pertumbuhan pengguna.

## 🚀 Fitur Utama

- **Dashboard Real-time**: Statistik pendapatan, saldo wallet sistem, dan performa pembayaran Midtrans.
- **Manajemen Lapangan (Kapasitas)**:
    - Menambah lapangan baru dengan input kapasitas unit.
    - Upload foto lapangan langsung ke server.
    - Manajemen harga sewa dinamis.
- **Audit Transaksi**: Daftar seluruh mutasi saldo (Top-up & Pembayaran) di dalam sistem.
- **Manajemen User**: Melihat daftar pengguna dan komunitas yang aktif.

## 🛠️ Stack Teknologi

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Types**: TypeScript

## 🏁 Memulai

### Prasyarat
- Node.js versi 18+

### Instalasi & Menjalankan
1. Install dependensi:
   ```bash
   npm install
   ```
2. Jalankan server development:
   ```bash
   npm run dev
   ```
3. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

## 📁 Struktur Folder
- `src/components/ui`: Komponen UI reusable (Modal, Table, Stats, dll).
- `app/dashboard`: Halaman utama dan submodule admin.
- `src/lib/api.ts`: Helper API untuk komunikasi dengan Backend.

---
*Bagian dari ekosistem COMOPAY.*
