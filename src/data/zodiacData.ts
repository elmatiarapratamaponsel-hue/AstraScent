import { ZodiacInfo, Mood, ScentProfile, VisualAesthetic } from '../types/astrascent';

export const ZODIAC_LIST: ZodiacInfo[] = [
  {
    id: 'aries',
    name: 'Aries',
    latinName: 'Aries',
    symbol: '♈',
    glyph: '♈',
    element: 'Api',
    dates: '21 Mar - 19 Apr',
    rulingPlanet: 'Mars',
    cosmicKeyword: 'Pemberani & Pelopor'
  },
  {
    id: 'taurus',
    name: 'Taurus',
    latinName: 'Taurus',
    symbol: '♉',
    glyph: '♉',
    element: 'Tanah',
    dates: '20 Apr - 20 Mei',
    rulingPlanet: 'Venus',
    cosmicKeyword: 'Teguh & Menawan'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    latinName: 'Gemini',
    symbol: '♊',
    glyph: '♊',
    element: 'Udara',
    dates: '21 Mei - 20 Jun',
    rulingPlanet: 'Merkurius',
    cosmicKeyword: 'Cerdas & Berkilau'
  },
  {
    id: 'cancer',
    name: 'Cancer',
    latinName: 'Cancer',
    symbol: '♋',
    glyph: '♋',
    element: 'Air',
    dates: '21 Jun - 22 Jul',
    rulingPlanet: 'Bulan',
    cosmicKeyword: 'Intuitif & Penuh Kasih'
  },
  {
    id: 'leo',
    name: 'Leo',
    latinName: 'Leo',
    symbol: '♌',
    glyph: '♌',
    element: 'Api',
    dates: '23 Jul - 22 Agu',
    rulingPlanet: 'Matahari',
    cosmicKeyword: 'Megah & Bercahaya'
  },
  {
    id: 'virgo',
    name: 'Virgo',
    latinName: 'Virgo',
    symbol: '♍',
    glyph: '♍',
    element: 'Tanah',
    dates: '23 Agu - 22 Sep',
    rulingPlanet: 'Merkurius',
    cosmicKeyword: 'Murni & Harmonis'
  },
  {
    id: 'libra',
    name: 'Libra',
    latinName: 'Libra',
    symbol: '♎',
    glyph: '♎',
    element: 'Udara',
    dates: '23 Sep - 22 Okt',
    rulingPlanet: 'Venus',
    cosmicKeyword: 'Anggun & Seimbang'
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    latinName: 'Scorpio',
    symbol: '♏',
    glyph: '♏',
    element: 'Air',
    dates: '23 Okt - 21 Nov',
    rulingPlanet: 'Pluto & Mars',
    cosmicKeyword: 'Mendalam & Memikat'
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    latinName: 'Sagittarius',
    symbol: '♐',
    glyph: '♐',
    element: 'Api',
    dates: '22 Nov - 21 Des',
    rulingPlanet: 'Jupiter',
    cosmicKeyword: 'Petualang & Bebas'
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    latinName: 'Capricorn',
    symbol: '♑',
    glyph: '♑',
    element: 'Tanah',
    dates: '22 Des - 19 Jan',
    rulingPlanet: 'Saturnus',
    cosmicKeyword: 'Kokoh & Ambisius'
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    latinName: 'Aquarius',
    symbol: '♒',
    glyph: '♒',
    element: 'Udara',
    dates: '20 Jan - 18 Feb',
    rulingPlanet: 'Uranus',
    cosmicKeyword: 'Visioner & Luar Biasa'
  },
  {
    id: 'pisces',
    name: 'Pisces',
    latinName: 'Pisces',
    symbol: '♓',
    glyph: '♓',
    element: 'Air',
    dates: '19 Feb - 20 Mar',
    rulingPlanet: 'Neptunus',
    cosmicKeyword: 'Mistis & Puitis'
  }
];

export const VISUAL_STYLES: { id: VisualAesthetic; label: string; desc: string; icon: string; borderClass: string }[] = [
  {
    id: 'Fantasy',
    label: 'Fantasy',
    desc: 'Sentuhan etereal, rune bintang, dan kilau magis keemasan.',
    icon: '✨',
    borderClass: 'border-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
  },
  {
    id: 'Cyberpunk',
    label: 'Cyberpunk',
    desc: 'Garis neon tajam, aura hologram synthwave, dan HUD masa depan.',
    icon: '⚡',
    borderClass: 'border-cyan-400/60 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
  },
  {
    id: 'Royal Galaxy',
    label: 'Royal Galaxy',
    desc: 'Kemegahan mahkota kosmik, beludru luar angkasa, dan ornamen aristokrat.',
    icon: '👑',
    borderClass: 'border-purple-400/50 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
  }
];

export const MOODS: { id: Mood; label: string; emoji: string; desc: string }[] = [
  { id: 'Tenang', label: 'Tenang', emoji: '🌌', desc: 'Damai bak heningnya ruang antariksa' },
  { id: 'Percaya Diri', label: 'Percaya Diri', emoji: '⭐', desc: 'Bercahaya tegas bak supernova' },
  { id: 'Romantis', label: 'Romantis', emoji: '🌹', desc: 'Hangat menyentuh bak senja nebula' },
  { id: 'Enerjik', label: 'Enerjik', emoji: '⚡', desc: 'Berpijar dinamis bak komet melesat' },
  { id: 'Misterius', label: 'Misterius', emoji: '🪐', desc: 'Memikat dalam rahasia lubang hitam' }
];

export const SCENT_PROFILES: { id: ScentProfile; label: string; icon: string; nusantaraNote: string }[] = [
  { id: 'Floral', label: 'Floral', icon: '🌸', nusantaraNote: 'Melati Putih & Sedap Malam' },
  { id: 'Fresh', label: 'Fresh', icon: '🍃', nusantaraNote: 'Serai Wangi & Daun Pandan' },
  { id: 'Woody', label: 'Woody', icon: '🌲', nusantaraNote: 'Cendana NTT & Gaharu Kalimantan' },
  { id: 'Vanilla', label: 'Vanilla', icon: '🍦', nusantaraNote: 'Vanili Alami Flores' },
  { id: 'Citrus', label: 'Citrus', icon: '🍋', nusantaraNote: 'Jeruk Purut & Jeruk Bali' },
  { id: 'Musk', label: 'Musk', icon: '✨', nusantaraNote: 'Nilam Jawa (Patchouli) & Amber' }
];

export const COLOR_PRESETS = [
  { name: 'Nebula Violet', hex: '#8B5CF6' },
  { name: 'Astral Cyan', hex: '#06B6D4' },
  { name: 'Supernova Amber', hex: '#F59E0B' },
  { name: 'Cosmic Rose', hex: '#EC4899' },
  { name: 'Emerald Void', hex: '#10B981' },
  { name: 'Starlight Gold', hex: '#EAB308' },
  { name: 'Deep Crimson', hex: '#EF4444' },
  { name: 'Midnight Indigo', hex: '#6366F1' }
];
