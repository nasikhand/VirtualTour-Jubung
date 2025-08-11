'use client';

import { useState, useEffect } from 'react';
import { Scene, VtourMenu, Hotspot } from '@/types/virtual-tour';
import HotspotInfoModal from './HotspotInfoModal';
import VirtualTourBase from './VirtualTourBase'; // Gunakan komponen dasar yang baru dan stabil
import ReactHotspot from './ReactHotspot';     // Gunakan komponen hotspot React

export default function VirtualTourClientPage({ 
  menus, 
  initialScene,
  logoUrl 
}: { 
  menus: VtourMenu[], 
  initialScene: Scene,
  logoUrl: string
}) {
  const [activeScene, setActiveScene] = useState<Scene>(initialScene);
  const [infoHotspot, setInfoHotspot] = useState<Hotspot | null>(null);

  // Fungsi untuk berpindah scene
  const switchScene = (scene: Scene) => {
    // Cek untuk mencegah reload scene yang sama
    if (scene && scene.id !== activeScene.id) {
      setActiveScene(scene);
    }
  };

  // Fungsi yang menangani saat hotspot di-klik
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
        {/* Lapisan 1: Viewer Interaktif sebagai dasar */}
        <VirtualTourBase imageUrl={`/api/vtour/images/${activeScene.image_path}`}>
          {/* Lapisan 2: Hotspot sebagai komponen React, dirender sebagai children */}
          {activeScene.hotspots?.map(hotspot => (
            <ReactHotspot 
              key={`${activeScene.id}-${hotspot.id}`} // Key yang unik saat scene berubah
              hotspot={hotspot}
              onClick={handleHotspotClick}
            />
          ))}
        </VirtualTourBase>

        {/* Lapisan 3: Navigasi Thumbnail di Bawah */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-2 sm:p-4">
          <div className="mx-auto max-w-7xl bg-black/50 backdrop-blur-md rounded-xl p-2">
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {menus.map((menu) => (
                <button 
                  key={menu.id}
                  onClick={() => switchScene(menu.scene!)}
                  className={`relative flex-shrink-0 w-28 h-20 sm:w-32 sm:h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black/50 focus:ring-white/80
                    ${activeScene.id === menu.scene_id ? 'border-white' : 'border-transparent hover:border-white/50'}
                  `}
                  title={menu.name}
                >
                  <img src={`/api/vtour/images/${menu.scene?.image_path}`} alt={menu.name} className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                  <span className="absolute bottom-1 left-2 text-white text-xs font-semibold">{menu.name}</span>
                </button>
              ))}
            </div>
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