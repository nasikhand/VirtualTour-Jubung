'use client';

import { useEffect, useState, useRef } from 'react';
import { VtourMenu, Scene } from '@/types/virtual-tour';
import { getVtourMenus, createVtourMenu, deleteVtourMenu, saveMenuOrder } from '@/lib/data/virtual-tour';
import toast from 'react-hot-toast';
import { Plus, Trash2, Upload, AlertTriangle, LoaderCircle, Search, Filter, Grid, List, Eye, Settings, Moon, Sun, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import SceneCard from '@/components/virtual-tour/SceneCard';
import AddMenuItemModal from '@/components/virtual-tour/AddMenuItemModal';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableMenuItem } from '@/components/virtual-tour/SortableMenuItem';

// ✅ KOMPONEN MODAL SEKARANG DIDEFINISIKAN DI SINI (DI LUAR KOMPONEN UTAMA)
const DeleteConfirmationModal = ({
  isOpen, onClose, onConfirm, isLoading, itemName
}: {
  isOpen: boolean, onClose: () => void, onConfirm: () => void, isLoading: boolean, itemName: string
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-6 text-center animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-gray-700">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Hapus Menu</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Apakah Anda yakin ingin menghapus menu <strong className="text-gray-900 dark:text-white">"{itemName}"</strong>? Tindakan ini tidak dapat diurungkan.
        </p>
        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-semibold transition-all duration-200 disabled:opacity-50 border border-gray-200 dark:border-gray-600"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 font-semibold transition-all duration-200 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl"
          >
            {isLoading ? <LoaderCircle className="animate-spin" size={18} /> : null}
            {isLoading ? 'Menghapus...' : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function VirtualTourHotspotsPage() {
  const [menus, setMenus] = useState<VtourMenu[]>([]);
  const [scenes, setScenes] = useState<Scene[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>("/placeholder-logo.svg");

  // New states for modernized features
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<VtourMenu | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

 // Fungsi untuk memuat semua data awal dari server
const fetchData = async () => {
  setIsLoading(true);
  try {
    const [menuData, sceneRes, settingsRes] = await Promise.all([
      getVtourMenus(),
      fetch('/api/vtour/scenes?per_page=100'),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vtour/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('vtourAdminToken')}`
        }
      })
    ]);

    setMenus(menuData);

    if (sceneRes.ok) {
      const sceneData = await sceneRes.json();
      setScenes(sceneData.data ?? []);
    } else {
      toast.error('Gagal memuat daftar scene');
    }

    if (settingsRes.ok) {
      const settingsData = await settingsRes.json();

      if (settingsData.data?.vtour_logo_path) {
        // Ambil path logo dari DB tanpa hash
        const logoPath = settingsData.data.vtour_logo_path;

        // Bangun URL langsung ke storage backend Laravel
        const publicLogoUrl = `${process.env.NEXT_PUBLIC_STORAGE_URL}/${logoPath}`;
        setPreviewImage(publicLogoUrl);
      }
    }

    setHasOrderChanged(false);
  } catch (err) {
    toast.error('Gagal memuat data dari server');
  } finally {
    setIsLoading(false);
  }
};


  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi untuk menambah menu baru
  const handleAddMenu = async (data: Partial<VtourMenu>) => {
    setIsSaving(true);
    try {
      if (menus.some(menu => menu.scene_id === data.scene_id)) {
        toast.error('Scene ini sudah ada di dalam menu.');
        return;
      }
      await createVtourMenu(data);
      toast.success(`Menu berhasil ditambahkan`);
      fetchData();
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Gagal menambahkan menu');
    } finally {
      setIsSaving(false);
    }
  };

  // Fungsi untuk membuka modal konfirmasi hapus
  const handleDeleteClick = (menu: VtourMenu) => {
    setMenuToDelete(menu);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
  if (!menuToDelete) return;
  setIsDeleting(true);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vtour/menus/${menuToDelete.id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('vtourAdminToken')}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}: Gagal menghapus menu`);
    }

    toast.success(`Menu "${menuToDelete.name}" berhasil dihapus`);
    fetchData();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus menu";
    toast.error(errorMessage);
  } finally {
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setMenuToDelete(null);
  }
};




  // Fungsi untuk menangani akhir dari proses drag-and-drop
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setMenus((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        setHasOrderChanged(true);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Fungsi untuk menyimpan urutan menu yang baru
const handleSaveOrder = async () => {
  setIsSaving(true);
  const menuOrderPayload = menus.map((menu, index) => ({ id: menu.id, order: index }));

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vtour/menus/update-order`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('vtourAdminToken')}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(menuOrderPayload),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}: Gagal update urutan menu`);
    }

    toast.success("Urutan menu berhasil disimpan!");
    setHasOrderChanged(false);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menyimpan urutan menu";
    toast.error(errorMessage);
  } finally {
    setIsSaving(false);
  }
};


  // Konfigurasi sensor untuk DND Kit
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Filter and pagination logic
  const filteredScenes = scenes.filter(scene => {
    const matchesSearch = scene.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (scene.description && scene.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = filterStatus === 'all' ||
      (filterStatus === 'active' && menus.some(menu => menu.scene_id === scene.id)) ||
      (filterStatus === 'inactive' && !menus.some(menu => menu.scene_id === scene.id));

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredScenes.length / itemsPerPage);
  const paginatedScenes = filteredScenes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

    // Fungsi untuk menangani upload gambar logo langsung ke backend Laravel
const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validasi sisi client
  const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB
  if (!allowedTypes.includes(file.type)) return toast.error('Format harus PNG, JPG, atau WEBP.');
  if (file.size > maxSize) return toast.error('Ukuran file maksimal 2MB.');

  const formData = new FormData();
  formData.append('logo', file);

  const toastId = toast.loading("Mengupload logo...");
  try {
    // Panggil backend Laravel langsung
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vtour/settings/logo`, {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('vtourAdminToken')}`
        // Jangan set 'Content-Type', biarkan browser otomatis membuat boundary
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Gagal mem-parsing respons error' }));
      throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Gagal upload logo.`);
    }

    const result = await res.json();

    // Ambil path logo dari response backend
    let logoPath = null;
    if (result.data?.vtour_logo_path) {
      logoPath = result.data.vtour_logo_path;
    } else if (result.vtour_logo_path) {
      logoPath = result.vtour_logo_path;
    } else if (result.data?.path) {
      logoPath = result.data.path;
    } else if (result.path) {
      logoPath = result.path;
    }

    if (!logoPath) {
      console.error('❌ Path logo tidak ditemukan di respons:', result);
      throw new Error('Respons tidak mengandung path logo yang valid');
    }

    // Gunakan storage public backend (langsung)
    const finalUrl = `${process.env.NEXT_PUBLIC_STORAGE_URL}/${logoPath}`;
    setPreviewImage(finalUrl);
    toast.success("Logo berhasil diupload!", { id: toastId });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Gagal mengupload logo.";
    toast.error(errorMessage, { id: toastId });
  } finally {
    event.target.value = ''; // Reset input file
  }
};

// Fungsi untuk menghapus logo dari backend Laravel
const handleRemoveLogo = async () => {
  if (!confirm("Apakah Anda yakin ingin menghapus logo?")) return;

  const toastId = toast.loading("Menghapus logo...");
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/vtour/settings/logo`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('vtourAdminToken')}`,
        "Content-Type": "application/json"
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Gagal mem-parsing respons error' }));
      throw new Error(errorData.message || errorData.error || `HTTP ${res.status}: Gagal menghapus logo.`);
    }

    // Reset preview image di frontend
    setPreviewImage('/placeholder-logo.svg');
    toast.success("Logo berhasil dihapus!", { id: toastId });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Gagal menghapus logo.";
    toast.error(errorMessage, { id: toastId });
  }
};


  return (
    <>
      <div className={isDarkMode ? 'dark' : ''}>
        <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-all duration-300">
          {/* MODERN HEADER SECTION */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Manajemen Virtual Tour
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Kelola menu navigasi dan scene virtual tour dengan mudah</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Dark Mode Toggle */}
                <button
                  onClick={toggleDarkMode}
                  className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 dark:border-gray-700 group"
                  title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-12 transition-transform" />
                  ) : (
                    <Moon className="w-5 h-5 text-gray-600 group-hover:-rotate-12 transition-transform" />
                  )}
                </button>

                {/* Stats Cards */}
                <div className="flex items-center gap-3">
                  <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Total Scene:</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{isLoading ? '...' : scenes.length}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Menu Aktif:</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{isLoading ? '...' : menus.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MODERN MENU MANAGEMENT SECTION */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl mb-8 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Menu Navigasi</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Atur urutan dan kelola menu virtual tour</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus size={18} />
                  Tambah Menu
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              {/* Modern Menu Preview */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 flex items-center gap-2">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Preview Menu
                </h3>
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 sm:p-6 border border-gray-200 dark:border-gray-600">
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {isLoading ? (
                      <div className="flex gap-2 sm:gap-3">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="bg-gray-300 dark:bg-gray-600 animate-pulse px-3 sm:px-4 py-1.5 sm:py-2 rounded-full h-6 sm:h-8 w-16 sm:w-24"></div>
                        ))}
                      </div>
                    ) : menus.map((menu, index) => (
                      <div key={menu.id} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                        <span className="bg-white bg-opacity-20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs mr-1.5 sm:mr-2">{index + 1}</span>
                        {menu.scene?.name || menu.name}
                      </div>
                    ))}
                    {!isLoading && menus.length === 0 && (
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 italic">
                        <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm">Belum ada menu yang ditambahkan</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                {/* PREVIEW SECTION */}
                <div className="xl:col-span-1">
                  {/* Logo Preview Section */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Logo Virtual Tour</h3>
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                        >
                          Upload Logo
                        </button>
                          {previewImage && previewImage !== '/placeholder-logo.svg' && (
                            <button
                              onClick={handleRemoveLogo} // panggil fungsi async DELETE ke backend
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                              Hapus
                            </button>
                          )}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                      <div className="w-32 h-32 mx-auto relative">
                          <img
                           src={previewImage || '/placeholder-logo.svg'}
                           alt="Preview Logo"
                           className="w-full h-full object-contain transition-opacity duration-300"
                           onError={(e) => {
                             console.warn('Logo image failed to load:', previewImage);
                             e.currentTarget.src = '/placeholder-logo.svg';
                           }}
                         />
                        {previewImage === '/placeholder-logo.svg' && (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs text-center">
                            Logo belum diupload
                          </div>
                        )}
                      </div>
                      <p className="text-center text-sm text-gray-600 mt-2">
                        Format: PNG, JPG, WEBP • Maksimal 2MB
                      </p>
                    </div>
                  </div>
                </div>

                {/* MODERN MENU LIST SECTION */}
                <div className="xl:col-span-2">
                  <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 min-h-[400px] shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
                        <List className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Pengaturan Menu</h3>
                    </div>

                    {isLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="bg-gray-300 dark:bg-gray-600 animate-pulse rounded-xl h-16"></div>
                        ))}
                      </div>
                    ) : (
                      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={menus} strategy={verticalListSortingStrategy}>
                          <div className="space-y-3 sm:space-y-4">
                            {menus.map((menu) => (
                              <SortableMenuItem key={menu.id} menu={menu} onDelete={handleDeleteClick} />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}

                    {!isLoading && menus.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-48 sm:h-64 text-gray-500 dark:text-gray-400">
                        <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                          <Settings size={40} className="opacity-50" />
                        </div>
                        <p className="text-lg sm:text-xl font-semibold mb-2 text-center">Belum ada menu</p>
                        <p className="text-sm text-center max-w-md px-4">Tambahkan menu pertama untuk memulai navigasi virtual tour Anda</p>
                      </div>
                    )}
                  </div>

                  {!isLoading && menus.length > 0 && (
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                      <button
                        onClick={() => fetchData()}
                        disabled={!hasOrderChanged || isSaving}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none text-sm sm:text-base"
                      >
                        Reset
                      </button>
                      <button
                        onClick={handleSaveOrder}
                        disabled={!hasOrderChanged || isSaving}
                        className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold disabled:opacity-50 flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none text-sm sm:text-base"
                      >
                        {isSaving && hasOrderChanged && <LoaderCircle className="animate-spin" size={18} />}
                        Simpan Urutan
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* MODERN SCENES MANAGEMENT SECTION */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Kelola Scene Virtual Tour</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Atur dan kelola semua scene dalam virtual tour</p>
                  </div>
                </div>

                {/* MODERN SEARCH AND FILTERS */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                    <input
                      type="text"
                      placeholder="Cari scene..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent w-full sm:w-64 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm transition-all duration-200"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                    className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                  >
                    <option value="all">Semua Scene</option>
                    <option value="active">Aktif di Menu</option>
                    <option value="inactive">Belum di Menu</option>
                  </select>

                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-md'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                      title="Grid View"
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-md'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                        }`}
                      title="List View"
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* MODERN RESULTS INFO */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {isLoading ? 'Memuat...' : `Menampilkan ${paginatedScenes.length} dari ${filteredScenes.length} scene`}
                    </p>
                    {searchTerm && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Hasil pencarian untuk "{searchTerm}"
                      </p>
                    )}
                  </div>
                </div>

                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm transition-all duration-200"
                >
                  <option value={8}>8 per halaman</option>
                  <option value={12}>12 per halaman</option>
                  <option value={16}>16 per halaman</option>
                  <option value={24}>24 per halaman</option>
                </select>
              </div>

              {/* MODERN SCENES GRID/LIST */}
              {isLoading ? (
                <div className={`${viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
                  }`}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                    <div key={i} className="bg-gray-300 dark:bg-gray-600 animate-pulse rounded-2xl h-64"></div>
                  ))}
                </div>
              ) : paginatedScenes.length > 0 ? (
                <div className={`${viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'
                  : 'space-y-4'
                  }`}>
                  {paginatedScenes.map((scene) => (
                    <SceneCard
                      key={scene.id}
                      scene={scene}
                      href={`/admin/virtual-tour-section/scenes/${scene.id}/edit-links`}
                      viewMode={viewMode}
                      isInMenu={menus.some(menu => menu.scene_id === scene.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
                  <div className="p-6 bg-gray-100 dark:bg-gray-700 rounded-full mb-6">
                    <Eye size={48} className="opacity-50" />
                  </div>
                  <p className="text-xl font-semibold mb-3">Tidak ada scene ditemukan</p>
                  <p className="text-sm text-center max-w-md">
                    {searchTerm ? `Tidak ada scene yang cocok dengan "${searchTerm}"` : 'Belum ada scene yang dibuat untuk virtual tour ini'}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Hapus Filter
                    </button>
                  )}
                </div>
              )}

              {/* MODERN PAGINATION */}
              {!isLoading && totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Halaman {currentPage} dari {totalPages}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium shadow-sm"
                    >
                      Sebelumnya
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let page;
                        if (totalPages <= 5) {
                          page = i + 1;
                        } else if (currentPage <= 3) {
                          page = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          page = totalPages - 4 + i;
                        } else {
                          page = currentPage - 2 + i;
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`w-10 h-10 rounded-xl transition-all duration-200 font-semibold ${currentPage === page
                              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg transform scale-105'
                              : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md'
                              }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 text-gray-700 dark:text-gray-300 font-medium shadow-sm"
                    >
                      Selanjutnya
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <AddMenuItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddMenu}
        scenes={scenes.filter(scene => !menus.some(menu => menu.scene_id === scene.id))}
        isSaving={isSaving}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        itemName={menuToDelete?.name || ''}
      />
    </>
  );
}