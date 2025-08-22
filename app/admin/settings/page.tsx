'use client';

import { useState, useEffect } from 'react';
import { User, Lock, Save, Eye, EyeOff, LogOut, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ name: '', email: '' });

  useEffect(() => {
    // Load admin info
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch('/api/admin/profile');
        if (response.ok) {
          const data = await response.json();
          setAdminInfo(data.data || { name: 'Admin', email: 'admin@example.com' });
        }
      } catch (error) {
        console.error('Failed to load admin info:', error);
      }
    };

    const fetchCurrentLogo = async () => {
      try {
        const response = await fetch('/api/vtour/settings', {
          cache: 'no-store'
        });
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.vtour_logo_url) {
            // Add cache-busting parameter to prevent browser caching
            setCurrentLogo(`${data.data.vtour_logo_url}?t=${Date.now()}`);
          }
        }
      } catch (error) {
        console.error('Error fetching current logo:', error);
      }
    };

    fetchAdminInfo();
    fetchCurrentLogo();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Password baru dan konfirmasi password tidak cocok');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password baru minimal 6 karakter');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Password berhasil diubah');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'Gagal mengubah password');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengubah password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi tipe file
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar');
        return;
      }
      
      // Validasi ukuran file (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 5MB');
        return;
      }
      
      setLogoFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadLogo = async () => {
    if (!logoFile) {
      toast.error('Pilih file logo terlebih dahulu');
      return;
    }

    setIsUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const response = await fetch('/api/vtour/settings/logo', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Logo berhasil diupload');
        // Add cache-busting parameter to prevent browser caching
        if (data.data && data.data.url) {
          setCurrentLogo(`${data.data.url}?t=${Date.now()}`);
        }
        setLogoFile(null);
        setLogoPreview(null);
        // Reset file input
        const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
        // Refresh current logo from server to ensure consistency
        await fetchCurrentLogo();
      } else {
        toast.error(data.message || 'Gagal mengupload logo');
      }
    } catch (error) {
      toast.error('Terjadi kesalahan saat mengupload logo');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    const fileInput = document.getElementById('logo-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleLogout = async () => {
    if (confirm('Apakah Anda yakin ingin logout?')) {
      try {
        await fetch('/api/admin/logout', { method: 'POST' });
        window.location.href = '/admin/login';
      } catch (error) {
        toast.error('Gagal logout');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <User className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3">
            Pengaturan Admin
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Kelola akun, keamanan, dan pengaturan sistem virtual tour Anda
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="text-white" size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Profil Admin</h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto"></div>
                </div>
                
                <div className="space-y-6">
                  <div className="text-center">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Nama</label>
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-lg font-semibold text-gray-800">{adminInfo.name || 'Admin'}</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Email</label>
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                      <p className="text-lg font-semibold text-gray-800">{adminInfo.email || 'admin@example.com'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password Card */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-center justify-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                    <Lock className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">Keamanan Akun</h2>
                    <p className="text-gray-600">Perbarui password untuk menjaga keamanan akun Anda</p>
                  </div>
                </div>
                
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Password Saat Ini</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200 pr-12 bg-gradient-to-r from-gray-50 to-red-50"
                          placeholder="Masukkan password saat ini"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-600 transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Password Baru</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-400 transition-all duration-200 pr-12 bg-gradient-to-r from-gray-50 to-green-50"
                          placeholder="Password baru (min. 6 karakter)"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-600 transition-colors"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Konfirmasi Password Baru</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 pr-12 bg-gradient-to-r from-gray-50 to-blue-50"
                          placeholder="Konfirmasi password baru"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                  </div>
              
                  <div className="flex justify-center mt-8">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-4 px-8 rounded-xl hover:from-red-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
                    >
                      <Save className="mr-3" size={24} />
                      {isLoading ? 'Mengubah Password...' : 'Perbarui Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Logo Management Section */}
          <div className="mt-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Logo Virtual Tour</h2>
                <p className="text-gray-600">Kelola logo yang akan ditampilkan di virtual tour</p>
                <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mx-auto mt-3"></div>
              </div>
              
              {/* Current and Preview Logo Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Current Logo */}
                {currentLogo && (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Logo Saat Ini</h3>
                    <div className="w-40 h-40 mx-auto border-4 border-gray-200 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50 flex items-center justify-center shadow-lg">
                      <img 
                        src={currentLogo} 
                        alt="Current Logo" 
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'flex';
                        }}
                      />
                      <div className="hidden items-center justify-center text-gray-400 text-sm">
                        Logo tidak dapat dimuat
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Logo Preview */}
                {logoPreview && (
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview Logo Baru</h3>
                    <div className="w-40 h-40 mx-auto border-4 border-green-200 rounded-2xl overflow-hidden bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center shadow-lg">
                      <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
          
              {/* Logo Upload Form */}
              <div className="space-y-6">
                <div className="text-center">
                  <label htmlFor="logo-upload" className="block text-lg font-semibold text-gray-700 mb-4">
                    Pilih Logo Baru
                  </label>
                  <div className="relative inline-block">
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-dashed border-purple-300 rounded-2xl p-8 hover:from-purple-200 hover:to-indigo-200 transition-all duration-300 cursor-pointer">
                      <Upload className="mx-auto text-purple-500 mb-4" size={32} />
                      <p className="text-purple-700 font-semibold mb-2">Klik untuk memilih file</p>
                      <p className="text-sm text-purple-600">Format: JPG, PNG, GIF • Maksimal 5MB</p>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleUploadLogo}
                    disabled={!logoFile || isUploadingLogo}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold flex items-center"
                  >
                    <Upload className="mr-2" size={20} />
                    {isUploadingLogo ? 'Mengupload...' : 'Upload Logo'}
                  </button>
                  
                  {logoFile && (
                    <button
                      onClick={handleRemoveLogo}
                      className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* System Actions Section */}
          <div className="mt-12">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LogOut className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Aksi Sistem</h2>
                <p className="text-gray-600">Kelola sesi dan akses sistem</p>
                <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded-full mx-auto mt-3"></div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-orange-600 text-white py-4 px-8 rounded-xl hover:from-red-600 hover:to-orange-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg flex items-center"
                >
                  <LogOut className="mr-3" size={24} />
                  Keluar dari Sistem
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}