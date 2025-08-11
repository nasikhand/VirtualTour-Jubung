'use client';

import { useState, useEffect } from 'react';
import { Scene, Hotspot } from '@/types/virtual-tour';
import { Plus, Save, X, MousePointerClick } from 'lucide-react';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import InfoEditor from './InfoEditor';
import VirtualTourBase from './VirtualTourBase';
import ReactHotspot from './ReactHotspot';

export default function PlacementEditor({ scene, onExit }: { scene: Scene, onExit: () => void }) {
  const [viewer, setViewer] = useState<any | null>(null);
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Partial<Hotspot> | null>(null);

  useEffect(() => {
    setHotspots(scene.hotspots?.filter(h => h.type === 'info') || []);
  }, [scene]);

  const handleViewerClick = (coords: { pitch: number, yaw: number }) => {
    if (!isAdding) return;
    const newHotspot: Hotspot = {
      id: nanoid(),
      scene_id: scene.id,
      type: 'info',
      pitch: coords.pitch,
      yaw: coords.yaw,
      label: 'New Info',
      sentences: [],
    };
    setHotspots(prev => [...prev, newHotspot]);
    setSelectedHotspot(newHotspot);
    setIsModalOpen(true);
    setIsAdding(false);
    setIsDirty(true);
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (isAdding) {
      toast.error("Keluar dari mode 'Add' terlebih dahulu.");
      return;
    }
    setSelectedHotspot(hotspot);
    setIsModalOpen(true);
  };

  const handleSaveHotspotData = (hotspotData: { label: string; description: string; sentences: any[] }) => {
    setHotspots(prev => prev.map(h => (h.id === selectedHotspot?.id ? { ...h, ...hotspotData } : h)));
    setIsModalOpen(false);
    setSelectedHotspot(null);
    setIsDirty(true);
  };
    
  const handleDeleteHotspot = () => {
    setHotspots(prev => prev.filter(h => h.id !== selectedHotspot?.id));
    setIsModalOpen(false);
    setSelectedHotspot(null);
    setIsDirty(true);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    // TODO: Implementasikan API call untuk sinkronisasi info hotspot ke backend
    const payload = hotspots;
    console.log("Data yang akan dikirim ke backend:", payload);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Perubahan Info Hotspot berhasil disimpan (simulasi).");
    setIsSaving(false);
    setIsDirty(false);
  };

  const handleQuit = () => {
    if (isDirty && !window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?")) {
      return;
    }
    onExit();
  };

  return (
    <>
      <div className="fixed inset-0 bg-white z-40">
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button 
            onClick={() => setIsAdding(!isAdding)} 
            className={`font-semibold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors ${
              isAdding 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/90 text-gray-800 hover:bg-white'
            }`}
          >
            {isAdding ? <X size={18} /> : <Plus size={18} />}
            {isAdding ? 'Cancel Add' : 'Add Info'}
          </button>
          <button onClick={handleSaveAll} disabled={!isDirty || isSaving} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            <Save size={18} />
            {isSaving ? 'Menyimpan...' : 'Save All Changes'}
          </button>
          <button onClick={handleQuit} className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-900 flex items-center gap-2">
            <X size={18} />
            Quit
          </button>
        </div>

        {isAdding && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg shadow-lg font-semibold flex items-center gap-2 animate-bounce">
            <MousePointerClick size={18}/>
            Klik di mana saja pada panorama untuk menempatkan hotspot info.
          </div>
        )}
        
        <VirtualTourBase 
          imageUrl={`/api/vtour/images/${scene.image_path}`} 
          onLoad={setViewer}
        >
          {viewer && hotspots.map(h => (
            <ReactHotspot key={h.id} hotspot={h} viewer={viewer} onClick={handleHotspotClick} />
          ))}
        </VirtualTourBase>
      </div>

      <InfoEditor
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHotspotData}
        onDelete={handleDeleteHotspot}
        hotspot={selectedHotspot}
        isSaving={isSaving}
      />
    </>
  );
}