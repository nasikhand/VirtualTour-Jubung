'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Camera, MapPin, Eye, Settings, TrendingUp, Users, Clock, Activity } from 'lucide-react';

interface DashboardStats {
  totalScenes: number;
  totalHotspots: number;
  totalMenus: number;
  lastUpdated: string;
}

export default function AdminWelcomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalScenes: 0,
    totalHotspots: 0,
    totalMenus: 0,
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [scenesRes, hotspotsRes, menusRes] = await Promise.all([
          fetch('/api/vtour/scenes?per_page=1'),
          fetch('/api/vtour/hotspots?per_page=1'),
          fetch('/api/vtour/menus?per_page=1')
        ]);

        const [scenesData, hotspotsData, menusData] = await Promise.all([
          scenesRes.json(),
          hotspotsRes.json(),
          menusRes.json()
        ]);

        setStats({
          totalScenes: scenesData.total || 0,
          totalHotspots: hotspotsData.total || 0,
          totalMenus: menusData.total || 0,
          lastUpdated: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Activity size={16} className="text-green-500" />
                Virtual Tour Management System
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-sm font-medium text-gray-700">
                {new Date(stats.lastUpdated).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Scenes</p>
                  <p className="text-3xl font-bold">
                    {loading ? '...' : stats.totalScenes}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Camera size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Hotspots</p>
                  <p className="text-3xl font-bold">
                    {loading ? '...' : stats.totalHotspots}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <MapPin size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Menu Items</p>
                  <p className="text-3xl font-bold">
                    {loading ? '...' : stats.totalMenus}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Settings size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Status</p>
                  <p className="text-xl font-bold">Online</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <TrendingUp size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="mb-8 bg-white shadow-lg border-0">
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Selamat Datang di Admin Panel</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Kelola virtual tour Anda dengan mudah. Tambahkan scene baru, atur hotspot, dan kustomisasi pengalaman virtual tour untuk pengunjung.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Camera className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Manajemen Scene</h3>
              </div>
              <p className="text-gray-600 mb-6">Kelola scene 360° dan atur navigasi virtual tour</p>
              <div className="space-y-3">
                <Link 
                  href="/admin/virtual-tour-section" 
                  className="block w-full bg-blue-600 text-white text-center py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Kelola Scene
                </Link>
                <div className="text-sm text-gray-500 text-center">
                  {stats.totalScenes} scene tersedia
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Manajemen Menu</h3>
              </div>
              <p className="text-gray-600 mb-6">Atur menu navigasi dan hotspot interaktif</p>
              <div className="space-y-3">
                <Link 
                  href="/admin/virtual-tour-hotspots" 
                  className="block w-full bg-green-600 text-white text-center py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Kelola Menu
                </Link>
                <div className="text-sm text-gray-500 text-center">
                  {stats.totalHotspots} hotspot aktif
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-shadow duration-300 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-full">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 ml-3">Preview Tour</h3>
              </div>
              <p className="text-gray-600 mb-6">Lihat dan test virtual tour yang telah dibuat</p>
              <div className="space-y-3">
                <Link 
                  href="/virtual-tour" 
                  target="_blank"
                  className="block w-full bg-purple-600 text-white text-center py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Buka Virtual Tour
                </Link>
                <div className="text-sm text-gray-500 text-center">
                  Buka di tab baru
                </div>
              </div>
            </CardContent>
          </Card>
        </div>



      </div>
    </div>
  );
}
