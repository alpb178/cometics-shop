import { describe, expect, it } from "vitest";
import { isPrivatePath } from "@/lib/hub-tracker/click-target";
import { normalizePath } from "@/lib/hub-tracker/path";
import { locales } from "@/i18n/routing";
import { PATH_PATTERNS, PRIVATE_SEGMENTS } from "./hub-settings";

describe("hub analytics settings of Iris Natural", () => {
  it.each(["/es/admin", "/en/account", "/es/account/orders/7", "/pt/cart", "/es/checkout"])(
    "keeps screen text out of %s",
    (path) => {
      expect(isPrivatePath(path, PRIVATE_SEGMENTS)).toBe(true);
    },
  );

  it.each(["/es", "/es/products/crema-de-caléndula", "/en/faq"])("treats %s as public", (path) => {
    expect(isPrivatePath(path, PRIVATE_SEGMENTS)).toBe(false);
  });

  it.each([
    ["/es/account/orders/81", "/account/orders/:id"],
    ["/en/account/addresses/3", "/account/addresses/:id"],
    ["/es/admin/products/abc123", "/admin/products/:documentId"],
    ["/es/admin/orders/xyz", "/admin/orders/:documentId"],
    ["/pt/products/crema", "/products/crema"],
    ["/es", "/"],
  ])("counts %s as %s", (raw, counted) => {
    expect(normalizePath(raw, { locales, patterns: PATH_PATTERNS })).toBe(counted);
  });
});
