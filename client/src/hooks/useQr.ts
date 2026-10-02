import { useEffect, useState } from "react";
import { generateQr, type QrResult } from "../lib/qr";

export function useQr(url: string, logoUrl: string) {
  const [qr, setQr] = useState<QrResult | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setQr(null);
    setError("");
    generateQr(url, logoUrl)
      .then((r) => !cancelled && setQr(r))
      .catch(() => !cancelled && setError("Could not generate the QR code. Please try again."));
    return () => {
      cancelled = true;
    };
  }, [url, logoUrl]);

  return { qr, error };
}
