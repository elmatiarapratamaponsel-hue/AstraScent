import React, { useState } from 'react';
import { 
  AstraScentInput, 
  VisualAesthetic, 
  Mood, 
  ScentProfile 
} from '../types/astrascent';
import { 
  ZODIAC_LIST, 
  VISUAL_STYLES, 
  MOODS, 
  SCENT_PROFILES, 
  COLOR_PRESETS 
} from '../data/zodiacData';
import { Sparkles, Compass, Palette, Wand2, Check, AlertCircle } from 'lucide-react';

interface AstraScentFormProps {
  onSubmit: (input: AstraScentInput) => void;
  isLoading: boolean;
  initialValues?: Partial<AstraScentInput>;
}

export const AstraScentForm: React.FC<AstraScentFormProps> = ({
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const [nickname, setNickname] = useState(initialValues?.nickname || '');
  const [zodiac, setZodiac] = useState(initialValues?.zodiac || 'Aries');
  const [favoriteColor, setFavoriteColor] = useState(initialValues?.favoriteColor || '#8B5CF6');
  const [visualStyle, setVisualStyle] = useState<VisualAesthetic>(initialValues?.visualStyle || 'Fantasy');
  const [mood, setMood] = useState<Mood>(initialValues?.mood || 'Tenang');
  const [favoriteScents, setFavoriteScents] = useState<ScentProfile[]>(
    initialValues?.favoriteScents && initialValues.favoriteScents.length > 0
      ? initialValues.favoriteScents
      : ['Woody', 'Floral']
  );
  const [errorMessage, setErrorMessage] = useState('');

  const toggleScent = (scent: ScentProfile) => {
    setFavoriteScents((prev) => {
      if (prev.includes(scent)) {
        if (prev.length <= 1) return prev; // At least one scent
        return prev.filter((s) => s !== scent);
      } else {
        return [...prev, scent];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setErrorMessage('Silakan masukkan nama panggilan Anda.');
      return;
    }
    setErrorMessage('');
    onSubmit({
      nickname: nickname.trim(),
      zodiac,
      favoriteColor,
      visualStyle,
      mood,
      favoriteScents,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-7">
      {/* 1. NAMA PANGGILAN */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10 relative overflow-hidden">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
            1
          </span>
          <label htmlFor="nickname" className="text-sm font-semibold text-white tracking-wide">
            Nama Panggilan
          </label>
        </div>
        <p className="text-xs text-slate-400 mb-3">
          Nama yang akan disematkan pada persona dan botol parfum kosmikmu.
        </p>
        <div className="relative">
          <input
            id="nickname"
            type="text"
            required
            maxLength={25}
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Contoh: Kaelen, Lyra, Surya..."
            className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/15 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent text-sm transition-all"
          />
        </div>
        {errorMessage && (
          <p className="flex items-center gap-1.5 text-xs text-rose-400 mt-2">
            <AlertCircle className="w-3.5 h-3.5" />
            {errorMessage}
          </p>
        )}
      </div>

      {/* 2. ZODIAK (12 PILIHAN) */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
              2
            </span>
            <label className="text-sm font-semibold text-white tracking-wide">
              Zodiak Kosmik (12 Rasi Bintang)
            </label>
          </div>
          <span className="text-xs font-serif-cosmic text-amber-300 font-medium">
            {ZODIAC_LIST.find((z) => z.name === zodiac)?.dates}
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Menentukan elemen asal dan karakteristik energi celestial Anda.
        </p>

        {/* Zodiac Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 sm:gap-2.5">
          {ZODIAC_LIST.map((item) => {
            const isSelected = zodiac === item.name;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setZodiac(item.name)}
                className={`relative flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-xl border text-center transition-all ${
                  isSelected
                    ? 'bg-purple-900/50 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)] scale-102'
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <span className="text-xl sm:text-2xl mb-1">{item.symbol}</span>
                <span className="text-xs font-bold">{item.name}</span>
                <span className="text-[10px] text-slate-400 font-mono scale-90">{item.element}</span>
                {isSelected && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#fbbf24]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. WARNA FAVORIT */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
            3
          </span>
          <label className="text-sm font-semibold text-white tracking-wide">
            Warna Aura Favorit
          </label>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Warna ini akan menjadi pijar aura kartu, avatar, dan kemasan parfum kosmikmu.
        </p>

        {/* Color Presets */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {COLOR_PRESETS.map((color) => {
            const isSelected = favoriteColor.toLowerCase() === color.hex.toLowerCase();
            return (
              <button
                type="button"
                key={color.name}
                onClick={() => setFavoriteColor(color.hex)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                  isSelected
                    ? 'border-white bg-white/15 text-white shadow-md'
                    : 'border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/30'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                />
                <span>{color.name}</span>
                {isSelected && <Check className="w-3 h-3 text-white" />}
              </button>
            );
          })}

          {/* Native Color Picker Option */}
          <div className="flex items-center gap-2 pl-1">
            <label
              htmlFor="custom-color"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/15 bg-slate-900/60 text-xs text-slate-300 cursor-pointer hover:border-white/30"
            >
              <Palette className="w-3.5 h-3.5 text-purple-300" />
              <span>Kustom</span>
              <input
                id="custom-color"
                type="color"
                value={favoriteColor}
                onChange={(e) => setFavoriteColor(e.target.value)}
                className="opacity-0 w-0 h-0 pointer-events-none"
              />
            </label>
            <div
              className="w-5 h-5 rounded-full border border-white/40 shadow-sm"
              style={{ backgroundColor: favoriteColor }}
            />
          </div>
        </div>
      </div>

      {/* 4. GAYA VISUAL: Cyberpunk, Fantasy, Royal Galaxy */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
            4
          </span>
          <label className="text-sm font-semibold text-white tracking-wide">
            Gaya Visual Kartu & Avatar
          </label>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Pilih tema estetika profil Instagram Story dan busana personamu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {VISUAL_STYLES.map((style) => {
            const isSelected = visualStyle === style.id;
            return (
              <button
                type="button"
                key={style.id}
                onClick={() => setVisualStyle(style.id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? `${style.borderClass} bg-slate-900/90 text-white scale-[1.02]`
                    : 'bg-slate-900/40 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{style.icon}</span>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-full bg-purple-500/30 border border-purple-400/50 text-[10px] text-purple-200 font-semibold uppercase">
                      Aktif
                    </span>
                  )}
                </div>
                <div className="font-bold text-sm text-white">{style.label}</div>
                <div className="text-[11px] text-slate-400 mt-1 leading-snug">{style.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. SUASANA HATI */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
            5
          </span>
          <label className="text-sm font-semibold text-white tracking-wide">
            Suasana Hati Saat Ini
          </label>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Frekuensi batin yang memandu keselarasan notes parfum dan kekuatan persona.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {MOODS.map((m) => {
            const isSelected = mood === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-purple-900/50 border-purple-400 text-white shadow-[0_0_15px_rgba(168,85,247,0.35)]'
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <span className="text-2xl mb-1">{m.emoji}</span>
                <span className="text-xs font-bold text-center">{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. KARAKTER AROMA FAVORIT (Boleh Lebih Dari Satu) */}
      <div className="glass-panel p-5 sm:p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/30">
              6
            </span>
            <label className="text-sm font-semibold text-white tracking-wide">
              Karakter Aroma Favorit (Pilih 1 atau Lebih)
            </label>
          </div>
          <span className="text-xs text-purple-300 font-medium">
            {favoriteScents.length} dipilih
          </span>
        </div>
        <p className="text-xs text-slate-400 mb-4">
          Diramu bersama bahan aromatik khas kepulauan Nusantara seperti Cendana, Melati, Kopi, & Rempah.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {SCENT_PROFILES.map((scent) => {
            const isSelected = favoriteScents.includes(scent.id);
            return (
              <button
                type="button"
                key={scent.id}
                onClick={() => toggleScent(scent.id)}
                className={`text-left p-3 rounded-xl border transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-400 text-white shadow-sm ring-1 ring-purple-400/30'
                    : 'bg-slate-900/50 border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20'
                }`}
              >
                <span className="text-xl shrink-0 mt-0.5">{scent.icon}</span>
                <div className="truncate">
                  <div className="font-bold text-xs text-white flex items-center justify-between">
                    <span>{scent.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-purple-300" />}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">
                    {scent.nusantaraNote}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative group overflow-hidden rounded-2xl py-4 px-6 font-serif-cosmic font-bold text-base sm:text-lg text-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: `linear-gradient(135deg, ${favoriteColor}, #9333ea, #4f46e5)`,
            boxShadow: `0 0 35px ${favoriteColor}60`,
          }}
        >
          {/* Animated Sheen Overlay */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
          
          <div className="relative z-10 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{isLoading ? 'Menghubungi Bintang...' : 'GENERATE PERSONA & AROMA KOSMIK'}</span>
            <Wand2 className="w-5 h-5 text-amber-300" />
          </div>
        </button>
        <p className="text-center text-[11px] text-slate-500 mt-2 font-serif-cosmic">
          "Temukan aroma dari bintangmu."
        </p>
      </div>
    </form>
  );
};
