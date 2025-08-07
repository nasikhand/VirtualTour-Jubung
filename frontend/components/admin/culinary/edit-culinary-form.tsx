"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CustomFileInputCulinaryEdit from "./custom-file-input-culinary-edit";
import { toast } from "react-hot-toast";

interface FormValues {
  name: string;
  category: string;
  address: string;
  openHour: string;
  phone: string;
  googleMapsUrl: string;
  mainImage: File | string | null;
  images: (File | string | null)[];
  informationDesk: string;
}

export default function EditCulinaryForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: FormValues) => void;
  defaultValues: FormValues;
}) {
  const router = useRouter();
  const { control, register, handleSubmit, watch, reset, setValue } = useForm<FormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const googleMapsUrl = watch("googleMapsUrl");

  // ✅ Fungsi validasi file
  const validateFile = (file: File | null) => {
    const validTypes = ["image/png", "image/jpeg", "image/webp"];
    if (file && !validTypes.includes(file.type)) {
      toast.error("Format gambar harus png, jpg, webp");
      return false;
    }
    return true;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full">
      <h1 className="text-2xl font-bold mb-6">Edit Culinary</h1>
      <div className="mb-6 flex justify-start">
        <Button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black border border-black"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {[{ label: "Nama", name: "name" },
          { label: "Kategori", name: "category" },
          { label: "Alamat", name: "address" },
          { label: "Jam Buka", name: "openHour" },
          { label: "Nomor Telepon", name: "phone" }].map((item) => (
            <div key={item.name}>
              <label className="block mb-1">{item.label}</label>
              <input
                {...register(item.name as keyof FormValues)}
                className="w-full border border-gray-500 rounded px-3 py-2"
                required
              />
            </div>
        ))}

        <div>
          <label className="block mb-1">Link Embed Google Maps</label>
          <input
            {...register("googleMapsUrl")}
            className="w-full border border-gray-500 rounded px-3 py-2"
          />
        </div>

        <div className="overflow-hidden rounded shadow mt-3">
          {googleMapsUrl ? (
            <iframe
              src={googleMapsUrl}
              width="100%"
              height="300"
              className="w-full"
            ></iframe>
          ) : (
            <div className="h-[300px] flex items-center justify-center bg-gray-100 text-gray-500">
              Belum ada peta
            </div>
          )}
        </div>

        {/* ✅ Main Image upload dengan validasi */}
        <div>
          <label className="block mb-1">Gambar Utama</label>
          <Controller
            name="mainImage"
            control={control}
            render={({ field }) => (
              <CustomFileInputCulinaryEdit
                field={{
                  ...field,
                  onChange: (file) => {
                    if (file instanceof File && !validateFile(file)) {
                      field.onChange(null);
                      return;
                    }
                    field.onChange(file);
                  },
                }}
                accept="image/*"
                supportFile="PNG, JPG, WEBP"
              />
            )}
          />
        </div>

        {/* ✅ Images Produk dengan validasi */}
        {[0, 1, 2, 3].map((idx) => (
          <div key={idx}>
            <label className="block mb-1">Gambar Produk {idx + 1}</label>
            <Controller
              name={`images.${idx}` as const}
              control={control}
              render={({ field }) => (
                <CustomFileInputCulinaryEdit
                  field={{
                    ...field,
                    onChange: (file) => {
                      if (file instanceof File && !validateFile(file)) {
                        field.onChange(null);
                        return;
                      }
                      field.onChange(file);
                    },
                  }}
                  accept="image/*"
                  supportFile="PNG, JPG, WEBP"
                />
              )}
            />
          </div>
        ))}

        <div>
          <label className="block mb-1">Information Desk</label>
          <textarea
            {...register("informationDesk")}
            rows={3}
            className="w-full border border-gray-500 rounded px-3 py-2"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded">
            Simpan
          </button>
          <button type="button" onClick={() => reset()} className="flex-1 border px-4 py-2 rounded">
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
