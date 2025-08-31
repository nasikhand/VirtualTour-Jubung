'use client';

import { useState, useEffect } from 'react';
import { Scene, Hotspot } from '@/types/virtual-tour';
import SceneCombobox from './SceneCombobox';
import toast from 'react-hot-toast';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (hotspotData: Partial<Hotspot>) => void;
  onDelete: () => void;
  hotspot: Partial<Hotspot> | null;
  scenes: Scene[]; // Daftar semua scene untuk dipilih
  isSaving: boolean;
};

export default function LinkHotspotModal({ isOpen, onClose, onSave, onDelete, hotspot, scenes, isSaving }: Props) {
  const [targetSceneId, setTargetSceneId] = useState<number | null>(null);
  const [label, setLabel] = useState('');
  const [iconName, setIconName] = useState('default');
  
  // Daftar ikon yang tersedia - Sesuaikan dengan CSS yang ada
  const availableIcons = [
    { value: 'default', label: 'Default' },
    { value: 'arrow-up', label: 'Arrow Up' },
    { value: 'door', label: 'Door' },
    { value: 'location', label: 'Location' },
    { value: 'info', label: 'Info' },
    { value: 'warning', label: 'Warning' },
    { value: 'exit', label: 'Exit' },
    { value: 'stairs', label: 'Stairs' },
    { value: 'elevator', label: 'Elevator' },
  ];

  useEffect(() => {
    if (hotspot) {
      setTargetSceneId(hotspot.target_scene_id || null);
      const defaultLabel = scenes.find(s => s.id === hotspot.target_scene_id)?.name || '';
      setLabel(hotspot.label || defaultLabel);
      setIconName(hotspot.icon_name || 'default');
    }
  }, [hotspot, scenes]);

  const handleSave = () => {
    if (!targetSceneId) {
      toast.error("Anda harus memilih scene tujuan.");
      return;
    }
    const sceneName = scenes.find(s => s.id === targetSceneId)?.name || '';
    onSave({
      label: label.trim() || sceneName,
      target_scene_id: targetSceneId,
      type: 'link',
      icon_name: iconName,
    });
  };

  if (!isOpen || !hotspot) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl animate-fade-in-scale">
        <div className="p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Edit Hotspot Tautan</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Label Hotspot (Opsional)</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
              placeholder="Otomatis diisi nama scene tujuan jika kosong"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Scene Tujuan</label>
            <SceneCombobox
              scenes={scenes.filter(s => s.id !== hotspot.scene_id)} // Tidak bisa link ke scene itu sendiri
              value={targetSceneId}
              onChange={setTargetSceneId}
              placeholder="Pilih destinasi..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Ikon Hotspot</label>
            <select
              value={iconName}
              onChange={(e) => setIconName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 bg-white"
            >
              {availableIcons.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center rounded-b-xl">
          <button onClick={onDelete} className="px-5 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50">
            Hapus Hotspot
          </button>
          <div className="flex space-x-3">
            <button onClick={onClose} disabled={isSaving} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold">
              Batal
            </button>
            <button onClick={handleSave} disabled={isSaving || !targetSceneId} className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold disabled:opacity-50">
              {isSaving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}