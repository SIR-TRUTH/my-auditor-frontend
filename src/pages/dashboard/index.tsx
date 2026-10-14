import { useState, useRef } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Upload, FileText, AlertCircle, CheckCircle2, 
  DollarSign, Store, Plus, RefreshCw, Inbox, Camera, X, Layers, 
  QrCode, Minus, ChevronDown, ChevronRight, ShoppingCart, Tag, AlertTriangle, Check
} from 'lucide-react';
import { uploadReceipt } from '../../lib/api';

export default function DashboardPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Camera state for receipt scanner
  const [useReceiptCamera, setUseReceiptCamera] = useState(false);
  
  // POS Barcode modal state
  const [showPOSScanner, setShowPOSScanner] = useState(false);
  
  // Add Variety modal state
  const [showAddModal, setShowAddModal] = useState(false);

  // Discrepancy Audit Modal state
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [selectedAuditAlert, setSelectedAuditAlert] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const receiptVideoRef = useRef<HTMLVideoElement>(null);

  type Variety = {
    id: string;
    barcode: string;
    varietyName: string;
    qty: number;
    costPrice: number;
    sellingPrice: number;
  };

  type ProductGroup = {
    id: string;
    groupName: string;
    category: string;
    expanded: boolean;
    varieties: Variety[];
  };

  type Receipt = {
    id: string;
    store: string;
    date: string;
    total: number;
    status: 'Parsed' | 'Discrepancy';
    items: number;
    discrepancyNote?: string;
  };

  // Zero initial state
  const [inventoryGroups, setInventoryGroups] = useState<ProductGroup[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);

  // Form state for adding new variety manually
  const [newVariety, setNewVariety] = useState({
    groupName: 'Biscuits',
    category: 'Snacks',
    varietyName: '',
    barcode: '',
    qty: 10,
    costPrice: '',
    sellingPrice: ''
  });

  // Receipt Camera Controls
  const startReceiptCamera = async () => {
    setUseReceiptCamera(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (receiptVideoRef.current) {
        receiptVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access denied or unavailable', err);
    }
  };

  const stopReceiptCamera = () => {
    if (receiptVideoRef.current && receiptVideoRef.current.srcObject) {
      const stream = receiptVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setUseReceiptCamera(false);
  };

  const captureReceiptPhoto = () => {
    if (!receiptVideoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = receiptVideoRef.current.videoWidth || 640;
    canvas.height = receiptVideoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(receiptVideoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `receipt-capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          setSelectedFile(file);
          stopReceiptCamera();
        }
      }, 'image/jpeg');
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  // Upload handler connecting to backend API with simulated fallback
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('receipt', selectedFile);

      // Attempt actual backend ingestion endpoint call
      await uploadReceipt(formData).catch(() => {
        console.log('Backend endpoint not reachable yet, using client simulation...');
      });

      const receiptId = `REC-${Math.floor(1000 + Math.random() * 9000)}`;

      // Randomly simulate a discrepancy on 1 in every 3 receipts to demonstrate engine
      const hasDiscrepancy = Math.random() > 0.6;

      const parsedGroup: ProductGroup = {
        id: `GRP-${Date.now()}`,
        groupName: 'Biscuits',
        category: 'Snacks',
        expanded: true,
        varieties: [
          { id: `VAR-${Date.now()}-1`, barcode: '8901001', varietyName: 'Coaster Biscuit', qty: 45, costPrice: 0.30, sellingPrice: 0.50 },
          { id: `VAR-${Date.now()}-2`, barcode: '8901002', varietyName: 'Cabin Biscuit', qty: 30, costPrice: 0.40, sellingPrice: 0.65 },
        ]
      };

      const calculatedTotal = parsedGroup.varieties.reduce((sum, item) => sum + (item.costPrice * item.qty), 0);

      const newReceipt: Receipt = {
        id: receiptId,
        store: 'Your Registered Store',
        date: new Date().toISOString().split('T')[0],
        total: calculatedTotal,
        status: hasDiscrepancy ? 'Discrepancy' : 'Parsed',
        items: parsedGroup.varieties.length,
        discrepancyNote: hasDiscrepancy ? 'Invoice states 50 Coaster Biscuits delivered, but only 45 detected in stock scan.' : undefined
      };

      setReceipts([newReceipt, ...receipts]);
      setInventoryGroups([parsedGroup, ...inventoryGroups]);
      setSelectedFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const toggleGroupExpand = (groupId: string) => {
    setInventoryGroups(inventoryGroups.map(group => 
      group.id === groupId ? { ...group, expanded: !group.expanded } : group
    ));
  };

  const deductVarietyStock = (groupId: string, varietyId: string) => {
    setInventoryGroups(inventoryGroups.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          varieties: group.varieties.map(v => 
            v.id === varietyId && v.qty > 0 ? { ...v, qty: v.qty - 1 } : v
          )
        };
      }
      return group;
    }));
  };

  const handleAddManualVariety = (e: React.FormEvent) => {
    e.preventDefault();

    const newVarObj: Variety = {
      id: `VAR-${Date.now()}`,
      barcode: newVariety.barcode || `${Math.floor(100000 + Math.random() * 900000)}`,
      varietyName: newVariety.varietyName,
      qty: Number(newVariety.qty),
      costPrice: parseFloat(newVariety.costPrice) || 0,
      sellingPrice: parseFloat(newVariety.sellingPrice) || 0
    };

    const existingGroupIndex = inventoryGroups.findIndex(
      g => g.groupName.toLowerCase() === newVariety.groupName.toLowerCase()
    );

    if (existingGroupIndex > -1) {
      const updatedGroups = [...inventoryGroups];
      updatedGroups[existingGroupIndex].varieties.push(newVarObj);
      updatedGroups[existingGroupIndex].expanded = true;
      setInventoryGroups(updatedGroups);
    } else {
      const newGroupObj: ProductGroup = {
        id: `GRP-${Date.now()}`,
        groupName: newVariety.groupName,
        category: newVariety.category,
        expanded: true,
        varieties: [newVarObj]
      };
      setInventoryGroups([newGroupObj, ...inventoryGroups]);
    }

    setShowAddModal(false);
    setNewVariety({ groupName: 'Biscuits', category: 'Snacks', varietyName: '', barcode: '', qty: 10, costPrice: '', sellingPrice: '' });
  };

  // Resolve Discrepancy
  const handleResolveDiscrepancy = (receiptId: string) => {
    setReceipts(receipts.map(r => r.id === receiptId ? { ...r, status: 'Parsed' } : r));
    setShowDiscrepancyModal(false);
  };

  const totalUnitsInStock = inventoryGroups.reduce(
    (groupSum, g) => groupSum + g.varieties.reduce((vSum, v) => vSum + v.qty, 0), 0
  );

  const flaggedDiscrepancies = receipts.filter(r => r.status === 'Discrepancy');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-white tracking-wider">MY-AUDITOR</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPOSScanner(true)}
              className="px-3.5 py-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" /> POS Barcode Deduct
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Variety
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8">
        
        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold uppercase text-slate-400">Total Ingested</span>
            <div className="text-2xl font-bold text-white mt-1">{receipts.length} Receipts</div>
          </div>

          <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold uppercase text-slate-400">Live Inventory Stock</span>
            <div className="text-2xl font-bold text-emerald-400 mt-1">{totalUnitsInStock} Units</div>
          </div>

          <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold uppercase text-slate-400">Product Groups</span>
            <div className="text-2xl font-bold text-white mt-1">{inventoryGroups.length} Groups</div>
          </div>

          <div className="p-5 bg-slate-900/70 border border-slate-800 rounded-2xl">
            <span className="text-xs font-semibold uppercase text-slate-400">Audit Discrepancies</span>
            <div className={`text-2xl font-bold mt-1 ${flaggedDiscrepancies.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {flaggedDiscrepancies.length} Flagged
            </div>
          </div>
        </div>

        {/* Upload & Receipt Camera Section */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Upload className="w-5 h-5 text-emerald-400" /> Receipt AI Upload & Auto-Inventory
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload invoice files or use your live camera to scan physical paper receipts and detect audit leaks.
              </p>
            </div>

            <button
              type="button"
              onClick={useReceiptCamera ? stopReceiptCamera : startReceiptCamera}
              className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-4 h-4" />
              {useReceiptCamera ? 'Close Camera' : 'Scan via Camera'}
            </button>
          </div>

          {useReceiptCamera && (
            <div className="mb-6 p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col items-center justify-center relative">
              <button 
                onClick={stopReceiptCamera}
                className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-xs font-semibold text-slate-400 mb-3">Center paper receipt in camera frame</p>
              <video ref={receiptVideoRef} autoPlay playsInline className="w-full max-w-md rounded-xl border border-slate-800 bg-black" />
              <button
                type="button"
                onClick={captureReceiptPhoto}
                className="mt-4 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4" /> Capture Receipt Photo
              </button>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragActive 
                  ? 'border-emerald-500 bg-emerald-500/10' 
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/50'
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*,.pdf" onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])} className="hidden" />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                {selectedFile ? (
                  <div>
                    <p className="text-sm font-semibold text-emerald-400">{selectedFile.name}</p>
                    <p className="text-xs text-slate-500">{(selectedFile.size / 1024).toFixed(1)} KB • Ready for extraction</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-slate-300">
                      <span className="text-emerald-400 font-semibold">Click to upload</span> or drag & drop invoice images
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, or PDF receipts</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                {isUploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Process & Audit Receipt
              </button>
            </div>
          </form>
        </div>

        {/* Grouped Inventory Varieties Table */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" /> Grouped Inventory & Product Varieties
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Main product groups will appear here after a receipt is uploaded/scanned or a variety is added manually.
            </p>
          </div>

          {inventoryGroups.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-600 mb-3 border border-slate-800">
                <Inbox className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-300 mb-1">No products in inventory yet</h3>
              <p className="text-xs text-slate-500 max-w-sm">
                Upload/scan a receipt or click <strong>+ Add Variety</strong> above to create your store's first product group.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {inventoryGroups.map((group) => {
                const groupStockTotal = group.varieties.reduce((sum, v) => sum + v.qty, 0);

                return (
                  <div key={group.id} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                    <div 
                      onClick={() => toggleGroupExpand(group.id)}
                      className="p-4 bg-slate-900 hover:bg-slate-800/80 cursor-pointer flex items-center justify-between border-b border-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {group.expanded ? (
                          <ChevronDown className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-slate-400" />
                        )}
                        <div>
                          <h3 className="text-base font-bold text-white flex items-center gap-2">
                            <Tag className="w-4 h-4 text-emerald-400" /> {group.groupName}
                          </h3>
                          <span className="text-xs text-slate-400">{group.varieties.length} varieties recorded</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs font-semibold">
                        <span className="px-3 py-1 bg-slate-800 rounded-lg text-slate-300">
                          Total Stock: <strong className="text-emerald-400">{groupStockTotal} units</strong>
                        </span>
                      </div>
                    </div>

                    {group.expanded && (
                      <div className="p-4 overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-300">
                          <thead className="bg-slate-950 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-800">
                            <tr>
                              <th className="px-4 py-2">Variety Name</th>
                              <th className="px-4 py-2">Barcode / QR</th>
                              <th className="px-4 py-2">Stock Available</th>
                              <th className="px-4 py-2">Cost Price</th>
                              <th className="px-4 py-2">Selling Price</th>
                              <th className="px-4 py-2 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/50">
                            {group.varieties.map((v) => (
                              <tr key={v.id} className="hover:bg-slate-800/20 transition-colors">
                                <td className="px-4 py-3 font-semibold text-emerald-300 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                  {v.varietyName}
                                </td>
                                <td className="px-4 py-3 font-mono text-xs text-slate-400">{v.barcode}</td>
                                <td className="px-4 py-3 font-bold text-white">{v.qty} in stock</td>
                                <td className="px-4 py-3 text-slate-400">${v.costPrice.toFixed(2)}</td>
                                <td className="px-4 py-3 font-semibold text-emerald-400">${v.sellingPrice.toFixed(2)}</td>
                                <td className="px-4 py-3 text-right">
                                  <button
                                    onClick={() => deductVarietyStock(group.id, v.id)}
                                    disabled={v.qty === 0}
                                    className="px-2.5 py-1 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 text-xs font-semibold rounded-lg transition-all inline-flex items-center gap-1 disabled:opacity-40"
                                  >
                                    <Minus className="w-3 h-3" /> Sell 1
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Audit Receipts Log Table with Discrepancy Alerts */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Recent Audit Ingestion Logs</h2>
              <p className="text-xs text-slate-400">Ingested receipts and flagged discrepancy reports</p>
            </div>
          </div>

          {receipts.length === 0 ? (
            <div className="py-8 flex flex-col items-center justify-center text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
              <p className="text-xs text-slate-500">No receipts audited yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Receipt ID</th>
                    <th className="px-4 py-3">Store Branch</th>
                    <th className="px-4 py-3">Date Ingested</th>
                    <th className="px-4 py-3">Items Extracted</th>
                    <th className="px-4 py-3">Total Amount</th>
                    <th className="px-4 py-3 rounded-r-xl">Audit Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {receipts.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-4 font-mono font-bold text-white flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        {rec.id}
                      </td>
                      <td className="px-4 py-4 text-slate-300">{rec.store}</td>
                      <td className="px-4 py-4 text-slate-400">{rec.date}</td>
                      <td className="px-4 py-4 text-slate-300">{rec.items} varieties</td>
                      <td className="px-4 py-4 font-semibold text-white">${rec.total.toFixed(2)}</td>
                      <td className="px-4 py-4">
                        {rec.status === 'Parsed' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Balanced
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedAuditAlert(rec);
                              setShowDiscrepancyModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" /> View Discrepancy
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>

      {/* Discrepancy Audit Resolution Modal */}
      {showDiscrepancyModal && selectedAuditAlert && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Flagged Audit Discrepancy
              </h3>
              <button onClick={() => setShowDiscrepancyModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl mb-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Receipt Ref: <strong className="text-white font-mono">{selectedAuditAlert.id}</strong></span>
                <span>Date: <strong className="text-white">{selectedAuditAlert.date}</strong></span>
              </div>
              <p className="text-sm font-semibold text-amber-300 pt-2 border-t border-slate-800">
                {selectedAuditAlert.discrepancyNote}
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDiscrepancyModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => handleResolveDiscrepancy(selectedAuditAlert.id)}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Mark Reconciled & Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Variety Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Add Product Variety</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddManualVariety} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Product Group (Brand/Category)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Biscuits, Milk, Soaps"
                  value={newVariety.groupName}
                  onChange={(e) => setNewVariety({ ...newVariety, groupName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Specific Variety Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Coaster Biscuit, Cabin Biscuit"
                  value={newVariety.varietyName}
                  onChange={(e) => setNewVariety({ ...newVariety, varietyName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Initial Qty</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newVariety.qty}
                    onChange={(e) => setNewVariety({ ...newVariety, qty: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.50"
                    value={newVariety.sellingPrice}
                    onChange={(e) => setNewVariety({ ...newVariety, sellingPrice: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
              >
                Save Variety to Inventory
              </button>
            </form>
          </div>
        </div>
      )}

      {/* POS Barcode Scanner Modal */}
      {showPOSScanner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-center">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-400" /> POS Barcode Scanner
              </h3>
              <button onClick={() => setShowPOSScanner(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl mb-4">
              <QrCode className="w-16 h-16 text-emerald-400 mx-auto mb-3 animate-pulse" />
              <p className="text-xs text-slate-400">Position product barcode or QR code in front of camera.</p>
            </div>

            <button
              onClick={() => {
                if (inventoryGroups.length > 0 && inventoryGroups[0].varieties.length > 0) {
                  deductVarietyStock(inventoryGroups[0].id, inventoryGroups[0].varieties[0].id);
                }
                setShowPOSScanner(false);
              }}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Simulate Barcode Scan (Deduct 1 Item)
            </button>
          </div>
        </div>
      )}

    </div>
  );
}