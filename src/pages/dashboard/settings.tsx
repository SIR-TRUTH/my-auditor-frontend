import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import { 
  Building, 
  Shield, 
  Users, 
  Save, 
  CheckCircle2, 
  KeyRound,
  Plus,
  X
} from 'lucide-react';

export default function SettingsPage() {
  const [businessName, setBusinessName] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [vatRate, setVatRate] = useState('7.5% Standard VAT');
  const [currency, setCurrency] = useState('NGN (₦ - Nigerian Naira)');
  const [savedStatus, setSavedStatus] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Starts completely empty
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // Form states for adding team members
  const [staffName, setStaffName] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState('Senior Accountant');

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedStatus(true);
    setTimeout(() => setSavedStatus(false), 3000);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember = {
      id: Date.now(),
      name: staffName,
      email: staffEmail,
      role: staffRole,
      status: 'Active'
    };
    setTeamMembers([...teamMembers, newMember]);
    setModalOpen(false);
    setStaffName('');
    setStaffEmail('');
  };

  return (
    <AppShell 
      title="Settings & Role-Based Access Control (RBAC)" 
      subtitle="Configure enterprise compliance parameters, tax settings, and user permission hierarchies."
    >
      <div className="space-y-6 max-w-4xl">
        {savedStatus && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-400">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span className="text-xs font-bold">Enterprise settings and compliance parameters updated successfully!</span>
          </div>
        )}

        {/* COMPANY PROFILE & TAX CONFIG */}
        <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center gap-2.5 border-b border-[#1F293B] pb-4">
            <Building className="w-5 h-5 text-teal-400" />
            <h2 className="text-sm font-bold text-white">Company Profile &amp; Regulatory Tax Settings</h2>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Registered Business / Corporate Name *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. My Business Enterprise Ltd"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Tax Identification Number (TIN / CAC) *</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. TIN-12345678-0001"
                  value={tinNumber}
                  onChange={(e) => setTinNumber(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Default Consumption Tax (VAT) *</label>
                <select 
                  value={vatRate}
                  onChange={(e) => setVatRate(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="7.5% Standard VAT">7.5% Standard VAT (Nigerian FIRS)</option>
                  <option value="0% Zero Rated">0% Zero Rated / Export</option>
                  <option value="Exempt">Exempt</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Base Reporting Currency *</label>
                <select 
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="NGN (₦ - Nigerian Naira)">NGN (₦ - Nigerian Naira)</option>
                  <option value="USD ($ - US Dollar)">USD ($ - US Dollar)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button 
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Configuration
              </button>
            </div>
          </form>
        </div>

        {/* ROLE-BASED ACCESS CONTROL (RBAC) */}
        <div className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-[#1F293B] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Shield className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-bold text-white">Role-Based Access Control (RBAC) &amp; Team Permissions</h2>
            </div>
            <button 
              onClick={() => setModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Invite Staff Member
            </button>
          </div>

          {teamMembers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">No staff members added yet. Click "Invite Staff Member" to assign roles to your team.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                    <th className="p-4">Staff Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">Access Status</th>
                    <th className="p-4 text-right">Permissions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1F293B] text-slate-300">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-[#182234]/50">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-teal-400" /> {member.name}
                      </td>
                      <td className="p-4 font-mono text-slate-400">{member.email}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded bg-teal-500/10 text-teal-300 font-semibold text-[10px] font-mono">
                          {member.role}
                        </span>
                      </td>
                      <td className="p-4"><span className="text-emerald-400 font-semibold">{member.status}</span></td>
                      <td className="p-4 text-right">
                        <span className="text-slate-400 hover:text-white cursor-pointer font-semibold flex items-center justify-end gap-1">
                          <KeyRound className="w-3 h-3 text-teal-400" /> Manage
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* INVITE MEMBER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white">Invite Team Member</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                <input 
                  type="text"
                  required
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address *</label>
                <input 
                  type="email"
                  required
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="e.g. staff@company.com"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Assigned Access Role *</label>
                <select 
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Enterprise Administrator">Enterprise Administrator</option>
                  <option value="Senior Accountant">Senior Accountant</option>
                  <option value="Branch Auditor">Branch Auditor</option>
                  <option value="Store Cashier">Store Cashier</option>
                </select>
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
                  Send Access Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}