'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import VirtualTourClientPage from '@/components/virtual-tour/VirtualTourClientPage';
import { VtourMenu, Scene } from '@/types/virtual-tour';

export default function VirtualTourDynamicPage() {
  const params = useParams();
  const sceneId = params.id as string;

  const [menus, setMenus] = useState<VtourMenu[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [initialScene, setInitialScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sceneFound, setSceneFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!sceneId) return;

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        // Fetch menus and settings in parallel
        const [menusResponse, settingsResponse] = await Promise.all([
          fetch(`${apiUrl}/api/vtour/menus`, {
            cache: 'no-store',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${apiUrl}/api/vtour/settings`, {
            cache: 'no-store',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          })
        ]);

        if (!menusResponse.ok) {
          throw new Error(`HTTP error! status: ${menusResponse.status}`);
        }

        const menusData = await menusResponse.json();
        const allMenus = menusData.data || [];
        setMenus(allMenus);
        
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          setSettings(settingsData.data || {});
        }

        // Find the initial scene based on the ID from the URL
        const foundMenu = allMenus.find((menu: VtourMenu) => menu.id.toString() === sceneId);
        
        if (foundMenu) {
          setInitialScene(foundMenu.scene);
          setSceneFound(true);
        } else {
          setSceneFound(false);
        }

      } catch (err) {
        console.error('Error loading virtual tour:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [sceneId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat virtual tour...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">Gagal memuat virtual tour: {error}</p>
          <a 
            href="/virtual-tour" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali
          </a>
        </div>
      </div>
    );
  }

  if (!sceneFound || !initialScene) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Scene Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-6">Scene virtual tour yang Anda cari tidak tersedia.</p>
          <a 
            href="/virtual-tour" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Virtual Tour
          </a>
        </div>
      </div>
    );
  }

  return <VirtualTourClientPage menus={menus} initialScene={initialScene} logoUrl={settings?.vtour_logo_url || ''} />;
}
