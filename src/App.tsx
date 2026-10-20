import React, { useState, useRef, useEffect } from 'react';
import { 
  AstraScentInput, 
  AstraScentResult, 
  Mood,
  UserProfile
} from './types/astrascent';
import { ZODIAC_LIST } from './data/zodiacData';
import { CosmicBackground } from './components/CosmicBackground';
import { AstraScentForm } from './components/AstraScentForm';
import { CosmicCard } from './components/CosmicCard';
import { StarConvergenceAnimation } from './components/StarConvergenceAnimation';
import { QuickMoodModal } from './components/QuickMoodModal';
import { LoginModal, BLOX_AVATARS } from './components/LoginModal';
import { CosmicSpaceCruise } from './components/CosmicSpaceCruise';
import { FavoritesTab } from './components/FavoritesTab';
import { downloadCardImage, shareCardImage } from './utils/exportCardToImage';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Download, 
  Share2, 
  RefreshCw, 
  RotateCcw, 
  Bookmark, 
  Star, 
  Compass, 
  Rocket, 
  User, 
  Award,
  Layers,
  Heart
} from 'lucide-react';

export default function App() {
  const [formData, setFormData] = useState<AstraScentInput>({
    nickname: '',
    zodiac: 'Aries',
    favoriteColor: '#8B5CF6',
    visualStyle: 'Fantasy',
    mood: 'Tenang',
    favoriteScents: ['Woody', 'Floral'],
  });

  const [currentResult, setCurrentResult] = useState<AstraScentResult | null>(null);
  const [history, setHistory] = useState<AstraScentResult[]>([]);
  const [favorites, setFavorites] = useState<AstraScentResult[]>([]);
  const [activeTab, setActiveTab] = useState<'generator' | 'favorites' | 'spaceCruise'>('generator');
  
  // Auth & Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isConverging, setIsConverging] = useState(false);
  const [isQuickMoodOpen, setIsQuickMoodOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  // Load history, favorites, and user from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('astrascent_history');
      if (savedHistory) setHistory(JSON.parse(savedHistory));

      const savedFavorites = localStorage.getItem('astrascent_favorites');
      if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

      const savedUser = localStorage.getItem('astrascent_user');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
    } catch (e) {
      console.warn('Failed to load localStorage:', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogin = (user: UserProfile) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('astrascent_user', JSON.stringify(user));
    } catch (e) {
      console.warn('Failed to save user:', e);
    }
    showToast(`Selamat datang di AstraBlox, ${user.displayName}!`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('astrascent_user');
    showToast('Berhasil logout dari akun penjelajah.');
  };

  const handleAddStardust = (amount: number) => {
    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        stardust: (currentUser.stardust || 0) + amount,
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('astrascent_user', JSON.stringify(updatedUser));
    }
  };

  const handleToggleFavorite = () => {
    if (!currentResult) return;

    const isAlreadyFav = favorites.some((f) => f.id === currentResult.id);

    if (isAlreadyFav) {
      const updated = favorites.filter((f) => f.id !== currentResult.id);
      setFavorites(updated);
      localStorage.setItem('astrascent_favorites', JSON.stringify(updated));
      showToast('Kartu dihapus dari daftar Favorit.');
    } else {
      const updatedCard = { ...currentResult, isFavorite: true };
      const updated = [updatedCard, ...favorites];
      setFavorites(updated);
      localStorage.setItem('astrascent_favorites', JSON.stringify(updated));

      // Reward player with Stardust for saving!
      handleAddStardust(50);

      // Star explosion confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#fbbf24', '#f59e0b', '#ffffff'],
      });

      showToast('⭐ Kartu berhasil disimpan ke Favorit! (+50 Stardust)');
    }
  };

  const handleRemoveFavorite = (id: string) => {
    const updated = favorites.filter((f) => f.id !== id);
    setFavorites(updated);
    localStorage.setItem('astrascent_favorites', JSON.stringify(updated));
    showToast('Kartu dihapus dari Favorit.');
  };

  const handleGenerate = async (input: AstraScentInput) => {
    setFormData(input);
    setIsLoading(true);
    setIsConverging(true);

    const startTime = Date.now();

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        throw new Error('Gagal meracik aroma kosmik');
      }

      const generatedData = await response.json();

      // Ensure minimum 2.4s convergence animation
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 2400 - elapsed);

      setTimeout(() => {
        const zodiacInfo = ZODIAC_LIST.find((z) => z.name === input.zodiac);

        const newResult: AstraScentResult = {
          id: `astrascent-${Date.now()}`,
          nickname: input.nickname,
          zodiac: input.zodiac,
          zodiacInfo,
          favoriteColor: input.favoriteColor,
          visualStyle: input.visualStyle,
          mood: input.mood,
          favoriteScents: input.favoriteScents,
          persona: generatedData.persona,
          perfume: generatedData.perfume,
          timestamp: new Date().toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
        };

        setCurrentResult(newResult);
        setActiveTab('generator');
        setIsConverging(false);
        setIsLoading(false);

        // Add stardust reward for generating persona
        handleAddStardust(30);

        // Save to regular history (max 8)
        setHistory((prev) => {
          const updated = [newResult, ...prev.slice(0, 7)];
          try {
            localStorage.setItem('astrascent_history', JSON.stringify(updated));
          } catch (e) {
            console.warn('LocalStorage save error:', e);
          }
          return updated;
        });

        // Trigger celebratory confetti
        setTimeout(() => {
          confetti({
            particleCount: newResult.persona.rarity === 'Legendary' ? 120 : 60,
            spread: 80,
            origin: { y: 0.6 },
            colors: [
              input.favoriteColor,
              '#fbbf24',
              '#ffffff',
              '#a855f7',
              '#38bdf8',
            ],
          });
        }, 300);

        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, remainingTime);
    } catch (err) {
      console.error('Generation error:', err);
      setIsConverging(false);
      setIsLoading(false);
      showToast('Gagal memproses. Silakan periksa koneksi dan coba lagi.');
    }
  };

  const handleQuickMoodChange = async (newMood: Mood) => {
    if (!currentResult) return;
    setIsQuickMoodOpen(false);

    const updatedInput: AstraScentInput = {
      nickname: currentResult.nickname,
      zodiac: currentResult.zodiac,
      favoriteColor: currentResult.favoriteColor,
      visualStyle: currentResult.visualStyle,
      mood: newMood,
      favoriteScents: currentResult.favoriteScents,
    };

    await handleGenerate(updatedInput);
    showToast(`Suasana hati diperbarui menjadi ${newMood}!`);
  };

  const handleDownload = async () => {
    if (!currentResult) return;
    try {
      setIsDownloading(true);
      showToast('Menyiapkan gambar kartu Instagram Story...');
      await downloadCardImage(currentResult);
      showToast('Kartu berhasil diunduh dalam format Instagram Story!');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Gagal mengunduh kartu. Silakan coba kembali.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    if (!currentResult) return;
    try {
      const result = await shareCardImage(currentResult);
      if (result.method === 'clipboard') {
        showToast('Teks persona & aroma kosmik berhasil disalin ke clipboard!');
      } else if (result.success) {
        showToast('Berhasil membuka menu berbagi!');
      }
    } catch (err) {
      console.error('Share error:', err);
      showToast('Gagal membagikan kartu.');
    }
  };

  const activeColor = currentResult?.favoriteColor || formData.favoriteColor;
  const isCurrentFav = currentResult ? favorites.some((f) => f.id === currentResult.id) : false;

  return (
    <div className="min-h-screen text-slate-100 relative selection:bg-purple-500/30 selection:text-purple-200">
      {/* Dynamic Cosmic Background */}
      <CosmicBackground accentColor={activeColor} />

      {/* Star Convergence Animation Overlay */}
      {isConverging && (
        <StarConvergenceAnimation
          nickname={formData.nickname}
          zodiac={formData.zodiac}
          visualStyle={formData.visualStyle}
          favoriteColor={formData.favoriteColor}
        />
      )}

      {/* ROBLOX-STYLE TOP BAR (HUD) */}
      <nav className="sticky top-0 z-40 bg-[#090b1c]/90 backdrop-blur-md border-b-2 border-slate-700/80 px-4 py-2.5 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Logo & Blox Tag */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 flex items-center justify-center font-black text-white text-base shadow-md border-2 border-white/20">
              A
            </div>
            <div>
              <span className="font-serif-cosmic font-black text-sm sm:text-base tracking-wider text-white block leading-tight">
                AstraScent
              </span>
              <span className="text-[10px] font-bold text-amber-400 block font-mono">
                ROBLOX EDITION 🚀
              </span>
            </div>
          </div>

          {/* User Profile / Login Button */}
          <div className="flex items-center gap-2">
            {currentUser ? (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-900 border-2 border-slate-700 hover:border-purple-400 active:translate-y-0.5 transition-all"
              >
                <div className="w-7 h-7 rounded-xl bg-purple-600 flex items-center justify-center text-base border border-white/20">
                  {BLOX_AVATARS.find((a) => a.id === currentUser.avatarBlox)?.emoji || '🧑‍🚀'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-black text-white block leading-none">
                    {currentUser.displayName}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold">
                    ⭐ {currentUser.stardust} Stardust
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider border-b-4 border-purple-900 active:border-b-0 active:translate-y-1 transition-all shadow-md"
              >
                <User className="w-3.5 h-3.5" />
                <span>Login Penjelajah</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 sm:py-10">
        {/* NAVIGATION TABS (GENERATOR, FAVORIT, JELAJAH ANGKASA ROBLOX) */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
          <button
            onClick={() => setActiveTab('generator')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all border-b-4 ${
              activeTab === 'generator'
                ? 'bg-purple-600 text-white border-purple-900 shadow-[0_4px_15px_rgba(147,51,234,0.4)]'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
            } active:border-b-0 active:translate-y-1`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Persona & Parfum</span>
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all border-b-4 ${
              activeTab === 'favorites'
                ? 'bg-amber-600 text-white border-amber-900 shadow-[0_4px_15px_rgba(217,119,6,0.4)]'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
            } active:border-b-0 active:translate-y-1`}
          >
            <Star className="w-4 h-4 text-amber-300" />
            <span>Koleksi Favorit</span>
            {favorites.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-black">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('spaceCruise')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all border-b-4 ${
              activeTab === 'spaceCruise'
                ? 'bg-cyan-600 text-white border-cyan-900 shadow-[0_4px_15px_rgba(8,145,178,0.4)]'
                : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800'
            } active:border-b-0 active:translate-y-1`}
          >
            <Rocket className="w-4 h-4 text-amber-300" />
            <span>Jelajah Angkasa</span>
          </button>
        </div>

        {/* TAB 1: SPACE CRUISE (BERKELILING ANGKASA ROBLOX) */}
        {activeTab === 'spaceCruise' && (
          <div className="animate-fade-in">
            <CosmicSpaceCruise
              onBack={() => setActiveTab('generator')}
              onAddStardust={handleAddStardust}
              userStardust={currentUser?.stardust || 0}
            />
          </div>
        )}

        {/* TAB 2: FAVORITES TAB */}
        {activeTab === 'favorites' && (
          <div className="animate-fade-in">
            <FavoritesTab
              favorites={favorites}
              onSelectCard={(card) => {
                setCurrentResult(card);
                setActiveTab('generator');
              }}
              onRemoveFavorite={handleRemoveFavorite}
              onGoToGenerator={() => setActiveTab('generator')}
            />
          </div>
        )}

        {/* TAB 3: GENERATOR & CARD VIEW */}
        {activeTab === 'generator' && (
          <>
            {currentResult ? (
              <div className="space-y-6 animate-fade-in">
                {/* Top Return Banner */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel max-w-[440px] mx-auto border border-white/10">
                  <button
                    onClick={() => setCurrentResult(null)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ubah Data / Buat Baru</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('spaceCruise')}
                    className="flex items-center gap-1 text-[11px] font-bold text-cyan-300 hover:text-cyan-200"
                  >
                    <Rocket className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Keliling Angkasa ➔</span>
                  </button>
                </div>

                {/* The Instagram Story Profile Card */}
                <div className="flex justify-center">
                  <CosmicCard ref={cardRef} data={currentResult} />
                </div>

                {/* ACTION BUTTONS (MANDATORY REQUIREMENT) */}
                {/* "Tambahkan tombol 'Simpan ke Favorit' di samping tombol download" */}
                <div className="max-w-[440px] mx-auto space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    {/* 1. Download Button */}
                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={handleDownload}
                      className="flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wide text-white transition-all border-b-4 border-purple-950 active:border-b-0 active:translate-y-1 disabled:opacity-50 shadow-lg"
                      style={{
                        background: `linear-gradient(135deg, ${activeColor}, #9333ea)`,
                        boxShadow: `0 0 25px ${activeColor}50`,
                      }}
                    >
                      <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                      <span>{isDownloading ? 'Mengunduh...' : 'Download Kartu'}</span>
                    </button>

                    {/* 2. Simpan ke Favorit Button (Right beside Download Button!) */}
                    <button
                      type="button"
                      onClick={handleToggleFavorite}
                      className={`flex items-center justify-center gap-2 py-3.5 px-3 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wide transition-all border-b-4 active:border-b-0 active:translate-y-1 shadow-lg ${
                        isCurrentFav
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 border-amber-800'
                          : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-slate-700'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${isCurrentFav ? 'fill-slate-950' : 'text-amber-400'}`} />
                      <span>{isCurrentFav ? 'Tersimpan ★' : 'Simpan ke Favorit'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* 3. Share Button */}
                    <button
                      type="button"
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-xs uppercase tracking-wider text-white bg-slate-900 border-2 border-slate-700 hover:bg-slate-800 border-b-4 border-b-slate-950 active:border-b-0 active:translate-y-1 transition-all"
                    >
                      <Share2 className="w-4 h-4 text-purple-300" />
                      <span>Bagikan</span>
                    </button>

                    {/* 4. Quick Mood Switcher Button */}
                    <button
                      type="button"
                      onClick={() => setIsQuickMoodOpen(true)}
                      className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl font-black text-xs uppercase tracking-wider text-purple-200 bg-purple-950/60 border-2 border-purple-500/40 hover:bg-purple-900 border-b-4 border-b-purple-950 active:border-b-0 active:translate-y-1 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-amber-300" />
                      <span>Ganti Mood</span>
                    </button>
                  </div>

                  {/* 5. Space Cruise Button from Card */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('spaceCruise')}
                    className="w-full py-3.5 px-4 rounded-2xl font-black text-xs uppercase tracking-wider text-cyan-200 bg-cyan-950/70 border-2 border-cyan-400/50 hover:bg-cyan-900 border-b-4 border-b-cyan-950 active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Rocket className="w-4 h-4 text-amber-300 animate-bounce" />
                    <span>🚀 Ajak Personamu Berkeliling Angkasa Roblox!</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Form View */
              <div>
                <header className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/60 border border-purple-400/30 text-xs text-purple-200 font-medium mb-3 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                    <span className="font-serif-cosmic tracking-wider uppercase text-[11px]">
                      Temukan aroma dari bintangmu
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold font-serif-cosmic text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-200 tracking-tight drop-shadow-sm">
                    AstraScent
                  </h1>
                  <p className="text-sm sm:text-base text-slate-400 font-medium mt-1">
                    Avatar & Aroma Alam Semestamu
                  </p>
                </header>

                <AstraScentForm
                  onSubmit={handleGenerate}
                  isLoading={isLoading}
                  initialValues={formData}
                />
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-center gap-2 text-amber-300/80 font-serif-cosmic text-xs">
            <span>✧</span>
            <span>AstraScent Blox Edition</span>
            <span>✧</span>
          </div>
          <p>
            Menjelajah semesta zodiak, wewangian kepulauan Nusantara, dan petualangan angkasa.
          </p>
        </footer>
      </div>

      {/* Quick Mood Modal */}
      {currentResult && (
        <QuickMoodModal
          currentMood={currentResult.mood}
          isOpen={isQuickMoodOpen}
          onClose={() => setIsQuickMoodOpen(false)}
          onSelectMood={handleQuickMoodChange}
          isLoading={isLoading}
          favoriteColor={currentResult.favoriteColor}
        />
      )}

      {/* Roblox Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        favoriteColor={activeColor}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 inset-x-4 max-w-sm mx-auto z-50 flex items-center gap-2 p-3.5 rounded-2xl bg-slate-900/95 border-2 border-amber-400 text-xs text-amber-100 shadow-2xl backdrop-blur-xl animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
          <span className="flex-1 font-bold">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
