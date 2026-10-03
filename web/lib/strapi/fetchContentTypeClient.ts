import qs from "qs";

/**
 * Client-side version of fetchContentType that doesn't use next/headers
 * This is safe to use in Client Components
 */

interface StrapiData {
  id: number;
  [key: string]: any;
}

interface StrapiResponse {
  data: StrapiData | StrapiData[];
}

export function spreadStrapiData(data: StrapiResponse): StrapiData | null {
  if (Array.isArray(data.data) && data.data.length > 0) {
    return data.data[0];
  }
  if (!Array.isArray(data.data)) {
    return data.data;
  }
  return null;
}

export default function fetchContentTypeClient(
  contentType: string,
  params: Record<string, unknown> = {},
  spreadData?: boolean
): Promise<any> {
  // Construct the full URL for the API request
  const url = new URL(`api/${contentType}`, process.env.NEXT_PUBLIC_API_URL);
  const path = `${url.href}?${qs.stringify(params)}`;

  // Perform the fetch request with the provided query parameters
  return fetch(path, {
    method: "GET",
    cache: "no-store"
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data from Strapi (url=${url.toString()}, status=${
            response.status
          })`
        );
      }
      return response.json();
    })
    .then((jsonData: StrapiResponse) => {
      return spreadData ? spreadStrapiData(jsonData) : jsonData;
    })
    .catch((error) => {
      throw error; // Re-throw so the hook can handle it
    });
}
