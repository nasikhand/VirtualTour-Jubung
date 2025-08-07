"use client";

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CustomFileInputDestination from './custom-file-input-destination';
import { toast } from 'react-hot-toast'; // ✅ toast ditambahkan

export interface FormValues {
  name: string;
  address: string;
  openHour: string;
  phone: string;
  ticket_price: string;
  mainImage: File | string | null;
  images: (File | string | null)[];
  informationDesk: string;
}

export default function EditDestinationForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: FormValues) => void;
  defaultValues?: FormValues;
}) {
  const router = useRouter();
  const { control, register, handleSubmit, reset, setValue } = useForm<FormValues>({
    defaultValues,
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  // ✅ fungsi untuk validasi ekstensi gambar
  const validateImageFile = (file: File | null) => {
    if (!file) return true;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format gambar harus PNG, JPG, atau WEBP");
      return false;
    }
    return true;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full">
      <h1 className="text-2xl font-bold mb-4">Edit Data Destination</h1>
      <div className="mb-6 flex justify-start">
        <Button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 text-black border border-black rounded-md px-3 py-2"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {[
          { label: 'Nama', name: 'name', placeholder: 'Contoh: Bakso Pak Slamet' },
          { label: 'Alamat', name: 'address', placeholder: 'Contoh: Jl. Raya No. 123, Surabaya' },
          { label: 'Jam Buka', name: 'openHour', placeholder: 'Contoh: Setiap hari 10:00 - 22:00' },
          { label: 'Nomor Telepon', name: 'phone', placeholder: 'Contoh: 0812-3456-7890' },
          { label: 'Harga Tiket', name: 'ticket_price', placeholder: 'Contoh: Rp 10.000/orang' },
        ].map((item) => (
          <div key={item.name}>
            <label className="block mb-1 text-black font-medium">{item.label}</label>
            <input
              {...register(item.name as keyof FormValues)}
              placeholder={item.placeholder}
              className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
              required
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 text-black font-medium">Gambar Utama</label>
          <Controller
            name="mainImage"
            control={control}
            render={({ field }) => (
              <CustomFileInputDestination
                field={{
                  ...field,
                  onChange: (file) => {
                    if (validateImageFile(file)) {
                      field.onChange(file);
                    } else {
                      field.onChange(null); // reset jika file tidak valid
                    }
                  },
                }}
                accept="image/*"
                supportFile="PNG, JPG, WEBP"
              />
            )}
          />
        </div>

        {[0, 1, 2, 3].map((index) => (
          <div key={index}>
            <label className="block mb-1 text-black font-medium">Gambar Produk {index + 1}</label>
            <Controller
              name={`images.${index}` as const}
              control={control}
              render={({ field }) => (
                <CustomFileInputDestination
                  field={{
                    ...field,
                    onChange: (file) => {
                      if (validateImageFile(file)) {
                        field.onChange(file);
                      } else {
                        field.onChange(null);
                      }
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
          <label className="block mb-1 text-black font-medium">Information Desk</label>
          <textarea
            {...register('informationDesk')}
            rows={3}
            placeholder="Contoh: Menyediakan aneka bakso, promo setiap akhir pekan, dll"
            className="w-full border border-gray-500 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
          >
            Simpan
          </button>
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 border border-gray-500 hover:bg-gray-100 px-4 py-2 rounded-md shadow transition"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
