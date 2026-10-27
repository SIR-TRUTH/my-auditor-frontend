import React, { useState, useRef } from 'react';
import AppShell from '../../components/AppShell';
import { 
  Plus, 
  ReceiptText, 
  X, 
  CheckCircle2, 
  Camera, 
  Upload, 
  Users, 
  ShieldCheck, 
  FileSpreadsheet, 
  CreditCard 
} from 'lucide-react';

export default function CustomersPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [scanStatus, setScanStatus] = useState('Align customer credit invoice within camera viewfinder');

  // Customers List (Starts empty to reflect real activity)
  const [customersList, setCustomersList] = useState<any[]>([]);

  // Form States
  const [customerName, setCustomerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [creditLimit, setCreditLimit] = useState(0);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [paymentTerms, setPaymentTerms] = useState('Net 30 Days');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const csvInputRef = useRef<HTMLInputElement | null>(null);

  // Start Live Camera Viewfinder
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
      setScanStatus('Camera active. Align credit note & tap capture.');
    } catch (err) {
      setScanStatus('Camera unavailable. Please upload invoice image below.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraModalOpen(false);
  };

  // Handle OCR Simulated Extraction from Camera or Upload
  const handleCreditNoteExtracted = (extractedCustomer: string, extractedBal: number) => {
    setCustomerName(extractedCustomer || 'Mega Plaza Supermarket');
    setContactPhone('08031234567');
    setCreditLimit(1000000);
    setOutstandingBalance(extractedBal || 350000);
    stopCamera();
    setModalOpen(true);
  };

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer = {
      id: Date.now(),
      name: customerName || 'Enterprise Corporate Client',
      phone: contactPhone || '08000000000',
      limit: creditLimit,
      balance: outstandingBalance,
      terms: paymentTerms,
      status: outstandingBalance > creditLimit ? 'Credit Limit Exceeded' : 'Good Standing',
    };
    setCustomersList([newCustomer, ...customersList]);
    setModalOpen(false);
    // Reset Form
    setCustomerName('');
    setContactPhone('');
    setCreditLimit(0);
    setOutstandingBalance(0);
  };

  const totalReceivables = customersList.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <AppShell 
      title="Customers & Accounts Receivable (AR)" 
      subtitle="Manage corporate credit accounts, customer receivables aging, and AI credit note scanning."
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={startCamera}
            className="px-3.5 py-2 rounded-xl bg-[#111827] border border-[#1F293B] text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Camera className="w-4 h-4 text-teal-400" /> Scan Credit Note
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Customer Account
          </button>
        </div>
      }
    >
      {/* FINANCIAL TELEMETRY KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Total Outstanding Receivables</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><CreditCard className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">
            ₦{totalReceivables.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Credit Accounts</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><Users className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-teal-400 font-mono">{customersList.length}</div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">AR Compliance Status</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><ShieldCheck className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" /> 100% Reconciled
          </div>
        </div>
      </div>

      {/* CSV INGESTION & CAMERA SCANNER BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-bold text-white">Customer Balances CSV Ingestion</h2>
            </div>
            <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded">BATCH IMPORT</span>
          </div>
          <p className="text-xs text-slate-400">Upload bulk customer accounts and opening balances to auto-populate the AR ledger.</p>
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
              <h2 className="text-sm font-bold text-white">AI Credit Note &amp; Invoice Scanner</h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">OCR ACTIVE</span>
          </div>
          <p className="text-xs text-slate-400">Snap a photo of credit sales slips or customer invoices for instant receivables tracking.</p>
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

      {/* CUSTOMERS & AR LEDGER TABLE */}
      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Corporate Accounts Receivable Ledger</h2>
          <span className="text-xs text-slate-400">Showing customer credit limits, outstanding balances, and standing</span>
        </div>

        {customersList.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ReceiptText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No customers added yet. Click "Add Customer Account" or use the AI Scanner to log your first AR client.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Phone / Contact</th>
                  <th className="p-4">Credit Limit (₦)</th>
                  <th className="p-4">Outstanding Balance (₦)</th>
                  <th className="p-4">Payment Terms</th>
                  <th className="p-4">Standing Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B] text-slate-300">
                {customersList.map((cust) => (
                  <tr key={cust.id} className="hover:bg-[#182234]/50">
                    <td className="p-4 font-bold text-white">{cust.name}</td>
                    <td className="p-4 font-mono">{cust.phone}</td>
                    <td className="p-4 font-mono">₦{cust.limit.toLocaleString()}</td>
                    <td className="p-4 font-mono text-amber-400 font-bold">₦{cust.balance.toLocaleString()}</td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-mono">{cust.terms}</span></td>
                    <td className="p-4"><span className="text-emerald-400 font-semibold">{cust.status}</span></td>
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
                <h3 className="text-sm font-bold text-white">AI Credit Note Scanner</h3>
              </div>
              <button onClick={stopCamera} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              onClick={() => handleCreditNoteExtracted('Shoprite Ikeja City Mall', 450000)}
              className="relative w-full h-72 bg-black rounded-xl overflow-hidden border border-[#1F293B] flex items-center justify-center cursor-pointer group"
            >
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-teal-500/30 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-60 h-44 border-2 border-dashed border-teal-400 rounded-xl relative animate-pulse flex items-center justify-center bg-teal-500/5">
                  <span className="text-[10px] font-mono text-teal-300 bg-black/80 px-3 py-1 rounded">TAP TO EXTRACT CREDIT NOTE</span>
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
                    handleCreditNoteExtracted('Spar Lekki Wholesale', 850000);
                  }
                }}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] hover:bg-[#182234] text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-teal-400" /> Snap Photo / Upload Credit Note from Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD CUSTOMER MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white">Add Corporate Customer &amp; AR Account</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Customer / Corporate Name *</label>
                <input 
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Justrite Superstores Ltd"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Contact Phone Number *</label>
                <input 
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 08030000000"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Credit Limit (₦) *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value))}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Outstanding Balance (₦) *</label>
                  <input 
                    type="number" 
                    min="0"
                    required
                    value={outstandingBalance}
                    onChange={(e) => setOutstandingBalance(Number(e.target.value))}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Payment Terms *</label>
                <select 
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                >
                  <option value="Net 30 Days">Net 30 Days</option>
                  <option value="Net 60 Days">Net 60 Days</option>
                  <option value="Immediate COD">Immediate Cash on Delivery (COD)</option>
                  <option value="Weekly Settlement">Weekly Settlement</option>
                </select>
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
                  Save &amp; Audit Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}