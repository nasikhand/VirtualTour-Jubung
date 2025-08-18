'use client';

import { useState } from 'react';
import { Scene, VtourMenu, Hotspot } from '@/types/virtual-tour';
import HotspotInfoModal from './HotspotInfoModal';
import { Menu, X } from 'lucide-react';
import PannellumViewer from './PannellumViewer'; // Gunakan viewer sederhana

export default function VirtualTourClientPage({ 
  menus, initialScene, logoUrl
}: { 
  menus: VtourMenu[], initialScene: Scene, logoUrl: string
}) {
  const [activeScene, setActiveScene] = useState<Scene>(initialScene);
  const [infoHotspot, setInfoHotspot] = useState<Hotspot | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(true); 

  const switchScene = (scene: Scene) => {
    if (scene && scene.id !== activeScene.id) setActiveScene(scene);
  };

  const handleHotspotClick = (hotspot: Hotspot) => {
    if (hotspot.type === 'info') {
      setInfoHotspot(hotspot);
    } else if (hotspot.type === 'link' && hotspot.target_scene_id) {
      const targetMenu = menus.find(menu => menu.scene_id === hotspot.target_scene_id);
      if (targetMenu?.scene) switchScene(targetMenu.scene);
    }
  };
  
  return (
    <>
      <div className="relative w-full h-screen bg-black">
        {/* Logo */}
        {logoUrl && (
          <div className="absolute top-4 left-4 z-10">
            <img src={logoUrl} alt="Logo" className="h-12 w-auto" />
          </div>
        )}

        {/* Menu Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="absolute top-4 right-4 z-20 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-lg shadow-lg transition-colors"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Navigation Menu */}
        {isMenuOpen && (
          <div className="absolute top-20 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-4 w-80 max-h-[70vh] overflow-y-auto">
            <h3 className="font-semibold text-lg text-gray-800 mb-4">Pilih Lokasi</h3>
            <div className="space-y-2">
              {menus.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => menu.scene && switchScene(menu.scene)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    activeScene.id === menu.scene_id
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-2 border-transparent'
                  }`}
                >
                  <div className="font-medium">{menu.name}</div>
                  {menu.scene && (
                    <div className="text-sm text-gray-500 mt-1">{menu.scene.name}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        <PannellumViewer
          imageUrl={`/api/vtour/images/${activeScene.image_path}`}
          initialYaw={activeScene.default_yaw ?? 0}
          initialPitch={activeScene.default_pitch ?? 0}
          hotspots={activeScene.hotspots}
          onHotspotClick={handleHotspotClick}
        />
      </div>

      <HotspotInfoModal 
        hotspot={infoHotspot}
        onClose={() => setInfoHotspot(null)}
      />
    </>
  );
}