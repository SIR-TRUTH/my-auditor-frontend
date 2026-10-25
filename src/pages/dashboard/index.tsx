import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Plus, 
  Building2, 
  Globe, 
  LineChart, 
  ShoppingBag, 
  ShieldAlert, 
  UserCheck, 
  Menu, 
  Bot, 
  Lock, 
  Layers, 
  PieChart, 
  Settings, 
  DollarSign,
  TrendingUp,
  Camera,
  Truck,
  PackagePlus,
  Send,
  X
} from 'lucide-react';

import { nairaToKobo, formatKoboToNaira } from '../../lib/currency';
import { globalInventoryEngine } from '../../lib/inventoryEngine';
import { globalAuditEngine } from '../../lib/auditEngine';
import { generateProfitAndLossReport, generateDailyPandLTrend } from '../../lib/reportsEngine';
import { UserContext, UserRole } from '../../lib/rbacEngine';

// Import all restored professional modules
import SalesModule from '../../components/SalesModule';
import InventoryModule from '../../components/InventoryModule';
import ExpensesModule from '../../components/ExpensesModule';
import PurchasesModule from '../../components/PurchasesModule';
import AuditModule from '../../components/AuditModule';
import OcrScannerModule from '../../components/OcrScannerModule';
import ReportsModule from '../../components/ReportsModule';
import AiAdvisorModule from '../../components/AiAdvisorModule';
import ManagementModule from '../../components/ManagementModule';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBranch, setSelectedBranch] = useState<string>('ALL');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currencyKey, setCurrencyKey] = useState("NGN");
  const [userRole, setUserRole] = useState<UserRole>("ADMIN");
  const [version, setVersion] = useState(0);

  const currentUser: UserContext = {
    userId: 'usr-current',
    businessId: 'biz-1',
    branchId: selectedBranch === 'ALL' ? 'branch-main' : selectedBranch,
    role: userRole,
  };

  useEffect(() => {
    try {
      if (!globalInventoryEngine.getProductState('prod-1')) {
        globalInventoryEngine.registerProduct('prod-1', 'Coaster Biscuits', 100, nairaToKobo(250));
        setVersion(v => v + 1);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // AI Chat Drawer State
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your MY-AUDITOR AI Forensic CPA. I am monitoring your branch ledger in real-time.' }
  ]);
  const [userQuery, setUserQuery] = useState("");

  let pnlReport = { totalRevenueKobo: 0n, totalCogsKobo: 0n, grossProfitKobo: 0n, operatingExpensesKobo: 0n, recognizedLossesKobo: 0n, netProfitKobo: 0n };
  let dailyTrend: any[] = [];
  let totalExposureKobo = 0n;
  let auditFindings: any[] = [];
  let productState: any = null;

  try {
    pnlReport = generateProfitAndLossReport();
    dailyTrend = generateDailyPandLTrend() || [];
    totalExposureKobo = globalAuditEngine.getTotalPotentialExposureKobo();
    auditFindings = globalAuditEngine.getFindings() || [];
    productState = globalInventoryEngine.getProductState('prod-1');
  } catch (err) {
    console.error(err);
  }

  const formatMoney = (koboVal: bigint) => formatKoboToNaira(koboVal, currencyKey === 'USD' ? '$' : '₦');

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const query = userQuery;
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setUserQuery("");

    setTimeout(() => {
      let aiResponse = `📊 **Forensic CPA Analysis (${userRole} View):**\n` +
        `• Revenue: ${formatMoney(pnlReport.totalRevenueKobo)}\n` +
        `• Net Profit: ${formatMoney(pnlReport.netProfitKobo)}\n` +
        `• Potential Audit Exposure: ${formatMoney(totalExposureKobo)}`;
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
          {/* OVERVIEW */}
          <div className="space-y-1">
            {isSidebarOpen && <p className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Overview</p>}
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'dashboard' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <LineChart className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Executive Dashboard</span>}
            </button>
          </div>

          {/* OPERATIONS */}
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
            <button onClick={() => setActiveTab('purchases')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'purchases' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Truck className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Purchases & Suppliers</span>}
            </button>
          </div>

          {/* AUDIT & COMPLIANCE */}
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

          {/* INTELLIGENCE & MANAGEMENT */}
          <div className="space-y-1">
            {isSidebarOpen && <p className="px-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">Intelligence & Mgmt</p>}
            <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'reports' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <PieChart className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Reports & P&L</span>}
            </button>
            <button onClick={() => setActiveTab('ai_advisor')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'ai_advisor' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Bot className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>AI Forensic CPA</span>}
            </button>
            <button onClick={() => setActiveTab('management')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer ${activeTab === 'management' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Settings className="w-4 h-4 shrink-0" />
              {isSidebarOpen && <span>Settings & RBAC</span>}
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 text-center font-mono">
          {isSidebarOpen ? 'Enterprise Ledger v4.0' : 'v4.0'}
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

        {userRole === 'INVESTOR' && (
          <div className="mx-6 mt-4 bg-purple-500/10 border border-purple-500/30 p-3 rounded-xl text-purple-300 text-xs font-bold flex items-center gap-2">
            <Lock className="w-4 h-4 shrink-0" />
            Investor Mode Active: Operational write permissions are restricted. You are viewing audited P&L statements and exposure reports.
          </div>
        )}

        {/* View Switcher */}
        <main className="p-6 space-y-6 flex-1">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
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

              <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Continuous Audit Centre (Isolated from P&L)</p>
                  <p className="text-lg font-black text-white mt-0.5">Potential Stock Exposure: {formatMoney(totalExposureKobo)}</p>
                </div>
                <button onClick={() => setActiveTab('audit')} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer hover:bg-amber-400">
                  View Audit Findings
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sales' && <SalesModule currentUser={currentUser} currencyKey={currencyKey} onTransactionRecorded={() => setVersion(v => v + 1)} />}
          {activeTab === 'inventory' && <InventoryModule currentUser={currentUser} currencyKey={currencyKey} onInventoryUpdated={() => setVersion(v => v + 1)} />}
          {activeTab === 'expenses' && <ExpensesModule currentUser={currentUser} currencyKey={currencyKey} onExpenseRecorded={() => setVersion(v => v + 1)} />}
          {activeTab === 'purchases' && <PurchasesModule currentUser={currentUser} currencyKey={currencyKey} onPurchaseRecorded={() => setVersion(v => v + 1)} />}
          {activeTab === 'audit' && <AuditModule currentUser={currentUser} currencyKey={currencyKey} onAuditUpdated={() => setVersion(v => v + 1)} />}
          {activeTab === 'scanner' && <OcrScannerModule currentUser={currentUser} currencyKey={currencyKey} onDocumentPosted={() => setVersion(v => v + 1)} />}
          {activeTab === 'reports' && <ReportsModule currentUser={currentUser} currencyKey={currencyKey} />}
          {activeTab === 'ai_advisor' && <AiAdvisorModule currentUser={currentUser} currencyKey={currencyKey} />}
          {activeTab === 'management' && <ManagementModule currentUser={currentUser} currencyKey={currencyKey} onSettingsUpdated={() => setVersion(v => v + 1)} />}
        </main>
      </div>

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