'use client';

import { useState, useRef, useEffect } from 'react';
import { Scene } from '@/types/virtual-tour';
import { Check, ChevronsUpDown } from 'lucide-react';

type Props = {
  scenes: Scene[];
  value: number | null;
  onChange: (sceneId: number) => void;
  placeholder?: string;
};

export default function SceneCombobox({ scenes, value, onChange, placeholder = "Select spot..." }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const comboboxRef = useRef<HTMLDivElement>(null);
  const selectedScene = scenes.find(s => s.id === value);
  const filteredScenes = query === ''
    ? scenes
    : scenes.filter(scene => scene.name.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  return (
    <div ref={comboboxRef} className="relative w-full">
      <button type="button" onClick={() => setIsOpen(!isOpen)} className="relative w-full cursor-default rounded-md bg-white py-2 pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
        {selectedScene ? (
          <span className="flex items-center">
            {/* ✅ Menggunakan API Proxy untuk gambar */}
            <img 
              src={`/api/vtour/images/${selectedScene.image_path}`} 
              alt={selectedScene.name}
              className="h-6 w-8 rounded-sm object-cover mr-3"
            />
            <span className="block truncate">{selectedScene.name}</span>
          </span>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"><ChevronsUpDown className="h-4 w-4 text-gray-400" /></span>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
          <div className="p-2">
            <input type="text" placeholder="Cari spot..." value={query} onChange={(e) => setQuery(e.target.value)} className="w-full border border-gray-300 rounded-md p-2"/>
          </div>
          {filteredScenes.length === 0 && query !== '' ? (
            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">Tidak ada spot ditemukan.</div>
          ) : (
            filteredScenes.map((scene) => (
              <div key={scene.id} onClick={() => { onChange(scene.id); setIsOpen(false); setQuery(''); }} className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 hover:bg-blue-500 hover:text-white flex items-center">
                {selectedScene?.id === scene.id && (<span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600"><Check className="h-5 w-5" /></span>)}
                {/* ✅ Menggunakan API Proxy untuk gambar */}
                <img src={`/api/vtour/images/${scene.image_path}`} alt={scene.name} className="h-8 w-12 rounded-md object-cover mr-3"/>
                <span className={`block truncate ${selectedScene?.id === scene.id ? 'font-medium' : 'font-normal'}`}>{scene.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}