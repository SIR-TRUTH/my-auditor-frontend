import React, { useState, useRef, useEffect } from 'react';
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
  EyeOff
} from 'lucide-react';

import { nairaToKobo, formatKoboToNaira, koboToNaira } from '../../lib/currency';
import { globalAccountingEngine } from '../../lib/accountingEngine';
import { globalInventoryEngine } from '../../lib/inventoryEngine';
import { globalAuditEngine } from '../../lib/auditEngine';
import { generateProfitAndLossReport, generateDailyPandLTrend } from '../../lib/reportsEngine';
import { executePosSale, executeOperatingExpense, reportStockDiscrepancy, authorizeStockLossWriteOff } from '../../lib/verticalSlice';
import { parseReceiptImageText, postParsedReceiptToLedger } from "../../lib/ocrParser";

const CURRENCIES: Record<string, { code: string; symbol: string; rate: number }> = {
  NGN: { code: 'NGN', symbol: '₦', rate: 1 },
  USD: { code: 'USD', symbol: '$', rate: 1500 },
};

const STORE_TYPES = [
  "Retail Supermarket & Provisions",
  "Real Estate & Property Management",
  "Oil & Gas / Energy Downstream",
  "Petrol Station / Filling Station ⛽",
  "Custom Business Niche (Specify below)"
];

export default function DashboardPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currencyKey, setCurrencyKey] = useState("NGN");
  const [userRole, setUserRole] = useState<'ADMIN' | 'AUDITOR' | 'INVESTOR'>("ADMIN");

  // Force state refresh helper for ledger updates
  const [ledgerVersion, setLedgerVersion] = useState(0);

  // Initialize Engines on First Load
  useEffect(() => {
    globalAccountingEngine.clear();
    globalInventoryEngine.clear();
    globalAuditEngine.clear();

    // Register initial deterministic product
    globalInventoryEngine.registerProduct('prod-1', 'Coaster Biscuits', 100, nairaToKobo(250));
    setLedgerVersion(v => v + 1);
  }, []);

  // Modals state
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showShrinkageModal, setShowShrinkageModal] = useState(false);
  const [showOcrModal, setShowOcrModal] = useState(false);
  
  const [expenseCat, setExpenseCat] = useState<'FUEL' | 'GENERAL'>('FUEL');
  const [expenseAmt, setExpenseAmt] = useState(500);

  const [shrinkQty, setShrinkQty] = useState(3);
  const [posNotice, setPosNotice] = useState("");

  // OCR Upload State
  const [ocrRawText, setOcrRawText] = useState("SUPER STORE NIGERIA\n2x Diesel Fuel @ 750\nTOTAL: 1500");
  const [ocrNotice, setOcrNotice] = useState("");

  // Chat State
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    { sender: 'ai', text: 'Hello! I am your MY-AUDITOR AI Forensic CPA. I am monitoring your ledger in real-time. Ask me about your P&L, COGS, expenses, or inventory shrinkage.' }
  ]);
  const [userQuery, setUserQuery] = useState("");

  // Fetch deterministic reports from engines
  const pnlReport = generateProfitAndLossReport();
  const totalExposureKobo = globalAuditEngine.getTotalPotentialExposureKobo();
  const productState = globalInventoryEngine.getProductState('prod-1');

  const formatMoney = (koboVal: bigint) => formatKoboToNaira(koboVal, currencyKey === 'USD' ? '$' : '₦');

  const handleSimulatePOSSale = () => {
    if (userRole === 'INVESTOR') return;
    try {
      executePosSale({
        businessId: 'biz-1',
        branchId: 'branch-main',
        productId: 'prod-1',
        quantity: 1,
        unitPriceNaira: 350
      });
      setLedgerVersion(v => v + 1);
      setPosNotice(`POS Sale Executed: 1x Coaster Biscuits sold for ₦350.00! Ledger updated deterministically.`);
      setTimeout(() => setPosNotice(""), 4000);
    } catch (err: any) {
      setPosNotice(`Error: ${err.message}`);
      setTimeout(() => setPosNotice(""), 4000);
    }
  };

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeOperatingExpense({
      businessId: 'biz-1',
      branchId: 'branch-main',
      category: expenseCat,
      amountNaira: Number(expenseAmt)
    });
    setLedgerVersion(v => v + 1);
    setShowExpenseModal(false);
  };

  const handleAddShrinkageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productState) return;
    const expected = productState.currentStock;
    const actual = Math.max(0, expected - Number(shrinkQty));

    reportStockDiscrepancy({
      businessId: 'biz-1',
      branchId: 'branch-main',
      productId: 'prod-1',
      expectedQty: expected,
      actualQty: actual
    });
    setLedgerVersion(v => v + 1);
    setShowShrinkageModal(false);
  };

  const handleOcrSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsed = postParsedReceiptToLedger({
        businessId: 'biz-1',
        branchId: 'branch-main',
        rawText: ocrRawText
      });
      setLedgerVersion(v => v + 1);
      setOcrNotice(`OCR Scanned & Posted: ${parsed.vendorName} (₦${parsed.totalAmountNaira.toLocaleString()}) posted to ledger!`);
      setShowOcrModal(false);
      setTimeout(() => setOcrNotice(""), 5000);
    } catch (err: any) {
      alert(`OCR Error: ${err.message}`);
    }
  };

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userQuery.trim()) return;
    const query = userQuery;
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setUserQuery("");

    setTimeout(() => {
      let aiResponse = `📊 **Forensic CPA Analysis:**\n` +
        `• **Revenue:** ${formatMoney(pnlReport.totalRevenueKobo)}\n` +
        `• **COGS:** ${formatMoney(pnlReport.totalCogsKobo)}\n` +
        `• **Gross Profit:** ${formatMoney(pnlReport.grossProfitKobo)}\n` +
        `• **Operating Expenses:** ${formatMoney(pnlReport.operatingExpensesKobo)}\n` +
        `• **Recognized Losses:** ${formatMoney(pnlReport.recognizedLossesKobo)}\n` +
        `• **Net Audited Profit:** ${formatMoney(pnlReport.netProfitKobo)}\n` +
        `• **Potential Exposure (Unresolved):** ${formatMoney(totalExposureKobo)}`;
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative pb-20">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-wider">MY-AUDITOR</span>
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
              </select>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-xl border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
              {userRole}
            </span>
          </div>
        </div>
      </header>

      {/* Action Hub Sidebar */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex">
          <div className="w-80 bg-slate-900 border-r border-slate-800 h-full p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <span className="font-black text-white text-lg">Deterministic Action Hub</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSimulatePOSSale}
                  className="w-full p-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" /> Simulate POS Sale (₦350)
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); setShowOcrModal(true); }}
                  className="w-full p-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Scan Receipt / OCR Upload
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); setShowExpenseModal(true); }}
                  className="w-full p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" /> Log Operational Expense
                </button>
                <button
                  onClick={() => { setIsMenuOpen(false); setShowShrinkageModal(true); }}
                  className="w-full p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <ShieldAlert className="w-4 h-4" /> Report Stock Discrepancy
                </button>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 text-center">MY-AUDITOR v4.0 • Zero-Simulation Ledger</p>
          </div>
          <div className="flex-1" onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}

      {/* OCR / Camera Scan Modal */}
      {showOcrModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" /> OCR Receipt & Document Scanner
              </h3>
              <button onClick={() => setShowOcrModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleOcrSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Simulated Scanned Receipt Text / OCR Output</label>
                <textarea
                  rows={4}
                  value={ocrRawText}
                  onChange={e => setOcrRawText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl p-3 text-white focus:outline-none"
                />
              </div>
              <p className="text-[10px] text-slate-500">
                The engine will extract the vendor and total amount deterministically and post an audited double-entry journal entry to the ledger instantly.
              </p>
              <button type="submit" className="w-full py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">
                Process & Post to Ledger
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Log Expense Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-sm">Log Operating Expense</h3>
            <form onSubmit={handleAddExpenseSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Amount (₦)</label>
                <input
                  type="number"
                  value={expenseAmt}
                  onChange={e => setExpenseAmt(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">
                Post Expense Journal
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Report Shrinkage Modal */}
      {showShrinkageModal && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-white text-sm">Report Stock Discrepancy (Audit Finding)</h3>
            <form onSubmit={handleAddShrinkageSubmit} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Missing Units</label>
                <input
                  type="number"
                  value={shrinkQty}
                  onChange={e => setShrinkQty(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white"
                />
              </div>
              <button type="submit" className="w-full py-2.5 bg-rose-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer">
                Create Audit Finding (Exposure)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 space-y-6">
        
        {posNotice && (
          <div className="bg-teal-500/10 border border-teal-500/30 p-3 rounded-xl text-teal-300 text-xs font-bold flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 shrink-0" />
            {posNotice}
          </div>
        )}

        {ocrNotice && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-xl text-cyan-300 text-xs font-bold flex items-center gap-2">
            <Camera className="w-4 h-4 shrink-0" />
            {ocrNotice}
          </div>
        )}

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

        {/* Audit Separate Section */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Continuous Audit Centre (Isolated from P&L)</p>
            <p className="text-lg font-black text-white mt-0.5">Potential Stock Exposure: {formatMoney(totalExposureKobo)}</p>
          </div>
          <span className="text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-xl font-bold">
            Does Not Reduce Net Profit Until Authorized
          </span>
        </div>

        {/* Inventory State Catalog */}
        <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Verified Inventory Engine State</h3>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
            <div>
              <p className="font-bold text-white text-sm">{productState?.productName}</p>
              <p className="text-slate-400">Weighted Average Cost (WAC): {formatMoney(productState?.weightedAverageCostKobo || 0n)}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-emerald-400 text-sm">{productState?.currentStock} units available</p>
              <p className="text-slate-500">Movement-tracked</p>
            </div>
          </div>
        </div>

      </main>

      {/* AI Assistant Floating Widget */}
      <div className="fixed bottom-5 right-5 z-40">
        {!isAiChatOpen ? (
          <button
            onClick={() => setIsAiChatOpen(true)}
            className="p-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-full shadow-2xl flex items-center gap-2 font-bold text-xs cursor-pointer"
          >
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
              <input
                type="text"
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
                placeholder="Ask Forensic CPA anything..."
                className="flex-1 bg-slate-900 border border-slate-800 text-xs rounded-xl px-3 py-2 text-white focus:outline-none"
              />
              <button type="submit" className="p-2 bg-emerald-500 text-slate-950 rounded-xl cursor-pointer"><Send className="w-3.5 h-3.5" /></button>
            </form>
          </div>
        )}
      </div>

    </div>
  );
}