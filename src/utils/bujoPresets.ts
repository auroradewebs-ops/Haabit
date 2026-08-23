import { BujoPaperSettings, BujoImageLayout } from '../types';

export interface BujoStickerPreset {
  id: string;
  name: string;
  category: 'stationery' | 'botanical' | 'cozy' | 'focus' | 'washi' | 'vintage';
  url: string;
  defaultLayout: BujoImageLayout;
  caption?: string;
}

export const DEFAULT_BUJO_PAPER_SETTINGS: BujoPaperSettings = {
  paperTone: 'cream',
  paperPattern: 'dot-grid',
  gridDensity: 'normal',
  gridColor: 'navy',
  bindingStyle: 'spiral',
  bookmarkColor: 'rose',
  showBookmark: true,
  showWashiCorners: true,
  paperTextureOverlay: true,
};

export const BUJO_STICKER_PRESETS: BujoStickerPreset[] = [
  // Anime & Scrapbook Memory Presets (Inspired by Reference Images)
  {
    id: 'st-anime-summer',
    name: 'Primer Encuentro (Verano en la Ciudad)',
    category: 'vintage',
    url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    defaultLayout: 'polaroid',
    caption: 'Bajo la cálida luz del verano',
  },
  {
    id: 'st-dandelion-rain',
    name: 'Dientes de León tras la Lluvia',
    category: 'botanical',
    url: 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80',
    defaultLayout: 'polaroid',
    caption: 'Flores silvestres bajo el sol',
  },
  {
    id: 'st-tanuki-daruma',
    name: 'Mascota Daruma & Tanuki Festivo',
    category: 'cozy',
    url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'sticker',
    caption: 'Muji-Muji Daruma',
  },
  {
    id: 'st-maple-leaves',
    name: 'Hojas de Arce Verde Fresco',
    category: 'botanical',
    url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'sticker',
    caption: 'Brisa de verano',
  },
  {
    id: 'st-four-clover',
    name: 'Trébol de Cuatro Hojas',
    category: 'botanical',
    url: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'sticker',
    caption: 'Felicidad y suerte duradera',
  },
  {
    id: 'st-songbird',
    name: 'Pajarito Cantor de Jardín',
    category: 'cozy',
    url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'sticker',
    caption: 'Melodía matutina',
  },
  {
    id: 'st-sakura-lanterns',
    name: 'Washi Tape Faroles & Sakura',
    category: 'washi',
    url: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=800&q=80',
    defaultLayout: 'washi',
    caption: 'Festival de Primavera',
  },
  // Stationery & Washi
  {
    id: 'st-washi-terracotta',
    name: 'Washi Tape Terracota & Puntos',
    category: 'washi',
    url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'washi',
    caption: 'Momento de enfoque',
  },
  {
    id: 'st-washi-floral',
    name: 'Washi Tape Flores Silvestres',
    category: 'washi',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'washi',
    caption: 'Inspiración botánica',
  },
  {
    id: 'st-stamp-vintage',
    name: 'Sello Postal Colección Botánica',
    category: 'vintage',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'stamp',
    caption: 'Edición especial',
  },
  {
    id: 'st-polaroid-coffee',
    name: 'Polaroid Café de Especialidad',
    category: 'cozy',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'polaroid',
    caption: 'Pausa con café',
  },
  {
    id: 'st-polaroid-desk',
    name: 'Polaroid Escritorio Creativo',
    category: 'focus',
    url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'polaroid',
    caption: 'Manos a la obra',
  },
  {
    id: 'st-polaroid-books',
    name: 'Polaroid Libros & Apuntes',
    category: 'vintage',
    url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'polaroid',
    caption: 'Lectura activa',
  },
  {
    id: 'st-plant-monstera',
    name: 'Ilustración Monstera Deliciosa',
    category: 'botanical',
    url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'sticker',
    caption: 'Crecimiento continuo',
  },
  {
    id: 'st-flowers-lavender',
    name: 'Ramillete de Lavanda & Eucalipto',
    category: 'botanical',
    url: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'sticker',
    caption: 'Calma mental',
  },
  {
    id: 'st-nature-mountains',
    name: 'Postal Cumbre & Horizonte',
    category: 'focus',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'banner',
    caption: 'Meta clara',
  },
  {
    id: 'st-night-sky',
    name: 'Cielo Nocturno & Luna Creciente',
    category: 'cozy',
    url: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?auto=format&fit=crop&w=600&q=80',
    defaultLayout: 'polaroid',
    caption: 'Reflexión nocturna',
  },
];

// Helper functions to generate CSS background styles based on paper settings
export function getBujoPaperStyles(settings: BujoPaperSettings): {
  backgroundColor: string;
  backgroundImage: string;
  backgroundSize: string;
  color: string;
} {
  // Paper background base colors
  const toneColors: Record<BujoPaperSettings['paperTone'], { bg: string; text: string }> = {
    cream: { bg: '#FAF8F5', text: '#292524' },
    parchment: { bg: '#F5EEDB', text: '#2c251d' },
    kraft: { bg: '#E5D5BC', text: '#382a1d' },
    sage: { bg: '#EBF3ED', text: '#1b2c21' },
    blush: { bg: '#FDF2F4', text: '#381e26' },
    lavender: { bg: '#F4EFF9', text: '#2c1e38' },
    slate: { bg: '#F8FAFC', text: '#0f172a' },
    midnight: { bg: '#181C24', text: '#F1F5F9' },
  };

  // Grid / Line colors mapped to rgba values
  const isDark = settings.paperTone === 'midnight';
  const gridColorRgba: Record<BujoPaperSettings['gridColor'], string> = {
    navy: isDark ? 'rgba(147, 197, 253, 0.25)' : 'rgba(43, 71, 137, 0.22)',
    sepia: isDark ? 'rgba(251, 191, 36, 0.25)' : 'rgba(140, 94, 72, 0.25)',
    charcoal: isDark ? 'rgba(226, 232, 240, 0.20)' : 'rgba(100, 116, 139, 0.22)',
    emerald: isDark ? 'rgba(110, 231, 183, 0.25)' : 'rgba(16, 177, 131, 0.25)',
    gold: isDark ? 'rgba(253, 224, 71, 0.30)' : 'rgba(217, 119, 6, 0.28)',
    rose: isDark ? 'rgba(244, 114, 182, 0.25)' : 'rgba(227, 109, 155, 0.25)',
  };

  const gColor = gridColorRgba[settings.gridColor] || gridColorRgba.navy;

  // Grid spacing sizes
  const densitySizes: Record<BujoPaperSettings['gridDensity'], number> = {
    compact: 18,
    normal: 24,
    spacious: 32,
  };
  const sizePx = densitySizes[settings.gridDensity] || 24;

  let bgImage = 'none';
  let bgSize = 'auto';

  switch (settings.paperPattern) {
    case 'dot-grid':
      bgImage = `radial-gradient(${gColor} 1.2px, transparent 1.2px)`;
      bgSize = `${sizePx}px ${sizePx}px`;
      break;

    case 'ruled':
      bgImage = `linear-gradient(to bottom, transparent ${sizePx - 1}px, ${gColor} ${sizePx}px)`;
      bgSize = `100% ${sizePx}px`;
      break;

    case 'graph':
      bgImage = `
        linear-gradient(to right, ${gColor} 1px, transparent 1px),
        linear-gradient(to bottom, ${gColor} 1px, transparent 1px)
      `;
      bgSize = `${sizePx}px ${sizePx}px`;
      break;

    case 'isometric':
      bgImage = `
        linear-gradient(30deg, ${gColor} 12%, transparent 12.5%, transparent 87%, ${gColor} 87.5%, ${gColor}),
        linear-gradient(150deg, ${gColor} 12%, transparent 12.5%, transparent 87%, ${gColor} 87.5%, ${gColor}),
        linear-gradient(30deg, ${gColor} 12%, transparent 12.5%, transparent 87%, ${gColor} 87.5%, ${gColor}),
        linear-gradient(150deg, ${gColor} 12%, transparent 12.5%, transparent 87%, ${gColor} 87.5%, ${gColor}),
        linear-gradient(60deg, ${gColor}77 25%, transparent 25.5%, transparent 75%, ${gColor}77 75%, ${gColor}77),
        linear-gradient(60deg, ${gColor}77 25%, transparent 25.5%, transparent 75%, ${gColor}77 75%, ${gColor}77)
      `;
      bgSize = `${sizePx * 2}px ${sizePx * 3.46}px`;
      break;

    case 'vintage-ledger':
      bgImage = `
        linear-gradient(to bottom, transparent ${sizePx - 1}px, ${gColor} ${sizePx}px),
        linear-gradient(to right, transparent 50px, rgba(227, 109, 155, 0.4) 51px, transparent 52px)
      `;
      bgSize = `100% ${sizePx}px, 100% 100%`;
      break;

    case 'blank':
    default:
      bgImage = 'none';
      bgSize = 'auto';
      break;
  }

  const selectedTone = toneColors[settings.paperTone] || toneColors.cream;

  return {
    backgroundColor: selectedTone.bg,
    backgroundImage: bgImage,
    backgroundSize: bgSize,
    color: selectedTone.text,
  };
}
