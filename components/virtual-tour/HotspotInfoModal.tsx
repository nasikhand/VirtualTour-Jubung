'use client';

import { Hotspot } from "@/types/virtual-tour";
import { X, Volume2, VolumeX, Info, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

type Props = {
  hotspot: Hotspot | null;
  onClose: () => void;
};

export default function HotspotInfoModal({ hotspot, onClose }: Props) {
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [playingUtterance, setPlayingUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  
  if (!hotspot) return null;

  // Fungsi untuk memutar suara dari teks menggunakan Web Speech API
  const handlePlayAudio = (text: string, id: string) => {
    // Stop any currently playing audio
    if (playingUtterance) {
      window.speechSynthesis.cancel();
      setIsPlaying(null);
      setPlayingUtterance(null);
      if (isPlaying === id) return; // If clicking the same button, just stop
    }
    
    if (!text.trim()) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => {
        setIsPlaying(id);
        setPlayingUtterance(utterance);
      };
      
      utterance.onend = () => {
        setIsPlaying(null);
        setPlayingUtterance(null);
      };
      
      utterance.onerror = () => {
        setIsPlaying(null);
        setPlayingUtterance(null);
        toast.error("Gagal memutar audio");
      };
      
      window.speechSynthesis.speak(utterance);
      toast.success("Memutar audio...");
    } else {
      toast.error("Browser Anda tidak mendukung fitur ucapan ini.");
    }
  };
  
  const stopAudio = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(null);
    setPlayingUtterance(null);
  };

  return (
    // Backdrop transparan yang bisa diklik untuk menutup modal
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4 backdrop-blur-md animate-fade-in" 
      onClick={() => {
        stopAudio();
        onClose();
      }}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-fade-in-scale overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Info size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{hotspot.label}</h3>
                <p className="text-emerald-100 text-sm">Informasi Detail</p>
              </div>
            </div>
            <button 
              onClick={() => {
                stopAudio();
                onClose();
              }} 
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-white/5 rounded-full" />
        </div>
        
        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {hotspot.description && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={16} className="text-emerald-500" />
                <h4 className="font-semibold text-gray-800">Deskripsi</h4>
              </div>
              <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border-l-4 border-emerald-400">
                {hotspot.description}
              </p>
            </div>
          )}

          {hotspot.sentences && hotspot.sentences.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Volume2 size={16} className="text-emerald-500" />
                <h4 className="font-semibold text-gray-800">Audio Narasi</h4>
                <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                  {hotspot.sentences.length} klip
                </span>
              </div>
              
              <div className="space-y-3">
                {hotspot.sentences.map((sentence, index) => (
                  <div key={sentence.id} className="group bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200 hover:border-emerald-300 transition-all duration-200">
                    <div className="flex items-start gap-3">
                      <div className="bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 flex-1 leading-relaxed">{sentence.clause}</p>
                      <button 
                        onClick={() => handlePlayAudio(sentence.clause, sentence.id.toString())}
                        className={`p-3 rounded-full transition-all duration-200 flex-shrink-0 ${
                          isPlaying === sentence.id.toString()
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                            : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:scale-110'
                        }`}
                        title={isPlaying === sentence.id.toString() ? "Stop Audio" : "Putar Audio"}
                      >
                        {isPlaying === sentence.id.toString() ? <VolumeX size={18} /> : <Volume2 size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Audio Controls */}
              <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-700 font-medium">Kontrol Audio</span>
                  {isPlaying && (
                    <button
                      onClick={stopAudio}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full text-xs transition-colors"
                    >
                      Stop Semua
                    </button>
                  )}
                </div>
                <p className="text-emerald-600 text-xs mt-1">
                  Klik tombol audio untuk mendengarkan narasi • Bahasa: Indonesia
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}