import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import { Plus, ReceiptText, Search, X, CheckCircle2 } from 'lucide-react';

export default function SalesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [productName, setProductName] = useState('Coaster Biscuits');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(350);
  const [paymentChannel, setPaymentChannel] = useState('POS Terminal');
  const [salesList, setSalesList] = useState<any[]>([]);

  const sampleProducts = [
    { name: 'Coaster Biscuits', stock: 100, price: 350 },
    { name: 'Maltina 33cl', stock: 240, price: 400 },
    { name: 'Peak Milk 400g', stock: 85, price: 2500 },
    { name: 'Indomie Super Pack', stock: 300, price: 250 },
  ];

  const handlePostSale = (e: React.FormEvent) => {
    e.preventDefault();
    const newSale = {
      id: Date.now(),
      product: productName,
      qty: quantity,
      price: unitPrice,
      total: quantity * unitPrice,
      channel: paymentChannel,
      date: new Date().toLocaleDateString(),
    };
    setSalesList([newSale, ...salesList]);
    setModalOpen(false);
  };

  return (
    <AppShell 
      title="Sales & Revenue Ledger" 
      subtitle="Record POS and cash sales with automatic inventory WAC deduction."
      actions={
        <button 
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Record Sale
        </button>
      }
    >
      {/* Sales Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Revenue (Recorded)</div>
          <div className="text-2xl font-bold text-white font-mono">
            ₦{salesList.reduce((acc, curr) => acc + curr.total, 0).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 uppercase font-semibold">Transactions Logged</div>
          <div className="text-2xl font-bold text-teal-400 font-mono">{salesList.length}</div>
        </div>
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 uppercase font-semibold">Inventory Synchronization</div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" /> Active &amp; Synced
          </div>
        </div>
      </div>

      {/* Sales Ledger Table */}
      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Product Sales Ledger</h2>
          <span className="text-xs text-slate-400">Showing items sold, quantities, and payment channels</span>
        </div>

        {salesList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ReceiptText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No sales recorded yet. Click "Record Sale" to log your first transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Qty Sold</th>
                  <th className="p-4">Unit Price (₦)</th>
                  <th className="p-4">Total Revenue</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B] text-slate-300">
                {salesList.map((sale) => (
                  <tr key={sale.id} className="hover:bg-[#182234]/50">
                    <td className="p-4 font-bold text-white">{sale.product}</td>
                    <td className="p-4 font-mono">{sale.qty}</td>
                    <td className="p-4 font-mono">₦{sale.price.toLocaleString()}</td>
                    <td className="p-4 font-mono text-teal-400 font-bold">₦{sale.total.toLocaleString()}</td>
                    <td className="p-4">{sale.channel}</td>
                    <td className="p-4 text-slate-400">{sale.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Sale Modal with Free-Type Product Input */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white">Record Sale by Product</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSale} className="space-y-4">
              
              {/* Product Select / Free-Type Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Select or Type Product Name *</label>
                <div className="relative">
                  <input 
                    type="text"
                    required
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Type product name or select below..."
                    list="product-suggestions"
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                  />
                  <datalist id="product-suggestions">
                    {sampleProducts.map((p, i) => (
                      <option key={i} value={`${p.name} (In Stock: ${p.stock} | ₦${p.price})`} />
                    ))}
                  </datalist>
                </div>
                <p className="text-[10px] text-slate-500">You can select from inventory suggestions or manually type any custom product name.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Quantity Sold *</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Unit Selling Price (₦) *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Total Computed Revenue</label>
                <div className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-sm font-bold text-teal-400 font-mono">
                  ₦{(quantity * unitPrice).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Payment Channel *</label>
                <select 
                  value={paymentChannel}
                  onChange={(e) => setPaymentChannel(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="POS Terminal">POS Terminal</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Credit / AR">Credit / Accounts Receivable</option>
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
                  Post Sale &amp; Deduct Stock
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}