import React, { useState, useEffect } from 'react';
import AppShell from '../../components/AppShell';
import { Boxes, Plus, AlertTriangle } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', sku: '', qty: '', cost: '', price: '' });

  useEffect(() => {
    const saved = localStorage.getItem('my_auditor_inventory');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      // Default initial test item
      const initial = [{ id: 'PRD-001', name: 'Coaster Biscuits', sku: 'CB-100', qty: 100, cost: 250, price: 350 }];
      setProducts(initial);
      localStorage.setItem('my_auditor_inventory', JSON.stringify(initial));
    }
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const item = {
      id: 'PRD-' + Date.now().toString().slice(-4),
      name: newProduct.name,
      sku: newProduct.sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
      qty: parseInt(newProduct.qty) || 0,
      cost: parseFloat(newProduct.cost) || 0,
      price: parseFloat(newProduct.price) || 0,
    };
    const updated = [item, ...products];
    setProducts(updated);
    localStorage.setItem('my_auditor_inventory', JSON.stringify(updated));
    setNewProduct({ name: '', sku: '', qty: '', cost: '', price: '' });
    setShowModal(false);
  };

  const totalValuation = products.reduce((acc, curr) => acc + (curr.qty * curr.cost), 0);

  return (
    <AppShell 
      title="Inventory & Weighted Average Cost (WAC)" 
      subtitle="Track stock quantities, SKU valuations, and automatic WAC cost calculations."
      actions={
        <button 
          onClick={() => setShowModal(true)}
          className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-2 transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Inventory Valuation</span>
          <div className="text-2xl font-bold text-white font-mono">₦{totalValuation.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Active SKUs</span>
          <div className="text-2xl font-bold text-teal-400 font-mono">{products.length}</div>
        </div>
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Low Stock Alerts</span>
          <div className="text-2xl font-bold text-slate-300 font-mono">0</div>
        </div>
      </div>

      <div className="bg-[#111827] border border-[#1F293B] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Product Catalog & WAC Valuation</h2>
          <span className="text-xs text-slate-400">Inventory valuation is maintained per WAC standards</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4">SKU / Item</th>
                <th className="p-4">Product Name</th>
                <th className="p-4 text-right">In Stock</th>
                <th className="p-4 text-right">Cost Price (WAC)</th>
                <th className="p-4 text-right">Selling Price</th>
                <th className="p-4 text-right">Total Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F293B]">
              {products.map((p, idx) => (
                <tr key={idx} className="hover:bg-[#182234]/50 transition">
                  <td className="p-4 font-mono font-semibold text-teal-400">{p.sku}</td>
                  <td className="p-4 font-medium text-white">{p.name}</td>
                  <td className="p-4 text-right font-mono">{p.qty}</td>
                  <td className="p-4 text-right font-mono">₦{p.cost.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-right font-mono text-teal-300">₦{p.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                  <td className="p-4 text-right font-mono font-bold text-white">₦{(p.qty * p.cost).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white">Add New Product</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Product Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Premium Basmati Rice"
                  value={newProduct.name}
                  onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">SKU Code</label>
                  <input
                    type="text"
                    placeholder="e.g. RICE-01"
                    value={newProduct.sku}
                    onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Opening Qty *</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    value={newProduct.qty}
                    onChange={e => setNewProduct({ ...newProduct, qty: e.target.value })}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Cost Price (₦) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="0.00"
                    value={newProduct.cost}
                    onChange={e => setNewProduct({ ...newProduct, cost: e.target.value })}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Selling Price (₦) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    placeholder="0.00"
                    value={newProduct.price}
                    onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F293B]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-[#0A0E17] border border-[#1F293B] text-slate-300 hover:bg-[#182234]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-sm cursor-pointer">Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}