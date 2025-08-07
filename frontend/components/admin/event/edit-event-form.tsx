"use client";

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import CustomFileInputEventEdit from './custom-file-input-event-edit';

interface EventFormValues {
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  category?: string;
  location?: string;
  embed_map_url?: string;
  image: File | string | null;
  gallery_image_1?: File | string | null;
  gallery_image_2?: File | string | null;
  gallery_image_3?: File | string | null;
}

export default function EditEventForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: EventFormValues) => void;
  defaultValues: EventFormValues;
}) {
  const router = useRouter();

  const { control, register, handleSubmit, reset, watch } = useForm<EventFormValues>({
    defaultValues,
  });

  const embedLink = watch('embed_map_url');

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full">
      <h1 className="text-2xl font-bold mb-4">Edit Data Event</h1>
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
        <div>
          <label className="block mb-1 font-medium">Nama Event</label>
          <input
            {...register('name')}
            placeholder="Contoh: Festival Budaya Jubung"
            className="w-full border rounded-md px-3 py-2 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <input
            {...register('category')}
            placeholder="Contoh: Art Exhibition"
            className="w-full border rounded-md px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Lokasi</label>
          <input
            {...register('location')}
            placeholder="Contoh: Gedung Seni Budaya Jember"
            className="w-full border rounded-md px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Deskripsi Singkat</label>
          <input
            {...register('description')}
            placeholder="Contoh: Pameran seni kontemporer..."
            className="w-full border rounded-md px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Embed Link Google Maps</label>
          <input
            {...register('embed_map_url')}
            placeholder="https://www.google.com/maps/embed?..."
            className="w-full border rounded-md px-3 py-2 shadow-sm"
          />
        </div>

        {embedLink && embedLink.trim() !== '' && (
          <div className="mt-4">
            <iframe
              src={embedLink}
              width="100%"
              height="300"
              className="rounded-md border"
              loading="lazy"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Tanggal Mulai</label>
            <input
              type="datetime-local"
              {...register('startDate')}
              className="w-full border rounded-md px-3 py-2 shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tanggal Selesai</label>
            <input
              type="datetime-local"
              {...register('endDate')}
              className="w-full border rounded-md px-3 py-2 shadow-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Upload Gambar Utama</label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <CustomFileInputEventEdit field={field} accept="image/*" supportFile="PNG, JPG, WEBP" />
            )}
          />
        </div>

        {[1, 2, 3].map((num) => (
          <div key={num}>
            <label className="block mb-1 font-medium">{`Gallery Image ${num}`}</label>
            <Controller
              name={`gallery_image_${num}` as keyof EventFormValues}
              control={control}
              render={({ field }) => (
                <CustomFileInputEventEdit field={field} accept="image/*" supportFile="PNG, JPG, WEBP" />
              )}
            />
          </div>
        ))}

        <div className="flex gap-3 mt-4">
          <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md shadow">
            Simpan
          </button>
          <button
            type="button"
            onClick={() => reset(defaultValues)}
            className="flex-1 border px-4 py-2 rounded-md shadow"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
