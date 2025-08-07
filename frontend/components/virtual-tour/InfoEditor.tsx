'use client';

import { useState, useEffect } from "react";
import { Hotspot, Sentence } from "@/types/virtual-tour";
import toast from "react-hot-toast";
import { X, Trash2, Plus, Volume2 } from "lucide-react";
import { nanoid } from 'nanoid';

// Props disederhanakan: onFileUpload & onFileDelete dihapus
type Props = {
  isOpen: boolean;
  hotspot?: Partial<Hotspot> | null;
  onSave: (data: { label: string; description: string; sentences: Sentence[] }) => void;
  onClose: () => void;
  onDelete?: () => void;
  isSaving: boolean;
};

export default function InfoEditor({ isOpen, hotspot, onSave, onClose, onDelete, isSaving }: Props) {
  const [label, setLabel] = useState('');
  const [description, setDescription] = useState('');
  const [sentences, setSentences] = useState<Sentence[]>([]);

  useEffect(() => {
    if (isOpen && hotspot) {
      setLabel(hotspot.label || '');
      setDescription(hotspot.description || '');
      // Pastikan setiap sentence memiliki voiceSource, default ke 'browser'
      const initialSentences = hotspot.sentences?.map(s => ({ ...s, voiceSource: s.voiceSource || 'browser' })) || [];
      setSentences(initialSentences);
    } else {
      // Reset form saat ditutup
      setLabel('');
      setDescription('');
      setSentences([]);
    }
  }, [isOpen, hotspot]);

  const handleAddSentence = () => {
    setSentences([...sentences, { id: nanoid(), clause: '', voiceSource: 'browser' }]);
  };

  const handleRemoveSentence = (id: string) => {
    setSentences(sentences.filter(s => s.id !== id));
  };

  const handleSentenceChange = (id: string, newClause: string) => {
    setSentences(sentences.map(s => s.id === id ? { ...s, clause: newClause } : s));
  };

  const handlePlayBrowserSpeech = (text: string) => {
    window.speechSynthesis.cancel();
    if (!text.trim()) return toast.error("Tulis klausa terlebih dahulu.");
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Browser Anda tidak mendukung fitur ini.");
    }
  };

  const handleSave = () => {
    if (!label.trim()) {
      toast.error("Name Info tidak boleh kosong.");
      return;
    }
    onSave({ label, description, sentences });
  };
  
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-4 bg-white rounded-lg shadow-2xl w-96 max-h-[85vh] flex flex-col z-20 animate-fade-in-scale">
      <div className="flex-shrink-0 p-5 border-b flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">{hotspot?.id ? 'Edit Info' : 'Add Info'}</h3>
        <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100"><X size={20} /></button>
      </div>
      <div className="flex-grow overflow-y-auto p-5 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Name Info *</label>
          <input type="text" value={label} onChange={e => setLabel(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" placeholder="Contoh: Meja Rapat"/>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full border border-gray-300 rounded-md p-2" rows={4} placeholder="Jelaskan item ini..."></textarea>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 block">Sentences</label>
          {sentences.map((sentence) => (
            <div key={sentence.id} className="bg-gray-50 p-3 rounded-md border">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-600">Clause</label>
                <button onClick={() => handleRemoveSentence(sentence.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16}/></button>
              </div>
              <div className="flex items-center space-x-2">
                <input type="text" value={sentence.clause} onChange={(e) => handleSentenceChange(sentence.id, e.target.value)} className="w-full border border-gray-300 rounded-md p-2 text-sm" placeholder="Tulis teks yang ingin diucapkan..."/>
                <button onClick={() => handlePlayBrowserSpeech(sentence.clause)} className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" title="Dengarkan Suara"><Volume2 size={18} /></button>
              </div>
            </div>
          ))}
          <button onClick={handleAddSentence} className="w-full flex items-center justify-center space-x-2 bg-green-50 text-green-700 border-2 border-dashed border-green-200 rounded-lg p-2 hover:bg-green-100"><Plus size={16}/><span>Add Sentence</span></button>
        </div>
      </div>
      <div className="flex-shrink-0 flex justify-between items-center p-5 mt-auto border-t">
        {onDelete && hotspot?.id && typeof hotspot.id === 'number' ? (<button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-md"><Trash2 size={18} /></button>) : (<div />)}
        <div className="flex-grow flex justify-end space-x-2">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">CLOSE</button>
          <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">{isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
        </div>
      </div>
    </div>
  );
}