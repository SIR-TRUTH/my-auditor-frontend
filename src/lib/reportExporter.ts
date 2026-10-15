export interface AuditReportData { businessName: string; branchName: string; dateGenerated: string; totalReceipts: number; totalUnits: number; totalDiscrepancies: number; discrepancyAmount: number; }

export function generateCSVReport(data: AuditReportData): string {
  let csv = 'MY-AUDITOR EXECUTIVE REPORT\
';
  csv += \`Business,\${data.businessName}\
\`;
  csv += \`Branch,\${data.branchName}\
\`;
  csv += \`Date Generated,\${data.dateGenerated}\
\`;
  csv += \`Total Receipts Ingested,\${data.totalReceipts}\
\`;
  csv += \`Live Inventory Units,\${data.totalUnits}\
\`;
  csv += \`Flagged Discrepancies,\${data.totalDiscrepancies}\
\`;
  csv += \`Total Discrepancy Amount ($),\${data.discrepancyAmount}\
\`;
  return csv;
}

export function downloadCSV(data: AuditReportData, filename = 'audit-report.csv') {
  const csvContent = generateCSVReport(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
