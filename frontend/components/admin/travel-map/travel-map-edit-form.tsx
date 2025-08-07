"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface TravelMapFormValues {
  headline: string;
  embedMapUrl: string;
  description: string;
}

export default function TravelMapEditForm({
  defaultValues,
  onSubmit,
  isSaving,
}: {
  defaultValues: TravelMapFormValues;
  onSubmit: (values: TravelMapFormValues) => void;
  isSaving: boolean;
}) {
  const { register, handleSubmit, watch, reset } = useForm<TravelMapFormValues>({
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
    console.log("reset called with:", defaultValues);
  }, [defaultValues, reset]);

  const embedMapUrl = watch("embedMapUrl");

  return (
    <div className="w-full bg-white shadow p-6 rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Travel Map Section</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block mb-1 text-black font-medium">Headline</label>
          <input
            {...register("headline")}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
          />
        </div>

        <div>
          <label className="block mb-1 text-black font-medium">Embed Map URL</label>
          <input
            {...register("embedMapUrl")}
            placeholder="https://www.google.com/maps/embed?..."
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
          />
        </div>

        {embedMapUrl && (
          <div className="w-full mt-4 overflow-hidden rounded-md shadow-md">
            <iframe
              src={embedMapUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-96"
            ></iframe>
          </div>
        )}

        <div>
          <label className="block mb-1 text-black font-medium">Deskripsi</label>
          <textarea
            {...register("description")}
            rows={4}
            required
            className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-300 transition"
          />
        </div>

        <Button
          type="submit"
          className="bg-blue-600 text-white hover:bg-blue-700"
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </form>
    </div>
  );
}
