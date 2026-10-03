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
    <div className="group relative overflow-hidden rounded-2xl border border-[#b7dbc4]/70 bg-white p-5 shadow-[0_2px_10px_rgba(70,115,89,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#69bd92] hover:shadow-[0_8px_20px_rgba(70,115,89,0.08)]">
      {/* Soft mint background gradient glow on hover */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#e3f7e6]/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e3f7e6] text-[#467359] transition-colors group-hover:bg-[#467359] group-hover:text-white">
          <Icon size={19} />
        </div>
        {trend && (
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
              trendPositive
                ? "bg-[#e3f7e6] text-[#355d48] ring-1 ring-[#b7dbc4]"
                : "bg-[#f0f3f0] text-[#70a087]"
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="font-display text-2xl font-bold tracking-tight text-[#284737] tabular-nums">{value}</p>
        <p className="mt-0.5 text-xs font-medium text-[#70a087]">{label}</p>
      </div>
    </div>
  );
}
