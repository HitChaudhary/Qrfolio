import { AlertCircle, CheckCircle2, X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";
interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

const ToastContext = createContext<{ show: (message: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const show = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 3800);
  }, []);

  const dismiss = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-20 right-4 z-50 flex max-w-sm flex-col gap-2.5 sm:bottom-6 sm:right-6"
        aria-live="polite"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={`animate-fade-in flex items-center justify-between gap-3 rounded-2xl border p-3.5 text-sm font-medium shadow-xl backdrop-blur-md transition-all ${
              t.type === "error"
                ? "border-red-200 bg-red-950/90 text-white shadow-red-950/20"
                : "border-[#b7dbc4] bg-[#284737]/95 text-white shadow-[#284737]/25"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {t.type === "error" ? (
                <AlertCircle size={18} className="shrink-0 text-red-400" />
              ) : (
                <CheckCircle2 size={18} className="shrink-0 text-[#69bd92]" />
              )}
              <span className="text-[#f0f3f0]">{t.message}</span>
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="rounded-lg p-1 text-[#b7dbc4] hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}
