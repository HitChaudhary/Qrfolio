import { AlertCircle, Loader2, RotateCw } from "lucide-react";
import { secondaryBtn } from "../lib/ui";

export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="relative">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-[#d4f04d] shadow-lg">
          <Loader2 className="animate-spin text-[#d4f04d]" size={28} />
        </div>
      </div>
      <p className="mt-4 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
        Loading QrFolio...
      </p>
    </div>
  );
}

export function PageError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-3xl border border-rose-200 bg-rose-50/70 p-6 text-sm text-rose-900 shadow-xs animate-fade-in">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-display font-bold text-rose-950 text-base">Something went wrong</h3>
          <p className="mt-1 text-xs text-rose-700 leading-relaxed">{message}</p>
          <button
            onClick={onRetry}
            className={`${secondaryBtn} mt-4 bg-white text-xs py-2 px-4 shadow-xs`}
          >
            <RotateCw size={13} className="mr-1.5" /> Try again
          </button>
        </div>
      </div>
    </div>
  );
}
