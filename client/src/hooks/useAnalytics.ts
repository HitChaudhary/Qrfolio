import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../lib/api";
import type { Analytics } from "../lib/types";

export function useAnalytics(businessId?: string) {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(Boolean(businessId));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!businessId) return;
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .get<{ data: Analytics }>(`/business/${businessId}/analytics`)
      .then((res) => !cancelled && setData(res.data.data))
      .catch((err) => !cancelled && setError(getErrorMessage(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [businessId]);

  return { data, loading, error };
}
