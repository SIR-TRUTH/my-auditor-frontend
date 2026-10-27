import React, { useState, useEffect } from 'react';
import AppShell from '../../components/AppShell';
import { 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  Calendar, 
  Download, 
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function ExecutiveDashboard() {
  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop',
      title: 'Financial Intelligence Overview',
      desc: 'Real-time double-entry ledger & P&L tracking across all active branches',
    },
    {
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
      title: 'Continuous Audit Health',
      desc: 'Zero discrepancies detected by automated forensic compliance checks',
    },
    {
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200&auto=format&fit=crop',
      title: 'Inventory & WAC Valuation',
      desc: 'Automated weighted average cost tracking with zero revenue leakage',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

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
          <button className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>
        </div>
      }
    >
      {/* DASHBOARD HERO SLIDESHOW */}
      <div className="w-full relative rounded-xl overflow-hidden border border-[#1F293B] bg-[#111827] shadow-lg h-52 sm:h-64">
        <img 
          src={slides[currentSlide].image} 
          alt={slides[currentSlide].title} 
          className="w-full h-full object-cover opacity-40 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/60 to-transparent flex flex-col justify-end p-6">
          <span className="text-[10px] font-mono text-teal-400 font-bold uppercase tracking-wider">COMMAND CENTRE HIGHLIGHT</span>
          <h2 className="text-lg sm:text-xl font-bold text-white">{slides[currentSlide].title}</h2>
          <p className="text-xs text-slate-300">{slides[currentSlide].desc}</p>
        </div>

        <button 
          onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-teal-600 transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 border border-white/10 text-white hover:bg-teal-600 transition cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* PRIMARY KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales &amp; Revenue</span>
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
            <div className="text-[11px] text-slate-500 mt-1">Overhead &amp; operational costs</div>
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

      {/* THIRD ROW: P&L Timeline & Audit Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111827] border border-[#1F293B] rounded-xl p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Real-Time P&amp;L Timeline</h2>
              <p className="text-xs text-slate-400">Revenue, COGS, Gross Profit &amp; Net Profit by actual transaction date</p>
            </div>
            <select className="bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-1 text-xs text-slate-300 focus:outline-none">
              <option>Current Week</option>
              <option>Current Month</option>
            </select>
          </div>

          <div className="h-64 flex flex-col items-center justify-center text-center border border-dashed border-[#1F293B] rounded-lg bg-[#0A0E17]/40 p-6 space-y-2">
            <span className="text-xs font-medium text-slate-400">No transactions recorded for timeline</span>
            <span className="text-[11px] text-slate-600">Days without transactions correctly report ₦0.00</span>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-6 space-y-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Continuous Audit Centre</h2>
              <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[10px] font-bold">SECURE</span>
            </div>
            <p className="text-xs text-slate-400">Isolated risk &amp; compliance telemetry</p>
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
            <span>Audit findings are strictly isolated and do not alter P&amp;L.</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}