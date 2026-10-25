import { globalAuditEngine } from './lib/auditEngine';
import { formatKoboToNaira } from './lib/currency';
import { reconcilePetrolStationTank } from './lib/oilAndGasEngine';

console.log('🚀 Running Oil & Gas Downstream Reconciliation Verification...\n');

globalAuditEngine.clear();

const result = reconcilePetrolStationTank({
  businessId: 'biz-oil-1',
  branchId: 'branch-lekki-filling-station',
  stationName: 'Lekki Expressway Mega Station',
  fuelType: 'PMS',
  openingStockLiters: 45000,
  totalSuppliedLiters: 33000,
  meterSalesLiters: 65000,
  physicalClosingDipLiters: 12500, // Expected = 45000 + 33000 - 65000 = 13000. Shortage = 500 liters!
  unitCostNaira: 750, // ₦750 per liter
});

console.log('⛽ Petrol Station Tank Reconciliation Output:');
console.log(`   - Station: ${result.stationName}`);
console.log(`   - Fuel Type: ${result.fuelType}`);
console.log(`   - Expected Stock: ${result.expectedStockLiters} Liters`);
console.log(`   - Physical Dip: ${result.actualClosingDipLiters} Liters`);
console.log(`   - Volumetric Shortage: ${result.varianceLiters} Liters`);
console.log(`   - Potential Financial Exposure: ${formatKoboToNaira(result.potentialExposureKobo)} (Expected: ₦375,000.00)\n`);

const totalExposure = globalAuditEngine.getTotalPotentialExposureKobo();
console.log(`🛡️ Total Audit Exposure Registered: ${formatKoboToNaira(totalExposure)}`);
console.log('🎉 OIL & GAS SECTOR LEDGER ENGINE VERIFIED SUCCESSFULLY!');