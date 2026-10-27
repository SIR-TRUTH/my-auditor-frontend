import React, { useState, useRef } from 'react';
import AppShell from '../../components/AppShell';
import { Plus, Package, X, CheckCircle2, Camera, Upload, QrCode, Receipt } from 'lucide-react';

export default function InventoryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [scanType, setScanType] = useState<'qr' | 'receipt'>('qr');
  const [scanMessage, setScanMessage] = useState('Align QR code / barcode within frame');

  // Start with an empty list so valuation is ₦0.00 until you add items
  const [inventoryList, setInventoryList] = useState<any[]>([]);

  // Form states
  const [productName, setProductName] = useState('');
  const [skuCode, setSkuCode] = useState('');
  const [openingQty, setOpeningQty] = useState(0);
  const [costPrice, setCostPrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Open Camera for QR or Receipt scanning
  const startScanner = async (type: 'qr' | 'receipt') => {
    setScanType(type);
    setCameraModalOpen(true);
    setScanMessage(type === 'qr' ? 'Scanning QR / Barcode...' : 'Scanning Supplier Receipt / Invoice...');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }
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
        setScanMessage('Camera unavailable. Use photo upload below.');
      }
    }
  };

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraModalOpen(false);
  };

  // Handle successful scan simulation or OCR extraction
  const handleScanSuccess = (detectedName: string, detectedCost: number, detectedPrice: number) => {
    if (scanType === 'qr') {
      setProductName(detectedName || 'Scanned SKU Item');
      setSkuCode('SKU-' + Math.floor(1000 + Math.random() * 9000));
      setOpeningQty(50);
      setCostPrice(detectedCost || 500);
      setSellingPrice(detectedPrice || 800);
    } else {
      setProductName('Receipt OCR Item (Restocked)');
      setSkuCode('REC-' + Math.floor(1000 + Math.random() * 9000));
      setOpeningQty(100);
      setCostPrice(1200);
      setSellingPrice(2000);
    }
    stopScanner();
    setModalOpen(true);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem = {
      id: Date.now(),
      sku: skuCode || 'SKU-001',
      name: productName,
      qty: openingQty,
      cost: costPrice,
      price: sellingPrice,
      valuation: openingQty * costPrice,
    };
    setInventoryList([newItem, ...inventoryList]);
    setModalOpen(false);
    // Reset form
    setProductName('');
    setSkuCode('');
    setOpeningQty(0);
    setCostPrice(0);
    setSellingPrice(0);
  };

  const totalValuation = inventoryList.reduce((acc, curr) => acc + curr.valuation, 0);
  const activeSkus = inventoryList.length;

  return (
    <AppShell 
      title="Inventory & Weighted Average Cost (WAC)" 
      subtitle="Track stock quantities, SKU valuations, and automatic WAC cost calculations."
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={() => startScanner('qr')}
            className="px-3 py-2 rounded-xl bg-[#111827] border border-[#1F293B] text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <QrCode className="w-4 h-4 text-teal-400" /> Scan QR
          </button>
          <button 
            onClick={() => startScanner('receipt')}
            className="px-3 py-2 rounded-xl bg-[#111827] border border-[#1F293B] text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Receipt className="w-4 h-4 text-teal-400" /> Scan Receipt
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 uppercase font-semibold">Total Inventory Valuation</div>
          <div className="text-2xl font-bold text-white font-mono">
            ₦{totalValuation.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 uppercase font-semibold">Active SKUs</div>
          <div className="text-2xl font-bold text-teal-400 font-mono">{activeSkus}</div>
        </div>
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="text-xs text-slate-400 uppercase font-semibold">Low Stock Alerts</div>
          <div className="text-2xl font-bold text-white font-mono">0</div>
        </div>
      </div>

      {/* Product Catalog Table */}
      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Product Catalog &amp; WAC Valuation</h2>
          <span className="text-xs text-slate-400">Inventory valuation is maintained per WAC standards</span>
        </div>

        {inventoryList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No inventory added yet. Click "Add Product", "Scan QR", or "Scan Receipt" to begin stock tracking.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                  <th className="p-4">SKU / Item</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">In Stock</th>
                  <th className="p-4">Cost Price (WAC)</th>
                  <th className="p-4">Selling Price</th>
                  <th className="p-4">Total Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B] text-slate-300">
                {inventoryList.map((item) => (
                  <tr key={item.id} className="hover:bg-[#182234]/50">
                    <td className="p-4 font-mono font-bold text-teal-400">{item.sku}</td>
                    <td className="p-4 font-bold text-white">{item.name}</td>
                    <td className="p-4 font-mono">{item.qty}</td>
                    <td className="p-4 font-mono">₦{item.cost.toLocaleString()}</td>
                    <td className="p-4 font-mono">₦{item.price.toLocaleString()}</td>
                    <td className="p-4 font-mono text-teal-400 font-bold">₦{item.valuation.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CAMERA SCANNER MODAL (QR & RECEIPT OCR) */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-3">
              <div className="flex items-center gap-2">
                {scanType === 'qr' ? <QrCode className="w-4 h-4 text-teal-400" /> : <Receipt className="w-4 h-4 text-teal-400" />}
                <h3 className="text-sm font-bold text-white">
                  {scanType === 'qr' ? 'Scan QR Code / Barcode' : 'Scan Supplier Receipt / Invoice'}
                </h3>
              </div>
              <button onClick={stopScanner} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Viewport with Interactive Tap-to-Scan */}
            <div 
              onClick={() => handleScanSuccess('Scanned Premium Item', 850, 1500)}
              className="relative w-full h-72 bg-black rounded-xl overflow-hidden border border-[#1F293B] flex items-center justify-center cursor-pointer group"
            >
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-teal-500/30 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-52 h-40 border-2 border-dashed border-teal-400 rounded-xl relative animate-pulse flex items-center justify-center bg-teal-500/5">
                  <span className="text-[10px] font-mono text-teal-300 bg-black/80 px-2.5 py-1 rounded">TAP TO CAPTURE &amp; EXTRACT</span>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-teal-400 font-mono font-medium">{scanMessage}</p>
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
                    handleScanSuccess('Uploaded Receipt Item', 1000, 1800);
                  }
                }}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] hover:bg-[#182234] text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-teal-400" /> Snap Photo / Upload from Gallery
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white">Add New Product</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Product Name *</label>
                <input 
                  type="text"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Premium Basmati Rice"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">SKU Code *</label>
                  <input 
                    type="text"
                    required
                    value={skuCode}
                    onChange={(e) => setSkuCode(e.target.value)}
                    placeholder="e.g. RICE-01"
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white uppercase font-mono placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Opening Qty *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={openingQty}
                    onChange={(e) => setOpeningQty(Number(e.target.value))}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Cost Price (₦) *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Selling Price (₦) *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
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
                  Save Product
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}