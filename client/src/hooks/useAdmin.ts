import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../lib/api";

type Params = Record<string, string | number | undefined>;

// GET /api/admin<path>. Keeps the previous data while refetching so tables don't flash.
export function useAdminQuery<T>(path: string, params?: Params) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  const key = JSON.stringify(params ?? {});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api
      .get<{ data: T }>(`/admin${path}`, { params: JSON.parse(key) as Params })
      .then((res) => {
        if (!cancelled) setData(res.data.data);
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path, key, tick]);

  return { data, loading, error, reload: () => setTick((t) => t + 1) };
}

export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}
