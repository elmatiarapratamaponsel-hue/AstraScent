import React from 'react';
import { AstraScentResult } from '../types/astrascent';
import { Sparkles, Bookmark, Download, Trash2, Eye, ExternalLink, Heart, Gift } from 'lucide-react';
import { downloadCardImage } from '../utils/exportCardToImage';

interface FavoritesTabProps {
  favorites: AstraScentResult[];
  onSelectCard: (card: AstraScentResult) => void;
  onRemoveFavorite: (id: string) => void;
  onGoToGenerator: () => void;
}

export const FavoritesTab: React.FC<FavoritesTabProps> = ({
  favorites,
  onSelectCard,
  onRemoveFavorite,
  onGoToGenerator,
}) => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 rounded-3xl bg-slate-900/80 border-2 border-slate-700 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-2xl shadow-lg border-2 border-white/20">
            ⭐
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-serif-cosmic text-white">
              Koleksi Favorit Bintang
            </h2>
            <p className="text-xs text-slate-400">
              Tersimpan aman secara terpisah di brankas localStorage pribadi Anda ({favorites.length} kartu).
            </p>
          </div>
        </div>

        <button
          onClick={onGoToGenerator}
          className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider border-b-4 border-purple-900 active:border-b-0 active:translate-y-1 transition-all"
        >
          + Buat Persona Baru
        </button>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl bg-slate-900/40 border-2 border-dashed border-slate-700">
          <div className="text-5xl mb-3">🌌</div>
          <h3 className="text-lg font-bold text-white mb-2">
            Belum Ada Kartu Favorit yang Disimpan
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto mb-5 leading-relaxed">
            Setelah membuat persona & aroma kosmikmu, klik tombol <strong>"Simpan ke Favorit"</strong> di samping tombol download untuk menyimpannya ke koleksi abadi ini.
          </p>
          <button
            onClick={onGoToGenerator}
            className="py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            Mulai Racik Aroma Kosmik
          </button>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favorites.map((card) => {
            const rarityColors = {
              Common: 'border-slate-500 text-slate-300 bg-slate-800',
              Rare: 'border-purple-400 text-purple-200 bg-purple-950',
              Legendary: 'border-amber-400 text-amber-200 bg-amber-950 animate-pulse',
            }[card.persona.rarity] || 'border-purple-400 text-purple-200 bg-purple-950';

            return (
              <div
                key={card.id}
                className="relative p-5 rounded-3xl bg-slate-900/90 border-2 border-slate-700 hover:border-purple-400 transition-all shadow-xl group overflow-hidden"
              >
                {/* Glow accent */}
                <div
                  className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[50px] pointer-events-none opacity-20"
                  style={{ backgroundColor: card.favoriteColor }}
                />

                {/* Top bar */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${rarityColors}`}
                    >
                      ★ {card.persona.rarity}
                    </span>
                    <span className="text-xs text-slate-300 font-bold px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
                      {card.zodiacInfo?.symbol || '✨'} {card.zodiac}
                    </span>
                  </div>

                  <button
                    onClick={() => onRemoveFavorite(card.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 border border-transparent hover:border-rose-500/30 transition-colors"
                    title="Hapus dari Favorit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Persona Name & Title */}
                <h3 className="text-base font-black text-white font-serif-cosmic group-hover:text-purple-300 transition-colors">
                  {card.persona.characterName}
                </h3>
                <p className="text-xs text-purple-200/80 italic mb-3">
                  "{card.persona.cosmicTitle}"
                </p>

                {/* Perfume Info */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/10 mb-4 space-y-1">
                  <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
                    <span>Parfum: {card.perfume.perfumeName}</span>
                    <span className="text-[10px] text-slate-400">{card.mood}</span>
                  </div>
                  <div className="text-[11px] text-slate-300 truncate">
                    Notes: {card.perfume.topNotes.slice(0, 2).join(', ')} • {card.perfume.baseNotes[0]}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-1 border-t border-white/10">
                  <button
                    onClick={() => onSelectCard(card)}
                    className="flex-1 py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 border-b-2 border-purple-900 active:translate-y-0.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka Kartu</span>
                  </button>

                  <button
                    onClick={() => downloadCardImage(card)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 border border-slate-600 active:translate-y-0.5"
                    title="Download Story PNG"
                  >
                    <Download className="w-3.5 h-3.5 text-amber-300" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
