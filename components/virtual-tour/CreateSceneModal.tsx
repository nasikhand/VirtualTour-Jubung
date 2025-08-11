"use client"

import { useState, useCallback, DragEvent, useEffect } from 'react'
import toast from 'react-hot-toast'
import { UploadCloud, X, LoaderCircle, CheckCircle, AlertCircle } from 'lucide-react'

export default function CreateSceneModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [name, setName] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const resetForm = useCallback(() => {
    setName('')
    setImage(null)
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setProgress(0)
    setIsUploading(false)
  }, [preview])

  const handleClose = () => {
    resetForm()
    onClose()
  }

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);

  const validateAndSetImage = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      toast.error('Format gambar harus .jpg, .png, atau .webp')
      return
    }
    if (file.size > maxSize) {
      toast.error('Ukuran file maksimum adalah 5MB')
      return
    }
    setImage(file)
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(URL.createObjectURL(file))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetImage(file)
    }
  }

  const handleRemoveImage = () => {
    setImage(null)
    if (preview) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
  }

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }
  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }
  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      validateAndSetImage(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!image || isUploading) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('name', name)
    formData.append('image', image)

    const xhr = new XMLHttpRequest()
    xhr.open('POST', '/api/vtour/scenes', true)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded * 100) / event.total)
        setProgress(percent)
      }
    }
    xhr.onload = () => {
      setIsUploading(false)
      setProgress(0)
      if (xhr.status === 200 || xhr.status === 201) {
        toast.success('Scene berhasil ditambahkan!', { icon: <CheckCircle className="text-green-500" /> })
        onSuccess()
      } else {
        toast.error('Gagal mengupload scene.', { icon: <AlertCircle className="text-red-500" /> })
      }
    }
    xhr.onerror = () => {
      setIsUploading(false)
      setProgress(0)
      toast.error('Terjadi kesalahan koneksi.', { icon: <AlertCircle className="text-red-500" /> })
    }
    xhr.send(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-xl shadow-2xl">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Tambah Spot 360 Baru</h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors rounded-full p-1"
              disabled={isUploading}
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* --- Kolom Kiri: Form Input --- */}
            <div className="space-y-6">
              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300 mb-2 block">Nama Spot</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:text-white"
                  required
                  placeholder="Contoh: Lobby Utama"
                />
              </div>

              <div>
                <label className="font-medium text-gray-700 dark:text-gray-300 mb-2 block">Deskripsi Spot</label>
                <textarea
                  // Anda tidak memiliki state untuk deskripsi, saya tambahkan placeholder
                  // value={desc}
                  // onChange={e => setDesc(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all dark:text-white"
                  rows={4}
                  placeholder="(Opsional) Berikan deskripsi singkat mengenai spot ini"
                />
              </div>

              <div className="col-span-2 flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-semibold transition-colors disabled:opacity-50"
                  disabled={isUploading}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isUploading || !image || !name}
                >
                  {isUploading ? <LoaderCircle className="animate-spin" /> : null}
                  {isUploading ? `Mengunggah... ${progress}%` : 'Simpan Scene'}
                </button>
              </div>
            </div>

            {/* --- Kolom Kanan: Area Upload & Preview --- */}
            <div className="flex flex-col">
              <label
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                htmlFor="panorama-upload"
                className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                  ${isDragging ? 'border-blue-500 bg-blue-50 dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}
                `}
              >
                {preview ? (
                  <>
                    <img src={preview} className="absolute inset-0 w-full h-full object-cover rounded-lg" alt="Preview" />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 transition-all z-10"
                      aria-label="Hapus gambar"
                    >
                      <X size={18} />
                    </button>
                  </>
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 p-4">
                    <UploadCloud size={48} className="mx-auto mb-3" />
                    <p className="font-semibold">Drag & drop gambar panorama</p>
                    <p className="text-sm">atau <span className="text-blue-500 font-semibold">klik untuk memilih file</span></p>
                  </div>
                )}
              </label>
              <input id="panorama-upload" type="file" className="hidden" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} />
              
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                <p>* Format yang didukung: JPG, PNG, WEBP.</p>
                <p>* Ukuran maksimum 5MB.</p>
              </div>
              
              {isUploading && (
                <div className="mt-4 w-full">
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5 overflow-hidden">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}