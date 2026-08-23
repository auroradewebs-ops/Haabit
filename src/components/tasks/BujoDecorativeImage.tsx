import React from 'react';
import { BujoImageLayout } from '../../types';
import { Camera, Move, Maximize2 } from 'lucide-react';

interface BujoDecorativeImageProps {
  imageUrl: string;
  imageLayout?: BujoImageLayout;
  caption?: string;
  imageSize?: 'sm' | 'md' | 'lg' | 'xl';
  imageZoom?: number;
  imageFocusX?: number;
  imageFocusY?: number;
  imageFit?: 'cover' | 'contain';
  className?: string;
  onEdit?: () => void;
}

export const BujoDecorativeImage: React.FC<BujoDecorativeImageProps> = ({
  imageUrl,
  imageLayout = 'polaroid',
  caption,
  imageSize = 'md',
  imageZoom = 100,
  imageFocusX = 50,
  imageFocusY = 50,
  imageFit = 'cover',
  className = '',
  onEdit,
}) => {
  if (!imageUrl) return null;

  const imgStyle: React.CSSProperties = {
    objectFit: imageFit || 'cover',
    objectPosition: `${imageFocusX ?? 50}% ${imageFocusY ?? 50}%`,
    transform: `scale(${(imageZoom ?? 100) / 100})`,
    transition: 'transform 0.2s ease, object-position 0.2s ease',
  };

  // 1. Polaroid Style
  if (imageLayout === 'polaroid') {
    const sizeClasses =
      imageSize === 'sm'
        ? 'max-w-[150px] sm:max-w-[170px]'
        : imageSize === 'lg'
        ? 'max-w-[260px] sm:max-w-[300px]'
        : imageSize === 'xl'
        ? 'max-w-[320px] sm:max-w-[360px]'
        : 'max-w-[200px] sm:max-w-[230px]';

    const heightClasses =
      imageSize === 'sm'
        ? 'h-20 sm:h-24'
        : imageSize === 'lg'
        ? 'h-36 sm:h-44'
        : imageSize === 'xl'
        ? 'h-48 sm:h-56'
        : 'h-28 sm:h-32';

    return (
      <div
        onClick={onEdit}
        className={`group relative inline-block my-2 cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
        title="Click to modify photo framing, focus, or size"
      >
        {/* Top Washi Tape accent */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#E7DD6A]/80 border border-amber-300/60 shadow-2xs z-10 rotate-1 pointer-events-none" />

        <div className={`bg-white dark:bg-[#282C44] p-2 pb-3 rounded-lg shadow-md border border-stone-200/80 dark:border-[#3C4263] ${sizeClasses} rotate-[-1deg] group-hover:rotate-0 transition-transform`}>
          <div className={`w-full ${heightClasses} rounded bg-stone-100 dark:bg-stone-800 overflow-hidden relative`}>
            <img
              src={imageUrl}
              alt={caption || 'Decoración BuJo'}
              className="w-full h-full"
              style={imgStyle}
              loading="lazy"
            />
            {/* Quick edit overlay */}
            <div className="absolute inset-0 bg-[#8E7CC3]/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <div className="p-1.5 rounded-full bg-white/90 text-[#8E7CC3] shadow-xs">
                <Camera className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
          {caption ? (
            <p className="mt-1.5 text-center font-display italic text-[11px] text-stone-700 dark:text-stone-200 tracking-wide leading-tight line-clamp-1">
              {caption}
            </p>
          ) : (
            <div className="h-2" />
          )}
        </div>
      </div>
    );
  }

  // 2. Vintage Postage Stamp Style
  if (imageLayout === 'stamp') {
    const sizeClasses =
      imageSize === 'sm'
        ? 'max-w-[100px]'
        : imageSize === 'lg'
        ? 'max-w-[170px]'
        : imageSize === 'xl'
        ? 'max-w-[210px]'
        : 'max-w-[130px]';

    const heightClasses =
      imageSize === 'sm'
        ? 'h-16'
        : imageSize === 'lg'
        ? 'h-28'
        : imageSize === 'xl'
        ? 'h-36'
        : 'h-20';

    return (
      <div
        onClick={onEdit}
        className={`group relative inline-block my-1.5 cursor-pointer transition-transform hover:scale-105 ${className}`}
        title="Click to modify stamp size & focus"
      >
        <div
          className={`relative bg-white dark:bg-[#282C44] p-1.5 shadow-md border-2 border-dashed border-stone-300 dark:border-stone-600 rounded-sm ${sizeClasses}`}
        >
          {/* Postmark stamp overlay effect */}
          <div className="absolute top-1 right-1 w-7 h-7 rounded-full border border-stone-600/40 pointer-events-none flex items-center justify-center -rotate-12 z-10">
            <span className="text-[7px] font-mono font-bold text-stone-600/60 leading-none">POST</span>
          </div>

          <div className={`w-full ${heightClasses} bg-stone-100 dark:bg-stone-800 overflow-hidden relative`}>
            <img
              src={imageUrl}
              alt={caption || 'Sello'}
              className="w-full h-full"
              style={imgStyle}
              loading="lazy"
            />
          </div>
          {caption && (
            <span className="block text-[9px] font-mono text-center text-stone-500 dark:text-stone-400 uppercase tracking-widest mt-0.5 truncate">
              {caption}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 3. Washi Tape Strip
  if (imageLayout === 'washi') {
    const heightClasses =
      imageSize === 'sm'
        ? 'h-7'
        : imageSize === 'lg'
        ? 'h-12'
        : imageSize === 'xl'
        ? 'h-14'
        : 'h-9';

    return (
      <div
        onClick={onEdit}
        className={`group relative block my-2 cursor-pointer transition-all ${className}`}
        title="Click to modify washi tape"
      >
        <div className={`relative overflow-hidden rounded-md ${heightClasses} border border-amber-300/60 shadow-xs flex items-center px-3 bg-amber-50/90 dark:bg-[#282C44]`}>
          <img
            src={imageUrl}
            alt="Washi Tape"
            className="absolute inset-0 w-full h-full opacity-60 mix-blend-multiply"
            style={imgStyle}
            loading="lazy"
          />
          {caption && (
            <span className="relative z-10 font-mono font-bold text-xs text-stone-800 dark:text-stone-100 tracking-wider">
              ✦ {caption}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 4. Die-cut Sticker Style
  if (imageLayout === 'sticker') {
    const sizeClasses =
      imageSize === 'sm'
        ? 'max-w-[90px]'
        : imageSize === 'lg'
        ? 'max-w-[160px]'
        : imageSize === 'xl'
        ? 'max-w-[200px]'
        : 'max-w-[120px]';

    const heightClasses =
      imageSize === 'sm'
        ? 'h-16'
        : imageSize === 'lg'
        ? 'h-28'
        : imageSize === 'xl'
        ? 'h-36'
        : 'h-20';

    return (
      <div
        onClick={onEdit}
        className={`group relative inline-block my-1.5 cursor-pointer transition-transform hover:rotate-3 ${className}`}
        title="Click to modify sticker size & focus"
      >
        <div className={`bg-white dark:bg-[#282C44] p-1 rounded-2xl shadow-md border-2 border-white dark:border-[#3C4263] ring-1 ring-black/5 ${sizeClasses}`}>
          <div className={`w-full ${heightClasses} rounded-xl overflow-hidden bg-stone-50 dark:bg-stone-800 relative`}>
            <img
              src={imageUrl}
              alt={caption || 'Sticker'}
              className="w-full h-full"
              style={imgStyle}
              loading="lazy"
            />
          </div>
          {caption && (
            <span className="block text-[10px] font-bold text-stone-700 dark:text-stone-300 text-center font-body truncate px-1 mt-0.5">
              {caption}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 5. Banner Layout
  const bannerHeightClasses =
    imageSize === 'sm'
      ? 'h-24'
      : imageSize === 'lg'
      ? 'h-44'
      : imageSize === 'xl'
      ? 'h-52'
      : 'h-32';

  return (
    <div
      onClick={onEdit}
      className={`group relative block my-2 cursor-pointer overflow-hidden rounded-2xl border border-stone-200/80 dark:border-[#3C4263] shadow-xs ${className}`}
      title="Click to modify banner size & focus"
    >
      <img
        src={imageUrl}
        alt={caption || 'Banner'}
        className={`w-full ${bannerHeightClasses}`}
        style={imgStyle}
        loading="lazy"
      />
      {caption && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-2 text-white font-body text-xs">
          {caption}
        </div>
      )}
    </div>
  );
};
