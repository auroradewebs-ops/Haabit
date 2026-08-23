import React, { useState, useEffect } from 'react';
import { BujoImageLayout, Task } from '../../types';
import { Modal } from '../common/Modal';
import { BUJO_STICKER_PRESETS, BujoStickerPreset } from '../../utils/bujoPresets';
import { ImageSizeAndFocusAdjuster } from '../common/ImageSizeAndFocusAdjuster';
import {
  Image,
  Upload,
  Link,
  Sparkles,
  Trash2,
  Check,
  Tag,
  Scissors,
  Camera,
  Layers,
  FileImage,
  Target,
} from 'lucide-react';

interface BujoDecorationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl?: string;
  currentImageLayout?: BujoImageLayout;
  currentCaption?: string;
  currentImageSize?: 'sm' | 'md' | 'lg' | 'xl';
  currentImageZoom?: number;
  currentImageFocusX?: number;
  currentImageFocusY?: number;
  currentImageFit?: 'cover' | 'contain';
  onSaveDecoration: (decoration: {
    imageUrl?: string;
    imageLayout?: BujoImageLayout;
    imageCaption?: string;
    imageSize?: 'sm' | 'md' | 'lg' | 'xl';
    imageZoom?: number;
    imageFocusX?: number;
    imageFocusY?: number;
    imageFit?: 'cover' | 'contain';
  }) => void;
}

export const BujoDecorationPickerModal: React.FC<BujoDecorationPickerModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl = '',
  currentImageLayout = 'polaroid',
  currentCaption = '',
  currentImageSize = 'md',
  currentImageZoom = 100,
  currentImageFocusX = 50,
  currentImageFocusY = 50,
  currentImageFit = 'cover',
  onSaveDecoration,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [imageUrl, setImageUrl] = useState<string>(currentImageUrl);
  const [imageLayout, setImageLayout] = useState<BujoImageLayout>(currentImageLayout || 'polaroid');
  const [caption, setCaption] = useState<string>(currentCaption || '');
  const [imageSize, setImageSize] = useState<'sm' | 'md' | 'lg' | 'xl'>(currentImageSize || 'md');
  const [imageZoom, setImageZoom] = useState<number>(currentImageZoom ?? 100);
  const [imageFocusX, setImageFocusX] = useState<number>(currentImageFocusX ?? 50);
  const [imageFocusY, setImageFocusY] = useState<number>(currentImageFocusY ?? 50);
  const [imageFit, setImageFit] = useState<'cover' | 'contain'>(currentImageFit || 'cover');

  const [urlInput, setUrlInput] = useState<string>(currentImageUrl.startsWith('http') ? currentImageUrl : '');
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Sync props when modal opens
  useEffect(() => {
    if (isOpen) {
      setImageUrl(currentImageUrl);
      setImageLayout(currentImageLayout || 'polaroid');
      setCaption(currentCaption || '');
      setImageSize(currentImageSize || 'md');
      setImageZoom(currentImageZoom ?? 100);
      setImageFocusX(currentImageFocusX ?? 50);
      setImageFocusY(currentImageFocusY ?? 50);
      setImageFit(currentImageFit || 'cover');
      setUrlInput(currentImageUrl.startsWith('http') ? currentImageUrl : '');
    }
  }, [
    isOpen,
    currentImageUrl,
    currentImageLayout,
    currentCaption,
    currentImageSize,
    currentImageZoom,
    currentImageFocusX,
    currentImageFocusY,
    currentImageFit,
  ]);

  // Filter presets
  const filteredPresets = BUJO_STICKER_PRESETS.filter((p) =>
    selectedCategory === 'all' ? true : p.category === selectedCategory
  );

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size is too large (max 5MB).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
      }
    };
    reader.onerror = () => {
      setUploadError('Error reading image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (preset: BujoStickerPreset) => {
    setImageUrl(preset.url);
    setImageLayout(preset.defaultLayout);
    if (!caption && preset.caption) {
      setCaption(preset.caption);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setImageUrl(urlInput.trim());
    }
  };

  const handleSave = () => {
    onSaveDecoration({
      imageUrl: imageUrl.trim() || undefined,
      imageLayout: imageUrl.trim() ? imageLayout : undefined,
      imageCaption: imageUrl.trim() ? caption.trim() : undefined,
      imageSize: imageUrl.trim() ? imageSize : undefined,
      imageZoom: imageUrl.trim() ? imageZoom : undefined,
      imageFocusX: imageUrl.trim() ? imageFocusX : undefined,
      imageFocusY: imageUrl.trim() ? imageFocusY : undefined,
      imageFit: imageUrl.trim() ? imageFit : undefined,
    });
    onClose();
  };

  const handleRemove = () => {
    setImageUrl('');
    setCaption('');
    onSaveDecoration({
      imageUrl: undefined,
      imageLayout: undefined,
      imageCaption: undefined,
      imageSize: undefined,
      imageZoom: undefined,
      imageFocusX: undefined,
      imageFocusY: undefined,
      imageFit: undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Decoration, Photo Size & Focus Framing"
      subtitle="Attach photos, polaroids, stamps, and adjust size, zoom, and focal point"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5 max-h-[78vh] overflow-y-auto pr-1">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-[#1A1C2B] rounded-2xl border border-stone-200 dark:border-[#3C4263]">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'bg-white dark:bg-[#282C44] text-[#8E7CC3] shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E36D9B]" />
            <span>Preset Gallery</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-[#282C44] text-[#8E7CC3] shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-[#10B183]" />
            <span>Upload Device Image</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-white dark:bg-[#282C44] text-[#8E7CC3] shadow-xs'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Link className="w-3.5 h-3.5 text-[#E7DD6A]" />
            <span>Image Web URL</span>
          </button>
        </div>

        {/* Tab 1: Presets Gallery */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            {/* Category pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'All Presets' },
                { id: 'washi', label: 'Washi Tapes' },
                { id: 'vintage', label: 'Stamps & Vintage' },
                { id: 'cozy', label: 'Cozy & Coffee' },
                { id: 'botanical', label: 'Botanical' },
                { id: 'focus', label: 'Focus & Rituals' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap font-body transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#8E7CC3] text-white shadow-2xs'
                      : 'bg-stone-100 dark:bg-[#23273C] text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Grid of presets */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 max-h-52 overflow-y-auto pr-1">
              {filteredPresets.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`group relative rounded-xl border p-1.5 text-left transition-all overflow-hidden ${
                    imageUrl === preset.url
                      ? 'border-[#8E7CC3] ring-2 ring-[#8E7CC3] bg-[#8E7CC3]/10'
                      : 'border-stone-200 dark:border-[#3C4263] hover:border-stone-400 bg-white dark:bg-[#23273C]'
                  }`}
                >
                  <div className="w-full h-18 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 mb-1.5 relative">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {imageUrl === preset.url && (
                      <div className="absolute inset-0 bg-[#8E7CC3]/40 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-white text-[#8E7CC3] flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold font-body text-stone-800 dark:text-stone-200 line-clamp-1 block">
                    {preset.name}
                  </span>
                  <span className="text-[9px] uppercase font-mono text-stone-500 font-semibold">
                    {preset.defaultLayout}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Upload File */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <div className="border-2 border-dashed border-stone-300 dark:border-[#3C4263] hover:border-[#8E7CC3] rounded-2xl p-6 text-center bg-stone-50/50 dark:bg-[#1A1C2B] transition-colors">
              <label className="cursor-pointer flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-2xl bg-[#8E7CC3]/15 text-[#8E7CC3] flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold font-body text-stone-800 dark:text-stone-200">
                  Select a photo from your gallery or computer
                </span>
                <span className="text-[11px] text-stone-500 font-body">
                  Supports JPG, PNG, WebP or GIF (max 5MB)
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <span className="mt-2 px-4 py-2 bg-[#8E7CC3] text-white rounded-xl text-xs font-bold font-body hover:bg-[#7B68B4]">
                  Browse Files
                </span>
              </label>
            </div>
            {uploadError && (
              <p className="text-xs font-body text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {uploadError}
              </p>
            )}
          </div>
        )}

        {/* Tab 3: URL */}
        {activeTab === 'url' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 font-body">
              External Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 px-3 py-2 text-xs font-body rounded-xl border border-stone-200 dark:border-[#3C4263] bg-white dark:bg-[#161825] focus:outline-none focus:border-[#8E7CC3]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2 bg-[#8E7CC3] text-white text-xs font-bold font-body rounded-xl hover:bg-[#7B68B4]"
              >
                Load
              </button>
            </div>
          </div>
        )}

        {/* Live Preview, Style, Caption & Size/Focus Controls (When image is present) */}
        {imageUrl && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-amber-50/40 dark:bg-[#1E2235] border-2 border-amber-200/80 dark:border-[#3C4263] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800 dark:text-stone-200 font-body flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#8E7CC3]" /> Mounting Style & Frame
                </span>
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="text-[11px] font-body text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Remove image
                </button>
              </div>

              {/* Layout selector */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'polaroid', label: 'Polaroid', desc: 'White frame with tape' },
                  { id: 'stamp', label: 'Postage Stamp', desc: 'Serrated edges' },
                  { id: 'washi', label: 'Washi Strip', desc: 'Horizontal banner' },
                  { id: 'sticker', label: 'Sticker', desc: 'Floating cutout' },
                  { id: 'banner', label: 'Banner Top', desc: 'Header spread' },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setImageLayout(l.id as BujoImageLayout)}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      imageLayout === l.id
                        ? 'border-[#8E7CC3] bg-[#8E7CC3] text-white font-bold shadow-xs'
                        : 'border-stone-200 dark:border-[#3C4263] bg-white dark:bg-[#282C44] text-stone-700 dark:text-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-xs block font-body">{l.label}</span>
                    <span className={`text-[10px] block ${imageLayout === l.id ? 'text-white/80' : 'text-stone-400'}`}>
                      {l.desc}
                    </span>
                  </button>
                ))}
              </div>

              {/* Caption Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1 font-body">
                  Caption or Calligraphy Note (optional)
                </label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g., Summer memories and quiet focus..."
                  className="w-full px-3 py-1.5 text-xs font-body rounded-xl border border-stone-200 dark:border-[#3C4263] bg-white dark:bg-[#161825] focus:outline-none focus:border-[#8E7CC3]"
                />
              </div>
            </div>

            {/* Reusable Size & Focal Point Adjuster */}
            <ImageSizeAndFocusAdjuster
              size={imageSize}
              onChangeSize={setImageSize}
              zoom={imageZoom}
              onChangeZoom={setImageZoom}
              focusX={imageFocusX}
              onChangeFocusX={setImageFocusX}
              focusY={imageFocusY}
              onChangeFocusY={setImageFocusY}
              fit={imageFit}
              onChangeFit={setImageFit}
              previewUrl={imageUrl}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between border-t border-stone-200 dark:border-[#3C4263]">
          {currentImageUrl ? (
            <button
              type="button"
              onClick={handleRemove}
              className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold font-body transition-all flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Photo</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-[#3C4263] text-stone-600 dark:text-stone-400 text-xs font-semibold font-body hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white text-xs font-bold font-body shadow-sm active:scale-95 transition-all"
            >
              Save Decoration
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
