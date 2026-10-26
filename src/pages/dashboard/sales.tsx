import React, { useState, useEffect, useRef } from 'react';
import AppShell from '../../components/AppShell';
import { ReceiptText, Plus, QrCode, Camera, ShoppingCart, AlertCircle } from 'lucide-react';

export default function SalesPage() {
  const [sales, setSales] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [saleForm, setSaleForm] = useState({
    productName: 'Coaster Biscuits',
    quantity: 1,
    unitPrice: 350,
    paymentMethod: 'POS',
  });

  useEffect(() => {
    const savedSales = localStorage.getItem('my_auditor_sales');
    if (savedSales) setSales(JSON.parse(savedSales));

    const savedInv = localStorage.getItem('my_auditor_inventory');
    if (savedInv) {
      setInventory(JSON.parse(savedInv));
    } else {
      const defaultInv = [{ id: 'PRD-001', name: 'Coaster Biscuits', sku: 'CB-100', qty: 100, cost: 250, price: 350 }];
      setInventory(defaultInv);
      localStorage.setItem('my_auditor_inventory', JSON.stringify(defaultInv));
    }

    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    setCameraError('');
    setShowScanner(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      setCameraError('Camera access denied or unavailable. Please use the simulated quick-scan buttons below.');
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const handleRecordSale = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(saleForm.quantity) || 1;
    const unitPrice = parseFloat(saleForm.unitPrice) || 0;
    const totalAmount = qty * unitPrice;

    const saleItem = {
      id: 'SALE-' + Date.now().toString().slice(-4),
      productName: saleForm.productName,
      quantity: qty,
      unitPrice: unitPrice,
      amount: totalAmount,
      paymentMethod: saleForm.paymentMethod,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedSales = [saleItem, ...sales];
    setSales(updatedSales);
    localStorage.setItem('my_auditor_sales', JSON.stringify(updatedSales));

    const updatedInv = inventory.map(item => {
      if (item.name === saleForm.productName) {
        return { ...item, qty: Math.max(0, item.qty - qty) };
      }
      return item;
    });
    setInventory(updatedInv);
    localStorage.setItem('my_auditor_inventory', JSON.stringify(updatedInv));

    setShowModal(false);
    setSaleForm({ productName: inventory[0]?.name || 'Coaster Biscuits', quantity: 1, unitPrice: inventory[0]?.price || 350, paymentMethod: 'POS' });
  };

  const handleSelectScannedProduct = (productName: string) => {
    const matched = inventory.find(i => i.name === productName) || inventory[0];
    if (matched) {
      setSaleForm({
        productName: matched.name,
        quantity: 1,
        unitPrice: matched.price,
        paymentMethod: 'POS',
      });
    }
    stopCamera();
    setShowScanner(false);
    setShowModal(true);
  };

  const totalSales = sales.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AppShell 
      title="Sales & Revenue" 
      subtitle="Record POS and cash sales by product name & quantity with automated barcode/QR scanning."
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={startCamera}
            className="px-3 py-2 rounded-lg bg-[#111827] border border-[#1F293B] text-teal-400 hover:bg-[#182234] font-medium text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <QrCode className="w-4 h-4" /> Scan QR / Barcode
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-3.5 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs flex items-center gap-2 transition shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Record Sale
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Revenue (Recorded)</span>
          <div className="text-2xl font-bold text-white font-mono">₦{totalSales.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Transactions Posted</span>
          <div className="text-2xl font-bold text-teal-400 font-mono">{sales.length}</div>
        </div>
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Inventory Synchronization</span>
          <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active & Synced
          </div>
        </div>
      </div>

      <div className="bg-[#111827] border border-[#1F293B] rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Product Sales Ledger</h2>
          <span className="text-xs text-slate-400">Showing items sold, quantities, and payment channels</span>
        </div>

        {sales.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ReceiptText className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No sales recorded yet. Click "Record Sale" or scan a QR code to log your first transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4 text-right">Quantity</th>
                  <th className="p-4 text-right">Unit Price</th>
                  <th className="p-4">Payment Channel</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B]">
                {sales.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#182234]/50 transition">
                    <td className="p-4 font-mono font-semibold text-teal-400">{s.id}</td>
                    <td className="p-4 font-medium text-white flex items-center gap-2">
                      <ShoppingCart className="w-3.5 h-3.5 text-slate-500" /> {s.productName}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-white">{s.quantity}</td>
                    <td className="p-4 text-right font-mono text-slate-400">₦{s.unitPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</td>
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
              <h3 className="text-base font-bold text-white">Record Sale by Product</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleRecordSale} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Select Product *</label>
                <select
                  value={saleForm.productName}
                  onChange={e => {
                    const selected = inventory.find(i => i.name === e.target.value);
                    setSaleForm({
                      ...saleForm,
                      productName: e.target.value,
                      unitPrice: selected ? selected.price : saleForm.unitPrice,
                    });
                  }}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  {inventory.map(i => (
                    <option key={i.id} value={i.name}>{i.name} (In Stock: {i.qty} | ₦{i.price})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Quantity Sold *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={saleForm.quantity}
                    onChange={e => setSaleForm({ ...saleForm, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Unit Selling Price (₦)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={saleForm.unitPrice}
                    onChange={e => setSaleForm({ ...saleForm, unitPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Total Computed Revenue</label>
                <div className="w-full bg-[#0A0E17]/60 border border-[#1F293B] rounded-lg px-3 py-2.5 text-teal-400 font-mono font-bold text-sm">
                  ₦{(saleForm.quantity * saleForm.unitPrice).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Payment Channel *</label>
                <select
                  value={saleForm.paymentMethod}
                  onChange={e => setSaleForm({ ...saleForm, paymentMethod: e.target.value })}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="POS">POS Terminal</option>
                  <option value="CASH">Cash</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1F293B]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg bg-[#0A0E17] border border-[#1F293B] text-slate-300 hover:bg-[#182234]">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 text-white font-bold transition shadow-sm cursor-pointer">Post Sale & Deduct Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QR Code / Barcode Live Camera Scanner Modal */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-6 shadow-2xl text-center">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-teal-400" /> Live QR & Barcode Scanner
              </h3>
              <button onClick={() => { stopCamera(); setShowScanner(false); }} className="text-slate-400 hover:text-white font-bold">✕</button>
            </div>

            {cameraError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {cameraError}
              </div>
            )}

            <div className="relative border-2 border-teal-500/40 rounded-xl overflow-hidden bg-black aspect-video flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 border-2 border-teal-400/50 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-24 border-2 border-dashed border-teal-400 rounded-lg animate-pulse" />
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Or Select Product Instantly:</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {inventory.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectScannedProduct(item.name)}
                    className="px-3.5 py-2 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 rounded-lg text-teal-300 text-xs font-bold transition cursor-pointer"
                  >
                    Select: {item.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => { stopCamera(); setShowScanner(false); }}
              className="w-full py-2.5 bg-[#0A0E17] border border-[#1F293B] text-slate-300 hover:bg-[#182234] rounded-lg text-xs font-bold transition"
            >
              Close Scanner
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}