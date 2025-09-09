'use client'

import { useEffect, useState } from 'react'
import { Scene, VtourMenu } from '@/types/virtual-tour'
import SceneCard from '@/components/virtual-tour/SceneCard'
import CreateSceneModal from '@/components/virtual-tour/CreateSceneModal'
import { Plus, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import toast from 'react-hot-toast'

/* =========================
   Helper: error & abort guard
   ========================= */
function isAbortError(err: unknown): boolean {
  if (typeof DOMException !== 'undefined' && err instanceof DOMException) {
    return err.name === 'AbortError'
  }
  return !!(err && typeof err === 'object' && 'code' in err && (err as any).code === 'ABORT_ERR')
}
function toError(err: unknown): Error {
  return err instanceof Error ? err : new Error(String(err))
}

/* =========================
   Komponen Helper (UI)
   ========================= */
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
      Belum Ada Spot Ditemukan
    </h2>
    <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-md">
      Mulai dengan menekan tombol{' '}
      <strong className="text-blue-600 dark:text-blue-400">"+ Tambah Spot"</strong>{' '}
      di pojok kanan atas untuk membuat spot virtual tour pertama Anda.
    </p>
  </div>
)

/* =========================
   Halaman Utama
   ========================= */
export default function VtourScenePage() {
  const [scenes, setScenes] = useState<Scene[]>([])
  const [menus, setMenus] = useState<VtourMenu[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [sceneToDelete, setSceneToDelete] = useState<Scene | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch scenes and menus
  const loadScenes = async (page = 1) => {
    setLoading(true)
    const controller = new AbortController()

    try {
      const [scenesRes, menusRes] = await Promise.all([
        fetch(`/api/vtour/scenes?page=${page}&per_page=100`, {
          signal: controller.signal,
        }),
        fetch('/api/vtour/menus', {
          signal: controller.signal,
        })
      ])

      if (!scenesRes.ok) throw new Error('Gagal fetch spot')

      const scenesData = await scenesRes.json()
      const dataList: Scene[] = Array.isArray(scenesData?.data) ? scenesData.data : []
      const cp = Number(scenesData?.current_page ?? 1)
      const lp = Number(scenesData?.last_page ?? 1)

      setScenes(dataList)
      setCurrentPage(Number.isFinite(cp) ? cp : 1)
      setLastPage(Number.isFinite(lp) ? lp : 1)

      if (menusRes.ok) {
        const menusData = await menusRes.json()
        setMenus(Array.isArray(menusData?.data) ? menusData.data : [])
      } else {
        setMenus([])
      }
    } catch (err: unknown) {
      if (!isAbortError(err)) {
        console.error('Error fetching data:', toError(err))
        setScenes([])
        setMenus([])
        toast.error('Gagal memuat data spot/menus')
      }
    } finally {
      setLoading(false)
    }

    return controller
  }

  useEffect(() => {
    let active = true
    let controller: AbortController | null = null

    ;(async () => {
      controller = await loadScenes(currentPage)
      // Jika effect sudah dibatalkan sebelum load selesai
      if (!active && controller) controller.abort()
    })()

    return () => {
      active = false
      if (controller) controller.abort()
    }
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
            // 'Authorization': `Bearer ${yourToken}` // jika backend butuh auth
          },
        }
      )

      if (response.ok) {
        toast.success('Spot berhasil dihapus!')
        await loadScenes(currentPage)
      } else {
        const errorData = await response.json().catch(() => ({}))
        toast.error(errorData?.message || 'Gagal menghapus spot')
      }
    } catch (err: unknown) {
      console.error('Error deleting spot:', toError(err))
      toast.error('Terjadi kesalahan saat menghapus spot')
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
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {scenes.map(scene => (
            <SceneCard
              key={scene.id}
              scene={scene}
              onDelete={handleDeleteClick}
              href={`/admin/virtual-tour-section/scenes/${scene.id}/edit`}
              viewMode="grid"
              isInMenu={menus.some(menu => menu.scene_id === scene.id)}
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
                Kelola Spot dan hotspot Informasi virtual tour Anda
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
              Tambah Spot
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
              Hapus Spot
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Apakah Anda yakin ingin menghapus spot{' '}
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
