'use client'

import { AlertTriangle, LoaderCircle } from 'lucide-react'

type Props = {
  isOpen: boolean,
  onClose: () => void,
  onConfirm: () => void,
  isLoading: boolean
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm, isLoading }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 text-center animate-fade-in-scale">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Hapus Scene</h3>
        <p className="mt-2 text-sm text-gray-500">
          Apakah Anda yakin ingin menghapus scene ini? Tindakan ini tidak dapat diurungkan.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? <LoaderCircle className="animate-spin" size={18} /> : null}
            {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
}