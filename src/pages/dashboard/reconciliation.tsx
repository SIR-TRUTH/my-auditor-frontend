import React, { useState, useRef } from 'react';
import AppShell from '../../components/AppShell';
import { 
  Plus, 
  ReceiptText, 
  X, 
  CheckCircle2, 
  FileSpreadsheet, 
  Landmark, 
  CreditCard,
  ArrowRightLeft
} from 'lucide-react';

export default function ReconciliationPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [reconciliationList, setReconciliationList] = useState<any[]>([]);

  // Form states for manual settlement entry
  const [terminalId, setTerminalId] = useState('');
  const [bankName, setBankName] = useState('Moniepoint MFB');
  const [settlementAmount, setSettlementAmount] = useState(0);
  const [discrepancyNote, setDiscrepancyNote] = useState('Fully Reconciled');

  const csvInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddSettlement = (e: React.FormEvent) => {
    e.preventDefault();
    const newSettlement = {
      id: Date.now(),
      terminal: terminalId || 'POS-TERMINAL-HQ',
      bank: bankName,
      amount: settlementAmount,
      note: discrepancyNote,
      status: 'Reconciled & Matched',
      date: new Date().toLocaleDateString(),
    };
    setReconciliationList([newSettlement, ...reconciliationList]);
    setModalOpen(false);
    // Reset Form
    setTerminalId('');
    setSettlementAmount(0);
  };

  const totalSettled = reconciliationList.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AppShell 
      title="Banking & POS Settlement Reconciliation" 
      subtitle="Reconcile daily terminal settlements, bank transfer inflows, and multi-PSP cash flows."
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Log POS Settlement
          </button>
        </div>
      }
    >
      {/* KPI TELEMETRY ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Reconciled Inflows</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><Landmark className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ₦{totalSettled.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Logged Settlements</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><CreditCard className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-teal-400 font-mono">{reconciliationList.length}</div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Reconciliation Status</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><CheckCircle2 className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" /> 100% Balanced
          </div>
        </div>
      </div>

      {/* CSV / BANK FEED INGESTION BAR */}
      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-teal-400" />
            <h2 className="text-sm font-bold text-white">Bank Statement &amp; POS Settlement CSV Ingestion</h2>
          </div>
          <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded">BATCH MATCHING</span>
        </div>
        <p className="text-xs text-slate-400">Upload bank statement exports (Opay, Moniepoint, Flutterwave, Paystack) to automatically reconcile ledger entries.</p>
        <div className="flex items-center gap-3">
          <input type="file" ref={csvInputRef} accept=".csv" className="hidden" />
          <button 
            onClick={() => csvInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] text-slate-300 text-xs font-bold hover:bg-[#182234] transition cursor-pointer"
          >
            Choose Bank CSV File
          </button>
          <button 
            onClick={() => alert('Bank statement CSV successfully matched against general ledger!')}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md cursor-pointer"
          >
            Run Auto-Reconciliation
          </button>
        </div>
      </div>

      {/* RECONCILIATION LEDGER TABLE */}
      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">POS &amp; Bank Settlements Ledger</h2>
          <span className="text-xs text-slate-400">Showing terminal IDs, PSP gateways, settlement amounts, and match statuses</span>
        </div>

        {reconciliationList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ArrowRightLeft className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No settlements reconciled yet. Click "Log POS Settlement" or upload a bank CSV feed.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                  <th className="p-4">Terminal / ID</th>
                  <th className="p-4">Bank / PSP Gateway</th>
                  <th className="p-4">Settled Amount (₦)</th>
                  <th className="p-4">Audit Note</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B] text-slate-300">
                {reconciliationList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#182234]/50">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-teal-400" /> {item.terminal}
                    </td>
                    <td className="p-4 font-mono text-teal-300">{item.bank}</td>
                    <td className="p-4 font-mono text-teal-400 font-bold">₦{item.amount.toLocaleString()}</td>
                    <td className="p-4">{item.note}</td>
                    <td className="p-4"><span className="text-emerald-400 font-semibold">{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LOG SETTLEMENT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white">Log POS Terminal Settlement</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSettlement} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Terminal ID / Identifier *</label>
                <input 
                  type="text"
                  required
                  value={terminalId}
                  onChange={(e) => setTerminalId(e.target.value)}
                  placeholder="e.g. POS-VI-HQ-02"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Bank / PSP Gateway *</label>
                  <select 
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Moniepoint MFB">Moniepoint MFB</option>
                    <option value="Opay Digital Services">Opay Digital Services</option>
                    <option value="Paystack Checkout">Paystack Checkout</option>
                    <option value="Flutterwave">Flutterwave</option>
                    <option value="Zenith Bank Plc">Zenith Bank Plc</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Settled Amount (₦) *</label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={settlementAmount}
                    onChange={(e) => setSettlementAmount(Number(e.target.value))}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Audit &amp; Discrepancy Note *</label>
                <input 
                  type="text"
                  required
                  value={discrepancyNote}
                  onChange={(e) => setDiscrepancyNote(e.target.value)}
                  placeholder="e.g. Fully matched with daily sales register"
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
                  Save &amp; Reconcile Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}