import { globalAccountingEngine } from '../lib/accountingEngine';
import { globalInventoryEngine } from '../lib/inventoryEngine';
import { globalAuditEngine } from '../lib/auditEngine';
import { nairaToKobo, formatKoboToNaira } from '../lib/currency';
import { generateProfitAndLossReport, generateDailyPandLTrend } from '../lib/reportsEngine';
import {
  executePosSale,
  executeOperatingExpense,
  reportStockDiscrepancy,
  authorizeStockLossWriteOff,
} from '../lib/verticalSlice';

describe('MY-AUDITOR Core Financial & Audit Engine Verification', () => {
  const bizId = 'biz-test';
  const branchId = 'branch-main';
  const productId = 'prod-coaster-biscuits';

  beforeEach(() => {
    globalAccountingEngine.clear();
    globalInventoryEngine.clear();
    globalAuditEngine.clear();
    globalInventoryEngine.registerProduct(productId, 'Coaster Biscuits', 100, nairaToKobo(250));
  });

  test('FIRST VERTICAL SLICE TEST: POS Sale of 10 Packets @ ₦350 each', () => {
    executePosSale({
      businessId: bizId,
      branchId,
      productId,
      quantity: 10,
      unitPriceNaira: 350,
      transactionDateISO: '2026-10-21T10:00:00.000Z',
    });

    const inventoryState = globalInventoryEngine.getProductState(productId)!;
    expect(inventoryState.currentStock).toBe(90);

    const report = generateProfitAndLossReport();
    expect(formatKoboToNaira(report.totalRevenueKobo)).toBe('₦3,500.00');
    expect(formatKoboToNaira(report.totalCogsKobo)).toBe('₦2,500.00');
    expect(formatKoboToNaira(report.grossProfitKobo)).toBe('₦1,000.00');
    expect(formatKoboToNaira(report.netProfitKobo)).toBe('₦1,000.00');

    const dailyTrend = generateDailyPandLTrend();
    expect(dailyTrend.length).toBe(1);
    expect(dailyTrend[0].date).toBe('2026-10-21');
    expect(formatKoboToNaira(dailyTrend[0].revenueKobo)).toBe('₦3,500.00');
  });

  test('SECOND VERTICAL SLICE TEST: Generator Fuel Expense of ₦500', () => {
    executePosSale({
      businessId: bizId,
      branchId,
      productId,
      quantity: 10,
      unitPriceNaira: 350,
      transactionDateISO: '2026-10-21T10:00:00.000Z',
    });

    executeOperatingExpense({
      businessId: bizId,
      branchId,
      category: 'FUEL',
      amountNaira: 500,
      transactionDateISO: '2026-10-21T12:00:00.000Z',
    });

    const report = generateProfitAndLossReport();
    expect(formatKoboToNaira(report.operatingExpensesKobo)).toBe('₦500.00');
    expect(formatKoboToNaira(report.netProfitKobo)).toBe('₦500.00');
  });

  test('THIRD VERTICAL SLICE TEST: Unconfirmed Audit Exposure vs Authorized Write-off', () => {
    executePosSale({
      businessId: bizId,
      branchId,
      productId,
      quantity: 10,
      unitPriceNaira: 350,
      transactionDateISO: '2026-10-21T10:00:00.000Z',
    });

    executeOperatingExpense({
      businessId: bizId,
      branchId,
      category: 'FUEL',
      amountNaira: 500,
      transactionDateISO: '2026-10-21T12:00:00.000Z',
    });

    const findingId = reportStockDiscrepancy({
      businessId: bizId,
      branchId,
      productId,
      expectedQty: 90,
      actualQty: 87,
    });

    let report = generateProfitAndLossReport();
    expect(formatKoboToNaira(report.netProfitKobo)).toBe('₦500.00');
    expect(formatKoboToNaira(globalAuditEngine.getTotalPotentialExposureKobo())).toBe('₦750.00');

    authorizeStockLossWriteOff({
      businessId: bizId,
      branchId,
      findingId,
      productId,
      missingQty: 3,
      transactionDateISO: '2026-10-21T15:00:00.000Z',
    });

    report = generateProfitAndLossReport();
    expect(formatKoboToNaira(report.recognizedLossesKobo)).toBe('₦750.00');
    expect(formatKoboToNaira(report.netProfitKobo)).toBe('-₦250.00');
    expect(globalInventoryEngine.getProductState(productId)!.currentStock).toBe(87);
    expect(globalAuditEngine.getTotalPotentialExposureKobo()).toBe(0n);
  });
});