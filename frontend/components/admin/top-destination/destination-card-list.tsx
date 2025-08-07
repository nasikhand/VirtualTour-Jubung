// app/components/admin/destination/destination-card.tsx
import React from "react";
import Image from "next/image";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DestinationItem {
  id: number;
  name: string;
  description: string;
  address: string;
  open_hour: string;
  ticket: string;
  phone: string;
  main_image: string;
  images: string[]; // gambar pendukung
}

export default function DestinationCard({
  destination,
  onEdit,
  onDelete,
}: {
  destination: DestinationItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="border rounded-xl shadow-sm overflow-hidden bg-white max-w-md w-full">
      <div className="relative h-48 w-full">
        {destination.main_image ? (
          <Image
            src={destination.main_image}
            alt={destination.name}
            layout="fill"
            objectFit="cover"
          />
        ) : (
          <div className="bg-gray-200 h-full flex items-center justify-center text-sm">
            Tidak ada gambar
          </div>
        )}
      </div>

      <div className="p-4 space-y-2 text-sm text-black">
        <h2 className="font-bold text-lg">{destination.name}</h2>
        <p><strong>Deskripsi:</strong> {destination.description}</p>
        <p><strong>Alamat:</strong> {destination.address}</p>
        <p><strong>Jam Buka:</strong> {destination.open_hour}</p>
        <p><strong>Tiket:</strong> {destination.ticket}</p>
        <p><strong>Telepon:</strong> {destination.phone}</p>

        {/* Gambar Pendukung */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          {destination.images.map((img, index) =>
            img ? (
              <Image
                key={index}
                src={img}
                alt={`Gambar Pendukung ${index + 1}`}
                width={100}
                height={100}
                className="rounded-md object-cover"
              />
            ) : null
          )}
        </div>

        <div className="flex gap-2 mt-3">
          <Button onClick={onEdit} className="w-full border text-blue-600">
            <Pencil size={16} className="mr-1" /> Edit
          </Button>
          <Button onClick={onDelete} className="w-full border text-red-600">
            <Trash size={16} className="mr-1" /> Hapus
          </Button>
        </div>
      </div>
    </div>
  );
}
