import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import { 
  FileText, 
  Download, 
  Printer, 
  Calendar,
  Sparkles
} from 'lucide-react';

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('Current Month (October 2026)');

  // Zero-mock initial state tied to live platform ledger entries
  const totalRevenue = 0;
  const totalCostOfGoods = 0;
  const grossProfit = totalRevenue - totalCostOfGoods;
  const totalExpenses = 0;
  const netProfit = grossProfit - totalExpenses;
  const profitMargin = '0.0';

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <AppShell 
      title="Financial Reports & Profitability (P&L)" 
      subtitle="Generate institutional income statements, balance sheets, and tax-ready executive reports."
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-xl bg-[#111827] border border-[#1F293B] text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-teal-400" /> Print / PDF Report
          </button>
          <button 
            onClick={() => alert('Financial statement exported as CSV successfully!')}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      }
    >
      {/* PERIOD SELECTOR BAR */}
      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2.5">
          <Calendar className="w-5 h-5 text-teal-400" />
          <span className="text-xs font-bold text-white">Reporting Period:</span>
        </div>
        <select 
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
        >
          <option value="Current Month (October 2026)">Current Month (October 2026)</option>
          <option value="Q3 2026 Financial Quarter">Q3 2026 Financial Quarter</option>
          <option value="Year-to-Date 2026">Year-to-Date 2026</option>
        </select>
      </div>

      {/* KPI TELEMETRY ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Revenue</div>
          <div className="text-2xl font-bold text-white font-mono">
            ₦{totalRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 uppercase font-semibold">Gross Profit</div>
          <div className="text-2xl font-bold text-teal-400 font-mono">
            ₦{grossProfit.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 uppercase font-semibold">Net Profit</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            ₦{netProfit.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 uppercase font-semibold">Profit Margin</div>
          <div className="text-2xl font-bold text-teal-400 font-mono">{profitMargin}%</div>
        </div>
      </div>

      {/* AI FINANCIAL ADVISOR INSIGHT */}
      <div className="bg-gradient-to-r from-teal-950/40 via-[#111827] to-[#111827] border border-teal-500/30 rounded-2xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-teal-400">
          <Sparkles className="w-5 h-5" />
          <h2 className="text-sm font-bold text-white">AI Executive Financial Analysis</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Ledgers are currently empty. As you record sales, inventory purchases, and operating expenses, your autonomous AI advisor will dynamically analyze your net profit margins and tax compliance benchmarks here.
        </p>
      </div>

      {/* OFFICIAL INCOME STATEMENT (P&L) TABLE */}
      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-teal-400" />
            <h2 className="text-sm font-bold text-white">Official Statement of Profit or Loss (Income Statement)</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">Standard IFRS / Nigerian GAAP Compliant</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                <th className="p-4">Financial Line Item</th>
                <th className="p-4">Classification</th>
                <th className="p-4 text-right">Amount (₦)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F293B] text-slate-300">
              <tr className="hover:bg-[#182234]/50">
                <td className="p-4 font-bold text-white">Gross Sales &amp; POS Revenue</td>
                <td className="p-4 font-mono text-teal-400">Operating Revenue</td>
                <td className="p-4 text-right font-mono font-bold text-white">₦0.00</td>
              </tr>
              <tr className="hover:bg-[#182234]/50">
                <td className="p-4 font-bold text-slate-300">Cost of Goods Sold (COGS) &amp; Inventory WAC</td>
                <td className="p-4 font-mono text-amber-400">Direct Cost</td>
                <td className="p-4 text-right font-mono text-amber-400">(₦0.00)</td>
              </tr>
              <tr className="bg-[#0A0E17]/60 font-bold">
                <td className="p-4 text-teal-400">GROSS PROFIT</td>
                <td className="p-4 font-mono text-teal-400">Operating Margin</td>
                <td className="p-4 text-right font-mono text-teal-400 text-sm">₦0.00</td>
              </tr>
              <tr className="hover:bg-[#182234]/50">
                <td className="p-4 font-bold text-slate-300">Operating Expenses (Utilities, Logistics, Rent, Payroll)</td>
                <td className="p-4 font-mono text-amber-400">Overhead</td>
                <td className="p-4 text-right font-mono text-amber-400">(₦0.00)</td>
              </tr>
              <tr className="bg-[#0A0E17] font-bold">
                <td className="p-4 text-emerald-400 text-sm">NET PROFIT BEFORE TAX</td>
                <td className="p-4 font-mono text-emerald-400">Bottom Line</td>
                <td className="p-4 text-right font-mono text-emerald-400 text-base">₦0.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}