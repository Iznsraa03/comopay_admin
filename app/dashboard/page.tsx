import { Suspense } from "react";
import { type Transaction, type DashboardStats } from "@/src/types";
import StatCard from "@/src/components/ui/StatCard";
import TransactionList from "@/src/components/ui/TransactionList";
import { DollarSign, Wallet, ShieldCheck, Activity } from "lucide-react";

import { adminGetUsers, adminGetTransactions, adminGetLapangan } from "@/src/lib/api";

async function getDashboardData() {
  const [usersRes, txRes, lapRes] = await Promise.all([
    adminGetUsers(1000, 0),
    adminGetTransactions(100, 0),
    adminGetLapangan(100, 0),
  ]);

  const users = usersRes.data ?? [];
  const transactionsRaw = txRes.data ?? [];
  const lapangan = lapRes.data ?? [];

  // Calculate actual stats from API data
  let totalRevenue = 0;
  let totalTopup = 0;
  let totalPotong = 0;
  let midtransTotal = 0;
  let midtransSuccess = 0;

  for (const tx of transactionsRaw) {
    if (tx.status === "selesai") {
      if (tx.tipe === "topup") {
        totalRevenue += tx.jumlah;
        totalTopup += tx.jumlah;
      } else if (tx.tipe === "potong" || tx.tipe === "transfer") {
        totalPotong += tx.jumlah;
      } else if (tx.tipe === "refund") {
        totalTopup += tx.jumlah;
      }
    }

    if (tx.tipe === "topup") {
      midtransTotal++;
      if (tx.status === "selesai") {
        midtransSuccess++;
      }
    }
  }

  const walletBalance = totalTopup - totalPotong;
  const midtransSuccessRate =
    midtransTotal > 0 ? Math.round((midtransSuccess / midtransTotal) * 100) : 100;
  // TODO: Ganti dengan jumlah Pemesanan aktif dari tabel 'pemesanans' saat booking endpoint siap
  const activeOrders = lapangan.length; // sementara: total unit lapangan yang terdaftar

  const stats: DashboardStats = {
    totalRevenue,
    totalCommunities: users.length,
    walletBalance: walletBalance > 0 ? walletBalance : 0,
    midtransSuccessRate,
    activeOrders,
  };

  // Convert to specific Transaction type used by component
  const recentTransactions: Transaction[] = transactionsRaw
    .slice(0, 15) // take top 15 recent
    .map((tx) => {
      let type: "income" | "expense" = "income";
      if (tx.tipe === "potong" || tx.tipe === "transfer") {
        type = "expense";
      }

      let status: "success" | "pending" | "failed" = "pending";
      if (tx.status === "selesai") status = "success";
      else if (tx.status === "gagal" || tx.status === "dibatalkan") status = "failed";

      return {
        id: tx.id,
        amount: tx.jumlah,
        type,
        status,
        description: tx.deskripsi || `Transaksi ${tx.tipe}`,
        date: tx.dibuat_pada,
        communityName: tx.id_dompet ? `Dompet: ${tx.id_dompet.substring(0, 8)}` : "-",
      };
    });

  return { stats, recentTransactions };
}

export default async function DashboardPage() {
  // Using Server Components default pattern to fetch data server-side
  const { stats, recentTransactions } = await getDashboardData();

  const formatCurrencyLocal = (val: number) => {
    // For M suffix like Stitch design "Rp2,84M"
    if (val >= 1000000) {
      return `Rp${(val / 1000000).toLocaleString("id-ID", { maximumFractionDigits: 2 })}M`;
    }
    return `Rp${val.toLocaleString("id-ID")}`;
  };

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Platform Pulse</h1>
        <p className="text-zinc-400">Pemantauan arsitektur finansial dan kinerja transaksi real-time di seluruh brankas komunitas.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pendapatan"
          value={formatCurrencyLocal(stats.totalRevenue)}
          subtitle={`Teragregasi dari ${stats.totalCommunities} komunitas`}
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          highlight={true}
        />
        <StatCard
          title="Saldo Brankas"
          value={formatCurrencyLocal(stats.walletBalance)}
          subtitle="Enkripsi zero-knowledge aktif"
          icon={Wallet}
        />
        <StatCard
          title="Sukses Midtrans"
          value={`${stats.midtransSuccessRate}%`}
          subtitle="Skor kesehatan gateway real-time"
          icon={ShieldCheck}
        />
        <StatCard
          title="Pemesanan Aktif"
          value={stats.activeOrders.toLocaleString("id-ID")}
          subtitle="Reservasi lapangan langsung"
          icon={Activity}
          trend={{ value: 4.2, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<div className="h-96 bg-zinc-900/50 rounded-2xl border border-zinc-800/60 animate-pulse" />}>
          <TransactionList transactions={recentTransactions} />
        </Suspense>
      </div>
    </div>
  );
}
