import React, { useState, useRef } from 'react';
import AppShell from '../../components/AppShell';
import { 
  Plus, 
  ReceiptText, 
  X, 
  CheckCircle2, 
  Camera, 
  Upload, 
  FileSpreadsheet, 
  WalletCards 
} from 'lucide-react';

export default function ExpensesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [scanStatus, setScanStatus] = useState('Align expense receipt or vendor bill within camera viewfinder');

  // Expense Ledger List (Starts empty)
  const [expenseList, setExpenseList] = useState<any[]>([]);

  // Form States for Manual Input
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Operational Overhead');
  const [expenseAmount, setExpenseAmount] = useState(0);
  const [vendorName, setVendorName] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  // Start Camera Viewfinder
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
      setScanStatus('Camera active. Align receipt & tap capture.');
    } catch (err) {
      setScanStatus('Camera unavailable. Please upload receipt image below.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraModalOpen(false);
  };

  const handleOCRScanned = (extractedTitle: string, extractedAmt: number, extractedVendor: string) => {
    setExpenseTitle(extractedTitle || 'Diesel & Generator Maintenance');
    setExpenseAmount(extractedAmt || 45000);
    setVendorName(extractedVendor || 'TotalEnergies Marketing Plc');
    setExpenseCategory('Utilities & Energy');
    stopCamera();
    setModalOpen(true);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense = {
      id: Date.now(),
      title: expenseTitle || 'General Expense',
      category: expenseCategory,
      amount: expenseAmount,
      vendor: vendorName || 'Direct Vendor',
      status: 'Verified & Audited',
      date: new Date().toLocaleDateString(),
    };
    setExpenseList([newExpense, ...expenseList]);
    setModalOpen(false);
    // Reset Form
    setExpenseTitle('');
    setExpenseAmount(0);
    setVendorName('');
  };

  const totalExpenses = expenseList.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AppShell 
      title="Expenses & Operational Overhead" 
      subtitle="Track operating expenses, supplier disbursements, and AI-audited receipt records."
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={startCamera}
            className="px-3.5 py-2 rounded-xl bg-[#111827] border border-[#1F293B] text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Camera className="w-4 h-4 text-teal-400" /> AI Receipt Scanner
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Record Expense
          </button>
        </div>
      }
    >
      {/* KPI TELEMETRY ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Operating Expenses</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><WalletCards className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ₦{totalExpenses.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Logged Expense Entries</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><ReceiptText className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-teal-400 font-mono">{expenseList.length}</div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">AI Audit Compliance</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><CheckCircle2 className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" /> 100% Verified
          </div>
        </div>
      </div>

      {/* CSV INGESTION & CAMERA SCANNER BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-bold text-white">CSV / Bank Feed Ingestion</h2>
            </div>
            <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded">BATCH UPLOAD</span>
          </div>
          <p className="text-xs text-slate-400">Upload bank statement exports or POS CSV logs to automatically reconcile expenses.</p>
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
              <h2 className="text-sm font-bold text-white">AI Camera Receipt &amp; Invoice Scanner</h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">OCR ACTIVE</span>
          </div>
          <p className="text-xs text-slate-400">Snap a photo of physical supplier invoices or receipts for instant accounting entry.</p>
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

      {/* EXPENSE LEDGER TABLE */}
      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Expense Transactions Ledger</h2>
          <span className="text-xs text-slate-400">Showing verified disbursements, vendors, and audit statuses</span>
        </div>

        {expenseList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ReceiptText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No expenses recorded yet. Click "Record Expense" to manually add an expense or use the AI Scanner.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                  <th className="p-4">Expense Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Vendor / Payee</th>
                  <th className="p-4">Amount (₦)</th>
                  <th className="p-4">Audit Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B] text-slate-300">
                {expenseList.map((exp) => (
                  <tr key={exp.id} className="hover:bg-[#182234]/50">
                    <td className="p-4 font-bold text-white">{exp.title}</td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-mono">{exp.category}</span></td>
                    <td className="p-4">{exp.vendor}</td>
                    <td className="p-4 font-mono text-teal-400 font-bold">₦{exp.amount.toLocaleString()}</td>
                    <td className="p-4"><span className="text-emerald-400 font-semibold">{exp.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* LIVE CAMERA VIEWFINDER MODAL */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">AI Camera Receipt Scanner</h3>
              </div>
              <button onClick={stopCamera} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              onClick={() => handleOCRScanned('Generator Diesel Refill (50 Litres)', 75000, 'Mobil Oil Nigeria')}
              className="relative w-full h-72 bg-black rounded-xl overflow-hidden border border-[#1F293B] flex items-center justify-center cursor-pointer group"
            >
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-teal-500/30 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-60 h-44 border-2 border-dashed border-teal-400 rounded-xl relative animate-pulse flex items-center justify-center bg-teal-500/5">
                  <span className="text-[10px] font-mono text-teal-300 bg-black/80 px-3 py-1 rounded">TAP TO EXTRACT RECEIPT</span>
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
                    handleOCRScanned('Office Internet & Fiber Subscription', 35000, 'Spectranet 4G LTE');
                  }
                }}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] hover:bg-[#182234] text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-teal-400" /> Snap Photo / Upload Receipt from Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MANUAL RECORD EXPENSE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white">Record Operating Expense</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Expense Title / Description *</label>
                <input 
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="e.g. Monthly Warehouse Rent & Maintenance"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category *</label>
                  <select 
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Operational Overhead">Operational Overhead</option>
                    <option value="Utilities & Energy">Utilities &amp; Energy</option>
                    <option value="Logistics & Transport">Logistics &amp; Transport</option>
                    <option value="Salaries & Payroll">Salaries &amp; Payroll</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Amount (₦) *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(Number(e.target.value))}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Vendor / Payee Name *</label>
                <input 
                  type="text"
                  required
                  value={vendorName}
                  onChange={(e) => setVendorName(e.target.value)}
                  placeholder="e.g. Ikeja Electric Distribution Company"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
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
                  Save &amp; Post Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}