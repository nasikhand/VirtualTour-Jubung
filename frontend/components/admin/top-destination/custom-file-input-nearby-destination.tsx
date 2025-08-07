"use client";

import React, { useEffect, useRef, useState } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { CloudUpload, X } from "lucide-react";
import { toast } from "react-hot-toast"; // kalau pakai react-hot-toast

const MAX_FILE_SIZE_MB = 10;

export default function CustomFileInputNearbyDestination({
  accept,
  supportFile,
  field,
}: {
  accept: string;
  supportFile: string;
  field: ControllerRenderProps<any, any>;
}) {
  const [filename, setFilename] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof field.value === "string" && field.value !== "") {
      setFilename(field.value.split("/").pop() || null);
    } else if (field.value instanceof File) {
      setFilename(field.value.name);
    } else {
      setFilename(null);
    }
  }, [field.value]);

  const validateFileSize = (file: File): boolean => {
    const isValid = file.size <= MAX_FILE_SIZE_MB * 1024 * 1024;
    if (!isValid) {
      toast.error(`Ukuran file maksimal ${MAX_FILE_SIZE_MB} MB`);
    }
    return isValid;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (validateFileSize(file)) {
        field.onChange(file);
      } else {
        e.target.value = ""; // reset input agar bisa upload lagi
      }
    }
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    field.onChange(null);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (validateFileSize(file)) {
        field.onChange(file);
      }
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      ref={dropRef}
      className="w-full rounded-md border border-blue-300 p-2 shadow-sm"
    >
      <div className="flex h-24 w-full flex-col justify-center rounded-lg border-2 border-dashed border-blue-400 bg-blue-50">
        {filename ? (
          <div className="flex items-center justify-start w-full px-4">
            <div className="flex items-center gap-2 bg-blue-100 border border-blue-300 text-blue-700 rounded-md px-2 py-1 text-xs max-w-[80%] truncate">
              <span className="truncate">{filename}</span>
              <button
                type="button"
                onClick={onDelete}
                className="hover:text-red-600"
                aria-label="Hapus file"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <label
            htmlFor={field.name}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-lg bg-blue-50 hover:bg-blue-100"
          >
            <div className="flex flex-row items-center justify-center gap-4">
              <p className="flex flex-col items-end text-[10px] text-gray-500">
                <span className="text-sm font-semibold">Support File</span>
                {supportFile}
              </p>
              <CloudUpload className="size-10 text-blue-500" />
              <p className="flex flex-col items-start text-[10px] text-gray-500">
                <span className="text-sm font-semibold">Landscape Only</span>
                854px x 440px (16:9)
              </p>
            </div>
            <Input
              onChange={onChange}
              name={field.name}
              id={field.name}
              type="file"
              className="hidden"
              accept={accept}
            />
          </label>
        )}
      </div>
    </div>
  );
}
