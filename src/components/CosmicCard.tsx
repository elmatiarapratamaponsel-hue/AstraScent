import React, { forwardRef } from 'react';
import { AstraScentResult } from '../types/astrascent';
import { AvatarVisualizer } from './AvatarVisualizer';
import { 
  Sparkles, 
  Flame, 
  Globe, 
  Wind, 
  Compass, 
  Gift, 
  Layers, 
  Droplet,
  Feather,
  Heart
} from 'lucide-react';

interface CosmicCardProps {
  data: AstraScentResult;
  cardRef?: React.Ref<HTMLDivElement>;
}

export const CosmicCard = forwardRef<HTMLDivElement, CosmicCardProps>(({ data }, ref) => {
  const {
    nickname,
    zodiac,
    zodiacInfo,
    favoriteColor,
    visualStyle,
    mood,
    persona,
    perfume,
  } = data;

  // Style-specific card wrapper attributes
  const styleWrapperClasses = {
    Cyberpunk: 'border-cyan-400/50 shadow-[0_0_35px_rgba(6,182,212,0.3)] bg-gradient-to-b from-[#0a0d24] via-[#050616] to-[#0b0c20]',
    Fantasy: 'border-amber-300/40 shadow-[0_0_40px_rgba(245,158,11,0.25)] bg-gradient-to-b from-[#130b24] via-[#080718] to-[#12081f]',
    'Royal Galaxy': 'border-purple-400/50 shadow-[0_0_45px_rgba(168,85,247,0.35)] bg-gradient-to-b from-[#170a2c] via-[#090616] to-[#19092c]',
  }[visualStyle] || 'border-purple-500/40 bg-slate-950';

  return (
    <div
      ref={ref}
      id="astrascent-story-card"
      className={`relative w-full max-w-[440px] mx-auto rounded-3xl p-5 sm:p-6 border-2 transition-all duration-700 overflow-hidden ${styleWrapperClasses}`}
      style={{
        boxShadow: `0 0 50px ${favoriteColor}35, 0 20px 40px rgba(0,0,0,0.8)`,
      }}
    >
      {/* Dynamic Favorite Color Ambient Halo */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: favoriteColor, opacity: 0.25 }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-[90px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: favoriteColor, opacity: 0.2 }}
      />

      {/* Cyberpunk HUD / Fantasy Corner Embellishments */}
      {visualStyle === 'Cyberpunk' && (
        <>
          <div className="absolute top-3 left-3 text-[9px] font-cyber tracking-widest text-cyan-400/70">
            SYSTEM.ID // AST-99
          </div>
          <div className="absolute top-3 right-3 text-[9px] font-cyber tracking-widest text-cyan-400/70">
            LOC.ORBIT // 404
          </div>
          <div className="absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        </>
      )}

      {visualStyle === 'Fantasy' && (
        <div className="absolute top-2 inset-x-0 flex items-center justify-center gap-2 pointer-events-none text-amber-300/40 text-xs">
          <span>✧</span>
          <span className="w-16 h-[1px] bg-amber-400/30" />
          <span>✦</span>
          <span className="w-16 h-[1px] bg-amber-400/30" />
          <span>✧</span>
        </div>
      )}

      {visualStyle === 'Royal Galaxy' && (
        <div className="absolute top-2 inset-x-0 flex items-center justify-center pointer-events-none text-purple-300/60 text-xs">
          <div className="px-3 py-0.5 rounded-full bg-purple-950/60 border border-purple-400/30 text-[10px] tracking-widest uppercase font-serif-cosmic text-amber-300">
            ✦ Imperial Astral Crest ✦
          </div>
        </div>
      )}

      {/* HEADER SECTION: Title & Nickname */}
      <div className="relative z-10 text-center pt-3 pb-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 font-medium mb-1.5 backdrop-blur-sm">
          <span>{zodiacInfo?.symbol || '✨'}</span>
          <span className="text-white font-semibold">{zodiac}</span>
          <span className="text-white/40">•</span>
          <span className="text-purple-300 font-medium">{mood}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-serif-cosmic text-white tracking-wide drop-shadow-md">
          {persona.characterName}
        </h2>
        <p className="text-xs sm:text-sm text-purple-200/90 font-medium mt-0.5 tracking-wide italic">
          "{persona.cosmicTitle}"
        </p>
      </div>

      {/* AVATAR VISUALIZER */}
      <div className="relative z-10 my-3">
        <AvatarVisualizer
          characterName={persona.characterName}
          visualStyle={visualStyle}
          rarity={persona.rarity}
          favoriteColor={favoriteColor}
          zodiac={zodiac}
          zodiacSymbol={zodiacInfo?.symbol || '✨'}
          visualConcept={persona.visualConcept}
          element={persona.element}
        />
      </div>

      {/* PERSONA ATTRIBUTES PILLS */}
      <div className="relative z-10 grid grid-cols-2 gap-2 my-3 text-[11px]">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Planet Asal</span>
            <span className="text-slate-200 font-semibold truncate block">{persona.originPlanet}</span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <div className="truncate">
            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Elemen Kosmik</span>
            <span className="text-slate-200 font-semibold truncate block">{persona.element}</span>
          </div>
        </div>
      </div>

      {/* PERSONA CREATIVE DESCRIPTION */}
      <div className="relative z-10 p-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed my-2 italic">
        "{persona.description}"
      </div>

      {/* SPECIAL POWER */}
      <div className="relative z-10 p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/20 text-xs flex items-start gap-2 my-2">
        <Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300 text-[11px] block">Kekuatan Khusus:</span>
          <span className="text-purple-100/90 leading-tight block text-[11.5px]">{persona.specialPower}</span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="relative z-10 flex items-center gap-3 my-3.5">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <span className="text-[11px] font-serif-cosmic text-amber-300 uppercase tracking-widest flex items-center gap-1 font-semibold">
          <Droplet className="w-3.5 h-3.5 text-amber-300" />
          Parfum Kosmik
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* PERFUME SECTION */}
      <div className="relative z-10 space-y-2.5">
        {/* Perfume Name and Category */}
        <div className="text-center">
          <h3 className="text-lg font-bold font-serif-cosmic text-white">
            {perfume.perfumeName}
          </h3>
          <p className="text-[11px] text-amber-200/90 font-medium">
            Kategori: {perfume.scentCategory}
          </p>
        </div>

        {/* Olfactory Notes Pyramid */}
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-white/10 space-y-2 text-xs">
          {/* Top Notes */}
          <div className="flex items-start gap-2">
            <span className="w-14 shrink-0 text-[10px] font-bold tracking-wider uppercase text-cyan-300 pt-0.5">
              Top
            </span>
            <div className="flex flex-wrap gap-1">
              {perfume.topNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-400/30 text-cyan-200 text-[11px]"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Heart Notes */}
          <div className="flex items-start gap-2">
            <span className="w-14 shrink-0 text-[10px] font-bold tracking-wider uppercase text-rose-300 pt-0.5">
              Heart
            </span>
            <div className="flex flex-wrap gap-1">
              {perfume.heartNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-rose-950/60 border border-rose-400/30 text-rose-200 text-[11px]"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Base Notes */}
          <div className="flex items-start gap-2">
            <span className="w-14 shrink-0 text-[10px] font-bold tracking-wider uppercase text-amber-300 pt-0.5">
              Base
            </span>
            <div className="flex flex-wrap gap-1">
              {perfume.baseNotes.map((note, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-400/30 text-amber-200 text-[11px]"
                >
                  {note}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Nusantara Heritage Touch */}
        <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-emerald-300 text-[11px] mb-1">
            <Feather className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sentuhan Alam Nusantara</span>
          </div>
          <p className="text-emerald-100/90 text-[11.5px] leading-relaxed">
            {perfume.nusantaraHeritage}
          </p>
        </div>

        {/* Match Reason */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-purple-300 block text-[11px] mb-0.5">
            Harmoni Zodiak & Suasana Hati:
          </span>
          <p className="text-[11.5px] text-slate-300">{perfume.matchReason}</p>
        </div>

        {/* Similar Recommendations */}
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs">
          <span className="font-semibold text-slate-300 block text-[11px] mb-1.5 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            Rekomendasi Tipe Serupa:
          </span>
          <ul className="space-y-1 text-slate-300 text-[11px]">
            {perfume.similarRecommendations.map((rec, idx) => (
              <li key={idx} className="flex items-center gap-1.5">
                <span className="text-amber-400 text-xs">✦</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Gift Idea */}
        <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/20 text-xs flex items-start gap-2">
          <Gift className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-amber-300 text-[11px] block">Ide Hadiah Istimewa:</span>
            <p className="text-amber-100/90 text-[11.5px] leading-tight mt-0.5">{perfume.giftIdea}</p>
          </div>
        </div>
      </div>

      {/* FOOTER & WATERMARK (MANDATORY REQUIREMENT) */}
      <div className="relative z-10 mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 font-medium text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span className="tracking-wide">AstraScent</span>
        </div>
        <div className="text-[10px] text-slate-400 font-serif-cosmic italic">
          "Temukan aroma dari bintangmu"
        </div>
      </div>
    </div>
  );
});

CosmicCard.displayName = 'CosmicCard';
