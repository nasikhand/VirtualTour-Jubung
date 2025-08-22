'use client';

import { useState, useRef, useEffect } from 'react';
import { MapPin, Move } from 'lucide-react';

interface DraggableHotspotProps {
  onPositionChange: (coords: { pitch: number; yaw: number }) => void;
  onConfirm: () => void;
  containerRef: React.RefObject<HTMLDivElement>;
  viewerRef: React.RefObject<any>;
}

export default function DraggableHotspot({ 
  onPositionChange, 
  onConfirm, 
  containerRef, 
  viewerRef 
}: DraggableHotspotProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 }); // Percentage position
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const hotspotRef = useRef<HTMLDivElement>(null);

  const convertToCoords = (x: number, y: number) => {
    if (!containerRef.current || !viewerRef.current) return { pitch: 0, yaw: 0 };
    
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Convert percentage to normalized coordinates (-1 to 1)
    const normalizedX = (x / 100) * 2 - 1; // Convert 0-100% to -1 to 1
    const normalizedY = (y / 100) * 2 - 1; // Convert 0-100% to -1 to 1
    
    // Convert to pannellum coordinates with proper field of view
    const hfov = 100; // Default horizontal field of view
    const vfov = 60;  // Default vertical field of view
    
    const yaw = normalizedX * (hfov / 2);
    const pitch = -normalizedY * (vfov / 2); // Negative for correct direction
    
    return { pitch, yaw };
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

  const handleConfirm = () => {
    const coords = convertToCoords(position.x, position.y);
    onPositionChange(coords);
    onConfirm();
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