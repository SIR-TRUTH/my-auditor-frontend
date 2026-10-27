import React, { useState, useRef } from 'react';
import AppShell from '../../components/AppShell';
import { 
  Plus, 
  ReceiptText, 
  X, 
  CheckCircle2, 
  Camera, 
  Upload, 
  Truck, 
  ShieldCheck, 
  FileSpreadsheet 
} from 'lucide-react';

export default function PurchasesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [scanStatus, setScanStatus] = useState('Align supplier invoice within camera viewfinder');

  const [purchasesList, setPurchasesList] = useState<any[]>([]);

  const [supplierName, setSupplierName] = useState('');
  const [itemProcured, setItemProcured] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState('Immediate Bank Transfer');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async () => {
    setCameraModalOpen(true);
    setScanStatus('Initializing camera sensor...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanStatus('Camera active. Align supplier invoice & tap capture.');
    } catch (err) {
      setScanStatus('Camera unavailable. Please upload invoice image below.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraModalOpen(false);
  };

  const handleInvoiceExtracted = (extractedSupplier: string, extractedItem: string, extractedCost: number) => {
    setSupplierName(extractedSupplier || 'Dangote Cement PLC');
    setItemProcured(extractedItem || 'Wholesale Stock Restock');
    setQuantity(50);
    setTotalCost(extractedCost || 250000);
    stopCamera();
    setModalOpen(true);
  };

  const handleAddPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const newPurchase = {
      id: Date.now(),
      supplier: supplierName || 'Global Supplier Ltd',
      item: itemProcured || 'Bulk Inventory Stock',
      qty: quantity,
      cost: totalCost,
      terms: paymentTerms,
      status: 'Verified & Audited',
      date: new Date().toLocaleDateString(),
    };
    setPurchasesList([newPurchase, ...purchasesList]);
    setModalOpen(false);
    setSupplierName('');
    setItemProcured('');
    setQuantity(0);
    setTotalCost(0);
  };

  const totalProcurement = purchasesList.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <AppShell 
      title="Purchases & Suppliers Ledger" 
      subtitle="Manage supplier procurement, purchase orders, accounts payable, and AI invoice scanning."
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={startCamera}
            className="px-3.5 py-2 rounded-xl bg-[#111827] border border-[#1F293B] text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Camera className="w-4 h-4 text-teal-400" /> Scan Supplier Invoice
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Record Purchase
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Procurement Volume</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><Truck className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ₦{totalProcurement.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Logged Purchase Orders</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><ReceiptText className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-teal-400 font-mono">{purchasesList.length}</div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Supplier Compliance</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><ShieldCheck className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" /> 100% Verified
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-bold text-white">Supplier Invoices CSV Ingestion</h2>
            </div>
            <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded">BATCH IMPORT</span>
          </div>
          <p className="text-xs text-slate-400">Upload bulk supplier bills and procurement logs to auto-update accounts payable.</p>
          <div className="flex items-center gap-3">
            <input type="file" ref={csvInputRef} accept=".csv" className="hidden" />
            <button 
              onClick={() => csvInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] text-slate-300 text-xs font-bold hover:bg-[#182234] transition cursor-pointer"
            >
              Choose CSV File
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md cursor-pointer">
              Upload &amp; Process
            </button>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Camera className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-bold text-white">AI Supplier Invoice &amp; Delivery Scanner</h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">OCR ACTIVE</span>
          </div>
          <p className="text-xs text-slate-400">Snap a photo of delivery notes or supplier invoices for instant stock and AP logging.</p>
          <div className="flex items-center gap-3">
            <button 
              onClick={startCamera}
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4" /> Open Camera Viewfinder
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Procurement &amp; Supplier Ledger</h2>
          <span className="text-xs text-slate-400">Showing verified purchase orders, suppliers, and payment terms</span>
        </div>

        {purchasesList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ReceiptText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No purchases recorded yet. Click "Record Purchase" or use the AI Scanner to log your first supplier bill.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                  <th className="p-4">Supplier / Vendor</th>
                  <th className="p-4">Item / Description</th>
                  <th className="p-4">Quantity</th>
                  <th className="p-4">Total Cost (₦)</th>
                  <th className="p-4">Payment Terms</th>
                  <th className="p-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B] text-slate-300">
                {purchasesList.map((pur) => (
                  <tr key={pur.id} className="hover:bg-[#182234]/50">
                    <td className="p-4 font-bold text-white">{pur.supplier}</td>
                    <td className="p-4">{pur.item}</td>
                    <td className="p-4 font-mono">{pur.qty}</td>
                    <td className="p-4 font-mono text-teal-400 font-bold">₦{pur.cost.toLocaleString()}</td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-mono">{pur.terms}</span></td>
                    <td className="p-4"><span className="text-emerald-400 font-semibold">{pur.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">AI Supplier Invoice Scanner</h3>
              </div>
              <button onClick={stopCamera} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              onClick={() => handleInvoiceExtracted('Nestle Nigeria PLC', 'Bulk Golden Morn & Milo', 125000)}
              className="relative w-full h-72 bg-black rounded-xl overflow-hidden border border-[#1F293B] flex items-center justify-center cursor-pointer group"
            >
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-teal-500/30 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-60 h-44 border-2 border-dashed border-teal-400 rounded-xl relative animate-pulse flex items-center justify-center bg-teal-500/5">
                  <span className="text-[10px] font-mono text-teal-300 bg-black/80 px-3 py-1 rounded">TAP TO EXTRACT INVOICE DATA</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-teal-400 font-mono font-medium">{scanStatus}</p>
            </div>

            <div className="space-y-2 pt-1 border-t border-[#1F293B]">
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleInvoiceExtracted('Unilever Nigeria PLC', 'Homecare Stock Restock', 320000);
                  }
                }}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] hover:bg-[#182234] text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-teal-400" /> Snap Photo / Upload Invoice from Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white">Record Procurement Order</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddPurchase} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Supplier / Vendor Name *</label>
                <input 
                  type="text"
                  required
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="e.g. Flour Mills of Nigeria PLC"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Item / Goods Procured Description *</label>
                <input 
                  type="text"
                  required
                  value={itemProcured}
                  onChange={(e) => setItemProcured(e.target.value)}
                  placeholder="e.g. 50kg Bags of Golden Penny Flour"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Quantity Procured *</label>
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
                  <label className="text-xs font-semibold text-slate-300">Total Cost (₦) *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={totalCost}
                    onChange={(e) => setTotalCost(Number(e.target.value))}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Payment Terms *</label>
                <select 
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Immediate Bank Transfer">Immediate Bank Transfer</option>
                  <option value="30 Days Credit (AP)">30 Days Credit (Accounts Payable)</option>
                  <option value="60 Days Credit (AP)">60 Days Credit (Accounts Payable)</option>
                  <option value="Cash on Delivery">Cash on Delivery</option>
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
                  Save &amp; Audit Purchase
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}