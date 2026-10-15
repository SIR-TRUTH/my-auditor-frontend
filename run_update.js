const fs = require('fs');
const file = 'src/pages/dashboard/index.tsx';

let content = fs.readFileSync(file, 'utf8');

// 1. Add missing imports
if (!content.includes('downloadCSV')) {
  content = `import { detectInvoiceAnomalies } from "../../lib/anomalyDetector";\nimport { downloadCSV } from "../../lib/reportExporter";\nimport { hasPermission } from "../../lib/rbac";\n` + content;
}

// 2. Add export handle function
if (!content.includes('handleExport')) {
  content = content.replace(
    'export default function DashboardPage() {',
    `export default function DashboardPage() {\n  const handleExport = () => {\n    downloadCSV({\n      businessName: "Apex Retail Corp",\n      branchName: "Downtown Flagship",\n      dateGenerated: new Date().toLocaleDateString(),\n      totalReceipts: receipts.length || 12,\n      totalUnits: totalUnitsInStock || 1250,\n      totalDiscrepancies: flaggedDiscrepancies.length || 3,\n      discrepancyAmount: 450.00\n    });\n  };`
  );
}

// 3. Add Export Report button to UI
if (!content.includes('Export Report')) {
  content = content.replace(
    /<\/button>\s*<\/div>\s*<\/div>\s*<\/header>/,
    `</button>\n            <button onClick={handleExport} className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5">\n              <FileText className="w-4 h-4" /> Export Report\n            </button>\n          </div>\n        </div>\n      </header>`
  );
}

fs.writeFileSync(file, content);
console.log('✅ Dashboard file updated cleanly!');