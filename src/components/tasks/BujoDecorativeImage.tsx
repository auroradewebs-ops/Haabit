import React from 'react';
import { BujoImageLayout } from '../../types';

interface BujoDecorativeImageProps {
  imageUrl: string;
  imageLayout?: BujoImageLayout;
  caption?: string;
  className?: string;
  onEdit?: () => void;
}

export const BujoDecorativeImage: React.FC<BujoDecorativeImageProps> = ({
  imageUrl,
  imageLayout = 'polaroid',
  caption,
  className = '',
  onEdit,
}) => {
  if (!imageUrl) return null;

  // 1. Polaroid Style
  if (imageLayout === 'polaroid') {
    return (
      <div
        onClick={onEdit}
        className={`group relative inline-block my-2 cursor-pointer transition-transform hover:scale-[1.02] ${className}`}
      >
        {/* Top Washi Tape accent */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-[#E7DD6A]/80 border border-amber-300/60 shadow-2xs z-10 rotate-1" />

        <div className="bg-white p-2 pb-3 rounded-lg shadow-md border border-stone-200/80 max-w-[200px] sm:max-w-[230px] rotate-[-1deg] group-hover:rotate-0 transition-transform">
          <div className="w-full h-28 sm:h-32 rounded bg-stone-100 overflow-hidden">
            <img
              src={imageUrl}
              alt={caption || 'Decoración BuJo'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {caption ? (
            <p className="mt-1.5 text-center font-display italic text-[11px] text-stone-700 tracking-wide leading-tight line-clamp-1">
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
    return (
      <div
        onClick={onEdit}
        className={`group relative inline-block my-1.5 cursor-pointer transition-transform hover:scale-105 ${className}`}
      >
        <div
          className="relative bg-white p-1.5 shadow-md border-2 border-dashed border-stone-300 rounded-sm max-w-[130px]"
          style={{
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}
        >
          {/* Postmark stamp overlay effect */}
          <div className="absolute top-1 right-1 w-7 h-7 rounded-full border border-stone-600/40 pointer-events-none flex items-center justify-center -rotate-12 z-10">
            <span className="text-[7px] font-mono font-bold text-stone-600/60 leading-none">POST</span>
          </div>

          <div className="w-full h-20 bg-stone-100 overflow-hidden">
            <img
              src={imageUrl}
              alt={caption || 'Sello'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {caption && (
            <span className="block text-[9px] font-mono text-center text-stone-500 uppercase tracking-widest mt-0.5 truncate">
              {caption}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 3. Washi Tape Strip
  if (imageLayout === 'washi') {
    return (
      <div
        onClick={onEdit}
        className={`group relative block my-2 cursor-pointer transition-all ${className}`}
      >
        <div className="relative overflow-hidden rounded-md h-9 border border-amber-300/60 shadow-xs flex items-center px-3 bg-amber-50/90">
          <img
            src={imageUrl}
            alt="Washi Tape"
            className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply"
            loading="lazy"
          />
          {caption && (
            <span className="relative z-10 font-mono font-bold text-xs text-stone-800 tracking-wider">
              ✦ {caption}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 4. Die-cut Sticker Style
  if (imageLayout === 'sticker') {
    return (
      <div
        onClick={onEdit}
        className={`group relative inline-block my-1.5 cursor-pointer transition-transform hover:rotate-3 ${className}`}
      >
        <div className="bg-white p-1 rounded-2xl shadow-md border-2 border-white ring-1 ring-black/5 max-w-[120px]">
          <div className="w-full h-20 rounded-xl overflow-hidden bg-stone-50">
            <img
              src={imageUrl}
              alt={caption || 'Sticker'}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          {caption && (
            <span className="block text-[10px] font-bold text-stone-700 text-center font-body truncate px-1 mt-0.5">
              {caption}
            </span>
          )}
        </div>
      </div>
    );
  }

  // 5. Banner Layout
  return (
    <div
      onClick={onEdit}
      className={`group relative block my-2 cursor-pointer overflow-hidden rounded-2xl border border-stone-200/80 shadow-xs max-h-36 ${className}`}
    >
      <img
        src={imageUrl}
        alt={caption || 'Banner'}
        className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
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
