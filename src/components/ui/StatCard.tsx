import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  highlight?: boolean;
}

export default function StatCard({ title, value, subtitle, icon: Icon, trend, highlight }: StatCardProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 hover:shadow-xl ${
      highlight 
        ? "bg-gradient-to-br from-blue-900/40 to-[#0A0A0B] border-blue-500/30 hover:border-blue-500/60" 
        : "bg-[#0A0A0B] border-zinc-800/60 hover:border-zinc-700"
    }`}>
      {/* Decorative gradient blob for highlighted cards */}
      {highlight && (
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl opacity-50" />
      )}
      
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-4">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <div>
            <h3 className={`text-3xl font-bold tracking-tight ${highlight ? "text-blue-50" : "text-white"}`}>
              {value}
            </h3>
            {subtitle && (
              <p className="text-sm text-zinc-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <div className={`p-3 rounded-xl ${highlight ? "bg-blue-500/20 text-blue-400" : "bg-zinc-800/50 text-zinc-400"}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-md ${
            trend.isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
          }`}>
            {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-zinc-500">dari bulan lalu</span>
        </div>
      )}
    </div>
  );
}
