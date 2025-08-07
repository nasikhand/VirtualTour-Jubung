"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast"; // ⬅️ Import toast

interface AboutUsFormValues {
  title: string;
  description: string;
  wa_link: string;
  image: File | null;
}

export default function AboutUsEditForm({
  defaultValues = {
    title: "Tentang Desa Jubung",
    description:
      "Desa Jubung adalah desa wisata yang memiliki sejarah panjang dan keindahan alam yang memukau.",
    wa_link: "https://wa.me/6281234567890",
    image: null,
  },
  onSubmit,
}: {
  defaultValues?: AboutUsFormValues;
  onSubmit: (values: AboutUsFormValues) => void;
}) {
  const { register, handleSubmit, control } = useForm<AboutUsFormValues>({
    defaultValues,
  });

  return (
    <div className="w-full bg-white shadow p-6 rounded-xl max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit About Us Section</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Upload Gambar */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Gambar</label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  const validTypes = ["image/jpeg", "image/png", "image/webp"];

                  if (file && !validTypes.includes(file.type)) {
                    toast.error("Format gambar tidak didukung. Harus JPG, PNG, atau WEBP.");
                    e.target.value = ""; // reset input
                    field.onChange(null); // kosongkan di form
                    return;
                  }

                  field.onChange(file || null);
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
              />
            )}
          />
        </div>

        {/* Judul */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Judul</label>
          <input
            {...register("title", { required: "Judul wajib diisi" })}
            placeholder="Contoh: Tentang Desa Jubung"
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
          />
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Deskripsi</label>
          <textarea
            {...register("description", { required: "Deskripsi wajib diisi" })}
            rows={4}
            placeholder="Tuliskan deskripsi tentang kami..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
          />
        </div>

        <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">
          Simpan Perubahan
        </Button>
      </form>
    </div>
  );
}
