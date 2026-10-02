import type { LucideIcon } from "lucide-react";
import { cardClass } from "../lib/ui";

export default function StatCard({ Icon, label, value }: { Icon: LucideIcon; label: string; value: number | string }) {
  return (
    <div className={`${cardClass} !p-4`}>
      <Icon size={18} className="text-slate-400" />
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}
