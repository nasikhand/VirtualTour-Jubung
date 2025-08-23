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
      // Gunakan Pannellum viewer untuk konversi yang akurat (sama seperti click mode)
      const viewer = viewerRef.current;
      console.log('DraggableHotspot: Converting coordinates', { xPercent, yPercent, viewer });
      
      if (viewer && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        
        // Konversi persentase ke pixel coordinates relatif terhadap container
        const pixelX = (xPercent / 100) * containerRect.width;
        const pixelY = (yPercent / 100) * containerRect.height;
        
        console.log('DraggableHotspot: Pixel coordinates', { pixelX, pixelY, containerRect });
        
        // Buat mock mouse event untuk menggunakan mouseEventToCoords seperti click mode
        const mockEvent = {
          clientX: containerRect.left + pixelX,
          clientY: containerRect.top + pixelY,
          target: containerRef.current
        } as MouseEvent;
        
        // Gunakan mouseEventToCoords yang sama dengan click mode untuk konsistensi
        if (typeof viewer.mouseEventToCoords === 'function') {
          const coords = viewer.mouseEventToCoords(mockEvent);
          console.log('DraggableHotspot: mouseEventToCoords result', coords);
          
          if (Array.isArray(coords) && coords.length >= 2) {
            const result = { pitch: coords[0], yaw: coords[1] };
            console.log('DraggableHotspot: Final coordinates from mouseEventToCoords', result);
            return result;
          }
        }
        
        // Fallback ke screenToCoords jika mouseEventToCoords tidak tersedia
        if (typeof viewer.screenToCoords === 'function') {
          const coords = viewer.screenToCoords([pixelX, pixelY]);
          console.log('DraggableHotspot: screenToCoords result', coords);
          
          if (Array.isArray(coords) && coords.length >= 2) {
            const result = { pitch: coords[0], yaw: coords[1] };
            console.log('DraggableHotspot: Final coordinates from screenToCoords', result);
            return result;
          }
        }
      }
      
      // Fallback: konversi manual (hanya jika viewer tidak tersedia)
      console.warn('DraggableHotspot: Using fallback coordinate conversion');
      
      // Konversi persentase ke normalized coordinates (-1 to 1)
      const xNormalized = (xPercent / 100) * 2 - 1; // 0-100% -> -1 to 1
      const yNormalized = 1 - (yPercent / 100) * 2; // 0-100% -> 1 to -1 (inverted Y)
      
      // Konversi langsung ke koordinat panorama
      const yaw = xNormalized * 180; // Full range -180 to 180
      const pitch = yNormalized * 90; // Full range -90 to 90
      
      const result = {
        yaw: Math.max(-180, Math.min(180, yaw)),
        pitch: Math.max(-90, Math.min(90, pitch))
      };
      
      console.log('DraggableHotspot: Fallback coordinate calculation', {
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
    // Simpan offset mouse relatif terhadap hotspot untuk drag yang smooth
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const hotspotCenterX = rect.left + (position.x / 100) * rect.width;
      const hotspotCenterY = rect.top + (position.y / 100) * rect.height;
      setDragStart({
        x: e.clientX - hotspotCenterX,
        y: e.clientY - hotspotCenterY
      });
    }
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Hitung posisi baru dengan mempertimbangkan offset drag
    const newPixelX = e.clientX - dragStart.x - rect.left;
    const newPixelY = e.clientY - dragStart.y - rect.top;
    
    // Konversi ke persentase dan batasi dalam range 0-100%
    const newX = Math.max(0, Math.min(100, (newPixelX / rect.width) * 100));
    const newY = Math.max(0, Math.min(100, (newPixelY / rect.height) * 100));
    
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
    
    // Pastikan menggunakan posisi terkini dari state
    const finalCoords = convertToCoords(position.x, position.y);
    console.log('DraggableHotspot: Final confirmation:', { 
      currentPosition: position, 
      finalCoords,
      initialPosition 
    });
    
    // Validasi koordinat - pastikan koordinat dalam range yang valid
    const isValidCoords = (
      finalCoords.yaw >= -180 && finalCoords.yaw <= 180 &&
      finalCoords.pitch >= -90 && finalCoords.pitch <= 90 &&
      !isNaN(finalCoords.yaw) && !isNaN(finalCoords.pitch)
    );
    
    if (!isValidCoords) {
      console.warn('DraggableHotspot: Invalid coordinate range detected, using fallback');
      // Gunakan fallback calculation yang lebih sederhana
      const fallbackCoords = {
        yaw: ((position.x / 100) * 2 - 1) * 180,
        pitch: (1 - (position.y / 100) * 2) * 90
      };
      console.log('DraggableHotspot: Using fallback coordinates:', fallbackCoords);
      onPositionChange(fallbackCoords);
      onConfirm();
    } else {
      // Koordinat valid, langsung konfirmasi dengan posisi final
      console.log('DraggableHotspot: Confirming with valid coordinates:', finalCoords);
      onPositionChange(finalCoords);
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