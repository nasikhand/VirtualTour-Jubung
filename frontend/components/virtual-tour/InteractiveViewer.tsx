'use client';

import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from 'react';

// Deklarasi agar TypeScript mengenali 'pannellum' dari script global
declare const pannellum: any;

// Tipe untuk data viewer yang akan dibagikan
type ViewerContextType = {
  viewer: any | null;
};

// Membuat Context untuk berbagi data viewer
const ViewerContext = createContext<ViewerContextType | null>(null);

// Hook custom untuk mempermudah akses ke context
export const useViewer = () => {
  const context = useContext(ViewerContext);
  if (!context) {
    throw new Error('useViewer harus digunakan di dalam InteractiveViewer');
  }
  return context;
};

// Tipe untuk props komponen utama
type Props = {
  imageUrl: string;
  children: ReactNode;
};

export default function InteractiveViewer({ imageUrl, children }: Props) {
  const panoramaRef = useRef<HTMLDivElement>(null);
  const [viewer, setViewer] = useState<any | null>(null);

  useEffect(() => {
    if (!imageUrl || !panoramaRef.current || typeof pannellum === 'undefined') {
      return;
    }

    const pannellumViewer: any = pannellum.viewer(panoramaRef.current, {
      type: 'equirectangular',
      panorama: imageUrl,
      autoLoad: true,
      showControls: true,
      draggable: true,
    });

    pannellumViewer.on('load', () => {
      setViewer(pannellumViewer);
    });

    return () => {
      pannellumViewer.destroy();
      setViewer(null);
    };
  }, [imageUrl]);

  return (
    <ViewerContext.Provider value={{ viewer }}>
      <div className="relative w-full h-full">
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