import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback generator if AI call is unavailable or fails
function generateFallbackResponse(input: {
  nickname: string;
  zodiac: string;
  favoriteColor: string;
  visualStyle: string;
  mood: string;
  favoriteScents: string[];
}) {
  const { nickname, zodiac, visualStyle, mood, favoriteScents } = input;
  
  // Random rarity with weighted chances: Legendary 20%, Rare 35%, Common 45%
  const rand = Math.random();
  const rarity = rand < 0.20 ? 'Legendary' : rand < 0.55 ? 'Rare' : 'Common';

  const nusantaraNotesPool = [
    'Kayu Cendana Nusa Tenggara',
    'Melati Putih Keraton',
    'Nilam Emas Gayo (Patchouli)',
    'Gaharu Kalimantan Pilihan',
    'Sedap Malam Pasuruan',
    'Biji Kopi Robusta Toraja',
    'Cengkeh & Kayu Manis Maluku',
    'Pandan Wangi Segar',
    'Vanili Alami Alor'
  ];

  // Tailored character names and titles
  const cosmicTitles: Record<string, string[]> = {
    Aries: ['Penakluk Api Kosmik Orion', 'Pandu Supernova Fajar', 'Sang Pelopor Nyala Astral'],
    Taurus: ['Penjaga Taman Kristal Nebula', 'Penenun Zamrud Antariksa', 'Sang Arsitek Gravitasi Kuno'],
    Gemini: ['Penjelajah Angin Eterik Cygnus', 'Utusan Bintang Kembar', 'Penutur Kisah Lintang Aurora'],
    Cancer: ['Penjaga Samudra Bintang Cassiopeia', 'Peneduh Cahaya Lunar', 'Pelindung Embun Galaksi'],
    Leo: ['Maharaja Surya Solaris Prime', 'Penguasa Mahkota Aurora', 'Sang Pembawa Lentera Emas'],
    Virgo: ['Penenun Kristal Sirius', 'Harmonisator Frekuensi Kosmik', 'Penyelaras Melodi Galaksi'],
    Libra: ['Penimbang Keseimbangan Nebula', 'Dewi Harmoni Prismatik', 'Sang Penjaga Selaras Bintang'],
    Scorpio: ['Pengelana Lubang Hitam Abadi', 'Mystic Eclipse Veil', 'Penjaga Api Rahasia Sagitarius A*'],
    Sagittarius: ['Pemanah Komet Astral', 'Pengembara Jalur Sutra Galaksi', 'Pemburu Bintang Jatuh'],
    Capricorn: ['Penguasa Menara Obsidian Kosmik', 'Pilar Waktu Saturnus', 'Panglima Kristal Waktu'],
    Aquarius: ['Pencipta Badai Plasma Aquila', 'Visioner Gelombang Pulsar', 'Penghubung Jaringan Eter'],
    Pisces: ['Penyelam Palung Nebula Andromeda', 'Penenun Mimpi Aurora', 'Pustakawan Suara Bintang']
  };

  const titles = cosmicTitles[zodiac] || ['Penjaga Nebula Senja', 'Pengelana Ruang Angkasa', 'Penenun Cahaya Astral'];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const charName = `${nickname} sang ${title}`;

  const elementsMap: Record<string, string> = {
    Aries: 'Api Kosmik Solaris',
    Taurus: 'Tanah Kristal Nebula',
    Gemini: 'Angin Plasma Cygnus',
    Cancer: 'Air Murni Bintang',
    Leo: 'Nyala Emas Supernova',
    Virgo: 'Eter Prismatik Murni',
    Libra: 'Udara Harmoni Astral',
    Scorpio: 'Kabut Gelap Kosmis',
    Sagittarius: 'Percikan Api Pulsar',
    Capricorn: 'Gravitasi Obsidian',
    Aquarius: 'Gelombang Frekuensi Eter',
    Pisces: 'Kabut Samudra Antariksa'
  };

  const planetsMap: Record<string, string> = {
    Aries: 'Aresia Prime - Gurun Api Berkilau',
    Taurus: 'Terraverde IV - Lembah Kristal Zamrud',
    Gemini: 'Castor-Pollux Orbit - Kota Terapung',
    Cancer: 'Selene Mist - Lautan Kaca Cair',
    Leo: 'Helios Nova - Istana Cahaya Surya',
    Virgo: 'Sirius Minor - Cincin Resonansi',
    Libra: 'Zephyrus Balance - Taman Mengambang',
    Scorpio: 'Nocturna Veil - Palung Magnetik',
    Sagittarius: 'Chiron Verge - Lembah Komet Melesat',
    Capricorn: 'Chronos Citadel - Tebing Kristal Kuno',
    Aquarius: 'Aetheria VII - Galaksi Kristal Biru',
    Pisces: 'Oceanis Nebula - Danau Bintang Abadi'
  };

  const powersMap: Record<string, string> = {
    Aries: 'Memancarkan gelombang kehangatan karismatik yang membakar keraguan dan menyalakan tekad bintang.',
    Taurus: 'Menumbuhkan aura kedamaian yang mengakar kuat di ruang hampa dan menstabilkan energi batin.',
    Gemini: 'Menyalurkan bisikan angin nebula yang mampu membaca getaran frekuensi hati setiap penjelajah.',
    Cancer: 'Membungkus jiwa dengan perisai cahaya bulan yang menyejukkan dan memulihkan rasa lelah kosmik.',
    Leo: 'Menerangi galaksi dengan pesona megah dan memancarkan wibawa kepemimpinan yang menghangatkan.',
    Virgo: 'Menyusun atom-atom kekacauan menjadi simfoni aroma murni yang membawa ketenangan sempurna.',
    Libra: 'Menyeimbangkan medan magnetik dan menciptakan harmoni visual serta aroma yang memikat semesta.',
    Scorpio: 'Menyelami kedalaman misteri kosmis dan menyingkap pesona tersembunyi lewat aroma intens.',
    Sagittarius: 'Membuka portal antar-bintang dengan keberanian tanpa batas dan aroma petualangan hangat.',
    Capricorn: 'Membangun fondasi keteguhan abadi dan menghadirkan kemewahan elegan yang tak lekang waktu.',
    Aquarius: 'Menciptakan terobosan baru lewat gelombang ide cemerlang dan keharuman futuristik yang unik.',
    Pisces: 'Mengalirkan ilham puitis melintasi dimensi dan menyelimuti ruang dengan kelembutan mistis.'
  };

  const scentNamesMap: Record<string, string> = {
    Aries: 'Solar Flare & Spicy Cendana',
    Taurus: 'Velvet Moss & Melati Keraton',
    Gemini: 'Breeze of Cygnus & Pandan Astral',
    Cancer: 'Moonlit Sedap Malam & White Amber',
    Leo: 'Golden Supernova & Cendana Gaharu',
    Virgo: 'Prismatic Jasmine & Royal Citrus',
    Libra: 'Harmonic Iris & Vanili Rempah',
    Scorpio: 'Nocturne Patchouli & Dark Coffee',
    Sagittarius: 'Pulsar Cardamom & Smoked Cedar',
    Capricorn: 'Obsidian Velvet & Cendana Nusa',
    Aquarius: 'Starlight Ozone & Minty Gayo',
    Pisces: 'Ethereal Melati & Ocean Mist'
  };

  const perfumeName = scentNamesMap[zodiac] || `AstraScent Nocturne ${zodiac}`;

  // Build notes with user scent profile + nusantara notes
  const topNotesList = ['Bergamot Kosmik', 'Jeruk Purut Mentari', 'Cardamom Rempah Maluku', 'Pink Pepper Nebula', 'Leci Dingin Antariksa'];
  const heartNotesList = ['Melati Keraton Segar', 'Bunga Sedap Malam Tropis', 'Iris Angkasa', 'Kayu Manis Jawa', 'Bunga Lawang Astral'];
  const baseNotesList = ['Cendana Nusa Tenggara', 'Nilam Gayo (Patchouli)', 'Vanili Madagaskar-Flores', 'Amber Emas Kosmik', 'Gaharu Mistik Kalimantan'];

  return {
    persona: {
      characterName: charName,
      cosmicTitle: title,
      rarity: rarity as 'Common' | 'Rare' | 'Legendary',
      description: `Lahir dari titik temu rasi ${zodiac} dan denyut suasana hati ${mood.toLowerCase()}, sosok ini memancarkan wibawa ${visualStyle.toLowerCase()} yang memukau. Auranya meninggalkan jejak cahaya yang tak terlupakan di setiap sudut semesta.`,
      specialPower: powersMap[zodiac] || 'Menyalurkan kekuatan keselarasan bintang dan pesona aroma kosmik.',
      originPlanet: planetsMap[zodiac] || 'Astralis Prime',
      element: elementsMap[zodiac] || 'Eter Kosmik',
      visualConcept: {
        outfit: visualStyle === 'Cyberpunk' 
          ? 'Jubah mantel berkerah tinggi dengan serat optik bercahaya neon, pelindung bahu kromatik, dan setelan nanotex berenergi.'
          : visualStyle === 'Fantasy'
          ? 'Jubah sutra melayang berhias sulaman konstelasi emas kuno, selendang kabut nebula, dan jubah velvet berlapis kristal.'
          : 'Mantel aristokrat galaksi warna beludru pekat dengan bordir benang supernova, selempang kebesaran, dan kancing meteorit.',
        accessories: visualStyle === 'Cyberpunk'
          ? 'Visor holografik transparan, sarung tangan pemancar partikel aroma, dan pendant kristal sirkuit kuantum.'
          : visualStyle === 'Fantasy'
          ? 'Mahkota ranting bintang melingkar, cincin batu meteorit berukir rune, dan botol eliksir kristal kaca mengambang.'
          : 'Tiara emas bertakhta pecahan bintang jatuh, medali kehormatan antariksa, dan tongkat starlight berujung safir.',
        background: visualStyle === 'Cyberpunk'
          ? 'Metropolis mega-kota luar angkasa dengan gedung pencakar langit hologram ungu-sian dan lalu lintas pesawat antariksa.'
          : visualStyle === 'Fantasy'
          ? 'Taman kosmik mengambang dengan pepohonan kristal berkilau, kabut stardust ungu pastel, dan dua bulan kembar.'
          : 'Ruang singgasana istana galaksi berkubah kaca menghadap pemandangan spiral galaksi Bima Sakti yang megah.'
      },
      avatarFeatures: {
        crownOrHeadpiece: visualStyle === 'Cyberpunk' ? 'Cyber-Visor Hologram' : visualStyle === 'Fantasy' ? 'Rune Tiara Emas' : 'Imperial Stellar Crown',
        auraTone: input.favoriteColor,
        signatureRune: zodiac
      }
    },
    perfume: {
      perfumeName,
      scentCategory: `${favoriteScents.join(' - ')} Kosmik`,
      topNotes: [topNotesList[Math.floor(Math.random() * topNotesList.length)], 'Jeruk Purut & Bergamot Segar', 'Embun Pagi Nebula'],
      heartNotes: [heartNotesList[Math.floor(Math.random() * heartNotesList.length)], 'Mawar Kosmik & Sedap Malam', 'Sentuhan Rempah Hangat'],
      baseNotes: [baseNotesList[Math.floor(Math.random() * baseNotesList.length)], 'Nilam Emas Nusantara', 'Warm Velvet Amber'],
      matchReason: `Aroma ini merangkul energi berani rasi ${zodiac} yang berpadu selaras dengan getaran ${mood.toLowerCase()} milik ${nickname}. Harmoni nada segar dan kehangatan kayu menghadirkan ketenangan batin sekaligus daya pikat mistis yang elegan.`,
      nusantaraHeritage: 'Mengusung keanggunan Cendana Nusa Tenggara yang sakral dan keharuman Melati Putih alami, diperkaya sentuhan Nilam Jawa yang memberikan kedalaman aroma khas tanah kepulauan Nusantara di panggung kosmik.',
      similarRecommendations: [
        'Warm Oriental Sandalwood & Amber Accord',
        'Night-Blooming White Floral Mist',
        'Smoky Patchouli & Sweet Vanilla Velvet'
      ],
      giftIdea: `Set Eksklusif: Parfum botol kaca kristal kosmik bersama lilin aromaterapi dupa Cendana & Melati alami dalam kotak beludru berpendar galaksi.`
    }
  };
}

// API endpoint for generating persona & perfume
app.post('/api/generate', async (req: Request, res: Response) => {
  try {
    const { nickname, zodiac, favoriteColor, visualStyle, mood, favoriteScents } = req.body;

    if (!nickname || !zodiac) {
      return res.status(400).json({ error: 'Nama panggilan dan zodiak wajib diisi.' });
    }

    // Try Gemini API if client is initialized
    if (ai) {
      try {
        const prompt = `
Kamu adalah Master Perfumer Kosmik dan Kurator Persona Galaksi dari "AstraScent - Avatar & Aroma Alam Semestamu".
Tagline: "Temukan aroma dari bintangmu."

Buat persona kosmik unik dan rekomendasi parfum personal dalam BAHASA INDONESIA yang ramah, puitis, memikat, dan ringkas berdasarkan data berikut:
- Nama panggilan: "${nickname}"
- Zodiak: "${zodiac}"
- Warna aura favorit: "${favoriteColor}"
- Gaya visual kartu: "${visualStyle}" (Cyberpunk / Fantasy / Royal Galaxy)
- Suasana hati saat ini: "${mood}" (Tenang / Percaya Diri / Romantis / Enerjik / Misterius)
- Karakter aroma favorit yang dipilih: ${Array.isArray(favoriteScents) ? favoriteScents.join(', ') : 'Floral, Woody'}

KETENTUAN PENTING:
1. Persona Kosmik:
   - Nama karakter dan gelar kosmik megah (contoh: "${nickname} sang Penjaga Nebula Senja" atau variasi puitis lainnya).
   - Rarity secara acak dan seimbang: "Common", "Rare", atau "Legendary" (berikan deskripsi aura yang sesuai).
   - Deskripsi kreatif 2-3 kalimat yang mendalam dan puitis.
   - Kekuatan khusus, planet asal kosmik, dan elemen selaras zodiak.
   - Konsep visual avatar sesuai gaya "${visualStyle}" (outfit, accessories, background).

2. Parfum Kosmik:
   - Nama aroma puitis dan memikat (contoh: "${zodiac} Nocturne Cendana", "Aetheria Melati Solaris", dll).
   - Kategori aroma yang harmonis dengan karakter.
   - Top notes (3 bahan), Heart notes (3 bahan), Base notes (3 bahan).
   - Wajib pertimbangkan bahan khas Nusantara (melati putih keraton, cendana Nusa Tenggara, nilam/patchouli, kopi Toraja/Gayo, sedap malam, gaharu, pala/cengkeh, vanili Alor).
   - matchReason: Alasan puitis mengapa aroma ini cocok dengan zodiak ${zodiac} dan suasana hati ${mood}.
   - nusantaraHeritage: 1-2 kalimat apresiasi bahan aromatik khas Nusantara yang dipakai.
   - 3 rekomendasi tipe parfum serupa (HANYA jenis aroma/accord parfum, TANPA menyebut harga).
   - 1 ide hadiah kreatif yang elegan dan berkesan (misalnya paket parfum + lilin aromaterapi aroma dupa cendana).

Hasil harus bervariasi, dinamis, personal, dan TIDAK generik.
Format output HARUS berupa JSON sesuai schema.
`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            systemInstruction: 'Anda adalah AstraScent Oracle, kecerdasan kosmik ahli seni wewangian antariksa dan estetika celestial. Gunakan bahasa Indonesia yang puitis, anggun, ramah, dan ringkas.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                persona: {
                  type: Type.OBJECT,
                  properties: {
                    characterName: { type: Type.STRING },
                    cosmicTitle: { type: Type.STRING },
                    rarity: { type: Type.STRING },
                    description: { type: Type.STRING },
                    specialPower: { type: Type.STRING },
                    originPlanet: { type: Type.STRING },
                    element: { type: Type.STRING },
                    visualConcept: {
                      type: Type.OBJECT,
                      properties: {
                        outfit: { type: Type.STRING },
                        accessories: { type: Type.STRING },
                        background: { type: Type.STRING },
                      },
                      required: ['outfit', 'accessories', 'background'],
                    },
                    avatarFeatures: {
                      type: Type.OBJECT,
                      properties: {
                        crownOrHeadpiece: { type: Type.STRING },
                        auraTone: { type: Type.STRING },
                        signatureRune: { type: Type.STRING },
                      },
                      required: ['crownOrHeadpiece', 'auraTone', 'signatureRune'],
                    },
                  },
                  required: [
                    'characterName',
                    'cosmicTitle',
                    'rarity',
                    'description',
                    'specialPower',
                    'originPlanet',
                    'element',
                    'visualConcept',
                  ],
                },
                perfume: {
                  type: Type.OBJECT,
                  properties: {
                    perfumeName: { type: Type.STRING },
                    scentCategory: { type: Type.STRING },
                    topNotes: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    heartNotes: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    baseNotes: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    matchReason: { type: Type.STRING },
                    nusantaraHeritage: { type: Type.STRING },
                    similarRecommendations: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    giftIdea: { type: Type.STRING },
                  },
                  required: [
                    'perfumeName',
                    'scentCategory',
                    'topNotes',
                    'heartNotes',
                    'baseNotes',
                    'matchReason',
                    'nusantaraHeritage',
                    'similarRecommendations',
                    'giftIdea',
                  ],
                },
              },
              required: ['persona', 'perfume'],
            },
          },
        });

        const rawText = response.text?.trim() || '';
        const parsed = JSON.parse(rawText);
        return res.json(parsed);
      } catch (geminiErr) {
        console.warn('Gemini API call failed or timed out, using high-fidelity fallback generator:', geminiErr);
        // Fall through to deterministic high-fidelity generator
      }
    }

    // High fidelity fallback generator
    const fallback = generateFallbackResponse({
      nickname: String(nickname),
      zodiac: String(zodiac),
      favoriteColor: String(favoriteColor || '#8B5CF6'),
      visualStyle: String(visualStyle || 'Fantasy'),
      mood: String(mood || 'Tenang'),
      favoriteScents: Array.isArray(favoriteScents) ? favoriteScents : ['Woody', 'Floral'],
    });

    return res.json(fallback);
  } catch (error) {
    console.error('Server error generating AstraScent:', error);
    return res.status(500).json({ error: 'Gagal meracik aroma kosmik. Silakan coba kembali.' });
  }
});

// Mount Vite or static server
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✨ AstraScent server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
