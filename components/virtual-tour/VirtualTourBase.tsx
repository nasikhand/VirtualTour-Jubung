'use client';

import { useEffect, useRef, ReactNode, createContext, useContext, useState } from 'react';

declare const pannellum: any;
const PANNLUM_SCRIPT_ID = 'pannellum-script';
const PANNLUM_CSS_ID = 'pannellum-css';

type ViewerContextType = { viewer: any | null };
const ViewerContext = createContext<ViewerContextType | null>(null);
export const useViewer = () => useContext(ViewerContext);

type Props = {
  imageUrl: string;
  children?: ReactNode;
  onLoad?: (viewer: any) => void;
  onViewerClick?: (coords: { pitch: number, yaw: number }) => void;
};

export default function VirtualTourBase({ imageUrl, children, onLoad, onViewerClick }: Props) {
  const panoramaRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any | null>(null);

  useEffect(() => {
    const initializeViewer = () => {
      if (!panoramaRef.current) return;
      const pannellumViewer = pannellum.viewer(panoramaRef.current, {
        type: 'equirectangular', panorama: imageUrl, autoLoad: true, showControls: true, draggable: true,
      });
      pannellumViewer.on('load', () => {
        setViewer(pannellumViewer);
        if (onLoad) onLoad(pannellumViewer);
      });
      if (onViewerClick) {
        pannellumViewer.on('mousedown', (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          if (target.closest('.pnlm-hotspot, .pnlm-ctrl')) return;
          const coords = pannellumViewer.mouseEventToCoords(event);
          if (coords) onViewerClick({ pitch: coords[0], yaw: coords[1] });
        });
      }
    };

    if (typeof pannellum !== 'undefined') {
      initializeViewer();
    } else {
      if (!document.getElementById(PANNLUM_CSS_ID)) {
        const link = document.createElement('link');
        link.id = PANNLUM_CSS_ID; link.rel = 'stylesheet'; link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
        document.head.appendChild(link);
      }
      if (!document.getElementById(PANNLUM_SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = PANNLUM_SCRIPT_ID; script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
        script.async = true; script.onload = initializeViewer;
        document.body.appendChild(script);
      }
    }
    return () => {
      if (viewer) viewer.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  return (
    <ViewerContext.Provider value={{ viewer }}>
      <div className="relative w-full h-full bg-black">
        <div ref={panoramaRef} className="w-full h-full" />
        {viewer && (
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {children}
          </div>
        )}
      </div>
    </ViewerContext.Provider>
  );
}