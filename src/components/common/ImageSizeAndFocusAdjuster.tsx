import React, { useRef } from 'react';
import {
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  Target,
  Move,
  RotateCcw,
  Sparkles,
  Layers,
} from 'lucide-react';

export interface ImageSizeAndFocusProps {
  size: 'sm' | 'md' | 'lg' | 'xl';
  onChangeSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  zoom: number; // 100 to 250
  onChangeZoom: (zoom: number) => void;
  focusX: number; // 0 to 100
  onChangeFocusX: (x: number) => void;
  focusY: number; // 0 to 100
  onChangeFocusY: (y: number) => void;
  fit: 'cover' | 'contain';
  onChangeFit: (fit: 'cover' | 'contain') => void;
  previewUrl?: string | null;
  className?: string;
}

const PRESET_FOCUS_POINTS = [
  { label: 'Top-Left', x: 15, y: 15, icon: '↖' },
  { label: 'Top', x: 50, y: 10, icon: '↑' },
  { label: 'Top-Right', x: 85, y: 15, icon: '↗' },
  { label: 'Left', x: 10, y: 50, icon: '←' },
  { label: 'Center', x: 50, y: 50, icon: '•' },
  { label: 'Right', x: 90, y: 50, icon: '→' },
  { label: 'Bottom-Left', x: 15, y: 85, icon: '↙' },
  { label: 'Bottom', x: 50, y: 90, icon: '↓' },
  { label: 'Bottom-Right', x: 85, y: 85, icon: '↘' },
];

export const ImageSizeAndFocusAdjuster: React.FC<ImageSizeAndFocusProps> = ({
  size,
  onChangeSize,
  zoom,
  onChangeZoom,
  focusX,
  onChangeFocusX,
  focusY,
  onChangeFocusY,
  fit,
  onChangeFit,
  previewUrl,
  className = '',
}) => {
  const previewRef = useRef<HTMLDivElement>(null);

  const handlePreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const percentX = Math.round(Math.max(0, Math.min(100, (clickX / rect.width) * 100)));
    const percentY = Math.round(Math.max(0, Math.min(100, (clickY / rect.height) * 100)));
    onChangeFocusX(percentX);
    onChangeFocusY(percentY);
  };

  const handleResetFocus = () => {
    onChangeFocusX(50);
    onChangeFocusY(50);
    onChangeZoom(100);
    onChangeFit('cover');
  };

  return (
    <div className={`space-y-4 p-3.5 sm:p-4 rounded-2xl bg-[#FAF6EE] dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#3C4263] ${className}`}>
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-[#735A46] dark:text-[#94A3B8] font-body flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-[#8E7CC3]" />
          <span>Size & Image Focus Framing</span>
        </label>

        <button
          type="button"
          onClick={handleResetFocus}
          className="text-[11px] text-[#8E7CC3] hover:text-[#7B68B4] dark:text-[#A798DD] font-bold font-body inline-flex items-center gap-1 hover:underline active:scale-95 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset focus</span>
        </button>
      </div>

      {/* 1. Box Size Selector */}
      <div className="space-y-1.5">
        <span className="text-[11px] font-bold text-[#735A46] dark:text-[#94A3B8] font-body block">
          Display Box Size
        </span>
        <div className="grid grid-cols-4 gap-1.5">
          <button
            type="button"
            onClick={() => onChangeSize('sm')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold font-body transition-all flex flex-col items-center justify-center border ${
              size === 'sm'
                ? 'bg-[#8E7CC3] text-white border-[#8E7CC3] shadow-xs'
                : 'bg-white dark:bg-[#23273C] text-[#735A46] dark:text-[#94A3B8] border-[#D7C9B1] dark:border-[#3C4263] hover:bg-[#FAF6EE]'
            }`}
          >
            <span>Compact</span>
            <span className="text-[9px] opacity-80">Small</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeSize('md')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold font-body transition-all flex flex-col items-center justify-center border ${
              size === 'md'
                ? 'bg-[#8E7CC3] text-white border-[#8E7CC3] shadow-xs'
                : 'bg-white dark:bg-[#23273C] text-[#735A46] dark:text-[#94A3B8] border-[#D7C9B1] dark:border-[#3C4263] hover:bg-[#FAF6EE]'
            }`}
          >
            <span>Standard</span>
            <span className="text-[9px] opacity-80">Medium</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeSize('lg')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold font-body transition-all flex flex-col items-center justify-center border ${
              size === 'lg'
                ? 'bg-[#8E7CC3] text-white border-[#8E7CC3] shadow-xs'
                : 'bg-white dark:bg-[#23273C] text-[#735A46] dark:text-[#94A3B8] border-[#D7C9B1] dark:border-[#3C4263] hover:bg-[#FAF6EE]'
            }`}
          >
            <span>Large</span>
            <span className="text-[9px] opacity-80">Wide</span>
          </button>

          <button
            type="button"
            onClick={() => onChangeSize('xl')}
            className={`py-1.5 px-2 rounded-xl text-xs font-bold font-body transition-all flex flex-col items-center justify-center border ${
              size === 'xl'
                ? 'bg-[#8E7CC3] text-white border-[#8E7CC3] shadow-xs'
                : 'bg-white dark:bg-[#23273C] text-[#735A46] dark:text-[#94A3B8] border-[#D7C9B1] dark:border-[#3C4263] hover:bg-[#FAF6EE]'
            }`}
          >
            <span>Feature</span>
            <span className="text-[9px] opacity-80">Extra</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Focus Position & Zoom Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        
        {/* Left: Interactive Click-to-Focus Preview Pad */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#735A46] dark:text-[#94A3B8] font-body flex items-center gap-1">
              <Move className="w-3 h-3 text-[#8E7CC3]" />
              <span>Tap image to set focus point</span>
            </span>
            <span className="text-[10px] font-numeric text-[#8C7662] dark:text-[#94A3B8]">
              X: {focusX}% • Y: {focusY}%
            </span>
          </div>

          <div
            ref={previewRef}
            onClick={handlePreviewClick}
            className="relative h-28 w-full rounded-xl overflow-hidden cursor-crosshair border-2 border-[#D7C9B1] dark:border-[#3C4263] bg-stone-900 shadow-inner group select-none"
            title="Click anywhere to shift focal center"
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Focus preview"
                className="w-full h-full pointer-events-none transition-all duration-150"
                style={{
                  objectFit: fit,
                  objectPosition: `${focusX}% ${focusY}%`,
                  transform: `scale(${zoom / 100})`,
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-stone-400 font-body">
                No image loaded
              </div>
            )}

            {/* Crosshair Target Indicator */}
            <div
              className="absolute w-5 h-5 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center transition-all duration-100"
              style={{ left: `${focusX}%`, top: `${focusY}%` }}
            >
              <div className="w-5 h-5 rounded-full border-2 border-white bg-[#8E7CC3]/60 shadow-lg flex items-center justify-center animate-pulse">
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
            </div>

            {/* Visual Guide Grid Overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-20 border border-white/40">
              <div className="border-r border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-r border-b border-white/30" />
              <div className="border-b border-white/30" />
              <div className="border-r border-white/30" />
              <div className="border-r border-white/30" />
              <div />
            </div>
          </div>
        </div>

        {/* Right: 9-Point Focus Presets & Fit Toggle */}
        <div className="space-y-2">
          <div>
            <span className="text-[11px] font-bold text-[#735A46] dark:text-[#94A3B8] font-body block mb-1">
              Quick Focus Direction
            </span>
            <div className="grid grid-cols-3 gap-1">
              {PRESET_FOCUS_POINTS.map((pt) => {
                const isSelected =
                  Math.abs(focusX - pt.x) <= 15 && Math.abs(focusY - pt.y) <= 15;
                return (
                  <button
                    key={pt.label}
                    type="button"
                    onClick={() => {
                      onChangeFocusX(pt.x);
                      onChangeFocusY(pt.y);
                    }}
                    className={`py-1 rounded-lg text-xs font-bold font-body transition-all border flex items-center justify-center gap-1 ${
                      isSelected
                        ? 'bg-[#8E7CC3] text-white border-[#8E7CC3] shadow-2xs font-extrabold'
                        : 'bg-white dark:bg-[#23273C] text-[#735A46] dark:text-[#94A3B8] border-[#D7C9B1] dark:border-[#3C4263] hover:bg-[#FAF6EE]'
                    }`}
                    title={pt.label}
                  >
                    <span>{pt.icon}</span>
                    <span className="text-[10px] hidden sm:inline">{pt.label.split('-')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#735A46] dark:text-[#94A3B8] font-body block mb-1">
              Fill & Crop Mode
            </span>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => onChangeFit('cover')}
                className={`py-1 px-2 rounded-lg text-xs font-bold font-body transition-all border text-center ${
                  fit === 'cover'
                    ? 'bg-[#8E7CC3] text-white border-[#8E7CC3] shadow-2xs'
                    : 'bg-white dark:bg-[#23273C] text-[#735A46] dark:text-[#94A3B8] border-[#D7C9B1] dark:border-[#3C4263]'
                }`}
              >
                Cover (Fill Box)
              </button>
              <button
                type="button"
                onClick={() => onChangeFit('contain')}
                className={`py-1 px-2 rounded-lg text-xs font-bold font-body transition-all border text-center ${
                  fit === 'contain'
                    ? 'bg-[#8E7CC3] text-white border-[#8E7CC3] shadow-2xs'
                    : 'bg-white dark:bg-[#23273C] text-[#735A46] dark:text-[#94A3B8] border-[#D7C9B1] dark:border-[#3C4263]'
                }`}
              >
                Contain (Full View)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Zoom / Scale Slider */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-[#735A46] dark:text-[#94A3B8] font-body">
          <span className="flex items-center gap-1.5">
            <ZoomIn className="w-3.5 h-3.5 text-[#8E7CC3]" />
            <span>Image Zoom / Crop Level</span>
          </span>
          <span className="font-numeric text-[#8E7CC3] dark:text-[#A798DD] font-extrabold">
            {(zoom / 100).toFixed(1)}x ({zoom}%)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeZoom(Math.max(100, zoom - 20))}
            className="p-1 rounded-lg bg-white dark:bg-[#23273C] border border-[#D7C9B1] dark:border-[#3C4263] text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE]"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <input
            type="range"
            min={100}
            max={250}
            step={5}
            value={zoom}
            onChange={(e) => onChangeZoom(Number(e.target.value))}
            className="flex-1 accent-[#8E7CC3] h-1.5 bg-stone-200 dark:bg-stone-700 rounded-lg cursor-pointer"
          />

          <button
            type="button"
            onClick={() => onChangeZoom(Math.min(250, zoom + 20))}
            className="p-1 rounded-lg bg-white dark:bg-[#23273C] border border-[#D7C9B1] dark:border-[#3C4263] text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE]"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
