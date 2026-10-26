import React, { useState } from 'react';
import AppShell from '../../components/AppShell';
import { ScanText, Upload, CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function OcrScannerPage() {
  const [fileUploaded, setFileUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  const handleSimulateUpload = () => {
    setAnalyzing(true);
    setTimeout(() => {
      setAnalyzing(false);
      setFileUploaded(true);
    }, 1500);
  };

  const handleConfirmPost = () => {
    alert('Document successfully verified and posted to the double-entry accounting ledger!');
    setFileUploaded(false);
    setReviewed(false);
  };

  return (
    <AppShell 
      title="AI OCR Receipt & Invoice Scanner" 
      subtitle="Upload or capture receipts and invoices for automated classification and ledger posting."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upload Box */}
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-6 space-y-5">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Upload className="w-4 h-4 text-teal-400" /> Document Intake
          </h2>

          <div 
            onClick={handleSimulateUpload}
            className="border-2 border-dashed border-[#1F293B] hover:border-teal-500/50 rounded-xl p-10 text-center space-y-3 cursor-pointer bg-[#0A0E17]/40 transition"
          >
            <ScanText className="w-10 h-10 text-teal-400 mx-auto" />
            <div>
              <p className="text-xs font-bold text-white">Click to upload receipt, PDF, or invoice</p>
              <p className="text-[11px] text-slate-500 mt-1">Supports PNG, JPG, or PDF up to 25MB</p>
            </div>
            {analyzing && <div className="text-xs font-bold text-teal-400 animate-pulse pt-2">Running AI Classification & Extraction...</div>}
          </div>
        </div>

        {/* Review & Post Box */}
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-6 space-y-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-4">Review Before Posting</h2>
            
            {!fileUploaded ? (
              <div className="h-48 flex flex-col items-center justify-center text-center border border-dashed border-[#1F293B] rounded-lg p-6 text-slate-500 text-xs">
                Upload a document on the left to inspect AI-extracted line items and classification before posting to accounting.
              </div>
            ) : (
              <div className="space-y-4 bg-[#0A0E17] border border-[#1F293B] rounded-lg p-4 text-xs">
                <div className="flex items-center justify-between border-b border-[#1F293B] pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-teal-400 uppercase">Detected Classification</span>
                    <div className="font-bold text-white text-sm mt-0.5">SALES RECEIPT</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-300 font-bold text-[10px]">CONFIDENCE: 99.4%</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-slate-400"><span>Receipt Ref:</span> <span className="font-mono text-white">SALE-TEST-2001</span></div>
                  <div className="flex justify-between text-slate-400"><span>Payment Channel:</span> <span className="font-mono text-white">POS Terminal</span></div>
                </div>

                <div className="pt-2 border-t border-[#1F293B]">
                  <span className="font-bold text-slate-400">Extracted Line Items:</span>
                  <div className="mt-2 space-y-1.5 font-mono">
                    <div className="flex justify-between text-slate-300"><span>8 × Coaster Biscuits (@ ₦350)</span> <span>₦2,800.00</span></div>
                    <div className="flex justify-between text-slate-300"><span>4 × Water (@ ₦250)</span> <span>₦1,000.00</span></div>
                  </div>
                </div>

                <div className="flex justify-between font-bold text-white pt-3 border-t border-[#1F293B] text-sm">
                  <span>TOTAL DETECTED</span>
                  <span className="font-mono text-teal-400">₦3,800.00</span>
                </div>
              </div>
            )}
          </div>

          {fileUploaded && (
            <div className="flex items-center gap-3 pt-4 border-t border-[#1F293B]">
              <button 
                onClick={() => setFileUploaded(false)}
                className="flex-1 py-2.5 bg-[#0A0E17] border border-[#1F293B] text-slate-300 hover:bg-[#182234] rounded-lg text-xs font-bold transition"
              >
                Reject
              </button>
              <button 
                onClick={handleConfirmPost}
                className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Confirm & Post to Ledger
              </button>
            </div>
          )}
        </div>

      </div>
    </AppShell>
  );
}