"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function FooterForm({
  onSubmit,
  initialSections,
  isSaving
}: {
  onSubmit: (values: any) => void;
  initialSections: any;
  isSaving: boolean;
}) {
  const [sections, setSections] = useState(initialSections);

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const handleTitleChange = (index: number, value: string) => {
    const updated = [...sections];
    updated[index].title = value;
    setSections(updated);
  };

  const handleItemChange = (sectionIndex: number, itemIndex: number, value: string) => {
    const updated = [...sections];
    updated[sectionIndex].items[itemIndex] = value;
    setSections(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(sections);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow">
      {sections.map((section: any, sectionIndex: number) => (
        <div key={sectionIndex} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Judul Section {sectionIndex + 1}
            </label>
            <input
              type="text"
              value={section.title}
              onChange={(e) => handleTitleChange(sectionIndex, e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {section.items.map((item: string, itemIndex: number) => (
              <input
                key={itemIndex}
                type="text"
                value={item}
                onChange={(e) => handleItemChange(sectionIndex, itemIndex, e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            ))}
          </div>
        </div>
      ))}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow px-6 py-2">
          {isSaving ? "Menyimpan..." : "Simpan Footer"}
        </Button>
      </div>
    </form>
  );
}
