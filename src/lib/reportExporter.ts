export interface AuditReportData {
  businessName: string;
  branchName: string;
  dateGenerated: string;
  totalReceipts: number;
  totalUnits: number;
  totalDiscrepancies: number;
  discrepancyAmount: number;
}

export function generateCSVReport(data: AuditReportData): string {
  let csv = 'MY-AUDITOR EXECUTIVE REPORT\n';
  csv += `Business,${data.businessName}\n`;
  csv += `Branch,${data.branchName}\n`;
  csv += `Date Generated,${data.dateGenerated}\n\n`;
  csv += `Metric,Value\n`;
  csv += `Total Receipts Ingested,${data.totalReceipts}\n`;
  csv += `Live Inventory Units,${data.totalUnits}\n`;
  csv += `Flagged Discrepancies,${data.totalDiscrepancies}\n`;
  csv += `Total Discrepancy Amount ($),${data.discrepancyAmount.toFixed(2)}\n`;
  return csv;
}

export function downloadCSV(data: AuditReportData) {
  const csvContent = generateCSVReport(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `myauditor-report-${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}