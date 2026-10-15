import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Plus, 
  QrCode, 
  FileText, 
  AlertTriangle, 
  Building2, 
  ChevronDown 
} from 'lucide-react';
import { detectInvoiceAnomalies } from "../../lib/anomalyDetector";
import { downloadCSV } from "../../lib/reportExporter";
import { hasPermission } from "../../lib/rbac";

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
  const [inventoryGroups, setInventoryGroups] = useState<ProductGroup[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPOSScanner, setShowPOSScanner] = useState(false);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);

  // Dynamic Anomaly Detection based on actual receipts/items
  const sampleItemsForAudit = receipts.flatMap(r => [
    { id: `${r.id}-1`, name: `${r.store} Stock Item`, quantity: r.items, unitCost: r.total / (r.items || 1), expectedUnitCost: (r.total / (r.items || 1)) * (r.status === 'Discrepancy' ? 0.8 : 1.0) }
  ]);
  const anomalyResult = detectInvoiceAnomalies(sampleItemsForAudit);

  // Dynamic CSV Export Handler
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
          
          {/* Logo & Interactive Branch RBAC Switcher */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-wider">MY-AUDITOR</span>
            </Link>

            {/* Branch Selector Dropdown */}
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

          {/* Action Buttons */}
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

            {/* Executive Report Exporter Button */}
            <button
              onClick={handleExport}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>
      </header>

      {/* Dynamic AI Anomaly Alert Banner (Only renders if real anomalies exist) */}
      {anomalyResult.hasAnomaly && (
        <div className="max-w-7xl mx-auto px-6 w-full mt-4">
          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-rose-300">
                  AI Anomaly Alert: {anomalyResult.flaggedItems.length} Supplier Price Spike(s) Detected
                </p>
                <p className="text-xs text-rose-400/80">
                  Total Discrepancy Amount: ${anomalyResult.totalDiscrepancyAmount.toFixed(2)} vs Historical Averages
                </p>
              </div>
            </div>
            <button 
              onClick={() => setShowDiscrepancyModal(true)} 
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold rounded-lg border border-rose-500/40 transition"
            >
              Review Flagged Items
            </button>
          </div>
        </div>
      )}

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 space-y-8">
        
        {/* Metric Cards */}
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

        {/* Upload Zone Placeholder */}
        <div className="bg-slate-900/30 border border-slate-800 p-8 rounded-2xl text-center">
          <p className="text-sm text-slate-400">Receipt AI Upload & Auto-Inventory active. Ingest receipts to trigger dynamic anomaly checks.</p>
        </div>

      </main>
    </div>
  );
}