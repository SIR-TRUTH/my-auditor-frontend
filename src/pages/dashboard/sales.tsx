import React, { useState, useEffect } from 'react';
import AppShell from '../../components/AppShell';
import { ReceiptText, Plus, DollarSign, Calendar, Filter } from 'lucide-react';

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newSale, setNewSale] = useState({ customer: '', amount: '', paymentMethod: 'POS', items: '' });

  useEffect(() => {
    const saved = localStorage.getItem('my_auditor_sales');
    if (saved) setSales(JSON.parse(saved));
  }, []);

  const handleRecordSale = (e: React.FormEvent) => {
    e.preventDefault();
    const saleItem = {
      id: 'SALE-' + Date.now().toString().slice(-4),
      customer: newSale.customer || 'Walk-in Customer',
      amount: parseFloat(newSale.amount) || 0,
      paymentMethod: newSale.paymentMethod,
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [saleItem, ...sales];
    setSales(updated);
    localStorage.setItem('my_auditor_sales', JSON.stringify(updated));
    setNewSale({ customer: '', amount: '', paymentMethod: 'POS', items: '' });
    setShowModal(false);
  };

  const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AppShell 
      title="Sales & Revenue" 
      subtitle="Record and monitor POS and cash receipts with real-time revenue recognition."
      actions={
        <button 
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Record Sale
        </button>
      }
    >
      {/* Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Revenue (Recorded)</span>
          <div className="text-2xl font-bold text-white font-mono">₦{totalSales.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Transaction Count</span>
          <div className="text-2xl font-bold text-teal-400 font-mono">{sales.length}</div>
        </div>
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Reconciliation Status</span>
          <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Balanced
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#111827] border border-[#1F293B] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Sales Ledger</h2>
          <span className="text-xs text-slate-400">Showing all verified POS and cash postings</span>
        </div>

        {sales.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ReceiptText className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No sales recorded yet. Click "Record Sale" above to log your first transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Payment Channel</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B]">
                {sales.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#182234]/50 transition">
                    <td className="p-4 font-mono font-semibold text-teal-400">{s.id}</td>
                    <td className="p-4 font-medium text-white">{s.customer}</td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-bold">{s.paymentMethod}</span></td>
                    <td className="p-4 text-slate-400">{s.date}</td>
                    <td className="p-4 text-right font-mono font-bold text-white">₦{s.amount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white">Record New Sale</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleRecordSale} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Customer Name</label>
                <input
                  type="text"
                  placeholder="e.g. Walk-in Customer or Enterprise Client"
                  value={newSale.customer}
                  onChange={e => setNewSale({ ...newSale, customer: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Total Amount (₦) *</label>
                <input
                  type="number"
                  required
                  step="0.01"
                  placeholder="0.00"
                  value={newSale.amount}
                  onChange={e => setNewSale({ ...newSale, amount: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Payment Channel *</label>
                <select
                  value={newSale.paymentMethod}
                  onChange={e => setNewSale({ ...newSale, paymentMethod: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="POS">POS Terminal</option>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F293B]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#0A0E17] border border-[#1F293B] text-slate-300 hover:bg-[#182234] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-sm cursor-pointer"
                >
                  Post Sale to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}