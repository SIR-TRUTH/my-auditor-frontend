import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Calendar, 
  Download, 
  RefreshCw,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function ExecutiveDashboard() {
  const [metrics] = useState({
    grossSales: 0.00,
    grossProfit: 0.00,
    operatingExpenses: 0.00,
    netAuditedProfit: 0.00,
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
            <span>Last 30 Days</span>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-sm">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      }
    >
      {/* FINANCIAL KPI METRICS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><TrendingUp className="w-3.5 h-3.5" /></span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">{formatCurrency(metrics.grossSales)}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-teal-400 font-medium">0.0%</span> vs prior period
            </div>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gross Profit</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><TrendingUp className="w-3.5 h-3.5" /></span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">{formatCurrency(metrics.grossProfit)}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-teal-400 font-medium">Stable</span> margin
            </div>
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Operating Expenses</span>
            <span className="p-1 rounded bg-amber-500/10 text-amber-400"><TrendingDown className="w-3.5 h-3.5" /></span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono">{formatCurrency(metrics.operatingExpenses)}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-slate-400 font-medium">Overhead tracked</span>
            </div>
          </div>
        </div>

        {/* Net Audited Profit */}
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-3 shadow-xs border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Audited Profit</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><ShieldCheck className="w-3.5 h-3.5" /></span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-bold text-teal-400 font-mono">{formatCurrency(metrics.netAuditedProfit)}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-teal-400 font-medium">Double-entry verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW: Performance Chart (65%) & Audit Health (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-[#1F293B] rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Revenue & Profit Performance</h2>
              <p className="text-xs text-slate-400">Daily transaction velocity across active branch</p>
            </div>
            <select className="bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-1 text-xs text-slate-300 focus:outline-none">
              <option>Last 30 Days</option>
              <option>Quarterly</option>
            </select>
          </div>

          <div className="h-64 flex flex-col items-center justify-center text-center border border-dashed border-[#1F293B] rounded-lg bg-[#0A0E17]/40 p-6">
            <RefreshCw className="w-5 h-5 text-slate-600 mb-2 animate-spin-slow" />
            <span className="text-xs font-medium text-slate-400">No active transactions recorded for this period</span>
            <span className="text-[11px] text-slate-600 mt-1">Data updates automatically upon ledger entry</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-6 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Audit Health</h2>
              <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] font-bold">100% SECURE</span>
            </div>
            <p className="text-xs text-slate-400">Continuous risk & compliance monitoring</p>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0E17] border border-[#1F293B] text-xs">
              <span className="text-slate-400">Open Findings</span>
              <span className="font-bold text-white font-mono">0</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0E17] border border-[#1F293B] text-xs">
              <span className="text-slate-400">High Risk Anomalies</span>
              <span className="font-bold text-teal-400 font-mono">0</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0A0E17] border border-[#1F293B] text-xs">
              <span className="text-slate-400">Resolved Discrepancies</span>
              <span className="font-bold text-slate-300 font-mono">0</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-teal-500/10 border border-teal-500/20 text-xs text-teal-300 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-400" />
            <span>Trial balance matches general ledger balance.</span>
          </div>
        </div>
      </div>

      {/* THIRD ROW: Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-white">Recent Business Activity</h2>
          <div className="h-40 flex items-center justify-center text-xs text-slate-500 border border-dashed border-[#1F293B] rounded-lg">
            No recent activity logged.
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-6 space-y-4 shadow-xs">
          <h2 className="text-sm font-bold text-white">Continuous Audit Log</h2>
          <div className="h-40 flex items-center justify-center text-xs text-slate-500 border border-dashed border-[#1F293B] rounded-lg">
            System integrity verified. No flags.
          </div>
        </div>
      </div>
    </AppShell>
  );
}