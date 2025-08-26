'use client';

import { useState, useEffect, useRef } from 'react';
import { Scene, Hotspot } from '@/types/virtual-tour';
import { nanoid } from 'nanoid';
import toast from 'react-hot-toast';
import { Plus, X, Save, MousePointerClick } from 'lucide-react';
import PannellumViewer from './PannellumViewer';
import InfoEditor from './InfoEditor';
import DraggableHotspot from './DraggableHotspot';

export default function PlacementEditor({ scene, onExit }: { scene: Scene, onExit: () => void }) {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Partial<Hotspot> | null>(null);
  const [showDraggableHotspot, setShowDraggableHotspot] = useState(false);
  const [tempHotspotCoords, setTempHotspotCoords] = useState({ pitch: 0, yaw: 0 });
  const [dragInitialPosition, setDragInitialPosition] = useState({ x: 50, y: 50 });
  const [viewerReady, setViewerReady] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    setHotspots(scene.hotspots?.filter((h: Hotspot) => h.type === 'info') || []);
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

  // Handle viewer ready state
  const handleViewerReady = () => {
    console.log('PlacementEditor: Viewer is ready');
    setViewerReady(true);
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
    if (!viewerReady) {
      toast.error('Viewer belum siap. Silakan tunggu sebentar.');
      return;
    }

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

  const handleDraggablePositionChange = (coords: { pitch: number; yaw: number } | null) => {
    if (coords) {
      console.log('PlacementEditor: Draggable position changed to:', coords);
      setTempHotspotCoords(coords);
    }
  };

  const handleUpdateHotspotPosition = (hotspotId: string | number, coords: { pitch: number; yaw: number }) => {
    console.log('PlacementEditor: Updating hotspot position:', { hotspotId, coords });
    setHotspots(prev => prev.map(h => 
      h.id === hotspotId ? { ...h, pitch: coords.pitch, yaw: coords.yaw } : h
    ));
    setIsDirty(true);
  };

  const handleDraggableConfirm = () => {
    console.log('PlacementEditor: Draggable confirm called with coords:', tempHotspotCoords);
    
    // Validasi koordinat
    if (isNaN(tempHotspotCoords.pitch) || isNaN(tempHotspotCoords.yaw)) {
      toast.error('Koordinat tidak valid. Silakan coba lagi.');
      return;
    }

    const newHotspot: Hotspot = {
      id: nanoid(),
      scene_id: scene.id,
      type: 'info',
      pitch: tempHotspotCoords.pitch,
      yaw: tempHotspotCoords.yaw,
      label: 'New Info',
      sentences: [{ id: nanoid(), clause: '', voiceSource: 'browser' }],
    };

    console.log('PlacementEditor: Creating new hotspot:', newHotspot);
    setHotspots(prev => [...prev, newHotspot]);
    setSelectedHotspot(newHotspot);
    setIsModalOpen(true);
    setShowDraggableHotspot(false);
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!isDirty) return;

    setIsSaving(true);
    try {
      console.log('PlacementEditor: Saving hotspots:', hotspots);
      
      // Filter dan validasi hotspots sebelum save
      const validHotspots = hotspots.filter(hotspot => {
        const isValid = !isNaN(hotspot.pitch) && !isNaN(hotspot.yaw) &&
                       hotspot.pitch >= -90 && hotspot.pitch <= 90 &&
                       hotspot.yaw >= -180 && hotspot.yaw <= 180;
        
        if (!isValid) {
          console.warn('PlacementEditor: Invalid coordinates detected:', tempHotspotCoords);
        }
        return isValid;
      });

      console.log('PlacementEditor: Valid hotspots to save:', validHotspots);

      // Update existing hotspots
      for (const hotspot of validHotspots) {
        if (hotspot.id && typeof hotspot.id === 'string' && hotspot.id.startsWith('temp_')) {
          // Create new hotspot
          const response = await fetch('/api/vtour/hotspots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              scene_id: scene.id,
              type: hotspot.type,
              pitch: hotspot.pitch,
              yaw: hotspot.yaw,
              label: hotspot.label,
              description: hotspot.description,
              sentences: hotspot.sentences,
            }),
          });

          if (!response.ok) {
            console.error('PlacementEditor: Failed to create hotspot:', hotspot.id, response.status);
            throw new Error(`Failed to create hotspot: ${response.statusText}`);
          }
        } else {
          // Update existing hotspot
          const response = await fetch(`/api/vtour/hotspots/${hotspot.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pitch: hotspot.pitch,
              yaw: hotspot.yaw,
              label: hotspot.label,
              description: hotspot.description,
              sentences: hotspot.sentences,
            }),
          });

          if (!response.ok) {
            console.error('PlacementEditor: Failed to update hotspot:', hotspot.id, response.status);
            throw new Error(`Failed to update hotspot: ${response.statusText}`);
          }
        }
      }

      await reloadHotspots();
      setIsDirty(false);
      toast.success('Hotspots berhasil disimpan!');
    } catch (error) {
      console.error('PlacementEditor: Error during save:', error);
      toast.error('Gagal menyimpan hotspots: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteHotspot = async (hotspotId: string | number) => {
    try {
      // Jika hotspot sudah ada di database (ID numerik), hapus dari database
      if (typeof hotspotId === 'number') {
        const response = await fetch(`/api/vtour/hotspots/${hotspotId}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          console.error('PlacementEditor: Failed to delete hotspot from database:', hotspotId);
          toast.error('Gagal menghapus hotspot dari database');
          return;
        }
      }
      
      // Hapus dari state
      setHotspots(prev => prev.filter(h => h.id !== hotspotId));
      setIsDirty(true);
      toast.success('Hotspot berhasil dihapus');
    } catch (error) {
      console.error('PlacementEditor: Error deleting hotspot:', error);
      toast.error('Gagal menghapus hotspot');
    }
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-4 left-4 z-20 flex gap-2">
        <button
          onClick={() => setIsAdding(true)}
          disabled={isAdding || showDraggableHotspot || !viewerReady}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Plus size={16} />
          Add Hotspot (Click)
        </button>
        
        <button
          onClick={handleAddWithDraggable}
          disabled={isAdding || showDraggableHotspot || !viewerReady}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <MousePointerClick size={16} />
          Add Hotspot (Drag)
        </button>
        
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        
        <button
          onClick={onExit}
          className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center gap-2"
        >
          <X size={16} />
          Exit
        </button>
      </div>

      {!viewerReady && (
        <div className="absolute top-16 left-4 z-20 bg-yellow-500 text-white px-4 py-2 rounded-lg">
          Menunggu viewer siap...
        </div>
      )}

      <div ref={containerRef} className="relative w-full h-full">
        <PannellumViewer
          ref={viewerRef}
          imageUrl={`/api/vtour/images/${encodeURI(scene.image_path)}`}
          initialYaw={scene.default_yaw || 0}
          initialPitch={scene.default_pitch || 0}
          hotspots={hotspots}
          onViewerClick={handleViewerClick}
          onHotspotClick={handleHotspotClick}
          onLoad={handleViewerReady}
        />

        {showDraggableHotspot && viewerReady && containerRef.current && (
          <DraggableHotspot
            onPositionChange={handleDraggablePositionChange}
            onConfirm={handleDraggableConfirm}
            containerRef={containerRef}
            viewerRef={viewerRef}
            initialPosition={dragInitialPosition}
          />
        )}
      </div>

      {isModalOpen && selectedHotspot && (
        <InfoEditor
          hotspot={selectedHotspot}
          onSave={(data: { label: string; description: string; sentences: any[] }) => {
            if (selectedHotspot.id) {
              const updatedHotspot: Hotspot = {
                ...selectedHotspot,
                ...data,
              } as Hotspot;
              
              setHotspots(prev => 
                prev.map(h => h.id === selectedHotspot.id ? updatedHotspot : h)
              );
              setIsDirty(true);
            }
            setIsModalOpen(false);
            setSelectedHotspot(null);
          }}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedHotspot(null);
          }}
          onDelete={() => {
            if (selectedHotspot.id) {
              handleDeleteHotspot(selectedHotspot.id);
            }
            setIsModalOpen(false);
            setSelectedHotspot(null);
          }}
        />
      )}
    </div>
  );
}