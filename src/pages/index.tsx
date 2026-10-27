import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, BarChart3, Layers, CheckCircle2, Building2, BrainCircuit, ReceiptText, Lock, Zap } from 'lucide-react';

export default function EnterpriseLandingPage() {
  const industries = [
    { name: 'Supermarkets & Retail', desc: 'Barcode scanning, POS reconciliation, and WAC stock tracking.', icon: Building2 },
    { name: 'Pharmacies & Medical', desc: 'Batch expiry tracking, controlled substance audits, and supplier ledger control.', icon: ShieldCheck },
    { name: 'Restaurants & Bars', desc: 'Recipe inventory depletion, kitchen waste audits, and daily cash reconciliation.', icon: Layers },
    { name: 'Hotels & Hospitality', desc: 'Room revenue audit, POS split payments, and asset depreciation tracking.', icon: BarChart3 },
    { name: 'Manufacturing & Logistics', desc: 'Raw material costing, production batch audits, and dispatch sign-offs.', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F9FAFB] flex flex-col font-sans antialiased selection:bg-teal-500/30 selection:text-teal-300">
      
      {/* Top Navbar */}
      <header className="h-20 border-b border-[#1F293B] px-6 lg:px-16 flex items-center justify-between bg-[#0E1522]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-white text-base tracking-wider uppercase font-mono">MY-AUDITOR</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <Link href="/login" className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white transition">
            Log In
          </Link>
          <Link href="/signup" className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-lg shadow-teal-900/20 flex items-center gap-1.5">
            Start Auditing <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 lg:px-16 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Continuous Financial Intelligence for African Enterprise</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
            Know the Truth About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Your Business.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            MY-AUDITOR continuously checks your sales, expenses, inventory, payments, and financial records in real time—eliminating revenue leakage and providing uncompromised visibility across all your branch locations.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
            <Link 
              href="/signup" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-xl shadow-teal-900/30 cursor-pointer"
            >
              Start Auditing Your Business <ArrowRight className="w-4 h-4" />
            </Link>
            <Link 
              href="/login" 
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#111827] hover:bg-[#182234] border border-[#1F293B] text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
            >
              Sign In to Command Centre
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#1F293B] text-xs">
            <div>
              <div className="font-bold text-white font-mono text-base">₦50B+</div>
              <div className="text-slate-400">Audited Ledger Volume</div>
            </div>
            <div>
              <div className="font-bold text-teal-400 font-mono text-base">99.8%</div>
              <div className="text-slate-400">Inventory Accuracy</div>
            </div>
            <div>
              <div className="font-bold text-white font-mono text-base">24/7</div>
              <div className="text-slate-400">Automated AI Checks</div>
            </div>
          </div>
        </div>

        {/* Hero Visual Card representing authentic African business environment */}
        <div className="lg:col-span-5">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 shadow-2xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold">
                  HQ
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Lagos Flagship Store</div>
                  <div className="text-[11px] text-teal-400 font-mono">● LIVE AUDIT ACTIVE</div>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 text-[11px] font-mono font-bold">NGN (₦)</span>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Real-Time Daily Sales</div>
                  <div className="text-base font-bold text-white font-mono">₦4,850,200.00</div>
                </div>
                <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded">+14.2%</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">POS Reconciliation Match</div>
                  <div className="text-base font-bold text-white font-mono">100.0% Verified</div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-teal-400" />
              </div>

              <div className="p-3.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400">Continuous Audit Flags</div>
                  <div className="text-base font-bold text-emerald-400 font-mono">0 Open Discrepancies</div>
                </div>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/20 text-xs text-slate-300 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-teal-400 shrink-0" />
              <span>AI Forensic CPA verified zero revenue leakage at 01:45 AM.</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-[#1F293B] bg-[#0E1522]/50 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-teal-400 font-mono text-xs uppercase tracking-widest font-bold">SEAMLESS INTEGRATION</span>
            <h2 className="text-3xl font-bold text-white">How MY-AUDITOR Protects Your Business</h2>
            <p className="text-slate-400 text-sm">Deploy institutional-grade audit safeguards in minutes without altering your daily POS or sales workflow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold font-mono text-lg">01</div>
              <h3 className="text-base font-bold text-white">Connect &amp; Import</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Link your bank feeds, POS terminals, and inventory logs. MY-AUDITOR organizes records into a pristine double-entry ledger.
              </p>
            </div>

            <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold font-mono text-lg">02</div>
              <h3 className="text-base font-bold text-white">Continuous AI Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our automated algorithms cross-examine cash drops, supplier invoices, and stock depletions 24/7 to catch discrepancies instantly.
              </p>
            </div>

            <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold font-mono text-lg">03</div>
              <h3 className="text-base font-bold text-white">Gain Executive Clarity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Review verified P&amp;L reports, cash positions, and forensic insights from any branch before making strategic growth decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-teal-400 font-mono text-xs uppercase tracking-widest font-bold">BUILT FOR AFRICAN COMMERCE</span>
          <h2 className="text-3xl font-bold text-white">Industries We Serve</h2>
          <p className="text-slate-400 text-sm">Tailored financial intelligence engineered for the unique realities of African retail, wholesale, and services.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <div key={idx} className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 hover:border-teal-500/50 transition">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{ind.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{ind.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="py-20 border-t border-[#1F293B] bg-gradient-to-b from-[#0A0E17] to-[#0E1522] px-6 lg:px-16 text-center">
        <div className="max-w-4xl mx-auto space-y-6 bg-[#111827] border border-[#1F293B] rounded-3xl p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Ready to secure your business financials?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join leading Nigerian and African business owners who trust MY-AUDITOR for complete visibility and continuous audit protection.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className="px-8 py-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-teal-900/30 cursor-pointer"
            >
              Start Auditing Your Business
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 rounded-xl bg-[#0A0E17] hover:bg-[#182234] border border-[#1F293B] text-slate-200 font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1F293B] py-8 px-6 lg:px-16 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div>© 2026 MY-AUDITOR ENTERPRISE FINANCIAL INTELLIGENCE LTD. ALL RIGHTS RESERVED.</div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="hover:text-slate-300">Privacy Policy</Link>
          <Link href="/login" className="hover:text-slate-300">Terms of Service</Link>
          <Link href="/login" className="hover:text-slate-300">Security Audit</Link>
        </div>
      </footer>

    </div>
  );
}