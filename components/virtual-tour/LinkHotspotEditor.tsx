'use client';

import { useState, useEffect, useRef } from 'react';
import { Scene, Hotspot } from '@/types/virtual-tour';
import { Plus, Save, X, MousePointerClick } from 'lucide-react';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import LinkHotspotModal from './LinkHotspotModal';
import PannellumViewer from './PannellumViewer';
import DraggableHotspot from './DraggableHotspot';

export default function LinkHotspotEditor({ scene }: { scene: Scene }) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [allScenes, setAllScenes] = useState<Scene[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Partial<Hotspot> | null>(null);
  const [showDraggableHotspot, setShowDraggableHotspot] = useState(false);
  const [tempHotspotCoords, setTempHotspotCoords] = useState({ pitch: 0, yaw: 0 });
  const [dragInitialPosition, setDragInitialPosition] = useState({ x: 50, y: 50 });
  const [currentViewerPosition, setCurrentViewerPosition] = useState({ pitch: 0, yaw: 0 });
  
  // State untuk menampung hotspot yang sedang dibuat (belum disimpan)
  const [tempHotspot, setTempHotspot] = useState<Partial<Hotspot> | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  // State untuk melacak kesiapan Pannellum Viewer
  const [isViewerReady, setIsViewerReady] = useState(false); 

  useEffect(() => {
    setHotspots(scene.hotspots?.filter(h => h.type === 'link') || []);
    const fetchAllScenes = async () => {
      try {
        const response = await fetch('/api/vtour/scenes?per_page=100');
         if (response.ok) setAllScenes((await response.json()).data ?? []);
      } catch { toast.error("Gagal memuat daftar scene tujuan."); }
    };
    fetchAllScenes();
  }, [scene]);

  // Efek untuk memeriksa apakah viewerRef sudah terpasang dan siap digunakan
  useEffect(() => {
    const interval = setInterval(() => {
      if (viewerRef.current) {
        setIsViewerReady(true);
        clearInterval(interval);
      }
    }, 100); 

    return () => clearInterval(interval);
  }, []);

  const reloadHotspots = async () => {
    try {
      const response = await fetch(`/api/vtour/scenes/${scene.id}/hotspots`);
      if (response.ok) {
        const hotspotsData = await response.json();
        setHotspots(hotspotsData.filter((h: Hotspot) => h.type === 'link'));
      }
    } catch (error) {
      console.error('Gagal memuat ulang hotspots:', error);
    }
  };

  const handleViewerClick = (coords: { pitch: number, yaw: number }) => {
    if (!isAdding) return;
    
    const newTempHotspot: Partial<Hotspot> = {
      id: nanoid(),
      scene_id: scene.id,
      type: 'link',
      pitch: coords.pitch,
      yaw: coords.yaw,
    };
    setTempHotspot(newTempHotspot);
    setSelectedHotspot(newTempHotspot);
    setIsModalOpen(true);
    setIsAdding(false);
  };

  const handleAddWithDraggable = () => {
    // Get current viewer position if available
    if (viewerRef.current && typeof viewerRef.current.getViewer === 'function') {
      const viewer = viewerRef.current.getViewer();
      if (viewer) {
        const currentPitch = viewer.getPitch();
        const currentYaw = viewer.getYaw();
        setCurrentViewerPosition({ pitch: currentPitch, yaw: currentYaw });
      }
    }
    setShowDraggableHotspot(true);
    setIsAdding(false);
  };

  const handleDraggablePositionChange = (coords: { pitch: number; yaw: number }) => {
    setTempHotspotCoords(coords);
  };

  const handleDraggableConfirm = () => {
    const newTempHotspot: Partial<Hotspot> = {
      id: nanoid(),
      scene_id: scene.id,
      type: 'link',
      pitch: tempHotspotCoords.pitch,
      yaw: tempHotspotCoords.yaw,
    };
    setTempHotspot(newTempHotspot);
    setSelectedHotspot(newTempHotspot);
    setIsModalOpen(true);
    setShowDraggableHotspot(false);
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (isAdding) return toast.error("Keluar dari mode 'Add' terlebih dahulu.");
    setSelectedHotspot(hotspot);
    setIsModalOpen(true);
  };

  const handleSaveHotspotData = (hotspotData: Partial<Hotspot>) => {
    const finalHotspot = { ...selectedHotspot, ...hotspotData } as Hotspot;
    
    setHotspots(prev => {
      const isNew = typeof finalHotspot.id === 'string' && finalHotspot.id.length > 10;
      if (isNew) {
        return [...prev, finalHotspot];
      } else {
        return prev.map(h => (h.id === finalHotspot.id ? finalHotspot : h));
      }
    });
    
    setIsModalOpen(false);
    setSelectedHotspot(null);
    setTempHotspot(null);
    setIsDirty(true);
  };
    
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHotspot(null);
    setTempHotspot(null); 
  };

  const handleDeleteHotspot = () => {
    setHotspots(prev => prev.filter(h => h.id !== selectedHotspot?.id));
    handleCloseModal();
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    
    try {
      const existingLinkHotspots = scene.hotspots?.filter(h => h.type === 'link') || [];
      for (const hotspot of existingLinkHotspots) {
        if (hotspot.id && typeof hotspot.id !== 'string') {
          await fetch(`/api/vtour/hotspots/${hotspot.id}`, { method: 'DELETE' });
        }
      }
      
      const savedHotspots = [];
      for (const hotspot of hotspots) {
        if (hotspot.yaw === undefined || hotspot.pitch === undefined) continue;
        
        const payload = {
          type: 'link',
          yaw: Number(hotspot.yaw),
          pitch: Number(hotspot.pitch),
          label: hotspot.label || 'Lokasi Baru',
          target_scene_id: hotspot.target_scene_id,
          icon_name: hotspot.icon_name || 'default'
        };
        
        const response = await fetch(`/api/vtour/scenes/${scene.id}/hotspots`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) throw new Error(`Gagal menyimpan hotspot: ${response.statusText}`);
        savedHotspots.push(await response.json());
      }
      
      toast.success(`${savedHotspots.length} hotspot berhasil disimpan!`);
      setIsDirty(false);
      await reloadHotspots();
      
    } catch (error) {
      toast.error('Gagal menyimpan perubahan: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleQuit = () => { window.history.back(); };

  return (
    <>
      <div ref={containerRef} className="relative w-full h-screen bg-white overflow-hidden">
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <div className="flex gap-1">
            <button onClick={() => setIsAdding(!isAdding)} className={`font-semibold px-3 py-2 rounded-l-lg shadow-lg flex items-center gap-2 transition-colors ${isAdding ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 text-gray-800 hover:bg-white'}`}>
              {isAdding ? <X size={16} /> : <Plus size={16} />}
              {isAdding ? 'Batal' : 'Mode Klik'}
            </button>
            <button onClick={handleAddWithDraggable} className="bg-green-500 text-white font-semibold px-3 py-2 rounded-r-lg shadow-lg hover:bg-green-600 flex items-center gap-2 transition-colors">
                <Plus size={16} /> Mode Geser
            </button>
          </div>
          <button onClick={handleSaveAll} disabled={!isDirty || isSaving} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          <button onClick={handleQuit} className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-900 flex items-center gap-2">
            <X size={18} /> Keluar
          </button>
        </div>

        {isAdding && (<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg shadow-lg font-semibold flex items-center gap-2 animate-bounce"><MousePointerClick size={18}/> Klik di panorama untuk menempatkan hotspot.</div>)}
        
        {showDraggableHotspot && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-green-400 text-green-900 px-4 py-2 rounded-lg shadow-lg font-semibold flex items-center gap-2 animate-pulse">
            <Plus size={18}/> Gerakkan hotspot ke posisi yang diinginkan, lalu klik "Konfirmasi Posisi".
          </div>
        )}
        
        <PannellumViewer 
          ref={viewerRef}
          imageUrl={`/api/vtour/images/${encodeURIComponent(scene.image_path)}`}
          hotspots={[...hotspots, tempHotspot].filter(Boolean) as Hotspot[]}
          onViewerClick={handleViewerClick}
          onHotspotClick={handleHotspotClick}
        />
        
        {showDraggableHotspot && (
          <DraggableHotspot
            onPositionChange={handleDraggablePositionChange}
            onConfirm={handleDraggableConfirm}
            onCancel={() => setShowDraggableHotspot(false)}
            initialPosition={dragInitialPosition}
            currentViewerPosition={currentViewerPosition}
          />
        )}
      </div>
      <LinkHotspotModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveHotspotData}
        onDelete={handleDeleteHotspot}
        hotspot={selectedHotspot}
        scenes={allScenes}
        isSaving={isSaving}
      />
    </>
  );
}