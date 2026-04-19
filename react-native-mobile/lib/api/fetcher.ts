export interface ApiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiData {
  id: number;
  attributes: Record<string, any>;
  [key: string]: any;
}

export const fetcher = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const baseUrl =
    process.env.EXPO_PUBLIC_API_URL || "https://shop-strapi-cms.onrender.com";
  const fullUrl = `${baseUrl}${url}`;

  try {
    const response = await fetch(fullUrl, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export const spreadStrapiData = <T = any>(data: ApiResponse<T>): T | null => {
  if (Array.isArray(data.data) && data.data.length > 0) {
    return data.data[0];
  }
  if (!Array.isArray(data.data)) {
    return data.data;
  }
  return null;
};
