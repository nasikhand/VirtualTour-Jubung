'use client';

import { useState, useEffect } from 'react';
import { Scene, VtourMenu, Hotspot } from '@/types/virtual-tour';
import HotspotInfoModal from './HotspotInfoModal';
import { Map, Home, Info, Navigation, Maximize2, Minimize2, Volume2, VolumeX, RotateCcw, Compass, Eye, EyeOff } from 'lucide-react'; 
import PannellumViewer from './PannellumViewer';

export default function VirtualTourClientPage({ 
  menus, initialScene, logoUrl
}: { 
  menus: VtourMenu[], initialScene: Scene, logoUrl: string
}) {
  const [activeScene, setActiveScene] = useState<Scene>(initialScene);
  const [infoHotspot, setInfoHotspot] = useState<Hotspot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);

  // Cari scene peta dari menu untuk navigasi kembali
  const mapMenu = menus.find(menu => menu.is_map_scene); // Asumsi ada flag 'is_map_scene' di data menu

  const switchScene = (scene: Scene) => {
    if (scene && scene.id !== activeScene.id) {
      setIsLoading(true);
      // Add smooth transition delay
      setTimeout(() => {
        setActiveScene(scene);
        setIsLoading(false);
      }, 300);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetView = () => {
    // This will be handled by PannellumViewer
    window.dispatchEvent(new CustomEvent('resetView'));
  };

  const handleLogoClick = () => {
    // Redirect ke halaman web utama
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    window.open(baseUrl, '_blank');
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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

  // Gambar fallback jika scene.image_path kosong atau terjadi error
  const getImageUrl = (path?: string) => {
    return path ? `/api/vtour/images/${encodeURI(path)}` : '/placeholder-image.jpg';
  };

  return (
    <>
      <div className="relative w-full h-screen bg-black overflow-hidden">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white/90 rounded-xl p-6 flex items-center gap-4 shadow-2xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="text-gray-800 font-medium">Memuat scene...</span>
            </div>
          </div>
        )}

        {/* Logo - Made bigger and clickable */}
        {logoUrl && (
          <div className="absolute top-6 left-6 z-30 transition-all duration-300 hover:scale-110 cursor-pointer group">
            <div 
              onClick={handleLogoClick}
              className="relative"
              title="Klik untuk kembali ke website utama"
            >
              <img 
                src={logoUrl} 
                alt="Logo Kebun Jubung" 
                className="h-16 md:h-20 lg:h-24 w-auto drop-shadow-lg transition-all duration-300 group-hover:drop-shadow-2xl" 
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {/* Click hint */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Klik untuk website utama
              </div>
            </div>
          </div>
        )}

        {/* Controls Toggle - Moved to top-left to avoid conflicts */}
        <button
          onClick={() => setShowControls(!showControls)}
          className="absolute top-6 left-6 z-40 bg-gray-800/80 hover:bg-gray-800 text-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          style={{ transform: logoUrl ? 'translateX(120px)' : 'translateX(0)' }}
          title={showControls ? 'Sembunyikan Kontrol' : 'Tampilkan Kontrol'}
        >
          {showControls ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>

        {/* Top Controls - Moved to top-right with proper spacing */}
        <div className={`absolute top-6 right-6 z-30 flex items-center gap-2 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {/* Back to Map */}
          {mapMenu && activeScene.id !== mapMenu.scene_id && (
            <button
              onClick={() => mapMenu.scene && switchScene(mapMenu.scene)}
              className="bg-emerald-600/90 hover:bg-emerald-600 text-white p-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <Map size={20} />
              <span className="hidden md:inline font-medium">Kembali ke Peta</span>
            </button>
          )}

          {/* Reset View */}
          <button
            onClick={resetView}
            className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
            title="Reset Tampilan"
          >
            <RotateCcw size={20} />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-lg shadow-lg transition-all duration-200 hover:scale-105"
            title={isFullscreen ? 'Keluar Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        {/* Viewer Utama */}
        <PannellumViewer
          imageUrl={getImageUrl(activeScene.image_path)}
          initialYaw={activeScene.default_yaw ?? 0}
          initialPitch={activeScene.default_pitch ?? 0}
          hotspots={activeScene.hotspots}
          onHotspotClick={handleHotspotClick}
        />
        


        {/* Scene Navigation Panel */}
        <div className={`absolute bottom-0 left-0 right-0 z-20 transition-all duration-300 ${showControls ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 md:p-6">
            {/* Scene Counter */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <Compass size={16} className="text-white" />
                <span className="text-white text-sm font-medium">
                  Scene {menus.findIndex(m => m.scene_id === activeScene.id) + 1} dari {menus.filter(m => !m.is_map_scene).length}
                </span>
              </div>
            </div>
            
            {/* Scene Gallery */}
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
              {menus.filter(menu => !menu.is_map_scene).map((menu, index) => (
                <button
                  key={menu.id}
                  onClick={() => menu.scene && switchScene(menu.scene)}
                  className={`group flex-shrink-0 w-40 h-28 rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                    activeScene.id === menu.scene_id
                      ? 'border-emerald-400 scale-105 shadow-lg shadow-emerald-400/25'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="relative w-full h-full">
                    <img
                      src={getImageUrl(menu.scene?.image_path)}
                      alt={menu.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    
                    {/* Scene Number Badge */}
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </div>
                    
                    {/* Active Indicator */}
                    {activeScene.id === menu.scene_id && (
                      <div className="absolute top-2 right-2 bg-emerald-400 rounded-full p-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      </div>
                    )}
                    
                    {/* Scene Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-white text-sm font-medium text-center truncate drop-shadow-lg">
                        {menu.name}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {/* Navigation Hint */}
            <div className="text-center mt-3">
              <p className="text-white/60 text-xs">
                Klik thumbnail untuk berpindah scene • Geser untuk melihat lebih banyak
              </p>
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
