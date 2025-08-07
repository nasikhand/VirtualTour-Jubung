"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash, X } from "lucide-react";
import { toast } from "react-hot-toast";

interface Destination {
  id: number;
  name: string;
  imageUrl: string;
}

export default function NearbyDestinationSection() {
  const [nearbyDestinations, setNearbyDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL ?? "";

  useEffect(() => {
    const fetchNearbyDestinations = async () => {
      try {
        const res = await fetch("/api/destinations-nearby");
        const data = await res.json();

        if (Array.isArray(data)) {
          const mapped: Destination[] = data.map((item: any) => ({
            id: item.id,
            name: item.title,
            imageUrl: `${storageUrl}/${item.main_image}`,
          }));
          setNearbyDestinations(mapped);
        } else {
          toast.error("Data destinasi terdekat tidak valid");
        }
      } catch (error) {
        console.error("Gagal fetch destinasi terdekat:", error);
        toast.error("Gagal memuat data destinasi terdekat");
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyDestinations();
  }, [storageUrl]);

  const handleDeleteClick = (id: number) => {
    setSelectedDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedDeleteId === null) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/destinations-nearby/${selectedDeleteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Destinasi terdekat berhasil dihapus");
        setNearbyDestinations((prev) => prev.filter((d) => d.id !== selectedDeleteId));
      } else {
        const data = await res.json();
        toast.error(data.message || "Gagal menghapus destinasi terdekat");
      }
    } catch (error) {
      console.error("Gagal hapus destinasi terdekat:", error);
      toast.error("Terjadi kesalahan saat menghapus destinasi terdekat");
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
      setSelectedDeleteId(null);
    }
  };

  return (
    <section className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Destinasi Terdekat</h2>

      {loading ? (
        <p>Loading...</p>
      ) : nearbyDestinations.length === 0 ? (
        <p className="text-gray-600">Belum ada destinasi terdekat.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {nearbyDestinations.map((dest) => (
            <div key={dest.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
              <img src={dest.imageUrl} alt={dest.name} className="w-full h-40 object-cover" />
              <div className="p-4 flex-1 flex flex-col justify-between">
                <h2 className="text-lg font-semibold mb-2">{dest.name}</h2>
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/admin/destination-section/edit-nearby-destination/${dest.id}`}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1 text-xs text-blue-600 border border-blue-500 rounded hover:bg-blue-50 transition"
                  >
                    <Pencil className="w-3 h-3" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(dest.id)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1 text-xs text-red-600 border border-red-500 rounded hover:bg-red-50 transition"
                  >
                    <Trash className="w-3 h-3" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showDeleteModal && (
        <DeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          deleting={deleting}
        />
      )}
    </section>
  );
}

function DeleteModal({
  onClose,
  onConfirm,
  deleting,
}: {
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-sm shadow relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-600">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold mb-4">Konfirmasi Hapus</h2>
        <p className="mb-4 text-sm text-gray-600">Apakah kamu yakin ingin menghapus destinasi terdekat ini?</p>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={deleting}
            className="flex-1 border border-gray-400 rounded px-3 py-2 text-gray-700 hover:bg-gray-100 transition"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className={`flex-1 bg-red-600 text-white rounded px-3 py-2 hover:bg-red-700 transition ${
              deleting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {deleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
