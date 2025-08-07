"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // <--- Tambahkan ini
import { Button } from "@/components/ui/button";
import CustomFileInputDestination from "./custom-file-input-destination";

interface FormValues {
  name: string;
  description: string;
  address: string;
  openHour: string;
  ticket: string;
  phone: string;
  distance: number | null;
  mainImage: File | string | null;
  images: (File | string | null)[];
}

export default function EditDestinationFormNearby({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: FormValues) => void;
  defaultValues?: FormValues;
}) {
  const router = useRouter();
  const { control, register, handleSubmit, reset, getValues } = useForm<FormValues>({
    defaultValues,
  });

  const validateImageFile = (file: File | string | null) => {
    if (!file || typeof file === "string") return true; // Skip validation if it's an existing image (URL)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format gambar harus PNG, JPG, atau WEBP");
      return false;
    }
    return true;
  };

  const onSubmitWithValidation = (data: FormValues) => {
    if (!validateImageFile(data.mainImage)) return;

    for (const img of data.images) {
      if (!validateImageFile(img)) return;
    }

    onSubmit(data); // Hanya jika semua validasi lolos
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full">
      <h1 className="text-2xl font-bold mb-6 text-black">Edit Destination Nearby</h1>

      <div className="mb-6 flex justify-start">
        <Button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black border border-black rounded-md px-3 py-2"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmitWithValidation)} className="space-y-5">
        {[ 
          { name: "name", label: "Judul Tempat", placeholder: "Contoh: Destinasi 1" },
          { name: "description", label: "Deskripsi", placeholder: "Contoh: Destinasi keluarga", type: "textarea" },
          { name: "address", label: "Alamat", placeholder: "Contoh: Desa Jubung, Jember" },
          { name: "openHour", label: "Jam Buka - Tutup", placeholder: "08:00 - 17:00" },
          { name: "ticket", label: "Harga Tiket", placeholder: "Contoh: Gratis" },
          { name: "phone", label: "Nomor Telepon", placeholder: "Contoh: +6281234567890" },
        ].map(({ name, label, placeholder, type }) => (
          <div key={name}>
            <label className="block mb-1 text-black font-medium">{label}</label>
            {type === "textarea" ? (
              <textarea
                {...register(name as keyof FormValues)}
                placeholder={placeholder}
                rows={3}
                required
                className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
              />
            ) : (
              <input
                {...register(name as keyof FormValues)}
                placeholder={placeholder}
                required
                className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block mb-1 text-black font-medium">Jarak dari Jubung (KM)</label>
          <input
            type="number"
            step="0.01"
            {...register("distance")}
            placeholder="Contoh: 2.5"
            className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-black font-medium">Gambar Utama</label>
          <Controller
            name="mainImage"
            control={control}
            render={({ field }) => (
              <CustomFileInputDestination field={field} accept="image/*" supportFile="PNG, JPG, WEBP" />
            )}
          />
        </div>

        {[0, 1, 2, 3].map((index) => (
          <div key={index}>
            <label className="block mb-1 text-black font-medium">Gambar Pendukung {index + 1}</label>
            <Controller
              name={`images.${index}` as const}
              control={control}
              render={({ field }) => (
                <CustomFileInputDestination field={field} accept="image/*" supportFile="PNG, JPG, WEBP" />
              )}
            />
          </div>
        ))}

        <div className="flex gap-3 mt-4">
          <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">Update</Button>
          <Button type="button" onClick={() => reset()} className="flex-1 border border-gray-500 hover:bg-gray-100">Reset</Button>
        </div>
      </form>
    </div>
  );
}
