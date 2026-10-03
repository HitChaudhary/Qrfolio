import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cardClass, dangerBtn, primaryBtn, secondaryBtn } from "../../lib/ui";

export function StatusBadge({ active, on = "Active", off = "Inactive" }: { active: boolean; on?: string; off?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        active ? "bg-[#e3f7e6] text-[#355d48] ring-1 ring-[#b7dbc4]" : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#69bd92]" : "bg-amber-400"}`} />
      {active ? on : off}
    </span>
  );
}

export function RoleBadge({ role }: { role: "user" | "admin" }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        role === "admin" ? "bg-[#284737] text-white" : "bg-[#f0f3f0] text-[#43745b] ring-1 ring-[#b7dbc4]/70"
      }`}
    >
      {role === "admin" ? "Admin" : "User"}
    </span>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight text-[#284737]">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-[#70a087]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// Scrolls sideways on small screens instead of breaking the layout
export function TableCard({ children, dim = false }: { children: ReactNode; dim?: boolean }) {
  return (
    <div className={`${cardClass} overflow-hidden !p-0 ${dim ? "opacity-60" : ""}`}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export const th = "whitespace-nowrap px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-[#70a087]";
export const td = "px-4 py-3 text-sm text-[#43745b] align-middle";
export const iconBtn =
  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-[#43745b] transition-colors hover:bg-[#e3f7e6] hover:text-[#284737] disabled:pointer-events-none disabled:opacity-35";

export function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12 text-center text-sm text-[#70a087]">
        {text}
      </td>
    </tr>
  );
}

export function Pagination({
  page,
  pages,
  total,
  onPage,
}: {
  page: number;
  pages: number;
  total: number;
  onPage: (p: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-1 text-sm text-[#70a087]">
      <span>
        {total.toLocaleString()} {total === 1 ? "result" : "results"} · Page {page} of {pages}
      </span>
      <div className="flex gap-2">
        <button disabled={page <= 1} onClick={() => onPage(page - 1)} className={`${secondaryBtn} !px-3 !py-1.5`}>
          <ChevronLeft size={15} /> Prev
        </button>
        <button disabled={page >= pages} onClick={() => onPage(page + 1)} className={`${secondaryBtn} !px-3 !py-1.5`}>
          Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  danger = false,
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel: string;
  danger?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="absolute inset-0 bg-[#284737]/50 backdrop-blur-sm" onClick={busy ? undefined : onCancel} />
      <div className="animate-fade-in relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h2 id="confirm-title" className="text-lg font-bold text-[#284737]">{title}</h2>
        <div className="mt-2 text-sm leading-relaxed text-[#43745b]">{message}</div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onCancel} disabled={busy} className={secondaryBtn}>Cancel</button>
          <button onClick={onConfirm} disabled={busy} className={danger ? `${dangerBtn} !bg-red-600 !text-white hover:!bg-red-700` : primaryBtn}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
