import React, { useState, useEffect } from 'react';
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
  Tag,
  Briefcase,
  Eye,
  EyeOff,
  Layers,
  PieChart,
  Settings,
  Users,
  CreditCard,
  ArrowUpRight,
  TrendingUp,
  FileCheck,
  HelpCircle,
  QrCode,
  PackagePlus
} from 'lucide-react';

import { nairaToKobo, formatKoboToNaira } from '../../lib/currency';
import { globalAccountingEngine } from '../../lib/accountingEngine';
import { globalInventoryEngine } from '../../lib/inventoryEngine';
import { globalAuditEngine } from '../../lib/auditEngine';
import { generateProfitAndLossReport, generateDailyPandLTrend } from '../../lib/reportsEngine';
import { executePosSale, executeOperatingExpense, reportStockDiscrepancy } from '../../lib/verticalSlice';
import { parseReceiptImageText, postParsedReceiptToLedger } from "../../lib/ocrParser";
import { UserContext, enforcePermission, UserRole } from '../../lib/rbacEngine';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'sales' | 'inventory' | 'expenses' | 'audit' | 'scanner' | 'reports'>('dashboard');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currencyKey, setCurrencyKey] = useState("NGN");
  const [userRole, setUserRole] = useState<UserRole>("ADMIN");
  const [ledgerVersion, setLedgerVersion] = useState(0);
  const [notice, setNotice] = useState("");

  const currentUser: UserContext = {
    userId: 'usr-current',
    businessId: 'biz-1',
    branchId: selectedBranch === 'ALL' ? 'branch-main' : selectedBranch,
    role: userRole,
  };

  // Initialize Default Product on load if empty
  useEffect(() => {
    if (globalInventoryEngine.getProductState('prod-1') === undefined) {
      globalInventoryEngine.registerProduct('prod-1', 'Coaster Biscuits', 100, nairaToKobo(250));
      setLedgerVersion(v => v + 1);
    }
  }, []);

  // Action Modals State
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showDiscrepancyModal, setShowDiscrepancyModal] = useState(false);
  const [showOcrModal, setShowOcrModal] = useState(false);

  // Form inputs
  const [saleQty, setSaleQty] = useState(1);
  const [salePriceNaira, setSalePriceNaira] = useState(35000);
  const [expenseCat, setExpenseCat] = useState<'FUEL' | 'GENERAL'>('FUEL');
  const [expenseAmt, setExpenseAmt] = useState(15000);
  
  const [newProdName, setNewProdName] = useState('');
  const [newProdQty, setNewProdQty] = useState(50);
  const [newProdCost, setNewProdCost] = useState(20000);

  const [discrepancyQty, setDiscrepancyQty] = useState(2);

  // OCR & Camera Scan State
  const [ocrInputText, setOcrInputText] = useState("SUPER STORE NIGERIA\n2x Coaster Biscuits @ 35000\nTOTAL: 70000");
  const [ocrReviewData, setOcrReviewData] = useState<any | null>(null);
  const [scanningMode, setScanningMode] = useState<'text' | 'camera' | 'upload'>('text');

  // AI Chat State
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your MY-AUDITOR AI Forensic CPA. I am monitoring your branch ledger in real-time. Ask me about your P&L, COGS, expenses, or audit exposures.' }
  ]);
  const [userQuery, setUserQuery] = useState("");

  // Financial Reports
  const pnlReport = generateProfitAndLossReport();
  const dailyTrend = generateDailyPandLTrend();
  const totalExposureKobo = globalAuditEngine.getTotalPotentialExposureKobo();
  const auditFindings = globalAuditEngine.getFindings();
  const productState = globalInventoryEngine.getProductState('prod-1');

  const formatMoney = (koboVal: bigint) => formatKoboToNaira(koboVal, currencyKey === 'USD' ? '$' : '₦');

  // Handlers
  const handleRecordSaleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      enforcePermission(currentUser, 'POST_TRANSACTION');
      executePosSale({
        businessId: currentUser.businessId,
        branchId: currentUser.branchId,
        productId: 'prod-1',
        quantity: Number(saleQty),
        unitPriceNaira: Number(salePriceNaira)
      });
      setLedgerVersion(v => v + 1);
      setShowSaleModal(false);
      setNotice(`Sale successfully recorded and posted to double-entry ledger.`);
      setTimeout(() => setNotice(""), 4000);
    } catch (err: any) {
      alert(`RBAC Blocked: ${err.message}`);
    }
  };

  const handleRecordExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      enforcePermission(currentUser, 'POST_TRANSACTION');
      executeOperatingExpense({
        businessId: currentUser.businessId,
        branchId: currentUser.branchId,
        category: expenseCat,
        amountNaira: Number(expenseAmt)
      });
      setLedgerVersion(v => v + 1);
      setShowExpenseModal(false);
      setNotice(`Operating expense posted to ledger.`);
      setTimeout(() => setNotice(""), 4000);
    } catch (err: any) {
      alert(`RBAC Blocked: ${err.message}`);
    }
  };

  const handleAddInventorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      enforcePermission(currentUser, 'POST_TRANSACTION');
      if (!newProdName.trim()) return;
      const prodId = `prod-${Date.now()}`;
      globalInventoryEngine.registerProduct(prodId, newProdName, Number(newProdQty), nairaToKobo(Number(newProdCost)));
      setLedgerVersion(v => v + 1);
      setShowInventoryModal(false);
      setNewProdName('');
      setNotice(`New inventory item registered with WAC tracking.`);
      setTimeout(() => setNotice(""), 4000);
    } catch (err: any) {
      alert(`RBAC Blocked: ${err.message}`);
    }
  };

  const handleDiscrepancySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      enforcePermission(currentUser, 'POST_TRANSACTION');
      reportStockDiscrepancy({
        businessId: currentUser.businessId,
        branchId: currentUser.branchId,
        productId: 'prod-1',
        expectedQty: productState?.currentStock || 100,
        actualQty: Math.max(0, (productState?.currentStock || 100) - Number(discrepancyQty))
      });
      setLedgerVersion(v => v + 1);
      setShowDiscrepancyModal(false);
      setNotice(`Stock discrepancy logged to Continuous Audit Centre (Isolated from P&L).`);
      setTimeout(() => setNotice(""), 5000);
    } catch (err: any) {
      alert(`RBAC Blocked: ${err.message}`);
    }
  };

  const handleRunOcrScan = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseReceiptImageText(ocrInputText);
    setOcrReviewData(parsed);
  };

  const handleFileUploadSimulation = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      const simulatedText = `UPLOADED FILE: ${fileName}\nVendor: Ikeja Mega Store\n3x Premium Fuel @ 5000\nTOTAL: 15000`;
      setOcrInputText(simulatedText);
      const parsed = parseReceiptImageText(simulatedText);
      setOcrReviewData(parsed);
    }
  };

  const handleConfirmOcrPost = () => {
    try {
      enforcePermission(currentUser, 'POST_TRANSACTION');
      if (!ocrReviewData) return;
      postParsedReceiptToLedger({
        businessId: currentUser.businessId,
        branchId: currentUser.branchId,
        rawText: ocrInputText
      });
      setLedgerVersion(v => v + 1);
      setOcrReviewData(null);
      setShowOcrModal(false);
      setNotice(`Document verified and posted to ledger successfully.`);
      setTimeout(() => setNotice(""), 4000);
    } catch (err: any) {
      alert(`RBAC Blocked: ${err.message}`);
    }
  };

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const query = userQuery;
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setUserQuery("");

    setTimeout(() => {
      let aiResponse = `📊 **Forensic CPA Analysis (${userRole} View - Branch: ${selectedBranch}):**\n` +
        `• **Revenue:** ${formatMoney(pnlReport.totalRevenueKobo)}\n` +
        `• **COGS:** ${formatMoney(pnlReport.totalCogsKobo)}\n` +
        `• **Gross Profit:** ${formatMoney(pnlReport.grossProfitKobo)}\n` +
        `• **Operating Expenses:** ${formatMoney(pnlReport.operatingExpensesKobo)}\n` +
        `• **Net Audited Profit:** ${formatMoney(pnlReport.netProfitKobo)}\n` +
        `• **Potential Audit Exposure (Isolated):** ${formatMoney(totalExposureKobo)}`;
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* Sidebar Navigation */}
      <aside className={`w-64 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-30 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          {isSidebarOpen && <span className="font-black text-white tracking-wider text-base">MY-AUDITOR</span>}
        </div>

        <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto text-xs font-semibold">
          <div className="space-y-1">
            {isSidebarOpen && <p className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Overview</p>}
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <LineChart className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Executive Dashboard</span>}
            </button>
          </div>

          <div className="space-y-1">
            {isSidebarOpen && <p className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Operations</p>}
            <button onClick={() => setActiveTab('sales')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'sales' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <ShoppingBag className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Sales & Revenue</span>}
            </button>
            <button onClick={() => setActiveTab('inventory')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'inventory' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Layers className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Inventory & WAC</span>}
            </button>
            <button onClick={() => setActiveTab('expenses')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'expenses' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <DollarSign className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Expenses</span>}
            </button>
          </div>

          <div className="space-y-1">
            {isSidebarOpen && <p className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Audit & Compliance</p>}
            <button onClick={() => setActiveTab('audit')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'audit' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <ShieldAlert className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Continuous Audit Centre</span>}
            </button>
            <button onClick={() => setActiveTab('scanner')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'scanner' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Camera className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>AI OCR Scanner</span>}
            </button>
          </div>

          <div className="space-y-1">
            {isSidebarOpen && <p className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Intelligence</p>}
            <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'reports' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <PieChart className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Reports & P&L</span>}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="text-[10px] text-slate-500 text-center font-mono">
            {isSidebarOpen ? 'Enterprise Ledger v4.0' : 'v4.0'}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition cursor-pointer">
              <Menu className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-900">All Branches (Consolidated)</option>
                <option value="branch-main" className="bg-slate-900">Main Flagship Store</option>
                <option value="branch-ikeja" className="bg-slate-900">Ikeja Outlet</option>
                <option value="branch-abuja" className="bg-slate-900">Abuja Branch</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={currencyKey}
                onChange={(e) => setCurrencyKey(e.target.value)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer font-bold"
              >
                <option value="NGN" className="bg-slate-900">₦ NGN</option>
                <option value="USD" className="bg-slate-900">$ USD</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-800 border border-emerald-500/30 rounded-xl px-2.5 py-1">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as UserRole)}
                className="bg-transparent text-xs text-emerald-300 font-bold focus:outline-none cursor-pointer"
              >
                <option value="ADMIN" className="bg-slate-900 text-white">ADMIN (Full Access)</option>
                <option value="AUDITOR" className="bg-slate-900 text-white">AUDITOR (Read & Audit)</option>
                <option value="INVESTOR" className="bg-slate-900 text-white">INVESTOR (Read-Only)</option>
              </select>
            </div>
          </div>
        </header>

        {notice && (
          <div className="mx-6 mt-4 bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-xl text-cyan-300 text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            {notice}
          </div>
        )}

        {userRole === 'INVESTOR' && (
          <div className="mx-6 mt-4 bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl text-purple-300 text-xs font-bold flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            Investor Mode Active: Operational write permissions are restricted. You are viewing audited P&L statements and exposure reports.
          </div>
        )}

        {/* Main Content Views */}
        <main className="p-6 space-y-6 flex-1">
          
          {/* ACTION HUB TOOLBAR */}
          <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Enterprise Action Hub</h2>
              <p className="text-xs text-slate-400">Perform verified accounting entries and audits for branch: <span className="text-emerald-400 font-bold">{selectedBranch}</span></p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowSaleModal(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${userRole === 'INVESTOR' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'}`}
              >
                <Plus className="w-3.5 h-3.5" /> Record Sale
              </button>
              <button
                onClick={() => setShowExpenseModal(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${userRole === 'INVESTOR' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'}`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Record Expense
              </button>
              <button
                onClick={() => setShowInventoryModal(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${userRole === 'INVESTOR' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'}`}
              >
                <PackagePlus className="w-3.5 h-3.5 text-teal-400" /> Add Inventory
              </button>
              <button
                onClick={() => setShowDiscrepancyModal(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${userRole === 'INVESTOR' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30'}`}
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Report Discrepancy
              </button>
              <button
                onClick={() => setShowOcrModal(true)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${userRole === 'INVESTOR' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'}`}
              >
                <Camera className="w-3.5 h-3.5" /> AI OCR / Camera Scanner
              </button>
            </div>
          </div>

          {/* TAB: DASHBOARD / OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Financial Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales & Revenue</p>
                  <p className="text-2xl sm:text-3xl font-black text-white mt-1">{formatMoney(pnlReport.totalRevenueKobo)}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Profit</p>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{formatMoney(pnlReport.grossProfitKobo)}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Operating Expenses</p>
                  <p className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">{formatMoney(pnlReport.operatingExpensesKobo)}</p>
                </div>
                <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl border-l-4 border-l-emerald-500">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Net Audited Profit</p>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{formatMoney(pnlReport.netProfitKobo)}</p>
                </div>
              </div>

              {/* LIVE P&L TREND CHART */}
              <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" /> Real-Time P&L Trend (Actual Transaction Dates)
                  </h3>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2.5 py-1 rounded-lg">Live Aggregation</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-7 gap-3">
                  {dailyTrend.map((day, idx) => (
                    <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                      <p className="text-[10px] text-slate-400 font-mono">{day.date}</p>
                      <p className="text-xs font-bold text-emerald-400">{formatMoney(day.revenueKobo)}</p>
                      <p className="text-[10px] text-rose-400">Exp: {formatMoney(day.expensesKobo)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Continuous Audit Centre Isolated Banner */}
              <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Continuous Audit Centre (Isolated from P&L)</p>
                  <p className="text-lg font-black text-white mt-0.5">Potential Stock Exposure: {formatMoney(totalExposureKobo)}</p>
                  <p className="text-xs text-slate-400 mt-1">{auditFindings.length} open discrepancy findings registered across branches.</p>
                </div>
                <button
                  onClick={() => setActiveTab('audit')}
                  className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer hover:bg-amber-400"
                >
                  View Audit Findings
                </button>
              </div>

              {/* Verified Inventory Engine Summary */}
              <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Inventory & WAC Valuation</h3>
                  <button onClick={() => setActiveTab('inventory')} className="text-xs text-emerald-400 hover:underline">View All Inventory →</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400">Primary Catalog Item</p>
                    <p className="font-bold text-white text-sm mt-1">{productState?.productName || 'Coaster Biscuits'}</p>
                    <p className="text-xs text-emerald-400 mt-1">{productState?.currentStock || 100} Units Available</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400">Weighted Average Cost (WAC)</p>
                    <p className="font-bold text-white text-sm mt-1">{formatMoney(productState?.weightedAverageCostKobo || nairaToKobo(250))}</p>
                    <p className="text-xs text-slate-500 mt-1">Movement-tracked</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-xs text-slate-400">Total Inventory Asset Value</p>
                    <p className="font-bold text-emerald-400 text-sm mt-1">{formatMoney((productState?.currentStock || 100n) * (productState?.weightedAverageCostKobo || nairaToKobo(250)))}</p>
                    <p className="text-xs text-slate-500 mt-1">Integer minor units enforced</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: SALES & REVENUE */}
          {activeTab === 'sales' && (
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">Sales & Revenue Ledger</h3>
                  <p className="text-xs text-slate-400">All POS and cash transactions posted with verified double-entry accounting.</p>
                </div>
                <button onClick={() => setShowSaleModal(true)} className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">
                  + Record New Sale
                </button>
              </div>
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
                Total Revenue Recorded: <span className="text-white font-bold text-sm">{formatMoney(pnlReport.totalRevenueKobo)}</span>
              </div>
            </div>
          )}

          {/* TAB: INVENTORY & WAC */}
          {activeTab === 'inventory' && (
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">Inventory & Weighted Average Costing (WAC)</h3>
                  <p className="text-xs text-slate-400">Manage SKUs, stock levels, and WAC valuation.</p>
                </div>
                <button onClick={() => setShowInventoryModal(true)} className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">
                  + Add Inventory Item
                </button>
              </div>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 space-y-3">
                <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                  <span className="font-bold text-slate-300">Product Name</span>
                  <span className="font-bold text-slate-300">Current Stock</span>
                  <span className="font-bold text-slate-300">WAC Unit Cost</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white font-medium">{productState?.productName || 'Coaster Biscuits'}</span>
                  <span className="text-emerald-400 font-bold">{productState?.currentStock || 100} units</span>
                  <span className="text-slate-300">{formatMoney(productState?.weightedAverageCostKobo || nairaToKobo(250))}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: EXPENSES */}
          {activeTab === 'expenses' && (
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white text-base">Operating Expenses Ledger</h3>
                <button onClick={() => setShowExpenseModal(true)} className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">
                  + Log Expense
                </button>
              </div>
              <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
                Total Operating Expenses: <span className="text-rose-400 font-bold text-sm">{formatMoney(pnlReport.operatingExpensesKobo)}</span>
              </div>
            </div>
          )}

          {/* TAB: CONTINUOUS AUDIT CENTRE */}
          {activeTab === 'audit' && (
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white text-base">Continuous Audit Centre</h3>
                  <p className="text-xs text-slate-400">Isolated operational discrepancies and shrinkage exposure (does not modify Net Profit).</p>
                </div>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-xl font-bold">
                  Total Exposure: {formatMoney(totalExposureKobo)}
                </span>
              </div>
              <div className="space-y-2">
                {auditFindings.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs">
                    No active audit discrepancies found. All stock movements are reconciled.
                  </div>
                ) : (
                  auditFindings.map(f => (
                    <div key={f.id} className="p-4 bg-slate-950 rounded-xl border border-amber-500/20 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-amber-300">{f.discrepancyType}</p>
                        <p className="text-slate-400 mt-0.5">{f.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{formatMoney(f.potentialExposureKobo)}</p>
                        <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-md font-bold">{f.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: AI OCR SCANNER */}
          {activeTab === 'scanner' && (
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-white text-base">AI OCR Receipt, Invoice & Camera Scanner</h3>
              <p className="text-xs text-slate-400">Upload documents, take pictures with your camera, or scan receipts for intelligent review before posting.</p>
              
              <div className="flex gap-2">
                <button onClick={() => setScanningMode('text')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${scanningMode === 'text' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Text Input</button>
                <button onClick={() => setScanningMode('upload')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${scanningMode === 'upload' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Upload File / Image</button>
                <button onClick={() => setScanningMode('camera')} className={`px-3 py-1.5 rounded-xl text-xs font-bold ${scanningMode === 'camera' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>Camera / QR Capture</button>
              </div>

              {scanningMode === 'text' && (
                <form onSubmit={handleRunOcrScan} className="space-y-3 max-w-lg">
                  <textarea rows={4} value={ocrInputText} onChange={e => setOcrInputText(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-3 text-white focus:outline-none" />
                  <button type="submit" className="py-2.5 px-4 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">Classify & Review Document</button>
                </form>
              )}

              {scanningMode === 'upload' && (
                <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 border-dashed text-center space-y-3 max-w-lg">
                  <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-bold">Select PDF, PNG, or JPEG receipt/invoice</p>
                  <input type="file" accept="image/*,.pdf" onChange={handleFileUploadSimulation} className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer" />
                </div>
              )}

              {scanningMode === 'camera' && (
                <div className="p-6 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-3 max-w-lg">
                  <Camera className="w-10 h-10 text-cyan-400 mx-auto animate-pulse" />
                  <p className="text-xs text-white font-bold">Live Camera / QR Code Scanner Active</p>
                  <p className="text-[10px] text-slate-400">Position receipt or QR barcode within frame to capture.</p>
                  <button onClick={() => {
                    const sample = "CAMERA CAPTURE: POS RECEIPT\n4x Premium Drink @ 1250\nTOTAL: 5000";
                    setOcrInputText(sample);
                    setOcrReviewData(parseReceiptImageText(sample));
                  }} className="px-4 py-2 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">
                    Capture Sample Receipt Frame
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB: REPORTS */}
          {activeTab === 'reports' && (
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-bold text-white text-base">Audited Profit & Loss Statement</h3>
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-5 space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Total Revenue</span>
                  <span className="font-bold text-white">{formatMoney(pnlReport.totalRevenueKobo)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Cost of Goods Sold (COGS)</span>
                  <span className="font-bold text-rose-400">-{formatMoney(pnlReport.totalCogsKobo)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800 font-bold text-sm">
                  <span className="text-slate-200">Gross Profit</span>
                  <span className="text-emerald-400">{formatMoney(pnlReport.grossProfitKobo)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400">Operating Expenses</span>
                  <span className="font-bold text-rose-400">-{formatMoney(pnlReport.operatingExpensesKobo)}</span>
                </div>
                <div className="flex justify-between py-3 font-black text-base border-t border-slate-700">
                  <span className="text-white">Net Audited Profit</span>
                  <span className="text-emerald-400">{formatMoney(pnlReport.netProfitKobo)}</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* RECORD SALE MODAL */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center"><h3 className="font-bold text-white text-sm">Record Sale (POS / Cash)</h3><button onClick={() => setShowSaleModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button></div>
            <form onSubmit={handleRecordSaleSubmit} className="space-y-3">
              <div><label className="text-xs text-slate-400 block mb-1">Quantity</label><input type="number" value={saleQty} onChange={e => setSaleQty(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white" /></div>
              <div><label className="text-xs text-slate-400 block mb-1">Unit Price (₦)</label><input type="number" value={salePriceNaira} onChange={e => setSalePriceNaira(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white" /></div>
              <button type="submit" className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">Post Sale to Ledger</button>
            </form>
          </div>
        </div>
      )}

      {/* RECORD EXPENSE MODAL */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center"><h3 className="font-bold text-white text-sm">Record Operating Expense</h3><button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button></div>
            <form onSubmit={handleRecordExpenseSubmit} className="space-y-3">
              <div><label className="text-xs text-slate-400 block mb-1">Amount (₦)</label><input type="number" value={expenseAmt} onChange={e => setExpenseAmt(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white" /></div>
              <button type="submit" className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">Post Expense Journal</button>
            </form>
          </div>
        </div>
      )}

      {/* ADD INVENTORY MODAL */}
      {showInventoryModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center"><h3 className="font-bold text-white text-sm">Add New Inventory Item</h3><button onClick={() => setShowInventoryModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button></div>
            <form onSubmit={handleAddInventorySubmit} className="space-y-3">
              <div><label className="text-xs text-slate-400 block mb-1">Product Name</label><input type="text" value={newProdName} onChange={e => setNewProdName(e.target.value)} placeholder="e.g. Premium Motor Spirit" className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white" required /></div>
              <div><label className="text-xs text-slate-400 block mb-1">Initial Quantity</label><input type="number" value={newProdQty} onChange={e => setNewProdQty(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white" /></div>
              <div><label className="text-xs text-slate-400 block mb-1">Cost Price (₦)</label><input type="number" value={newProdCost} onChange={e => setNewProdCost(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white" /></div>
              <button type="submit" className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">Register Inventory SKU</button>
            </form>
          </div>
        </div>
      )}

      {/* REPORT DISCREPANCY MODAL */}
      {showDiscrepancyModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center"><h3 className="font-bold text-white text-sm">Report Stock Discrepancy</h3><button onClick={() => setShowDiscrepancyModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button></div>
            <form onSubmit={handleDiscrepancySubmit} className="space-y-3">
              <div><label className="text-xs text-slate-400 block mb-1">Missing Units</label><input type="number" value={discrepancyQty} onChange={e => setDiscrepancyQty(Number(e.target.value))} className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white" /></div>
              <button type="submit" className="w-full py-2.5 bg-rose-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">Create Audit Finding</button>
            </form>
          </div>
        </div>
      )}

      {/* OCR REVIEW MODAL */}
      {showOcrModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-sm">AI OCR Document Review & Post</h3>
              <button onClick={() => setShowOcrModal(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            {!ocrReviewData ? (
              <form onSubmit={handleRunOcrScan} className="space-y-3">
                <textarea rows={3} value={ocrInputText} onChange={e => setOcrInputText(e.target.value)} className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-3 text-white" />
                <button type="submit" className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">Scan & Classify</button>
              </form>
            ) : (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <p className="text-cyan-400 font-bold">Detected Classification: {ocrReviewData.classification}</p>
                  <p className="text-white">Vendor: {ocrReviewData.vendorName}</p>
                  <p className="text-white">Total Amount: ₦{ocrReviewData.totalAmountNaira.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleConfirmOcrPost} className="flex-1 py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl cursor-pointer">Confirm & Post</button>
                  <button onClick={() => setOcrReviewData(null)} className="py-2.5 px-4 bg-slate-800 text-slate-300 rounded-xl cursor-pointer">Edit</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Forensic CPA Floating Widget */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isAiChatOpen ? (
          <button onClick={() => setIsAiChatOpen(true)} className="p-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs cursor-pointer">
            <Bot className="w-5 h-5" /> AI Forensic CPA
          </button>
        ) : (
          <div className="w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden h-[420px]">
            <div className="p-3.5 bg-slate-800 border-b border-slate-700 flex justify-between items-center">
              <span className="text-xs font-bold text-white">MY-AUDITOR AI Forensic CPA</span>
              <button onClick={() => setIsAiChatOpen(false)} className="text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto space-y-3 text-xs whitespace-pre-wrap">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-2.5 rounded-xl ${msg.sender === 'user' ? 'bg-emerald-500 text-slate-950 font-medium' : 'bg-slate-950 border border-slate-800 text-slate-200'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendAiMessage} className="p-2.5 bg-slate-950 border-t border-slate-800 flex gap-2">
              <input type="text" value={userQuery} onChange={e => setUserQuery(e.target.value)} placeholder="Ask Forensic CPA anything..." className="flex-1 bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none" />
              <button type="submit" className="p-2 bg-emerald-500 text-slate-950 rounded-xl cursor-pointer"><Send className="w-3.5 h-3.5" /></button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}