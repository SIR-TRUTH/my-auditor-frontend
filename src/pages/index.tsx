import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, Building2, CheckCircle2 } from 'lucide-react';

export default function EnterpriseLandingPage() {
  const industries = [
    { name: 'Supermarkets & Retail', desc: 'Barcode scanning, POS reconciliation, and WAC stock tracking.', image: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=800&auto=format&fit=crop' },
    { name: 'Pharmacies & Medical', desc: 'Batch expiry tracking, controlled substance audits, and supplier ledger control.', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop' },
    { name: 'Restaurants & Bars', desc: 'Recipe inventory depletion, kitchen waste audits, and daily cash reconciliation.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop' },
    { name: 'Hotels & Hospitality', desc: 'Room revenue audit, POS split payments, and asset depreciation tracking.', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop' },
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
          <Link href="/auth/signin" className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white transition">
            Log In
          </Link>
          <Link href="/signup" className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-lg shadow-teal-900/20 flex items-center gap-1.5">
            Start Auditing <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Hero Section with Local African CEO Office Image */}
      <section className="px-6 lg:px-16 py-16 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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
              href="/auth/signin" 
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

        {/* Hero Visual Card Featuring Local African CEO Office Photo */}
        <div className="lg:col-span-5">
          <div className="relative rounded-2xl overflow-hidden border border-[#1F293B] shadow-2xl bg-[#111827] group">
            <div className="relative h-[380px] w-full">
              <img 
                src="/images/african-ceo-office.jpg" 
                alt="African CEO sitting in his office checking MY-AUDITOR on his computer" 
                className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/20 to-transparent" />
            </div>

            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-[#0E1522]/95 backdrop-blur-md border border-[#1F293B] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">Executive Command Centre</span>
                <span className="text-teal-400 font-mono font-bold">● LIVE SYNC</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Real-Time Ledger Check</span>
                <span className="font-bold text-emerald-400 font-mono text-xs">Zero Discrepancies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-20 px-6 lg:px-16 max-w-7xl mx-auto space-y-12 border-t border-[#1F293B]">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-teal-400 font-mono text-xs uppercase tracking-widest font-bold">BUILT FOR AFRICAN COMMERCE</span>
          <h2 className="text-3xl font-bold text-white">Industries We Serve</h2>
          <p className="text-slate-400 text-sm">Tailored financial intelligence engineered for African retail, supermarkets, hospitality, and growing enterprises.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => (
            <div key={idx} className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden group hover:border-teal-500/50 transition">
              <div className="h-44 w-full relative overflow-hidden">
                <img src={ind.image} alt={ind.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-base font-bold text-white">{ind.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{ind.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1F293B] py-8 px-6 lg:px-16 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div>© 2026 MY-AUDITOR ENTERPRISE FINANCIAL INTELLIGENCE LTD. ALL RIGHTS RESERVED.</div>
        <div className="flex items-center gap-6">
          <Link href="/auth/signin" className="hover:text-slate-300">Privacy Policy</Link>
          <Link href="/auth/signin" className="hover:text-slate-300">Terms of Service</Link>
        </div>
      </footer>

    </div>
  );
}