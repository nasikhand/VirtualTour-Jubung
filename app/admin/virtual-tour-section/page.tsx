<<<<<<< Updated upstream
'use client'

import { useEffect, useState } from 'react'
import { Scene } from '@/types/virtual-tour'
import SceneCard from '@/components/virtual-tour/SceneCard'
import CreateSceneModal from '@/components/virtual-tour/CreateSceneModal'
import { Plus, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import toast from 'react-hot-toast'

// --- Komponen Helper ---
const SceneGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="h-56 w-full animate-pulse rounded-2xl bg-gradient-to-br 
          from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-lg"
      />
    ))}
  </div>
)

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-2xl 
    border-2 border-dashed border-gray-300 dark:border-gray-600 py-24 text-center 
    bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-inner">
    <div className="rounded-full bg-gradient-to-br from-blue-100 to-blue-200 
      dark:from-blue-900 dark:to-blue-800 p-6 shadow-lg">
      <ImageOff className="text-blue-500 dark:text-blue-400" size={40} />
    </div>
    <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
      Belum Ada Scene Ditemukan
    </h2>
    <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
      Mulai dengan menekan tombol{' '}
      <strong className="text-blue-600 dark:text-blue-400">"+ Tambah Scene"</strong>{' '}
      di pojok kanan atas untuk membuat scene virtual tour pertama Anda.
    </p>
  </div>
)

// --- Halaman Utama ---
export default function VtourScenePage() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<Scene | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch scenes
  const loadScenes = async (page = 1) => {
    setLoading(true)
    const controller = new AbortController()

    try {
      const res = await fetch(`/api/vtour/scenes?page=${page}&per_page=100`, {
        signal: controller.signal,
      })
      if (!res.ok) throw new Error('Gagal fetch data')

      const data = await res.json()
      setScenes(data.data ?? [])
      setCurrentPage(data.current_page ?? 1)
      setLastPage(data.last_page ?? 1)
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching scenes:', err)
        setScenes([])
      }
    } finally {
      setLoading(false)
    }

    return () => controller.abort()
  }

  useEffect(() => {
    const cleanup = loadScenes(currentPage)
    return cleanup
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage && newPage !== currentPage) {
      setCurrentPage(newPage)
    }
  }

  const handleSuccess = () => {
    loadScenes(1)
    setIsCreateModalOpen(false)
  }

  const handleDeleteClick = (scene: Scene) => setSceneToDelete(scene)

  const handleDeleteConfirm = async () => {
  if (!sceneToDelete || isDeleting) return
  setIsDeleting(true)

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vtour/scenes/${sceneToDelete.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // tambahkan auth token kalau backend pakai auth
          // 'Authorization': `Bearer ${yourToken}`
        },
      }
    )

    if (response.ok) {
      toast.success('Scene berhasil dihapus!')
      loadScenes(currentPage)
    } else {
      const errorData = await response.json().catch(() => ({}))
      toast.error(errorData.message || 'Gagal menghapus scene')
    }
  } catch (error) {
    console.error('Error deleting scene:', error)
    toast.error('Terjadi kesalahan saat menghapus scene')
  } finally {
    setIsDeleting(false)
    setSceneToDelete(null)
  }
}

  const renderContent = () => {
    if (loading) return <SceneGridSkeleton />
    if (scenes.length === 0) return <EmptyState />

    return (
      <>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {scenes.map(scene => (
            <SceneCard
              key={scene.id}
              scene={scene}
              onDelete={handleDeleteClick}
              href={`/admin/virtual-tour-section/scenes/${scene.id}/edit`}
              viewMode="grid"
              isInMenu={false}
            />
          ))}
        </div>

        {lastPage > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              aria-label="Halaman Sebelumnya"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 px-4 py-2.5 
                text-sm font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 
                hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 
                border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <ChevronLeft size={16} />
              Sebelumnya
            </button>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg shadow-md">
              <span className="text-sm font-medium">
                Halaman {currentPage} dari {lastPage}
              </span>
            </div>

            <button
              aria-label="Halaman Selanjutnya"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 px-4 py-2.5 
                text-sm font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 
                hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 
                border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              Selanjutnya
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 
        text-gray-800 dark:text-gray-200">
        <main className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between bg-gradient-to-r 
            from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 
            rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 
                dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                Manajemen Virtual Tour
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Kelola scene dan hotspot virtual tour Anda
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isCreateModalOpen}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 
                to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 
                text-sm font-medium text-white transition-all duration-200 
                shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-60"
            >
              <Plus size={18} />
              Tambah Scene
            </button>
          </div>

          {/* Konten Utama */}
          <div className="mt-8">{renderContent()}</div>
        </main>
      </div>

      {/* Modal Create Scene */}
      <CreateSceneModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Modal Konfirmasi Delete */}
      {sceneToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hapus Scene
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Apakah Anda yakin ingin menghapus scene{' '}
              <strong>{sceneToDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSceneToDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 
                  dark:border-gray-600 bg-white dark:bg-gray-700 
                  hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 
                  text-white transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
=======
'use client'

import { useEffect, useState } from 'react'
import { Scene } from '@/types/virtual-tour'
import SceneCard from '@/components/virtual-tour/SceneCard'
import CreateSceneModal from '@/components/virtual-tour/CreateSceneModal'
import { Plus, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import toast from 'react-hot-toast'

// --- Komponen Helper ---
const SceneGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="h-56 w-full animate-pulse rounded-2xl bg-gradient-to-br 
          from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 shadow-lg"
      />
    ))}
  </div>
)

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-2xl 
    border-2 border-dashed border-gray-300 dark:border-gray-600 py-24 text-center 
    bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 shadow-inner">
    <div className="rounded-full bg-gradient-to-br from-blue-100 to-blue-200 
      dark:from-blue-900 dark:to-blue-800 p-6 shadow-lg">
      <ImageOff className="text-blue-500 dark:text-blue-400" size={40} />
    </div>
    <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
      Belum Ada Scene Ditemukan
    </h2>
    <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
      Mulai dengan menekan tombol{' '}
      <strong className="text-blue-600 dark:text-blue-400">"+ Tambah Scene"</strong>{' '}
      di pojok kanan atas untuk membuat scene virtual tour pertama Anda.
    </p>
  </div>
)

// --- Halaman Utama ---
export default function VtourScenePage() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<Scene | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch scenes
  const loadScenes = async (page = 1) => {
    setLoading(true)
    const controller = new AbortController()

    try {
      const res = await fetch(`/api/vtour/scenes?page=${page}&per_page=100`, {
        signal: controller.signal,
      })
      if (!res.ok) throw new Error('Gagal fetch data')

      const data = await res.json()
      setScenes(data.data ?? [])
      setCurrentPage(data.current_page ?? 1)
      setLastPage(data.last_page ?? 1)
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching scenes:', err)
        setScenes([])
      }
    } finally {
      setLoading(false)
    }

    return () => controller.abort()
  }

  useEffect(() => {
    const cleanup = loadScenes(currentPage)
    return cleanup
  }, [currentPage])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage && newPage !== currentPage) {
      setCurrentPage(newPage)
    }
  }

  const handleSuccess = () => {
    loadScenes(1)
    setIsCreateModalOpen(false)
  }

  const handleDeleteClick = (scene: Scene) => setSceneToDelete(scene)

  const handleDeleteConfirm = async () => {
  if (!sceneToDelete || isDeleting) return
  setIsDeleting(true)

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vtour/scenes/${sceneToDelete.id}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // tambahkan auth token kalau backend pakai auth
          // 'Authorization': `Bearer ${yourToken}`
        },
      }
    )

    if (response.ok) {
      toast.success('Scene berhasil dihapus!')
      loadScenes(currentPage)
    } else {
      const errorData = await response.json().catch(() => ({}))
      toast.error(errorData.message || 'Gagal menghapus scene')
    }
  } catch (error) {
    console.error('Error deleting scene:', error)
    toast.error('Terjadi kesalahan saat menghapus scene')
  } finally {
    setIsDeleting(false)
    setSceneToDelete(null)
  }
}

  const renderContent = () => {
    if (loading) return <SceneGridSkeleton />
    if (scenes.length === 0) return <EmptyState />

    return (
      <>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {scenes.map(scene => (
            <SceneCard
              key={scene.id}
              scene={scene}
              onDelete={handleDeleteClick}
              href={`/admin/virtual-tour-section/scenes/${scene.id}/edit`}
              viewMode="grid"
              isInMenu={false}
            />
          ))}
        </div>

        {lastPage > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              aria-label="Halaman Sebelumnya"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 px-4 py-2.5 
                text-sm font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 
                hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 
                border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <ChevronLeft size={16} />
              Sebelumnya
            </button>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2.5 rounded-lg shadow-md">
              <span className="text-sm font-medium">
                Halaman {currentPage} dari {lastPage}
              </span>
            </div>

            <button
              aria-label="Halaman Selanjutnya"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === lastPage}
              className="flex items-center gap-2 rounded-lg bg-white dark:bg-gray-800 px-4 py-2.5 
                text-sm font-medium transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 
                hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 
                border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              Selanjutnya
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 
        dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8 
        text-gray-800 dark:text-gray-200">
        <main className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between bg-gradient-to-r 
            from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-6 
            rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 
                dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                Manajemen Virtual Tour
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                Kelola scene dan hotspot virtual tour Anda
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              disabled={isCreateModalOpen}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 
                to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 
                text-sm font-medium text-white transition-all duration-200 
                shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-60"
            >
              <Plus size={18} />
              Tambah Scene
            </button>
          </div>

          {/* Konten Utama */}
          <div className="mt-8">{renderContent()}</div>
        </main>
      </div>

      {/* Modal Create Scene */}
      <CreateSceneModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleSuccess}
      />

      {/* Modal Konfirmasi Delete */}
      {sceneToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hapus Scene
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Apakah Anda yakin ingin menghapus scene{' '}
              <strong>{sceneToDelete.name}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSceneToDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 
                  dark:border-gray-600 bg-white dark:bg-gray-700 
                  hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 
                  text-white transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
>>>>>>> Stashed changes
