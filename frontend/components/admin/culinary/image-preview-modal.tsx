"use client";

import React from "react";
import { X } from "lucide-react";

interface Props {
  image: string;
  onClose: () => void;
}

export default function ImagePreviewModal({ image, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative">
        <img
          src={image}
          alt="Preview"
          className="max-h-[80vh] max-w-[90vw] rounded-xl shadow-lg"
          onClick={(e) => e.stopPropagation()}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 hover:bg-black/80"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
