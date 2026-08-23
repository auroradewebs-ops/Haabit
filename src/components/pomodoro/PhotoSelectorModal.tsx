import React, { useState } from 'react';
import { FocusPhotoPreset } from '../../types';
import { Modal } from '../common/Modal';
import { PHOTO_PRESETS } from '../../utils/storage';
import { Image, Upload, Check, Sparkles, Sliders } from 'lucide-react';

interface PhotoSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl: string;
  onSelectPhoto: (url: string) => void;
  overlayOpacity: number;
  onOverlayOpacityChange: (opacity: number) => void;
}

export const PhotoSelectorModal: React.FC<PhotoSelectorModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl,
  onSelectPhoto,
  overlayOpacity,
  onOverlayOpacityChange,
}) => {
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'curated' | 'custom'>('curated');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSelectPhoto(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onSelectPhoto(customUrl.trim());
      setCustomUrl('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Focus Background Atmosphere"
      subtitle="Select a tranquil scenery or upload your personal sanctuary photo"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Tab selection */}
        <div className="flex items-center gap-2 border-b border-[#D7C9B1] dark:border-[#383D59] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('curated')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 ${
              activeTab === 'curated'
                ? 'bg-[#8E7CC3] text-white shadow-xs'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE] dark:hover:bg-[#23273C]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Sanctuary Photos</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 ${
              activeTab === 'custom'
                ? 'bg-[#8E7CC3] text-white shadow-xs'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE] dark:hover:bg-[#23273C]'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo / URL</span>
          </button>
        </div>

        {/* Curated Grid */}
        {activeTab === 'curated' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
            {PHOTO_PRESETS.map((preset) => {
              const isSelected = currentPhotoUrl === preset.url;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectPhoto(preset.url)}
                  className={`group relative rounded-2xl overflow-hidden aspect-4/3 text-left border-2 transition-all ${
                    isSelected
                      ? 'border-[#8E7CC3] ring-2 ring-[#8E7CC3] shadow-md scale-102'
                      : 'border-transparent hover:scale-98'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2 text-white">
                    <span className="text-[11px] font-bold font-body leading-tight drop-shadow">
                      {preset.title}
                    </span>
                    <span className="text-[9px] text-white/70 capitalize">
                      {preset.category}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#8E7CC3] text-white flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Custom Tab */}
        {activeTab === 'custom' && (
          <div className="space-y-4 py-2">
            <div className="p-6 border-2 border-dashed border-[#D7C9B1] dark:border-[#383D59] rounded-2xl text-center bg-[#FAF6EE] dark:bg-[#161825] hover:bg-[#F2EFF9]/50 transition-colors">
              <Upload className="w-8 h-8 text-[#8E7CC3] mx-auto mb-2" />
              <p className="text-xs font-bold text-[#4A3222] dark:text-[#F1F5F9] font-body mb-1">
                Upload image from device
              </p>
              <p className="text-[11px] text-[#735A46] dark:text-[#94A3B8] font-body mb-3">
                JPG, PNG, WebP supported
              </p>
              <label className="px-4 py-2 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white text-xs font-bold font-body cursor-pointer inline-block shadow-xs">
                Select Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <p className="text-xs font-bold text-[#4A3222] dark:text-[#F1F5F9] font-body mb-1.5">
                Or paste direct Image URL
              </p>
              <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#161825] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] focus:border-[#8E7CC3]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white text-xs font-bold font-body shrink-0"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Dimmer Overlay Opacity Slider */}
        <div className="p-4 bg-[#FAF6EE] dark:bg-[#161825] rounded-2xl border border-[#D7C9B1] dark:border-[#383D59] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#4A3222] dark:text-[#E2E8F0] font-body">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#8E7CC3]" />
              <span>Background Dimmer (Vignette)</span>
            </span>
            <span className="font-numeric">{Math.round(overlayOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.85"
            step="0.05"
            value={overlayOpacity}
            onChange={(e) => onOverlayOpacityChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#EFE7D8] dark:bg-[#2D334C] rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-[#735A46] dark:text-[#94A3B8]">
            <span>Brighter (Vivid)</span>
            <span>Darker (High Contrast)</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white text-xs font-bold font-body shadow-xs active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </Modal>
  );
};
