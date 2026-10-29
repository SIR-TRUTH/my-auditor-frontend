import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import { 
  Building2, 
  Plus, 
  X, 
  CheckCircle2, 
  MapPin, 
  Users, 
  ArrowRightLeft, 
  ShieldCheck 
} from 'lucide-react';

export default function BranchesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [branchesList, setBranchesList] = useState<any[]>([]);

  const [branchName, setBranchName] = useState('');
  const [location, setLocation] = useState('');
  const [manager, setManager] = useState('');

  const handleAddBranch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBranch = {
      id: Date.now(),
      name: branchName || 'New Enterprise Outlet',
      location: location || 'Regional Hub',
      manager: manager || 'Store Manager',
      revenue: 0,
      inventoryValuation: 0,
      status: 'Onboarded & Active'
    };
    setBranchesList([...branchesList, newBranch]);
    setModalOpen(false);
    setBranchName('');
    setLocation('');
    setManager('');
  };

  const totalConsolidatedRevenue = branchesList.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <AppShell 
      title="Branch & Multi-Outlet Management" 
      subtitle="Monitor multi-location branch performance, consolidated HQ ledgers, and inter-branch inventory transfers."
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Onboard New Branch
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Outlets</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><Building2 className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{branchesList.length} Outlets</div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Consolidated Multi-Branch Revenue</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><ArrowRightLeft className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-teal-400 font-mono">
            ₦{totalConsolidatedRevenue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">HQ Audit Consolidation</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><ShieldCheck className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" /> 100% Synced
          </div>
        </div>
      </div>

      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Registered Enterprise Branches &amp; Outlets</h2>
          <span className="text-xs text-slate-400">Showing regional sales, localized inventory valuations, and managers</span>
        </div>

        {branchesList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No branches added yet. Click "Onboard New Branch" to log your first outlet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                  <th className="p-4">Branch Name</th>
                  <th className="p-4">Location / Region</th>
                  <th className="p-4">Store Manager</th>
                  <th className="p-4">Logged Sales (₦)</th>
                  <th className="p-4">Inventory Valuation (₦)</th>
                  <th className="p-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B] text-slate-300">
                {branchesList.map((branch) => (
                  <tr key={branch.id} className="hover:bg-[#182234]/50">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-teal-400" /> {branch.name}
                    </td>
                    <td className="p-4 font-mono flex items-center gap-1 text-slate-300">
                      <MapPin className="w-3 h-3 text-slate-500" /> {branch.location}
                    </td>
                    <td className="p-4 font-semibold text-slate-200">
                      <span className="flex items-center gap-1"><Users className="w-3 h-3 text-teal-400" /> {branch.manager}</span>
                    </td>
                    <td className="p-4 font-mono text-teal-400 font-bold">₦{branch.revenue.toLocaleString()}</td>
                    <td className="p-4 font-mono text-slate-300">₦{branch.inventoryValuation.toLocaleString()}</td>
                    <td className="p-4"><span className="text-emerald-400 font-semibold">{branch.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white">Onboard New Regional Branch</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBranch} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Branch / Outlet Name *</label>
                <input 
                  type="text"
                  required
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  placeholder="e.g. Abuja Central Hub"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Location / Address *</label>
                <input 
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Wuse 2, Abuja"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Assigned Store Manager *</label>
                <input 
                  type="text"
                  required
                  value={manager}
                  onChange={(e) => setManager(e.target.value)}
                  placeholder="e.g. Segun Adebayo"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] text-slate-300 text-xs font-bold hover:bg-[#182234] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-lg cursor-pointer"
                >
                  Save &amp; Activate Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}