/** This store's settings for the group hub tracker. */

/**
 * Areas whose screen text must not reach the hub: what is shown there can be a
 * customer's name, address or email. Clicks there are still counted, with a
 * generic label.
 */
export const PRIVATE_SEGMENTS = ["admin", "account", "cart", "checkout"] as const;

/**
 * Routes with ids, counted as one page each: order and address ids say
 * nothing about the site and would crowd the hub's top-100. Product pages
 * keep their slug — which product people look at is the point.
 */
export const PATH_PATTERNS = [
  "/account/orders/:id",
  "/account/addresses/:id",
  "/admin/products/:documentId",
  "/admin/orders/:documentId",
] as const;
