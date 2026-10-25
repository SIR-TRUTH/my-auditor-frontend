import React, { useState } from 'react';
import { Truck, Plus, CheckCircle2, FileText, Building2 } from 'lucide-react';
import { formatKoboToNaira, nairaToKobo } from '../lib/currency';
import { globalInventoryEngine } from '../lib/inventoryEngine';
import { UserContext, enforcePermission } from '../lib/rbacEngine';

interface PurchasesModuleProps {
  currentUser: UserContext;
  currencyKey: string;
  onPurchaseRecorded: () => void;
}

export default function PurchasesModule({ currentUser, currencyKey, onPurchaseRecorded }: PurchasesModuleProps) {
  const [showModal, setShowModal] = useState(false);
  const [supplierName, setSupplierName] = useState('Dangote Industries Plc');
  const [itemName, setItemName] = useState('Coaster Biscuits (Cartons)');
  const [quantity, setQuantity] = useState(100);
  const [unitCostNaira, setUnitCostNaira] = useState(250);
  const [notice, setNotice] = useState('');

  const formatMoney = (koboVal: bigint) => formatKoboToNaira(koboVal, currencyKey === 'USD' ? '$' : '₦');

  const [purchasesList, setPurchasesList] = useState<any[]>([
    {
      id: 'PO-2026-001',
      supplier: 'Dangote Industries Plc',
      item: 'Coaster Biscuits',
      qty: 100,
      totalKobo: nairaToKobo(25000),
      status: 'DELIVERED & WAC RESTOCKED',
      date: new Date().toLocaleDateString()
    }
  ]);

  const handleRecordPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      enforcePermission(currentUser, 'POST_TRANSACTION');
      const totalKobo = nairaToKobo(quantity * unitCostNaira);
      
      // Update WAC inventory engine
      globalInventoryEngine.registerProduct('prod-1', itemName, quantity, nairaToKobo(unitCostNaira));

      setPurchasesList(prev => [
        {
          id: `PO-${Date.now().toString().slice(-4)}`,
          supplier: supplierName,
          item: itemName,
          qty: quantity,
          totalKobo: totalKobo,
          status: 'DELIVERED & WAC RESTOCKED',
          date: new Date().toLocaleDateString()
        },
        ...prev
      ]);

      onPurchaseRecorded();
      setShowModal(false);
      setNotice('Purchase order recorded, accounts payable updated, and inventory WAC recalculated.');
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
            <Truck className="w-5 h-5 text-cyan-400" /> Purchases & Suppliers Module
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage supplier purchase orders, vendor invoices, and automatic WAC inventory replenishment.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
        >
          <Plus className="w-4 h-4" /> Record Purchase Order
        </button>
      </div>

      {/* Purchases Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Purchase Orders & Supplier Invoices</span>
          <span className="text-xs text-slate-400 font-mono">{purchasesList.length} orders logged</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">PO Number</th>
                <th className="p-4">Supplier Name</th>
                <th className="p-4">Item Description</th>
                <th className="p-4">Quantity</th>
                <th className="p-4 text-right">Total Cost</th>
                <th className="p-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {purchasesList.map((po, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono text-cyan-400 font-bold">{po.id}</td>
                  <td className="p-4 font-bold text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" /> {po.supplier}
                  </td>
                  <td className="p-4 text-slate-300">{po.item}</td>
                  <td className="p-4 text-slate-300">{po.qty} units</td>
                  <td className="p-4 text-right font-bold text-emerald-400">{formatMoney(po.totalKobo)}</td>
                  <td className="p-4 text-center">
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-bold">
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Purchase Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" /> Record Supplier Purchase Order
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleRecordPurchase} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Supplier / Vendor Name</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={e => setSupplierName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Item Description</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Quantity Purchased</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={e => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit Cost ({currencyKey === 'USD' ? '$' : '₦'})</label>
                  <input
                    type="number"
                    value={unitCostNaira}
                    onChange={e => setUnitCostNaira(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-lg"
                >
                  Post Purchase & Update WAC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}