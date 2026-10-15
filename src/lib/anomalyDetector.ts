export interface LineItem { id: string; name: string; quantity: number; unitCost: number; expectedUnitCost?: number; }

export interface DiscrepancyReport { hasAnomaly: boolean; flaggedItems: Array<{ name: string; reason: string; priceVariancePercent: number; }>; totalDiscrepancyAmount: number; }

export function detectInvoiceAnomalies(items: LineItem[], tolerancePercent = 15): DiscrepancyReport {
  let flaggedItems = [];
  let totalDiscrepancyAmount = 0;
  for (const item of items) {
    const expected = item.expectedUnitCost ?? item.unitCost;
    if (expected > 0) {
      const variance = ((item.unitCost - expected) / expected) * 100;
      if (Math.abs(variance) > tolerancePercent) {
        const diff = (item.unitCost - expected) * item.quantity;
        flaggedItems.push({
          name: item.name,
          reason: variance > 0 ? \`Price spike detected (+\${variance.toFixed(1)}% vs historical avg)\` : \`Unusually low price (\${variance.toFixed(1)}%)\`,
          priceVariancePercent: Number(variance.toFixed(1))
        });
        totalDiscrepancyAmount += diff;
      }
    }
  }
  return {
    hasAnomaly: flaggedItems.length > 0,
    flaggedItems,
    totalDiscrepancyAmount: Number(totalDiscrepancyAmount.toFixed(2))
  };
}
