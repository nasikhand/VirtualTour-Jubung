'use client';

import { useState, useEffect, useRef } from 'react';
import { VTourScene, Hotspot } from '@/types/virtual-tour';
import { saveVtourHotspots } from '@/lib/data/virtual-tour';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import { Plus, X, Save, MousePointerClick } from 'lucide-react';
import PannellumViewer from './PannellumViewer';
import InfoEditor from './InfoEditor';
import DraggableHotspot from './DraggableHotspot';

export default function PlacementEditor({ scene, onExit }: { scene: VTourScene, onExit: () => void }) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Partial<Hotspot> | null>(null);
  const [showDraggableHotspot, setShowDraggableHotspot] = useState(false);
  const [tempHotspotCoords, setTempHotspotCoords] = useState({ pitch: 0, yaw: 0 });
  const [dragInitialPosition, setDragInitialPosition] = useState({ x: 50, y: 50 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    setHotspots(scene.hotspots?.filter(h => h.type === 'info') || []);
  }, [scene]);

  // Fungsi untuk reload hotspot dari server
  const reloadHotspots = async () => {
    try {
      console.log('PlacementEditor: Reloading hotspots for scene:', scene.id);
      const response = await fetch(`/api/vtour/scenes/${scene.id}/hotspots`);
      if (response.ok) {
        const hotspotsData = await response.json();
        console.log('PlacementEditor: Received hotspots data:', hotspotsData);
        const infoHotspots = hotspotsData.filter((h: Hotspot) => h.type === 'info');
        console.log('PlacementEditor: Filtered info hotspots:', infoHotspots);
        setHotspots(infoHotspots);
        console.log('PlacementEditor: Hotspots state updated successfully');
      } else {
        console.error('PlacementEditor: Failed to reload hotspots, response not ok:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('PlacementEditor: Failed to reload hotspots:', error);
    }
  };

  const handleViewerClick = (coords: { pitch: number, yaw: number }) => {
    console.log('PlacementEditor handleViewerClick called:', { coords, isAdding });
    if (!isAdding) {
      console.log('PlacementEditor: Not in adding mode, ignoring click');
      return;
    }
    console.log('PlacementEditor: Creating new info hotspot at:', coords);
    const newHotspot: Hotspot = {
      id: nanoid(), scene_id: scene.id, type: 'info',
      pitch: coords.pitch, yaw: coords.yaw, label: 'New Info', 
      sentences: [{ id: nanoid(), clause: '', voiceSource: 'browser' }],
    };
    setHotspots(prev => [...prev, newHotspot]);
    setSelectedHotspot(newHotspot);
    setIsModalOpen(true);
    setIsAdding(false);
    setIsDirty(true);
  };

  const handleAddWithDraggable = (e?: React.MouseEvent) => {
    if (e && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setDragInitialPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    } else {
      setDragInitialPosition({ x: 50, y: 50 }); // Default ke tengah jika tidak ada event
    }
    setShowDraggableHotspot(true);
    setIsAdding(false);
  };

  const handleCancelDraggable = () => {
    setShowDraggableHotspot(false);
  };

  const handleDraggablePositionChange = (coords: { pitch: number; yaw: number }) => {
    setTempHotspotCoords(coords);
  };

  const handleUpdateHotspotPosition = (hotspotId: string | number, coords: { pitch: number; yaw: number }) => {
    setHotspots(prev => prev.map(h => 
      h.id === hotspotId ? { ...h, pitch: coords.pitch, yaw: coords.yaw } : h
    ));
    setIsDirty(true);
  };

  const handleDraggableConfirm = () => {
    console.log('PlacementEditor: Draggable confirm called with coords:', tempHotspotCoords);
    
    // Validasi koordinat - pastikan koordinat dalam range yang valid
    const isValidCoords = (
      tempHotspotCoords.yaw >= -180 && tempHotspotCoords.yaw <= 180 &&
      tempHotspotCoords.pitch >= -90 && tempHotspotCoords.pitch <= 90
    );
    
    if (!isValidCoords) {
      console.warn('PlacementEditor: Invalid coordinate range detected:', tempHotspotCoords);
      toast.error('Posisi hotspot tidak valid, silakan coba lagi');
      return;
    }
    
    console.log('PlacementEditor: Coordinates accepted:', tempHotspotCoords);
    
    const newHotspot: Hotspot = {
      id: nanoid(),
      scene_id: scene.id,
      type: 'info',
      pitch: tempHotspotCoords.pitch,
      yaw: tempHotspotCoords.yaw,
      label: 'New Info',
      sentences: [{ id: nanoid(), clause: '', voiceSource: 'browser' }],
    };

    console.log('PlacementEditor: Creating new info hotspot:', newHotspot);
    setHotspots(prev => [...prev, newHotspot]);
    setSelectedHotspot(newHotspot);
    setIsModalOpen(true);
    setShowDraggableHotspot(false);
    setIsDirty(true);
    console.log('PlacementEditor: Hotspot added to state and modal opened');
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
    console.log('PlacementEditor: Starting save process with hotspots:', hotspots);
    setIsSaving(true);
    try {
      const existingHotspots = scene.hotspots?.filter(h => h.type === 'info') || [];
      console.log('PlacementEditor: Existing hotspots:', existingHotspots);
      
      // Update atau create hotspot
      for (const hotspot of hotspots) {
        // Validasi koordinat sebelum menyimpan
        if (!hotspot.pitch && hotspot.pitch !== 0 || !hotspot.yaw && hotspot.yaw !== 0) {
          console.warn('PlacementEditor: Skipping hotspot with invalid coordinates:', hotspot);
          continue;
        }
        
        const payload = {
          type: hotspot.type,
          yaw: hotspot.yaw,
          pitch: hotspot.pitch,
          label: hotspot.label,
          description: hotspot.description,
          sentences: hotspot.sentences || []
        };
        
        console.log('PlacementEditor: Preparing to save hotspot:', hotspot.id, payload);
        
        // Cek apakah hotspot sudah ada (ID numerik = existing, string = new)
        const isExisting = hotspot.id && typeof hotspot.id === 'number';
        
        if (isExisting) {
          // Update hotspot yang sudah ada
          console.log('PlacementEditor: Updating existing hotspot:', hotspot.id);
          const response = await fetch(`/api/vtour/hotspots/${hotspot.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!response.ok) {
            console.error('PlacementEditor: Failed to update hotspot:', hotspot.id, response.status);
            throw new Error(`Failed to update hotspot ${hotspot.id}`);
          }
        } else {
          // Create hotspot baru
          console.log('PlacementEditor: Creating new hotspot for scene:', scene.id);
          const response = await fetch(`/api/vtour/scenes/${scene.id}/hotspots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!response.ok) {
            console.error('PlacementEditor: Failed to create hotspot:', response.status);
            throw new Error('Failed to create new hotspot');
          }
          console.log('PlacementEditor: Successfully created new hotspot');
        }
      }
      
      // Hapus hotspot yang sudah tidak ada di state
      const currentHotspotIds = hotspots.map(h => h.id).filter(id => typeof id === 'number');
      for (const existingHotspot of existingHotspots) {
        if (existingHotspot.id && !currentHotspotIds.includes(existingHotspot.id)) {
          console.log('PlacementEditor: Deleting removed hotspot:', existingHotspot.id);
          await fetch(`/api/vtour/hotspots/${existingHotspot.id}`, { method: 'DELETE' });
        }
      }
      
      toast.success('Semua perubahan berhasil disimpan!');
      setIsDirty(false);
      // Reload hotspot dari server untuk menampilkan data terbaru
      console.log('PlacementEditor: Save completed, calling reloadHotspots...');
      await reloadHotspots();
      console.log('PlacementEditor: reloadHotspots completed');
    } catch (error) {
      console.error('PlacementEditor: Error during save:', error);
      toast.error('Gagal menyimpan perubahan.');
    } finally {
      setIsSaving(false);
    }
  };
  const handleQuit = () => {
    if (isDirty && !window.confirm("Perubahan belum disimpan. Yakin keluar?")) return;
    onExit();
  };

  return (
    <>
      <div ref={containerRef} className="relative w-full h-screen bg-white overflow-hidden">
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          {!showDraggableHotspot ? (
            <div className="flex gap-1">
              <button onClick={() => setIsAdding(!isAdding)} className={`font-semibold px-3 py-2 rounded-l-lg shadow-lg flex items-center gap-2 transition-colors ${isAdding ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/90 text-gray-800 hover:bg-white'}`}>
                {isAdding ? <X size={16} /> : <Plus size={16} />}
                {isAdding ? 'Cancel' : 'Click Mode'}
              </button>
              <button onClick={(e) => handleAddWithDraggable(e)} className="bg-green-500 text-white font-semibold px-3 py-2 rounded-r-lg shadow-lg hover:bg-green-600 flex items-center gap-2 transition-colors">
                <Plus size={16} /> Drag Mode
              </button>
            </div>
          ) : (
            <button onClick={handleCancelDraggable} className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 flex items-center gap-2">
              <X size={16} /> Cancel Drag
            </button>
          )}
          <button onClick={handleSaveAll} disabled={!isDirty || isSaving} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
            <Save size={18} /> {isSaving ? 'Menyimpan...' : 'Save All Changes'}
          </button>
          <button onClick={handleQuit} className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-900 flex items-center gap-2">
            <X size={18} /> Quit
          </button>
        </div>

        {isAdding && (<div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg shadow-lg font-semibold flex items-center gap-2 animate-bounce"><MousePointerClick size={18}/> Klik untuk menempatkan hotspot info.</div>)}
        
        {showDraggableHotspot && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-green-400 text-green-900 px-4 py-2 rounded-lg shadow-lg font-semibold flex items-center gap-2 animate-pulse">
            <Plus size={18}/> Gerakkan hotspot ke posisi yang diinginkan, lalu klik "Konfirmasi Posisi".
          </div>
        )}
        
        <PannellumViewer 
          ref={viewerRef}
          imageUrl={`/api/vtour/images/${encodeURIComponent(scene.image_path)}`}
          hotspots={hotspots}
          onViewerClick={handleViewerClick}
          onHotspotClick={handleHotspotClick}
        />
        
        {showDraggableHotspot && (
          <DraggableHotspot
            onPositionChange={handleDraggablePositionChange}
            onConfirm={handleDraggableConfirm}
            containerRef={containerRef}
            viewerRef={viewerRef}
            initialPosition={dragInitialPosition}
          />
        )}
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