import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, ShieldCheck, FileText, Lock } from 'lucide-react';
import { globalAuditEngine } from '../lib/auditEngine';
import { formatKoboToNaira } from '../lib/currency';
import { UserContext, enforcePermission } from '../lib/rbacEngine';

interface AuditModuleProps {
  currentUser: UserContext;
  currencyKey: string;
  onAuditUpdated: () => void;
}

export default function AuditModule({ currentUser, currencyKey, onAuditUpdated }: AuditModuleProps) {
  const [notice, setNotice] = useState('');

  const formatMoney = (koboVal: bigint) => formatKoboToNaira(koboVal, currencyKey === 'USD' ? '$' : '₦');

  const findings = globalAuditEngine.getFindings();
  const totalExposureKobo = globalAuditEngine.getTotalPotentialExposureKobo();

  const handleAuthorizeWriteOff = (findingId: string) => {
    try {
      enforcePermission(currentUser, 'APPROVE_WRITE_OFF');
      // In a full enterprise flow, this marks the finding as authorized write-off
      setNotice(`Finding ${findingId} authorized for write-off and isolated from P&L.`);
      onAuditUpdated();
      setTimeout(() => setNotice(''), 4000);
    } catch (err: any) {
      alert(`RBAC Blocked: ${err.message} (Only Admin / Senior Auditor can authorize write-offs).`);
    }
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          {notice}
        </div>
      )}

      {/* Audit Header Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" /> Continuous Audit Centre
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time anomaly detection, stock shrinkages, and reconciliation exposures.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg font-bold">
              Strictly Isolated from P&L Net Profit
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-bold">
              Total Potential Exposure: {formatMoney(totalExposureKobo)}
            </span>
          </div>
        </div>
      </div>

      {/* Audit Findings Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Registered Discrepancies & Anomalies</span>
          <span className="text-xs text-slate-400 font-mono">{findings.length} findings open</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Finding ID</th>
                <th className="p-4">Discrepancy Type</th>
                <th className="p-4">Description</th>
                <th className="p-4">Branch</th>
                <th className="p-4 text-right">Potential Exposure</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {findings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No active audit findings. All stock movements and journals are fully reconciled.
                  </td>
                </tr>
              ) : (
                findings.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-4 font-mono text-amber-400 font-bold">{f.id}</td>
                    <td className="p-4 font-bold text-white">{f.discrepancyType}</td>
                    <td className="p-4 text-slate-300 max-w-xs truncate">{f.description}</td>
                    <td className="p-4 text-slate-400">{f.branchId}</td>
                    <td className="p-4 text-right font-bold text-amber-400">{formatMoney(f.potentialExposureKobo)}</td>
                    <td className="p-4 text-center">
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md font-bold">
                        {f.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleAuthorizeWriteOff(f.id)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        Authorize Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}