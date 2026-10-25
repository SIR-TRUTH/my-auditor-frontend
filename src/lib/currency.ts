/**
 * MY-AUDITOR Financial Precision Engine
 * Minor Unit (Kobo) Arithmetic to eliminate JS Floating-Point Errors.
 */

export type Kobo = bigint;

export function nairaToKobo(naira: number): Kobo {
  return BigInt(Math.round(naira * 100));
}

export function koboToNaira(kobo: Kobo): number {
  return Number(kobo) / 100;
}

export function formatKoboToNaira(kobo: Kobo, currencySymbol: string = '₦'): string {
  const naira = koboToNaira(kobo);
  return `${currencySymbol}${naira.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function addKobo(a: Kobo, b: Kobo): Kobo {
  return a + b;
}

export function subtractKobo(a: Kobo, b: Kobo): Kobo {
  return a - b;
}

export function multiplyKoboByQty(unitPriceKobo: Kobo, quantity: number): Kobo {
  return unitPriceKobo * BigInt(quantity);
}