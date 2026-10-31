import { ChevronLeft, ChevronRight, Loader2, ShieldCheck } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { dangerBtn, primaryBtn, secondaryBtn } from "../../lib/ui";

export function StatusBadge({
  active,
  on = "Active",
  off = "Deactivated",
}: {
  active: boolean;
  on?: string;
  off?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
        active
          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
          : "bg-rose-50 text-rose-700 border border-rose-200"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`} />
      {active ? on : off}
    </span>
  );
}

export function RoleBadge({ role }: { role: "user" | "admin" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider ${
        role === "admin"
          ? "bg-slate-950 text-[#d4f04d] border border-slate-800 shadow-2xs"
          : "bg-slate-100 text-slate-700 border border-slate-200"
      }`}
    >
      {role === "admin" && <ShieldCheck size={11} className="text-[#d4f04d]" />}
      {role === "admin" ? "Admin" : "User"}
    </span>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center border-b border-slate-200/90 pb-5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#d4f04d] animate-ping" />
          <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
            {title}
          </h1>
        </div>
        {subtitle && <p className="mt-1 text-xs sm:text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

// High-density table card with crisp borders
export function TableCard({
  children,
  dim = false,
}: {
  children: ReactNode;
  dim?: boolean;
}) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xs ${dim ? "opacity-60" : ""}`}>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

export const th =
  "whitespace-nowrap px-4 py-3 text-left text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 bg-slate-50/90 border-b border-slate-200";
export const td = "px-4 py-3.5 text-xs text-slate-700 align-middle font-medium";
export const iconBtn =
  "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-950 disabled:pointer-events-none disabled:opacity-35";

export function EmptyRow({ colSpan, text }: { colSpan: number; text: string }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-14 text-center text-xs text-slate-400 font-medium">
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
    <div className="flex items-center justify-between gap-3 px-1 text-xs text-slate-500 font-semibold">
      <span>
        {total.toLocaleString()} {total === 1 ? "record" : "records"} · Page {page} of {pages}
      </span>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className={`${secondaryBtn} !px-3 !py-1.5 !text-xs`}
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <button
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className={`${secondaryBtn} !px-3 !py-1.5 !text-xs`}
        >
          Next <ChevronRight size={14} />
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
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={busy ? undefined : onCancel}
      />
      <div className="relative w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl border border-slate-200">
        <h2 id="confirm-title" className="font-display text-lg font-black text-slate-950">
          {title}
        </h2>
        <div className="mt-2 text-xs leading-relaxed text-slate-600 font-medium">
          {message}
        </div>
        <div className="mt-6 flex justify-end gap-2.5">
          <button onClick={onCancel} disabled={busy} className={secondaryBtn}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className={danger ? `${dangerBtn} !bg-rose-600 !text-white hover:!bg-rose-700` : primaryBtn}
          >
            {busy && <Loader2 size={15} className="animate-spin mr-1" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
