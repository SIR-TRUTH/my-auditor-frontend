/**
 * MY-AUDITOR Oil & Gas Downstream / Petrol Station Ledger Engine
 * Handles underground tank dip calibration, pump meter reconciliation, and volumetric loss exposure.
 */

import { Kobo, nairaToKobo } from './currency';
import { globalAuditEngine } from './auditEngine';

export interface TankDipReconciliationParams {
  businessId: string;
  branchId: string;
  stationName: string;
  fuelType: 'PMS' | 'AGO' | 'DPK';
  openingStockLiters: number;
  totalSuppliedLiters: number;
  meterSalesLiters: number;
  physicalClosingDipLiters: number;
  unitCostNaira: number;
}

export function reconcilePetrolStationTank(params: TankDipReconciliationParams) {
  const expectedStockLiters = params.openingStockLiters + params.totalSuppliedLiters - params.meterSalesLiters;
  const varianceLiters = expectedStockLiters - params.physicalClosingDipLiters;

  let potentialExposureKobo = 0n;

  if (varianceLiters > 0) {
    const lossValueNaira = varianceLiters * params.unitCostNaira;
    potentialExposureKobo = nairaToKobo(lossValueNaira);

    globalAuditEngine.reportPotentialExposure({
      businessId: params.businessId,
      branchId: params.branchId,
      discrepancyType: 'PETROL_STATION_VOLUMETRIC_LOSS',
      description: `Station ${params.stationName} (${params.fuelType}): Shortage of ${varianceLiters} liters detected between meter sales and physical dip.`,
      potentialExposureKobo: potentialExposureKobo,
    });
  }

  return {
    stationName: params.stationName,
    fuelType: params.fuelType,
    expectedStockLiters,
    actualClosingDipLiters: params.physicalClosingDipLiters,
    varianceLiters,
    potentialExposureKobo,
  };
}