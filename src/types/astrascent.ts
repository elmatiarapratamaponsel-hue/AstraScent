export type VisualAesthetic = 'Cyberpunk' | 'Fantasy' | 'Royal Galaxy';

export type Mood = 'Tenang' | 'Percaya Diri' | 'Romantis' | 'Enerjik' | 'Misterius';

export type ScentProfile = 'Floral' | 'Fresh' | 'Woody' | 'Vanilla' | 'Citrus' | 'Musk';

export type Rarity = 'Common' | 'Rare' | 'Legendary';

export interface ZodiacInfo {
  id: string;
  name: string;
  latinName: string;
  symbol: string;
  glyph: string;
  element: 'Api' | 'Air' | 'Udara' | 'Tanah';
  dates: string;
  rulingPlanet: string;
  cosmicKeyword: string;
}

export interface CosmicPersona {
  characterName: string;
  cosmicTitle: string;
  rarity: Rarity;
  description: string;
  specialPower: string;
  originPlanet: string;
  element: string;
  visualConcept: {
    outfit: string;
    accessories: string;
    background: string;
  };
  avatarFeatures?: {
    crownOrHeadpiece: string;
    auraTone: string;
    signatureRune: string;
  };
}

export interface CosmicPerfume {
  perfumeName: string;
  scentCategory: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  matchReason: string;
  nusantaraHeritage: string;
  similarRecommendations: string[];
  giftIdea: string;
}

export interface AstraScentInput {
  nickname: string;
  zodiac: string;
  favoriteColor: string;
  visualStyle: VisualAesthetic;
  mood: Mood;
  favoriteScents: ScentProfile[];
}

export interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatarBlox: string; // e.g. 'classic-blox' | 'astro-cat' | 'neon-bot' | 'cosmic-king'
  explorerLevel: number;
  stardust: number;
  joinedAt: string;
}

export interface AstraScentResult {
  id: string;
  nickname: string;
  zodiac: string;
  zodiacInfo?: ZodiacInfo;
  favoriteColor: string;
  visualStyle: VisualAesthetic;
  mood: Mood;
  favoriteScents: ScentProfile[];
  persona: CosmicPersona;
  perfume: CosmicPerfume;
  timestamp: string;
  isFavorite?: boolean;
}
