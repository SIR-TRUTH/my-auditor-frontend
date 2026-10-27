import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldCheck, Lock, Mail, ArrowRight, CheckCircle2, Building2 } from 'lucide-react';

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('current_business_name', 'Enterprise HQ');
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A0E17] text-[#F9FAFB] grid grid-cols-1 lg:grid-cols-12 font-sans antialiased">
      
      {/* Left Column: Native Enterprise Dashboard Card */}
      <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-[#0E1522] border-r border-[#1F293B] flex-col justify-between p-12">
        
        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-white text-base tracking-wider uppercase font-mono">MY-AUDITOR</span>
        </div>

        {/* Native Telemetry Preview Card */}
        <div className="relative z-10 max-w-xl bg-[#111827] border border-[#1F293B] rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-[#1F293B] pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span className="font-bold text-white text-xs">Enterprise HQ • Lagos</span>
            </div>
            <span className="text-[10px] font-mono text-teal-400 font-bold">SYSTEM ONLINE</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0A0E17] p-3 rounded-xl border border-[#1F293B]">
              <div className="text-[10px] text-slate-400">Total Sales Today</div>
              <div className="text-sm font-bold text-white font-mono mt-1">₦4,850,200.00</div>
            </div>
            <div className="bg-[#0A0E17] p-3 rounded-xl border border-[#1F293B]">
              <div className="text-[10px] text-slate-400">Reconciliation Match</div>
              <div className="text-sm font-bold text-teal-400 font-mono mt-1">100.0% Matched</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Double-entry ledger status: verified and fully compliant.</span>
          </div>
        </div>

        {/* Bottom Heading */}
        <div className="relative z-10 space-y-2 max-w-xl">
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Uncompromised visibility across all your branch ledgers.
          </h2>
          <p className="text-slate-400 text-xs leading-relaxed">
            Verify daily cash drops, POS settlements, inventory WAC valuation, and double-entry accounting in real time.
          </p>
        </div>
      </div>

      {/* Right Column: Clean Login Form */}
      <div className="lg:col-span-5 flex flex-col justify-center px-6 sm:px-12 py-12">
        <div className="max-w-md w-full mx-auto space-y-8 bg-[#111827] border border-[#1F293B] p-8 rounded-3xl shadow-2xl">
          
          <div className="space-y-2 text-center lg:text-left">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold mx-auto lg:mx-0 mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Account Login</h1>
            <p className="text-xs text-slate-400">Enter your credentials to access your financial command centre</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Business Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@enterprise.com" 
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <Link href="/auth/forgot-password" className="text-[11px] text-teal-400 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full py-3.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 cursor-pointer"
            >
              Sign In to Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-400 pt-2 border-t border-[#1F293B]">
            Don't have an account yet? <Link href="/signup" className="text-teal-400 font-semibold hover:underline">Sign Up</Link>
          </div>

        </div>
      </div>

    </div>
  );
}