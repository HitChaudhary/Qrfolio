import { Loader2 } from "lucide-react";
import { secondaryBtn } from "../lib/ui";

export function PageLoading() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 className="animate-spin text-slate-500" />
    </div>
  );
}

export function PageError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
      <p>{message}</p>
      <button onClick={onRetry} className={`${secondaryBtn} mt-3 bg-white`}>
        Try again
      </button>
    </div>
  );
}
