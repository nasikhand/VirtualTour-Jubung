'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Scene } from '@/types/virtual-tour'
import Link from 'next/link'
import PannellumViewer from './PannellumViewer'
import RenameSpotModal from './RenameSpotModal'
import AdjustRotationModal from './AdjustRotationModal'
import DeleteConfirmationModal from './DeleteConfirmationModal'
import PlacementEditor from './PlacementEditor'
import { Settings, Camera, MapPin, Trash2, Pencil, ArrowLeft } from 'lucide-react'

// Kita tidak perlu memuat script Pannellum di sini lagi
// karena PannellumViewer sudah menanganinya

export default function SceneEditor({ initialScene }: { initialScene: Scene }) {
  const [scene, setScene] = useState<Scene>(initialScene)
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false)
  const [isRotationModalOpen, setIsRotationModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPlacementMode, setIsPlacementMode] = useState(false);
  const router = useRouter()

  const [currentPosition, setCurrentPosition] = useState({
    yaw: scene.default_yaw ?? 0,
    pitch: scene.default_pitch ?? 0,
  })

  // ✅ Menggunakan API Proxy untuk gambar
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    return `/api/vtour/images/${encodeURI(imagePath)}`;
  };
  const imageUrl = getImageUrl(scene.image_path);

  // Fungsi ini perlu dihubungkan ke backend untuk menyimpan permanen
  const handleSetDefaultView = async (data: { yaw: number, pitch: number }) => {
    // TODO: Buat fetch request ke backend untuk update scene
    // Contoh: await fetch(`/api/vtour/scenes/${scene.id}`, { method: 'PUT', body: JSON.stringify({ default_yaw: data.yaw, default_pitch: data.pitch }) });
    setScene(prev => ({ ...prev, default_yaw: data.yaw, default_pitch: data.pitch }));
    toast.success("Tampilan default berhasil diupdate (simulasi).");
    setIsRotationModalOpen(false); // Tutup modal setelah simpan
  }

  const handleDeleteScene = async () => {
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/virtual-tour/scenes/${scene.id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Gagal menghapus scene.')
      toast.success('Scene berhasil dihapus!')
      router.push('/admin/virtual-tour-section')
      router.refresh()
    } catch (error) {
      toast.error('Terjadi kesalahan saat menghapus scene.')
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  // Jika mode penempatan aktif, render komponen PlacementEditor
  if (isPlacementMode) {
    return <PlacementEditor scene={scene} onExit={() => setIsPlacementMode(false)} />
  }

  return (
    <>
      <div className="flex flex-col p-6 md:p-8 bg-gray-50 min-h-screen">
        <header className="mb-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/virtual-tour-section" className="p-2 bg-white rounded-md shadow-sm hover:bg-gray-100">
              <ArrowLeft size={20} className="text-gray-700" />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center">
              Spot: {scene.name}
              <button onClick={() => setIsRenameModalOpen(true)} className="ml-3 text-gray-500 hover:text-blue-600">
                <Pencil size={20} />
              </button>
            </h1>
          </div>
          <button onClick={() => setIsDeleteModalOpen(true)} className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center">
            <Trash2 size={18} className="mr-2" />
            Hapus Scene
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-2 rounded-xl shadow-lg">
            <div className="h-[60vh] w-full bg-gray-200 rounded-lg">
              {/* PannellumViewer akan memuat script-nya sendiri */}
              <PannellumViewer
                imageUrl={imageUrl}
                initialYaw={scene.default_yaw ?? 0}
                initialPitch={scene.default_pitch ?? 0}
                hotspots={[]}
                onViewerClick={() => {}}
                onHotspotClick={() => {}}
                onCameraUpdate={setCurrentPosition}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-4">
                <Camera size={20} className="mr-3 text-blue-600" /> Posisi Kamera
                <button
                  onClick={() => setIsRotationModalOpen(true)}
                  className="ml-auto text-gray-400 hover:text-blue-600"
                  title="Atur tampilan default"
                >
                  <Settings size={20} />
                </button>
              </h2>
              <div className="space-y-2 text-sm bg-gray-100 p-4 rounded-lg">
                <p>Default: <span className="font-mono">Yaw:{scene.default_yaw?.toFixed(2) ?? 'N/A'} Pitch:{scene.default_pitch?.toFixed(2) ?? 'N/A'}</span></p>
                <p className="font-bold">Saat Ini: <span className="font-mono">Yaw:{currentPosition.yaw.toFixed(2)} Pitch:{currentPosition.pitch.toFixed(2)}</span></p>
              </div>
              <button onClick={() => handleSetDefaultView({ yaw: currentPosition.yaw, pitch: currentPosition.pitch })} className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center">
                <MapPin size={18} className="mr-2" /> Jadikan Tampilan Default
              </button>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Items Placement</h2>
              <button 
                onClick={() => setIsPlacementMode(true)} 
                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Add Info Hotspot
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODALS --- */}
      <RenameSpotModal isOpen={isRenameModalOpen} onClose={() => setIsRenameModalOpen(false)} currentName={scene.name} onSave={(newName) => setScene((s) => ({ ...s, name: newName }))} />
      
      <AdjustRotationModal
        isOpen={isRotationModalOpen}
        onClose={() => setIsRotationModalOpen(false)}
        currentPosition={currentPosition}
        onSave={handleSetDefaultView}
        // ✅ PERBAIKAN: Tambahkan prop imageUrl di sini
        imageUrl={imageUrl} 
      />
      
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleDeleteScene} 
        isLoading={isDeleting} 
      />
    </>
  )
}