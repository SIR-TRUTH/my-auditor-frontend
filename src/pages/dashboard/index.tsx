import React, { useState, useRef } from 'react';
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
  DollarSign,
  Globe,
  LineChart,
  ShoppingBag,
  ShieldAlert,
  UserCheck,
  Menu,
  Send,
  Bot,
  Lock,
  Store,
  Tag
} from 'lucide-react';
import { detectInvoiceAnomalies } from "../../lib/anomalyDetector";
import { parseReceiptImageText } from "../../lib/ocrParser";

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

interface ShrinkageItem {
  id: string;
  itemName: string;
  qtyLost: number;
  totalValue: number;
  reason: string;
  date: string;
}

interface StoreBranchData {
  id: string;
  name: string;
  type: string;
  address: string;
  inventoryGroups: ProductGroup[];
  receipts: Receipt[];
  expenses: ExpenseItem[];
  shrinkageLogs: ShrinkageItem[];
  posSalesRevenue: number;
  posSalesCOGS: number;
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

const STORE_TYPES = [
  "Retail Supermarket & Provisions",
  "FMCG Wholesale & Distribution",
  "Pharmacy & Patent Medicine",
  "Electronics & Tech Accessories",
  "Boutique, Clothing & Footwear",
  "Restaurant, Lounge & Bar",
  "Hardware & Building Materials",
  "General Merchandise"
];

export default function DashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currencyKey, setCurrencyKey] = useState("NGN");
  const [userRole, setUserRole] = useState<'ADMIN' | 'AUDITOR' | 'INVESTOR'>("ADMIN");

  // Multi-Store Branches State
  const [stores, setStores] = useState<StoreBranchData[]>([
    {
      id: 'store-1',
      name: 'Main Flagship Store',
      type: 'Retail Supermarket & Provisions',
      address: 'Lagos Island',
      inventoryGroups: [],
      receipts: [],
      expenses: [],
      shrinkageLogs: [],
      posSalesRevenue: 0,
      posSalesCOGS: 0
    }
  ]);
  const [activeStoreId, setActiveStoreId] = useState<string>('store-1');

  // Modals state
  const [showNewStoreModal, setShowNewStoreModal] = useState(false);
  const [newStoreNameInput, setNewStoreNameInput] = useState("");
  const [newStoreTypeInput, setNewStoreTypeInput] = useState(STORE_TYPES[0]);
  const [newStoreLocationInput, setNewStoreLocationInput] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showShrinkageModal, setShowShrinkageModal] = useState(false);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState("");
  const [posNotice, setPosNotice] = useState("");

  // Form states
  const [newGroupName, setNewGroupName] = useState("General Stock");
  const [newCategory, setNewCategory] = useState("FMCG");
  const [newVarietyName, setNewVarietyName] = useState("");
  const [newBarcode, setNewBarcode] = useState("");
  const [newQty, setNewQty] = useState(10);
  const [newCost, setNewCost] = useState(1000);
  const [newPrice, setNewPrice] = useState(1500);

  const [expenseCat, setExpenseCat] = useState("Utilities & Generator");
  const [expenseAmt, setExpenseAmt] = useState(25000);

  const [shrinkName, setShrinkName] = useState("Damaged Goods");
  const [shrinkQty, setShrinkQty] = useState(1);
  const [shrinkCostVal, setShrinkCostVal] = useState(1000);
  const [shrinkReason, setShrinkReason] = useState("Spoilage");

  // Camera State
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);

  // Chat State
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your MY-AUDITOR AI Forensic CPA. Ask me complex questions regarding your store margins, supplier invoice variances, inventory turnover, or expense burn rates.' }
  ]);
  const [userQuery, setUserQuery] = useState("");

  const currentCurrency = CURRENCIES[currencyKey] || CURRENCIES.NGN;
  const activeStore = stores.find(s => s.id === activeStoreId) || stores[0];

  const formatCurrency = (val: number) => {
    return `${currentCurrency.symbol}${val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const sampleItemsForAudit = activeStore.receipts.flatMap(r => [
    { 
      id: `${r.id}-1`, 
      name: `${r.store} Ingested Item`, 
      quantity: r.items, 
      unitCost: r.total / (r.items || 1), 
      expectedUnitCost: (r.total / (r.items || 1)) * (r.status === 'Discrepancy' ? 0.8 : 1.0) 
    }
  ]);
  const anomalyResult = detectInvoiceAnomalies(sampleItemsForAudit);

  const inventoryRevenue = activeStore.inventoryGroups.reduce(
    (sum, g) => sum + g.varieties.reduce((vSum, v) => vSum + (v.qty * v.sellingPrice), 0), 0
  );
  const inventoryCOGS = activeStore.inventoryGroups.reduce(
    (sum, g) => sum + g.varieties.reduce((vSum, v) => vSum + (v.qty * v.costPrice), 0), 0
  );

  const totalRevenue = inventoryRevenue + activeStore.posSalesRevenue;
  const totalCOGS = inventoryCOGS + activeStore.posSalesCOGS;
  const grossProfit = totalRevenue - totalCOGS;

  const totalExpenses = activeStore.expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalShrinkageLoss = activeStore.shrinkageLogs.reduce((sum, s) => sum + s.totalValue, 0);
  const netProfit = grossProfit - totalExpenses - totalShrinkageLoss - anomalyResult.totalDiscrepancyAmount;

  // Add New Store Branch
  const handleCreateNewStore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStoreNameInput.trim()) return;

    const newStore: StoreBranchData = {
      id: `store-${Date.now()}`,
      name: newStoreNameInput,
      type: newStoreTypeInput,
      address: newStoreLocationInput || "Main Address",
      inventoryGroups: [],
      receipts: [],
      expenses: [],
      shrinkageLogs: [],
      posSalesRevenue: 0,
      posSalesCOGS: 0
    };

    setStores(prev => [...prev, newStore]);
    setActiveStoreId(newStore.id);
    setNewStoreNameInput("");
    setNewStoreLocationInput("");
    setShowNewStoreModal(false);
  };

  const startLiveCamera = async () => {
    if (userRole === 'INVESTOR') return;
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      document.getElementById('native-camera-input')?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }
      });
      setCameraStream(stream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      document.getElementById('native-camera-input')?.click();
    }
  };

  const stopLiveCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  const capturePhotoAndProcess = () => {
    stopLiveCamera();
    handleFileUpload();
  };

  // Advanced CPA / Forensic AI Assistant Logic
  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;

    const query = userQuery;
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setUserQuery("");

    setTimeout(() => {
      const lower = query.toLowerCase().trim();
      let aiResponse = "";

      const marginPct = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : '0';
      const expenseRatio = totalRevenue > 0 ? ((totalExpenses / totalRevenue) * 100).toFixed(1) : '0';
      const shrinkageRatio = totalRevenue > 0 ? ((totalShrinkageLoss / totalRevenue) * 100).toFixed(1) : '0';
      const totalItemsCount = activeStore.inventoryGroups.reduce((acc, g) => acc + g.varieties.reduce((vAcc, v) => vAcc + v.qty, 0), 0);

      if (['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'sup'].includes(lower) || lower.startsWith('hi ') || lower.startsWith('hello ')) {
        aiResponse = `👋 Hello! I am your MY-AUDITOR AI Forensic CPA. I am monitoring **${activeStore.name}** (${activeStore.type}). Ask me to run variance audits, analyze expense burn ratios, calculate break-even points, or audit supplier price spikes.`;
      } 
      else if (lower.includes('put me through') || lower.includes('how to use') || lower.includes('help') || lower.includes('guide')) {
        aiResponse = `💡 **MY-AUDITOR Execution Guide:**\n` +
          `1️⃣ **Catalog Setup:** Use 'Add Inventory Variety' in the Action Hub to set stock cost and selling prices.\n` +
          `2️⃣ **Invoice Auditing:** Use the AI OCR Camera Scanner or upload paper receipts to auto-reconcile supplier pricing.\n` +
          `3️⃣ **Financial Diagnostics:** Ask me complex queries like *"Audit my expense burn rate"*, *"What is my inventory valuation?"*, or *"Check supplier price variances"*.`;
      } 
      else if (lower.includes('expense') || lower.includes('burn') || lower.includes('overhead') || lower.includes('cost')) {
        aiResponse = `📉 **Overhead & Expense Audit (${activeStore.name}):**\n` +
          `• Total Operating Expenses: **${formatCurrency(totalExpenses)}**\n` +
          `• Expense-to-Revenue Ratio: **${expenseRatio}%** ${Number(expenseRatio) > 20 ? '⚠️ (High burn rate alert: exceeds 20% benchmark)' : '✅ (Healthy ratio)'}\n` +
          `• Total COGS: **${formatCurrency(totalCOGS)}**\n` +
          `Recommendation: Review utility and logistical overhead to protect gross margins.`;
      } 
      else if (lower.includes('shrinkage') || lower.includes('theft') || lower.includes('loss') || lower.includes('damage') || lower.includes('audit')) {
        aiResponse = `🛡️ **Shrinkage & Stock Integrity Audit (${activeStore.name}):**\n` +
          `• Logged Shrinkage / Damage Loss: **${formatCurrency(totalShrinkageLoss)}**\n` +
          `• Shrinkage Loss Ratio: **${shrinkageRatio}%** of revenue\n` +
          `• Active Stock Units: **${totalItemsCount} units** across **${allVarieties.length} varieties**\n` +
          `${totalShrinkageLoss > 0 ? '⚠️ Action Required: Investigate physical stock counts against POS reconciliation.' : '✅ Stock integrity is currently clean with zero reported shrinkage.'}`;
      } 
      else if (lower.includes('supplier') || lower.includes('spike') || lower.includes('leakage') || lower.includes('variance') || lower.includes('anomaly')) {
        if (anomalyResult.hasAnomaly) {
          aiResponse = `🚨 **Forensic Supplier Audit Alert:**\n` +
            `We detected **${anomalyResult.flaggedItems.length} price anomaly(ies)** resulting in **${formatCurrency(anomalyResult.totalDiscrepancyAmount)}** in supplier price leakage.\n` +
            `This variance has been automatically subtracted from your Net Profit. Re-negotiate invoice terms with your vendor.`;
        } else {
          aiResponse = `✅ **Supplier Audit Clean:** All active invoices for ${activeStore.name} match standard benchmark cost pricing. Zero price discrepancies detected.`;
        }
      } 
      else if (lower.includes('margin') || lower.includes('profit') || lower.includes('net') || lower.includes('gross') || lower.includes('revenue') || lower.includes('p&l')) {
        aiResponse = `📊 **Comprehensive P&L Audit (${activeStore.name}):**\n` +
          `• **Total Revenue:** ${formatCurrency(totalRevenue)} (POS: ${formatCurrency(activeStore.posSalesRevenue)})\n` +
          `• **Cost of Goods Sold (COGS):** ${formatCurrency(totalCOGS)}\n` +
          `• **Gross Profit:** ${formatCurrency(grossProfit)} (**${marginPct}%** Gross Margin)\n` +
          `• **Operating Expenses:** ${formatCurrency(totalExpenses)}\n` +
          `• **Shrinkage & Leakage Losses:** ${formatCurrency(totalShrinkageLoss + anomalyResult.totalDiscrepancyAmount)}\n` +
          `• **Net Audited Profit:** **${formatCurrency(netProfit)}**`;
      } 
      else {
        aiResponse = `🔍 **Forensic CPA Analysis for ${activeStore.name}:**\n` +
          `Your net audited profit currently stands at **${formatCurrency(netProfit)}** with a gross margin of **${marginPct}%**.\n` +
          `Ask me specific accounting questions such as:\n` +
          `• "Audit my expense burn rate"\n` +
          `• "Check for supplier price variances"\n` +
          `• "Analyze my inventory shrinkage ratio"\n` +
          `• "Show full P&L breakdown"`;
      }

      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 500);
  };

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

  const handleSimulatePOSSale = () => {
    if (userRole === 'INVESTOR') return;
    setIsMenuOpen(false);
    const allVars = activeStore.inventoryGroups.flatMap(g => g.varieties);
    if (allVars.length === 0) {
      setPosNotice(`Please add items to ${activeStore.name} catalog first before running POS sales simulation!`);
      setTimeout(() => setPosNotice(""), 4000);
      return;
    }

    const targetItem = allVars.find(v => v.qty > 0);
    if (!targetItem) {
      setPosNotice("All inventory stock in this store is currently out of stock!");
      setTimeout(() => setPosNotice(""), 4000);
      return;
    }

    setStores(prev => prev.map(s => {
      if (s.id !== activeStoreId) return s;
      return {
        ...s,
        posSalesRevenue: s.posSalesRevenue + targetItem.sellingPrice,
        posSalesCOGS: s.posSalesCOGS + targetItem.costPrice,
        inventoryGroups: s.inventoryGroups.map(g => ({
          ...g,
          varieties: g.varieties.map(v => v.id === targetItem.id ? { ...v, qty: Math.max(0, v.qty - 1) } : v)
        }))
      };
    }));

    setPosNotice(`POS Sale Executed at ${activeStore.name}: 1x ${targetItem.varietyName} sold for ${formatCurrency(targetItem.sellingPrice)}!`);
    setTimeout(() => setPosNotice(""), 4000);
  };

  const handleFileUpload = (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (userRole === 'INVESTOR') return;
    setIsProcessingUpload(true);
    setUploadSuccessMsg("");

    setTimeout(() => {
      const ocrResult = parseReceiptImageText();

      const newReceipt: Receipt = {
        id: `REC-${Math.floor(100 + Math.random() * 900)}`,
        store: ocrResult.storeName,
        date: ocrResult.date,
        total: ocrResult.total,
        status: ocrResult.isDiscrepancy ? 'Discrepancy' : 'Parsed',
        items: ocrResult.itemsCount,
        discrepancyNote: ocrResult.notes
      };

      setStores(prev => prev.map(s => {
        if (s.id !== activeStoreId) return s;
        return { ...s, receipts: [newReceipt, ...s.receipts] };
      }));

      setIsProcessingUpload(false);
      setUploadSuccessMsg(`Receipt parsed & added to ${activeStore.name} P&L!`);
    }, 1200);
  };

  const handleAddInventorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVarietyName || !newBarcode) return;

    const newVariety: ProductVariety = {
      id: `v-${Date.now()}`,
      barcode: newBarcode,
      varietyName: newVarietyName,
      qty: Number(newQty),
      costPrice: Number(newCost),
      sellingPrice: Number(newPrice)
    };

    setStores(prev => prev.map(s => {
      if (s.id !== activeStoreId) return s;
      const groups = [...s.inventoryGroups];
      const gIndex = groups.findIndex(g => g.groupName.toLowerCase() === newGroupName.toLowerCase());
      if (gIndex > -1) {
        groups[gIndex].varieties.push(newVariety);
      } else {
        groups.push({
          id: `grp-${Date.now()}`,
          groupName: newGroupName,
          category: newCategory,
          varieties: [newVariety]
        });
      }
      return { ...s, inventoryGroups: groups };
    }));

    setNewVarietyName("");
    setNewBarcode("");
    setShowAddModal(false);
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseAmt) return;

    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      category: expenseCat,
      amount: Number(expenseAmt),
      date: new Date().toISOString().split('T')[0]
    };

    setStores(prev => prev.map(s => {
      if (s.id !== activeStoreId) return s;
      return { ...s, expenses: [newExp, ...s.expenses] };
    }));

    setShowExpenseModal(false);
  };

  const handleAddShrinkageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalVal = Number(shrinkQty) * Number(shrinkCostVal);

    const newShrink: ShrinkageItem = {
      id: `shk-${Date.now()}`,
      itemName: shrinkName,
      qtyLost: Number(shrinkQty),
      totalValue: totalVal,
      reason: shrinkReason,
      date: new Date().toISOString().split('T')[0]
    };

    setStores(prev => prev.map(s => {
      if (s.id !== activeStoreId) return s;
      return { ...s, shrinkageLogs: [newShrink, ...s.shrinkageLogs] };
    }));

    setShowShrinkageModal(false);
  };

  const handleDeleteVariety = (groupId: string, varietyId: string) => {
    if (userRole === 'INVESTOR') return;
    setStores(prev => prev.map(s => {
      if (s.id !== activeStoreId) return s;
      return {
        ...s,
        inventoryGroups: s.inventoryGroups.map(g => g.id === groupId ? {
          ...g,
          varieties: g.varieties.filter(v => v.id !== varietyId)
        } : g).filter(g => g.varieties.length > 0)
      };
    }));
  };

  const handleExportPDF = () => {
    setIsMenuOpen(false);
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>MY-AUDITOR Executive Audit Report - ${activeStore.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 30px; color: #111; }
            h1 { color: #059669; margin-bottom: 5px; }
            .meta { font-size: 13px; color: #555; margin-bottom: 25px; }
            .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px; }
            .card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; background: #f9fafb; }
            .card h3 { margin: 0 0 5px 0; font-size: 12px; color: #666; text-transform: uppercase; }
            .card p { margin: 0; font-size: 20px; font-weight: bold; color: #111; }
          </style>
        </head>
        <body>
          <h1>MY-AUDITOR Executive Audit Summary</h1>
          <div class="meta">
            <strong>Store:</strong> ${activeStore.name} (${activeStore.type}) | <strong>Location:</strong> ${activeStore.address} | <strong>Role:</strong> ${userRole} | <strong>Date:</strong> ${new Date().toLocaleDateString()}
          </div>
          <div class="grid">
            <div class="card"><h3>Total Revenue</h3><p>${formatCurrency(totalRevenue)}</p></div>
            <div class="card"><h3>Gross Profit</h3><p>${formatCurrency(grossProfit)}</p></div>
            <div class="card"><h3>Total Expenses & Losses</h3><p>${formatCurrency(totalExpenses + totalShrinkageLoss + anomalyResult.totalDiscrepancyAmount)}</p></div>
            <div class="card"><h3>Net Audited Profit</h3><p style="color: ${netProfit >= 0 ? '#059669' : '#dc2626'}">${formatCurrency(netProfit)}</p></div>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const allVarieties = activeStore.inventoryGroups.flatMap(g => g.varieties);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative pb-20">
      
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition cursor-pointer flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="flex items-center gap-2">
              <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-lg sm:text-xl font-black text-white tracking-wider">MY-AUDITOR</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1">
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

            <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${
              userRole === 'INVESTOR' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {userRole}
            </span>
          </div>
        </div>
      </header>

      {/* Hidden File Input for Native Camera Backup */}
      <input 
        id="native-camera-input"
        type="file" 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        onChange={handleFileUpload}
      />

      {/* New Store Branch Creation Modal */}
      {showNewStoreModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Store className="w-4 h-4 text-emerald-400" /> Create New Store Branch
              </h3>
              <button onClick={() => setShowNewStoreModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateNewStore} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Store Branch Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ikeja Branch"
                  value={newStoreNameInput}
                  onChange={e => setNewStoreNameInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Type of Store / Business Category</label>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                  <Tag className="w-4 h-4 text-emerald-400 shrink-0" />
                  <select
                    value={newStoreTypeInput}
                    onChange={e => setNewStoreTypeInput(e.target.value)}
                    className="bg-transparent text-xs text-slate-200 w-full focus:outline-none cursor-pointer"
                  >
                    {STORE_TYPES.map((t, idx) => (
                      <option key={idx} value={t} className="bg-slate-900 text-white">{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Location / Address</label>
                <input
                  type="text"
                  placeholder="e.g. Allen Avenue, Ikeja"
                  value={newStoreLocationInput}
                  onChange={e => setNewStoreLocationInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Create Store Branch
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Live WebRTC Camera Modal */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-slate-950/90 z-50 flex flex-col items-center justify-between p-4 backdrop-blur-md">
          <div className="w-full max-w-md flex justify-between items-center text-white">
            <span className="text-xs font-bold flex items-center gap-2 text-emerald-400">
              <Camera className="w-4 h-4" /> Live AI OCR Camera Scanner
            </span>
            <button onClick={stopLiveCamera} className="p-2 bg-slate-800 rounded-full text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative w-full max-w-md aspect-[3/4] bg-black rounded-3xl overflow-hidden border-2 border-emerald-500/50 shadow-2xl flex items-center justify-center my-auto">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            <div className="absolute inset-8 border-2 border-dashed border-emerald-400/60 rounded-2xl pointer-events-none flex items-center justify-center">
              <span className="text-[10px] text-emerald-300 bg-slate-950/80 px-3 py-1 rounded-full font-semibold">
                Align Receipt Within Frame
              </span>
            </div>
          </div>

          <button
            onClick={capturePhotoAndProcess}
            className="w-full max-w-md py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition cursor-pointer flex items-center justify-center gap-2 mb-4"
          >
            <Camera className="w-5 h-5" /> Capture & Run AI OCR
          </button>
        </div>
      )}

      {/* Add Inventory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" /> Add Product to {activeStore.name}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddInventorySubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Group Name</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Variety Name</label>
                <input
                  type="text"
                  required
                  value={newVarietyName}
                  onChange={e => setNewVarietyName(e.target.value)}
                  placeholder="e.g. Sprite 50cl"
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Barcode</label>
                <input
                  type="text"
                  required
                  value={newBarcode}
                  onChange={e => setNewBarcode(e.target.value)}
                  placeholder="893003"
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={newQty}
                    onChange={e => setNewQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-2 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Cost Price</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={e => setNewCost(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-2 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Selling Price</label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-2 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Save & Add to Catalog
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Log Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Log Expense for {activeStore.name}</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddExpenseSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Category</label>
                <input
                  type="text"
                  value={expenseCat}
                  onChange={e => setExpenseCat(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount</label>
                <input
                  type="number"
                  value={expenseAmt}
                  onChange={e => setExpenseAmt(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Save Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Report Shrinkage Modal */}
      {showShrinkageModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="font-bold text-white text-sm">Report Shrinkage ({activeStore.name})</h3>
              <button onClick={() => setShowShrinkageModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddShrinkageSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Item Name / Reason</label>
                <input
                  type="text"
                  value={shrinkName}
                  onChange={e => setShrinkName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Qty Lost</label>
                  <input
                    type="number"
                    value={shrinkQty}
                    onChange={e => setShrinkQty(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-2 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Unit Value Loss</label>
                  <input
                    type="number"
                    value={shrinkCostVal}
                    onChange={e => setShrinkCostVal(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-2 py-2 text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-rose-500 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Log Shrinkage Loss
              </button>
            </form>
          </div>
        </div>
      )}

      {isMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex">
          <div className="w-80 max-w-[85vw] bg-slate-900 border-r border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <span className="font-black text-white text-lg">Action Hub</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Select Store Branch</p>
                  <button
                    onClick={() => { setIsMenuOpen(false); setShowNewStoreModal(true); }}
                    className="text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Add Branch
                  </button>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <Store className="w-4 h-4 text-emerald-400" />
                    <select 
                      value={activeStoreId}
                      onChange={(e) => setActiveStoreId(e.target.value)}
                      className="bg-transparent text-xs text-slate-200 w-full focus:outline-none cursor-pointer"
                    >
                      {stores.map(s => (
                        <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Access Role</label>
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value as any)}
                      className="bg-transparent text-xs text-emerald-400 font-bold w-full focus:outline-none cursor-pointer"
                    >
                      <option value="ADMIN" className="bg-slate-900 text-white">ADMIN</option>
                      <option value="AUDITOR" className="bg-slate-900 text-white">AUDITOR</option>
                      <option value="INVESTOR" className="bg-slate-900 text-white">INVESTOR (Read-Only Demo)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Actions Grid</p>
                
                {userRole !== 'INVESTOR' ? (
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      type="button"
                      onClick={handleSimulatePOSSale}
                      className="w-full p-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" /> Simulate POS Sale
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIsMenuOpen(false); setShowShrinkageModal(true); }}
                      className="w-full p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                    >
                      <ShieldAlert className="w-4 h-4" /> Report Shrinkage / Theft
                    </button>

                    <button
                      type="button"
                      onClick={() => { setIsMenuOpen(false); setShowExpenseModal(true); }}
                      className="w-full p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-400" /> Log Operational Expense
                    </button>

                    {userRole === 'ADMIN' && (
                      <button
                        type="button"
                        onClick={() => { setIsMenuOpen(false); setShowAddModal(true); }}
                        className="w-full p-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shadow-lg"
                      >
                        <Plus className="w-4 h-4" /> Add Inventory Variety
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs font-semibold flex items-center gap-2">
                    <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Investor Mode: Read-only audit mode active.</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleExportPDF}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Export Executive PDF Report
                </button>
              </div>
            </div>

            <p className="text-[10px] text-slate-500 text-center">MY-AUDITOR v3.4 • Forensic CPA Active</p>
          </div>
          <div className="flex-1" onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Store className="w-6 h-6 text-emerald-400" /> {activeStore.name}
              </h1>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                {activeStore.type}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{activeStore.address}</p>
          </div>

          <button
            onClick={() => setShowNewStoreModal(true)}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Store Branch
          </button>
        </div>

        {userRole === 'INVESTOR' && (
          <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-300 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" /> Investor Mode Active — Viewing {activeStore.name} Data
            </span>
            <span className="text-[10px] bg-amber-500/20 px-2 py-0.5 rounded text-amber-200">Read-Only</span>
          </div>
        )}

        {posNotice && (
          <div className="bg-teal-500/10 border border-teal-500/30 p-3 rounded-xl text-teal-300 text-xs font-bold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 shrink-0" />
            {posNotice}
          </div>
        )}

        {anomalyResult.hasAnomaly && (
          <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-2xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-rose-300">
                  AI Anomaly Alert: {anomalyResult.flaggedItems.length} Supplier Price Spike(s) Flagged
                </p>
                <p className="text-xs text-rose-400/80">
                  Estimated Leakage Deducted from Net Profit: {formatCurrency(anomalyResult.totalDiscrepancyAmount)}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales & Revenue</p>
            <p className="text-2xl sm:text-3xl font-black text-white mt-1">{formatCurrency(totalRevenue)}</p>
            <p className="text-[11px] text-emerald-400 mt-1">POS Sales: {formatCurrency(activeStore.posSalesRevenue)}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Profit</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{formatCurrency(grossProfit)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Margin: {totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0}%</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Expenses & Shrinkage</p>
            <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{formatCurrency(totalExpenses + totalShrinkageLoss + anomalyResult.totalDiscrepancyAmount)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Shrinkage Loss: {formatCurrency(totalShrinkageLoss)}</p>
          </div>
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl border-l-4 border-l-emerald-500">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Net Profit</p>
            <p className={`text-2xl sm:text-3xl font-black mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(netProfit)}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">Real-time audited balance</p>
          </div>
        </div>

        <div className="bg-slate-900/40 border border-slate-800 p-5 sm:p-6 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <LineChart className="w-4 h-4 text-emerald-400" /> Real-Time P&L Trend Chart ({activeStore.name})
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

        {userRole !== 'INVESTOR' && (
          <div className="bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-emerald-400" /> AI OCR Receipt Scanner & Auto-Auditor
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload invoice files or use live camera to parse physical paper receipts into {activeStore.name}.
                </p>
              </div>

              <button
                type="button"
                onClick={startLiveCamera}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 shadow-lg"
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
                  <p className="text-xs text-emerald-400 font-semibold animate-pulse text-center">Processing AI OCR & auditing financial P&L...</p>
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
        )}

        <div className="bg-slate-900/40 border border-slate-800 p-5 sm:p-6 rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">{activeStore.name} Inventory Catalog</h3>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500">{allVarieties.length} Varieties Active</span>
              {userRole === 'ADMIN' && (
                <button
                  type="button"
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Inventory
                </button>
              )}
            </div>
          </div>

          {activeStore.inventoryGroups.length === 0 ? (
            <div className="text-center py-12 bg-slate-950/50 rounded-2xl border border-dashed border-slate-800">
              <p className="text-xs font-bold text-slate-400">No products in {activeStore.name} catalog yet.</p>
              <p className="text-[11px] text-slate-600 mt-1">Click <span className="text-emerald-400 font-semibold">"Add Inventory"</span> or scan a receipt to add items.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeStore.inventoryGroups.map(group => (
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
                          {userRole === 'ADMIN' && <th className="pb-2 text-right">Action</th>}
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
                            {userRole === 'ADMIN' && (
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
                            )}
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

      <div className="fixed bottom-5 right-5 z-40">
        {!isAiChatOpen ? (
          <button
            type="button"
            onClick={() => setIsAiChatOpen(true)}
            className="p-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs transition cursor-pointer"
          >
            <Bot className="w-5 h-5" /> AI Support
          </button>
        ) : (
          <div className="w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[420px] animate-in slide-in-from-bottom duration-200">
            <div className="p-3.5 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">MY-AUDITOR Forensic CPA</span>
              </div>
              <button onClick={() => setIsAiChatOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs whitespace-pre-wrap">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-2.5 rounded-xl ${
                    msg.sender === 'user' ? 'bg-emerald-500 text-slate-950 font-medium' : 'bg-slate-950 border border-slate-800 text-slate-200'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendAiMessage} className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
                placeholder="Ask Forensic CPA anything..."
                className="flex-1 bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
              <button type="submit" className="p-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl transition cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}