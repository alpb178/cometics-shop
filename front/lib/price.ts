/**
 * Importe en bolivianos sin separadores, para texto suelto y para copiar al
 * portapapeles. Los precios de venta ya son enteros (se redondean hacia arriba
 * en `applyMarkup`), así que se muestran sin decimales; los pedidos antiguos,
 * anteriores a ese cambio, conservan los suyos en vez de mentir sobre lo que se
 * cobró.
 */
export const formatAmount = (value: number | string | null | undefined) => {
  const n = Number(value) || 0;
  return Number.isInteger(n) ? String(n) : n.toFixed(2);
};

interface FormatPriceOptions {
  price?: number | string | null;
  locale?: string;
  currency?: string;
  /** Fijo si se indica; si no, se ajusta al valor (entero → sin decimales). */
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
  // Sin `decimals` explícito se ajusta al valor: entero sin decimales, con
  // decimales si los tiene. Evita el "42,00" tras redondear hacia arriba.
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
