"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import CustomFileInputEventEdit from "../event/custom-file-input-event-edit";

interface HeroSettingFormValues {
  hero_title?: string;
  hero_description?: string;
  navigation_items?: string;
  panel_image?: File | string | null;
}

export default function HeroSettingFormArticle({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: HeroSettingFormValues) => void;
  defaultValues?: Partial<HeroSettingFormValues>;
}) {
  const router = useRouter();

  const { control, register, handleSubmit, reset } = useForm<HeroSettingFormValues>({
    defaultValues: defaultValues || {
      hero_title: "",
      hero_description: "",
      navigation_items: "",
      panel_image: null,
    },
  });

  return (
    <div className="p-6 bg-white rounded-xl shadow-md w-full">
      <h1 className="text-2xl font-bold mb-4">Pengaturan Hero Section</h1>

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
          <label className="block mb-1 font-medium">Hero Title</label>
          <input
            {...register("hero_title")}
            placeholder="Contoh: Eksplorasi Budaya"
            className="w-full border rounded-md px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Hero Description</label>
          <textarea
            {...register("hero_description")}
            placeholder="Deskripsi hero section..."
            className="w-full border rounded-md px-3 py-2 shadow-sm"
            rows={3}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Navigation Items</label>
          <input
            {...register("navigation_items")}
            placeholder="Contoh: Events, Destinations, Articles"
            className="w-full border rounded-md px-3 py-2 shadow-sm"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Panel Image</label>
          <Controller
            name="panel_image"
            control={control}
            render={({ field }) => (
              <CustomFileInputEventEdit
                field={field}
                accept="image/*"
                supportFile="PNG, JPG, WEBP"
              />
            )}
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md shadow"
          >
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
