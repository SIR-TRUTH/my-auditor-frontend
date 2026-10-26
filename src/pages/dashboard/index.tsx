import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Calendar, 
  Download, 
  RefreshCw,
  CheckCircle2
} from 'lucide-react';

export default function ExecutiveDashboard() {
  const [metrics] = useState({
    grossSales: 0.00,
    grossProfit: 0.00,
    operatingExpenses: 0.00,
    netProfit: 0.00,
    cogs: 0.00,
    cashBank: 0.00,
    posClearing: 0.00,
    accountsReceivable: 0.00,
    accountsPayable: 0.00,
    inventoryValue: 0.00,
  });

  const formatCurrency = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <AppShell 
      title="Executive Dashboard" 
      subtitle="Real-time double-entry financial performance and continuous audit intelligence."
      actions={
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111827] border border-[#1F293B] text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-teal-400" />
            <span>Consolidated • Live</span>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-sm">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      }
    >
      {/* PRIMARY KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales & Revenue</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><TrendingUp className="w-3.5 h-3.5" /></span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">{formatCurrency(metrics.grossSales)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Verified ledger postings</div>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Profit</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><TrendingUp className="w-3.5 h-3.5" /></span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">{formatCurrency(metrics.grossProfit)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Net of COGS</div>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operating Expenses</span>
            <span className="p-1 rounded bg-amber-500/10 text-amber-400"><TrendingDown className="w-3.5 h-3.5" /></span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">{formatCurrency(metrics.operatingExpenses)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Overhead & operational costs</div>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-3 shadow-xs border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Profit</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><ShieldCheck className="w-3.5 h-3.5" /></span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-teal-400 font-mono">{formatCurrency(metrics.netProfit)}</div>
            <div className="text-[11px] text-slate-500 mt-1">Double-entry verified</div>
          </div>
        </div>
      </div>

      {/* SECONDARY BALANCE INDICATORS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#111827]/60 border border-[#1F293B] rounded-lg p-3">
          <div className="text-[10px] text-slate-400 uppercase font-medium">COGS</div>
          <div className="text-sm font-bold text-white font-mono mt-1">{formatCurrency(metrics.cogs)}</div>
        </div>
        <div className="bg-[#111827]/60 border border-[#1F293B] rounded-lg p-3">
          <div className="text-[10px] text-slate-400 uppercase font-medium">Cash / Bank</div>
          <div className="text-sm font-bold text-white font-mono mt-1">{formatCurrency(metrics.cashBank)}</div>
        </div>
        <div className="bg-[#111827]/60 border border-[#1F293B] rounded-lg p-3">
          <div className="text-[10px] text-slate-400 uppercase font-medium">POS Clearing</div>
          <div className="text-sm font-bold text-white font-mono mt-1">{formatCurrency(metrics.posClearing)}</div>
        </div>
        <div className="bg-[#111827]/60 border border-[#1F293B] rounded-lg p-3">
          <div className="text-[10px] text-slate-400 uppercase font-medium">Rec. (AR)</div>
          <div className="text-sm font-bold text-white font-mono mt-1">{formatCurrency(metrics.accountsReceivable)}</div>
        </div>
        <div className="bg-[#111827]/60 border border-[#1F293B] rounded-lg p-3">
          <div className="text-[10px] text-slate-400 uppercase font-medium">Pay. (AP)</div>
          <div className="text-sm font-bold text-white font-mono mt-1">{formatCurrency(metrics.accountsPayable)}</div>
        </div>
        <div className="bg-[#111827]/60 border border-[#1F293B] rounded-lg p-3">
          <div className="text-[10px] text-slate-400 uppercase font-medium">Inventory Val</div>
          <div className="text-sm font-bold text-white font-mono mt-1">{formatCurrency(metrics.inventoryValue)}</div>
        </div>
      </div>

      {/* THIRD ROW: P&L Timeline (65%) & Audit Centre (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-[#1F293B] rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Real-Time P&L Timeline</h2>
              <p className="text-xs text-slate-400">Revenue, COGS, Gross Profit & Net Profit by actual transaction date</p>
            </div>
            <select className="bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-1 text-xs text-slate-300 focus:outline-none">
              <option>Current Week</option>
              <option>Current Month</option>
            </select>
          </div>

          <div className="h-64 flex flex-col items-center justify-center text-center border border-dashed border-[#1F293B] rounded-lg bg-[#0A0E17]/40 p-6">
            <RefreshCw className="w-5 h-5 text-slate-600 mb-2 animate-spin-slow" />
            <span className="text-xs font-medium text-slate-400">No transactions recorded for timeline</span>
            <span className="text-[11px] text-slate-600 mt-1">Days without transactions correctly report ₦0.00</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-6 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Continuous Audit Centre</h2>
              <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] font-bold">SECURE</span>
            </div>
            <p className="text-xs text-slate-400">Isolated risk & compliance telemetry</p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0E17] border border-[#1F293B] text-xs">
              <span className="text-slate-400">Open Findings</span>
              <span className="font-bold text-white font-mono">0</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0E17] border border-[#1F293B] text-xs">
              <span className="text-slate-400">Critical / High Risk</span>
              <span className="font-bold text-teal-400 font-mono">0</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0E17] border border-[#1F293B] text-xs">
              <span className="text-slate-400">Inventory Discrepancies</span>
              <span className="font-bold text-slate-300 font-mono">0</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
            <span>Audit findings are strictly isolated and do not alter P&L.</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}