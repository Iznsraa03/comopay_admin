import { type Transaction } from "../../types";
import { ArrowDownLeft, ArrowUpRight, Clock, CheckCircle2, XCircle } from "lucide-react";

export default function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "pending": return <Clock className="w-4 h-4 text-amber-500" />;
      case "failed": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success": 
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Sukses</span>;
      case "pending": 
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Tertunda</span>;
      case "failed": 
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Gagal</span>;
      default: return null;
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-800/60 bg-[#0A0A0B]">
      <div className="p-6 border-b border-zinc-800/60 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Transaksi Terbaru</h3>
          <p className="text-sm text-zinc-400 mt-1">50 entri buku besar terbaru melalui gateway Midtrans</p>
        </div>
        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
          Lihat Semua
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-900/50 text-zinc-400">
            <tr>
              <th className="px-6 py-4 font-medium">Transaksi</th>
              <th className="px-6 py-4 font-medium">Komunitas</th>
              <th className="px-6 py-4 font-medium">Tanggal</th>
              <th className="px-6 py-4 font-medium">Nominal</th>
              <th className="px-6 py-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
            {transactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-zinc-800/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      trx.type === "income" ? "bg-emerald-500/10" : "bg-red-500/10"
                    }`}>
                      {trx.type === "income" ? (
                        <ArrowDownLeft className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-zinc-200">{trx.id}</p>
                      <p className="text-xs text-zinc-500">{trx.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  {trx.communityName || "-"}
                </td>
                <td className="px-6 py-4 text-zinc-400">
                  {formatDate(trx.date)}
                </td>
                <td className="px-6 py-4">
                  <span className={`font-medium ${
                    trx.type === "income" ? "text-emerald-400" : "text-white"
                  }`}>
                    {trx.type === "income" ? "+" : "-"}{formatCurrency(trx.amount)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {getStatusBadge(trx.status)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
