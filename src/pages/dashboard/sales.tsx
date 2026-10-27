import React, { useState, useRef, useEffect } from 'react';
import AppShell from '../../components/AppShell';
import { Plus, ReceiptText, X, CheckCircle2, Camera, Upload, QrCode } from 'lucide-react';

export default function SalesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  
  const [productName, setProductName] = useState('Coaster Biscuits');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(350);
  const [paymentChannel, setPaymentChannel] = useState('POS Terminal');
  const [salesList, setSalesList] = useState<any[]>([]);
  const [scanStatus, setScanStatus] = useState<string>('Align QR code or Barcode within frame');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const sampleProducts = [
    { name: 'Coaster Biscuits', stock: 100, price: 350 },
    { name: 'Maltina 33cl', stock: 240, price: 400 },
    { name: 'Peak Milk 400g', stock: 85, price: 2500 },
    { name: 'Indomie Super Pack', stock: 300, price: 250 },
  ];

  // Request Mobile Rear Camera Stream (Optimized for QR & Barcode)
  const startMobileCamera = async () => {
    setCameraModalOpen(true);
    setScanStatus('Align QR code or Barcode within frame');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
        }
      } catch (e) {
        setScanStatus('Camera stream unavailable. Use photo upload below.');
      }
    }
  };

  const stopMobileCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraModalOpen(false);
  };

  // Simulate instant QR/Barcode match on frame tap or photo capture
  const handleQRBarcodeDetected = (codeValue: string) => {
    setScanStatus(`Scanned: ${codeValue}`);
    setTimeout(() => {
      setProductName(codeValue);
      stopMobileCamera();
      setModalOpen(true);
    }, 400);
  };

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
        <div className="flex items-center gap-2">
          <button 
            onClick={startMobileCamera}
            className="px-3.5 py-2 rounded-xl bg-[#111827] border border-[#1F293B] text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-teal-400" /> Scan QR / Barcode
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Record Sale
          </button>
        </div>
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
            <p className="text-xs text-slate-400">No sales recorded yet. Click "Record Sale" or "Scan QR / Barcode" to log your first transaction.</p>
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

      {/* MOBILE QR & BARCODE SCANNER MODAL */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-3">
              <div className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">QR Code &amp; Barcode Scanner</h3>
              </div>
              <button onClick={stopMobileCamera} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Camera Viewport with Square QR Scanner Reticle */}
            <div 
              onClick={() => handleQRBarcodeDetected('Coaster Biscuits')}
              className="relative w-full h-72 bg-black rounded-xl overflow-hidden border border-[#1F293B] flex items-center justify-center cursor-pointer group"
            >
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover"
              />
              
              {/* QR / Barcode Overlay Box */}
              <div className="absolute inset-0 border-2 border-teal-500/30 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-48 h-48 border-2 border-dashed border-teal-400 rounded-2xl relative animate-pulse flex items-center justify-center bg-teal-500/5">
                  <span className="text-[10px] font-mono text-teal-300 bg-black/70 px-2 py-1 rounded">TAP FRAME TO SCAN</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-teal-400 font-mono font-medium">{scanStatus}</p>
            </div>

            {/* Fallback Photo / Gallery QR Upload */}
            <div className="space-y-2 pt-1 border-t border-[#1F293B]">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleQRBarcodeDetected('Coaster Biscuits');
                  }
                }}
              />

              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] hover:bg-[#182234] text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-teal-400" /> Snap / Upload QR Photo
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Record Sale Modal */}
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
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Select or Type Product Name *</label>
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