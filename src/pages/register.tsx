import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function RegisterRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/signup');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-emerald-400 font-semibold animate-pulse">Loading Secure OTP Verification Signup...</p>
      </div>
    </div>
  );
}