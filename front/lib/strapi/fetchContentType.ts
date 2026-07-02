import { draftMode } from "next/headers";
import qs from "qs";
import { applyMarkup, getPricingSettings } from "@/lib/pricing";
/**
 * Fetches data for a specified Strapi content type.
 *
 * @param {string} contentType - The type of content to fetch from Strapi.
 * @param {string} params - Query parameters to append to the API request.
 * @return {Promise<object>} The fetched data.
 */

interface StrapiData {
  id: number;
  [key: string]: any; // Allow for any additional fields
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

export default async function fetchContentType(
  contentType: string,
  params: Record<string, unknown> = {},
  spreadData?: boolean
): Promise<any> {
  const { isEnabled } = await draftMode();

  try {
    const queryParams = { ...params };

    if (isEnabled) {
      queryParams.status = "draft";
    }

    // Construct the full URL for the API request
    const url = new URL(`api/${contentType}`, process.env.NEXT_PUBLIC_API_URL);
    const path = `${url.href}?${qs.stringify(queryParams)}`;

    // Perform the fetch request with the provided query parameters
    const response = await fetch(path, {
      method: "GET",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from Strapi (url=${url.toString()}, status=${
          response.status
        })`
      );
    }
    const jsonData: StrapiResponse = await response.json();

    // Markup global invisible: los precios de producto se muestran con el
    // recargo ya aplicado. El servidor lo re-aplica al crear el pedido, así que
    // display y cobro coinciden.
    if (contentType.startsWith("products") && jsonData?.data) {
      const { markupPercent } = await getPricingSettings();
      if (markupPercent) {
        const items = Array.isArray(jsonData.data)
          ? jsonData.data
          : [jsonData.data];
        for (const item of items) {
          if (item && typeof item.price === "number") {
            item.price = applyMarkup(item.price, markupPercent);
          }
        }
      }
    }

    return spreadData ? spreadStrapiData(jsonData) : jsonData;
  } catch (error) {
    console.error(`Error fetching ${contentType}:`, error);
    // Return null instead of undefined to prevent rendering errors
    return null;
  }
}
