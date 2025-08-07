'use client';

import { useState, useEffect, useCallback } from 'react';
import { Scene, Hotspot } from '@/types/virtual-tour';
import { Plus, Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { nanoid } from 'nanoid';
import LinkHotspotModal from './LinkHotspotModal';
import VirtualTourBase from './VirtualTourBase';
import { DndContext, useDraggable, DragEndEvent } from '@dnd-kit/core';

// Tipe data hotspot lokal yang diperluas dengan posisi layar (pixel)
type DraggableHotspotData = Hotspot & {
  screenPosition?: { x: number; y: number };
};

// --- Komponen Internal untuk Ikon Hotspot yang Bisa Di-drag ---
function DraggableHotspotIcon({ hotspot }: { hotspot: DraggableHotspotData }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: hotspot.id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  // Jangan render sama sekali jika posisi pixelnya belum dihitung
  if (!hotspot.screenPosition) return null;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
      style={{
        left: hotspot.screenPosition.x,
        top: hotspot.screenPosition.y,
        ...style
      }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
    >
      <div className={`custom-link-hotspot hotspot-icon-${hotspot.icon_name || 'default'}`} />
    </div>
  );
}

// --- Komponen Editor Utama ---
export default function LinkHotspotEditor({ scene }: { scene: Scene }) {
  const [viewer, setViewer] = useState<any | null>(null);
  const [hotspots, setHotspots] = useState<DraggableHotspotData[]>([]);
  const [allScenes, setAllScenes] = useState<Scene[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<DraggableHotspotData | null>(null);

  // Fungsi untuk menyinkronkan posisi 360 -> pixel
  const syncPositions = useCallback(() => {
    if (!viewer) return;
    setHotspots(currentHotspots =>
      currentHotspots.map(h => {
        const coords = viewer.coordsToScreen([h.pitch, h.yaw]);
        return Array.isArray(coords) ? { ...h, screenPosition: { y: coords[0], x: coords[1] } } : h;
      })
    );
  }, [viewer]);
  
  // Ambil data scene dan inisialisasi hotspot awal
  useEffect(() => {
    const fetchAllScenes = async () => {
      try {
        const res = await fetch('/api/vtour/scenes?per_page=100');
        if (res.ok) setAllScenes((await res.json()).data ?? []);
      } catch {
        toast.error("Gagal memuat daftar scene tujuan.");
      }
    };
    fetchAllScenes();
    // Inisialisasi hotspot dari data scene yang diterima
    setHotspots(scene.hotspots?.filter(h => h.type === 'link').map(h => ({ ...h })) || []);
  }, [scene]);
  
  // Pasang listener untuk sinkronisasi posisi saat view berubah
  useEffect(() => {
    if (!viewer) return;
    viewer.on('viewchange', syncPositions);
    window.addEventListener('resize', syncPositions);
    return () => {
      if(viewer && typeof (viewer as any).off === 'function') {
        (viewer as any).off('viewchange', syncPositions);
      }
      window.removeEventListener('resize', syncPositions);
    };
  }, [viewer, syncPositions]);

  // Fungsi untuk menambah hotspot baru di tengah layar
  const handleAddHotspot = () => {
    if (!viewer) return;
    const newHotspot: DraggableHotspotData = {
      id: nanoid(),
      scene_id: scene.id,
      type: 'link',
      pitch: viewer.getPitch(),
      yaw: viewer.getYaw(),
      label: 'New Link',
      icon_name: 'default',
    };
    setHotspots(prev => [...prev, newHotspot]);
    setIsDirty(true);
  };

  // Fungsi yang dijalankan saat drag selesai
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    if (!viewer) return;

    setHotspots(currentHotspots =>
      currentHotspots.map(h => {
        if (h.id === active.id) {
          if (!h.screenPosition) return h;
          const newScreenX = h.screenPosition.x + delta.x;
          const newScreenY = h.screenPosition.y + delta.y;
          const coords = viewer.mouseEventToCoords({ clientX: newScreenX, clientY: newScreenY });
          if (Array.isArray(coords)) {
            const [newPitch, newYaw] = coords;
            return { ...h, pitch: newPitch, yaw: newYaw };
          }
        }
        return h;
      })
    );
    setIsDirty(true);
  };

  const openHotspotModal = (hotspot: DraggableHotspotData) => {
    setSelectedHotspot(hotspot);
    setIsModalOpen(true);
  };
    
  const handleSaveHotspotData = (hotspotData: Partial<Hotspot>) => {
    setHotspots(prev => prev.map(h => h.id === selectedHotspot?.id ? { ...h, ...hotspotData } : h));
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
    // TODO: Implementasikan API call untuk sinkronisasi link hotspot ke backend
    const payload = hotspots.map(({ screenPosition, ...rest }) => rest);
    console.log("Data yang akan dikirim ke backend:", payload);
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Perubahan hotspot berhasil disimpan (simulasi).");
    setIsSaving(false);
    setIsDirty(false);
  };

  const handleQuit = () => {
    if (isDirty && !window.confirm("Anda memiliki perubahan yang belum disimpan. Yakin ingin keluar?")) {
      return;
    }
    window.history.back();
  };

  return (
    <>
      <div className="relative w-full h-screen bg-black select-none">
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button onClick={handleAddHotspot} className="bg-white/90 text-gray-800 font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-white flex items-center gap-2"><Plus size={18}/> Add Location Moving</button>
          <button onClick={handleSaveAll} disabled={!isDirty || isSaving} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"><Save size={18}/>{isSaving ? 'Menyimpan...':'Save'}</button>
          <button onClick={handleQuit} className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-900 flex items-center gap-2"><X size={18}/> Quit</button>
        </div>
        
        <VirtualTourBase 
          imageUrl={`/api/vtour/images/${scene.image_path}`} 
          onLoad={(v) => {
            setViewer(v);
            // Panggil syncPositions setelah viewer siap
            if (v) {
                v.on('load', syncPositions);
            }
          }}
        >
          <DndContext onDragEnd={handleDragEnd}>
            <div className="w-full h-full">
              {hotspots.map(h => (
                <div key={h.id} className="pointer-events-auto" onClick={() => openHotspotModal(h)}>
                  <DraggableHotspotIcon hotspot={h} />
                </div>
              ))}
            </div>
          </DndContext>
        </VirtualTourBase>
      </div>
      <LinkHotspotModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveHotspotData}
        onDelete={handleDeleteHotspot}
        hotspot={selectedHotspot}
        scenes={allScenes}
        isSaving={isSaving}
      />
    </>
  );
}