'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Check, X } from 'lucide-react';
import { throttle } from '@/lib/utils';

interface DraggableHotspotProps {
  onPositionChange: (coords: { pitch: number; yaw: number } | null) => void;
  onConfirm: () => void;
  onCancel: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  viewerRef: React.RefObject<any>;
  initialPosition?: { x: number; y: number };
}

export default function DraggableHotspot({
  onPositionChange,
  onConfirm,
  onCancel,
  containerRef,
  viewerRef,
  initialPosition = { x: 50, y: 50 }
}: DraggableHotspotProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const hotspotRef = useRef<HTMLDivElement>(null);

  // 🔑 Gunakan mesin konversi Pannellum, bukan util manual
  const toSphereWithViewer = useCallback((clientX: number, clientY: number) => {
    try {
      const viewer = (viewerRef.current as any)?.getViewer?.();
      const containerEl = containerRef.current;
      if (!viewer || !containerEl) return null;

      // Fake MouseEvent minimal untuk Pannellum
      const fakeEvent = {
        clientX,
        clientY,
        target: containerEl
      } as unknown as MouseEvent;

      const coords = viewer.mouseEventToCoords(fakeEvent);
      if (Array.isArray(coords) && coords.length >= 2) {
        const [pitch, yaw] = coords;
        return { pitch, yaw };
      }
      return null;
    } catch (err) {
      console.error('toSphereWithViewer error:', err);
      return null;
    }
  }, [viewerRef, containerRef]);

  const handleMouseDown = useCallback(() => {
    setIsDragging(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();

    // Posisi % untuk UI pin
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.max(0, Math.min(100, xPct));
    const clampedY = Math.max(0, Math.min(100, yPct));
    setPosition({ x: clampedX, y: clampedY });

    // Pitch/Yaw akurat dari viewer (sama dgn click mode)
    const sphereCoords = toSphereWithViewer(e.clientX, e.clientY);
    if (sphereCoords) {
      onPositionChange(sphereCoords);
    }
  }, [isDragging, containerRef, toSphereWithViewer, onPositionChange]);

  // Throttle untuk performa
  const throttledMouseMove = useCallback(
    throttle(handleMouseMove, 16),
    [handleMouseMove]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleConfirm = useCallback(() => {
    // Koordinat terakhir sudah dikirim ke parent via onPositionChange (tersimpan di dragCoords di HotspotEditor)
    onConfirm();
  }, [onConfirm]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', throttledMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', throttledMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, throttledMouseMove, handleMouseUp]);

  return (
    <div className="absolute inset-0 z-25 pointer-events-none">
      {/* Draggable Hotspot */}
      <div
        ref={hotspotRef}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-auto ${isDragging ? 'scale-110 z-30' : 'hover:scale-105'} cursor-grab active:cursor-grabbing`}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Hotspot Icon */}
        <div className="relative">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <MapPin size={16} className="text-white" />
          </div>
          {/* Crosshair Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-6 h-6 border border-white rounded-full opacity-50"></div>
          </div>
        </div>

        {/* Position Indicator */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          {Math.round(position.x)}, {Math.round(position.y)}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 pointer-events-auto">
        <button
          onClick={handleConfirm}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Check size={16} />
          Konfirmasi Posisi
        </button>
        <button
          onClick={onCancel}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <X size={16} />
          Batal
        </button>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm pointer-events-auto">
        + Gerakkan hotspot ke posisi yang diinginkan, lalu klik 'Konfirmasi Posisi'
      </div>
    </div>
  );
}
