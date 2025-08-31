'use client';

import { useState, useEffect } from 'react';
import VirtualTourClientPage from '@/components/virtual-tour/VirtualTourClientPage';
import { VtourMenu, Scene } from '@/types/virtual-tour';
import { addCacheBuster, checkImageExists } from '@/utils/cacheUtils';

export default function VirtualTourPage() {
  const [menus, setMenus] = useState<VtourMenu[]>([]);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // base URL sudah termasuk /api
        const apiBase = process.env.NEXT_PUBLIC_API_URL;

        const [menusResponse, settingsResponse] = await Promise.all([
          fetch(`${apiBase}/api/vtour/menus`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' },
          }),
          fetch(`${apiBase}/api/vtour/settings`, {
            cache: 'no-store',
            headers: { 'Accept': 'application/json' },
          }),
        ]);

        if (!menusResponse.ok) {
          // bantu debug URL tujuan saat 404
          console.error('Menus URL:', menusResponse.url);
          throw new Error(`HTTP error! status: ${menusResponse.status}`);
        }

        const menusJson = await menusResponse.json();
        setMenus(menusJson.data || []);

        if (settingsResponse.ok) {
          const settingsJson = await settingsResponse.json();
          console.log('🔍 Settings response:', settingsJson); // Debug log
          console.log('🔍 Settings data keys:', Object.keys(settingsJson?.data || {})); // Debug keys
          
          if (settingsJson?.data?.vtour_logo_url) {
            console.log('🔍 Logo URL found:', settingsJson.data.vtour_logo_url); // Debug logo URL
            
            // ✅ Gunakan public storage API (tidak perlu authentication)
            const logoPath = settingsJson.data.vtour_logo_url;
            
            // Hapus query parameter lama jika ada
            const cleanLogoPath = logoPath.split('?')[0];
            
            // Convert ke public storage URL
            const finalLogoUrl = `/api/vtour/public/storage/${encodeURI(cleanLogoPath)}?t=${Date.now()}`;
            
            console.log('🔍 Clean logo path:', cleanLogoPath); // Debug clean path
            console.log('🔍 Public storage URL:', finalLogoUrl); // Debug public URL
            
            // Verifikasi image exists
            checkImageExists(finalLogoUrl).then(exists => {
              if (!exists) {
                console.warn('⚠️ Logo image tidak dapat diakses:', finalLogoUrl);
                // Clear logo jika tidak bisa diakses
                setSettings((prev: any) => ({
                  ...prev,
                  vtour_logo_url: null
                }));
              }
            });
            
            // Update settings dengan final URL
            settingsJson.data.vtour_logo_url = finalLogoUrl;
          } else {
            console.log('🔍 No logo URL found in response'); // Debug no logo
          }
          setSettings(settingsJson.data || {});
        } else {
          console.error('❌ Settings response not ok:', settingsResponse.status, settingsResponse.statusText);
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
          <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
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
          <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Kembali ke Beranda
          </a>
        </div>
      </div>
    );
  }

  return (
    <VirtualTourClientPage
      menus={menus}
      initialScene={menus[0]?.scene || ({} as Scene)}
      logoUrl={settings?.vtour_logo_url || ''}
    />
  );
}
