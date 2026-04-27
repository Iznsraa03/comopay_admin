"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  Users,
  History,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Layers,
} from "lucide-react";

const mainNavItems = [
  { title: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
  { title: "Lapangan", href: "/dashboard/lapangan", icon: Layers },
  { title: "Transaksi", href: "/dashboard/transactions", icon: Receipt },
  { title: "Users", href: "/dashboard/users", icon: Users },
];

const secondaryNavItems = [
  { title: "Log Audit", href: "/dashboard/audit", icon: History },
  { title: "Pengaturan", href: "/dashboard/settings", icon: Settings },
  { title: "Pusat Bantuan", href: "/dashboard/help", icon: HelpCircle },
];

export default function Sidebar() {
  const pathname = usePathname();

  const renderNavItems = (items: typeof mainNavItems) => {
    return items.map((item) => {
      const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");
      return (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
              ? "bg-blue-600/10 text-blue-400"
              : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
            }`}
        >
          <item.icon className={`w-5 h-5 ${isActive ? "text-blue-500" : "text-zinc-500 group-hover:text-zinc-300"}`} />
          <span className="font-medium text-sm flex-1">{item.title}</span>
          {isActive && <ChevronRight className="w-4 h-4 opacity-50" />}
        </Link>
      );
    });
  };

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-[#0A0A0B] border-r border-zinc-800/50 flex flex-col z-50">
      {/* Logo Area */}
      <div className="h-20 flex items-center px-8 border-b border-zinc-800/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-bold text-lg leading-none">C</span>
          </div>
          <span className="text-white font-bold tracking-tight text-xl">COMOPAY</span>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 no-scrollbar">
        <div className="space-y-1">
          <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Dashboard Admin
          </p>
          {renderNavItems(mainNavItems)}
        </div>

        {/* <div className="space-y-1">
          <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Sistem
          </p>
          {renderNavItems(secondaryNavItems)}
        </div> */}
      </div>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-zinc-800/50">
        <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center font-bold">
              SA
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-zinc-200 truncate">Admin Utama</p>
              <p className="text-xs text-zinc-500 truncate">Super Administrator</p>
            </div>
          </div>
        </div>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
