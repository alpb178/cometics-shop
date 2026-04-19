import { fetcher } from "@/lib/api/fetcher";
import useSWR from "swr";

export interface DynamicZone {
  __component: string;
  id: number;
  [key: string]: any;
}

export interface Page {
  dynamic_zone: DynamicZone[];
}

export interface UseDynamicContentOptions {
  slug?: string;
  locale?: string;
  enabled?: boolean;
}

export function useDynamicContent(options: UseDynamicContentOptions = {}) {
  const { slug, enabled = true } = options;

  const url =
    enabled && slug ? `/api/pages?filters[slug][$eq]=${slug}&locale=en` : null;

  const { data, error, isLoading, mutate } = useSWR<{ data: Page[] }>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );

  return {
    page: data?.data?.[0] || null,
    content: data?.data?.[0]?.dynamic_zone || [],
    isLoading,
    error,
    mutate,
  };
}

export function useHomeContent() {
  return useDynamicContent({ slug: "home" });
}
