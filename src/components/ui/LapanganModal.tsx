"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Lapangan } from "@/src/types";
import { adminCreateLapangan, adminUpdateLapangan, adminUploadGambar } from "@/src/lib/api";

interface Props {
  mode: "tambah" | "edit";
  lapangan?: Lapangan;
  onClose: () => void;
}

const EMPTY_FORM = {
  nama: "",
  fasilitas: "",
  harga_sewa_per_jam: "",
  gambar_url: "",
  kapasitas: "1",
};

export default function LapanganModal({ mode, lapangan, onClose }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState(
    mode === "edit" && lapangan
      ? {
          nama: lapangan.nama,
          fasilitas: lapangan.fasilitas,
          harga_sewa_per_jam: String(lapangan.harga_sewa_per_jam),
          gambar_url: lapangan.gambar_url,
          kapasitas: String(lapangan.kapasitas ?? 1),
        }
      : EMPTY_FORM
  );

  // Set preview gambar awal saat mode edit
  useEffect(() => {
    if (mode === "edit" && lapangan?.gambar_url) {
      setPreviewUrl(lapangan.gambar_url);
    }
  }, [mode, lapangan]);

  // Tutup modal saat tekan Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar (JPG, PNG, WEBP, dll).");
      return;
    }
    // Validasi ukuran (maks 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5MB.");
      return;
    }

    setError(null);
    setImageFile(file);

    // Tampilkan preview lokal
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setForm((prev) => ({ ...prev, gambar_url: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      let finalGambarUrl = form.gambar_url;

      // Jika ada file gambar baru, upload dulu
      if (imageFile) {
        setUploadingImage(true);
        const uploadResult = await adminUploadGambar(imageFile);
        setUploadingImage(false);
        if (uploadResult.ok && uploadResult.url) {
          finalGambarUrl = uploadResult.url;
        } else {
          console.warn("Upload gambar gagal:", uploadResult.error);
          // Lanjut tanpa update URL gambar jika endpoint upload belum ada
        }
      }

      const payload = {
        nama: form.nama,
        fasilitas: form.fasilitas,
        harga_sewa_per_jam: parseFloat(form.harga_sewa_per_jam),
        gambar_url: finalGambarUrl,
        kapasitas: parseInt(form.kapasitas, 10) || 1,
        // lokasi dikosongkan karena satu tempat saja
        lokasi: "",
      };

      if (mode === "tambah") {
        const result = await adminCreateLapangan(payload);
        if (!result.ok) {
          setError(result.error ?? "Gagal menambah lapangan.");
          return;
        }
        setSuccess(true);
        setTimeout(() => {
          router.refresh();
          onClose();
        }, 800);
      } else {
        const result = await adminUpdateLapangan(lapangan!.id, payload);
        if (!result.ok) {
          setError(result.error ?? "Gagal memperbarui lapangan.");
          return;
        }
        setSuccess(true);
        setTimeout(() => {
          router.refresh();
          onClose();
        }, 800);
      }
    });
  };

  const isLoading = isPending || uploadingImage;
  const title = mode === "tambah" ? "Tambah Lapangan Baru" : "Edit Lapangan";
  const submitLabel = mode === "tambah" ? "Simpan Lapangan" : "Simpan Perubahan";

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Panel */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-zinc-900 border border-zinc-800/80 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800/60">
          <div>
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {mode === "tambah"
                ? "Isi data lapangan baru."
                : `Mengedit: ${lapangan?.nama}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            aria-label="Tutup modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Alert Error */}
          {error && (
            <div className="rounded-lg bg-red-950/50 border border-red-800/60 px-4 py-3 text-red-400 text-sm flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Alert Success */}
          {success && (
            <div className="rounded-lg bg-emerald-950/50 border border-emerald-800/60 px-4 py-3 text-emerald-400 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {mode === "tambah" ? "Lapangan berhasil ditambahkan!" : "Lapangan berhasil diperbarui!"}
            </div>
          )}

          {/* Nama */}
          <Field label="Nama Lapangan" required>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="cth. Lapangan Futsal A"
              className={inputCls}
              required
              disabled={isLoading}
            />
          </Field>

          {/* Fasilitas */}
          <Field label="Fasilitas">
            <textarea
              name="fasilitas"
              value={form.fasilitas}
              onChange={handleChange}
              rows={3}
              placeholder="cth. Parkir luas, toilet bersih, kantin"
              className={inputCls}
              disabled={isLoading}
            />
          </Field>

          {/* Harga */}
          <Field label="Harga Sewa / Jam (Rp)" required>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-sm pointer-events-none">
                Rp
              </span>
              <input
                name="harga_sewa_per_jam"
                type="number"
                min={0}
                step={1000}
                value={form.harga_sewa_per_jam}
                onChange={handleChange}
                placeholder="150000"
                className={inputCls + " pl-10"}
                required
                disabled={isLoading}
              />
            </div>
          </Field>

          {/* Upload Gambar */}
          <Field label="Gambar Lapangan">
            <div className="space-y-3">
              {/* Preview */}
              {previewUrl ? (
                <div className="relative group rounded-xl overflow-hidden border border-zinc-700 bg-zinc-800 aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Preview gambar"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                    >
                      Ganti Gambar
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-medium transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                /* Drop zone */
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-xl border-2 border-dashed border-zinc-700 hover:border-blue-600 bg-zinc-800/50 hover:bg-zinc-800 transition-all flex flex-col items-center justify-center gap-2 group"
                  disabled={isLoading}
                >
                  <svg
                    className="w-8 h-8 text-zinc-600 group-hover:text-blue-500 transition-colors"
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
                  <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">
                    Klik untuk pilih gambar
                  </span>
                  <span className="text-xs text-zinc-600">JPG, PNG, WEBP — maks. 5MB</span>
                </button>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {imageFile && (
                <p className="text-xs text-zinc-500 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {imageFile.name} ({(imageFile.size / 1024).toFixed(0)} KB)
                </p>
              )}
            </div>
          </Field>

          {/* Kapasitas */}
          <Field label="Kapasitas Lapangan" required>
            <div className="relative">
              <input
                name="kapasitas"
                type="number"
                min={1}
                max={100}
                step={1}
                value={form.kapasitas}
                onChange={handleChange}
                placeholder="1"
                className={inputCls}
                required
                disabled={isLoading}
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-xs pointer-events-none">
                unit
              </span>
            </div>
            <p className="text-xs text-zinc-500">Jumlah unit lapangan yang dapat dibooking secara bersamaan.</p>
          </Field>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-zinc-800/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center gap-2"
            >
              {isLoading && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {isLoading ? "Menyimpan…" : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────────

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
  "w-full rounded-lg bg-zinc-800 border border-zinc-700 focus:border-blue-500 focus:ring-0 focus:outline-none text-white placeholder:text-zinc-500 px-3.5 py-2.5 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed";
