import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

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
      
      {/* Left Column: Office CEO Desk Photo Showcase */}
      <div className="hidden lg:flex lg:col-span-7 relative overflow-hidden bg-[#0E1522] border-r border-[#1F293B] flex-col justify-between p-12">
        <div className="absolute inset-0">
          <img 
            src="/images/ceo-office-desk-v1.jpg" 
            alt="African executive working at office desk" 
            className="w-full h-full object-cover object-center opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/60 to-transparent" />
        </div>

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-bold text-white text-base tracking-wider uppercase font-mono">MY-AUDITOR</span>
        </div>

        {/* Bottom Feature Text */}
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Continuous Audit &amp; Enterprise Security</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Uncompromised visibility across all your branch ledgers.
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
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