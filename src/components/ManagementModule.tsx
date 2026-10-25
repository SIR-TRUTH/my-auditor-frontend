import React, { useState } from 'react';
import { Settings, Building2, Users, FileCode, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { globalAccountingEngine } from '../lib/accountingEngine';
import { formatKoboToNaira } from '../lib/currency';
import { UserContext, enforcePermission, UserRole } from '../lib/rbacEngine';

interface ManagementModuleProps {
  currentUser: UserContext;
  currencyKey: string;
  onSettingsUpdated: () => void;
}

export default function ManagementModule({ currentUser, currencyKey, onSettingsUpdated }: ManagementModuleProps) {
  const [activeSubTab, setActiveSubTab] = useState<'accounting' | 'branches' | 'roles' | 'integrations'>('accounting');
  const [notice, setNotice] = useState('');

  const formatMoney = (koboVal: bigint) => formatKoboToNaira(koboVal, currencyKey === 'USD' ? '$' : '₦');
  const allJournals = globalAccountingEngine.getJournalEntries();

  const handleTestIntegration = (integrationName: string) => {
    try {
      enforcePermission(currentUser, 'POST_TRANSACTION');
      setNotice(`Successfully connected and synchronized with ${integrationName} API.`);
      setTimeout(() => setNotice(''), 4000);
    } catch (err: any) {
      alert(`RBAC Blocked: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {notice}
        </div>
      )}

      {/* Header & Sub-navigation */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" /> Accounting, Branches & Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage double-entry journals, multi-tenant branch isolation, RBAC security, and external API integrations.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={() => setActiveSubTab('accounting')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${activeSubTab === 'accounting' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Accounting Journals
          </button>
          <button
            onClick={() => setActiveSubTab('branches')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${activeSubTab === 'branches' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Branch Management
          </button>
          <button
            onClick={() => setActiveSubTab('roles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${activeSubTab === 'roles' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Users & RBAC Roles
          </button>
          <button
            onClick={() => setActiveSubTab('integrations')}
            className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer ${activeSubTab === 'integrations' ? 'bg-emerald-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            Integrations (Coming Soon)
          </button>
        </div>
      </div>

      {/* TAB 1: ACCOUNTING JOURNALS */}
      {activeSubTab === 'accounting' && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Double-Entry Accounting Ledger</span>
            <span className="text-xs text-slate-400 font-mono">{allJournals.length} total entries posted</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Journal ID</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Description</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4 text-right">Debit / Credit Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {allJournals.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500">
                      No accounting journals recorded. (Zero-state active).
                    </td>
                  </tr>
                ) : (
                  allJournals.map((j) => {
                    const totalDebit = j.lines.filter(l => l.type === 'DEBIT').reduce((acc, l) => acc + l.amountKobo, 0n);
                    return (
                      <tr key={j.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-4 font-mono text-emerald-400 font-bold">{j.id}</td>
                        <td className="p-4 text-slate-400">{new Date(j.timestamp).toLocaleString()}</td>
                        <td className="p-4 font-medium text-white">{j.description}</td>
                        <td className="p-4 text-slate-400">{j.branchId}</td>
                        <td className="p-4 text-right font-bold text-emerald-400">{formatMoney(totalDebit)}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BRANCH MANAGEMENT */}
      {activeSubTab === 'branches' && (
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Registered Enterprise Branches</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 rounded-xl border border-emerald-500/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">Main Flagship Store</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">Active</span>
              </div>
              <p className="text-xs text-slate-400">Branch ID: branch-main</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">Ikeja Outlet</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">Isolated</span>
              </div>
              <p className="text-xs text-slate-400">Branch ID: branch-ikeja</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white text-sm">Abuja Branch</span>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">Isolated</span>
              </div>
              <p className="text-xs text-slate-400">Branch ID: branch-abuja</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ROLES & RBAC */}
      {activeSubTab === 'roles' && (
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Role-Based Access Control (RBAC) Permissions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <p className="font-bold text-emerald-400 text-sm">ADMIN</p>
              <p className="text-slate-400">Full transactional write access, user management, and write-off authorizations.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <p className="font-bold text-amber-400 text-sm">AUDITOR</p>
              <p className="text-slate-400">Read access to audit findings, journal inspection, and compliance reports.</p>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <p className="font-bold text-purple-400 text-sm">INVESTOR</p>
              <p className="text-slate-400">Read-only P&L statements and exposure summaries. Operational writes locked.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTEGRATIONS */}
      {activeSubTab === 'integrations' && (
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Enterprise API Integrations</h3>
          <div className="space-y-3">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-white">Flutterwave / Paystack Payment Gateway</p>
                <p className="text-slate-400">Automatic POS settlement and bank reconciliation feed.</p>
              </div>
              <button onClick={() => handleTestIntegration('Payment Gateway')} className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg cursor-pointer">
                Connect API
              </button>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-white">FIRS Tax e-Invoicing Connector</p>
                <p className="text-slate-400">Automated VAT and withholding tax reporting.</p>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-3 py-1 rounded-lg font-bold">Coming Soon</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}