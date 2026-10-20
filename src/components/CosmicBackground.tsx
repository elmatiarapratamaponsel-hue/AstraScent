import React, { useEffect, useRef } from 'react';

interface CosmicBackgroundProps {
  accentColor?: string;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ accentColor = '#8B5CF6' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create stars
    const starCount = Math.min(Math.floor((width * height) / 4500), 160);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.3,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1,
      color: Math.random() > 0.3 ? '#ffffff' : Math.random() > 0.5 ? '#cbd5e1' : accentColor,
    }));

    // Shooting stars / meteors
    interface Meteor {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      alpha: number;
      active: boolean;
    }

    const meteors: Meteor[] = [];
    const spawnMeteor = () => {
      if (meteors.length < 2 && Math.random() < 0.02) {
        meteors.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.4),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          alpha: 1,
          active: true,
        });
      }
    };

    let time = 0;

    const render = () => {
      time += 0.01;
      ctx.clearRect(0, 0, width, height);

      // Deep space background gradient
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        100,
        width * 0.5,
        height * 0.5,
        Math.max(width, height)
      );
      bgGrad.addColorStop(0, '#0c0f2a');
      bgGrad.addColorStop(0.5, '#07091a');
      bgGrad.addColorStop(1, '#03040c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Soft nebula glow cloud based on accentColor
      const nebulaGrad = ctx.createRadialGradient(
        width * 0.3 + Math.sin(time * 0.5) * 60,
        height * 0.4 + Math.cos(time * 0.4) * 40,
        20,
        width * 0.3,
        height * 0.4,
        Math.min(width, height) * 0.65
      );
      nebulaGrad.addColorStop(0, `${accentColor}25`);
      nebulaGrad.addColorStop(0.6, `${accentColor}08`);
      nebulaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // Secondary cosmic glow
      const nebulaGrad2 = ctx.createRadialGradient(
        width * 0.75 - Math.cos(time * 0.3) * 50,
        height * 0.7 - Math.sin(time * 0.5) * 50,
        30,
        width * 0.75,
        height * 0.7,
        Math.min(width, height) * 0.55
      );
      nebulaGrad2.addColorStop(0, 'rgba(56, 189, 248, 0.12)');
      nebulaGrad2.addColorStop(0.5, 'rgba(147, 51, 234, 0.06)');
      nebulaGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = nebulaGrad2;
      ctx.fillRect(0, 0, width, height);

      // Draw stars
      for (const star of stars) {
        star.alpha += star.speed * star.direction;
        if (star.alpha > 0.95) {
          star.alpha = 0.95;
          star.direction = -1;
        } else if (star.alpha < 0.15) {
          star.alpha = 0.15;
          star.direction = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = star.alpha;
        ctx.fill();

        // Starlight glow for bigger stars
        if (star.radius > 1.2) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = star.color;
          ctx.globalAlpha = star.alpha * 0.25;
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;

      // Handle meteors
      spawnMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        if (!m.active) {
          meteors.splice(i, 1);
          continue;
        }

        const headX = m.x;
        const headY = m.y;
        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const meteorGrad = ctx.createLinearGradient(headX, headY, tailX, tailY);
        meteorGrad.addColorStop(0, `rgba(255, 255, 255, ${m.alpha})`);
        meteorGrad.addColorStop(0.3, `${accentColor}${Math.floor(m.alpha * 255).toString(16).padStart(2, '0')}`);
        meteorGrad.addColorStop(1, 'transparent');

        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(tailX, tailY);
        ctx.strokeStyle = meteorGrad;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.015;

        if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
          m.active = false;
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.95 }}
    />
  );
};
