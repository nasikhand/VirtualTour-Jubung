// frontend/components/virtual-tour/PannellumViewer.tsx

'use client';

import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { Hotspot, PannellumViewer as PannellumViewerType, PannellumViewerRef } from '@/types/virtual-tour';

type Props = {
  imageUrl: string;
  initialYaw?: number;
  initialPitch?: number;
  hotspots?: Hotspot[];
  onViewerClick?: (coords: { pitch: number; yaw: number }) => void;
  onHotspotClick?: (hotspot: Hotspot) => void;
  onCameraUpdate?: (position: { yaw: number; pitch: number }) => void;
  onLoad?: () => void;
};

const PannellumViewer = forwardRef<PannellumViewerRef, Props>(function PannellumViewer({
  imageUrl,
  initialYaw = 0,
  initialPitch = 0,
  hotspots = [],
  onViewerClick,
  onHotspotClick,
  onCameraUpdate,
  onLoad,
}, ref) {
  const panoramaRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<PannellumViewerType | null>(null);
  
  useImperativeHandle(ref, () => ({
    addHotspot,
    removeHotspot,
    updateHotspots,
    getViewer: () => viewerRef.current,
  }));

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // WebGL support check
  const isWebGLSupported = () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (!isWebGLSupported()) {
      setError('WebGL not supported in this browser.');
    }
  }, []);

  const loadPannellumScripts = useCallback(() => {
    if (typeof window.pannellum !== 'undefined') {
      setIsScriptLoaded(true);
      return;
    }

    if (!document.getElementById('pannellum-css')) {
      const link = document.createElement('link');
      link.id = 'pannellum-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
      document.head.appendChild(link);
    }

    if (!document.getElementById('pannellum-js')) {
      const script = document.createElement('script');
      script.id = 'pannellum-js';
      script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
      script.async = true;
      script.onload = () => {
        setIsScriptLoaded(true);
      };
      script.onerror = () => {
        setError('Failed to load Pannellum library');
      };
      document.body.appendChild(script);
    }
  }, []);

  const initializeViewer = useCallback(() => {
    if (!isScriptLoaded || !panoramaRef.current || !imageUrl) {
      return;
    }

    if (!window.pannellum || typeof window.pannellum.viewer !== 'function') {
      setError('Pannellum library not available');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (err) {
          console.warn('Error destroying previous viewer:', err);
        }
        viewerRef.current = null;
      }

      const viewer = window.pannellum.viewer(panoramaRef.current, {
        type: 'equirectangular',
        panorama: imageUrl,
        autoLoad: true,
        yaw: initialYaw,
        pitch: initialPitch,
        showControls: false, // Disable default controls
        showZoomCtrl: false, // Disable zoom controls
        showFullscreenCtrl: false, // Disable fullscreen control
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

      viewer.on('load', () => {
        setIsLoading(false);
        setError(null);
        if (onLoad) {
          onLoad();
        }
      });

      viewer.on('error', (err: any) => {
        setIsLoading(false);
        setError('Failed to load panorama image');
        console.error('Pannellum error:', err);
      });

      if (onViewerClick) {
        viewer.on('mousedown', (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          if (target.closest('.pnlm-hotspot, .pnlm-ctrl')) return;
          
          try {
            const coords = viewer.mouseEventToCoords(event);
            if (coords && Array.isArray(coords) && coords.length >= 2) {
              const [pitch, yaw] = coords;
              onViewerClick({ pitch, yaw });
            }
          } catch (err) {
            console.error('Click error:', err);
          }
        });
      }

      if (onCameraUpdate) {
        viewer.on('animatefinished', () => {
          try {
            const yaw = (viewer as any).getYaw ? (viewer as any).getYaw() : undefined;
            const pitch = (viewer as any).getPitch ? (viewer as any).getPitch() : undefined;
            if (typeof yaw === 'number' && typeof pitch === 'number') {
              onCameraUpdate({ yaw, pitch });
            }
          } catch (err) {
            console.error('Camera update error:', err);
          }
        });
      }

    } catch (err) {
      console.error('Initialization error:', err);
      setError('Failed to initialize viewer');
      setIsLoading(false);
    }
  }, [isScriptLoaded, imageUrl, initialYaw, initialPitch, hotspots, onViewerClick, onHotspotClick, onCameraUpdate, onLoad]);

  useEffect(() => {
    loadPannellumScripts();
  }, [loadPannellumScripts]);

  useEffect(() => {
    initializeViewer();
  }, [initializeViewer]);

  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (err) {
          console.warn('Failed to destroy viewer:', err);
        }
      }
    };
  }, []);

  const addHotspot = useCallback((hotspot: Hotspot) => {
    if (!viewerRef.current) return;

    try {
      const existingHotspots = viewerRef.current.getHotSpots();
      const existingIds = existingHotspots.map((h: any) => h.id);
      
      if (existingIds.includes(String(hotspot.id))) {
        try {
          viewerRef.current.removeHotSpot(String(hotspot.id));
        } catch (removeError) {
          console.warn('Failed to remove hotspot:', hotspot.id, removeError);
        }
      }

      try {
        viewerRef.current.addHotSpot({
          id: String(hotspot.id),
          pitch: hotspot.pitch,
          yaw: hotspot.yaw,
          text: hotspot.label,
          cssClass: `custom-hotspot ${hotspot.type}-hotspot hotspot-icon-${hotspot.icon_name || 'default'}`,
          clickHandlerFunc: onHotspotClick ? () => onHotspotClick(hotspot) : undefined,
        });
      } catch (addError) {
        console.error('Failed to add hotspot:', hotspot, addError);
      }
    } catch (getError) {
      console.warn('Failed to get existing hotspots, continuing with add:', getError);
    }
  }, [onHotspotClick]);

  const removeHotspot = useCallback((id: string | number) => {
    if (!viewerRef.current) return;

    try {
      viewerRef.current.removeHotSpot(String(id));
    } catch (error) {
      console.error('Failed to remove hotspot:', id, error);
    }
  }, []);

  const updateHotspots = useCallback((newHotspots: Hotspot[]) => {
    if (!viewerRef.current) return;

    try {
      const existingHotspots = viewerRef.current.getHotSpots();
      existingHotspots.forEach((hotspot: any) => {
        try {
          viewerRef.current!.removeHotSpot(hotspot.id);
        } catch (error) {
          console.warn('Failed to remove existing hotspot:', error);
        }
      });

      newHotspots.forEach(hotspot => {
        addHotspot(hotspot);
      });
    } catch (error) {
      console.error('Failed to update hotspots:', error);
    }
  }, [addHotspot]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading panorama</p>
          <p className="text-sm text-gray-600">{error}</p>
          <button 
            onClick={() => {
              setError(null);
              setIsLoading(true);
              initializeViewer();
            }}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Loading panorama...</p>
          </div>
        </div>
      )}
      
      <div 
        ref={panoramaRef} 
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
});

PannellumViewer.displayName = 'PannellumViewer';

export default PannellumViewer;
