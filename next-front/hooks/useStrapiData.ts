import { useState, useEffect, useCallback } from "react";
import fetchContentTypeClient from "@/lib/strapi/fetchContentTypeClient";

interface UseStrapiDataOptions {
  contentType: string;
  params?: Record<string, unknown>;
  spreadData?: boolean;
  enabled?: boolean;
}

interface UseStrapiDataReturn<T = any> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useStrapiData<T = any>({
  contentType,
  params = {},
  spreadData = true,
  enabled = true
}: UseStrapiDataOptions): UseStrapiDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const fetchData = useCallback(() => {
    if (!enabled || hasAttempted) return;

    setLoading(true);
    setError(null);
    setHasAttempted(true);

    fetchContentTypeClient(contentType, params, spreadData)
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [contentType, enabled, spreadData, hasAttempted, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset hasAttempted when contentType or enabled changes
  useEffect(() => {
    setHasAttempted(false);
  }, [contentType, enabled]);

  const refetch = useCallback(() => {
    setHasAttempted(false);
    setError(null);
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch
  };
}
