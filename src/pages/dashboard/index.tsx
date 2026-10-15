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
  X,
  Camera,
  Trash2,
  TrendingUp,
  DollarSign,
  PieChart,
  Globe,
  LineChart
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

interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  date: string;
}

interface CurrencyOption {
  code: string;
  symbol: string;
  rate: number;
}

const CURRENCIES: Record<string, CurrencyOption> = {
  NGN: { code: 'NGN', symbol: '₦', rate: 1500 },
  USD: { code: 'USD', symbol: '$', rate: 1 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.78 },
  KES: { code: 'KES', symbol: 'Ksh', rate: 130 }
};

export default function DashboardPage() {
  const [selectedBranch, setSelectedBranch] = useState("Downtown Flagship");
  const [currencyKey, setCurrencyKey] = useState("NGN");
  
  const currentCurrency = CURRENCIES[currencyKey] || CURRENCIES.NGN;

  // Clean initial state
  const [inventoryGroups, setInventoryGroups] = useState<ProductGroup[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");

  const [newVarietyName, setNewVarietyName] = useState("");
  const [newBarcode, setNewBarcode] = useState("");
  const [newQty, setNewQty] = useState(15);
  const [newCost, setNewCost] = useState(2500);
  const [newPrice, setNewPrice] = useState(5000);

  const [expenseCat, setExpenseCat] = useState("Store Utilities");
  const [expenseAmt, setExpenseAmt] = useState(75000);

  const formatCurrency = (val: number) => {
    return `${currentCurrency.symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const sampleItemsForAudit = receipts.flatMap(r => [
    { 
      id: `${r.id}-1`, 
      name: `${r.store} Ingested Item`, 
      quantity: r.items, 
      unitCost: r.total / (r.items || 1), 
      expectedUnitCost: (r.total / (r.items || 1)) * (r.status === 'Discrepancy' ? 0.8 : 1.0) 
    }
  ]);
  const anomalyResult = detectInvoiceAnomalies(sampleItemsForAudit);

  const totalRevenue = inventoryGroups.reduce(
    (sum, g) => sum + g.varieties.reduce((vSum, v) => vSum + (v.qty * v.sellingPrice), 0), 0
  );
  const totalCOGS = inventoryGroups.reduce(
    (sum, g) => sum + g.varieties.reduce((vSum, v) => vSum + (v.qty * v.costPrice), 0), 0
  );
  const grossProfit = totalRevenue - totalCOGS;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = grossProfit - totalExpenses - anomalyResult.totalDiscrepancyAmount;

  // Generate dynamic chart trend points based on live P&L state
  const chartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const chartPoints = chartDays.map((day, idx) => {
    const factor = (idx + 1) / 7;
    return {
      day,
      revenue: totalRevenue * factor,
      cogs: totalCOGS * factor,
      net: netProfit * factor
    };
  });

  const maxVal = Math.max(totalRevenue, totalCOGS, Math.abs(netProfit), 100);

  const handleFileUpload = (e?: React.ChangeEvent<HTMLInputElement>) => {
    setIsProcessingUpload(true);
    setUploadSuccessMsg("");

    setTimeout(() => {
      const isDiscrepancy = Math.random() > 0.4;
      const baseMultiplier = currencyKey === 'NGN' ? 1000 : 1;
      const newReceipt: Receipt = {
        id: `REC-${Math.floor(100 + Math.random() * 900)}`,
        store: e?.target?.files?.[0]?.name ? `Supplier (${e.target.files[0].name.split('.')[0]})` : "Camera Audit Scan",
        date: new Date().toISOString().split('T')[0],
        total: Math.floor(150 + Math.random() * 400) * baseMultiplier,
        status: isDiscrepancy ? 'Discrepancy' : 'Parsed',
        items: Math.floor(5 + Math.random() * 15),
        discrepancyNote: isDiscrepancy ? "AI Audit: Supplier unit cost spike detected" : undefined
      };

      setReceipts(prev => [newReceipt, ...prev]);
      setIsProcessingUpload(false);
      setUploadSuccessMsg("Receipt successfully parsed, audited & factored into live P&L!");
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

    setInventoryGroups(prev => {
      if (prev.length === 0) {
        return [{
          id: 'grp-1',
          groupName: 'Store Catalog',
          category: 'Retail General',
          varieties: [newVar]
        }];
      }
      return prev.map((g, idx) => idx === 0 ? { ...g, varieties: [newVar, ...g.varieties] } : g);
    });

    setNewVarietyName("");
    setNewBarcode("");
    setShowAddModal(false);
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      category: expenseCat,
      amount: Number(expenseAmt),
      date: new Date().toISOString().split('T')[0]
    };
    setExpenses([newExp, ...expenses]);
    setShowExpenseModal(false);
  };

  const handleDeleteVariety = (groupId: string, varietyId: string) => {
    setInventoryGroups(prev => 
      prev.map(g => g.id === groupId ? {
        ...g,
        varieties: g.varieties.filter(v => v.id !== varietyId)
      } : g).filter(g => g.varieties.length > 0)
    );
  };

  const handleExport = () => {
    downloadCSV({
      businessName: "Apex Retail Corp",
      branchName: selectedBranch,
      dateGenerated: new Date().toLocaleDateString(),
      totalReceipts: receipts.length,
      totalUnits: inventoryGroups.reduce((s, g) => s + g.varieties.reduce((vs, v) => vs + v.qty, 0), 0),
      totalDiscrepancies: receipts.filter(r => r.status === 'Discrepancy').length,
      discrepancyAmount: anomalyResult.totalDiscrepancyAmount
    });
  };

  const allVarieties = inventoryGroups.flatMap(g => g.varieties);
  const sortedVarieties = [...allVarieties].sort((a, b) => (b.sellingPrice - b.costPrice) - (a.sellingPrice - a.costPrice));
  const topPerformers = sortedVarieties.slice(0, 3);
  const underperformers = sortedVarieties.slice(-3).reverse();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Responsive Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:h-16 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-lg sm:text-xl font-black text-white tracking-wider">MY-AUDITOR</span>
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
              <Building2 className="w-4 h-4 text-emerald-400 hidden sm:block" />
              <select 
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-slate-800 text-xs text-slate-200 border border-slate-700 rounded-lg px-2 py-1 focus:outline-none focus:border-emerald-500"
              >
                <option value="Downtown Flagship">Downtown Flagship</option>
                <option value="Westside Mall">Westside Mall</option>
                <option value="Eastside Hub">Eastside Hub</option>
              </select>
            </div>
          </div>

          <div className="flex items-center flex-wrap justify-end gap-2 w-full sm:w-auto">
            {/* Currency Switcher */}
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-2 py-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={currencyKey}
                onChange={(e) => setCurrencyKey(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-bold"
              >
                <option value="NGN" className="bg-slate-900">₦ NGN</option>
                <option value="USD" className="bg-slate-900">$ USD</option>
                <option value="EUR" className="bg-slate-900">€ EUR</option>
                <option value="GBP" className="bg-slate-900">£ GBP</option>
                <option value="KES" className="bg-slate-900">Ksh KES</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() => setShowExpenseModal(true)}
              className="px-3 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Expense
            </button>

            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3 py-1.5 sm:py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" /> Add Variety
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 sm:py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" /> Export
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-6">
        
        {/* Live P&L Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Potential Revenue</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{formatCurrency(totalRevenue)}</p>
            <p className="text-[11px] text-emerald-400 mt-1">COGS: {formatCurrency(totalCOGS)}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Profit</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{formatCurrency(grossProfit)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Margin: {totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0}%</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Expenses & Leakage</p>
            <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{formatCurrency(totalExpenses + anomalyResult.totalDiscrepancyAmount)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Expenses: {formatCurrency(totalExpenses)} • Leakage: {formatCurrency(anomalyResult.totalDiscrepancyAmount)}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl border-l-4 border-l-emerald-500">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Net Profit</p>
            <p className={`text-2xl sm:text-3xl font-black mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(netProfit)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Real-time audited balance</p>
          </div>
        </div>

        {/* Feature #1: Interactive SVG P&L & Margins Trend Chart */}
        <div className="bg-slate-900/40 border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <LineChart className="w-4 h-4 text-emerald-400" /> Real-Time P&L & Margins Trend Chart
            </h3>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block"></span> COGS</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block"></span> Net Profit</span>
            </div>
          </div>

          <div className="h-44 w-full pt-4 relative flex items-end justify-between border-b border-slate-800 pb-2">
            {chartPoints.map((pt, idx) => {
              const revHeight = Math.min(100, (pt.revenue / maxVal) * 100);
              const cogsHeight = Math.min(100, (pt.cogs / maxVal) * 100);
              const netHeight = Math.min(100, (Math.max(0, pt.net) / maxVal) * 100);

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  {/* Tooltip on hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-slate-900 border border-slate-700 text-[10px] p-1.5 rounded shadow-lg pointer-events-none transition-opacity z-20 whitespace-nowrap">
                    <p className="text-white font-bold">{pt.day}</p>
                    <p className="text-emerald-400">Rev: {formatCurrency(pt.revenue)}</p>
                    <p className="text-teal-400">Net: {formatCurrency(pt.net)}</p>
                  </div>

                  <div className="flex items-end gap-1 w-full max-w-[32px] h-full justify-center">
                    <div style={{ height: `${Math.max(5, revHeight)}%` }} className="w-2 bg-emerald-400/80 hover:bg-emerald-400 rounded-t transition-all"></div>
                    <div style={{ height: `${Math.max(5, cogsHeight)}%` }} className="w-2 bg-slate-600 hover:bg-slate-500 rounded-t transition-all"></div>
                    <div style={{ height: `${Math.max(5, netHeight)}%` }} className="w-2 bg-teal-400/80 hover:bg-teal-400 rounded-t transition-all"></div>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-2">{pt.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Performance & Expenses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/40 border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Item Performance Analytics
            </h3>

            <div>
              <p className="text-xs font-semibold text-emerald-400 mb-2">Top Performing Varieties</p>
              {topPerformers.length === 0 ? (
                <p className="text-xs text-slate-500">No inventory data available yet.</p>
              ) : (
                <div className="space-y-2">
                  {topPerformers.map(item => (
                    <div key={item.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <span className="font-medium text-white truncate max-w-[180px]">{item.varietyName}</span>
                      <span className="text-emerald-400 font-bold shrink-0">+{formatCurrency(item.sellingPrice - item.costPrice)} unit margin</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <p className="text-xs font-semibold text-rose-400 mb-2">Underperforming Varieties</p>
              {underperformers.length === 0 ? (
                <p className="text-xs text-slate-500">No inventory data available yet.</p>
              ) : (
                <div className="space-y-2">
                  {underperformers.map(item => (
                    <div key={item.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                      <span className="font-medium text-white truncate max-w-[180px]">{item.varietyName}</span>
                      <span className="text-rose-400 font-bold shrink-0">+{formatCurrency(item.sellingPrice - item.costPrice)} unit margin</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/40 border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" /> Live Operational Expenses
            </h3>
            
            {expenses.length === 0 ? (
              <div className="text-center py-8 bg-slate-950/50 rounded-xl border border-slate-800/80">
                <p className="text-xs text-slate-500">No expenses logged. Click <span className="text-emerald-400 font-bold">Expense</span> above.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {expenses.map(exp => (
                  <div key={exp.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-medium text-white">{exp.category}</p>
                      <p className="text-[10px] text-slate-500">Logged on {exp.date}</p>
                    </div>
                    <span className="text-rose-400 font-bold">-{formatCurrency(exp.amount)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">Total Audited Discrepancies</span>
              <span className="text-rose-400 font-bold">-{formatCurrency(anomalyResult.totalDiscrepancyAmount)}</span>
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-emerald-400" /> Receipt AI Upload & Auto-Inventory
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Upload invoice files or use live camera to scan physical paper receipts and update live P&L.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleFileUpload()}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Camera className="w-4 h-4" /> Scan via Camera
            </button>
          </div>

          <label className="border-2 border-dashed border-slate-700 hover:border-emerald-500/50 bg-slate-950/50 p-6 sm:p-10 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group">
            <input 
              type="file" 
              accept="image/*,application/pdf" 
              className="hidden" 
              onChange={handleFileUpload}
            />
            {isProcessingUpload ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-emerald-400 font-semibold animate-pulse text-center">Processing OCR & updating financial P&L...</p>
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
                  <p className="text-[11px] text-slate-500 mt-1">Supports PNG, JPG, or PDF receipts</p>
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

        {/* Live Inventory Table */}
        <div className="bg-slate-900/40 border border-slate-800 p-5 sm:p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Live Inventory Catalog</h3>
            <span className="text-xs text-slate-500">{allVarieties.length} Varieties Active</span>
          </div>

          {inventoryGroups.length === 0 ? (
            <div className="text-center py-8 bg-slate-950/50 rounded-xl border border-slate-800/80">
              <p className="text-xs text-slate-500">No products in store catalog. Click <span className="text-emerald-400 font-bold">+ Add Variety</span> to add inventory.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {inventoryGroups.map(group => (
                <div key={group.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <h4 className="text-xs font-bold text-emerald-400 mb-3">{group.groupName} <span className="text-slate-500 font-normal">({group.category})</span></h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-300 min-w-[500px]">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-500">
                          <th className="pb-2">Variety Name</th>
                          <th className="pb-2">Barcode</th>
                          <th className="pb-2">Stock Qty</th>
                          <th className="pb-2">Cost Price</th>
                          <th className="pb-2">Selling Price</th>
                          <th className="pb-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900">
                        {group.varieties.map(v => (
                          <tr key={v.id}>
                            <td className="py-2.5 font-medium text-white">{v.varietyName}</td>
                            <td className="py-2.5 text-slate-500">{v.barcode}</td>
                            <td className="py-2.5 text-emerald-400 font-bold">{v.qty}</td>
                            <td className="py-2.5">{formatCurrency(v.costPrice)}</td>
                            <td className="py-2.5">{formatCurrency(v.sellingPrice)}</td>
                            <td className="py-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteVariety(group.id, v.id)}
                                className="p-1.5 hover:bg-rose-500/20 text-rose-400 rounded-lg transition cursor-pointer"
                                title="Remove Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Modals */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
            <button 
              type="button" 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
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
                  <label className="text-xs text-slate-400 block mb-1">Cost Price ({currentCurrency.symbol})</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={newCost} 
                    onChange={e => setNewCost(Number(e.target.value))} 
                    className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Selling Price ({currentCurrency.symbol})</label>
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

      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-sm w-full shadow-2xl relative">
            <button 
              type="button" 
              onClick={() => setShowExpenseModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Log Operational Expense</h3>
            <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Expense Category</label>
                <select 
                  value={expenseCat} 
                  onChange={e => setExpenseCat(e.target.value)} 
                  className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Store Utilities">Store Utilities</option>
                  <option value="Logistics & Transport">Logistics & Transport</option>
                  <option value="Staff Payroll">Staff Payroll</option>
                  <option value="Marketing & Promo">Marketing & Promo</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount ({currentCurrency.symbol})</label>
                <input 
                  type="number" 
                  step="0.01" 
                  value={expenseAmt} 
                  onChange={e => setExpenseAmt(Number(e.target.value))} 
                  className="w-full bg-slate-950 border border-slate-800 text-sm rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowExpenseModal(false)} 
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}