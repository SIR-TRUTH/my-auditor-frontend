/**
 * MY-AUDITOR Vertical Slice Transaction Executor
 */

import { nairaToKobo, multiplyKoboByQty } from './currency';
import { globalAccountingEngine, CHART_OF_ACCOUNTS } from './accountingEngine';
import { globalInventoryEngine } from './inventoryEngine';
import { globalAuditEngine } from './auditEngine';

export function executePosSale(params: {
  businessId: string;
  branchId: string;
  productId: string;
  quantity: number;
  unitPriceNaira: number;
  transactionDateISO?: string;
}) {
  const transactionDate = params.transactionDateISO || new Date().toISOString();
  const productState = globalInventoryEngine.getProductState(params.productId);
  if (!productState) throw new Error(`Product ${params.productId} not found.`);

  const unitPriceKobo = nairaToKobo(params.unitPriceNaira);
  const totalRevenueKobo = multiplyKoboByQty(unitPriceKobo, params.quantity);
  const unitCogsKobo = productState.weightedAverageCostKobo;
  const totalCogsKobo = multiplyKoboByQty(unitCogsKobo, params.quantity);

  globalInventoryEngine.recordMovement({
    businessId: params.businessId,
    branchId: params.branchId,
    productId: params.productId,
    quantity: -params.quantity,
    movementType: 'SALE',
    unitCostKobo: unitCogsKobo,
    totalCostKobo: totalCogsKobo,
    referenceType: 'SALE',
    referenceId: `sale-${Date.now()}`,
  });

  globalAccountingEngine.postJournalEntry({
    businessId: params.businessId,
    branchId: params.branchId,
    description: `POS Sale: ${params.quantity}x ${productState.productName}`,
    referenceType: 'SALE',
    referenceId: `sale-${Date.now()}`,
    date: transactionDate,
    lines: [
      { accountId: CHART_OF_ACCOUNTS.POS_CLEARING.id, debitKobo: totalRevenueKobo, creditKobo: 0n },
      { accountId: CHART_OF_ACCOUNTS.SALES_REVENUE.id, debitKobo: 0n, creditKobo: totalRevenueKobo },
      { accountId: CHART_OF_ACCOUNTS.COGS.id, debitKobo: totalCogsKobo, creditKobo: 0n },
      { accountId: CHART_OF_ACCOUNTS.INVENTORY.id, debitKobo: 0n, creditKobo: totalCogsKobo },
    ],
  });
}

export function executeOperatingExpense(params: {
  businessId: string;
  branchId: string;
  category: 'FUEL' | 'GENERAL';
  amountNaira: number;
  transactionDateISO?: string;
}) {
  const transactionDate = params.transactionDateISO || new Date().toISOString();
  const expenseKobo = nairaToKobo(params.amountNaira);
  const accountId = params.category === 'FUEL' ? CHART_OF_ACCOUNTS.FUEL_EXPENSE.id : CHART_OF_ACCOUNTS.OPERATING_EXPENSE.id;

  globalAccountingEngine.postJournalEntry({
    businessId: params.businessId,
    branchId: params.branchId,
    description: `Logged Expense: ${params.category}`,
    referenceType: 'EXPENSE',
    referenceId: `exp-${Date.now()}`,
    date: transactionDate,
    lines: [
      { accountId, debitKobo: expenseKobo, creditKobo: 0n },
      { accountId: CHART_OF_ACCOUNTS.CASH.id, debitKobo: 0n, creditKobo: expenseKobo },
    ],
  });
}

export function reportStockDiscrepancy(params: {
  businessId: string;
  branchId: string;
  productId: string;
  expectedQty: number;
  actualQty: number;
}): string {
  const productState = globalInventoryEngine.getProductState(params.productId);
  if (!productState) throw new Error('Product not found');

  const differenceQty = params.expectedQty - params.actualQty;
  if (differenceQty <= 0) throw new Error('No missing inventory detected');

  const unitCostKobo = productState.weightedAverageCostKobo;
  const estimatedExposureKobo = multiplyKoboByQty(unitCostKobo, differenceQty);

  const finding = globalAuditEngine.createFinding({
    businessId: params.businessId,
    branchId: params.branchId,
    ruleId: 'RULE-STOCK-COUNT-MISMATCH',
    title: `Unresolved Stock Discrepancy: ${productState.productName}`,
    description: `Physical count mismatch. Expected: ${params.expectedQty}, Actual: ${params.actualQty}, Missing: ${differenceQty} units.`,
    severity: 'MEDIUM',
    estimatedExposureKobo,
  });

  return finding.id;
}

export function authorizeStockLossWriteOff(params: {
  businessId: string;
  branchId: string;
  findingId: string;
  productId: string;
  missingQty: number;
  transactionDateISO?: string;
}) {
  const transactionDate = params.transactionDateISO || new Date().toISOString();
  const productState = globalInventoryEngine.getProductState(params.productId);
  if (!productState) throw new Error('Product not found');

  const unitCostKobo = productState.weightedAverageCostKobo;
  const totalLossKobo = multiplyKoboByQty(unitCostKobo, params.missingQty);

  globalInventoryEngine.recordMovement({
    businessId: params.businessId,
    branchId: params.branchId,
    productId: params.productId,
    quantity: -params.missingQty,
    movementType: 'STOCK_WRITE_OFF',
    unitCostKobo: unitCostKobo,
    totalCostKobo: totalLossKobo,
    referenceType: 'STOCK_LOSS_WRITEOFF',
    referenceId: params.findingId,
  });

  globalAccountingEngine.postJournalEntry({
    businessId: params.businessId,
    branchId: params.branchId,
    description: `Authorized Stock Write-Off: ${params.missingQty}x ${productState.productName}`,
    referenceType: 'STOCK_LOSS_WRITEOFF',
    referenceId: params.findingId,
    date: transactionDate,
    lines: [
      { accountId: CHART_OF_ACCOUNTS.INVENTORY_LOSS.id, debitKobo: totalLossKobo, creditKobo: 0n },
      { accountId: CHART_OF_ACCOUNTS.INVENTORY.id, debitKobo: 0n, creditKobo: totalLossKobo },
    ],
  });

  globalAuditEngine.resolveFinding(params.findingId);
}