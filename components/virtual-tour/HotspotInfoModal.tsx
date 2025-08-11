'use client';

import { Hotspot } from "@/types/virtual-tour";
import { X, Volume2 } from "lucide-react";
import toast from "react-hot-toast";

type Props = {
  hotspot: Hotspot | null;
  onClose: () => void;
};

export default function HotspotInfoModal({ hotspot, onClose }: Props) {
  if (!hotspot) return null;

  // Fungsi untuk memutar suara dari teks menggunakan Web Speech API
  const handlePlayAudio = (text: string) => {
    window.speechSynthesis.cancel(); // Hentikan suara lain yang mungkin berjalan
    if (!text.trim()) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; // Set bahasa ke Indonesia
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Browser Anda tidak mendukung fitur ucapan ini.");
    }
  };

  return (
    // Backdrop transparan yang bisa diklik untuk menutup modal
    <div 
      className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in" 
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md rounded-xl shadow-2xl animate-fade-in-scale space-y-4"
        onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat konten di dalamnya diklik
      >
        <div className="flex justify-between items-center p-5 pb-3 border-b">
          <h3 className="text-xl font-bold text-gray-800">{hotspot.label}</h3>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <X size={22} />
          </button>
        </div>
        
        <div className="px-5 max-h-[70vh] overflow-y-auto">
          {hotspot.description && (
            <p className="text-gray-600 pb-4">{hotspot.description}</p>
          )}

          {hotspot.sentences && hotspot.sentences.length > 0 && (
            <div className="space-y-2 pb-5">
              {hotspot.sentences.map((sentence) => (
                <div key={sentence.id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
                  <p className="text-gray-800 flex-1">{sentence.clause}</p>
                  <button 
                    onClick={() => handlePlayAudio(sentence.clause)}
                    className="ml-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform hover:scale-110"
                    title="Dengarkan Suara"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}