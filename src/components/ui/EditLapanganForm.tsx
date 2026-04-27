"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Lapangan } from "@/src/types";
import { adminUpdateLapangan } from "@/src/lib/api";

interface Props {
  lapangan: Lapangan;
}

export default function EditLapanganForm({ lapangan }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    nama: lapangan.nama,
    lokasi: lapangan.lokasi,
    fasilitas: lapangan.fasilitas,
    harga_sewa_per_jam: String(lapangan.harga_sewa_per_jam),
    gambar_url: lapangan.gambar_url,
    kapasitas: String(lapangan.kapasitas ?? 1),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!form.nama || !form.harga_sewa_per_jam) {
      setError("Nama dan harga sewa wajib diisi.");
      return;
    }

    startTransition(async () => {
      const result = await adminUpdateLapangan(lapangan.id, {
        nama: form.nama,
        lokasi: form.lokasi,
        fasilitas: form.fasilitas,
        harga_sewa_per_jam: parseFloat(form.harga_sewa_per_jam),
        gambar_url: form.gambar_url,
        kapasitas: parseInt(form.kapasitas, 10) || 1,
      });

      if (!result.ok) {
        setError(result.error ?? "Gagal memperbarui lapangan.");
        return;
      }

      setSuccess(true);
      router.refresh();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-900/60 border border-zinc-800/60 rounded-2xl p-6 space-y-5"
    >
      {error && (
        <div className="rounded-lg bg-red-950/50 border border-red-800/60 px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-emerald-950/50 border border-emerald-800/60 px-4 py-3 text-emerald-400 text-sm">
          ✓ Lapangan berhasil diperbarui.
        </div>
      )}

      <Field label="Nama Lapangan" required>
        <input
          name="nama"
          value={form.nama}
          onChange={handleChange}
          className={inputCls}
          required
        />
      </Field>

      <Field label="Lokasi">
        <input
          name="lokasi"
          value={form.lokasi}
          onChange={handleChange}
          className={inputCls}
        />
      </Field>

      <Field label="Fasilitas">
        <textarea
          name="fasilitas"
          value={form.fasilitas}
          onChange={handleChange}
          rows={3}
          className={inputCls}
        />
      </Field>

      <Field label="Harga Sewa / Jam (Rp)" required>
        <input
          name="harga_sewa_per_jam"
          type="number"
          min={0}
          step={1000}
          value={form.harga_sewa_per_jam}
          onChange={handleChange}
          className={inputCls}
          required
        />
      </Field>

      <Field label="URL Gambar">
        <input
          name="gambar_url"
          value={form.gambar_url}
          onChange={handleChange}
          placeholder="https://..."
          className={inputCls}
        />
      </Field>

      <Field label="Kapasitas Lapangan">
        <input
          name="kapasitas"
          type="number"
          min={1}
          value={form.kapasitas}
          onChange={handleChange}
          className={inputCls}
        />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
        >
          {isPending ? "Menyimpan…" : "Simpan Perubahan"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/lapangan")}
          className="px-6 py-2.5 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm font-semibold transition-colors"
        >
          Kembali
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-zinc-300">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg bg-zinc-800 border border-zinc-700 focus:border-blue-500 focus:ring-0 focus:outline-none text-white placeholder:text-zinc-500 px-3.5 py-2.5 text-sm transition-colors";
