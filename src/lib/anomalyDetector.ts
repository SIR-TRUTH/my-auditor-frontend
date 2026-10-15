export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  unitCost: number;
  expectedUnitCost: number;
}

export function detectInvoiceAnomalies(items: LineItem[]) {
  const flaggedItems = [];
  let totalDiscrepancyAmount = 0;

  for (const item of items) {
    const variance = ((item.unitCost - item.expectedUnitCost) / item.expectedUnitCost) * 100;
    if (Math.abs(variance) > 5) {
      const diff = (item.unitCost - item.expectedUnitCost) * item.quantity;
      flaggedItems.push({
        name: item.name,
        reason: variance > 0 ? `Price spike detected (+${variance.toFixed(1)}% vs historical avg)` : `Unusually low price (${variance.toFixed(1)}%)`,
        priceVariancePercent: Number(variance.toFixed(1))
      });
      totalDiscrepancyAmount += diff;
    }
  }

  return {
    hasAnomaly: flaggedItems.length > 0,
    flaggedItems,
    totalDiscrepancyAmount
  };
}