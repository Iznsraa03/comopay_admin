"use client";

import { useState, useEffect, useTransition } from "react";
import { adminGetLapangan } from "@/src/lib/api";
import type { Lapangan } from "@/src/types";
import LapanganTable from "@/src/components/ui/LapanganTable";
import LapanganModal from "@/src/components/ui/LapanganModal";

export default function LapanganPage() {
  const [lapangan, setLapangan] = useState<Lapangan[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isFetching, startFetch] = useTransition();

  // State modal
  const [modalMode, setModalMode] = useState<"tambah" | "edit" | null>(null);
  const [selectedLapangan, setSelectedLapangan] = useState<Lapangan | null>(null);

  const loadData = () => {
    startFetch(async () => {
      const result = await adminGetLapangan();
      if (!result.ok) {
        setFetchError(result.error ?? "Gagal memuat data.");
      } else {
        setFetchError(null);
        setLapangan(result.data ?? []);
      }
    });
  };

  useEffect(() => {
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openTambah = () => {
    setSelectedLapangan(null);
    setModalMode("tambah");
  };

  const openEdit = (lap: Lapangan) => {
    setSelectedLapangan(lap);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setSelectedLapangan(null);
    // Reload data setelah modal ditutup
    loadData();
  };

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Manajemen Lapangan
          </h1>
          <p className="text-zinc-400 mt-1">
            Kelola data lapangan olahraga yang tersedia di sistem.
          </p>
        </div>
        <button
          onClick={openTambah}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Lapangan
        </button>
      </div>

      {/* Error state */}
      {fetchError && (
        <div className="rounded-xl border border-red-800/60 bg-red-950/40 px-6 py-4 text-red-400 text-sm">
          ⚠ Gagal memuat data: {fetchError}. Pastikan backend berjalan di{" "}
          <code className="font-mono">
            {process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:3006"}
          </code>
          .
        </div>
      )}

      {/* Loading skeleton */}
      {isFetching && lapangan.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl bg-zinc-900/60 border border-zinc-800/40 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Table */}
      {!isFetching || lapangan.length > 0 ? (
        <LapanganTable lapangan={lapangan} onEdit={openEdit} />
      ) : null}

      {/* Modal Tambah / Edit */}
      {modalMode && (
        <LapanganModal
          mode={modalMode}
          lapangan={selectedLapangan ?? undefined}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
