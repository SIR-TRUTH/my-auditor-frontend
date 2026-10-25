import React, { useState } from 'react';
import { ShoppingBag, Plus, Search, Filter, CheckCircle2, DollarSign, ArrowUpRight } from 'lucide-react';
import { globalAccountingEngine } from '../lib/accountingEngine';
import { formatKoboToNaira, nairaToKobo } from '../lib/currency';
import { executePosSale } from '../lib/verticalSlice';
import { UserContext, enforcePermission } from '../lib/rbacEngine';

interface SalesModuleProps {
  currentUser: UserContext;
  currencyKey: string;
  onTransactionRecorded: () => void;
}

export default function SalesModule({ currentUser, currencyKey, onTransactionRecorded }: SalesModuleProps) {
  const [showNewSaleModal, setShowNewSaleModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [unitPriceNaira, setUnitPriceNaira] = useState(35000);
  const [paymentMethod, setPaymentMethod] = useState<'POS' | 'CASH' | 'TRANSFER'>('POS');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [notice, setNotice] = useState('');

  const formatMoney = (koboVal: bigint) => formatKoboToNaira(koboVal, currencyKey === 'USD' ? '$' : '₦');

  // Retrieve actual ledger transactions for sales
  const allJournals = globalAccountingEngine.getJournalEntries();
  const salesJournals = allJournals.filter(j => j.description.includes('POS Sale') || j.description.includes('Sale'));

  const handleCreateSale = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      enforcePermission(currentUser, 'POST_TRANSACTION');
      executePosSale({
        businessId: currentUser.businessId,
        branchId: currentUser.branchId,
        productId: 'prod-1',
        quantity: Number(quantity),
        unitPriceNaira: Number(unitPriceNaira),
      });
      onTransactionRecorded();
      setShowNewSaleModal(false);
      setNotice('Sale successfully executed and posted to double-entry ledger.');
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

      {/* Header & Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" /> Sales & Revenue Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time POS, cash, and transfer transactions backed by strict double-entry accounting.
          </p>
        </div>
        <button
          onClick={() => setShowNewSaleModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" /> Record New Sale
        </button>
      </div>

      {/* Sales Transactions Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Transaction History</span>
          <span className="text-xs text-slate-400 font-mono">{salesJournals.length} entries recorded</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Reference ID</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Description</th>
                <th className="p-4">Branch</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {salesJournals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No sales transactions recorded yet for this branch. (Showing ₦0.00 as required by zero-state rules).
                  </td>
                </tr>
              ) : (
                salesJournals.map((j) => {
                  const revenueLine = j.lines.find(l => l.type === 'CREDIT');
                  return (
                    <tr key={j.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-mono text-emerald-400 font-bold">{j.id}</td>
                      <td className="p-4 text-slate-400">{new Date(j.timestamp).toLocaleString()}</td>
                      <td className="p-4 font-medium text-white">{j.description}</td>
                      <td className="p-4 text-slate-400">{j.branchId}</td>
                      <td className="p-4 text-right font-bold text-emerald-400">
                        {revenueLine ? formatMoney(revenueLine.amountKobo) : '₦0.00'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Sale Modal */}
      {showNewSaleModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-emerald-400" /> Record New Sales Transaction
              </h3>
              <button onClick={() => setShowNewSaleModal(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateSale} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Customer / Entity</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit Price ({currencyKey === 'USD' ? '$' : '₦'})</label>
                  <input
                    type="number"
                    value={unitPriceNaira}
                    onChange={e => setUnitPriceNaira(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Payment Channel</label>
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="POS">POS Clearing / Terminal</option>
                  <option value="CASH">Cash Drawer</option>
                  <option value="TRANSFER">Bank Transfer</option>
                </select>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-lg"
                >
                  Confirm & Post to Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}