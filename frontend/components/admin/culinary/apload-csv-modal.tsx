"use client";

import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UploadCsvModal({
  onClose,
  onSelectFile,
}: {
  onClose: () => void;
  onSelectFile: (file: File | null) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4 text-blue-700">Unggah Data CSV</h2>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => onSelectFile(e.target.files?.[0] || null)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition mb-3"
        />
        <p className="text-xs text-gray-500 mb-4">Hanya mendukung file .csv</p>
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1 border border-gray-300 hover:bg-gray-100"
          >
            Batal
          </Button>
          <Button
            onClick={onClose}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Unggah
          </Button>
        </div>
      </div>
    </div>
  );
}
