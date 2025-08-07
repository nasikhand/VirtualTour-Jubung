"use client";

import React from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}

export default function DeleteModal({ onClose, onConfirm, deleting }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-sm shadow relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
        <p className="mb-4 text-sm text-gray-600">Apakah kamu yakin ingin menghapus destinasi ini?</p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 border border-gray-400 rounded px-3 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className={`flex-1 bg-red-600 text-white rounded px-3 py-2 hover:bg-red-700 transition ${
              deleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {deleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
