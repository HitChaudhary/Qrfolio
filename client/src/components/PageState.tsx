import { AlertCircle, Loader2, RotateCw } from "lucide-react";
import { secondaryBtn } from "../lib/ui";

export function PageLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
      <div className="relative">
        <div className="h-12 w-12 rounded-2xl bg-[#e3f7e6] flex items-center justify-center text-[#467359]">
          <Loader2 className="animate-spin text-[#467359]" size={24} />
        </div>
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-[#70a087]">Loading QrFolio...</p>
    </div>
  );
}

export function PageError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/70 p-5 text-sm text-red-800 shadow-xs animate-fadeIn">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-bold text-red-900">Something went wrong</h3>
          <p className="mt-1 text-xs text-red-700 leading-relaxed">{message}</p>
          <button onClick={onRetry} className={`${secondaryBtn} mt-3.5 bg-white text-xs py-1.5 px-3`}>
            <RotateCw size={13} className="mr-1.5" /> Try again
          </button>
        </div>
      </div>
    </div>
  );
}
