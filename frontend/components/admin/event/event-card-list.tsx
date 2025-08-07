"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil, Trash, X, CalendarX } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

interface EventItem {
  id: number;
  name: string;
  image: string | null;
  start_date: string;
  end_date: string;
}

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

export default function EventCardList() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();

        if (Array.isArray(data)) {
          setEvents(data);
        } else if (data && Array.isArray(data.data)) {
          setEvents(data.data);
        } else {
          toast.error("Format data tidak sesuai!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Gagal mengambil data event!");
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const confirmDelete = async () => {
    if (selectedEventId !== null) {
      try {
        const res = await fetch(`/api/events/${selectedEventId}`, { method: "DELETE" });
        if (res.ok) {
          setEvents((prev) => prev.filter((e) => e.id !== selectedEventId));
          toast.success("Event berhasil dihapus!");
        } else {
          toast.error("Gagal menghapus event!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Terjadi kesalahan!");
      } finally {
        setShowDeleteModal(false);
        setSelectedEventId(null);
      }
    }
  };

  const filteredEvents = events.filter((event) => event.id !== 1);

  return (
    <div>
      <Toaster position="top-right" />

      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading events...</div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg overflow-hidden shadow hover:shadow-md transition flex flex-col"
            >
              <div className="relative w-full h-40">
                <Image
                  src={
                    event.image
                      ? `${backendUrl}/storage/${event.image}`
                      : "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={event.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div className="mb-2">
                  <p className="text-xs text-gray-600 mb-1 truncate">
                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                  </p>
                  <h2 className="font-semibold text-green-700 truncate">{event.name}</h2>
                </div>
                <div className="flex justify-between gap-2 mt-auto">
                  <Link
                    href={`/admin/event-section/edit-event?id=${event.id}`}
                    className="flex items-center justify-center gap-1 px-5 py-1 text-xs text-blue-600 border border-blue-500 rounded hover:bg-blue-50 transition"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </Link>
                  <button
                    onClick={() => {
                      setSelectedEventId(event.id);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center justify-center gap-1 px-5 py-1 text-xs text-red-600 border border-red-500 rounded hover:bg-red-50 transition"
                  >
                    <Trash className="w-3 h-3" /> Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500 py-10">
          <CalendarX className="w-10 h-10 mb-2" />
          <p className="text-sm">Belum ada data event.</p>
        </div>
      )}

      {/* Modal konfirmasi hapus */}
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
            <p className="mb-4 text-sm text-gray-600">Apakah kamu yakin ingin menghapus event ini?</p>
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
