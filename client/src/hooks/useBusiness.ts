import { useCallback, useEffect, useState } from "react";
import { api, getErrorMessage } from "../lib/api";
import type { Business } from "../lib/types";

export function useBusiness() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get<{ data: { businesses: Business[] } }>("/business");
      setBusiness(res.data.data.businesses[0] ?? null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { business, setBusiness, loading, error, reload: load };
}
