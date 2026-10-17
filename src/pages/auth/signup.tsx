import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldCheck, Mail, Phone, User, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const [step, setStep] = useState<'DETAILS' | 'OTP'>('DETAILS');
  const [legalName, setLegalName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!legalName || !email || !phone || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('myauditor_users') || '[]');
    const emailExists = existingUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
    const phoneExists = existingUsers.some((u: any) => u.phone === phone);

    if (emailExists) {
      setErrorMsg('An account with this email address already exists. Please sign in.');
      return;
    }

    if (phoneExists) {
      setErrorMsg('An account with this phone number already exists.');
      return;
    }

    setIsLoading(true);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: code })
      });

      if (!res.ok) {
        throw new Error('Failed to send OTP email.');
      }

      setInfoMsg(`A 6-digit security code has been sent to ${email}. Please check your inbox or spam folder.`);
      setStep('OTP');
    } catch (err) {
      setErrorMsg('Unable to dispatch verification email. Please verify your email address.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtpAndSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (enteredOtp !== generatedOtp) {
      setErrorMsg('Invalid verification code. Please check your email and try again.');
      return;
    }

    setIsLoading(true);

    const existingUsers = JSON.parse(localStorage.getItem('myauditor_users') || '[]');
    const newUser = {
      id: `usr-${Date.now()}`,
      legalName,
      email: email.toLowerCase(),
      phone,
      createdAt: new Date().toISOString()
    };

    localStorage.setItem('myauditor_users', JSON.stringify([...existingUsers, newUser]));
    localStorage.setItem('myauditor_current_user', JSON.stringify(newUser));

    try {
      await fetch('/api/auth/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ legalName, email })
      });
    } catch (err) {
      console.error("Welcome email error:", err);
    }

    setIsLoading(false);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center px-4 font-sans">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-emerald-500/10 p-2.5 rounded-2xl border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-2xl font-black tracking-wider text-white">MY-AUDITOR</span>
          </Link>
          <h1 className="text-lg font-bold text-slate-200 mt-2">
            {step === 'DETAILS' ? 'Create Enterprise Account' : 'Security Email Verification'}
          </h1>
          <p className="text-xs text-slate-400">
            {step === 'DETAILS' ? 'Enter your details to generate your security OTP' : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {infoMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{infoMsg}</span>
          </div>
        )}

        {step === 'DETAILS' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={legalName}
                  onChange={e => setLegalName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Business Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+234 800 000 0000"
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl pl-10 pr-3 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? 'Sending Security Code...' : 'Send Verification OTP'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtpAndSignup} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1">Enter 6-Digit Security Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={enteredOtp}
                onChange={e => setEnteredOtp(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-950 border border-slate-800 text-center text-xl tracking-[8px] font-black rounded-xl py-3 text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setStep('DETAILS')}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                {isLoading ? 'Verifying...' : 'Verify & Create Account'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center pt-2 border-t border-slate-800">
          <p className="text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-emerald-400 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}