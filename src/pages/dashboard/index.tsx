import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Plus, 
  FileText, 
  AlertTriangle, 
  Building2, 
  UploadCloud,
  CheckCircle2,
  X
} from 'lucide-react';
import { detectInvoiceAnomalies } from "../../lib/anomalyDetector";
import { downloadCSV } from "../../lib/reportExporter";

interface ProductVariety {
  id: string;
  barcode: string;
  varietyName: string;
  qty: number;
  costPrice: number;
  sellingPrice: number;
}

interface ProductGroup {
  id: string;
  groupName: string;
  category: string;
  expanded?: boolean;
  varieties: ProductVariety[];
}

interface Receipt {
  id: string;
  store: string;
  date: string;
  total: number;
  status: 'Parsed' | 'Discrepancy' | 'Pending';
  items: number;
  discrepancyNote?: string;
}

export default function DashboardPage() {
  const [selectedBranch, setSelectedBranch] = useState("Downtown Flagship");
  const [inventoryGroups, setInventoryGroups] = useState<ProductGroup[]>([
    {
      id: "grp-1",
      groupName: "Dairy & Beverage",
      category: "Perishables",
      expanded: true,
      varieties: [
        { id: "var-1", barcode: "8901001", varietyName: "Fresh Whole Milk 1L", qty: 45, costPrice: 2.10, sellingPrice: 3.50 },
        { id: "var-2", barcode: "8901002", varietyName: "Cheddar Cheese 500g", qty: 28, costPrice: 4.50, sellingPrice: 6.99 }
      ]
    }
  ]);
  const [receipts, setReceipts] = useState<Receipt[]>([
    { id: "REC-101", store: "Metro Wholesale", date: "2026-10-14", total: 450.00, status: "Discrepancy", items: 12, discrepancyNote: "Supplier unit cost +18% vs benchmark price" }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");

  // New Variety Form State
  const [newVarietyName, setNewVarietyName] = useState("");
  const [newBarcode, setNewBarcode] = useState("");
  const [newQty, setNewQty] = useState(10);
  const [newCost, setNewCost] = useState(5.00);
  const [newPrice, setNewPrice] = useState(9.99);

  // Dynamic Anomaly Detection over Ingested Receipts
  const sampleItemsForAudit = receipts.flatMap(r => [
    { 
      id: `${r.id}-1`, 
      name: `${r.store} Stock Item`, 
      quantity: r.items, 
      unitCost: r.total / (r.items || 1), 
      expectedUnitCost: (r.total / (r.items || 1)) * (r.status === 'Discrepancy' ? 0.8 : 1.0) 
    }
  ]);
  const anomalyResult = detectInvoiceAnomalies(sampleItemsForAudit);

  // Self-service receipt simulator handler
  const handleFileUpload = (e?: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessingUpload(true);
    setUploadSuccessMsg("");

    setTimeout(() => {
      const isDiscrepancy = Math.random() > 0.4;
      const newReceipt: Receipt = {
        id: `REC-${Math.floor(100 + Math.random() * 900)}`,
        store: e?.target?.files?.[0]?.name ? `Supplier (${e.target.files[0].name.split('.')[0]})` : "Global Wholesale Ingestion",
        date: new Date().toISOString().split('T')[0],
        total: Math.floor(200 + Math.random() * 800),
        status: isDiscrepancy ? 'Discrepancy' : 'Parsed',
        items: Math.floor(5 + Math.random() * 20),
        discrepancyNote: isDiscrepancy ? "AI Flag: Supplier price +22% vs benchmark index" : undefined
      };

      setReceipts(prev => [newReceipt, ...prev]);

      setInventoryGroups(prev => prev.map((g, idx) => idx === 0 ? {
        ...g,
        varieties: [
          {
            id: `var-${Date.now()}`,
            barcode: `${Math.floor(8000000 + Math.random() * 1000000)}`,
            varietyName: `Ingested Audit Item (${newReceipt.store})`,
            qty: newReceipt.items * 2,
            costPrice: Number((newReceipt.total / newReceipt.items).toFixed(2)),
            sellingPrice: Number(((newReceipt.total / newReceipt.items) * 1.5).toFixed(2))
          },
          ...g.varieties
        ]
      } : g));

      setIsProcessingUpload(false);
      setUploadSuccessMsg(`Receipt successfully processed & audited! Added to live inventory.`);
    }, 1200);
  };

  const handleAddVarietySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarietyName) return;

    const newVar: ProductVariety = {
      id: `var-${Date.now()}`,
      barcode: newBarcode || `${Math.floor(8000000 + Math.random() * 1000000)}`,
      varietyName: newVarietyName,
      qty: Number(newQty),
      costPrice: Number(newCost),
      sellingPrice: Number(newPrice)
    };

    setInventoryGroups(prev => prev.map((g, idx) => idx === 0 ? { ...g, varieties: [newVar, ...g.varieties] } : g));

    setNewVarietyName("");
    setNewBarcode("");
    setShowAddModal(false);
  };

  const handleExport = () => {
    downloadCSV({
      businessName: "Apex Retail Corp",
      branchName: selectedBranch,
      dateGenerated: new Date().toLocaleDateString(),
      totalReceipts: receipts.length,
      totalUnits: totalUnitsInStock,
      totalDiscrepancies: flaggedDiscrepancies.length,
      discrepancyAmount: anomalyResult.totalDiscrepancyAmount
    });
  };

  const totalUnitsInStock = inventoryGroups.reduce(
    (groupSum, g) => groupSum + g.varieties.reduce((vSum, v) => vSum + v.qty, 0), 0
  );

  const flaggedDiscrepancies = receipts.filter(r => r.status === 'Discrepancy');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-wider">MY-AUDITOR</span>
            </Link>

            <div className="flex items-center gap-2 pl-4 border-l border-slate-800">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 focus:outline-none focus:border-emerald-500"
              >
                <option value="Downtown Flagship">Downtown Flagship</option>
                <option value="Westside Mall">Westside Mall</option>
                <option value="Eastside Hub">Eastside Hub</option>
              </select>
              <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer z-10"
            >
              <Plus className="w-4 h-4" /> Add Variety
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic AI Anomaly Alert Banner */}
      {anomalyResult.hasAnomaly && (
        <div className="max-w-7xl mx-auto px-6 w-full mt-6">
          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-rose-300">
                  AI Anomaly Alert: {anomalyResult.flaggedItems.length} Supplier Price Spike(s) Flagged
                </p>
                <p className="text-xs text-rose-400/80">
                  Estimated Leakage: ${anomalyResult.totalDiscrepancyAmount.toFixed(2)} vs Historical Price Benchmarks
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8">
        
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Ingested</p>
            <p className="text-3xl font-black text-white mt-1">{receipts.length} <span className="text-sm font-normal text-slate-400">Receipts</span></p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Inventory Stock</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{totalUnitsInStock} <span className="text-sm font-normal text-slate-400">Units</span></p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Groups</p>
            <p className="text-3xl font-black text-white mt-1">{inventoryGroups.length} <span className="text-sm font-normal text-slate-400">Groups</span></p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audit Discrepancies</p>
            <p className="text-3xl font-black text-emerald-400 mt-1">{flaggedDiscrepancies.length} <span className="text-sm font-normal text-slate-400">Flagged</span></p>
          </div>
        </div>

        {/* Interactive Self-Service Receipt Ingest Dropzone */}
        <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl relative overflow-hidden">
          <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-emerald-400" /> Interactive Receipt Upload & Auto-Inventory
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            Upload invoice files or click below to simulate instant OCR parsing & AI anomaly auditing.
          </p>

          <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/50 p-10 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group">
            <input 
              type="file" 
              accept="image/*,application/pdf" 
              className="hidden" 
              onChange={handleFileUpload}
            />
            {isProcessingUpload ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-emerald-400 font-semibold animate-pulse">Processing OCR & auditing supplier benchmarks...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-full group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-200">
                    <span className="text-emerald-400">Click to upload</span> or drag & drop receipts
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">Supports PNG, JPG, or PDF</p>
                </div>
              </div>
            )}
          </label>

          {uploadSuccessMsg && (
            <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {uploadSuccessMsg}
            </div>
          )}
        </div>

        {/* Inventory Table Preview */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Live Inventory Stock Audit</h3>
          <div className="space-y-4">
            {inventoryGroups.map(group => (
              <div key={group.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-sm font-bold text-emerald-400">{group.groupName} <span className="text-xs text-slate-500 font-normal">({group.category})</span></h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-500">
                        <th className="pb-2">Variety Name</th>
                        <th className="pb-2">Barcode</th>
                        <th className="pb-2">Qty</th>
                        <th className="pb-2">Cost Price</th>
                        <th className="pb-2">Selling Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {group.varieties.map(v => (
                        <tr key={v.id}>
                          <td className="py-2.5 font-medium text-white">{v.varietyName}</td>
                          <td className="py-2.5 text-slate-500">{v.barcode}</td>
                          <td className="py-2.5 text-emerald-400 font-bold">{v.qty}</td>
                          <td className="py-2.5">${v.costPrice.toFixed(2)}</td>
                          <td className="py-2.5">${v.sellingPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Add Variety Self-Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Add Product Variety to Inventory</h3>
            <form onSubmit={handleAddVarietySubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Product / Variety Name</label>
                <input 
                  type="text" 
                  value={newVarietyName} 
                  onChange={e => setNewVarietyName(e.target.value)} 
                  placeholder="e.g. Organic Almond Milk 1L" 
                  required 
                  className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Barcode</label>
                  <input 
                    type="text" 
                    value={newBarcode} 
                    onChange={e => setNewBarcode(e.target.value)} 
                    placeholder="Auto-generated" 
                    className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Quantity</label>
                  <input 
                    type="number" 
                    value={newQty} 
                    onChange={e => setNewQty(Number(e.target.value))} 
                    className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Cost Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={newCost} 
                    onChange={e => setNewCost(Number(e.target.value))} 
                    className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Selling Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={newPrice} 
                    onChange={e => setNewPrice(Number(e.target.value))} 
                    className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)} 
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}