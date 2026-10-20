import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, Rocket, Zap, Compass, Volume2, VolumeX, Eye, ArrowLeft, Award, Trophy } from 'lucide-react';

interface CelestialStation {
  name: string;
  scentDesc: string;
  x: number;
  y: number;
  radius: number;
  color: string;
  icon: string;
}

interface CosmicSpaceCruiseProps {
  onBack: () => void;
  onAddStardust?: (amount: number) => void;
  userStardust?: number;
}

export const CosmicSpaceCruise: React.FC<CosmicSpaceCruiseProps> = ({
  onBack,
  onAddStardust,
  userStardust = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [discoveredLocation, setDiscoveredLocation] = useState<CelestialStation | null>(null);
  const [stardustCollected, setStardustCollected] = useState(0);
  const [speedMode, setSpeedMode] = useState<'normal' | 'warp'>('normal');

  // Input states
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const mobileControl = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Celestial Destinations with Indonesian Perfume Themes
  const STATIONS: CelestialStation[] = [
    {
      name: 'Planet Cendana Nusa',
      scentDesc: 'Planet berhutan kayu cendana sakral yang memancarkan aroma oriental hangat dan menenangkan jiwa.',
      x: 350,
      y: 280,
      radius: 48,
      color: '#d97706',
      icon: '🌲',
    },
    {
      name: 'Nebula Melati Keraton',
      scentDesc: 'Gumpalan awan kosmik putih beraroma bunga melati dan sedap malam yang mekar di bawah sinar bintang.',
      x: 880,
      y: 420,
      radius: 54,
      color: '#ec4899',
      icon: '🌸',
    },
    {
      name: 'Pulsar Kopi Gayo',
      scentDesc: 'Bintang neutron berputar cepat yang menyebarkan aroma biji kopi robusta karamel dan rempah hangat.',
      x: 1350,
      y: 300,
      radius: 42,
      color: '#92400e',
      icon: '☕',
    },
    {
      name: 'Sabuk Nilam Emas',
      scentDesc: 'Kumpulan asteroid kristal beraroma daun nilam (patchouli) dan lumut kayu basah yang elegan.',
      x: 600,
      y: 750,
      radius: 46,
      color: '#10b981',
      icon: '🍃',
    },
    {
      name: 'Supernova Vanili Alor',
      scentDesc: 'Pusaran energi keemasan dengan keharuman vanili murni kepulauan yang manis dan memikat.',
      x: 1100,
      y: 800,
      radius: 52,
      color: '#eab308',
      icon: '🍦',
    },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.key === 'Shift') {
        setSpeedMode('warp');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
      if (e.key === ' ' || e.key === 'Shift') {
        setSpeedMode('normal');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 600);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Ship position & physics
    const ship = {
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      angle: 0,
      size: 26,
    };

    // Stardust collectibles in space
    const stardusts = Array.from({ length: 30 }, () => ({
      x: Math.random() * (width * 1.5),
      y: Math.random() * (height * 1.5),
      size: Math.random() * 4 + 4,
      collected: false,
      color: ['#fbbf24', '#f43f5e', '#38bdf8', '#a855f7'][Math.floor(Math.random() * 4)],
    }));

    // Starfield for parallax
    const stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 1.5 + 0.2,
      alpha: Math.random() * 0.8 + 0.2,
    }));

    let currentWarp = false;

    const gameLoop = () => {
      ctx.clearRect(0, 0, width, height);

      // Handle input controls
      let moveX = mobileControl.current.x;
      let moveY = mobileControl.current.y;

      if (keysPressed.current['arrowleft'] || keysPressed.current['a']) moveX -= 1;
      if (keysPressed.current['arrowright'] || keysPressed.current['d']) moveX += 1;
      if (keysPressed.current['arrowup'] || keysPressed.current['w']) moveY -= 1;
      if (keysPressed.current['arrowdown'] || keysPressed.current['s']) moveY += 1;

      currentWarp = keysPressed.current[' '] || keysPressed.current['shift'];

      const maxSpeed = currentWarp ? 7.5 : 4.0;
      const accel = currentWarp ? 0.6 : 0.35;

      if (moveX !== 0 || moveY !== 0) {
        ship.vx += moveX * accel;
        ship.vy += moveY * accel;
        ship.angle = Math.atan2(moveY, moveX);
      } else {
        ship.vx *= 0.94;
        ship.vy *= 0.94;
      }

      // Clamp speed
      const curSpeed = Math.sqrt(ship.vx * ship.vx + ship.vy * ship.vy);
      if (curSpeed > maxSpeed) {
        ship.vx = (ship.vx / curSpeed) * maxSpeed;
        ship.vy = (ship.vy / curSpeed) * maxSpeed;
      }

      ship.x += ship.vx;
      ship.y += ship.vy;

      // Screen wrap
      if (ship.x < -40) ship.x = width + 40;
      if (ship.x > width + 40) ship.x = -40;
      if (ship.y < -40) ship.y = height + 40;
      if (ship.y > height + 40) ship.y = -40;

      // Draw background space
      const spaceGrad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height)
      );
      spaceGrad.addColorStop(0, '#0d0d29');
      spaceGrad.addColorStop(0.7, '#070719');
      spaceGrad.addColorStop(1, '#02030a');
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw stars (with warp streak effect when boosting)
      for (const star of stars) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = star.alpha;
        if (currentWarp) {
          // Warp streaks!
          ctx.beginPath();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = star.size * 1.5;
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.x - ship.vx * 3.5, star.y - ship.vy * 3.5);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      // Draw Celestial Stations / Planets
      for (const st of STATIONS) {
        // Distance check for discovery dialog
        const dx = ship.x - st.x;
        const dy = ship.y - st.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Planet Atmosphere Aura
        const auraGrad = ctx.createRadialGradient(st.x, st.y, st.radius * 0.7, st.x, st.y, st.radius * 1.6);
        auraGrad.addColorStop(0, `${st.color}90`);
        auraGrad.addColorStop(0.5, `${st.color}30`);
        auraGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.radius * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Planet Body
        ctx.fillStyle = st.color;
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Station Icon
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(st.icon, st.x, st.y);

        // Station Name Label (Roblox blocky badge)
        ctx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
        const textW = ctx.measureText(st.name).width;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.roundRect(st.x - textW / 2 - 8, st.y + st.radius + 6, textW + 16, 22, 6);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(st.name, st.x, st.y + st.radius + 17);

        // If player enters station orbit
        if (dist < st.radius + 40) {
          setDiscoveredLocation(st);
        }
      }

      // Draw and Collect Stardust
      for (const dust of stardusts) {
        if (dust.collected) continue;

        const ddx = ship.x - dust.x;
        const ddy = ship.y - dust.y;
        const dist = Math.sqrt(ddx * ddx + ddy * ddy);

        // Collect
        if (dist < ship.size + dust.size) {
          dust.collected = true;
          setStardustCollected((prev) => {
            const next = prev + 1;
            if (onAddStardust) onAddStardust(10);
            return next;
          });
          continue;
        }

        // Draw spinning star
        ctx.fillStyle = dust.color;
        ctx.beginPath();
        ctx.arc(dust.x, dust.y, dust.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // DRAW ROBLOX-STYLE SPACESHIP (Blocky Voxel Astro Rocket)
      ctx.save();
      ctx.translate(ship.x, ship.y);
      ctx.rotate(ship.angle + Math.PI / 2);

      // Rocket Thruster Flame (animated)
      if (curSpeed > 0.5) {
        const flameLength = currentWarp ? 32 + Math.random() * 15 : 18 + Math.random() * 8;
        ctx.fillStyle = currentWarp ? '#38bdf8' : '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-7, 14);
        ctx.lineTo(7, 14);
        ctx.lineTo(0, 14 + flameLength);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(-3, 14);
        ctx.lineTo(3, 14);
        ctx.lineTo(0, 14 + flameLength * 0.6);
        ctx.closePath();
        ctx.fill();
      }

      // Roblox Rocket Body (Chunky blocky style)
      // Wings
      ctx.fillStyle = '#dc2626'; // Roblox Red Wing
      ctx.fillRect(-16, 2, 8, 12);
      ctx.fillRect(8, 2, 8, 12);

      // Main Fuselage (White Block)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-8, -14, 16, 26);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(-8, -14, 16, 26);

      // Cockpit Glass (Cyan Blue Screen)
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(-5, -9, 10, 8);
      ctx.strokeStyle = '#083344';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-5, -9, 10, 8);

      // Nosecone
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(-8, -14);
      ctx.lineTo(8, -14);
      ctx.lineTo(0, -24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-4 border-slate-700 bg-slate-950 shadow-2xl">
      {/* Top HUD (Roblox Game Style) */}
      <div className="absolute top-0 inset-x-0 p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md border-b-2 border-slate-700 z-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border-2 border-slate-600 active:translate-y-0.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Kartu</span>
          </button>

          <div className="hidden sm:flex items-center gap-1 px-3 py-1 rounded-xl bg-purple-950 border border-purple-500/40 text-xs font-bold text-purple-200">
            <Compass className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span>Jelajah Angkasa Roblox AstraBlox</span>
          </div>
        </div>

        {/* In-game Coins / Stats */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-950/70 border-2 border-amber-500/60 text-amber-300 text-xs font-black">
            <span>⭐</span>
            <span>+{stardustCollected * 10} Stardust</span>
          </div>

          <div className="px-2.5 py-1 rounded-xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 text-[11px] font-mono font-bold">
            WARP: {speedMode === 'warp' ? 'ON ⚡' : 'OFF'}
          </div>
        </div>
      </div>

      {/* Main Canvas Space Flight */}
      <div className="relative w-full h-[520px] sm:h-[600px]">
        <canvas ref={canvasRef} className="w-full h-full block cursor-crosshair" />

        {/* Discovered Planet Popup Card */}
        {discoveredLocation && (
          <div className="absolute top-16 inset-x-4 max-w-sm mx-auto p-4 rounded-2xl bg-slate-900/95 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.3)] backdrop-blur-lg z-30 animate-fade-in">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{discoveredLocation.icon}</span>
                <h4 className="text-sm font-black text-white">{discoveredLocation.name}</h4>
              </div>
              <button
                onClick={() => setDiscoveredLocation(null)}
                className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-amber-100/90 leading-relaxed">
              {discoveredLocation.scentDesc}
            </p>
            <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Aroma Terdeteksi: Nusantara Accord</span>
              <span className="text-emerald-400 font-bold">✓ Terdaftar di Scanner</span>
            </div>
          </div>
        )}

        {/* Bottom Mobile On-Screen Controls */}
        <div className="absolute bottom-4 inset-x-4 z-20 flex items-end justify-between pointer-events-none">
          {/* Instructions Desktop */}
          <div className="hidden sm:block p-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-[11px] text-slate-300 font-mono pointer-events-auto">
            <div>🎮 Kontrol: <strong>Panah / WASD</strong> untuk Kemudi</div>
            <div>⚡ <strong>Spasi / Shift</strong> untuk Hyper-Warp Speed!</div>
          </div>

          {/* Mobile Joystick Pad */}
          <div className="flex sm:hidden gap-2 pointer-events-auto">
            <div className="grid grid-cols-3 gap-1 bg-slate-900/80 p-2 rounded-2xl border border-slate-700">
              <div />
              <button
                onTouchStart={() => (mobileControl.current.y = -1)}
                onTouchEnd={() => (mobileControl.current.y = 0)}
                className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-600 text-white font-black flex items-center justify-center active:bg-purple-600"
              >
                ▲
              </button>
              <div />
              <button
                onTouchStart={() => (mobileControl.current.x = -1)}
                onTouchEnd={() => (mobileControl.current.x = 0)}
                className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-600 text-white font-black flex items-center justify-center active:bg-purple-600"
              >
                ◀
              </button>
              <div />
              <button
                onTouchStart={() => (mobileControl.current.x = 1)}
                onTouchEnd={() => (mobileControl.current.x = 0)}
                className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-600 text-white font-black flex items-center justify-center active:bg-purple-600"
              >
                ▶
              </button>
              <div />
              <button
                onTouchStart={() => (mobileControl.current.y = 1)}
                onTouchEnd={() => (mobileControl.current.y = 0)}
                className="w-10 h-10 rounded-xl bg-slate-800 border-2 border-slate-600 text-white font-black flex items-center justify-center active:bg-purple-600"
              >
                ▼
              </button>
              <div />
            </div>
          </div>

          {/* Boost Warp Button for Mobile */}
          <button
            onTouchStart={() => {
              keysPressed.current[' '] = true;
              setSpeedMode('warp');
            }}
            onTouchEnd={() => {
              keysPressed.current[' '] = false;
              setSpeedMode('normal');
            }}
            className="pointer-events-auto px-4 py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs uppercase tracking-wider border-b-4 border-cyan-900 active:border-b-0 active:translate-y-1 shadow-lg flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>WARP BOOST</span>
          </button>
        </div>
      </div>
    </div>
  );
};
