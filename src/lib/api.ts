import type { BackendResponse, Lapangan, Transaksi, User } from "../types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:3006";

// ── Core fetcher ──────────────────────────────────────────────────────────────

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ ok: boolean; data?: T; error?: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: "no-store",
    });

    const json: BackendResponse<T> = await res.json();

    if (!res.ok || !json.sukses) {
      return { ok: false, error: json.pesan || `HTTP ${res.status}` };
    }

    return { ok: true, data: json.data };
  } catch (err) {
    console.error("API Fetch Error:", err);
    return { ok: false, error: "Tidak dapat terhubung ke server." };
  }
}

// ── Admin: Users ──────────────────────────────────────────────────────────────

export async function adminGetUsers(limit = 100, offset = 0) {
  return apiFetch<User[]>(
    `/api/v1/admin/users?limit=${limit}&offset=${offset}`
  );
}

// ── Admin: Transaksi ──────────────────────────────────────────────────────────

export async function adminGetTransactions(limit = 100, offset = 0) {
  return apiFetch<Transaksi[]>(
    `/api/v1/admin/transactions?limit=${limit}&offset=${offset}`
  );
}

// ── Admin: Lapangan ───────────────────────────────────────────────────────────

export async function adminGetLapangan(limit = 100, offset = 0) {
  return apiFetch<Lapangan[]>(
    `/api/v1/admin/lapangan?limit=${limit}&offset=${offset}`
  );
}

export async function adminGetLapanganById(id: string) {
  return apiFetch<Lapangan>(`/api/v1/admin/lapangan/${id}`);
}

export async function adminCreateLapangan(
  payload: Omit<Lapangan, "id" | "dibuat_pada" | "diperbarui_pada"> & { status?: string }
) {
  return apiFetch<Lapangan>("/api/v1/admin/lapangan", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// Upload gambar lapangan (multipart/form-data)
// Catatan: endpoint ini perlu didukung oleh backend.
export async function adminUploadGambar(
  file: File
): Promise<{ ok: boolean; url?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE_URL}/api/v1/admin/upload`, {
      method: "POST",
      body: formData,
      // Jangan set Content-Type — biar browser handle boundary multipart
    });

    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }

    const json = await res.json();
    return { ok: true, url: json.url ?? json.data?.url };
  } catch (err) {
    console.error("Upload Error:", err);
    return { ok: false, error: "Gagal upload gambar." };
  }
}

export async function adminUpdateLapangan(
  id: string,
  payload: Partial<Omit<Lapangan, "id" | "dibuat_pada" | "diperbarui_pada">>
) {
  return apiFetch<Lapangan>(`/api/v1/admin/lapangan/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function adminDeleteLapangan(id: string) {
  return apiFetch<null>(`/api/v1/admin/lapangan/${id}`, {
    method: "DELETE",
  });
}
