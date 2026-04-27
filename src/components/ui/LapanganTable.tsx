"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Lapangan } from "@/src/types";
import { adminDeleteLapangan } from "@/src/lib/api";

interface Props {
  lapangan: Lapangan[];
  onEdit: (lap: Lapangan) => void;
}

export default function LapanganTable({ lapangan, onEdit }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatRupiah = (val: number) =>
    val.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });

  const handleDelete = (id: string, nama: string) => {
    if (
      !confirm(`Hapus lapangan "${nama}"? Tindakan ini tidak dapat dibatalkan.`)
    )
      return;

    setDeletingId(id);
    startTransition(async () => {
      await adminDeleteLapangan(id);
      setDeletingId(null);
      router.refresh();
    });
  };

  if (lapangan.length === 0) {
    return (
      <div className="rounded-2xl border border-zinc-800/60 bg-zinc-900/40 py-16 text-center text-zinc-500">
        Belum ada lapangan yang terdaftar.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-800/60">
            <th className={thCls}>Lapangan</th>
            <th className={thCls}>Harga / Jam</th>
            <th className={thCls}>Kapasitas</th>
            <th className={thCls + " text-right"}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {lapangan.map((lap) => (
            <tr
              key={lap.id}
              className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/20 transition-colors"
            >
              {/* Nama + Fasilitas + Gambar */}
              <td className={tdCls}>
                <div className="flex items-center gap-3">
                  {lap.gambar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={lap.gambar_url}
                      alt={lap.nama}
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-zinc-700"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                      <svg
                        className="w-5 h-5 text-zinc-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-white">{lap.nama}</div>
                    <div className="text-xs text-zinc-500 truncate max-w-[200px]">
                      {lap.fasilitas || "—"}
                    </div>
                  </div>
                </div>
              </td>

              {/* Harga */}
              <td className={tdCls + " text-zinc-300 font-mono"}>
                {formatRupiah(lap.harga_sewa_per_jam)}
              </td>

              {/* Kapasitas */}
              <td className={tdCls}>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-950/60 text-blue-300 border border-blue-800/50">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {lap.kapasitas ?? 1} Unit
                </span>
              </td>

              {/* Aksi */}
              <td className={tdCls + " text-right"}>
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onEdit(lap)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-700 hover:border-blue-600 text-zinc-300 hover:text-blue-400 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(lap.id, lap.nama)}
                    disabled={isPending && deletingId === lap.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-700 hover:border-red-600 text-zinc-300 hover:text-red-400 disabled:opacity-50 transition-colors"
                  >
                    {deletingId === lap.id ? "…" : "Hapus"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



const thCls =
  "px-5 py-3.5 text-left font-medium text-zinc-400 text-xs uppercase tracking-wide";
const tdCls = "px-5 py-4";
