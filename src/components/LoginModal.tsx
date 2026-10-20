import React, { useState } from 'react';
import { UserProfile } from '../types/astrascent';
import { Sparkles, User, Shield, Lock, X, LogIn, UserPlus, Check, Award, Rocket } from 'lucide-react';

export const BLOX_AVATARS = [
  { id: 'astro-blox', name: 'AstroBlox', emoji: '🧑‍🚀', bg: 'bg-blue-600' },
  { id: 'cyber-blox', name: 'CyberBlox', emoji: '🤖', bg: 'bg-emerald-600' },
  { id: 'cosmic-queen', name: 'Cosmic Queen', emoji: '👸', bg: 'bg-purple-600' },
  { id: 'star-knight', name: 'Star Knight', emoji: '⚔️', bg: 'bg-amber-600' },
  { id: 'galaxy-cat', name: 'Galaxy Cat', emoji: '🐱', bg: 'bg-pink-600' },
  { id: 'alien-blox', name: 'Alien Blox', emoji: '👽', bg: 'bg-cyan-600' },
];

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
  favoriteColor?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  favoriteColor = '#8B5CF6',
}) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(BLOX_AVATARS[0].id);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Nama Penjelajah Roblox wajib diisi!');
      return;
    }

    const trimmedUser = username.trim();
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      username: trimmedUser.toLowerCase().replace(/\s+/g, '_'),
      displayName: trimmedUser,
      avatarBlox: selectedAvatar,
      explorerLevel: 5,
      stardust: 250,
      joinedAt: new Date().toLocaleDateString('id-ID'),
    };

    onLogin(newUser);
    onClose();
  };

  const handleQuickGuest = () => {
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const guestUser: UserProfile = {
      id: `guest-${Date.now()}`,
      username: `AstroPlayer_${randomNum}`,
      displayName: `BloxExplorer #${randomNum}`,
      avatarBlox: BLOX_AVATARS[Math.floor(Math.random() * BLOX_AVATARS.length)].id,
      explorerLevel: 1,
      stardust: 100,
      joinedAt: new Date().toLocaleDateString('id-ID'),
    };

    onLogin(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#0f1124] border-4 border-slate-700 shadow-[0_10px_35px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Roblox Blocky Top Accent */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-500 via-amber-400 via-emerald-400 to-blue-500" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors border-2 border-slate-600 active:translate-y-0.5"
        >
          <X className="w-5 h-5" />
        </button>

        {currentUser ? (
          /* Logged In View */
          <div className="text-center pt-2">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 border-4 border-white/30 flex items-center justify-center text-4xl shadow-lg mb-3">
              {BLOX_AVATARS.find((a) => a.id === currentUser.avatarBlox)?.emoji || '🧑‍🚀'}
            </div>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/20 border-2 border-amber-500/50 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>Level {currentUser.explorerLevel} Blox Explorer</span>
            </div>

            <h3 className="text-2xl font-black text-white tracking-wide">
              {currentUser.displayName}
            </h3>
            <p className="text-xs text-slate-400 font-mono">@{currentUser.username}</p>

            {/* In-game stats */}
            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="p-3 rounded-2xl bg-slate-900 border-2 border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Stardust Coin</span>
                <span className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
                  ⭐ {currentUser.stardust}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border-2 border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Status Akun</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center justify-center gap-1 mt-1">
                  <Check className="w-3.5 h-3.5" /> Aktif
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider border-b-4 border-purple-900 active:border-b-0 active:translate-y-1 transition-all"
              >
                Kembali ke Game
              </button>
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-rose-950 text-rose-300 font-bold text-xs border-2 border-slate-700 active:translate-y-0.5 transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          /* Login / Register Form */
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-xs border-2 border-white/20">
                R
              </div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                AstraBlox Login
              </h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Masuk untuk menyimpan kartu parfum favorit & mengumpulkan Stardust antariksa.
            </p>

            {/* Toggle Mode */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-4">
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                  !isRegister ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Login Penjelajah
              </button>
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className={`py-1.5 rounded-lg text-xs font-black transition-all ${
                  isRegister ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daftar Baru
              </button>
            </div>

            {/* Avatar Selector if Register */}
            {isRegister && (
              <div className="mb-4">
                <label className="text-[11px] font-bold text-slate-300 block mb-2">
                  Pilih Avatar Karakter Blox:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {BLOX_AVATARS.map((av) => (
                    <button
                      type="button"
                      key={av.id}
                      onClick={() => setSelectedAvatar(av.id)}
                      className={`h-11 rounded-xl flex items-center justify-center text-xl transition-all border-2 ${
                        selectedAvatar === av.id
                          ? 'border-amber-400 bg-amber-500/20 scale-105 shadow-md'
                          : 'border-slate-800 bg-slate-900 hover:border-slate-700'
                      }`}
                      title={av.name}
                    >
                      {av.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Nama Penjelajah (Username):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError('');
                    }}
                    placeholder="e.g. GalaxyRanger_99"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border-2 border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Passcode Kosmik:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border-2 border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-purple-400"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-rose-400 font-bold">{error}</p>}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider border-b-4 border-emerald-900 active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>{isRegister ? 'Buat Akun Blox & Mulai' : 'Masuk ke Alam Semesta'}</span>
              </button>
            </form>

            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0f1124] px-2 text-[10px] text-slate-500 uppercase font-bold">
                Atau
              </span>
            </div>

            {/* Quick Guest Button */}
            <button
              type="button"
              onClick={handleQuickGuest}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border-2 border-slate-600 active:translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-3.5 h-3.5 text-amber-400" />
              <span>Masuk Sebagai Tamu Cepat (Guest)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
