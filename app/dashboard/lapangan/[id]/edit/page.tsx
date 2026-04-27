import { redirect } from "next/navigation";

// Route ini sudah digantikan oleh modal di halaman utama lapangan.
// Redirect otomatis ke /dashboard/lapangan.
export default async function EditLapanganPage() {
  redirect("/dashboard/lapangan");
}
