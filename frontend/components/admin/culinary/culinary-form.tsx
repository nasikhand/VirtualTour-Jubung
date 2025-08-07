"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast"; // ✅ Tambahkan ini
import { Button } from "@/components/ui/button";
import CustomFileInputCulinary from "@/components/admin/culinary/custom-file-input-culinary";

interface FormValues {
  name: string;
  category: string;
  address: string;
  openHour: string;
  phone: string;
  googleMapsUrl: string;
  mainImage: File | null;
  images: (File | null)[];
  informationDesk: string;
}

export default function CulinaryForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: FormValues) => void;
  defaultValues?: FormValues;
}) {
  const router = useRouter();
  const { control, register, handleSubmit, watch, reset } = useForm<FormValues>({
    defaultValues: defaultValues || {
      name: "",
      category: "",
      address: "",
      openHour: "",
      phone: "",
      googleMapsUrl: "",
      mainImage: null,
      images: [null, null, null, null],
      informationDesk: "",
    },
  });

  const googleMapsUrl = watch("googleMapsUrl");

  // ✅ Fungsi validasi file gambar
  const validateImageFile = (file: File | null) => {
    if (!file) return true;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format gambar harus PNG, JPG, atau WEBP");
      return false;
    }
    return true;
  };

  // ✅ Submit dengan validasi gambar
  const handleValidSubmit = (data: FormValues) => {
    if (!validateImageFile(data.mainImage)) return;
    for (let i = 0; i < data.images.length; i++) {
      if (!validateImageFile(data.images[i])) return;
    }
    onSubmit(data);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full">
      <h1 className="text-2xl font-bold mb-6">Tambah Culinary</h1>

      <div className="mb-6 flex justify-start">
        <Button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black border border-black rounded-md px-3 py-2"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>
      </div>

      <form onSubmit={handleSubmit(handleValidSubmit)} className="space-y-6">
        <div>
          <label className="block mb-1 text-black font-medium">Nama Kuliner</label>
          <input
            {...register("name")}
            placeholder="Contoh: Bakso Pak Slamet"
            className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-black font-medium">Kategori</label>
          <input
            {...register("category")}
            placeholder="Contoh: Kuliner Tradisional"
            className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm"
            required
          />
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Informasi Kontak</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-black font-medium">Alamat</label>
              <input
                {...register("address")}
                placeholder="Contoh: Jl. Raya No. 123, Surabaya"
                className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-black font-medium">Jam Buka</label>
              <input
                {...register("openHour")}
                placeholder="Contoh: Setiap hari 10:00 - 22:00"
                className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-black font-medium">Nomor Telepon</label>
              <input
                {...register("phone")}
                placeholder="Contoh: 0812-3456-7890"
                className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-black font-medium">Link Embed Google Maps</label>
          <input
            {...register("googleMapsUrl")}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm"
          />
        </div>

        <div className="overflow-hidden rounded-md shadow mt-3">
          {googleMapsUrl ? (
            <iframe
              src={googleMapsUrl}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full"
            ></iframe>
          ) : (
            <div className="w-full h-[300px] flex items-center justify-center bg-gray-100 text-gray-500">
              Belum ada peta
            </div>
          )}
        </div>

        {/* Gambar Utama */}
        <div>
          <label className="block mb-1 text-black font-medium">Gambar Utama</label>
          <Controller
            name="mainImage"
            control={control}
            render={({ field }) => (
              <CustomFileInputCulinary
                field={field}
                accept="image/*"
                supportFile="PNG, JPG, WEBP"
              />
            )}
          />
        </div>

        {/* Gambar Produk */}
        {[0, 1, 2, 3].map((index) => (
          <div key={index}>
            <label className="block mb-1 text-black font-medium">Gambar Produk {index + 1}</label>
            <Controller
              name={`images.${index}` as const}
              control={control}
              render={({ field }) => (
                <CustomFileInputCulinary
                  field={field}
                  accept="image/*"
                  supportFile="PNG, JPG, WEBP"
                />
              )}
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 text-black font-medium">Informasi Tambahan</label>
          <textarea
            {...register("informationDesk")}
            rows={3}
            placeholder="Contoh: Menyediakan aneka bakso, promo setiap akhir pekan, dll"
            className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 border border-gray-500 hover:bg-gray-100 px-4 py-2 rounded-md shadow"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
