"use client";

import { useState } from "react";

interface AuditControlsProps {
  businessId: string;
  onAuditComplete: () => void;
}

export default function AuditControls({ businessId, onAuditComplete }: AuditControlsProps) {
  const [loading, setLoading] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [sku, setSku] = useState("");
  const [physicalCount, setPhysicalCount] = useState<number | "">("");

  // Trigger Backend Audit Engine
  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/audit/${businessId}/run`, {
        method: "POST",
      });
      if (res.ok) {
        onAuditComplete();
      }
    } catch (err) {
      console.error("Failed to run audit:", err);
    } finally {
      setLoading(false);
    }
  };

  // Submit Manual Stock Adjustment
  const handleStockAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || physicalCount === "") return;

    try {
      const res = await fetch(`http://localhost:3000/api/stock/adjust`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, sku, physicalCount: Number(physicalCount) }),
      });

      if (res.ok) {
        setShowAdjustModal(false);
        setSku("");
        setPhysicalCount("");
        onAuditComplete();
      }
    } catch (err) {
      console.error("Failed to adjust stock:", err);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8 flex flex-wrap items-center justify-between gap-4 shadow-lg">
      <div>
        <h3 className="text-lg font-semibold text-white">Management Controls</h3>
        <p className="text-sm text-slate-400">Trigger store audits or adjust physical inventory levels.</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Trigger Audit Button */}
        <button
          onClick={handleRunAudit}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg transition disabled:opacity-50 flex items-center gap-2"
        >
          {loading ? (
            <span>Running Audit...</span>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Run On-Demand Audit</span>
            </>
          )}
        </button>

        {/* Adjust Stock Button */}
        <button
          onClick={() => setShowAdjustModal(true)}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2 rounded-lg transition"
        >
          Adjust Stock Count
        </button>
      </div>

      {/* Stock Adjustment Modal */}
      {showAdjustModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl max-w-md w-full shadow-2xl">
            <h4 className="text-xl font-bold text-white mb-2">Adjust Inventory Count</h4>
            <p className="text-sm text-slate-400 mb-6">Log physical shelf counts to recalculate leakage metrics.</p>

            <form onSubmit={handleStockAdjustment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Product SKU</label>
                <input
                  type="text"
                  placeholder="e.g. MILK-PK-400"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Verified Physical Count</label>
                <input
                  type="number"
                  placeholder="e.g. 120"
                  value={physicalCount}
                  onChange={(e) => setPhysicalCount(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Save Count
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}