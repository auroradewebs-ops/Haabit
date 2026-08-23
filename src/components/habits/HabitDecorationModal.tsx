import React, { useState, useRef } from 'react';
import { Modal } from '../common/Modal';
import {
  HabitBannerDecoration,
  COZY_MOTIVATIONAL_PHRASES,
  COZY_PRESET_DECORATIONS,
  compressImageFile,
} from '../../utils/storage';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  Check,
  RotateCcw,
  Dice5,
  Heart,
  Camera,
  Layers,
} from 'lucide-react';

interface HabitDecorationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDecoration: HabitBannerDecoration;
  onSaveDecoration: (decoration: HabitBannerDecoration) => void;
}

export const HabitDecorationModal: React.FC<HabitDecorationModalProps> = ({
  isOpen,
  onClose,
  currentDecoration,
  onSaveDecoration,
}) => {
  const [phrase, setPhrase] = useState(currentDecoration.phrase);
  const [imageUrl, setImageUrl] = useState<string | null>(currentDecoration.imageUrl);
  const [imageCaption, setImageCaption] = useState(currentDecoration.imageCaption || '');
  const [layout, setLayout] = useState<'polaroid' | 'sticker' | 'frame'>(
    currentDecoration.layout || 'polaroid'
  );
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [activePhotoSource, setActivePhotoSource] = useState<'upload' | 'presets'>('upload');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial values when opened
  React.useEffect(() => {
    if (isOpen) {
      setPhrase(currentDecoration.phrase);
      setImageUrl(currentDecoration.imageUrl);
      setImageCaption(currentDecoration.imageCaption || 'Cozy Rituals 🌿');
      setLayout(currentDecoration.layout || 'polaroid');
    }
  }, [isOpen, currentDecoration]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please choose an image file (PNG, JPG, WebP, etc.).');
      return;
    }

    try {
      setIsProcessingFile(true);
      const compressedDataUrl = await compressImageFile(file, 600, 600, 0.82);
      setImageUrl(compressedDataUrl);
      if (!imageCaption) {
        setImageCaption('My Cozy Habit 🌸');
      }
    } catch (err) {
      console.error('Error processing image:', err);
      alert('Unable to load the selected image. Please try another file.');
    } finally {
      setIsProcessingFile(false);
      // Reset input value so same file can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRandomPhrase = () => {
    const random =
      COZY_MOTIVATIONAL_PHRASES[
        Math.floor(Math.random() * COZY_MOTIVATIONAL_PHRASES.length)
      ];
    setPhrase(random);
  };

  const handleSelectPreset = (url: string, defaultCaption: string) => {
    setImageUrl(url);
    setImageCaption(defaultCaption);
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
  };

  const handleSave = () => {
    onSaveDecoration({
      phrase: phrase.trim() || 'Small daily steps cultivate life’s greatest adventures. ✨',
      imageUrl,
      imageCaption: imageCaption.trim() || 'Cozy Rituals 🌿',
      layout,
    });
    onClose();
  };

  const handleResetDefaults = () => {
    setPhrase('Small daily steps cultivate life’s greatest adventures. ✨');
    setImageUrl(null);
    setImageCaption('Cozy Rituals 🌿');
    setLayout('polaroid');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Decorate Rituals Space"
      subtitle="Personalize your daily habits with a motivational phrase and a cozy photo from your device"
      maxWidth="max-w-xl"
    >
      <div className="space-y-6 pt-2">
        {/* ========================================================================= */}
        {/* 1. MOTIVATIONAL PHRASE SECTION */}
        {/* ========================================================================= */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#735A46] dark:text-[#94A3B8] font-body flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#8E7CC3]" />
              <span>Daily Motivation / Affirmation</span>
            </label>

            <button
              type="button"
              onClick={handleRandomPhrase}
              className="text-xs text-[#8E7CC3] hover:text-[#7B68B4] dark:text-[#A798DD] font-bold font-body inline-flex items-center gap-1 hover:underline active:scale-95 transition-all"
            >
              <Dice5 className="w-3.5 h-3.5" />
              <span>Inspire me</span>
            </button>
          </div>

          <div className="relative">
            <textarea
              rows={2}
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="Write a gentle reminder or empowering motto..."
              maxLength={120}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-white dark:bg-[#161825] border-2 border-[#D7C9B1] dark:border-[#3C4263] text-xs sm:text-sm font-body text-[#4A3222] dark:text-[#E2E8F0] placeholder:text-[#8C7662]/60 focus:outline-none focus:border-[#8E7CC3] transition-all resize-none shadow-inner"
            />
            <span className="absolute bottom-2.5 right-3 text-[10px] font-numeric text-[#8C7662] dark:text-[#64748B]">
              {phrase.length}/120
            </span>
          </div>

          {/* Quick preset quote pills */}
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#8C7662] dark:text-[#64748B] font-body block">
              Or pick a cozy suggestion:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {COZY_MOTIVATIONAL_PHRASES.slice(0, 5).map((q, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPhrase(q)}
                  className={`text-[11px] px-2.5 py-1 rounded-xl text-left font-body transition-all border ${
                    phrase === q
                      ? 'bg-[#8E7CC3]/20 border-[#8E7CC3] text-[#5A4688] dark:text-[#D1C6F3] font-bold'
                      : 'bg-[#FAF6EE] dark:bg-[#23273C] border-[#D7C9B1]/60 dark:border-[#3C4263] text-[#735A46] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#282C44]'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-[#E8E0D0] dark:border-[#2D334C]" />

        {/* ========================================================================= */}
        {/* 2. DECORATIVE IMAGE SECTION */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#735A46] dark:text-[#94A3B8] font-body flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-[#E27B9B]" />
              <span>Decorative Photo / Image</span>
            </label>

            {imageUrl && (
              <button
                type="button"
                onClick={handleRemoveImage}
                className="text-xs text-[#E07A5F] hover:text-[#C55A3F] font-bold font-body inline-flex items-center gap-1 hover:underline transition-all"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remove photo</span>
              </button>
            )}
          </div>

          {/* Photo Source Tabs */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-[#FAF6EE] dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#3C4263]">
            <button
              type="button"
              onClick={() => setActivePhotoSource('upload')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-body transition-all flex items-center justify-center gap-1.5 ${
                activePhotoSource === 'upload'
                  ? 'bg-[#8E7CC3] text-white shadow-xs'
                  : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-white/50'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload from Device</span>
            </button>
            <button
              type="button"
              onClick={() => setActivePhotoSource('presets')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold font-body transition-all flex items-center justify-center gap-1.5 ${
                activePhotoSource === 'presets'
                  ? 'bg-[#8E7CC3] text-white shadow-xs'
                  : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-white/50'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Aesthetic Presets</span>
            </button>
          </div>

          {/* Upload Tab */}
          {activePhotoSource === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="habit-banner-file-input"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D7C9B1] dark:border-[#3C4263] hover:border-[#8E7CC3] dark:hover:border-[#8E7CC3] bg-[#FAF6EE]/70 dark:bg-[#1A1C2B] rounded-2xl p-5 text-center cursor-pointer transition-all hover:bg-[#FAF6EE] group"
              >
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#23273C] text-[#8E7CC3] flex items-center justify-center mx-auto mb-2 border border-[#D7C9B1] dark:border-[#3C4263] group-hover:scale-105 transition-transform shadow-2xs">
                  {isProcessingFile ? (
                    <div className="w-5 h-5 border-2 border-[#8E7CC3] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                </div>
                <p className="text-xs font-bold text-[#4A3222] dark:text-[#E2E8F0] font-body">
                  {isProcessingFile
                    ? 'Optimizing and loading photo...'
                    : 'Click to select an image from your computer or phone'}
                </p>
                <p className="text-[10px] text-[#8C7662] dark:text-[#64748B] font-body mt-1">
                  Supports PNG, JPG, GIF, WebP (auto-optimized for local storage)
                </p>
              </div>
            </div>
          )}

          {/* Presets Tab */}
          {activePhotoSource === 'presets' && (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {COZY_PRESET_DECORATIONS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url, preset.caption)}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all aspect-square ${
                    imageUrl === preset.url
                      ? 'border-[#8E7CC3] ring-2 ring-[#8E7CC3]/40 shadow-xs'
                      : 'border-[#D7C9B1] dark:border-[#3C4263] hover:border-[#8E7CC3]'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {imageUrl === preset.url && (
                    <div className="absolute inset-0 bg-[#8E7CC3]/40 flex items-center justify-center">
                      <div className="w-5 h-5 rounded-full bg-white text-[#8E7CC3] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* If an image is selected, show Preview, Caption, & Layout options */}
          {imageUrl && (
            <div className="p-3.5 rounded-2xl bg-[#FAF6EE] dark:bg-[#1A1C2B] border border-[#D7C9B1] dark:border-[#3C4263] space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Live Miniature Preview */}
                <div className="relative shrink-0">
                  {layout === 'polaroid' && (
                    <div className="w-24 bg-white dark:bg-[#282C44] p-1.5 pb-2 rounded-lg shadow-md border border-[#D7C9B1] dark:border-[#3C4263] transform -rotate-2">
                      <div className="w-full h-16 rounded-xs overflow-hidden bg-stone-100">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="text-[9px] font-display italic text-center text-[#4A3222] dark:text-[#E2E8F0] truncate mt-1">
                        {imageCaption || 'Habit Photo'}
                      </div>
                    </div>
                  )}

                  {layout === 'frame' && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-[#8E7CC3] shadow-md">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {layout === 'sticker' && (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden p-1 bg-white dark:bg-[#282C44] shadow-md border border-dashed border-[#8E7CC3]">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#735A46] dark:text-[#94A3B8] font-body block mb-1">
                      Photo Caption / Subtitle
                    </label>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="e.g., Morning Focus ☕"
                      maxLength={30}
                      className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#3C4263] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] focus:outline-none focus:border-[#8E7CC3]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#735A46] dark:text-[#94A3B8] font-body block mb-1">
                      Display Frame Style
                    </label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setLayout('polaroid')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-body transition-all ${
                          layout === 'polaroid'
                            ? 'bg-[#8E7CC3] text-white shadow-2xs'
                            : 'bg-white dark:bg-[#23273C] text-[#735A46] dark:text-[#94A3B8] border border-[#D7C9B1] dark:border-[#3C4263]'
                        }`}
                      >
                        Polaroid
                      </button>
                      <button
                        type="button"
                        onClick={() => setLayout('frame')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-body transition-all ${
                          layout === 'frame'
                            ? 'bg-[#8E7CC3] text-white shadow-2xs'
                            : 'bg-white dark:bg-[#23273C] text-[#735A46] dark:text-[#94A3B8] border border-[#D7C9B1] dark:border-[#3C4263]'
                        }`}
                      >
                        Framed
                      </button>
                      <button
                        type="button"
                        onClick={() => setLayout('sticker')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-body transition-all ${
                          layout === 'sticker'
                            ? 'bg-[#8E7CC3] text-white shadow-2xs'
                            : 'bg-white dark:bg-[#23273C] text-[#735A46] dark:text-[#94A3B8] border border-[#D7C9B1] dark:border-[#3C4263]'
                        }`}
                      >
                        Sticker
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* ACTION BUTTONS */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between pt-3 border-t border-[#E8E0D0] dark:border-[#2D334C]">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE] dark:hover:bg-[#23273C] transition-all flex items-center gap-1.5 font-body"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE] dark:hover:bg-[#23273C] transition-all font-body"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white text-xs font-bold font-body shadow-xs flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
