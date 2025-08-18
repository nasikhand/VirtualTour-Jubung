'use client';

import { useEffect, useState, useRef } from 'react';
import { VtourMenu, Scene } from '@/types/virtual-tour';
import { getVtourMenus, createVtourMenu, deleteVtourMenu, saveMenuOrder } from '@/lib/data/virtual-tour';
import toast from 'react-hot-toast';
import { Plus, Trash2, Upload, AlertTriangle, LoaderCircle } from 'lucide-react';
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
  const [previewImage, setPreviewImage] = useState<string | null>("/placeholder-logo.png");
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
        if (settingsData.data?.vtour_logo_path) {
          setPreviewImage(`/api/vtour/images/${settingsData.data.vtour_logo_path}`);
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
        setPreviewImage(`/api/vtour/images/${result.data.path}`); 
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

  // ... (semua state dan fungsi di dalam komponen biarkan sama) ...

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
        {/* KARTU MANAJEMEN MENU */}
        <div className="relative bg-white p-6 rounded-xl shadow-md">
          
          {/* --- PREVIEW (SEKARANG MELAYANG) --- */}
          <div className="absolute top-6 left-6 z-10 w-64 bg-black/20 backdrop-blur-md p-2 rounded-lg shadow-2xl border border-white/20">
            <div className="group relative aspect-[4/3] w-full rounded-md bg-transparent overflow-hidden">
              <img src={previewImage || '/placeholder-logo.png'} alt="Preview Logo" className="w-full h-full object-contain p-4 transition-transform group-hover:scale-105"/>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-white/80 rounded-full text-gray-800 hover:bg-white" title="Ganti Logo"><Upload size={18} /></button>
                <button onClick={() => setPreviewImage('/placeholder-logo.png')} className="p-2 bg-white/80 rounded-full text-gray-800 hover:bg-white" title="Hapus Logo"><Trash2 size={18} /></button>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
            </div>
            <p className="text-xs text-white/80 mt-2 text-center">Maks. 1MB. Format: PNG, JPG, WEBP.</p>
            <div className="p-1 mt-1">
              {menus.length > 0 ? (
                menus.map(menu => (
                  <div key={menu.id} className="text-center text-white font-semibold p-2 text-sm bg-black/30 rounded-md mb-1 last:mb-0">
                    {menu.name}
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-white/70 p-4">Menu akan tampil di sini</div>
              )}
            </div>
          </div>
          
          {/* --- KONTEN UTAMA (MENU LIST & LOKASI) --- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Kolom kosong untuk memberi ruang bagi preview yang melayang di layar besar */}
            <div className="md:col-span-1 hidden md:block"></div>

            {/* KOLOM KANAN: MENU LIST */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Virtual Tour Menu</h2>
              <div className="border rounded-lg p-3 bg-gray-50/70 min-h-[200px] space-y-2">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={menus} strategy={verticalListSortingStrategy}>
                    {menus.map((menu) => (<SortableMenuItem key={menu.id} menu={menu} onDelete={handleDeleteClick} />))}
                  </SortableContext>
                </DndContext>
                <button onClick={() => setIsModalOpen(true)} className="w-full flex justify-center items-center p-3 border-2 border-dashed rounded-md text-gray-400 hover:bg-gray-100 hover:border-gray-400 transition-colors"><Plus size={20} /></button>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button onClick={() => fetchData()} disabled={!hasOrderChanged || isSaving} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold disabled:opacity-50">Reset</button>
                <button onClick={handleSaveOrder} disabled={!hasOrderChanged || isSaving} className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold disabled:opacity-50 flex items-center gap-2">
                  {isSaving && hasOrderChanged && <LoaderCircle className="animate-spin" size={18} />}
                  Save Order
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* KARTU LOKASI VIRTUAL TOUR */}
        <div className="bg-white p-6 rounded-xl shadow-md mt-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Virtual Tour Location</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {scenes.map((scene) => (<SceneCard key={scene.id} scene={scene} href={`/admin/virtual-tour-section/scenes/${scene.id}/edit-links`}/>))}
          </div>
        </div>
      </div>

      {/* MODAL */}
      <AddMenuItemModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddMenu} scenes={scenes.filter(scene => !menus.some(menu => menu.scene_id === scene.id))} isSaving={isSaving}/>
      <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} isLoading={isDeleting} itemName={menuToDelete?.name || ''}/>
    </>
  );
}