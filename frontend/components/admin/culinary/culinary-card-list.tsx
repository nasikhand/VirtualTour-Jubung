"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash, X } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

interface CulinaryItem {
  id: number;
  name: string;
  category: string;
  address: string;
  open_hour: string;
  phone: string;
  main_image: string | null;
}

const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL;
const heroId = Number(process.env.NEXT_PUBLIC_CULINARY_HERO_ID) || 1; // hero id default 1

export default function CulinaryCardList() {
  const [data, setData] = useState<CulinaryItem[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/culinaries")
      .then((res) => res.json())
      .then((resData) => {
        // filter id !== heroId (misalnya id=1)
        const filtered = resData.filter((item: CulinaryItem) => item.id !== heroId);
        setData(filtered);
      })
      .catch(() => toast.error("Gagal memuat data!"))
      .finally(() => setLoading(false));
  }, []);

  const confirmDelete = () => {
    if (selectedItemId === null) return;
    fetch(`/api/culinaries/${selectedItemId}`, { method: "DELETE" })
      .then(() => {
        toast.success("Data berhasil dihapus!");
        setData((prev) => prev.filter((item) => item.id !== selectedItemId));
      })
      .catch(() => toast.error("Gagal menghapus data!"))
      .finally(() => {
        setShowDeleteModal(false);
        setSelectedItemId(null);
      });
  };

  return (
    <div>
      <Toaster position="top-right" />
      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">Belum ada data culinary.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition flex flex-col"
            >
              {item.main_image ? (
                <img
                  src={`${STORAGE_URL}/${item.main_image}`}
                  alt={item.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                  Tidak ada gambar
                </div>
              )}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div className="mb-2">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p className="text-xs text-gray-500 mb-1 capitalize">Kategori: {item.category}</p>
                  <p className="text-xs text-gray-500 mb-1">Jam Buka: {item.open_hour}</p>
                  <p className="text-xs text-gray-500">Telepon: {item.phone}</p>
                </div>
                <div className="flex justify-between gap-2 mt-auto">
                  <Link
                    href={`/admin/culinary-section/edit-culinary?id=${item.id}`}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-blue-600 border border-blue-500 rounded hover:bg-blue-50 transition"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedItemId(item.id);
                      setShowDeleteModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-2 py-1 text-xs text-red-600 border border-red-500 rounded hover:bg-red-50 transition"
                  >
                    <Trash className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Hapus */}
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
            <p className="mb-4 text-sm text-gray-600">Apakah kamu yakin ingin menghapus data ini?</p>
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
    </div>
  );
}
