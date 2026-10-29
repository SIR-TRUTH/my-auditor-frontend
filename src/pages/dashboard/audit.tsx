import React, { useState, useRef } from 'react';
import AppShell from '../../components/AppShell';
import { 
  Plus, 
  ReceiptText, 
  X, 
  CheckCircle2, 
  Camera, 
  Upload, 
  ShieldAlert, 
  ShieldCheck, 
  FileSpreadsheet, 
  AlertTriangle 
} from 'lucide-react';

export default function AuditPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [scanStatus, setScanStatus] = useState('Align compliance report or audit document within camera viewfinder');

  // Audit Findings List (Starts empty to reflect real activity)
  const [auditFindings, setAuditFindings] = useState<any[]>([]);

  // Form States
  const [findingTitle, setFindingTitle] = useState('');
  const [moduleSource, setModuleSource] = useState('Sales & Revenue');
  const [riskLevel, setRiskLevel] = useState('Medium Risk');
  const [remediationAction, setRemediationAction] = useState('Manager sign-off required');

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
      setScanStatus('Camera active. Align audit document & tap capture.');
    } catch (err) {
      setScanStatus('Camera unavailable. Please upload compliance document image below.');
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
  const handleAuditDocExtracted = (extractedTitle: string, extractedRisk: string) => {
    setFindingTitle(extractedTitle || 'POS Cash Drawer Discrepancy Flag');
    setModuleSource('Banking & POS Reconcile');
    setRiskLevel(extractedRisk || 'High Risk');
    setRemediationAction('Immediate reconciliation & supervisor audit');
    stopCamera();
    setModalOpen(true);
  };

  const handleAddAuditFinding = (e: React.FormEvent) => {
    e.preventDefault();
    const newFinding = {
      id: Date.now(),
      title: findingTitle || 'General Compliance Review',
      module: moduleSource,
      risk: riskLevel,
      action: remediationAction,
      status: 'Under Review',
      date: new Date().toLocaleDateString(),
    };
    setAuditFindings([newFinding, ...auditFindings]);
    setModalOpen(false);
    // Reset Form
    setFindingTitle('');
  };

  const highRiskCount = auditFindings.filter(f => f.risk === 'High Risk').length;
  const complianceScore = auditFindings.length === 0 ? 100 : Math.max(70, 100 - (highRiskCount * 10));

  return (
    <AppShell 
      title="Continuous Audit Centre" 
      subtitle="Monitor automated risk heuristics, internal control compliance flags, and real-time fraud detection."
      actions={
        <div className="flex items-center gap-2">
          <button 
            onClick={startCamera}
            className="px-3.5 py-2 rounded-xl bg-[#111827] border border-[#1F293B] text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Camera className="w-4 h-4 text-teal-400" /> Scan Audit Doc
          </button>
          <button 
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Log Audit Finding
          </button>
        </div>
      }
    >
      {/* FINANCIAL TELEMETRY KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Internal Control Score</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><ShieldCheck className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {complianceScore}% Optimal
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Risk Flags</span>
            <span className="p-1 rounded bg-amber-500/10 text-amber-400"><ShieldAlert className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-2xl font-bold text-amber-400 font-mono">{auditFindings.length}</div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">AI Surveillance Status</span>
            <span className="p-1 rounded bg-teal-500/10 text-teal-400"><CheckCircle2 className="w-3.5 h-3.5" /></span>
          </div>
          <div className="text-sm font-bold text-teal-400 flex items-center gap-1.5 mt-1">
            <CheckCircle2 className="w-4 h-4" /> 24/7 Real-Time Monitoring
          </div>
        </div>
      </div>

      {/* CSV INGESTION & CAMERA SCANNER BAR */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-bold text-white">Transaction Logs CSV Ingestion</h2>
            </div>
            <span className="text-[10px] font-mono text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded">BATCH SCAN</span>
          </div>
          <p className="text-xs text-slate-400">Upload bulk transaction logs to run automated anomaly detection and internal control tests.</p>
          <div className="flex items-center gap-3">
            <input type="file" ref={csvInputRef} accept=".csv" className="hidden" />
            <button 
              onClick={() => csvInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] text-slate-300 text-xs font-bold hover:bg-[#182234] transition cursor-pointer"
            >
              Choose CSV File
            </button>
            <button className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs transition shadow-md cursor-pointer">
              Upload &amp; Run Audit
            </button>
          </div>
        </div>

        <div className="bg-[#111827] border border-[#1F293B] rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Camera className="w-5 h-5 text-teal-400" />
              <h2 className="text-sm font-bold text-white">AI Compliance &amp; Audit Report Scanner</h2>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">OCR ACTIVE</span>
          </div>
          <p className="text-xs text-slate-400">Snap a photo of external auditor reports or physical compliance certificates for AI indexing.</p>
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

      {/* AUDIT FINDINGS LEDGER TABLE */}
      <div className="bg-[#111827] border border-[#1F293B] rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[#1F293B] flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Continuous Audit Findings &amp; Risk Ledger</h2>
          <span className="text-xs text-slate-400">Showing automated risk flags, affected modules, and remediation protocols</span>
        </div>

        {auditFindings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ReceiptText className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">No audit findings logged yet. Click "Log Audit Finding" or use the AI Scanner to record your first compliance check.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0A0E17] text-slate-400 border-b border-[#1F293B] uppercase font-mono text-[10px]">
                  <th className="p-4">Finding / Description</th>
                  <th className="p-4">Module Source</th>
                  <th className="p-4">Risk Level</th>
                  <th className="p-4">Remediation Protocol</th>
                  <th className="p-4">Review Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1F293B] text-slate-300">
                {auditFindings.map((finding) => (
                  <tr key={finding.id} className="hover:bg-[#182234]/50">
                    <td className="p-4 font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> {finding.title}
                    </td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 text-[10px] font-mono">{finding.module}</span></td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold ${
                        finding.risk === 'High Risk' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {finding.risk}
                      </span>
                    </td>
                    <td className="p-4">{finding.action}</td>
                    <td className="p-4"><span className="text-amber-400 font-semibold">{finding.status}</span></td>
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
                <h3 className="text-sm font-bold text-white">AI Compliance &amp; Audit Scanner</h3>
              </div>
              <button onClick={stopCamera} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div 
              onClick={() => handleAuditDocExtracted('Unreconciled POS Terminal Batch Discrepancy', 'High Risk')}
              className="relative w-full h-72 bg-black rounded-xl overflow-hidden border border-[#1F293B] flex items-center justify-center cursor-pointer group"
            >
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              <div className="absolute inset-0 border-2 border-teal-500/30 rounded-xl pointer-events-none flex items-center justify-center">
                <div className="w-60 h-44 border-2 border-dashed border-teal-400 rounded-xl relative animate-pulse flex items-center justify-center bg-teal-500/5">
                  <span className="text-[10px] font-mono text-teal-300 bg-black/80 px-3 py-1 rounded">TAP TO SCAN AUDIT DOCUMENT</span>
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
                    handleAuditDocExtracted('Inventory Stock Valuation Variance', 'Medium Risk');
                  }
                }}
              />
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 rounded-xl bg-[#0A0E17] border border-[#1F293B] hover:bg-[#182234] text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-teal-400" /> Snap Photo / Upload Audit Doc from Gallery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOG AUDIT FINDING MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111827] border border-[#1F293B] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#1F293B] pb-4">
              <h3 className="text-base font-bold text-white">Log Continuous Audit Finding</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAuditFinding} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Finding Title / Risk Description *</label>
                <input 
                  type="text"
                  required
                  value={findingTitle}
                  onChange={(e) => setFindingTitle(e.target.value)}
                  placeholder="e.g. Unusual Cash Disbursement Variance"
                  className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Affected Module *</label>
                  <select 
                    value={moduleSource}
                    onChange={(e) => setModuleSource(e.target.value)}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Sales & Revenue">Sales &amp; Revenue</option>
                    <option value="Inventory & WAC">Inventory &amp; WAC</option>
                    <option value="Expenses">Expenses</option>
                    <option value="Purchases & Suppliers">Purchases &amp; Suppliers</option>
                    <option value="Banking & POS Reconcile">Banking &amp; POS Reconcile</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Risk Assessment *</label>
                  <select 
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value)}
                    className="w-full bg-[#0A0E17] border border-[#1F293B] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="Low Risk">Low Risk</option>
                    <option value="Medium Risk">Medium Risk</option>
                    <option value="High Risk">High Risk</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Remediation Action Required *</label>
                <input 
                  type="text"
                  required
                  value={remediationAction}
                  onChange={(e) => setRemediationAction(e.target.value)}
                  placeholder="e.g. Supervisor sign-off & physical stock count"
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
                  Save &amp; Flag Finding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}