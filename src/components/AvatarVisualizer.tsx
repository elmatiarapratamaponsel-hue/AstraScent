import React, { useState } from 'react';
import { VisualAesthetic, Rarity } from '../types/astrascent';
import { Sparkles, Eye, Shield, Shirt, Compass, Orbit } from 'lucide-react';

interface AvatarVisualizerProps {
  characterName: string;
  visualStyle: VisualAesthetic;
  rarity: Rarity;
  favoriteColor: string;
  zodiac: string;
  zodiacSymbol?: string;
  visualConcept: {
    outfit: string;
    accessories: string;
    background: string;
  };
  element?: string;
}

export const AvatarVisualizer: React.FC<AvatarVisualizerProps> = ({
  characterName,
  visualStyle,
  rarity,
  favoriteColor,
  zodiac,
  zodiacSymbol = '✨',
  visualConcept,
  element = 'Eter Kosmik',
}) => {
  const [activeTab, setActiveTab] = useState<'avatar' | 'concept'>('avatar');

  // Rarity styling
  const rarityConfig = {
    Common: {
      label: 'COMMON',
      badgeBg: 'bg-slate-800/80 border-slate-400/50 text-slate-200',
      aura: 'from-slate-400/20 via-sky-300/10 to-transparent',
      glow: '0 0 15px rgba(148, 163, 184, 0.3)',
      icon: '✦',
    },
    Rare: {
      label: 'RARE',
      badgeBg: 'bg-purple-950/80 border-purple-400/60 text-purple-200',
      aura: 'from-purple-500/30 via-pink-500/20 to-transparent',
      glow: '0 0 25px rgba(168, 85, 247, 0.45)',
      icon: '★',
    },
    Legendary: {
      label: 'LEGENDARY',
      badgeBg: 'bg-amber-950/90 border-amber-400/80 text-amber-200 animate-pulse',
      aura: 'from-amber-400/40 via-rose-500/30 to-purple-600/20',
      glow: '0 0 35px rgba(245, 158, 11, 0.6)',
      icon: '👑',
    },
  }[rarity] || {
    label: 'RARE',
    badgeBg: 'bg-purple-950/80 border-purple-400/60 text-purple-200',
    aura: 'from-purple-500/30 to-transparent',
    glow: '0 0 25px rgba(168, 85, 247, 0.4)',
    icon: '★',
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-950/80 shadow-2xl backdrop-blur-md">
      {/* Top Bar with Rarity Badge and View Toggle */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-900/70 border-b border-white/10 z-20 relative">
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase border flex items-center gap-1 ${rarityConfig.badgeBg}`}
            style={{ boxShadow: rarityConfig.glow }}
          >
            <span>{rarityConfig.icon}</span>
            <span>{rarityConfig.label}</span>
          </span>
          <span className="text-[11px] text-slate-300 font-medium px-2 py-0.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-1">
            <span>{zodiacSymbol}</span>
            <span>{zodiac}</span>
          </span>
        </div>

        {/* View Switcher: Avatar Art vs Visual Concept details */}
        <div className="flex items-center gap-1 p-0.5 bg-slate-950/80 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab('avatar')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              activeTab === 'avatar'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Avatar
          </button>
          <button
            onClick={() => setActiveTab('concept')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              activeTab === 'concept'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Detail Konsep
          </button>
        </div>
      </div>

      {activeTab === 'avatar' ? (
        /* Artistic Procedural Cosmic Avatar Display */
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] flex items-center justify-center overflow-hidden">
          {/* Background Ambient Glow */}
          <div
            className={`absolute inset-0 bg-gradient-to-t ${rarityConfig.aura}`}
          />
          <div
            className="absolute w-48 h-48 rounded-full blur-[45px] transition-all duration-700 pointer-events-none"
            style={{
              backgroundColor: favoriteColor,
              opacity: 0.35,
            }}
          />

          {/* Style Specific Aesthetics */}
          {visualStyle === 'Cyberpunk' && (
            <>
              {/* Scanlines and Cyber grid */}
              <div
                className="absolute inset-0 opacity-15 pointer-events-none"
                style={{
                  backgroundImage:
                    'linear-gradient(rgba(6, 182, 212, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.4) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
              {/* HUD corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyan-400/80" />
              <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyan-400/80" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyan-400/80" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyan-400/80" />
            </>
          )}

          {visualStyle === 'Fantasy' && (
            <>
              {/* Celestial Rune Rings */}
              <div
                className="absolute w-56 h-56 rounded-full border border-amber-300/20 border-dashed animate-spin pointer-events-none"
                style={{ animationDuration: '24s' }}
              />
              <div
                className="absolute w-44 h-44 rounded-full border border-purple-300/30 animate-spin pointer-events-none"
                style={{ animationDirection: 'reverse', animationDuration: '16s' }}
              />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-transparent to-transparent pointer-events-none" />
            </>
          )}

          {visualStyle === 'Royal Galaxy' && (
            <>
              {/* Imperial Cosmic Starburst & Filigree */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-purple-900/20 to-transparent pointer-events-none" />
              <div className="absolute top-3 inset-x-0 flex justify-center pointer-events-none">
                <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
              </div>
            </>
          )}

          {/* Central Avatar Silhouette & Celestial Energy Aura */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Crown / Halo based on visualStyle */}
            <div className="mb-1 flex items-center justify-center">
              {visualStyle === 'Royal Galaxy' ? (
                <div className="flex items-center gap-1 text-amber-300 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)] animate-bounce">
                  <span className="text-xl">👑</span>
                </div>
              ) : visualStyle === 'Cyberpunk' ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-400/60 text-[10px] font-cyber text-cyan-300 tracking-wider shadow-[0_0_10px_rgba(6,182,212,0.6)]">
                  <Orbit className="w-3 h-3 text-cyan-400 animate-spin" />
                  <span>NEURAL.HUD</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-200 drop-shadow-[0_0_10px_rgba(253,230,138,0.7)]">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
                </div>
              )}
            </div>

            {/* Avatar Orb / Portrait Crest */}
            <div
              className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center p-1 transition-transform duration-500 hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${favoriteColor}, rgba(255,255,255,0.4), #0f172a)`,
                boxShadow: `0 0 35px ${favoriteColor}70`,
              }}
            >
              {/* Inner Disc */}
              <div className="w-full h-full rounded-full bg-slate-950/90 flex flex-col items-center justify-center overflow-hidden relative border border-white/20">
                {/* Nebula Swirl inside orb */}
                <div
                  className="absolute inset-0 opacity-70"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${favoriteColor} 0%, rgba(30, 27, 75, 0.8) 50%, #030712 100%)`,
                  }}
                />

                {/* Stylized Celestial Glyph */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <div
                    className="text-4xl sm:text-5xl font-bold transition-all drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                    style={{ color: '#ffffff' }}
                  >
                    {zodiacSymbol}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/90 mt-1">
                    {element}
                  </div>
                </div>

                {/* Starlight Sparkle overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
                  <div className="h-full w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent absolute" />
                </div>
              </div>
            </div>

            {/* Character Cosmic Title Label */}
            <div className="mt-3 text-center px-4">
              <h4 className="text-sm sm:text-base font-bold font-serif-cosmic text-white tracking-wide drop-shadow-md">
                {characterName}
              </h4>
            </div>
          </div>

          {/* Bottom style indicator tag */}
          <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-mono tracking-wider flex items-center gap-1 z-10 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
            <span>Aura:</span>
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: favoriteColor }}
            />
            <span className="capitalize">{visualStyle}</span>
          </div>
        </div>
      ) : (
        /* Detailed Visual Concept Breakdown */
        <div className="p-4 space-y-3 text-xs leading-relaxed max-h-[300px] overflow-y-auto">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 font-semibold text-purple-300 mb-1">
              <Shirt className="w-3.5 h-3.5 text-purple-400" />
              <span>Konsep Busana ({visualStyle})</span>
            </div>
            <p className="text-slate-300">{visualConcept.outfit}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 font-semibold text-amber-300 mb-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Aksesori & Artefak Kosmik</span>
            </div>
            <p className="text-slate-300">{visualConcept.accessories}</p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-1.5 font-semibold text-cyan-300 mb-1">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Latar Antariksa</span>
            </div>
            <p className="text-slate-300">{visualConcept.background}</p>
          </div>
        </div>
      )}
    </div>
  );
};
