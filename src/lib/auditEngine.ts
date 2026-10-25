/**
 * MY-AUDITOR Continuous Audit Engine
 * Isolates stock discrepancies and operational exposures away from the P&L until authorized.
 */

import { Kobo } from './currency';

export interface AuditFinding {
  id: string;
  businessId: string;
  branchId: string;
  discrepancyType: string;
  description: string;
  potentialExposureKobo: bigint;
  status: 'UNRESOLVED' | 'AUTHORIZED_WRITE_OFF' | 'RECOVERED';
  createdAt: Date;
}

export class AuditEngine {
  private findings: AuditFinding[] = [];

  public clear(): void {
    this.findings = [];
  }

  public reportPotentialExposure(params: {
    businessId: string;
    branchId: string;
    discrepancyType: string;
    description: string;
    potentialExposureKobo: bigint;
  }): AuditFinding {
    const finding: AuditFinding = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      businessId: params.businessId,
      branchId: params.branchId,
      discrepancyType: params.discrepancyType,
      description: params.description,
      potentialExposureKobo: params.potentialExposureKobo,
      status: 'UNRESOLVED',
      createdAt: new Date(),
    };

    this.findings.push(finding);
    return finding;
  }

  public getTotalPotentialExposureKobo(): bigint {
    return this.findings
      .filter(f => f.status === 'UNRESOLVED')
      .reduce((sum, f) => sum + f.potentialExposureKobo, 0n);
  }

  public getFindings(): AuditFinding[] {
    return [...this.findings];
  }
}

export const globalAuditEngine = new AuditEngine();