import React, { useState, useRef } from 'react';
import AppShell from '../../components/AppShell';
import { 
  Camera, 
  Upload, 
  CheckCircle2, 
  ScanLine, 
  ReceiptText, 
  FileCheck, 
  QrCode, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function OCRScannerPage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [scanMode, setScanMode] = useState<'receipt' | 'invoice' | 'qr' | 'statement'>('receipt');
  const [scanStatus, setScanStatus] = useState('Position document or code within the camera frame');
  const [extractedData, setExtractedData] = useState<any | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Start Camera Stream
  const startCamera = async (mode: 'receipt' | 'invoice' | 'qr' | 'statement') => {
    setScanMode(mode);
    setCameraActive(true);
    setExtractedData(null);
    setScanStatus(`Initializing OCR scanner for ${mode.toUpperCase()}...`);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setScanStatus(`Camera active. Align ${mode} within reticle & tap capture.`);
    } catch (err) {
      setScanStatus('Camera unavailable. Please use file upload below.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
    setCameraActive(false);
  };

  // Simulate OCR Processing
  const handleCaptureOrUpload = (modeName: string) => {
    setScanStatus('Processing image via AI OCR Engine...');
    setTimeout(() => {
      setExtractedData({
        type: modeName.toUpperCase(),
        vendor: 'Dangote Industries / Enterprise Supplier',
        date: new Date().toLocaleDateString(),
        items: [
          { description: 'Premium Stock Inflow / Unit A', qty: 50, unitPrice: 4500, total: 225000 },
          { description: 'Logistics & Handling Surcharge', qty: 1, unitPrice: 15000, total: 15000 }
        ],
        subtotal: 240000,
        vat: 17500,
        totalAmount: 257500,
        confidence: '99.4% Match'
      });
      stopCamera();
      setScanStatus('Extraction successful! Review parsed data below.');
    }, 800);
  };

  return (
    <AppShell 
      title="AI OCR & Document Scanner Hub" 
      subtitle="Instantly scan receipts, supplier invoices, QR codes, and bank statements with neural OCR extraction."
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={() => startCamera('invoice')}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Camera className="w-4 h-4" /> Launch Universal Scanner
          </button>
        </div>
      }
    >
      {/* OCR TELEMETRY KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">AI Extraction Accuracy</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><Sparkles className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">99.4% Precision</div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Processed Documents</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><ScanLine className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-teal-400 font-mono">Active Hub</div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Neural Engine Status</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><CheckCircle2 className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-sm font-bold text-teal-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" /> Ready for Ingestion
          </div>
        </div>
      </div>

      {/* SCANNER MODE SELECTOR CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          onClick={() => startCamera('receipt')}
          className="bg-[#111827] border border-[#1F293B] hover:border-teal-500/50 rounded-2xl p-6 space-y-3 shadow-xl transition cursor-pointer group"
        >
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 w-fit group-hover:bg-teal-500 group-hover:text-white transition">
            <ReceiptText className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Scan Expense Receipt</h3>
          <p className="text-xs text-slate-400">Capture point-of-sale receipts or cash purchase slips.</p>
        </div>

        <div 
          onClick={() => startCamera('invoice')}
          className="bg-[#111827] border border-[#1F293B] hover:border-teal-500/50 rounded-2xl p-6 space-y-3 shadow-xl transition cursor-pointer group"
        >
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 w-fit group-hover:bg-teal-500 group-hover:text-white transition">
            <FileCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Scan Supplier Invoice</h3>
          <p className="text-xs text-slate-400">Extract line items from wholesale supplier delivery notes.</p>
        </div>

        <div 
          onClick={() => startCamera('qr')}
          className="bg-[#111827] border border-[#1F293B] hover:border-teal-500/50 rounded-2xl p-6 space-y-3 shadow-xl transition cursor-pointer group"
        >
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 w-fit group-hover:bg-teal-500 group-hover:text-white transition">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Scan QR / Barcode</h3>
          <p className="text-xs text-slate-400">Instantly lookup product SKUs or inventory barcodes.</p>
        </div>

        <div 
          onClick={() => startCamera('statement')}
          className="bg-[#111827] border border-[#1F293B] hover:border-teal-500/50 rounded-2xl p-6 space-y-3 shadow-xl transition cursor-pointer group"
        >
          <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 w-fit group-hover:bg-teal-500 group-hover:text-white transition">
            <ScanLine className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Scan Bank Statement</h3>
          <p className="text-xs text-slate-400">Extract bank transfer inflows and settlement records.</p>
        </div>
      </div>

      {/* EXTRACTED DATA PREVIEW PANEL */}
      {extractedData && (
        <div className="bg-[#111827] border border-teal-500/40 rounded-2xl p-6 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-bold text-white">AI OCR Extraction Result ({extractedData.type})</h2>
            </div>
            <span className="px-2.5 py-1 rounded bg-teal-500/10 text-teal-300 text-[10px] font-mono font-bold">
              {extractedData.confidence}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#0A0E17] p-3.5 rounded-xl border border-[#1F293B]">
              <span className="text-slate-400 block mb-1">Vendor / Source</span>
              <span className="font-bold text-white">{extractedData.vendor}</span>
            </div>
            <div className="bg-[#0A0E17] p-3.5 rounded-xl border border-[#1F293B]">
              <span className="text-slate-400 block mb-1">Scan Date</span>
              <span className="font-bold text-white font-mono">{extractedData.date}</span>
            </div>
            <div className="bg-[#0A0E17] p-3.5 rounded-xl border border-[#1F293B]">
              <span className="text-slate-400 block mb-1">Total Amount Due</span>
              <span className="font-bold text-teal-400 font-mono">₦{extractedData.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto border border-[#1F293B] rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                  <th className="p-3">Item Description</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Unit Price (₦)</th>
                  <th className="p-3">Total (₦)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B] text-slate-300">
                {extractedData.items.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#182234]/50">
                    <td className="p-3 font-bold text-white">{item.description}</td>
                    <td className="p-3 font-mono">{item.qty}</td>
                    <td className="p-3 font-mono">₦{item.unitPrice.toLocaleString()}</td>
                    <td className="p-3 font-mono text-teal-400 font-bold">₦{item.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button 
              onClick={() => setExtractedData(null)}
              className="px-4 py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] text-slate-300 text-xs font-bold hover:bg-[#182234] transition cursor-pointer"
            >
              Discard
            </button>
            <button 
              onClick={() => {
                alert('Document successfully reconciled and posted to MY-AUDITOR ledger!');
                setExtractedData(null);
              }}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-lg flex items-center gap-1.5 cursor-pointer"
            >
              Post to Ledger <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LIVE CAMERA VIEWFINDER MODAL */}
      {cameraActive && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Neural OCR Scanner ({scanMode.toUpperCase()})</h3>
              </div>
              <button onClick={stopCamera} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              onClick={() => handleCaptureOrUpload(scanMode)}
              className="relative w-full h-72 bg-black rounded-xl overflow-hidden border border-[#1F293B] flex items-center justify-center cursor-pointer group"
            >
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-teal-500/30 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-60 h-44 border-2 border-dashed border-teal-400 rounded-xl relative animate-pulse flex items-center justify-center bg-teal-500/5">
                  <span className="text-[10px] font-mono text-teal-300 bg-black/80 px-3 py-1 rounded">TAP TO CAPTURE &amp; EXTRACT</span>
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
                    handleCaptureOrUpload(scanMode);
                  }
                }}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] hover:bg-[#182234] text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-teal-400" /> Upload Document Image from Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}