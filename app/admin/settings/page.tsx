'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, X, Settings, User, Lock, LogOut, Edit3 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LogoutConfirmationModal from '@/components/ui/logout-confirmation-modal';

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ username: '', name: '' });
  const [newUsername, setNewUsername] = useState('');
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Load admin info dari API dengan token
    const fetchAdminInfo = async () => {
      try {
        const token = localStorage.getItem('vtourAdminToken');
        if (!token) {
          console.log('Token tidak ditemukan, menggunakan username dari localStorage');
          const storedUsername = localStorage.getItem('vtourAdminUsername') || 'Admin';
          setAdminInfo({ 
            username: storedUsername, 
            name: storedUsername 
          });
          setNewUsername(storedUsername);
          return;
        }

        const response = await fetch('/api/vtour-admin/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Profile data from API:', data);
          setAdminInfo({ 
            username: data.username || 'Admin', 
            name: data.name || data.username || 'Admin' 
          });
          setNewUsername(data.username || 'Admin');
          
          // Update localStorage dengan data terbaru
          if (data.username) {
            localStorage.setItem('vtourAdminUsername', data.username);
          }
        } else {
          console.log('Failed to fetch profile, using localStorage');
          const storedUsername = localStorage.getItem('vtourAdminUsername') || 'Admin';
          setAdminInfo({ 
            username: storedUsername, 
            name: storedUsername 
          });
          setNewUsername(storedUsername);
        }
      } catch (error) {
        console.error('Failed to load admin info:', error);
        const storedUsername = localStorage.getItem('vtourAdminUsername') || 'Admin';
        setAdminInfo({ username: storedUsername, name: storedUsername });
        setNewUsername(storedUsername);
      }
    };

    fetchAdminInfo();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUsername || !currentPassword) {
      toast.error('Username dan password lama wajib diisi');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Password baru dan konfirmasi password tidak cocok');
      return;
    }
    
    if (newPassword.length < 4) {
      toast.error('Password baru minimal 4 karakter');
      return;
    }

    setIsLoading(true);
    
    // Debug: log data yang akan dikirim
    const requestData = {
      username: newUsername,
      current_password: currentPassword,
      new_password: newPassword,
      new_password_confirmation: confirmPassword
    };
    console.log('Sending update password request:', requestData);
    
    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem('vtourAdminToken');
      if (!token) {
        toast.error('Token tidak ditemukan, silakan login ulang');
        return;
      }

      const response = await fetch('/api/vtour-admin/update-profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('Response:', data);
      
      if (response.ok) {
        toast.success('Password berhasil diubah');
        // Update username di localStorage jika berubah
        if (newUsername !== adminInfo.username) {
          localStorage.setItem('vtourAdminUsername', newUsername);
          setAdminInfo(prev => ({ ...prev, username: newUsername, name: newUsername }));
        }
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        if (data.message?.toLowerCase().includes('password salah')) {
          toast.error('Password lama salah');
        } else {
          toast.error(data.message || 'Gagal mengubah password');
        }
      }
    } catch (error) {
      console.error('Update password error:', error);
      toast.error('Terjadi kesalahan saat mengubah password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim()) {
      toast.error('Username tidak boleh kosong');
      return;
    }

    if (!currentPassword) {
      toast.error('Password saat ini wajib diisi');
      return;
    }

    setIsLoading(true);
    
    // Debug: log data yang akan dikirim
    const requestData = {
      username: newUsername,
      current_password: currentPassword,
      new_password: null,
      new_password_confirmation: null
    };
    console.log('Sending update username request:', requestData);
    
    try {
      // Ambil token dari localStorage
      const token = localStorage.getItem('vtourAdminToken');
      if (!token) {
        toast.error('Token tidak ditemukan, silakan login ulang');
        return;
      }

      const response = await fetch('/api/vtour-admin/update-profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      const data = await response.json();
      console.log('Response:', data);
      
      if (response.ok) {
        toast.success('Username berhasil diubah');
        // Update username di localStorage
        localStorage.setItem('vtourAdminUsername', newUsername);
        setAdminInfo(prev => ({ ...prev, username: newUsername, name: newUsername }));
        setShowUsernameModal(false);
        setCurrentPassword('');
      } else {
        if (data.message?.toLowerCase().includes('password salah')) {
          toast.error('Password salah');
        } else {
          toast.error(data.message || 'Gagal mengubah username');
        }
      }
    } catch (error) {
      console.error('Update username error:', error);
      toast.error('Terjadi kesalahan saat mengubah username');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Hapus token dan redirect seperti di sidebar
    localStorage.removeItem("vtourAdminToken");
    localStorage.removeItem("vtourAdminTokenTimestamp");
    localStorage.removeItem("vtourAdminUsername");
    toast.success('Berhasil logout');
    window.location.href = '/admin/sign-in';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Username Edit Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Edit Username</h3>
              <button
                onClick={() => setShowUsernameModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Username Baru</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200"
                placeholder="Masukkan username baru"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">Password Saat Ini</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200 pr-12"
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

            <div className="flex gap-3">
              <button
                onClick={() => setShowUsernameModal(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateUsername}
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Mengubah...' : 'Simpan'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Logout</h3>
            <p className="text-gray-600 mb-6">Apakah Anda yakin ingin keluar dari sistem?</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}

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
          {/* Debug Info - Hanya tampilkan di development
          {process.env.NODE_ENV === 'development' && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">🔍 Debug Info (Development Only)</h3>
              <div className="text-xs text-yellow-700 space-y-1">
                <p>Username dari localStorage: {localStorage.getItem('vtourAdminUsername') || 'Tidak ada'}</p>
                <p>Token tersedia: {localStorage.getItem('vtourAdminToken') ? 'Ya' : 'Tidak'}</p>
                <p>API URL: {process.env.NEXT_PUBLIC_API_URL || 'Tidak diset'}</p>
              </div>
            </div>
          )} */}

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
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Username</label>
                    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-center gap-3">
                        <p className="text-lg font-semibold text-gray-800">{adminInfo.username || 'Admin'}</p>
                        <button
                          onClick={() => setShowUsernameModal(true)}
                          className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                          title="Edit Username"
                        >
                                                      <Edit3 size={16} className="text-blue-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <label className="block text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Status</label>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                      <p className="text-lg font-semibold text-green-800">Aktif</p>
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
                          placeholder="Password baru (min. 4 karakter)"
                          required
                          minLength={4}
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
                          minLength={4}
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
                                              <Settings className="mr-3" size={24} />
                      {isLoading ? 'Mengubah Password...' : 'Perbarui Password'}
                    </button>
                  </div>
                </form>
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
                  onClick={() => setShowLogoutConfirm(true)}
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

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari sistem? Semua data yang belum disimpan akan hilang."
        confirmText="Ya, Logout"
        cancelText="Batal"
      />
    </div>
  );
}