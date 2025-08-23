'use client';

import { useEffect, useState, useRef } from 'react';
import { VtourMenu, Scene } from '@/types/virtual-tour';
import { getVtourMenus, createVtourMenu, deleteVtourMenu, saveMenuOrder } from '@/lib/data/virtual-tour';
import toast from 'react-hot-toast';
import { Plus, Trash2, Upload, AlertTriangle, LoaderCircle, Search, Filter, Grid, List, Eye, Settings } from 'lucide-react';
import SceneCard from '@/components/virtual-tour/SceneCard';
import AddMenuItemModal from '@/components/virtual-tour/AddMenuItemModal';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableMenuItem } from '@/components/virtual-tour/SortableMenuItem';

// Komponen Modal Konfirmasi Hapus
const DeleteConfirmationModal = ({
  isOpen, onClose, onConfirm, isLoading, itemName
}: {
  isOpen: boolean, onClose: () => void, onConfirm: () => void, isLoading: boolean, itemName: string
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-6 text-center animate-fade-in-scale">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900">Hapus Menu</h3>
        <p className="mt-2 text-sm text-gray-500">
          Apakah Anda yakin ingin menghapus menu <strong>"{itemName}"</strong>? Tindakan ini tidak dapat diurungkan.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold transition-colors disabled:opacity-50">
            Batal
          </button>
          <button type="button" onClick={onConfirm} disabled={isLoading} className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition-colors disabled:opacity-50 flex items-center gap-2">
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<VtourMenu | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);

  // Fungsi untuk memuat semua data awal dari server
  const fetchData = async () => {
    try {
      const [menuData, sceneRes, settingsRes] = await Promise.all([
        getVtourMenus(),
        fetch('/api/vtour/scenes?per_page=100'),
      fetch('/api/vtour/settings')
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
        if (settingsData.data?.vtour_logo_url) {
          setPreviewImage(settingsData.data.vtour_logo_url);
        }
      }

      setHasOrderChanged(false);
    } catch (err) {
      toast.error('Gagal memuat data dari server');
    }
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

  // Fungsi yang dijalankan saat penghapusan dikonfirmasi
  const handleConfirmDelete = async () => {
    if (!menuToDelete) return;
    setIsDeleting(true);
    try {
      await deleteVtourMenu(menuToDelete.id);
      toast.success(`Menu "${menuToDelete.name}" berhasil dihapus`);
      fetchData();
    } catch {
      toast.error('Gagal menghapus menu');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setMenuToDelete(null);
    }
  };

  // Fungsi untuk menangani upload gambar logo
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validasi sisi client
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (!allowedTypes.includes(file.type)) return toast.error('Format harus PNG, JPG, atau WEBP.');
    if (file.size > maxSize) return toast.error('Ukuran file maksimal 1MB.');

    const formData = new FormData();
    formData.append('logo', file);

    const toastId = toast.loading("Mengupload logo...");
    try {
        const res = await fetch('/api/vtour/settings/logo', {
            method: 'POST',
            body: formData,
        });
        if (!res.ok) throw new Error('Gagal upload logo ke server.');
        
        const result = await res.json();
        // Konsistensi dengan format loading awal
        if (result.data?.vtour_logo_path) {
          setPreviewImage(`http://localhost:8000/storage/vtour/${result.data.vtour_logo_path}`);
        } else if (result.data?.url) {
          setPreviewImage(result.data.url);
        } 
        toast.success("Logo berhasil diupload!", { id: toastId });
    } catch (error) {
        toast.error("Gagal mengupload logo.", { id: toastId });
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
      await saveMenuOrder(menuOrderPayload);
      toast.success('Urutan menu berhasil disimpan!');
      setHasOrderChanged(false);
    } catch (error) {
      toast.error('Gagal menyimpan urutan menu.');
    } finally {
      setIsSaving(false);
    }
  };

  // Konfigurasi sensor untuk DND Kit
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Filter and pagination logic
  const filteredScenes = scenes.filter(scene => {
    const matchesSearch = scene.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scene.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
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

  // ... (semua state dan fungsi di dalam komponen biarkan sama) ...

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        {/* HEADER SECTION */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Virtual Tour</h1>
              <p className="text-gray-600 mt-1">Kelola menu navigasi dan scene virtual tour Anda</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <span className="text-sm text-gray-600">Total Scene: </span>
                <span className="font-semibold text-blue-600">{scenes.length}</span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <span className="text-sm text-gray-600">Menu Aktif: </span>
                <span className="font-semibold text-green-600">{menus.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* MENU MANAGEMENT SECTION */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Menu Navigasi</h2>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus size={18} />
                Tambah Menu
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* PREVIEW SECTION */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-gray-900 to-gray-700 p-4 rounded-xl shadow-lg">
                  <div className="group relative aspect-[4/3] w-full rounded-lg bg-black/20 overflow-hidden mb-4">
                    <img 
                      src={previewImage || '/placeholder-logo.svg'} 
                      alt="Preview Logo" 
                      className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white transition-colors" 
                        title="Ganti Logo"
                      >
                        <Upload size={18} />
                      </button>
                      <button 
                        onClick={() => setPreviewImage('/placeholder-logo.svg')} 
                        className="p-2 bg-white/90 rounded-full text-gray-800 hover:bg-white transition-colors" 
                        title="Hapus Logo"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                  </div>
                  <p className="text-xs text-gray-300 text-center mb-3">Maks. 1MB. Format: PNG, JPG, WEBP</p>
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-white mb-2">Preview Menu:</h3>
                    {menus.length > 0 ? (
                      menus.map(menu => (
                        <div key={menu.id} className="text-center text-white font-medium p-2 text-sm bg-white/10 rounded-lg backdrop-blur-sm">
                          {menu.name}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-sm text-gray-400 p-4 border border-dashed border-gray-600 rounded-lg">
                        Menu akan tampil di sini
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* MENU LIST SECTION */}
              <div className="lg:col-span-2">
                <div className="border rounded-xl p-4 bg-gray-50 min-h-[400px]">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={menus} strategy={verticalListSortingStrategy}>
                      <div className="space-y-3">
                        {menus.map((menu) => (
                          <SortableMenuItem key={menu.id} menu={menu} onDelete={handleDeleteClick} />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                  
                  {menus.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                      <Settings size={48} className="mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Belum ada menu</p>
                      <p className="text-sm text-center">Tambahkan menu pertama untuk memulai navigasi virtual tour</p>
                    </div>
                  )}
                </div>
                
                {menus.length > 0 && (
                  <div className="mt-4 flex justify-end gap-3">
                    <button 
                      onClick={() => fetchData()} 
                      disabled={!hasOrderChanged || isSaving} 
                      className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-medium disabled:opacity-50 transition-colors"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={handleSaveOrder} 
                      disabled={!hasOrderChanged || isSaving} 
                      className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium disabled:opacity-50 flex items-center gap-2 transition-colors"
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

        {/* SCENES MANAGEMENT SECTION */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-xl font-semibold text-gray-900">Kelola Scene Virtual Tour</h2>
              
              {/* SEARCH AND FILTERS */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Cari scene..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua Scene</option>
                  <option value="active">Aktif di Menu</option>
                  <option value="inactive">Belum di Menu</option>
                </select>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {/* RESULTS INFO */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Menampilkan {paginatedScenes.length} dari {filteredScenes.length} scene
                {searchTerm && ` untuk "${searchTerm}"`}
              </p>
              
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={8}>8 per halaman</option>
                <option value={12}>12 per halaman</option>
                <option value={16}>16 per halaman</option>
                <option value={24}>24 per halaman</option>
              </select>
            </div>
            
            {/* SCENES GRID/LIST */}
            {paginatedScenes.length > 0 ? (
              <div className={`${
                viewMode === 'grid' 
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
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <Eye size={48} className="mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">Tidak ada scene ditemukan</p>
                <p className="text-sm text-center">
                  {searchTerm ? `Tidak ada scene yang cocok dengan "${searchTerm}"` : 'Belum ada scene yang dibuat'}
                </p>
              </div>
            )}
            
            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Sebelumnya
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            )}
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