import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export default function BusinessDashboard() {
  const router = useRouter();
  const { businessId } = router.query;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Live Camera Viewfinder State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<File | null>(null);

  useEffect(() => {
    if (!businessId) return;
    fetch(`http://localhost:3000/api/businesses/${businessId}/dashboard`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard load error:", err);
        setLoading(false);
      });
  }, [businessId]);

  // Start Desktop/Laptop Webcam Stream
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Webcam access error:", err);
      alert("Unable to access camera. Please allow camera permissions.");
      setIsCameraOpen(false);
    }
  };

  // Stop Webcam Stream
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraOpen(false);
  };

  // Capture Photo Frame from Video Viewfinder
  const captureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-receipt.jpg", { type: "image/jpeg" });
            setCapturedImage(file);
            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  const handleScanSubmit = async (fileToUpload: File | null) => {
    if (!fileToUpload) {
      alert("Please snap a photo or select a receipt file first.");
      return;
    }

    const formData = new FormData();
    formData.append("receipt", fileToUpload);

    try {
      const res = await fetch(`http://localhost:3000/api/ingest/${businessId}/scan-receipt`, {
        method: "POST",
        body: formData,
      });
      const resData = await res.json();
      if (res.ok) {
        alert(resData.message);
        window.location.reload();
      } else {
        alert(resData.message || "Failed to scan receipt.");
      }
    } catch (err) {
      console.error("Scan error:", err);
      alert("Server connection failed during scan.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        Loading Secure Tenant Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">MY-AUDITOR</h1>
            <p className="text-sm text-slate-400 mt-1">
              {data?.businessName} • {data?.industry}
            </p>
          </div>
          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1.5 rounded-full font-semibold">
            System Live
          </span>
        </div>

        {/* Executive Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
            🤖 AI Executive Audit Summary
          </h2>
          <p className="text-sm text-slate-300">{data?.executiveSummary}</p>
        </div>

        {/* Financial KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <p className="text-2xl font-extrabold text-white mt-2">
              NGN {data?.kpis?.totalRevenue?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Expenses</span>
            <p className="text-2xl font-extrabold text-white mt-2">
              NGN {data?.kpis?.totalExpenses?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Net Profit</span>
            <p className="text-2xl font-extrabold text-emerald-400 mt-2">
              NGN {data?.kpis?.netProfit?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Profit Margin</span>
            <p className="text-2xl font-extrabold text-indigo-400 mt-2">
              {data?.kpis?.profitMargin || "0.0"}%
            </p>
          </div>
        </div>

        {/* CSV / POS Data Ingestion */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-white">CSV / POS Data Ingestion</h2>
            <p className="text-xs text-slate-400">Upload store POS export CSVs to process real-time audit analysis.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <input
              type="file"
              accept=".csv"
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer bg-slate-950 border border-slate-800 rounded-lg p-1.5"
            />
            <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-6 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 whitespace-nowrap">
              Upload & Process
            </button>
          </div>
        </div>

        {/* AI Camera Receipt Scanner & Auto-Inventory */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-white">AI Camera Receipt Scanner & Auto-Inventory</h2>
              <p className="text-xs text-slate-400">
                Snap a photo with your webcam/camera or upload an invoice to auto-sync inventory.
              </p>
            </div>
            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1 rounded-full font-medium">
              Live Camera Ready 📷
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div>
              <button
                onClick={startCamera}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                📷 Open Live Camera Viewfinder
              </button>
            </div>

            <div>
              <input
                type="file"
                accept="image/*,.pdf"
                capture="environment"
                id="cameraReceiptInput"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setCapturedImage(e.target.files[0]);
                  }
                }}
                className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer bg-slate-950 border border-slate-800 rounded-lg p-1.5"
              />
            </div>

            <div>
              <button
                onClick={() => {
                  const fileInput = document.getElementById("cameraReceiptInput") as HTMLInputElement;
                  const fileToUpload = capturedImage || fileInput?.files?.[0] || null;
                  handleScanSubmit(fileToUpload);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-6 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2"
              >
                🚀 Process & Reconcile {capturedImage ? "(1 Photo Ready)" : ""}
              </button>
            </div>
          </div>
        </div>

        {/* Management Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Management Controls</h2>
            <p className="text-xs text-slate-400">Trigger store audits or adjust physical inventory levels.</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition shadow-lg shadow-indigo-600/20">
              ⚡ Run On-Demand Audit
            </button>
            <button className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold py-2.5 px-5 rounded-xl text-sm transition">
              Adjust Stock Count
            </button>
          </div>
        </div>

        {/* Automated Audit Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-white">Automated Audit Alerts</h2>
            <div className="flex gap-2">
              <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs px-2.5 py-1 rounded-md font-semibold">
                0 Critical
              </span>
              <span className="bg-slate-800 text-slate-300 border border-slate-700 text-xs px-2.5 py-1 rounded-md font-semibold">
                {data?.auditAlerts?.recentFindings?.length || 0} Total Flags
              </span>
            </div>
          </div>

          {!data?.auditAlerts?.recentFindings || data?.auditAlerts?.recentFindings?.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              No active audit flags detected for this business profile.
            </p>
          ) : (
            <div className="space-y-3">
              {data?.auditAlerts?.recentFindings?.map((finding: any, idx: number) => (
                <div
                  key={idx}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center text-sm"
                >
                  <span className="text-slate-300">{finding.description}</span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400">
                    {finding.severity}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live Camera Viewfinder Modal */}
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl flex flex-col items-center">
            <h3 className="text-lg font-bold text-white mb-4">Receipt Camera Viewfinder</h3>
            <div className="relative w-full bg-black rounded-xl overflow-hidden aspect-video mb-4 border border-slate-800">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
            <div className="flex gap-4 w-full">
              <button
                onClick={stopCamera}
                className="w-1/2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-sm font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={captureSnapshot}
                className="w-1/2 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-600/20"
              >
                📸 Snap Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}