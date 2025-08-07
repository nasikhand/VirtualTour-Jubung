'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { CloudUpload, X } from 'lucide-react';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function CustomFileInputGalleryEdit({
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
    if (field.value instanceof File) {
      setFilename(field.value.name);
    } else if (typeof field.value === 'string' && field.value) {
      setFilename(field.value);
    } else {
      setFilename(null);
    }
  }, [field.value]);

  const validateImageFile = (file: File | null) => {
    if (!file) return false;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format gambar harus PNG, JPG, atau WEBP');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Ukuran file tidak boleh lebih dari 10MB');
      return false;
    }
    return true;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateImageFile(file)) {
      field.onChange(file);
    } else {
      field.onChange(null); // Reset jika invalid
    }
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && validateImageFile(file)) {
      field.onChange(file);
    } else {
      field.onChange(null);
    }
  };

  const onDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    field.onChange(null);
  };

  return (
    <div
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
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
