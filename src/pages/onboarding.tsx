import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ShieldCheck, Building2, Store, Globe, Coins, Briefcase, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    tradingName: '',
    industry: 'Retail',
    country: 'Nigeria',
    currency: 'NGN — Nigerian Naira',
    branchName: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const industries = [
    'Retail',
    'Supermarket',
    'Hotel',
    'Restaurant',
    'Bar',
    'Pharmacy',
    'Manufacturing',
    'Logistics',
    'Professional Services',
    'Other',
  ];

  const countries = ['Nigeria', 'Ghana', 'Kenya', 'United Kingdom', 'United States', 'Other'];

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.businessName.trim()) {
      setError('Please enter your Legal Business Name.');
      return;
    }
    if (!formData.branchName.trim()) {
      setError('Please enter your First Branch Name.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to complete onboarding.');

      setSuccess('Business environment configured successfully! Redirecting to your dashboard...');
      localStorage.setItem('onboarding_completed', 'true');
      localStorage.setItem('current_business_name', formData.businessName);
      localStorage.setItem('current_branch_name', formData.branchName);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred during onboarding.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 p-8 sm:p-12 rounded-3xl shadow-2xl space-y-8">
        <div className="flex items-center gap-3 justify-center">
          <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-black text-white text-xl tracking-wider">MY-AUDITOR</span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white">Set Up Your Business</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Tell MY-AUDITOR about your business so we can configure your audit environment.
          </p>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}

        <form onSubmit={handleOnboardingSubmit} className="space-y-6 text-xs">
          {/* Business Information Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-black text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4" /> Business Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Legal Business Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TRUTH TEST ENTERPRISE"
                  value={formData.businessName}
                  onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Trading Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Truth Stores"
                  value={formData.tradingName}
                  onChange={e => setFormData({ ...formData, tradingName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Business Type / Industry *</label>
                <select
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                >
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Country *</label>
                <select
                  value={formData.country}
                  onChange={e => setFormData({ ...formData, country: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition cursor-pointer"
                >
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Currency *</label>
                <input
                  type="text"
                  disabled
                  value={formData.currency}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-400 cursor-not-allowed font-mono"
                />
              </div>
            </div>
          </div>

          {/* First Branch Section */}
          <div className="space-y-4 pt-4">
            <h2 className="text-sm font-black text-emerald-400 uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-2">
              <Store className="w-4 h-4" /> First Business Location
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Branch / Store Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gwarinpa Test Store"
                  value={formData.branchName}
                  onChange={e => setFormData({ ...formData, branchName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-300">Location / Address (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Plot 12, 3rd Avenue, Gwarinpa"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50 mt-6"
          >
            {loading ? 'Configuring Business Environment...' : 'Complete Setup & Open Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}