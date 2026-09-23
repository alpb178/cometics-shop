/**
 * Amount in bolivianos without separators, for inline text and for copying to
 * the clipboard. Sale prices are already whole numbers (rounded up in
 * `applyMarkup`), so they are shown without decimals; older orders, from before
 * that change, keep theirs instead of misreporting what was charged.
 */
export const formatAmount = (value: number | string | null | undefined) => {
  const n = Number(value) || 0;
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

interface FormatPriceOptions {
  price?: number | string | null;
  locale?: string;
  currency?: string;
  /** Fixed if given; otherwise it adapts to the value (integer → no decimals). */
  decimals?: number;
  split?: boolean;
}

export const formatPrice = ({
  price = 0,
  locale = "de-DE",
  currency = "BOB",
  decimals,
  split = false
}: FormatPriceOptions) => {
  const value = Number(price) || 0;
  // Without explicit `decimals` it adapts to the value: integers without
  // decimals, decimals when present. Avoids "42,00" after rounding up.
  const fractionDigits = decimals ?? (Number.isInteger(value) ? 0 : 2);
  const pr = new Intl.NumberFormat(locale, {
    style: "decimal",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);

  if (split) {
    const prSplited = pr.split(/ |,/g);
    const [integral, ...rest] = prSplited;
    return { integral, decimals: rest };
  }

  return `${pr} ${currency}`;
};
