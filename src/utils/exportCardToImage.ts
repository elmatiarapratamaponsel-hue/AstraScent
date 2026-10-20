import { AstraScentResult } from '../types/astrascent';

export async function exportCardAsImage(data: AstraScentResult): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const width = 1080;
      const height = 1920;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas context could not be created');
      }

      // Background gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (data.visualStyle === 'Cyberpunk') {
        bgGrad.addColorStop(0, '#0a0d24');
        bgGrad.addColorStop(0.5, '#050716');
        bgGrad.addColorStop(1, '#08081c');
      } else if (data.visualStyle === 'Fantasy') {
        bgGrad.addColorStop(0, '#150c26');
        bgGrad.addColorStop(0.5, '#070617');
        bgGrad.addColorStop(1, '#110720');
      } else {
        bgGrad.addColorStop(0, '#190a2e');
        bgGrad.addColorStop(0.5, '#090518');
        bgGrad.addColorStop(1, '#1b0930');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Nebula glow clouds using user's favorite color
      const glowGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.28,
        50,
        width * 0.5,
        height * 0.28,
        450
      );
      glowGrad.addColorStop(0, `${data.favoriteColor}60`);
      glowGrad.addColorStop(0.6, `${data.favoriteColor}15`);
      glowGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, width, height);

      const glowGrad2 = ctx.createRadialGradient(
        width * 0.5,
        height * 0.8,
        50,
        width * 0.5,
        height * 0.8,
        500
      );
      glowGrad2.addColorStop(0, 'rgba(147, 51, 234, 0.2)');
      glowGrad2.addColorStop(1, 'transparent');
      ctx.fillStyle = glowGrad2;
      ctx.fillRect(0, 0, width, height);

      // Stars
      for (let i = 0; i < 220; i++) {
        const sx = (Math.sin(i * 99) * 0.5 + 0.5) * width;
        const sy = (Math.cos(i * 33) * 0.5 + 0.5) * height;
        const sRadius = (i % 5 === 0) ? 2.5 : (i % 3 === 0) ? 1.8 : 1.1;
        const sAlpha = (i % 4 === 0) ? 0.9 : 0.45;

        ctx.beginPath();
        ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
        ctx.fillStyle = (i % 7 === 0) ? data.favoriteColor : '#ffffff';
        ctx.globalAlpha = sAlpha;
        ctx.fill();

        // Cross flare for large stars
        if (i % 15 === 0) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.globalAlpha = 0.35;
          ctx.beginPath();
          ctx.moveTo(sx - 8, sy);
          ctx.lineTo(sx + 8, sy);
          ctx.moveTo(sx, sy - 8);
          ctx.lineTo(sx, sy + 8);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;

      // Outer Decorative Border
      const margin = 50;
      ctx.strokeStyle = `${data.favoriteColor}70`;
      ctx.lineWidth = 3;
      ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

      // Inner thin border
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.strokeRect(margin + 12, margin + 12, width - (margin + 12) * 2, height - (margin + 12) * 2);

      // Top Header: App Branding
      ctx.textAlign = 'center';
      ctx.fillStyle = '#f1f5f9';
      ctx.font = 'bold 36px "Cinzel", serif';
      ctx.fillText('A S T R A S C E N T', width / 2, 130);

      ctx.font = 'italic 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Avatar & Aroma Alam Semestamu', width / 2, 165);

      // Rarity Pill & Zodiac
      const rarityText = `★ ${data.persona.rarity.toUpperCase()} • ${data.zodiac.toUpperCase()} ★`;
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      const textWidth = ctx.measureText(rarityText).width;
      
      const pillX = (width - textWidth) / 2 - 25;
      const pillY = 205;
      const pillW = textWidth + 50;
      const pillH = 42;

      ctx.fillStyle = data.persona.rarity === 'Legendary' 
        ? 'rgba(245, 158, 11, 0.35)' 
        : data.persona.rarity === 'Rare' 
        ? 'rgba(168, 85, 247, 0.35)' 
        : 'rgba(148, 163, 184, 0.25)';
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 21);
      ctx.fill();
      ctx.strokeStyle = data.persona.rarity === 'Legendary' ? '#f59e0b' : data.favoriteColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = data.persona.rarity === 'Legendary' ? '#fef08a' : '#ffffff';
      ctx.fillText(rarityText, width / 2, 234);

      // Avatar Celestial Orb
      const orbCenterX = width / 2;
      const orbCenterY = 440;
      const orbRadius = 140;

      // Glow around orb
      const orbGlow = ctx.createRadialGradient(orbCenterX, orbCenterY, 30, orbCenterX, orbCenterY, orbRadius + 40);
      orbGlow.addColorStop(0, `${data.favoriteColor}99`);
      orbGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = orbGlow;
      ctx.beginPath();
      ctx.arc(orbCenterX, orbCenterY, orbRadius + 40, 0, Math.PI * 2);
      ctx.fill();

      // Orb Fill
      const orbDisc = ctx.createRadialGradient(orbCenterX - 40, orbCenterY - 40, 20, orbCenterX, orbCenterY, orbRadius);
      orbDisc.addColorStop(0, data.favoriteColor);
      orbDisc.addColorStop(0.6, '#1e1b4b');
      orbDisc.addColorStop(1, '#050716');
      ctx.fillStyle = orbDisc;
      ctx.beginPath();
      ctx.arc(orbCenterX, orbCenterY, orbRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Zodiac Glyph in Orb
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 96px "Cinzel", serif';
      ctx.fillText(data.zodiacInfo?.symbol || '✨', orbCenterX, orbCenterY + 30);

      // Character Name
      ctx.font = 'bold 44px "Cinzel", serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(data.persona.characterName, width / 2, 650);

      // Cosmic Title
      ctx.font = 'italic 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#e9d5ff';
      ctx.fillText(`"${data.persona.cosmicTitle}"`, width / 2, 695);

      // Meta attributes (Planet, Element, Mood)
      const metaY = 745;
      const metaBoxW = 280;
      const metaBoxH = 65;
      const gap = 20;
      const startX = (width - (metaBoxW * 3 + gap * 2)) / 2;

      const metaItems = [
        { label: 'PLANET ASAL', value: data.persona.originPlanet.split('-')[0].trim() },
        { label: 'ELEMEN', value: data.persona.element },
        { label: 'SUASANA HATI', value: data.mood }
      ];

      metaItems.forEach((item, idx) => {
        const bx = startX + idx * (metaBoxW + gap);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.beginPath();
        ctx.roundRect(bx, metaY, metaBoxW, metaBoxH, 14);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.stroke();

        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(item.label, bx + metaBoxW / 2, metaY + 25);

        ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(item.value, bx + metaBoxW / 2, metaY + 50);
      });

      // Persona Description box
      const descY = 845;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.roundRect(110, descY, width - 220, 110, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();

      ctx.font = 'italic 20px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#e2e8f0';
      wrapText(ctx, `"${data.persona.description}"`, width / 2, descY + 45, width - 280, 28);

      // Scent Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.moveTo(150, 995);
      ctx.lineTo(width - 150, 995);
      ctx.stroke();

      // PERFUME SECTION
      ctx.font = 'bold 24px "Cinzel", serif';
      ctx.fillStyle = '#fbbf24';
      ctx.fillText('✦  P A R F U M   K O S M I K  ✦', width / 2, 1040);

      ctx.font = 'bold 36px "Cinzel", serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(data.perfume.perfumeName, width / 2, 1090);

      ctx.font = '19px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#fde68a';
      ctx.fillText(`Kategori: ${data.perfume.scentCategory}`, width / 2, 1125);

      // Notes Table
      const notesY = 1170;
      const noteBoxW = width - 220;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.beginPath();
      ctx.roundRect(110, notesY, noteBoxW, 200, 20);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();

      const drawNoteRow = (label: string, notes: string[], y: number, color: string) => {
        ctx.textAlign = 'left';
        ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = color;
        ctx.fillText(label.toUpperCase(), 145, y);

        ctx.font = '18px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(notes.join(' • '), 250, y);
      };

      drawNoteRow('TOP', data.perfume.topNotes, notesY + 50, '#67e8f9');
      drawNoteRow('HEART', data.perfume.heartNotes, notesY + 105, '#fda4af');
      drawNoteRow('BASE', data.perfume.baseNotes, notesY + 160, '#fcd34d');

      // Nusantara Heritage & Reason Box
      const nusantaraY = 1400;
      ctx.fillStyle = 'rgba(6, 78, 59, 0.25)';
      ctx.beginPath();
      ctx.roundRect(110, nusantaraY, width - 220, 140, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.3)';
      ctx.stroke();

      ctx.textAlign = 'left';
      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#6ee7b7';
      ctx.fillText('🌿 Sentuhan Warisan Nusantara & Harmoni Semesta:', 140, nusantaraY + 38);

      ctx.font = '17px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#e2e8f0';
      wrapText(ctx, `${data.perfume.nusantaraHeritage} ${data.perfume.matchReason}`, 140, nusantaraY + 70, width - 280, 26);

      // Gift Idea Box
      const giftY = 1570;
      ctx.fillStyle = 'rgba(120, 53, 15, 0.25)';
      ctx.beginPath();
      ctx.roundRect(110, giftY, width - 220, 95, 18);
      ctx.fill();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.3)';
      ctx.stroke();

      ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#fcd34d';
      ctx.fillText('🎁 Ide Hadiah Istimewa:', 140, giftY + 35);

      ctx.font = '17px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#fef3c7';
      wrapText(ctx, data.perfume.giftIdea, 140, giftY + 68, width - 280, 24);

      // Watermark Footer (MANDATORY REQUIREMENT)
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px "Cinzel", serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('AstraScent', width / 2, 1780);

      ctx.font = 'italic 18px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('Temukan aroma dari bintangmu.', width / 2, 1815);

      ctx.font = '14px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`Dibuat khusus untuk ${data.nickname} • Instagram Story Edition`, width / 2, 1850);

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas blob export failed'));
        }
      }, 'image/png');
    } catch (err) {
      reject(err);
    }
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}

export async function downloadCardImage(data: AstraScentResult) {
  const blob = await exportCardAsImage(data);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AstraScent-${data.nickname}-${data.zodiac}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function shareCardImage(data: AstraScentResult) {
  try {
    const blob = await exportCardAsImage(data);
    const file = new File([blob], `AstraScent-${data.nickname}.png`, { type: 'image/png' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `AstraScent - ${data.persona.characterName}`,
        text: `Temukan aroma dari bintangmu! Persona kosmikku: ${data.persona.characterName} dengan aroma ${data.perfume.perfumeName}.`,
        files: [file],
      });
      return { success: true, method: 'share' };
    } else if (navigator.share) {
      await navigator.share({
        title: `AstraScent - ${data.persona.characterName}`,
        text: `Temukan aroma dari bintangmu! Persona kosmikku: ${data.persona.characterName} dengan aroma ${data.perfume.perfumeName}.`,
        url: window.location.href,
      });
      return { success: true, method: 'url' };
    } else {
      // Fallback copy link to clipboard
      await navigator.clipboard.writeText(
        `AstraScent: Persona kosmik ${data.persona.characterName} (${data.persona.cosmicTitle}) • Parfum: ${data.perfume.perfumeName}. Temukan aroma dari bintangmu!`
      );
      return { success: true, method: 'clipboard' };
    }
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      console.warn('Share error fallback:', err);
    }
    return { success: false, error: err };
  }
}
