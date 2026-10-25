import React from 'react';
import { PieChart, FileText, Download, ShieldCheck, TrendingUp, DollarSign } from 'lucide-react';
import { generateProfitAndLossReport } from '../lib/reportsEngine';
import { globalAuditEngine } from '../lib/auditEngine';
import { formatKoboToNaira } from '../lib/currency';
import { UserContext } from '../lib/rbacEngine';

interface ReportsModuleProps {
  currentUser: UserContext;
  currencyKey: string;
}

export default function ReportsModule({ currentUser, currencyKey }: ReportsModuleProps) {
  const pnlReport = generateProfitAndLossReport();
  const totalExposureKobo = globalAuditEngine.getTotalPotentialExposureKobo();

  const formatMoney = (koboVal: bigint) => formatKoboToNaira(koboVal, currencyKey === 'USD' ? '$' : '₦');

  const handleExportReport = () => {
    alert(`Certified Audit Report successfully compiled for branch ${currentUser.branchId}. Ready for download.`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Export */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-400" /> Audited Reports & Analytics
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Certified financial statements generated directly from deterministic double-entry journals.
          </p>
        </div>
        <button
          onClick={handleExportReport}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Download className="w-4 h-4" /> Export Certified Statement (PDF/CSV)
        </button>
      </div>

      {/* P&L Statement Card */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Statement of Profit and Loss</h3>
            <p className="text-[11px] text-slate-400">For active branch / consolidated ledger</p>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Certified Audited
          </span>
        </div>

        <div className="space-y-4 text-xs font-medium">
          <div className="flex justify-between py-2.5 border-b border-slate-800/60">
            <span className="text-slate-300">Total Revenue (Sales & Inflows)</span>
            <span className="font-bold text-white">{formatMoney(pnlReport.totalRevenueKobo)}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-slate-800/60">
            <span className="text-slate-300">Cost of Goods Sold (COGS)</span>
            <span className="font-bold text-rose-400">-{formatMoney(pnlReport.totalCogsKobo)}</span>
          </div>
          <div className="flex justify-between py-3 border-b border-slate-800 font-bold text-sm bg-slate-950/40 px-3 rounded-xl">
            <span className="text-slate-200">Gross Profit</span>
            <span className="text-emerald-400">{formatMoney(pnlReport.grossProfitKobo)}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-slate-800/60">
            <span className="text-slate-300">Operating Expenses (OPEX)</span>
            <span className="font-bold text-rose-400">-{formatMoney(pnlReport.operatingExpensesKobo)}</span>
          </div>
          <div className="flex justify-between py-2.5 border-b border-slate-800/60">
            <span className="text-slate-300">Recognized Loss Adjustments</span>
            <span className="font-bold text-rose-400">-{formatMoney(pnlReport.recognizedLossesKobo)}</span>
          </div>
          <div className="flex justify-between py-4 font-black text-base border-t-2 border-slate-700 bg-emerald-500/5 px-4 rounded-xl">
            <span className="text-white">Net Audited Profit</span>
            <span className="text-emerald-400">{formatMoney(pnlReport.netProfitKobo)}</span>
          </div>
        </div>

        {/* Audit Exposure Note */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl flex justify-between items-center text-xs">
          <div>
            <p className="font-bold text-amber-300">Isolated Audit Exposure (Not deducted from Net Profit)</p>
            <p className="text-slate-400 text-[11px] mt-0.5">Potential discrepancies registered in Continuous Audit Centre.</p>
          </div>
          <span className="font-black text-white text-sm">{formatMoney(totalExposureKobo)}</span>
        </div>
      </div>
    </div>
  );
}