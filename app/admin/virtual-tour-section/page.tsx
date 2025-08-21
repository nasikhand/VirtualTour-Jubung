// Lokasi file: frontend/app/admin/virtual-tour-section/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { Scene } from '@/types/virtual-tour'
import SceneCard from '@/components/virtual-tour/SceneCard'
import CreateSceneModal from '@/components/virtual-tour/CreateSceneModal'
import { Plus, ChevronLeft, ChevronRight, ImageOff, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

// --- Komponen Helper (Tidak perlu diubah) ---

const SceneGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {[...Array(8)].map((_, i) => (
      <div key={i} className="h-56 w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700"></div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 py-24 text-center">
    <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
      <ImageOff className="text-gray-400 dark:text-gray-500" size={32} />
    </div>
    <h2 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
      Belum Ada Scene Ditemukan
    </h2>
    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
      Mulai dengan menekan tombol <strong>"+ Tambah Scene"</strong> di pojok kanan atas.
    </p>
  </div>
);


// --- Komponen Halaman Utama ---

export default function VtourScenePage() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false) // State untuk mengontrol modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<Scene | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadScenes = (page = 1) => {
    setLoading(true)
    // Panggil API Proxy Next.js
    fetch(`/api/vtour/scenes?page=${page}`)
      .then(res => res.json())
      .then(data => {
        setScenes(data.data ?? [])
        setCurrentPage(data.current_page ?? 1)
        setLastPage(data.last_page ?? 1)
      })
      .catch(err => {
        console.error('Error fetching scenes:', err)
        setScenes([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadScenes(currentPage)
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage && newPage !== currentPage) {
      loadScenes(newPage);
    }
  }

  const handleSuccess = () => {
    loadScenes(1);
    setIsModalOpen(false);
  }

  const handleDeleteClick = (scene: Scene) => {
    setSceneToDelete(scene)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!sceneToDelete || isDeleting) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/vtour/scenes/${sceneToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success('Scene berhasil dihapus!')
        loadScenes(currentPage)
        setIsDeleteModalOpen(false)
        setSceneToDelete(null)
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || 'Gagal menghapus scene')
      }
    } catch (error) {
      console.error('Error deleting scene:', error)
      toast.error('Terjadi kesalahan saat menghapus scene')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false)
    setSceneToDelete(null)
  }

  const renderContent = () => {
    if (loading) {
      return <SceneGridSkeleton />;
    }
    if (scenes.length === 0) {
      return <EmptyState />;
    }
    return (
      <>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {scenes.map(scene => (
            <SceneCard key={scene.id} scene={scene} onDelete={handleDeleteClick} />
          ))}
        </div>
        {/* Paginasi */}
        {lastPage > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
             <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft size={16} />
                Sebelumnya
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Halaman {currentPage} dari {lastPage}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="flex items-center gap-2 rounded-md bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Selanjutnya
                <ChevronRight size={16} />
              </button>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        <main className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Manajemen Virtual Tour
              </h1>
              <p className="mt-1 text-gray-500 dark:text-gray-400">
                Kelola semua spot 360 untuk tur virtual Anda di sini.
              </p>
            </div>
            {/* ✅ PERBAIKAN: Pastikan onClick memanggil setIsModalOpen(true) */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Tambah Scene
            </button>
          </div>

          {/* Konten Utama */}
          <div className="mt-8">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* ✅ PERBAIKAN: Pastikan prop isOpen dan onClose terpasang dengan benar */}
      <CreateSceneModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  )
}