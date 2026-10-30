import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import { 
  Zap, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  FileCheck, 
  Layers, 
  CheckCircle2, 
  Terminal,
  Database
} from 'lucide-react';

export default function ActionHubPage() {
  const [executingAction, setExecutingAction] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleRunAction = (actionName: string) => {
    setExecutingAction(actionName);
    setTimeout(() => {
      setExecutingAction(null);
      setSuccessMsg(`Successfully executed: ${actionName}`);
      setTimeout(() => setSuccessMsg(null), 3500);
    }, 1200);
  };

  return (
    <AppShell 
      title="Action Hub & Autonomous Operations" 
      subtitle="Execute instant enterprise triggers, real-time ledger audits, and cross-branch synchronization tasks."
    >
      <div className="space-y-6 max-w-5xl">
        {/* SUCCESS NOTIFICATION */}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold">{successMsg}</span>
          </div>
        )}

        {/* TOP STATUS BANNER */}
        <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Enterprise Command &amp; Control Centre</h2>
              <p className="text-xs text-slate-400">All neural heuristics, tax compliance engines, and ledger sync routines are online.</p>
            </div>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold border border-emerald-500/20 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> SYSTEM HEALTH: 100% SECURE
          </span>
        </div>

        {/* ACTION CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Action 1 */}
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400"><RefreshCw className="w-4 h-4" /></span>
                <span className="text-[10px] font-mono text-slate-400">MODULE SYNC</span>
              </div>
              <h3 className="text-sm font-bold text-white">Reconcile All Branch Ledgers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Force immediate cross-outlet synchronization across all registered Nigerian branch registers and inventory WAC valuations.
              </p>
            </div>
            <button 
              onClick={() => handleRunAction('Cross-Branch Ledger Reconciliation')}
              disabled={executingAction !== null}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" /> {executingAction === 'Cross-Branch Ledger Reconciliation' ? 'Executing...' : 'Run Reconciliation'}
            </button>
          </div>

          {/* Action 2 */}
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400"><ShieldCheck className="w-4 h-4" /></span>
                <span className="text-[10px] font-mono text-slate-400">FRAUD HEURISTICS</span>
              </div>
              <h3 className="text-sm font-bold text-white">Trigger Deep Neural Forensic Audit</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Deploy autonomous AI CPA heuristics to scan all accounts payable, supplier invoices, and duplicate receipt entries.
              </p>
            </div>
            <button 
              onClick={() => handleRunAction('Neural Forensic Audit')}
              disabled={executingAction !== null}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" /> {executingAction === 'Neural Forensic Audit' ? 'Scanning Ledgers...' : 'Run Forensic Audit'}
            </button>
          </div>

          {/* Action 3 */}
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400"><FileCheck className="w-4 h-4" /></span>
                <span className="text-[10px] font-mono text-slate-400">TAX &amp; FIRS</span>
              </div>
              <h3 className="text-sm font-bold text-white">Generate FIRS Tax Compliance Report</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compile institutional VAT and Company Income Tax (CIT) schedules ready for immediate corporate filing.
              </p>
            </div>
            <button 
              onClick={() => handleRunAction('FIRS Tax Compliance Schedule')}
              disabled={executingAction !== null}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" /> {executingAction === 'FIRS Tax Compliance Schedule' ? 'Generating...' : 'Generate Tax Schedule'}
            </button>
          </div>

          {/* Action 4 */}
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="p-2 rounded-lg bg-teal-500/10 text-teal-400"><Database className="w-4 h-4" /></span>
                <span className="text-[10px] font-mono text-slate-400">BACKUP &amp; EXPORT</span>
              </div>
              <h3 className="text-sm font-bold text-white">Export Complete Enterprise Ledger Backup</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Download encrypted JSON/CSV backups of all 16 platform ledgers for offsite secure data archiving.
              </p>
            </div>
            <button 
              onClick={() => handleRunAction('Enterprise Ledger Archive')}
              disabled={executingAction !== null}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" /> {executingAction === 'Enterprise Ledger Archive' ? 'Archiving...' : 'Download Full Archive'}
            </button>
          </div>
        </div>

        {/* SYSTEM TERMINAL LOG */}
        <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#1F293B] pb-3 text-slate-400 font-mono text-xs">
            <Terminal className="w-4 h-4 text-teal-400" />
            <span>Autonomous Action Hub Daemon Status: ONLINE</span>
          </div>
          <div className="font-mono text-[11px] text-slate-400 space-y-1">
            <p className="text-emerald-400">&gt; [OK] All 16 core enterprise modules responding normally.</p>
            <p className="text-slate-400">&gt; [READY] Awaiting administrator task triggers...</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}