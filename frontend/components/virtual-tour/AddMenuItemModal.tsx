'use client';

import { useState, useEffect } from 'react';
import { Scene, VtourMenu } from '@/types/virtual-tour';
import toast from 'react-hot-toast';
import SceneCombobox from './SceneCombobox'; // <-- Import komponen baru

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<VtourMenu>) => void;
  scenes: Scene[];
  isSaving: boolean;
};

export default function AddMenuItemModal({ isOpen, onClose, onSave, scenes, isSaving }: Props) {
  const [name, setName] = useState('');
  const [selectedSceneId, setSelectedSceneId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelectedSceneId(null);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!selectedSceneId) {
      toast.error('Anda harus memilih satu spot.');
      return;
    }
    const sceneName = scenes.find(s => s.id === selectedSceneId)?.name || '';
    onSave({
      name: name.trim() || sceneName,
      scene_id: selectedSceneId,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex justify-center items-center p-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl animate-fade-in-scale">
        <div className="p-5 border-b">
          <h2 className="text-xl font-semibold text-gray-800">New Items Forms</h2>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="name menu (optional)"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Spot</label>
            {/* ✅ Ganti <select> dengan komponen baru */}
            <SceneCombobox
              scenes={scenes}
              value={selectedSceneId}
              onChange={setSelectedSceneId}
            />
          </div>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-end space-x-3 rounded-b-xl">
          <button onClick={onClose} disabled={isSaving} className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 font-semibold transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={isSaving || !selectedSceneId} className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}