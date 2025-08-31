'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Scene, Hotspot } from '@/types/virtual-tour';
import { Plus, Save, X, MousePointerClick, Eye, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import PannellumViewer from './PannellumViewer';
import DraggableHotspot from './DraggableHotspot';
import InfoEditor from './InfoEditor';
import LinkHotspotModal from './LinkHotspotModal';

// Define HotspotWithStatus type locally
type HotspotWithStatus = Hotspot & { status?: 'new' | 'modified' };

interface HotspotEditorProps {
  scene: Scene;
  type: 'info' | 'link';
  onExit: () => void;
}

export default function HotspotEditor({ scene, type, onExit }: HotspotEditorProps) {
  // Core State Management
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showDraggableHotspot, setShowDraggableHotspot] = useState(false);
  const [viewerReady, setViewerReady] = useState(false);
  const [isLoadingHotspots, setIsLoadingHotspots] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);

  // Sembunyikan hotspot saat Click Mode agar klik tidak ketabrak hotspot/controls
  const [suppressHotspots, setSuppressHotspots] = useState(false);

  // Scenes list (untuk link hotspot)
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isLoadingScenes, setIsLoadingScenes] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<Partial<Hotspot> | null>(null);

  // Drag Mode State
  const [dragCoords, setDragCoords] = useState<{ pitch: number; yaw: number } | null>(null);
  const [dragInitialPosition, setDragInitialPosition] = useState({ x: 50, y: 50 });

  // CRUD Tracking State
  const [deletedIds, setDeletedIds] = useState<number[]>([]);
  const [hotspotsWithStatus, setHotspotsWithStatus] = useState<HotspotWithStatus[]>([]);

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<any>(null);

  // Load hotspots from backend - filtered by type
  const loadHotspots = useCallback(async () => {
    if (!scene.id) return;

    setIsLoadingHotspots(true);
    try {
      console.log(`🔄 Loading ${type.toUpperCase()} hotspots for scene:`, scene.id);
      const response = await fetch(`/api/vtour/scenes/${scene.id}/hotspots`);
      console.log('Hotspots response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('All hotspots response data:', data);

        // Handle both array and object with data property
        let allHotspots = [];
        if (Array.isArray(data)) {
          allHotspots = data;
        } else if (data && Array.isArray(data.data)) {
          allHotspots = data.data;
        }

        // Filter by type
        const filteredHotspots = allHotspots.filter((h: any) => h.type === type);
        console.log(`Filtered ${type} hotspots:`, filteredHotspots);

        // Convert to HotspotWithStatus with no status (existing from DB)
        const hsWithStatus: HotspotWithStatus[] = filteredHotspots.map((h: any) => ({ ...h, status: undefined }));
        setHotspotsWithStatus(hsWithStatus);
        setHotspots(filteredHotspots);

        if (filteredHotspots.length > 0) {
          toast.success(`${filteredHotspots.length} hotspot ${type} berhasil dimuat`);
        }
      } else {
        console.error('Failed to load hotspots:', response.status, response.statusText);
        toast.error('Gagal memuat hotspot dari server');
      }
    } catch (error) {
      console.error('Error loading hotspots:', error);
      toast.error('Gagal memuat hotspot dari server');
    } finally {
      setIsLoadingHotspots(false);
    }
  }, [scene.id, type]);

  useEffect(() => {
    loadHotspots();
  }, [loadHotspots]);

  // Load scenes for link hotspots
  const loadScenes = useCallback(async () => {
    if (type !== 'link') return;

    setIsLoadingScenes(true);
    try {
      console.log('🔄 Loading scenes for link hotspots');
      const response = await fetch('/api/vtour/scenes');

      if (response.ok) {
        const data = await response.json();
        let allScenes = [];
        if (Array.isArray(data)) {
          allScenes = data;
        } else if (data && Array.isArray(data.data)) {
          allScenes = data.data;
        }

        // Filter out current scene
        const filteredScenes = allScenes.filter((s: any) => s.id !== scene.id);
        setScenes(filteredScenes);
        console.log('Scenes loaded for link hotspots:', filteredScenes);
      } else {
        console.error('Failed to load scenes:', response.status);
        toast.error('Gagal memuat daftar scene');
      }
    } catch (error) {
      console.error('Error loading scenes:', error);
      toast.error('Gagal memuat daftar scene');
    } finally {
      setIsLoadingScenes(false);
    }
  }, [type, scene.id]);

  useEffect(() => {
    loadScenes();
  }, [loadScenes]);

  // Viewer ready
  const handleViewerReady = useCallback(() => {
    console.log('✅ Viewer is ready');
    setViewerReady(true);
  }, []);

  // Tambah hotspot via click (dipanggil dari overlay juga)
  const handleViewerClick = useCallback((coords: { pitch: number; yaw: number }) => {
    console.log(`🎯 ${type} HotspotEditor handleViewerClick called:`, {
      coords,
      isAdding,
      timestamp: new Date().toISOString()
    });

    if (!isAdding) {
      console.log('❌ Not in adding mode, ignoring click');
      return;
    }

    console.log('✅ Creating new hotspot with coordinates:', coords);
    const newHotspot: Partial<Hotspot> = {
      id: `temp_${Date.now()}`,
      scene_id: scene.id,
      type: type,
      pitch: coords.pitch,
      yaw: coords.yaw,
      label: type === 'info' ? 'Info Hotspot' : 'Link Hotspot',
      description: type === 'info' ? 'Deskripsi hotspot' : 'Link ke scene lain',
      sentences: type === 'info' ? [] : undefined,
      target_scene_id: type === 'link' ? undefined : undefined
    };

    console.log('🎯 New hotspot created:', newHotspot);
    setSelectedHotspot(newHotspot);
    setIsModalOpen(true);
    setIsAdding(false);
    setSuppressHotspots(false); // tampilkan hotspot kembali

    toast.success(`${type === 'info' ? 'Info' : 'Link'} hotspot berhasil dibuat! Silakan isi informasi.`);
  }, [isAdding, scene.id, type]);

  // Overlay click-capture (agar single-click selalu tertangkap saat Click Mode)
  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // 🔒 pastikan Pannellum tidak menerima event lain
    e.stopPropagation();
    e.preventDefault();

    if (!viewerRef.current || !containerRef.current) return;
    try {
      const viewer = viewerRef.current.getViewer?.();
      if (!viewer) return;

      const fakeEvent = {
        clientX: e.clientX,
        clientY: e.clientY,
        target: containerRef.current
      } as unknown as MouseEvent;

      const coords = viewer.mouseEventToCoords(fakeEvent);
      if (Array.isArray(coords) && coords.length >= 2) {
        const [pitch, yaw] = coords;
        handleViewerClick({ pitch, yaw });
      }
    } catch (err) {
      console.error('Overlay click error:', err);
    }
  }, [viewerRef, containerRef, handleViewerClick]);

  // Edit hotspot
  const handleHotspotClick = useCallback((hotspot: Hotspot) => {
    setSelectedHotspot(hotspot);
    setIsModalOpen(true);
  }, []);

  // Drag Mode
  const handleAddWithDraggable = useCallback(() => {
    console.log('🟢 Drag Mode activated');
    setShowDraggableHotspot(true);
    setIsAdding(false);
    setSuppressHotspots(false); // saat drag, biarkan hotspot lama terlihat (opsional)
  }, []);

  const handleDraggablePositionChange = useCallback((coords: { pitch: number; yaw: number } | null) => {
    if (coords) {
      console.log('Draggable position changed:', coords);
      setDragCoords(coords);
    }
  }, []);

  const handleDraggableConfirm = useCallback(() => {
    if (!dragCoords) {
      toast.error('Posisi hotspot belum ditentukan');
      return;
    }

    setShowDraggableHotspot(false);
    const newHotspot: Partial<Hotspot> = {
      id: `temp_${Date.now()}`,
      scene_id: scene.id,
      type: type,
      pitch: dragCoords.pitch,
      yaw: dragCoords.yaw,
      label: type === 'info' ? 'Info Hotspot' : 'Link Hotspot',
      description: type === 'info' ? 'Deskripsi hotspot' : 'Link ke scene lain',
      sentences: type === 'info' ? [] : undefined,
      target_scene_id: type === 'link' ? undefined : undefined
    };
    setSelectedHotspot(newHotspot);
    setIsModalOpen(true);
    setDragCoords(null);
  }, [scene.id, type, dragCoords]);

  const handleCancelDraggable = useCallback(() => {
    setShowDraggableHotspot(false);
    setDragCoords(null);
  }, []);

  // Hapus hotspot (hindari DELETE untuk item 'new')
  const handleDeleteHotspot = useCallback((hotspotId: string) => {
    const hs = hotspotsWithStatus.find(h => h.id?.toString() === hotspotId);
    const isNew = hs?.status === 'new';

    if (!isNew && hs && typeof hs.id === 'number') {
      setDeletedIds(prev => [...prev, hs.id as number]);
      console.log('🗑️ Mark server hotspot for deletion:', hs.id);
    } else {
      console.log('🗑️ Local-only hotspot removed (no server DELETE):', hotspotId);
    }

    setHotspots(prev => prev.filter(h => h.id !== hotspotId));
    setHotspotsWithStatus(prev => prev.filter(h => h.id !== hotspotId));
    setIsDirty(true);
    toast.success('Hotspot berhasil dihapus (pending save)');
  }, [hotspotsWithStatus]);

  // Helper: coba 2 bentuk endpoint utk UPDATE/DELETE agar tidak 404
  const tryHotspotRequest = useCallback(
    async (method: 'PUT' | 'DELETE', id: number, body?: any) => {
      const headers = body ? { 'Content-Type': 'application/json' } : undefined;
      const payload = body ? JSON.stringify(body) : undefined;

      // 1) Tanpa sceneId
      const r1 = await fetch(`/api/vtour/hotspots/${id}`, { method, headers, body: payload });
      if (r1.ok) {
        try { return await r1.json(); } catch { return null; }
      }
      if (r1.status !== 404) {
        throw new Error(`${method} /api/vtour/hotspots/${id} -> ${r1.status} ${r1.statusText}`);
      }

      // 2) Fallback dengan sceneId
      const r2 = await fetch(`/api/vtour/scenes/${scene.id}/hotspots/${id}`, { method, headers, body: payload });
      if (!r2.ok) {
        throw new Error(`${method} /api/vtour/scenes/${scene.id}/hotspots/${id} -> ${r2.status} ${r2.statusText}`);
      }
      try { return await r2.json(); } catch { return null; }
    },
    [scene.id]
  );

  // Save CRUD
  const handleSave = useCallback(async () => {
    console.log(`💾 Saving ${type} hotspots with CRUD strategy:`, {
      hotspots: hotspotsWithStatus,
      deletedIds
    });
    setIsSaving(true);

    try {
      const createPromises: Promise<any>[] = [];
      const updatePromises: Promise<any>[] = [];
      const deletePromises: Promise<any>[] = [];

      // Deletes (server only)
      for (const id of deletedIds) {
        const deletePromise = tryHotspotRequest('DELETE', id);
        deletePromises.push(deletePromise);
        console.log(`🗑️ Deleting hotspot ${id}`);
      }

      // Creates & updates
      for (const hotspot of hotspotsWithStatus) {
        if (hotspot.yaw === undefined || hotspot.pitch === undefined) continue;

        if (hotspot.status === 'new') {
          const payload: any = {
            type: type,
            yaw: Number(hotspot.yaw),
            pitch: Number(hotspot.pitch),
            label: hotspot.label || `${type === 'info' ? 'Info' : 'Link'} Hotspot`,
            description: hotspot.description || `${type === 'info' ? 'Deskripsi' : 'Link'} hotspot`,
          };

          if (type === 'info') {
            payload.sentences = hotspot.sentences || [];
          } else if (type === 'link') {
            payload.target_scene_id = hotspot.target_scene_id;
            payload.icon_name = hotspot.icon_name || 'default';
          }

          console.log(`➕ Creating ${type} hotspot:`, payload);
          const createPromise = fetch(`/api/vtour/scenes/${scene.id}/hotspots`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }).then(response => {
            if (!response.ok) {
              throw new Error(`Failed to create hotspot: ${response.statusText}`);
            }
            return response.json();
          });

          createPromises.push(createPromise);

        } else if (hotspot.status === 'modified') {
          const payload: any = {
            type: type,
            yaw: Number(hotspot.yaw),
            pitch: Number(hotspot.pitch),
            label: hotspot.label || `${type === 'info' ? 'Info' : 'Link'} Hotspot`,
            description: hotspot.description || `${type === 'info' ? 'Deskripsi' : 'Link'} hotspot`,
          };

          if (type === 'info') {
            payload.sentences = hotspot.sentences || [];
          } else if (type === 'link') {
            payload.target_scene_id = hotspot.target_scene_id;
            payload.icon_name = hotspot.icon_name || 'default';
          }

          console.log(`✏️ Updating ${type} hotspot ${hotspot.id}:`, payload);
          const updatePromise = tryHotspotRequest('PUT', Number(hotspot.id), payload);
          updatePromises.push(updatePromise);
        }
      }

      const results = await Promise.all([
        ...createPromises,
        ...updatePromises,
        ...deletePromises
      ]);

      console.log(`✅ All operations completed successfully:`, results);

      setDeletedIds([]);
      setIsDirty(false);

      toast.success(`${results.length} operasi ${type} hotspot berhasil disimpan!`);

      await loadHotspots();

    } catch (error) {
      console.error(`❌ Error saving ${type} hotspots:`, error);
      toast.error('Gagal menyimpan perubahan: ' + (error as Error).message);
    } finally {
      setIsSaving(false);
    }
  }, [hotspotsWithStatus, deletedIds, scene.id, type, loadHotspots, tryHotspotRequest]);

  // Modal save — pertahankan status 'new' kalau sebelumnya 'new'
  const handleModalSave = useCallback((data: any) => {
    const updatedHotspot: Hotspot = {
      ...selectedHotspot,
      ...data,
    } as Hotspot;

    if (selectedHotspot?.id && selectedHotspot.id.toString().startsWith('temp_')) {
      const newHotspot: HotspotWithStatus = {
        ...updatedHotspot,
        id: Date.now(),
        status: 'new'
      };

      setHotspots(prev => [...prev, newHotspot]);
      setHotspotsWithStatus(prev => [...prev, newHotspot]);

      console.log('➕ New hotspot added with status "new":', newHotspot);
    } else if (selectedHotspot?.id) {
      const existing = hotspotsWithStatus.find(h => h.id === selectedHotspot.id);
      const nextStatus: 'new' | 'modified' | undefined =
        existing?.status === 'new' ? 'new' : 'modified';

      const modifiedHotspot: HotspotWithStatus = {
        ...updatedHotspot,
        status: nextStatus
      };

      setHotspots(prev =>
        prev.map(h => h.id === selectedHotspot.id ? updatedHotspot : h)
      );
      setHotspotsWithStatus(prev =>
        prev.map(h => h.id === selectedHotspot.id ? modifiedHotspot : h)
      );

      console.log(`✏️ Existing hotspot updated (status kept as "${nextStatus}")`, modifiedHotspot);
    }

    setIsDirty(true);
    setIsModalOpen(false);
    setSelectedHotspot(null);

    console.log('💾 Modal save completed, isDirty set to true');
  }, [selectedHotspot, hotspotsWithStatus]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedHotspot(null);
  }, []);

  const handleModalDelete = useCallback(() => {
    if (selectedHotspot?.id) {
      handleDeleteHotspot(selectedHotspot.id.toString());
    }
    handleModalClose();
  }, [selectedHotspot, handleDeleteHotspot, handleModalClose]);

  // Log state
  useEffect(() => {
    console.log('🔄 HotspotEditor state changed:', {
      type,
      isAdding,
      showDraggableHotspot,
      viewerReady,
      timestamp: new Date().toISOString()
    });
  }, [type, isAdding, showDraggableHotspot, viewerReady]);

  // Panorama draggable & zoom state based on isAdding (pakai setOption; jika tak ada, overlay sudah cukup)
  useEffect(() => {
    if (!viewerReady || !viewerRef.current) return;

    const viewer = viewerRef.current.getViewer?.();
    if (!viewer) return;

    if (isAdding) {
      try {
        viewer.setOption?.('draggable', false);
        viewer.setOption?.('mouseZoom', false);
      } catch {}
      if (containerRef.current) containerRef.current.style.cursor = 'crosshair';
    } else {
      try {
        viewer.setOption?.('draggable', true);
        viewer.setOption?.('mouseZoom', true);
      } catch {}
      if (containerRef.current) containerRef.current.style.cursor = 'default';
    }
  }, [isAdding, viewerReady]);

  // Cleanup
  useEffect(() => {
    return () => {
      try {
        if (viewerRef.current) {
          const viewer = viewerRef.current.getViewer?.();
          if (viewer && typeof viewer.setOption === 'function') {
            viewer.setOption('draggable', true);
            viewer.setOption('mouseZoom', true);
          }
        }
        if (containerRef.current) {
          containerRef.current.style.cursor = 'default';
        }
      } catch (error) {
        console.warn('Cleanup error:', error);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col z-50">
      {/* Header */}
      <div className="flex-shrink-0 bg-gray-800 p-4 border-b border-gray-700">
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Eye className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                Editor {type === 'info' ? 'Info' : 'Link'} Hotspot - {scene.name}
              </h1>
              <p className="text-sm text-gray-300">
                Atur posisi dan informasi {type === 'info' ? 'info' : 'link'} hotspot
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {/* Click Mode Button */}
            {!isAdding ? (
              <button
                onClick={() => {
                  console.log('🔵 Click Mode activated');
                  setIsAdding(true);
                  setShowDraggableHotspot(false);
                  setSuppressHotspots(true); // sembunyikan hotspot supaya klik tidak ketabrak
                }}
                disabled={showDraggableHotspot || !viewerReady}
                className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm transition-colors"
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add {type === 'info' ? 'Info' : 'Link'} Hotspot</span>
                <span className="sm:hidden">Add {type === 'info' ? 'Info' : 'Link'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  console.log('🔴 Click Mode deactivated');
                  setIsAdding(false);
                  setSuppressHotspots(false); // tampilkan kembali hotspot
                }}
                className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-red-600 flex items-center gap-2 text-sm transition-colors"
              >
                <X size={16} />
                <span className="hidden sm:inline">Cancel Add</span>
                <span className="sm:hidden">Cancel</span>
              </button>
            )}

            {/* Drag Mode Button */}
            <button
              onClick={handleAddWithDraggable}
              disabled={isAdding || showDraggableHotspot || !viewerReady}
              className="bg-green-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm transition-colors"
            >
              <MousePointerClick size={16} />
              <span className="hidden sm:inline">Add Hotspot (Drag)</span>
              <span className="sm:hidden">Add Drag</span>
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving}
              className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm transition-colors"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>

            {/* Exit Button */}
            <button
              onClick={onExit}
              className="bg-gray-800 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:bg-gray-900 flex items-center gap-2 text-sm transition-colors"
            >
              <X size={16} />
              Exit
            </button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex-shrink-0 bg-gray-700 px-4 py-2 border-b border-gray-600">
        <div className="flex items-center justify-between text-sm text-gray-300">
          <div className="flex items-center gap-4">
            <span>📍 {type === 'info' ? 'Info' : 'Link'} Hotspots: {hotspots?.length || 0}</span>
            {isDirty && <span className="text-yellow-400">⚠️ Ada perubahan yang belum disimpan</span>}
            {isSaving && <span className="text-blue-400">💾 Menyimpan...</span>}
          </div>
          <div className="flex items-center gap-2">
            {!viewerReady && <span className="text-yellow-400">⏳ Menunggu viewer...</span>}
            {viewerReady && <span className="text-green-400">✅ Viewer siap</span>}
            {isLoadingHotspots && <span className="text-blue-400">🔄 Memuat hotspot...</span>}
          </div>
        </div>
      </div>

      {/* Instructions */}
      {showInstructions && viewerReady && (
        <div className="absolute top-24 left-4 z-30 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <Info size={16} />
            <span className="font-semibold">Panduan:</span>
          </div>
          <ul className="text-xs space-y-1">
            <li>• Klik "Add {type === 'info' ? 'Info' : 'Link'} Hotspot" lalu klik panorama</li>
            <li>• Atau gunakan "Add Hotspot (Drag)" untuk posisi lebih presisi</li>
            <li>• Klik hotspot untuk mengedit informasi</li>
            <li>• Jangan lupa "Save Changes" setelah selesai</li>
          </ul>
        </div>
      )}

      {/* Click Mode banner */}
      {isAdding && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-yellow-500 text-yellow-900 px-4 py-2 rounded-lg shadow-lg font-semibold flex items-center gap-2 animate-pulse">
          <MousePointerClick size={18} />
          <span className="text-sm">
            <strong>CLICK MODE AKTIF</strong> - Klik di panorama untuk menempatkan {type === 'info' ? 'info' : 'link'} hotspot
          </span>
        </div>
      )}

      {/* Main Viewer Container */}
      <div className="flex-1 relative h-full overflow-hidden">
        <div ref={containerRef} className="w-full h-full relative">
          <PannellumViewer
            ref={viewerRef}
            imageUrl={(() => {
              const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
              const imageUrl = `${backendUrl}/api/vtour/storage/${encodeURIComponent(scene.image_path)}`;
              console.log('🖼️ Using image URL:', imageUrl);
              return imageUrl;
            })()}
            initialYaw={scene.default_yaw || 0}
            initialPitch={scene.default_pitch || 0}
            // KUNCI: sembunyikan hotspot ketika Click Mode supaya klik tidak ketabrak
            hotspots={suppressHotspots ? [] : hotspots}
            onViewerClick={handleViewerClick}
            onHotspotClick={handleHotspotClick}
            onLoad={handleViewerReady}
          />

          {/* Click-capture overlay — aktif hanya saat Click Mode */}
          {viewerReady && isAdding && (
            <div
              className="absolute inset-0 z-30"
              style={{ cursor: 'crosshair' }}
              onClick={handleOverlayClick}
              onDoubleClick={(e) => { e.stopPropagation(); e.preventDefault(); }} // cegah zoom double click
              onMouseDown={(e) => { e.stopPropagation(); e.preventDefault(); }}   // cegah drag start
            />
          )}

          {/* Draggable Hotspot */}
          {viewerReady && showDraggableHotspot && containerRef.current && (
            <DraggableHotspot
              onPositionChange={handleDraggablePositionChange}
              onConfirm={handleDraggableConfirm}
              onCancel={handleCancelDraggable}
              containerRef={containerRef as React.RefObject<HTMLDivElement>}
              viewerRef={viewerRef}
              initialPosition={dragInitialPosition}
            />
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedHotspot && (
        type === 'info' ? (
          <InfoEditor
            hotspot={selectedHotspot}
            onSave={handleModalSave}
            onCancel={handleModalClose}
            onDelete={handleModalDelete}
          />
        ) : (
          <LinkHotspotModal
            isOpen={isModalOpen}
            onClose={handleModalClose}
            onSave={handleModalSave}
            onDelete={handleModalDelete}
            hotspot={selectedHotspot}
            scenes={scenes}
            isSaving={isSaving}
          />
        )
      )}
    </div>
  );
}
