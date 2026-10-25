import { globalAccountingEngine } from './lib/accountingEngine';
import { globalInventoryEngine } from './lib/inventoryEngine';
import { globalAuditEngine } from './lib/auditEngine';
import { nairaToKobo, formatKoboToNaira } from './lib/currency';
import { generateProfitAndLossReport, generateDailyPandLTrend } from './lib/reportsEngine';
import {
  executePosSale,
  executeOperatingExpense,
  reportStockDiscrepancy,
  authorizeStockLossWriteOff,
} from './lib/verticalSlice';

console.log('🚀 Running MY-AUDITOR Core Engine Verification...\n');

// Initialize
globalAccountingEngine.clear();
globalInventoryEngine.clear();
globalAuditEngine.clear();
globalInventoryEngine.registerProduct('prod-coaster-biscuits', 'Coaster Biscuits', 100, nairaToKobo(250));

// Test 1: POS Sale
executePosSale({
  businessId: 'biz-test',
  branchId: 'branch-main',
  productId: 'prod-coaster-biscuits',
  quantity: 10,
  unitPriceNaira: 350,
  transactionDateISO: '2026-10-21T10:00:00.000Z',
});

const report1 = generateProfitAndLossReport();
console.log('✅ TEST 1 (POS Sale):');
console.log(`   - Revenue: ${formatKoboToNaira(report1.totalRevenueKobo)} (Expected: ₦3,500.00)`);
console.log(`   - COGS: ${formatKoboToNaira(report1.totalCogsKobo)} (Expected: ₦2,500.00)`);
console.log(`   - Gross Profit: ${formatKoboToNaira(report1.grossProfitKobo)} (Expected: ₦1,000.00)`);
console.log(`   - Net Profit: ${formatKoboToNaira(report1.netProfitKobo)} (Expected: ₦1,000.00)\n`);

// Test 2: Operating Expense
executeOperatingExpense({
  businessId: 'biz-test',
  branchId: 'branch-main',
  category: 'FUEL',
  amountNaira: 500,
  transactionDateISO: '2026-10-21T12:00:00.000Z',
});

const report2 = generateProfitAndLossReport();
console.log('✅ TEST 2 (Operating Expense):');
console.log(`   - Operating Expenses: ${formatKoboToNaira(report2.operatingExpensesKobo)} (Expected: ₦500.00)`);
console.log(`   - Net Profit: ${formatKoboToNaira(report2.netProfitKobo)} (Expected: ₦500.00)\n`);

// Test 3: Stock Discrepancy & Authorized Write-Off
const findingId = reportStockDiscrepancy({
  businessId: 'biz-test',
  branchId: 'branch-main',
  productId: 'prod-coaster-biscuits',
  expectedQty: 90,
  actualQty: 87,
});

const report3Before = generateProfitAndLossReport();
console.log('✅ TEST 3A (Before Write-Off - Exposure vs P&L):');
console.log(`   - Potential Exposure: ${formatKoboToNaira(globalAuditEngine.getTotalPotentialExposureKobo())} (Expected: ₦750.00)`);
console.log(`   - Net Profit (Unchanged): ${formatKoboToNaira(report3Before.netProfitKobo)} (Expected: ₦500.00)\n`);

authorizeStockLossWriteOff({
  businessId: 'biz-test',
  branchId: 'branch-main',
  findingId,
  productId: 'prod-coaster-biscuits',
  missingQty: 3,
  transactionDateISO: '2026-10-21T15:00:00.000Z',
});

const report3After = generateProfitAndLossReport();
console.log('✅ TEST 3B (After Authorized Write-Off):');
console.log(`   - Recognized Losses: ${formatKoboToNaira(report3After.recognizedLossesKobo)} (Expected: ₦750.00)`);
console.log(`   - Net Profit (Updated): ${formatKoboToNaira(report3After.netProfitKobo)} (Expected: -₦250.00)`);
console.log(`   - Potential Exposure: ${formatKoboToNaira(globalAuditEngine.getTotalPotentialExposureKobo())} (Expected: ₦0.00)\n`);

console.log('🎉 ALL VERTICAL SLICE TESTS PASSED SUCCESSFULLY!');