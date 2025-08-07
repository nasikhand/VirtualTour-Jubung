"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { Button } from "@/components/ui/button";

export default function ArticleForm({ onSubmit }: { onSubmit: (values: any) => void }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [highlightImage, setHighlightImage] = useState<File | null>(null);
  const [tinymceReady, setTinymceReady] = useState(false);

  useEffect(() => {
    if (tinymceReady && typeof window !== "undefined" && (window as any).tinymce) {
      if ((window as any).tinymce?.editors?.length > 0) {
        (window as any).tinymce.remove();
      }

      (window as any).tinymce.init({
        selector: "#editor",
        height: 500,
        width: "100%",
        menubar: true,
        plugins: [
          'accordion', 'advlist', 'anchor', 'autolink', 'autoresize', 'autosave',
          'charmap', 'code', 'codesample', 'directionality', 'emoticons',
          'fullscreen', 'help', 'image', 'importcss', 'insertdatetime', 'link',
          'lists', 'media', 'nonbreaking', 'pagebreak', 'preview', 'quickbars',
          'save', 'table', 'visualblocks', 'visualchars', 'wordcount'
        ],
        toolbar:
          'undo redo | formatselect | bold italic underline strikethrough forecolor backcolor | ' +
          'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
          'link image media codesample charmap emoticons | table | preview fullscreen | ' +
          'removeformat help',
        images_upload_url: `${process.env.NEXT_PUBLIC_API_URL}/api/articles/upload-image`,
        images_upload_credentials: true,
      });
    }
  }, [tinymceReady]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const content = (window as any).tinymce?.get('editor')?.getContent() || "";
    onSubmit({ title, author, content, highlightImage });
  };

  return (
    <div className="bg-white rounded-xl">
      {/* Script dan set tinymceReady */}
      <Script
        src="/assets/tinymce_7.9.1/tinymce/js/tinymce/tinymce.min.js"
        strategy="afterInteractive"
        onLoad={() => setTinymceReady(true)}
      />
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Judul Artikel</label>
          <input
            type="text"
            placeholder="Masukkan judul artikel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            placeholder="Nama penulis"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Gambar Highlight</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setHighlightImage(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                       file:rounded-md file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
            required
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Konten Artikel</label>
          <textarea
            id="editor"
            name="content"
            className="w-full rounded-md border border-gray-300"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition px-6 py-2"
          >
            Simpan Artikel
          </Button>
        </div>
      </form>
    </div>
  );
}
