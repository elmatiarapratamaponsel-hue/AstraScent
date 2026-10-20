import React, { useState } from 'react';
import { Mood } from '../types/astrascent';
import { MOODS } from '../data/zodiacData';
import { Sparkles, X, RefreshCw } from 'lucide-react';

interface QuickMoodModalProps {
  currentMood: Mood;
  isOpen: boolean;
  onClose: () => void;
  onSelectMood: (newMood: Mood) => void;
  isLoading: boolean;
  favoriteColor: string;
}

export const QuickMoodModal: React.FC<QuickMoodModalProps> = ({
  currentMood,
  isOpen,
  onClose,
  onSelectMood,
  isLoading,
  favoriteColor,
}) => {
  const [selectedMood, setSelectedMood] = useState<Mood>(currentMood);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-md p-6 rounded-3xl bg-slate-950 border border-white/20 shadow-2xl overflow-hidden"
        style={{
          boxShadow: `0 0 40px ${favoriteColor}40`,
        }}
      >
        {/* Glow */}
        <div
          className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-[60px] pointer-events-none"
          style={{ backgroundColor: favoriteColor, opacity: 0.3 }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300" />
            <h3 className="text-lg font-bold font-serif-cosmic text-white">
              Coba Suasana Hati Lain
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mb-5 leading-relaxed relative z-10">
          Ubah frekuensi batinmu saat ini. AstraScent akan meramu ulang persona dan komposisi notes parfum kosmikmu secara instan.
        </p>

        {/* Mood selection list */}
        <div className="space-y-2 relative z-10 mb-6">
          {MOODS.map((m) => {
            const isSelected = selectedMood === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMood(m.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-purple-950/70 border-purple-400 text-white shadow-sm ring-1 ring-purple-400/40'
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{m.emoji}</span>
                  <div>
                    <div className="text-sm font-bold text-white">{m.label}</div>
                    <div className="text-[11px] text-slate-400">{m.desc}</div>
                  </div>
                </div>
                {isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 relative z-10">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-white/10 bg-slate-900 text-slate-300 text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={() => onSelectMood(selectedMood)}
            className="flex-2 py-3 px-4 rounded-xl font-bold text-xs font-serif-cosmic text-white flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
            style={{
              background: `linear-gradient(135deg, ${favoriteColor}, #9333ea)`,
              boxShadow: `0 0 20px ${favoriteColor}60`,
            }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Meramu...' : 'Racik Aroma Baru'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
