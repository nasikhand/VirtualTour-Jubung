'use client';

import { useState, useEffect } from 'react';
import { Scene, Hotspot } from '@/types/virtual-tour';
import { Plus, Save, X, MousePointerClick } from 'lucide-react';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import LinkHotspotModal from './LinkHotspotModal';
import PannellumViewer from './PannellumViewer'; // Gunakan viewer sederhana

export default function LinkHotspotEditor({ scene }: { scene: Scene }) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [allScenes, setAllScenes] = useState<Scene[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Partial<Hotspot> | null>(null);

  useEffect(() => {
    setHotspots(scene.hotspots?.filter(h => h.type === 'link') || []);
    const fetchAllScenes = async () => {
      try {
        const res = await fetch('/api/vtour/scenes?per_page=100');
        if (res.ok) setAllScenes((await res.json()).data ?? []);
      } catch { toast.error("Gagal memuat daftar scene tujuan."); }
    };
    fetchAllScenes();
  }, [scene]);

  const handleViewerClick = (coords: { pitch: number, yaw: number }) => {
    if (!isAdding) return;
    const newHotspot: Hotspot = {
      id: nanoid(), scene_id: scene.id, type: 'link',
      pitch: coords.pitch, yaw: coords.yaw, label: 'New Link', icon_name: 'default',
    };
    setHotspots(prev => [...prev, newHotspot]);
    setSelectedHotspot(newHotspot);
    setIsModalOpen(true);
    setIsAdding(false);
    setIsDirty(true);
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (isAdding) return toast.error("Keluar dari mode 'Add' terlebih dahulu.");
    setSelectedHotspot(hotspot);
    setIsModalOpen(true);
  };

  const handleSaveHotspotData = (hotspotData: Partial<Hotspot>) => {
    setHotspots(prev => prev.map(h => (h.id === selectedHotspot?.id ? { ...h, ...hotspotData } : h)));
    setIsModalOpen(false); setSelectedHotspot(null); setIsDirty(true);
  };
    
  const handleDeleteHotspot = () => {
    setHotspots(prev => prev.filter(h => h.id !== selectedHotspot?.id));
    setIsModalOpen(false); setSelectedHotspot(null); setIsDirty(true);
  };

  const handleSaveAll = async () => {
    if (!isDirty) return;
    setIsSaving(true);
    try {
      // Hapus hotspot yang ada di database untuk scene ini
      const existingHotspots = scene.hotspots?.filter(h => h.type === 'link') || [];
      for (const hotspot of existingHotspots) {
        if (hotspot.id && typeof hotspot.id !== 'string') {
          await fetch(`/api/vtour/hotspots/${hotspot.id}`, { method: 'DELETE' });
        }
      }
      
      // Simpan semua hotspot baru
      for (const hotspot of hotspots) {
        const payload = {
          type: hotspot.type,
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
          label: hotspot.label,
          target_scene_id: hotspot.target_scene_id,
          icon_name: hotspot.icon_name || 'default'
        };
        await fetch(`/api/vtour/scenes/${scene.id}/hotspots`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      
      toast.success('Semua perubahan berhasil disimpan!');
      setIsDirty(false);
    } catch (error) {
      toast.error('Gagal menyimpan perubahan.');
    } finally {
      setIsSaving(false);
    }
  };
  const handleQuit = () => { window.history.back(); };

  return (
    <>
      <div className="fixed inset-0 bg-white z-40">
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button onClick={() => setIsAdding(!isAdding)} className={`font-semibold px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transition-colors ${isAdding ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 text-gray-800 hover:bg-white'}`}>
            {isAdding ? <X size={18} /> : <Plus size={18} />}
            {isAdding ? 'Cancel Add' : 'Add Location Moving'}
          </button>
          <button onClick={handleSaveAll} disabled={!isDirty || isSaving} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Save Changes'}
          </button>
          <button onClick={handleQuit} className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-900 flex items-center gap-2">
            <X size={18} /> Quit
          </button>
        </div>

        {isAdding && (<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg shadow-lg font-semibold flex items-center gap-2 animate-bounce"><MousePointerClick size={18}/> Klik di panorama untuk menempatkan hotspot.</div>)}
        
        <PannellumViewer 
          imageUrl={`/api/vtour/images/${scene.image_path}`}
          hotspots={hotspots}
          onViewerClick={handleViewerClick}
          onHotspotClick={handleHotspotClick}
        />
      </div>
      <LinkHotspotModal
        isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHotspotData} onDelete={handleDeleteHotspot}
        hotspot={selectedHotspot} scenes={allScenes} isSaving={isSaving}
      />
    </>
  );
}