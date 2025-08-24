'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Check, X } from 'lucide-react';
import { coordinateUtils } from '@/lib/utils';

interface DraggableHotspotProps {
  onPositionChange: (coords: { pitch: number; yaw: number }) => void;
  onConfirm: () => void;
  onCancel: () => void;
  initialPosition?: { x: number; y: number };
  currentViewerPosition?: { pitch: number; yaw: number };
}

export default function DraggableHotspot({ 
  onPositionChange, 
  onConfirm, 
  onCancel,
  initialPosition = { x: 50, y: 50 },
  currentViewerPosition
}: DraggableHotspotProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hotspotRef = useRef<HTMLDivElement>(null);

  // Initialize position based on current viewer position if available
  useEffect(() => {
    if (currentViewerPosition && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const screenCoords = coordinateUtils.sphereToScreen(
        currentViewerPosition.pitch,
        currentViewerPosition.yaw,
        rect.width,
        rect.height
      );
      
      const x = (screenCoords.x / rect.width) * 100;
      const y = (screenCoords.y / rect.height) * 100;
      
      setPosition({ x, y });
    }
  }, [currentViewerPosition]);

  // Simplified readiness check - only require container
  useEffect(() => {
    const checkReady = () => {
      if (containerRef.current) {
        setIsReady(true);
        setError(null);
      } else {
        setIsReady(false);
        setError("Container tidak tersedia");
      }
    };

    checkReady();
    const interval = setInterval(checkReady, 500);
    return () => clearInterval(interval);
  }, []);

  const convertToSphereCoords = useCallback((x: number, y: number) => {
    try {
      if (!containerRef.current) {
        throw new Error("Container tidak tersedia");
      }

      const rect = containerRef.current.getBoundingClientRect();
      
      // Convert relative position to sphere coordinates
      const coords = coordinateUtils.screenToSphere(x, y, rect.width, rect.height);
      
      if (!coordinateUtils.isValidSphereCoords(coords.pitch, coords.yaw)) {
        throw new Error("Koordinat tidak valid");
      }

      return coordinateUtils.normalizeSphereCoords(coords.pitch, coords.yaw);
    } catch (err) {
      console.error('Error converting coordinates:', err);
      setError(err instanceof Error ? err.message : "Error konversi koordinat");
      return null;
    }
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isReady) return;
    
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setError(null);
  }, [isReady]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Clamp values to container bounds
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));

    setPosition({ x: clampedX, y: clampedY });

    const sphereCoords = convertToSphereCoords(e.clientX - rect.left, e.clientY - rect.top);
    if (sphereCoords) {
      onPositionChange(sphereCoords);
    }
  }, [isDragging, convertToSphereCoords, onPositionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleConfirm = useCallback(() => {
    if (!isReady) {
      setError("Viewer belum siap");
      return;
    }

    const sphereCoords = convertToSphereCoords(
      (position.x / 100) * (containerRef.current?.offsetWidth || 0),
      (position.y / 100) * (containerRef.current?.offsetHeight || 0)
    );

    if (sphereCoords) {
      onConfirm();
    } else {
      setError("Koordinat tidak valid. Pastikan viewer sudah dimuat sepenuhnya.");
    }
  }, [isReady, position, convertToSphereCoords, onConfirm]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Always render, show loading state when not ready
  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 z-50 cursor-crosshair"
      style={{ pointerEvents: isReady ? 'auto' : 'none' }}
    >
      {/* Loading/Error State */}
      {!isReady && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-gray-700">Menunggu viewer...</p>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
        </div>
      )}

      {/* Draggable Hotspot */}
      <div
        ref={hotspotRef}
        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
          isDragging ? 'scale-110 z-60' : 'hover:scale-105'
        } ${isReady ? 'cursor-grab active:cursor-grabbing' : 'cursor-not-allowed'}`}
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
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        <button
          onClick={handleConfirm}
          disabled={!isReady}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:cursor-not-allowed"
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
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm">
        + Gerakkan hotspot ke posisi yang diinginkan, lalu klik 'Konfirmasi Posisi'
      </div>

      {/* Error Display */}
      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm max-w-md text-center">
          {error}
        </div>
      )}
    </div>
  );
}