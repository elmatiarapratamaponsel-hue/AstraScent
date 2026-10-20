import React, { useEffect, useState } from 'react';
import { Sparkles, Compass } from 'lucide-react';

interface StarConvergenceProps {
  nickname: string;
  zodiac: string;
  visualStyle: string;
  favoriteColor: string;
  onAnimationComplete?: () => void;
}

const STEPS = [
  'Menyelaraskan frekuensi konstelasi bintang...',
  'Menangkap aura warna dan suasana hatimu...',
  'Menyuling sari cendana, melati, dan rempah Nusantara...',
  'Membuka portal persona & aroma kosmikmu...'
];

export const StarConvergenceAnimation: React.FC<StarConvergenceProps> = ({
  nickname,
  zodiac,
  visualStyle,
  favoriteColor,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 1100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050614]/90 backdrop-blur-xl px-4 overflow-hidden">
      {/* Dynamic Background Glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none transition-all duration-1000 animate-pulse"
        style={{
          background: `radial-gradient(circle, ${favoriteColor}40 0%, rgba(139, 92, 246, 0.2) 60%, transparent 80%)`,
        }}
      />

      {/* Orbiting rings */}
      <div className="relative w-72 h-72 sm:w-88 sm:h-88 flex items-center justify-center">
        {/* Ring 1 */}
        <div
          className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-spin"
          style={{ animationDuration: '18s' }}
        />
        {/* Ring 2 */}
        <div
          className="absolute inset-4 rounded-full border border-white/30 animate-spin"
          style={{
            animationDirection: 'reverse',
            animationDuration: '12s',
            borderColor: `${favoriteColor}60`,
          }}
        />
        {/* Ring 3 */}
        <div
          className="absolute inset-10 rounded-full border border-dotted border-white/25 animate-spin"
          style={{ animationDuration: '8s' }}
        />

        {/* Converging Star Particles */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[...Array(24)].map((_, i) => {
            const angle = (i * 360) / 24;
            const delay = (i % 6) * 0.2;
            return (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  transform: `rotate(${angle}deg) translateY(-140px)`,
                  backgroundColor: i % 2 === 0 ? favoriteColor : '#ffffff',
                  boxShadow: `0 0 10px ${favoriteColor}`,
                  animation: `converge 2.2s cubic-bezier(0.4, 0, 0.2, 1) infinite ${delay}s`,
                }}
              />
            );
          })}
        </div>

        {/* Central Core Supernova */}
        <div className="relative z-10 flex flex-col items-center justify-center p-6 rounded-full bg-slate-950/80 border border-white/20 shadow-2xl backdrop-blur-md">
          <div
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${favoriteColor} 0%, rgba(15, 23, 42, 0.9) 75%)`,
              boxShadow: `0 0 45px ${favoriteColor}80`,
            }}
          >
            <Sparkles className="w-12 h-12 text-white animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-slate-900 border border-white/20 text-[11px] font-semibold text-purple-200 tracking-wider uppercase">
            {zodiac} • {visualStyle}
          </div>
        </div>
      </div>

      {/* Text status */}
      <div className="mt-8 text-center max-w-sm z-10">
        <div className="inline-flex items-center gap-1.5 text-xs tracking-widest uppercase text-amber-300 font-semibold mb-2">
          <Compass className="w-3.5 h-3.5 animate-spin text-amber-300" />
          AstraScent Alkimia Bintang
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-serif-cosmic text-white mb-2">
          Merajut Aura {nickname}
        </h3>
        <p className="text-sm text-purple-200/80 min-h-[44px] transition-all duration-300 ease-out italic">
          "{STEPS[currentStepIndex]}"
        </p>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= currentStepIndex
                  ? 'w-6 bg-gradient-to-r from-purple-400 to-amber-300'
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes converge {
          0% {
            opacity: 0.1;
            transform: rotate(var(--angle, 0deg)) translateY(-150px) scale(0.6);
          }
          60% {
            opacity: 1;
            transform: rotate(var(--angle, 0deg)) translateY(-30px) scale(1.3);
          }
          100% {
            opacity: 0;
            transform: rotate(var(--angle, 0deg)) translateY(0px) scale(0.2);
          }
        }
      `}</style>
    </div>
  );
};
