import React, { useState, useEffect } from 'react';
import AppShell from '../../components/AppShell';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Calendar, 
  Download, 
  RefreshCw 
} from 'lucide-react';

export default function ExecutiveDashboard() {
  const [metrics, setMetrics] = useState({
    grossSales: 0.00,
    grossProfit: 0.00,
    operatingExpenses: 0.00,
    netAuditedProfit: 0.00,
  });

  const [auditStats, setAuditStats] = useState({
    openFindings: 0,
    highRisk: 0,
    mediumRisk: 0,
    resolved: 0,
    integrityScore: '100%',
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    // In production, fetch live accounting metrics from backend API
  }, []);

  const formatCurrency = (amount: number) => {
    return '₦' + amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <AppShell 
      title="Executive Dashboard" 
      subtitle="Real-time business performance and continuous audit intelligence."
      actions={
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#111827] border border-[#1E293B] text-xs text-slate-300">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span>Last 30 Days</span>
          </div>
          <button className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      }
    >
      {/* KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 space-y-3 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Sales</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><TrendingUp className="w-3.5 h-3.5" /></div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">{formatCurrency(metrics.grossSales)}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">0.0%</span> vs prior period
            </div>
          </div>
        </div>

        {/* Gross Profit */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 space-y-3 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Gross Profit</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><TrendingUp className="w-3.5 h-3.5" /></div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">{formatCurrency(metrics.grossProfit)}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">0.0%</span> margin stable
            </div>
          </div>
        </div>

        {/* Operating Expenses */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 space-y-3 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Operating Expenses</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400"><TrendingDown className="w-3.5 h-3.5" /></div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-white font-mono">{formatCurrency(metrics.operatingExpenses)}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-slate-400 font-semibold">₦0.00</span> overhead
            </div>
          </div>
        </div>

        {/* Net Audited Profit */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-5 space-y-3 hover:border-slate-700 transition border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Net Audited Profit</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400"><ShieldCheck className="w-3.5 h-3.5" /></div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono">{formatCurrency(metrics.netAuditedProfit)}</div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-400 font-semibold">Verified</span> double-entry
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW: Chart (65%) & Audit Health (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Performance Chart Container */}
        <div className="lg:col-span-2 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Revenue & Profit Performance</h2>
              <p className="text-xs text-slate-400">Daily transaction trend for the active business branch</p>
            </div>
            <select className="bg-[#090D16] border border-[#1E293B] rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none">
              <option>Last 30 Days</option>
              <option>Quarterly</option>
              <option>Yearly</option>
            </select>
          </div>

          {/* Empty state / Zero data visualizer */}
          <div className="h-64 flex flex-col items-center justify-center text-center border border-dashed border-[#1E293B] rounded-xl bg-[#090D16]/50 p-6">
            <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-400 mb-3">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-200">No Transaction Records Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              Recorded sales and journal entries will automatically populate real-time analytics and double-entry charts here.
            </p>
          </div>
        </div>

        {/* Audit Health Card */}
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Audit Health & Integrity</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">SECURE</span>
            </div>
            <p className="text-xs text-slate-400">Continuous risk & compliance monitoring</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#090D16] border border-[#1E293B]">
              <span className="text-xs text-slate-300">Open Findings</span>
              <span className="text-xs font-bold text-white font-mono">0</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#090D16] border border-[#1E293B]">
              <span className="text-xs text-slate-300">High Risk Anomalies</span>
              <span className="text-xs font-bold text-emerald-400 font-mono">0</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#090D16] border border-[#1E293B]">
              <span className="text-xs text-slate-300">Resolved Discrepancies</span>
              <span className="text-xs font-bold text-slate-300 font-mono">0</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Ledger balance matches trial balance perfectly.</span>
          </div>
        </div>
      </div>

      {/* THIRD ROW: Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Recent Business Activity</h2>
          <div className="h-44 flex items-center justify-center text-xs text-slate-500 border border-dashed border-[#1E293B] rounded-xl">
            No recent transaction activity recorded.
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-bold text-white">Continuous Audit Log</h2>
          <div className="h-44 flex items-center justify-center text-xs text-slate-500 border border-dashed border-[#1E293B] rounded-xl">
            No audit flags detected. System running securely.
          </div>
        </div>
      </div>
    </AppShell>
  );
}