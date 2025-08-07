'use client'

import { useState, useEffect } from 'react'
import PannellumViewer from './VirtualTourBase' // ✅ pastikan path ini sesuai

type Props = {
  isOpen: boolean
  onClose: () => void
  currentPosition: { yaw: number; pitch: number }
  onSave: (data: { yaw: number, pitch: number, hfov: number }) => void
  imageUrl: string // ✅ ditambahkan
}

export default function AdjustRotationModal({
  isOpen,
  onClose,
  currentPosition,
  onSave,
  imageUrl
}: Props) {
  const [yaw, setYaw] = useState(0)
  const [pitch, setPitch] = useState(0)
  const [hfov, setHfov] = useState(100)

  // Inisialisasi saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      setYaw(currentPosition.yaw)
      setPitch(currentPosition.pitch)
      setHfov(100)
    }
  }, [isOpen, currentPosition])

  const handleSave = () => {
    onSave({ yaw, pitch, hfov })
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl animate-fade-in-scale">
        {/* Header */}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Adjust Default View</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Preview Panorama */}
        <div className="h-72 md:h-96 border-b">
          <PannellumViewer
            key={`${yaw}-${pitch}`} // render ulang saat slider berubah
            imageUrl={imageUrl}
            initialYaw={yaw}
            initialPitch={pitch}
            isDraggable={true}
          />
        </div>

        {/* Sliders */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-6 items-center gap-4">
            <label className="text-sm font-medium text-gray-700 col-span-1">Yaw (X)</label>
            <input
              type="range"
              min="-180"
              max="180"
              value={yaw}
              onChange={(e) => setYaw(Number(e.target.value))}
              className="col-span-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600 font-mono text-center col-span-1">
              {yaw.toFixed(0)}°
            </span>
          </div>
          <div className="grid grid-cols-6 items-center gap-4">
            <label className="text-sm font-medium text-gray-700 col-span-1">Pitch (Y)</label>
            <input
              type="range"
              min="-90"
              max="90"
              value={pitch}
              onChange={(e) => setPitch(Number(e.target.value))}
              className="col-span-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600 font-mono text-center col-span-1">
              {pitch.toFixed(0)}°
            </span>
          </div>
          <div className="grid grid-cols-6 items-center gap-4">
            <label className="text-sm font-medium text-gray-700 col-span-1">Zoom (Z)</label>
            <input
              type="range"
              min="40"
              max="140"
              value={hfov}
              onChange={(e) => setHfov(Number(e.target.value))}
              className="col-span-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600 font-mono text-center col-span-1">
              {hfov.toFixed(0)}
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold transition-colors"
          >
            CLOSE
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors"
          >
            SAVE
          </button>
        </div>
      </div>
    </div>
  )
}
