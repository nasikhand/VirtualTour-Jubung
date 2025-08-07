'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Slide {
  id: number;
  description: string;
  image_path: string | null;
}

export default function WelcomeCardList() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSlideId, setSelectedSlideId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch('/api/slides');
        if (!res.ok) throw new Error('Gagal fetch slides');
        const data = await res.json();
        setSlides(data);
      } catch {
        toast.error('Gagal mengambil data slide!');
      }
    };

    fetchSlides();
  }, []);

  const confirmDelete = async () => {
    if (selectedSlideId !== null) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slides/${selectedSlideId}`, {
          method: 'DELETE',
        });
        if (!res.ok) throw new Error('Gagal hapus slide');

        setSlides((prev) => prev.filter((slide) => slide.id !== selectedSlideId));
        toast.success('Slide berhasil dihapus!');
      } catch {
        toast.error('Gagal menghapus slide!');
      } finally {
        setShowDeleteModal(false);
        setSelectedSlideId(null);
      }
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition flex flex-col"
          >
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${slide.image_path}`}
              alt=""
              className="w-full h-40 object-cover"
            />
            <div className="p-3 flex-1 flex flex-col justify-between">
              <p className="text-sm text-gray-700 mb-2 line-clamp-2">{slide.description}</p>
              <div className="flex justify-between gap-2 mt-auto">
                <Link
                  href={`/admin/welcome-section/edit-slide?id=${slide.id}`}
                  className="flex items-center justify-center gap-1 px-11 py-1 text-xs text-blue-600 border border-blue-500 rounded hover:bg-blue-50 transition"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </Link>
                <button
                  onClick={() => {
                    setSelectedSlideId(slide.id);
                    setShowDeleteModal(true);
                  }}
                  className="flex items-center justify-center gap-1 px-11 py-1 text-xs text-red-600 border border-red-500 rounded hover:bg-red-50 transition"
                >
                  <Trash className="w-3 h-3" />
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-full max-w-sm shadow relative">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Konfirmasi Hapus</h2>
            <p className="mb-4 text-sm text-gray-600">Apakah kamu yakin ingin menghapus slide ini?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-gray-400 rounded px-3 py-2 text-gray-700 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 text-white rounded px-3 py-2 hover:bg-red-700 transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
