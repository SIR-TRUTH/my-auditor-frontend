/**
 * MY-AUDITOR Audit Engine
 */

import { Kobo } from './currency';

export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type FindingStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'FALSE_POSITIVE' | 'ACCEPTED_RISK';

export interface AuditFinding {
  id: string;
  businessId: string;
  branchId: string;
  ruleId: string;
  title: string;
  description: string;
  severity: Severity;
  estimatedExposureKobo: Kobo;
  status: FindingStatus;
  detectedAt: string;
}

export class AuditEngine {
  private findings: AuditFinding[] = [];

  public createFinding(finding: Omit<AuditFinding, 'id' | 'detectedAt' | 'status'>): AuditFinding {
    const newFinding: AuditFinding = {
      ...finding,
      id: `find-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      status: 'OPEN',
      detectedAt: new Date().toISOString(),
    };
    this.findings.push(newFinding);
    return newFinding;
  }

  public getTotalPotentialExposureKobo(): Kobo {
    return this.findings
      .filter(f => f.status === 'OPEN' || f.status === 'UNDER_REVIEW')
      .reduce((sum, f) => sum + f.estimatedExposureKobo, 0n);
  }

  public resolveFinding(findingId: string): void {
    const finding = this.findings.find(f => f.id === findingId);
    if (finding) {
      finding.status = 'RESOLVED';
    }
  }

  public clear(): void {
    this.findings = [];
  }
}

export const globalAuditEngine = new AuditEngine();