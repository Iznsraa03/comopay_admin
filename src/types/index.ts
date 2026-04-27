// ── API Wrapper ───────────────────────────────────────────────────────────────
export interface APIResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Mirror of the Go backend API response shape (uses "sukses" + "data")
export interface BackendResponse<T> {
  sukses: boolean;
  data?: T;
  pesan?: string;
}

// ── Entities ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  nama: string;
  email: string;
  nomor_telepon: string;
  peran: "user" | "admin";
  id_komunitas: string | null;
  dibuat_pada: string;
  diperbarui_pada: string;
}


export interface Lapangan {
  id: string;
  nama: string;
  lokasi?: string; // opsional — sistem satu tempat olahraga
  fasilitas: string;
  harga_sewa_per_jam: number;
  gambar_url: string;
  kapasitas: number; // jumlah unit lapangan yang tersedia
  dibuat_pada: string;
  diperbarui_pada: string;
}

export type StatusTransaksi = "tertunda" | "selesai" | "gagal" | "dibatalkan";
export type TipeTransaksi = "topup" | "potong" | "refund" | "transfer";

export interface Transaksi {
  id: string;
  id_dompet: string;
  tipe: TipeTransaksi;
  status: StatusTransaksi;
  jumlah: number;
  id_referensi: string | null;
  deskripsi: string;
  id_pesanan_midtrans: string | null;
  dibuat_pada: string;
  diperbarui_pada: string;
}

// ── Dashboard Stats ───────────────────────────────────────────────────────────
export interface DashboardStats {
  totalRevenue: number;
  totalCommunities: number;
  walletBalance: number;
  midtransSuccessRate: number;
  activeOrders: number;
}

// Kept for backward compatibility with dashboard mock data
export interface Transaction {
  id: string;
  amount: number;
  type: "income" | "expense";
  status: "success" | "pending" | "failed";
  description: string;
  date: string;
  communityId?: string;
  communityName?: string;
}
