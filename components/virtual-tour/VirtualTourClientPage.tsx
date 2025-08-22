'use client';

import { useState } from 'react';
import { Scene, VtourMenu, Hotspot } from '@/types/virtual-tour';
import HotspotInfoModal from './HotspotInfoModal';
// Impor ikon peta jika Anda ingin menambah tombol kembali ke peta
import { Map } from 'lucide-react'; 
import PannellumViewer from './PannellumViewer';

export default function VirtualTourClientPage({ 
  menus, initialScene, logoUrl
}: { 
  menus: VtourMenu[], initialScene: Scene, logoUrl: string
}) {
  const [activeScene, setActiveScene] = useState<Scene>(initialScene);
  const [infoHotspot, setInfoHotspot] = useState<Hotspot | null>(null);

  // Cari scene peta dari menu untuk navigasi kembali
  const mapMenu = menus.find(menu => menu.is_map_scene); // Asumsi ada flag 'is_map_scene' di data menu

  const switchScene = (scene: Scene) => {
    if (scene && scene.id !== activeScene.id) {
      setActiveScene(scene);
    }
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.type === 'info') {
      setInfoHotspot(hotspot);
    } else if (hotspot.type === 'link' && hotspot.target_scene_id) {
      const targetMenu = menus.find(menu => menu.scene_id === hotspot.target_scene_id);
      if (targetMenu?.scene) {
        switchScene(targetMenu.scene);
      }
    }
  };
  
  return (
    <>
      <div className="relative w-full h-screen bg-black">
        {/* Logo */}
        {logoUrl && (
          <div className="absolute top-4 left-4 z-10">
            <img src={logoUrl} alt="Logo" className="h-12 md:h-16 w-auto" />
          </div>
        )}

        {/* Tombol Kembali ke Peta (Hanya muncul jika bukan di scene peta) */}
        {mapMenu && activeScene.id !== mapMenu.scene_id && (
            <button
                onClick={() => mapMenu.scene && switchScene(mapMenu.scene)}
                className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-lg shadow-lg transition-colors flex items-center gap-2"
            >
                <Map size={20} />
                <span className="hidden md:inline font-medium">Kembali ke Peta</span>
            </button>
        )}

        {/* Viewer Utama */}
        <PannellumViewer
          imageUrl={`/api/vtour/images/${encodeURIComponent(activeScene.image_path)}`}
          initialYaw={activeScene.default_yaw ?? 0}
          initialPitch={activeScene.default_pitch ?? 0}
          hotspots={activeScene.hotspots}
          onHotspotClick={handleHotspotClick}
        />

        {/* Galeri Thumbnail di Bagian Bawah */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-2 md:p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
            {/* Filter agar scene peta tidak muncul di galeri thumbnail */}
            {menus.filter(menu => !menu.is_map_scene).map((menu) => (
              <button
                key={menu.id}
                onClick={() => menu.scene && switchScene(menu.scene)}
                className={`flex-shrink-0 w-36 h-24 rounded-lg overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 focus:outline-none ${
                  activeScene.id === menu.scene_id
                    ? 'border-blue-500 scale-105'
                    : 'border-transparent'
                }`}
              >
                <div className="relative w-full h-full">
                  <img
                    src={`/api/vtour/images/${encodeURIComponent(menu.scene?.image_path ?? '')}`}
                    alt={menu.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-1 bg-black/60">
                    <p className="text-white text-xs text-center truncate">{menu.name}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <HotspotInfoModal 
        hotspot={infoHotspot}
        onClose={() => setInfoHotspot(null)}
      />
    </>
  );
}