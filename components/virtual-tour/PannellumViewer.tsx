// frontend/components/virtual-tour/PannellumViewer.tsx
'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Hotspot } from '@/types/virtual-tour';

// Deklarasikan pannellum pada object window untuk type safety
declare global {
  interface Window {
    pannellum: any;
  }
}

type Props = {
  imageUrl: string;
  initialYaw?: number;
  initialPitch?: number;
  hotspots?: Hotspot[];
  onViewerClick?: (coords: { pitch: number; yaw: number }) => void;
  onHotspotClick?: (hotspot: Hotspot) => void;
  onCameraUpdate?: (position: { yaw: number; pitch: number }) => void;
};

export default function PannellumViewer({
  imageUrl,
  initialYaw = 0,
  initialPitch = 0,
  hotspots = [],
  onViewerClick,
  onHotspotClick,
  onCameraUpdate,
}: Props) {
  const panoramaRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load Pannellum scripts
  const loadPannellumScripts = useCallback(() => {
    if (typeof window.pannellum !== 'undefined') {
      setIsScriptLoaded(true);
      return;
    }

    // Load CSS
    if (!document.getElementById('pannellum-css')) {
      const link = document.createElement('link');
      link.id = 'pannellum-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    }

    // Load JS
    if (!document.getElementById('pannellum-js')) {
      const script = document.createElement('script');
      script.id = 'pannellum-js';
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.async = true;
      script.onload = () => setIsScriptLoaded(true);
      script.onerror = () => setError('Failed to load Pannellum library');
      document.body.appendChild(script);
    }
  }, []);

  // Initialize viewer
  const initializeViewer = useCallback(() => {
    if (!isScriptLoaded || !panoramaRef.current || !imageUrl || isInitialized) {
      if (!isScriptLoaded || !panoramaRef.current || !imageUrl) {
        return;
      }
      return;
    }

    if (!window.pannellum || typeof window.pannellum.viewer !== 'function') {
      setError('Pannellum library not available');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Destroy existing viewer
      if (viewerRef.current) {
         viewerRef.current.destroy();
         viewerRef.current = null;
       }

       const viewer = window.pannellum.viewer(panoramaRef.current, {
         type: 'equirectangular',
         panorama: imageUrl,
         autoLoad: true,
         yaw: initialYaw,
         pitch: initialPitch,
         showControls: true,
         draggable: true,
         hotSpots: hotspots?.map(h => ({
           id: String(h.id),
           pitch: h.pitch,
           yaw: h.yaw,
           text: h.label,
           cssClass: `custom-hotspot ${h.type}-hotspot hotspot-icon-${h.icon_name || 'default'}`,
           clickHandlerFunc: onHotspotClick ? () => onHotspotClick(h) : undefined,
         })) || [],
       });

       viewerRef.current = viewer;
       setIsInitialized(true);

       // Event listeners
       viewer.on('load', () => {
         setIsLoading(false);
         setError(null);
       });

       viewer.on('error', (err: any) => {
         setIsLoading(false);
         setError('Failed to load panorama image');
         console.error('Pannellum error:', err);
       });

       if (onViewerClick) {
         viewer.on('click', (event: MouseEvent) => {
           const target = event.target as HTMLElement;
           if (target.closest('.pnlm-hotspot, .pnlm-ctrl')) return;
           const coords = viewer.mouseEventToCoords(event);
           if (coords) {
             console.log('Viewer clicked at:', coords);
             onViewerClick({ pitch: coords[0], yaw: coords[1] });
           }
         });
       }

       if (onCameraUpdate) {
         const updatePosition = () => {
           onCameraUpdate({ yaw: viewer.getYaw(), pitch: viewer.getPitch() });
         };
         viewer.on('animatefinished', updatePosition);
         viewer.on('mouseup', updatePosition);
         viewer.on('touchend', updatePosition);
       }

     } catch (err) {
       setIsLoading(false);
       setError('Failed to initialize panorama viewer');
       console.error('Pannellum initialization error:', err);
     }
   }, [imageUrl, initialYaw, initialPitch, hotspots, onViewerClick, onHotspotClick, onCameraUpdate, isScriptLoaded, isInitialized]);

   // Load scripts on mount
   useEffect(() => {
     if (imageUrl) {
       setIsInitialized(false); // Reset initialization flag for new image
       loadPannellumScripts();
     }
   }, [imageUrl, loadPannellumScripts]);

   // Initialize viewer when scripts are loaded
   useEffect(() => {
     if (isScriptLoaded && imageUrl) {
       const timer = setTimeout(() => {
         initializeViewer();
       }, 100);
       
       return () => clearTimeout(timer);
     }
   }, [isScriptLoaded, imageUrl, initializeViewer]);

   // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
      setIsInitialized(false);
    };
  }, []);

   // Separate effect for hotspot updates to avoid re-initializing viewer
   useEffect(() => {
     if (viewerRef.current && window.pannellum) {
       // Update hotspots without reinitializing the entire viewer
       try {
         const viewer = viewerRef.current;
         // Remove existing hotspots
         const existingHotspots = viewer.getScene().getHotSpotIds();
         existingHotspots.forEach((id: string) => {
           viewer.removeHotSpot(id);
         });
         
         // Add new hotspots
         hotspots.forEach((hotspot) => {
           viewer.addHotSpot({
             id: hotspot.id.toString(),
             pitch: hotspot.pitch,
             yaw: hotspot.yaw,
             type: 'info',
             text: hotspot.title,
             clickHandlerFunc: () => onHotspotClick?.(hotspot),
           });
         });
       } catch (error) {
         console.warn('Failed to update hotspots:', error);
       }
     }
   }, [hotspots, onHotspotClick]);

  return (
    <div className="relative w-full h-full bg-gray-900">
      <div ref={panoramaRef} className="w-full h-full" />
      
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-lg font-medium">Memuat panorama...</p>
            <p className="text-sm text-gray-300 mt-2">Mohon tunggu sebentar</p>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="text-center text-white max-w-md mx-auto p-6">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold mb-2">Gagal Memuat Panorama</h3>
            <p className="text-gray-300 mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null);
                setIsLoading(true);
                initializeViewer();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}