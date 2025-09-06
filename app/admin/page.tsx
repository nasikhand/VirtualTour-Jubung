<<<<<<< Updated upstream
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { 
  Camera, MapPin, Settings, Users, Clock, Activity, Plus, 
  ArrowRight, Calendar, BarChart3, Globe, Zap 
} from 'lucide-react';

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
          fetch('/api/vtour/scenes'),
          fetch('/api/vtour/hotspots'),
          fetch('/api/vtour/menus')
        ]);

        const [scenesData, hotspotsData, menusData] = await Promise.all([
          scenesRes.json(),
          hotspotsRes.json(),
          menusRes.json()
        ]);

        // Jika API return array langsung
        const totalScenes = Array.isArray(scenesData) ? scenesData.length : (scenesData.total || scenesData.data?.length || 0);
        const totalHotspots = Array.isArray(hotspotsData) ? hotspotsData.length : (hotspotsData.total || hotspotsData.data?.length || 0);
        const totalMenus = Array.isArray(menusData) ? menusData.length : (menusData.total || menusData.data?.length || 0);

        setStats({
          totalScenes,
          totalHotspots,
          totalMenus,
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

  const quickActions = [
    {
      title: 'Tambah Scene Baru',
      description: 'Buat scene panorama baru',
      icon: Camera,
      href: '/admin/virtual-tour-section',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Kelola Hotspots',
      description: 'Atur hotspot dan navigasi',
      icon: MapPin,
      href: '/admin/virtual-tour-hotspots',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      title: 'Pengaturan Sistem',
      description: 'Konfigurasi aplikasi',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                Dashboard Admin
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Activity size={16} className="text-green-500" />
                Virtual Tour Management System
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>Last updated</span>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {new Date(stats.lastUpdated).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Scenes</p>
                  <p className="text-3xl font-bold">{loading ? '...' : stats.totalScenes}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Camera size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Hotspots</p>
                  <p className="text-3xl font-bold">{loading ? '...' : stats.totalHotspots}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <MapPin size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Menus</p>
                  <p className="text-3xl font-bold">{loading ? '...' : stats.totalMenus}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <BarChart3 size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Status</p>
                  <p className="text-xl font-bold">Aktif</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Zap size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus size={24} className="text-blue-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} ${action.hoverColor} transition-all duration-300`}>
                        <action.icon size={24} className="text-white" />
                      </div>
                      <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-blue-500" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dashboard diakses</p>
                    <p className="text-xs text-gray-500">Baru saja</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sistem aktif</p>
                    <p className="text-xs text-gray-500">Semua layanan berjalan normal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} className="text-green-500" />
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Virtual Tour Viewer</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Services</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
=======
'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { 
  Camera, MapPin, Settings, Users, Clock, Activity, Plus, 
  ArrowRight, Calendar, BarChart3, Globe, Zap 
} from 'lucide-react';

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
          fetch('/api/vtour/scenes'),
          fetch('/api/vtour/hotspots'),
          fetch('/api/vtour/menus')
        ]);

        const [scenesData, hotspotsData, menusData] = await Promise.all([
          scenesRes.json(),
          hotspotsRes.json(),
          menusRes.json()
        ]);

        // Jika API return array langsung
        const totalScenes = Array.isArray(scenesData) ? scenesData.length : (scenesData.total || scenesData.data?.length || 0);
        const totalHotspots = Array.isArray(hotspotsData) ? hotspotsData.length : (hotspotsData.total || hotspotsData.data?.length || 0);
        const totalMenus = Array.isArray(menusData) ? menusData.length : (menusData.total || menusData.data?.length || 0);

        setStats({
          totalScenes,
          totalHotspots,
          totalMenus,
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

  const quickActions = [
    {
      title: 'Tambah Scene Baru',
      description: 'Buat scene panorama baru',
      icon: Camera,
      href: '/admin/virtual-tour-section',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      title: 'Kelola Hotspots',
      description: 'Atur hotspot dan navigasi',
      icon: MapPin,
      href: '/admin/virtual-tour-hotspots',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      title: 'Pengaturan Sistem',
      description: 'Konfigurasi aplikasi',
      icon: Settings,
      href: '/admin/settings',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                Dashboard Admin
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Activity size={16} className="text-green-500" />
                Virtual Tour Management System
              </p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock size={14} />
                <span>Last updated</span>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {new Date(stats.lastUpdated).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Scenes</p>
                  <p className="text-3xl font-bold">{loading ? '...' : stats.totalScenes}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Camera size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Total Hotspots</p>
                  <p className="text-3xl font-bold">{loading ? '...' : stats.totalHotspots}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <MapPin size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Menus</p>
                  <p className="text-3xl font-bold">{loading ? '...' : stats.totalMenus}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <BarChart3 size={24} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Status</p>
                  <p className="text-xl font-bold">Aktif</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Zap size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Plus size={24} className="text-blue-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} ${action.hoverColor} transition-all duration-300`}>
                        <action.icon size={24} className="text-white" />
                      </div>
                      <ArrowRight size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar size={20} className="text-blue-500" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Dashboard diakses</p>
                    <p className="text-xs text-gray-500">Baru saja</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sistem aktif</p>
                    <p className="text-xs text-gray-500">Semua layanan berjalan normal</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users size={20} className="text-green-500" />
                System Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Virtual Tour Viewer</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Services</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
>>>>>>> Stashed changes
