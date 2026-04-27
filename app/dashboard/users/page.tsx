import { adminGetUsers } from "@/src/lib/api";
import type { User } from "@/src/types";

export const metadata = { title: "Users | COMOPAY Admin" };

export default async function UsersPage() {
  const result = await adminGetUsers();
  const users: User[] = result.data ?? [];

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Manajemen User
        </h1>
        <p className="text-zinc-400 mt-1">
          Daftar semua pengguna yang terdaftar di sistem.
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
              <th className={thCls}>Nama</th>
              <th className={thCls}>Email</th>
              <th className={thCls}>Nomor Telepon</th>
              <th className={thCls}>Peran</th>
              <th className={thCls}>Bergabung</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-zinc-500">
                  Belum ada user terdaftar.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr
                  key={u.id}
                  className="border-b border-zinc-800/40 last:border-0 hover:bg-zinc-800/20 transition-colors"
                >
                  <td className={tdCls + " font-medium text-white"}>{u.nama}</td>
                  <td className={tdCls + " text-zinc-400"}>{u.email}</td>
                  <td className={tdCls + " text-zinc-400 font-mono"}>
                    {u.nomor_telepon || "—"}
                  </td>
                  <td className={tdCls}>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.peran === "admin"
                          ? "bg-purple-950/60 text-purple-400 border border-purple-800/50"
                          : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                      }`}
                    >
                      {u.peran}
                    </span>
                  </td>
                  <td className={tdCls + " text-zinc-500"}>
                    {new Date(u.dibuat_pada).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))
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
