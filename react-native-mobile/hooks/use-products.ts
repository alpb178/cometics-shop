import { fetcher } from "@/lib/api/fetcher";
import useSWR from "swr";

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  images?: any[];
  category?: string;
  inStock?: boolean;
  slug?: string;
  createdAt: string;
  updatedAt: string;
  currency?: string;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface UseProductsOptions {
  category?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { enabled = true } = options;

  const url = enabled ? `/api/products` : null;

  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000,
    }
  );

  return {
    products: data?.data || [],
    meta: data?.meta,
    isLoading,
    error,
    mutate,
  };
}

export function useProduct(slug: string) {
  const { data, error, isLoading, mutate } = useSWR<ProductsResponse>(
    slug ? `/api/products?filters[slug][$eq]=${slug}&populate=images` : null,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  return {
    product: data?.data?.[0] || null,
    isLoading,
    error,
    mutate,
  };
}
