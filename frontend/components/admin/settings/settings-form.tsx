'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function SettingsForm() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // ✅ Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          toast.error('Silakan login terlebih dahulu');
          router.push('/admin/sign-in');
          return;
        }

        const res = await fetch('/api/login/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (res.ok) {
          const name = data.username || data.admin?.username || '';
          setUsername(name);
          setNewUsername(name);
        } else {
          toast.error(data.message || 'Gagal memuat data profil');
        }
      } catch (error) {
        console.error('Fetch profile error:', error);
        toast.error('Terjadi kesalahan saat memuat data');
      }
    };

    fetchProfile();
  }, [router]);

  // ✅ Update profile
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !currentPassword) {
      toast.error('Username dan password lama wajib diisi');
      return;
    }

    if (newPassword && newPassword.length < 4) {
      toast.error('Password baru minimal 4 karakter');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('Konfirmasi password tidak cocok');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Anda belum login');
        router.push('/admin/sign-in');
        return;
      }

      const res = await fetch('/api/admin/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          current_password: currentPassword,
          new_password: newPassword || null,
          new_password_confirmation: confirmPassword || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success('Profil berhasil diperbarui!');
      } else {
        if (data.message?.toLowerCase().includes('password lama salah')) {
          toast.error('Password lama salah');
        } else {
          toast.error(data.message || 'Update gagal');
        }
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error('Terjadi kesalahan server');
    } finally {
      setLoading(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  // ✅ Update username di form
  const handleUsernameUpdate = () => {
    if (!newUsername.trim()) {
      toast.error('Username tidak boleh kosong');
      return;
    }
    setUsername(newUsername);
    setShowModal(false);
    toast.success('Username diperbarui di form');
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');  // gunakan key yang sama seperti saat login
    toast.success('Berhasil logout!');
    router.push('/admin/sign-in');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2 px-2 relative">

      {/* Modal edit username */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Edit Username</h2>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg mb-4"
              placeholder="Username baru"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-black"
              >
                Batal
              </button>
              <button
                onClick={handleUsernameUpdate}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal konfirmasi logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-sm text-center">
            <p className="text-gray-800 text-lg font-medium mb-6">Apakah kamu yakin ingin logout?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Ya, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main form */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-md p-10 border border-gray-200">
        <button
          onClick={() => router.back()}
          className="flex items-center text-sm font-medium text-gray-700 mb-6 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Kembali
        </button>
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Pengaturan Akun</h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={username}
                disabled
                className="w-full rounded-lg border px-4 py-3 bg-gray-100 text-gray-700"
              />
              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
              >
                <Pencil size={16} />
                Edit
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Lama</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Masukkan password lama"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Masukkan password baru"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
              placeholder="Ulangi password baru"
            />
          </div>

          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition"
            >
              {loading ? 'Sedang memperbarui...' : 'Update Profile'}
            </button>
            <button
              type="button"
              onClick={() => setShowLogoutConfirm(true)}
              className="w-full border border-red-500 text-red-600 font-semibold py-3 px-4 rounded-lg hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
