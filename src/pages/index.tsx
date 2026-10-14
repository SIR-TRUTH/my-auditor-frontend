import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1d] text-white flex flex-col overflow-x-hidden font-sans">
      {/* NAVBAR */}
      <header className="w-full border-b border-gray-800 bg-[#0d1424]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
          {/* LOGO */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-sm sm:text-lg font-bold tracking-tight text-white whitespace-nowrap leading-tight">
                MY-AUDITOR
              </span>
              <span className="text-[10px] text-emerald-400 font-medium hidden sm:block">
                Automated Store Auditing
              </span>
            </div>
          </div>

          {/* AUTH NAVIGATION */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/dashboard"
              className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-gray-300 hover:text-white transition whitespace-nowrap"
            >
              Log In
            </Link>
            <Link
              href="/register"
              className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 transition shadow-lg shadow-emerald-500/20 whitespace-nowrap"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 sm:py-20 max-w-4xl mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-6">
          <span>🤖 Welcome to MY-AUDITOR</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
          Smart Store Auditing & <br className="hidden sm:inline" />
          <span className="text-emerald-400">Receipt Analysis</span>
        </h1>

        <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-2xl mb-8 leading-relaxed px-2">
          The all-in-one multi-tenant auditing solution for business owners. Process receipts, manage branch stock, and track discrepancies automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-xs sm:max-w-none">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20"
          >
            Sign Up &rarr;
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 hover:text-white font-medium text-sm transition"
          >
            Log In
          </Link>
        </div>
      </main>
    </div>
  );
}