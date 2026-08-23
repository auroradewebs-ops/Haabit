import React, { useState, useRef } from 'react';
import {
  IconRenderer,
  IconBadge,
  isImageIcon,
  ICON_CATEGORIES,
  POPULAR_EMOJIS,
} from './IconRenderer';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Smile,
  Palette,
  Trash2,
  Check,
  Search,
} from 'lucide-react';

export const EXPANDED_PALETTE = [
  { name: 'Soft Violet', hex: '#8E7CC3' },
  { name: 'Sunset Rose', hex: '#FF8E7E' },
  { name: 'Warm Honey', hex: '#F4B843' },
  { name: 'Matcha Sage', hex: '#5FA382' },
  { name: 'Ocean Blue', hex: '#4A90A4' },
  { name: 'Terracotta', hex: '#C85A32' },
  { name: 'Blossom Pink', hex: '#E06D8A' },
  { name: 'Sky Azure', hex: '#4A7BD0' },
  { name: 'Deep Indigo', hex: '#4C51BF' },
  { name: 'Forest Spruce', hex: '#2E7D32' },
  { name: 'Golden Amber', hex: '#DD6B20' },
  { name: 'Warm Bark', hex: '#5C3E28' },
  { name: 'Charcoal Slate', hex: '#334155' },
];

interface IconAndColorCustomizerProps {
  iconName: string;
  onChangeIcon: (iconName: string) => void;
  color: string;
  onChangeColor: (colorHex: string) => void;
  title?: string;
  showColorPicker?: boolean;
}

export const IconAndColorCustomizer: React.FC<IconAndColorCustomizerProps> = ({
  iconName,
  onChangeIcon,
  color,
  onChangeColor,
  title = 'Personalize Icon & Accent Color',
  showColorPicker = true,
}) => {
  const [activeTab, setActiveTab] = useState<'icons' | 'emojis' | 'upload'>('icons');
  const [selectedCategory, setSelectedCategory] = useState<string>('Mind & Mindfulness');
  const [searchQuery, setSearchQuery] = useState('');
  const [customEmoji, setCustomEmoji] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resize and compress uploaded image to a fast, crisp 128x128 thumbnail
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setUploadError('Image size is too large (max 8MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 160;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/png', 0.9);
          onChangeIcon(compressedDataUrl);
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.onerror = () => {
      setUploadError('Could not read image file.');
    };
    reader.readAsDataURL(file);
  };

  const isCustomUploadedImage = isImageIcon(iconName);

  // Filter icons by category or search
  const currentCategoryObj = ICON_CATEGORIES.find((c) => c.category === selectedCategory);
  let displayedIcons = currentCategoryObj ? currentCategoryObj.icons : [];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    displayedIcons = ICON_CATEGORIES.flatMap((c) => c.icons).filter((name) =>
      name.toLowerCase().includes(q)
    );
  }

  return (
    <div className="space-y-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#1E2133] p-3.5 sm:p-4 border-2 border-[#D7C9B1] dark:border-[#3C4263] transition-colors">
      {/* Header & Live Preview */}
      <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#E3D8C4] dark:border-[#2D334C]">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#E2E8F0] font-body flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-[#8E7CC3] dark:text-[#A798DD]" />
            <span>{title}</span>
          </h4>
          <p className="text-[11px] text-[#735A46] dark:text-[#94A3B8] font-body">
            Choose a stamp, emoji, color, or upload a local image
          </p>
        </div>

        {/* Live Preview Stamp */}
        <div className="flex items-center gap-2 shrink-0">
          <IconBadge
            name={iconName}
            color={color}
            size="md"
            alt="Current Icon & Color Preview"
          />
        </div>
      </div>

      {/* Color Customization Section */}
      {showColorPicker && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] font-body">
              Accent Color
            </label>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-[#5A4688] dark:text-[#A798DD] font-bold">
                {color.toUpperCase()}
              </span>
              {/* Native Color Picker button */}
              <label className="relative cursor-pointer flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white dark:bg-[#282C44] border border-[#D7C9B1] dark:border-[#3C4263] text-[10px] font-bold text-[#4A3222] dark:text-[#E2E8F0] hover:bg-stone-50 dark:hover:bg-[#323755] transition-all">
                <span>Custom</span>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => onChangeColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  title="Pick any custom hex color"
                />
              </label>
            </div>
          </div>

          {/* Color Swatches Grid */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            {EXPANDED_PALETTE.map((p) => {
              const isSelected = color.toLowerCase() === p.hex.toLowerCase();
              return (
                <button
                  key={p.hex}
                  type="button"
                  onClick={() => onChangeColor(p.hex)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg sm:rounded-xl transition-all border border-black/10 dark:border-white/10 flex items-center justify-center ${
                    isSelected
                      ? 'scale-110 ring-2 ring-[#4A3222] dark:ring-white ring-offset-1 dark:ring-offset-[#1E2133] shadow-xs'
                      : 'hover:scale-105 hover:shadow-2xs opacity-90 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: p.hex }}
                  title={p.name}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-white drop-shadow-sm stroke-[3]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Icon Mode Tabs: Lucide Icons, Emojis, Local Upload */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between gap-1 p-1 rounded-xl bg-[#EDE4D2] dark:bg-[#161825] border border-[#D7C9B1]/60 dark:border-[#2D334C]">
          <button
            type="button"
            onClick={() => setActiveTab('icons')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-body transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'icons'
                ? 'bg-white dark:bg-[#282C44] text-[#4A3222] dark:text-[#E2E8F0] shadow-xs'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:text-[#4A3222] dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8E7CC3] dark:text-[#A798DD]" />
            <span>Icons</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('emojis')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-body transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'emojis'
                ? 'bg-white dark:bg-[#282C44] text-[#4A3222] dark:text-[#E2E8F0] shadow-xs'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:text-[#4A3222] dark:hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5 text-[#FF8E7E]" />
            <span>Emojis</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-body transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-[#282C44] text-[#4A3222] dark:text-[#E2E8F0] shadow-xs'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:text-[#4A3222] dark:hover:text-white'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#5FA382]" />
            <span>Upload Image</span>
          </button>
        </div>

        {/* Tab 1: Icons */}
        {activeTab === 'icons' && (
          <div className="space-y-2">
            {/* Search and Categories */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search icons (e.g. book, heart, flame)..."
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#282C44] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] focus:outline-none focus:border-[#8E7CC3]"
                />
              </div>
            </div>

            {!searchQuery && (
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {ICON_CATEGORIES.map((c) => (
                  <button
                    key={c.category}
                    type="button"
                    onClick={() => setSelectedCategory(c.category)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                      selectedCategory === c.category
                        ? 'bg-[#8E7CC3] text-white shadow-2xs'
                        : 'bg-white dark:bg-[#282C44] text-[#735A46] dark:text-[#94A3B8] border border-[#D7C9B1] dark:border-[#3C4263] hover:border-[#8E7CC3]'
                    }`}
                  >
                    {c.category}
                  </button>
                ))}
              </div>
            )}

            {/* Icon Grid */}
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 p-2 rounded-xl bg-white dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#2D334C] max-h-36 overflow-y-auto">
              {displayedIcons.map((name) => {
                const isSelected = iconName === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => onChangeIcon(name)}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#8E7CC3] text-white shadow-xs scale-105'
                        : 'text-[#4A3222] dark:text-[#CBD5E1] hover:bg-[#F2EFF9] dark:hover:bg-[#282C44] hover:text-[#5A4688] dark:hover:text-[#A798DD]'
                    }`}
                    title={name}
                  >
                    <IconRenderer name={name} className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Emojis */}
        {activeTab === 'emojis' && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customEmoji}
                onChange={(e) => {
                  setCustomEmoji(e.target.value);
                  if (e.target.value.trim()) {
                    onChangeIcon(e.target.value.trim());
                  }
                }}
                placeholder="Type or paste any custom emoji (e.g. 🦊, 🌸, ⚡)..."
                maxLength={4}
                className="w-full px-3 py-1.5 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#282C44] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] focus:outline-none focus:border-[#8E7CC3]"
              />
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-10 gap-1.5 p-2 rounded-xl bg-white dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#2D334C] max-h-36 overflow-y-auto">
              {POPULAR_EMOJIS.map((emoji) => {
                const isSelected = iconName === emoji;
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => onChangeIcon(emoji)}
                    className={`p-2 rounded-lg flex items-center justify-center text-lg transition-all ${
                      isSelected
                        ? 'bg-[#8E7CC3] text-white shadow-xs scale-110 ring-1 ring-[#8E7CC3]'
                        : 'hover:bg-[#F2EFF9] dark:hover:bg-[#282C44] hover:scale-105'
                    }`}
                  >
                    {emoji}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Local Storage / Device Image Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-3 p-3 rounded-xl bg-white dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#2D334C]">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {isCustomUploadedImage ? (
              <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#22263A] border border-[#D7C9B1] dark:border-[#3C4263]">
                <div className="flex items-center gap-3">
                  <img
                    src={iconName}
                    alt="Custom Uploaded Thumbnail"
                    className="w-12 h-12 object-cover rounded-lg border-2 border-white dark:border-[#161825] shadow-xs"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#4A3222] dark:text-[#E2E8F0] block">
                      Local Image Active
                    </span>
                    <span className="text-[11px] text-[#735A46] dark:text-[#94A3B8]">
                      Stored on device storage
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#282C44] border border-[#D7C9B1] dark:border-[#3C4263] text-xs font-bold text-[#4A3222] dark:text-[#E2E8F0] hover:bg-stone-50 dark:hover:bg-[#323755] transition-all"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={() => onChangeIcon('Sparkles')}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                    title="Remove custom image and reset to default icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D7C9B1] dark:border-[#3C4263] rounded-xl p-5 text-center cursor-pointer hover:border-[#8E7CC3] dark:hover:border-[#A798DD] hover:bg-[#FAF6EE]/50 dark:hover:bg-[#1E2133]/50 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F2EFF9] dark:bg-[#282C44] text-[#8E7CC3] dark:text-[#A798DD] flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h5 className="text-xs font-bold text-[#4A3222] dark:text-[#E2E8F0] mb-0.5">
                  Upload Image from Local Storage
                </h5>
                <p className="text-[11px] text-[#735A46] dark:text-[#94A3B8]">
                  Click to select PNG, JPG, SVG or WebP from your device
                </p>
              </div>
            )}

            {uploadError && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {uploadError}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
