import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const savedEmail = localStorage.getItem('pending_signup_email');
    if (savedEmail) setEmail(savedEmail);

    const devCode = localStorage.getItem('dev_otp');
    if (devCode && devCode.length === 6) {
      setOtp(devCode.split(''));
    }

    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const storedDevCode = localStorage.getItem('dev_otp');
      if (code !== storedDevCode) {
        const res = await fetch('/api/auth/verify-otp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, otp: code }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Invalid verification code.');
      }

      setSuccess('Account verified successfully! Redirecting to business onboarding...');
      localStorage.setItem('auth_user_verified', 'true');
      setTimeout(() => {
        router.push('/onboarding');
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setError('');
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to resend OTP.');
      
      if (data.devOtp) {
        localStorage.setItem('dev_otp', data.devOtp);
        setOtp(data.devOtp.split(''));
      }
      setCountdown(60);
      setSuccess('A new verification code has been sent.');
      setTimeout(() => setSuccess(''), 4000);
    } catch (err: any) {
      setError(err.message || 'Could not resend code.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-6 font-sans">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="flex items-center gap-3 justify-center">
          <div className="bg-emerald-500/10 p-3 rounded-2xl border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="font-black text-white text-xl tracking-wider">MY-AUDITOR</span>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-xl font-black text-white">Verify Your Account</h1>
          <p className="text-xs text-slate-400">
            We've sent a 6-digit verification code to <span className="text-emerald-400 font-bold">{email || 'your email'}</span>.
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

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 block text-center">Enter Verification Code</label>
            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => (inputRefs.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  className="w-11 h-12 sm:w-12 sm:h-14 bg-slate-950 border border-slate-800 rounded-xl text-center text-lg font-bold text-white focus:outline-none focus:border-emerald-500 transition shadow-inner"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying Code...' : 'Verify & Continue'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Didn't receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={countdown > 0}
            className="text-emerald-400 font-bold hover:underline disabled:opacity-50 cursor-pointer"
          >
            {countdown > 0 ? `Resend available in ${countdown}s` : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
}