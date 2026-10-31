import type { LucideIcon } from "lucide-react";

export default function StatCard({
  Icon,
  label,
  value,
  trend,
  trendPositive,
}: {
  Icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: string;
  trendPositive?: boolean;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] shadow-sm transition-transform group-hover:scale-105">
          <Icon size={20} />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
              trendPositive
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                : "bg-slate-100 text-slate-600 border border-slate-200"
            }`}
          >
            {trendPositive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-950 tabular-nums">
          {value}
        </p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}
