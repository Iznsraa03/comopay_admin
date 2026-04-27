import { adminGetTransactions } from "@/src/lib/api";
import type { Transaksi } from "@/src/types";

export const metadata = { title: "Transaksi | COMOPAY Admin" };

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  selesai: {
    label: "Selesai",
    cls: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50",
  },
  tertunda: {
    label: "Tertunda",
    cls: "bg-amber-950/60 text-amber-400 border-amber-800/50",
  },
  gagal: {
    label: "Gagal",
    cls: "bg-red-950/60 text-red-400 border-red-800/50",
  },
  dibatalkan: {
    label: "Dibatalkan",
    cls: "bg-zinc-800 text-zinc-400 border-zinc-700",
  },
};

export default async function TransactionsPage() {
  const result = await adminGetTransactions();
  const txs: Transaksi[] = result.data ?? [];

  const formatRupiah = (val: number) =>
    val.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Riwayat Transaksi
        </h1>
        <p className="text-zinc-400 mt-1">
          Semua mutasi dana di seluruh dompet sistem.
        </p>
      </div>

      {!result.ok && (
        <div className="rounded-xl border border-red-800/60 bg-red-950/40 px-6 py-4 text-red-400 text-sm">
          ⚠ Gagal memuat data: {result.error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800/60">
              <th className={thCls}>ID</th>
              <th className={thCls}>Tipe</th>
              <th className={thCls}>Jumlah</th>
              <th className={thCls}>Status</th>
              <th className={thCls}>Deskripsi</th>
              <th className={thCls}>Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {txs.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-zinc-500">
                  Belum ada transaksi.
                </td>
              </tr>
            ) : (
              txs.map((tx) => {
                const badge = STATUS_MAP[tx.status] ?? {
                  label: tx.status,
                  cls: "bg-zinc-800 text-zinc-400 border-zinc-700",
                };
                return (
                  <tr
                    key={tx.id}
                    className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/20 transition-colors"
                  >
                    <td className={tdCls + " font-mono text-zinc-500 text-xs"}>
                      {tx.id.slice(0, 8)}…
                    </td>
                    <td className={tdCls}>
                      <span className="capitalize text-zinc-300">{tx.tipe}</span>
                    </td>
                    <td
                      className={`${tdCls} font-mono font-semibold ${
                        tx.tipe === "topup" || tx.tipe === "refund"
                          ? "text-emerald-400"
                          : "text-red-400"
                      }`}
                    >
                      {formatRupiah(tx.jumlah)}
                    </td>
                    <td className={tdCls}>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${badge.cls}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className={tdCls + " text-zinc-400"}>
                      {tx.deskripsi || "—"}
                    </td>
                    <td className={tdCls + " text-zinc-500"}>
                      {new Date(tx.dibuat_pada).toLocaleDateString("id-ID")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thCls =
  "px-5 py-3.5 text-left font-medium text-zinc-400 text-xs uppercase tracking-wide";
const tdCls = "px-5 py-4";
