import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, BarChart3, Layers, ChevronLeft, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const slides = [
    {
      image: '/images/slides/slide-1.svg',
      tag: 'FINANCIAL INTELLIGENCE',
      title: 'Real-Time Ledger & P&L Tracking',
      desc: 'Deterministic double-entry accounting built for retail, multi-branch, and enterprise ops.',
    },
    {
      image: '/images/slides/slide-2.svg',
      tag: 'CONTINUOUS COMPLIANCE',
      title: 'Automated Anomaly Detection',
      desc: 'Prevent revenue leakage, supplier overbilling, and unverified inventory write-offs.',
    },
    {
      image: '/images/slides/slide-3.svg',
      tag: 'ENTERPRISE INVENTORY',
      title: 'Weighted Average Cost (WAC)',
      desc: 'Consolidated stock valuation and branch-level inventory control across Nigeria & beyond.',
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F9FAFB] flex flex-col font-sans antialiased selection:bg-teal-500/30 selection:text-teal-300">
      
      {/* Top Navbar */}
      <header className="h-20 border-b border-[#1F293B] px-6 lg:px-12 flex items-center justify-between bg-[#0E1522]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-white text-base tracking-wider uppercase font-mono">MY-AUDITOR</span>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <Link href="/login" className="px-4 py-2 rounded-xl text-slate-300 hover:text-white transition">
            Log In
          </Link>
          <Link href="/signup" className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-md flex items-center gap-1.5">
            Sign Up <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-6xl mx-auto space-y-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Enterprise Financial Intelligence &amp; Continuous Audit</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight max-w-4xl">
          Smart Store Auditing &amp; <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">Financial Intelligence</span>
        </h1>

        {/* HERO SLIDESHOW CAROUSEL */}
        <div className="w-full relative rounded-2xl overflow-hidden border border-[#1F293B] bg-[#111827] shadow-2xl aspect-[16/8] sm:aspect-[21/9]">
          <img 
            src={slides[currentSlide].image} 
            alt={slides[currentSlide].title} 
            className="w-full h-full object-cover transition-opacity duration-700"
          />
          
          {/* Slideshow Controls & Indicators */}
          <button 
            onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-teal-600 transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 border border-white/10 text-white hover:bg-teal-600 transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${idx === currentSlide ? 'w-8 bg-teal-400' : 'w-2 bg-slate-600'}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
          <Link 
            href="/signup" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg cursor-pointer"
          >
            Create Enterprise Account <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/login" 
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#111827] hover:bg-[#182234] border border-[#1F293B] text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
          >
            Sign In to Command Centre
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 w-full text-left">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Continuous Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real-time automated inspection of every transaction, invoice, and ledger entry for complete accuracy.
            </p>
          </div>

          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">WAC &amp; Inventory</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precise weighted average cost valuation and branch stock tracking with zero leakage.
            </p>
          </div>

          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Multi-Branch Sync</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Consolidated financial performance across all store locations with strict RBAC permissions.
            </p>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#1F293B] py-6 px-6 text-center text-[11px] font-mono text-slate-500">
        MY-AUDITOR ENTERPRISE FINANCIAL INTELLIGENCE • SECURE PRODUCTION v2.4
      </footer>

    </div>
  );
}