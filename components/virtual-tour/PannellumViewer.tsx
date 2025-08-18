'use client';

import { useEffect, useRef, useState } from 'react';
import { Hotspot } from '@/types/virtual-tour';

type Props = {
  imageUrl: string;
  initialYaw?: number;
  initialPitch?: number;
  hotspots?: Hotspot[];
  onViewerClick?: (coords: { pitch: number, yaw: number }) => void;
  onHotspotClick?: (hotspot: Hotspot) => void;
  onCameraUpdate?: (position: { yaw: number, pitch: number }) => void;
};

const PANNLUM_SCRIPT_ID = 'pannellum-script';
const PANNLUM_CSS_ID = 'pannellum-css';

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
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (document.getElementById(PANNLUM_SCRIPT_ID)) {
      setIsScriptLoaded(true);
      return;
    }
    const link = document.createElement('link');
    link.id = PANNLUM_CSS_ID;
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
    document.head.appendChild(link);
    const script = document.createElement('script');
    script.id = PANNLUM_SCRIPT_ID;
    script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
    script.async = true;
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !panoramaRef.current || !imageUrl) return;
    
    // Check if pannellum is available
    if (!(window as any).pannellum || !(window as any).pannellum.viewer) {
      console.error('Pannellum library not loaded properly');
      return;
    }

    const viewer = (window as any).pannellum.viewer(panoramaRef.current, {
      type: 'equirectangular',
      panorama: imageUrl,
      autoLoad: true,
      yaw: initialYaw,
      pitch: initialPitch,
      hotSpots: hotspots.map(h => ({
        id: String(h.id),
        pitch: h.pitch,
        yaw: h.yaw,
        text: h.label,
        cssClass: h.type === 'link' 
          ? `custom-link-hotspot hotspot-icon-${h.icon_name || 'default'}` 
          : 'custom-info-hotspot',
        clickHandlerFunc: onHotspotClick ? () => onHotspotClick(h) : undefined,
      })),
    });

    if (onViewerClick && viewer) {
      viewer.on('mousedown', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest('.pnlm-hotspot, .pnlm-ctrl')) return;
        const coords = viewer.mouseEventToCoords(event);
        if (coords) onViewerClick({ pitch: coords[0], yaw: coords[1] });
      });
    }

    // Add camera update listener
    if (onCameraUpdate && viewer) {
      const updatePosition = () => {
        const yaw = viewer.getYaw();
        const pitch = viewer.getPitch();
        onCameraUpdate({ yaw, pitch });
      };
      
      viewer.on('animatefinished', updatePosition);
      viewer.on('mouseup', updatePosition);
      viewer.on('touchend', updatePosition);
    }

    return () => {
      if (viewer && viewer.destroy) {
        viewer.destroy();
      }
    };
  }, [isScriptLoaded, imageUrl, hotspots, onHotspotClick, onViewerClick, onCameraUpdate, initialYaw, initialPitch]);

  return (
    <div ref={panoramaRef} className="w-full h-full bg-gray-200">
      {!isScriptLoaded && <div className="w-full h-full flex items-center justify-center text-gray-500">Memuat viewer...</div>}
    </div>
  );
}