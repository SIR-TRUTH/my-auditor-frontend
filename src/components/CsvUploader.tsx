"use client";

import { useState } from "react";

interface CsvUploaderProps {
  businessId: string;
  onUploadSuccess: () => void;
}

export default function CsvUploader({ businessId, onUploadSuccess }: CsvUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("businessId", businessId);

    try {
      const res = await fetch("http://localhost:3000/api/ingest/csv", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setMessage("CSV records ingested and processed successfully!");
        setFile(null);
        onUploadSuccess();
      } else {
        const errorData = await res.json();
        setMessage(`Upload failed: ${errorData.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("Error uploading CSV file. Ensure backend is running.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8 shadow-lg">
      <h3 className="text-lg font-semibold text-white mb-1">CSV / POS Data Ingestion</h3>
      <p className="text-sm text-slate-400 mb-4">Upload store POS export CSVs to process real-time audit analysis.</p>

      <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-4">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
        />

        <button
          type="submit"
          disabled={!file || uploading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2 rounded-lg transition disabled:opacity-50 whitespace-nowrap"
        >
          {uploading ? "Ingesting..." : "Upload & Process"}
        </button>
      </form>

      {message && (
        <p className={`text-xs mt-3 font-medium ${message.includes("failed") || message.includes("Error") ? "text-rose-400" : "text-emerald-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
}