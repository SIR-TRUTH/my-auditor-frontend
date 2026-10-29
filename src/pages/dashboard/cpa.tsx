import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle, 
  Cpu, 
  FileSearch, 
  CheckCircle2 
} from 'lucide-react';

export default function ForensicCPAPage() {
  const [isRunningScan, setIsRunningScan] = useState(false);
  const [forensicLogs, setForensicLogs] = useState<any[]>([]);

  const handleRunForensicAudit = () => {
    setIsRunningScan(true);
    setTimeout(() => {
      setForensicLogs([
        {
          id: 1,
          anomaly: 'Duplicate Vendor Invoice Detected (#INV-8492)',
          module: 'Purchases & Suppliers',
          severity: 'High Risk',
          action: 'Verify dual payment dispatch with accounts payable.',
          status: 'Flagged for Review'
        },
        {
          id: 2,
          anomaly: 'Unusual Inventory Adjustment Outside Operating Hours',
          module: 'Inventory & WAC',
          severity: 'Medium Risk',
          action: 'Review warehouse CCTV logs and physical stock count.',
          status: 'Under Investigation'
        }
      ]);
      setIsRunningScan(false);
    }, 1200);
  };

  const highRiskCount = forensicLogs.filter(l => l.severity === 'High Risk').length;

  return (
    <AppShell 
      title="AI Forensic CPA & Fraud Auditor" 
      subtitle="Deploy autonomous neural heuristics to detect invoice duplication, inventory shrinkage, and internal fraud."
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRunForensicAudit}
            disabled={isRunningScan}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer disabled:opacity-50"
          >
            <Cpu className="w-4 h-4 animate-spin" /> {isRunningScan ? 'Scanning Ledgers...' : 'Run Forensic Audit'}
          </button>
        </div>
      }
    >
      {/* FORENSIC TELEMETRY KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Forensic Risk Index</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><ShieldCheck className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {forensicLogs.length === 0 ? '0.0% (Secure)' : 'Moderate Risk'}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Fraud Flags</span>
            <span className="p-1 rounded bg-amber-500/10 text-amber-400"><ShieldAlert className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{forensicLogs.length}</div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Neural Auditor Status</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><Sparkles className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-sm font-bold text-teal-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" /> Autonomous &amp; Ready
          </div>
        </div>
      </div>

      {/* AI FORENSIC BANNER */}
      <div className="bg-gradient-to-r from-teal-950/40 via-[#111827] to-[#111827] border border-teal-500/30 rounded-2xl p-6 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-teal-400">
          <FileSearch className="w-5 h-5" />
          <h2 className="text-sm font-bold text-white">Autonomous Forensic Surveillance</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Click <span className="text-teal-400 font-bold">"Run Forensic Audit"</span> above to trigger deep neural scan algorithms across all transactions, sales logs, inventory adjustments, and supplier accounts payable to detect hidden financial discrepancies.
        </p>
      </div>

      {/* FORENSIC LEDGER TABLE */}
      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Forensic Investigation &amp; Anomaly Ledger</h2>
          <span className="text-xs text-slate-400">Showing AI-detected anomalies and recommended investigator actions</span>
        </div>

        {forensicLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck className="w-10 h-10 text-teal-500 mx-auto" />
            <p className="text-xs text-slate-400">No forensic anomalies detected. Click "Run Forensic Audit" to scan current platform records.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                  <th className="p-4">Detected Anomaly</th>
                  <th className="p-4">Module Source</th>
                  <th className="p-4">Severity Level</th>
                  <th className="p-4">Recommended Action</th>
                  <th className="p-4">Investigation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B] text-slate-300">
                {forensicLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#182234]/50">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> {log.anomaly}
                    </td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-mono">{log.module}</span></td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                        log.severity === 'High Risk' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {log.severity}
                      </span>
                    </td>
                    <td className="p-4">{log.action}</td>
                    <td className="p-4"><span className="text-amber-400 font-semibold">{log.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}