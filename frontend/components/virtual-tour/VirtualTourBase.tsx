'use client';

import { useEffect, useRef, ReactNode } from 'react';

type Props = {
  imageUrl: string;
  children?: ReactNode;
  onLoad?: (viewer: any) => void;
};

declare const pannellum: any;
const PANNLUM_SCRIPT_ID = 'pannellum-script';
const PANNLUM_CSS_ID = 'pannellum-css';

export default function VirtualTourBase({ imageUrl, children, onLoad }: Props) {
  const panoramaRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    const initializeViewer = () => {
      if (!panoramaRef.current) return;
      
      const viewer = pannellum.viewer(panoramaRef.current, {
        type: 'equirectangular',
        panorama: imageUrl,
        autoLoad: true,
        showControls: true,
        draggable: true,
      });
      viewerRef.current = viewer;

      if (onLoad) {
        viewer.on('load', () => onLoad(viewer));
      }
    };

    if (typeof pannellum !== 'undefined') {
      initializeViewer();
    } else {
      if (!document.getElementById(PANNLUM_CSS_ID)) {
        const link = document.createElement('link');
        link.id = PANNLUM_CSS_ID;
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css';
        document.head.appendChild(link);
      }
      if (!document.getElementById(PANNLUM_SCRIPT_ID)) {
        const script = document.createElement('script');
        script.id = PANNLUM_SCRIPT_ID;
        script.src = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js';
        script.async = true;
        script.onload = initializeViewer;
        document.body.appendChild(script);
      }
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [imageUrl, onLoad]);

  return (
    <div className="relative w-full h-full bg-black">
      <div ref={panoramaRef} className="w-full h-full" />
      {children && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {children}
        </div>
      )}
    </div>
  );
}