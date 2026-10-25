import React, { useState } from 'react';
import { Camera, UploadCloud, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { parseReceiptImageText, postParsedReceiptToLedger } from '../lib/ocrParser';
import { formatKoboToNaira } from '../lib/currency';
import { UserContext, enforcePermission } from '../lib/rbacEngine';

interface OcrScannerModuleProps {
  currentUser: UserContext;
  currencyKey: string;
  onDocumentPosted: () => void;
}

export default function OcrScannerModule({ currentUser, currencyKey, onDocumentPosted }: OcrScannerModuleProps) {
  const [rawText, setRawText] = useState("SUPER STORE NIGERIA\n5x Coaster Biscuits @ 3500\nTOTAL: 17500");
  const [reviewData, setReviewData] = useState<any | null>(null);
  const [notice, setNotice] = useState('');
  const [scanningMode, setScanningMode] = useState<'text' | 'upload' | 'camera'>('text');

  const formatMoney = (koboVal: bigint) => formatKoboToNaira(koboVal, currencyKey === 'USD' ? '$' : '₦');

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseReceiptImageText(rawText);
    setReviewData(parsed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      const simulatedText = `FILE UPLOADED: ${fileName}\nVendor: Ikeja Mega Supplier\n2x Diesel Fuel @ 12000\nTOTAL: 24000`;
      setRawText(simulatedText);
      setReviewData(parseReceiptImageText(simulatedText));
    }
  };

  const handleConfirmAndPost = () => {
    try {
      enforcePermission(currentUser, 'POST_TRANSACTION');
      if (!reviewData) return;
      
      postParsedReceiptToLedger({
        businessId: currentUser.businessId,
        branchId: currentUser.branchId,
        rawText: rawText,
      });

      onDocumentPosted();
      setReviewData(null);
      setNotice('Document successfully reviewed, classified, and posted to the enterprise ledger.');
      setTimeout(() => setNotice(''), 4000);
    } catch (err: any) {
      alert(`RBAC Blocked: ${err.message}`);
    }
  };

  const handleReject = () => {
    setReviewData(null);
    setNotice('Document review rejected. No transaction posted.');
    setTimeout(() => setNotice(''), 3000);
  };

  return (
    <div className="space-y-6">
      {notice && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 p-3 rounded-xl text-cyan-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {notice}
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl">
        <h2 className="text-lg font-black text-white flex items-center gap-2">
          <Camera className="w-5 h-5 text-cyan-400" /> AI OCR Receipt & Invoice Scanner
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Extract, classify, and review financial documents with strict human-in-the-loop verification before ledger posting.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Input & Capture */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-4">
          <div className="flex gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setScanningMode('text')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${scanningMode === 'text' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
            >
              Text Raw Input
            </button>
            <button
              onClick={() => setScanningMode('upload')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${scanningMode === 'upload' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
            >
              Upload PDF/Image
            </button>
            <button
              onClick={() => setScanningMode('camera')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${scanningMode === 'camera' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}
            >
              Camera / QR Feed
            </button>
          </div>

          {scanningMode === 'text' && (
            <form onSubmit={handleScan} className="space-y-3">
              <label className="text-xs text-slate-400 block">Paste Raw OCR Extracted Text</label>
              <textarea
                rows={5}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none font-mono"
              />
              <button
                type="submit"
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-lg"
              >
                Extract & Classify Document
              </button>
            </form>
          )}

          {scanningMode === 'upload' && (
            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 border-dashed text-center space-y-3">
              <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto" />
              <p className="text-xs text-slate-200 font-bold">Upload PDF invoice or scanned receipt image</p>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                className="text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400 cursor-pointer"
              />
            </div>
          )}

          {scanningMode === 'camera' && (
            <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-3">
              <Camera className="w-12 h-12 text-cyan-400 mx-auto animate-pulse" />
              <p className="text-xs text-white font-bold">Live Camera / Barcode Scanner Active</p>
              <p className="text-[11px] text-slate-400">Position document inside frame to capture.</p>
              <button
                onClick={() => {
                  const sample = "CAMERA CAPTURE: SUPPLIER INVOICE\nVendor: Dangote Logistics\n10x Premium Fuel @ 1500\nTOTAL: 15000";
                  setRawText(sample);
                  setReviewData(parseReceiptImageText(sample));
                }}
                className="px-4 py-2.5 bg-cyan-500 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-lg"
              >
                Capture Document Frame
              </button>
            </div>
          )}
        </div>

        {/* Right: Review Screen */}
        <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">Document Review & Classification</h3>
            {!reviewData ? (
              <div className="p-12 text-center text-slate-500 text-xs bg-slate-950 rounded-2xl border border-slate-800">
                No document currently under review. Scan or upload a receipt to initiate extraction.
              </div>
            ) : (
              <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-cyan-500/30 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Detected Classification</span>
                  <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-lg font-bold">
                    {reviewData.classification}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Extracted Vendor</span>
                  <span className="text-white font-bold">{reviewData.vendorName}</span>
                </div>
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <span className="text-slate-400">Total Amount</span>
                  <span className="text-emerald-400 font-black text-sm">₦{reviewData.totalAmountNaira.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">Raw Extracted Text Snippet</span>
                  <p className="text-[11px] text-slate-300 font-mono bg-slate-900 p-3 rounded-xl whitespace-pre-wrap">
                    {reviewData.extractedTextSnippet}
                  </p>
                </div>
              </div>
            )}
          </div>

          {reviewData && (
            <div className="flex gap-3 pt-6">
              <button
                onClick={handleConfirmAndPost}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> CONFIRM & POST
              </button>
              <button
                onClick={handleReject}
                className="py-3 px-5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold text-xs rounded-xl cursor-pointer flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" /> REJECT
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}