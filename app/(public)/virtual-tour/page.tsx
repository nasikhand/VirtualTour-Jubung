'use client';

import { useState, useEffect } from 'react';
import VirtualTourClientPage from '@/components/virtual-tour/VirtualTourClientPage';
import { VtourMenu, Scene } from '@/types/virtual-tour';

export default function VirtualTourPage() {
  const [menus, setMenus] = useState<VtourMenu[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
        
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
        setMenus(menusData.data || []);
        
        if (settingsResponse.ok) {
          const settingsData = await settingsResponse.json();
          // Add cache-busting parameter to logo URL to prevent browser caching
          if (settingsData.data && settingsData.data.vtour_logo_url) {
            settingsData.data.vtour_logo_url = `${settingsData.data.vtour_logo_url}?t=${Date.now()}`;
          }
          setSettings(settingsData.data || {});
        }
      } catch (err) {
        console.error('Error loading virtual tour:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

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
            href="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  if (!menus || menus.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Virtual Tour</h1>
          <p className="text-gray-600 mb-6">Belum ada scene virtual tour yang tersedia.</p>
          <a 
            href="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return <VirtualTourClientPage menus={menus} initialScene={menus[0]?.scene || {} as Scene} logoUrl={settings?.vtour_logo_url || ''} />;
}