import React, { useState } from 'react';
import { Layers, Plus, Package, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { globalInventoryEngine } from '../lib/inventoryEngine';
import { globalAuditEngine } from '../lib/auditEngine';
import { formatKoboToNaira, nairaToKobo } from '../lib/currency';
import { reportStockDiscrepancy } from '../lib/verticalSlice';
import { UserContext, enforcePermission } from '../lib/rbacEngine';

interface InventoryModuleProps {
  currentUser: UserContext;
  currencyKey: string;
  onInventoryUpdated: () => void;
}

export default function InventoryModule({ currentUser, currencyKey, onInventoryUpdated }: InventoryModuleProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);

  const [productName, setProductName] = useState('');
  const [initialQty, setInitialQty] = useState(50);
  const [costPriceNaira, setCostPriceNaira] = useState(20000);

  const [discrepancyQty, setDiscrepancyQty] = useState(2);
  const [notice, setNotice] = useState('');

  const formatMoney = (koboVal: bigint) => formatKoboToNaira(koboVal, currencyKey === 'USD' ? '$' : '₦');

  // Retrieve product state from inventory engine
  const primaryProductState = globalInventoryEngine.getProductState('prod-1');
  const products = primaryProductState ? [primaryProductState] : [];

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      enforcePermission(currentUser, 'POST_TRANSACTION');
      if (!productName.trim()) return;
      const prodId = `prod-${Date.now()}`;
      globalInventoryEngine.registerProduct(prodId, productName, Number(initialQty), nairaToKobo(Number(costPriceNaira)));
      onInventoryUpdated();
      setShowAddModal(false);
      setProductName('');
      setNotice('New inventory SKU registered with WAC tracking.');
      setTimeout(() => setNotice(''), 4000);
    } catch (err: any) {
      alert(`RBAC Blocked: ${err.message}`);
    }
  };

  const handleReportDiscrepancy = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      enforcePermission(currentUser, 'POST_TRANSACTION');
      if (!primaryProductState) return;
      const expected = primaryProductState.currentStock;
      const actual = Math.max(0, expected - Number(discrepancyQty));

      reportStockDiscrepancy({
        businessId: currentUser.businessId,
        branchId: currentUser.branchId,
        productId: 'prod-1',
        expectedQty: expected,
        actualQty: actual,
      });

      onInventoryUpdated();
      setShowDiscrepancyModal(false);
      setNotice('Stock discrepancy logged to Continuous Audit Centre (Isolated from P&L).');
      setTimeout(() => setNotice(''), 5000);
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

      {/* Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> Inventory & WAC Valuation Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time weighted average costing, stock movements, and shrinkage tracking.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDiscrepancyModal(true)}
            className="px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" /> Report Shrinkage
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" /> Add Inventory SKU
          </button>
        </div>
      </div>

      {/* Inventory Catalog Table */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Product SKUs</span>
          <span className="text-xs text-slate-400 font-mono">Integer minor-unit Kobo math enforced</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">Product Name</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Weighted Average Cost (WAC)</th>
                <th className="p-4 text-right">Total Asset Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No inventory items registered. (Zero-state active).
                  </td>
                </tr>
              ) : (
                products.map((p, idx) => {
                  const assetValueKobo = BigInt(p.currentStock) * p.weightedAverageCostKobo;
                  return (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-bold text-white flex items-center gap-2">
                        <Package className="w-4 h-4 text-emerald-400" /> {p.productName}
                      </td>
                      <td className="p-4 text-emerald-400 font-bold">{p.currentStock} units</td>
                      <td className="p-4 text-slate-300">{formatMoney(p.weightedAverageCostKobo)}</td>
                      <td className="p-4 text-right font-bold text-emerald-400">{formatMoney(assetValueKobo)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add SKU Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-400" /> Register New Inventory SKU
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Product Name / Description</label>
                <input
                  type="text"
                  value={productName}
                  onChange={e => setProductName(e.target.value)}
                  placeholder="e.g. Premium Motor Spirit / Coaster Biscuits"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Initial Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={initialQty}
                    onChange={e => setInitialQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Cost Price ({currencyKey === 'USD' ? '$' : '₦'})</label>
                  <input
                    type="number"
                    value={costPriceNaira}
                    onChange={e => setCostPriceNaira(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-lg"
                >
                  Register & Calculate WAC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Discrepancy / Shrinkage Modal */}
      {showDiscrepancyModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Report Stock Discrepancy
              </h3>
              <button onClick={() => setShowDiscrepancyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleReportDiscrepancy} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Missing / Shrinkage Units</label>
                <input
                  type="number"
                  min="1"
                  value={discrepancyQty}
                  onChange={e => setDiscrepancyQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <p className="text-[11px] text-amber-300">
                ⚠️ Note: This discrepancy will be isolated into the Continuous Audit Centre as potential financial exposure without modifying recognized Net Profit.
              </p>
              <button
                type="submit"
                className="w-full py-3 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-xl cursor-pointer shadow-lg"
              >
                Log Audit Exposure
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}