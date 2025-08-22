'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Move } from 'lucide-react';

interface DraggableHotspotProps {
  onPositionChange: (coords: { pitch: number; yaw: number }) => void;
  onConfirm: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  viewerRef: React.RefObject<any>;
  initialPosition?: { x: number; y: number }; // Posisi awal dalam persentase
}

export default function DraggableHotspot({ 
  onPositionChange, 
  onConfirm, 
  containerRef, 
  viewerRef,
  initialPosition = { x: 50, y: 50 }
}: DraggableHotspotProps) {
  const [position, setPosition] = useState(initialPosition); // Percentage position
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const hotspotRef = useRef<HTMLDivElement>(null);

  const convertToCoords = (xPercent: number, yPercent: number) => {
    try {
      // Gunakan Pannellum viewer untuk konversi yang akurat
      const viewer = viewerRef.current;
      console.log('DraggableHotspot: Converting coordinates', { xPercent, yPercent, viewer });
      
      if (viewer && typeof viewer.screenToCoords === 'function') {
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (containerRect) {
          // Konversi persentase ke pixel coordinates
          const pixelX = (xPercent / 100) * containerRect.width;
          const pixelY = (yPercent / 100) * containerRect.height;
          
          console.log('DraggableHotspot: Pixel coordinates', { pixelX, pixelY, containerRect });
          
          // Gunakan Pannellum's screenToCoords untuk konversi akurat
          const coords = viewer.screenToCoords([pixelX, pixelY]);
          console.log('DraggableHotspot: Pannellum screenToCoords result', coords);
          
          if (Array.isArray(coords) && coords.length >= 2) {
            const result = { pitch: coords[0], yaw: coords[1] };
            console.log('DraggableHotspot: Final coordinates from Pannellum', result);
            return result;
          }
        }
      }
      
      // Fallback manual calculation yang lebih akurat
      console.log('DraggableHotspot: Using improved fallback manual calculation');
      
      // Konversi persentase ke normalized coordinates (-1 to 1)
      const xNormalized = (xPercent / 100) * 2 - 1; // 0-100% -> -1 to 1
      const yNormalized = 1 - (yPercent / 100) * 2; // 0-100% -> 1 to -1 (inverted Y)
      
      // Konversi ke spherical coordinates
      // Yaw: horizontal rotation (-180 to 180 degrees)
      const yaw = xNormalized * 180; // -180 to 180
      
      // Pitch: vertical rotation (-90 to 90 degrees)
      const pitch = yNormalized * 90; // -90 to 90
      
      const result = {
        yaw: Math.max(-180, Math.min(180, yaw)),
        pitch: Math.max(-90, Math.min(90, pitch))
      };
      
      console.log('DraggableHotspot: Improved fallback calculation result', {
        input: { xPercent, yPercent },
        normalized: { xNormalized, yNormalized },
        result
      });
      return result;
    } catch (error) {
      console.error('DraggableHotspot: Error converting coordinates:', error);
      // Return coordinates based on position instead of always (0,0)
      const xNormalized = (xPercent / 100) * 2 - 1;
      const yNormalized = 1 - (yPercent / 100) * 2;
      return {
        yaw: Math.max(-180, Math.min(180, xNormalized * 180)),
        pitch: Math.max(-90, Math.min(90, yNormalized * 90))
      };
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (position.x / 100) * (containerRef.current?.clientWidth || 0),
      y: e.clientY - (position.y / 100) * (containerRef.current?.clientHeight || 0)
    });
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    const newX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const newY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    
    setPosition({ x: newX, y: newY });
    
    // Update coordinates in real-time
    const coords = convertToCoords(newX, newY);
    onPositionChange(coords);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Update posisi dan koordinat saat initialPosition berubah
  useEffect(() => {
    setPosition(initialPosition);
    const coords = convertToCoords(initialPosition.x, initialPosition.y);
    onPositionChange(coords);
  }, [initialPosition.x, initialPosition.y]);

  const handleConfirm = () => {
    if (!containerRef.current) {
      console.error('DraggableHotspot: Container ref not available for confirmation');
      return;
    }
    
    const coords = convertToCoords(position.x, position.y);
    console.log('DraggableHotspot: Drag confirmed:', { position, coords });
    
    // Validasi koordinat - pastikan koordinat dalam range yang valid
    const isValidCoords = (
      coords.yaw >= -180 && coords.yaw <= 180 &&
      coords.pitch >= -90 && coords.pitch <= 90
    );
    
    if (!isValidCoords) {
      console.warn('DraggableHotspot: Invalid coordinate range detected, retrying conversion');
      // Retry beberapa kali dengan delay untuk memastikan viewer sudah ready
      let retryCount = 0;
      const maxRetries = 3;
      
      const retryConversion = () => {
        retryCount++;
        const retryCoords = convertToCoords(position.x, position.y);
        console.log(`DraggableHotspot: Retry ${retryCount} coordinates:`, retryCoords);
        
        const isRetryValid = (
          retryCoords.yaw >= -180 && retryCoords.yaw <= 180 &&
          retryCoords.pitch >= -90 && retryCoords.pitch <= 90
        );
        
        if (isRetryValid || retryCount >= maxRetries) {
          // Jika koordinat valid atau sudah mencoba maksimal, lanjutkan
          onPositionChange(retryCoords);
          onConfirm();
        } else {
          // Retry lagi dengan delay lebih lama
          setTimeout(retryConversion, 200 * retryCount);
        }
      };
      
      setTimeout(retryConversion, 100);
    } else {
      // Koordinat valid, langsung konfirmasi
      onPositionChange(coords);
      onConfirm();
    }
  };

  return (
    <div
      ref={hotspotRef}
      className={`absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-move ${
        isDragging ? 'scale-110' : 'hover:scale-105'
      } transition-transform`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative">
        {/* Hotspot Icon */}
        <div className="bg-red-500 text-white p-3 rounded-full shadow-lg border-2 border-white">
          <MapPin size={24} />
        </div>
        
        {/* Drag Indicator */}
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white p-1 rounded-full">
          <Move size={12} />
        </div>
        
        {/* Confirm Button */}
        <button
          onClick={handleConfirm}
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors whitespace-nowrap"
        >
          Konfirmasi Posisi
        </button>
      </div>
    </div>
  );
}