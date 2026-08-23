import React, { useState } from 'react';
import { Task, BujoPaperSettings } from '../../types';
import { soundEngine } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  Sun,
  CloudRain,
  Cloud,
  Flower2,
  Moon,
  ChevronRight,
  ChevronLeft,
  Camera,
  Edit3,
  Plus,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  FileText,
  Heart,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { BujoDecorationPickerModal } from './BujoDecorationPickerModal';

export type WeatherMood = 'sunny' | 'rainy' | 'cloudy' | 'sakura' | 'night';

interface BujoScrapbookSpreadProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onUpdateTaskBujo: (id: string, updates: Partial<Task>) => void;
  onQuickAddTask: (taskData: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
  paperSettings: BujoPaperSettings;
  activeCollectionTab: string;
  onSelectCollectionTab: (tab: string) => void;
}

export const BujoScrapbookSpread: React.FC<BujoScrapbookSpreadProps> = ({
  tasks,
  onToggleComplete,
  onUpdateTaskBujo,
  onQuickAddTask,
  onEditTask,
  paperSettings,
  activeCollectionTab,
  onSelectCollectionTab,
}) => {
  // Weather state (persisted locally)
  const [weather, setWeather] = useState<WeatherMood>(() => {
    return (localStorage.getItem('whimsical_bujo_weather') as WeatherMood) || 'sunny';
  });

  const handleWeatherChange = (newWeather: WeatherMood) => {
    setWeather(newWeather);
    localStorage.setItem('whimsical_bujo_weather', newWeather);
    soundEngine.playClick();
  };

  // Current page index in double-page spread
  const [pageIndex, setPageIndex] = useState(0);

  // Modal to customize decoration on page
  const [decoratingItem, setDecoratingItem] = useState<{
    pageSide: 'left' | 'right';
    task?: Task;
  } | null>(null);

  // Left & Right page reflection notes (saved in local storage)
  const [leftNote, setLeftNote] = useState(() => {
    return (
      localStorage.getItem('whimsical_bujo_left_note') ||
      'Cherishing sunny summer afternoons and mindful progress...'
    );
  });
  const [rightNote, setRightNote] = useState(() => {
    return (
      localStorage.getItem('whimsical_bujo_right_note') ||
      'Gentle blossoms blooming after rain • Peaceful moments'
    );
  });

  const [isEditingLeftNote, setIsEditingLeftNote] = useState(false);
  const [isEditingRightNote, setIsEditingRightNote] = useState(false);

  // Left and Right primary tasks/memories
  const memoryItems = tasks.filter((t) => t.imageUrl || t.notes || t.bujoType);
  const leftTask = memoryItems[pageIndex * 2] || tasks[0];
  const rightTask = memoryItems[pageIndex * 2 + 1] || tasks[1];

  const totalPages = Math.max(1, Math.ceil((memoryItems.length || 1) / 2));

  const handleNextPage = () => {
    if (pageIndex < totalPages - 1) {
      setPageIndex((p) => p + 1);
      soundEngine.playClick();
    } else {
      setPageIndex(0);
      soundEngine.playClick();
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 0) {
      setPageIndex((p) => p - 1);
      soundEngine.playClick();
    }
  };

  // Weather icon mapping
  const weatherIcons: Record<WeatherMood, { icon: React.ReactNode; label: string; symbol: string }> = {
    sunny: { icon: <Sun className="w-3.5 h-3.5 text-amber-500" />, label: 'Sunny', symbol: '☀️' },
    rainy: { icon: <CloudRain className="w-3.5 h-3.5 text-blue-500" />, label: 'Rainy', symbol: '🌧️' },
    cloudy: { icon: <Cloud className="w-3.5 h-3.5 text-stone-500" />, label: 'Cloudy', symbol: '⛅' },
    sakura: { icon: <Flower2 className="w-3.5 h-3.5 text-pink-500" />, label: 'Spring', symbol: '🌸' },
    night: { icon: <Moon className="w-3.5 h-3.5 text-indigo-400" />, label: 'Moonlit', symbol: '🌙' },
  };

  // Date formatting in clear storybook style
  const now = new Date();
  const dateStrLeft = `${now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} • ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  return (
    <div className="relative my-4 select-none">
      {/* Outer Atmosphere with Soft Violet & Woodland tones */}
      <div className="relative bg-gradient-to-b from-[#7B68B4] via-[#8E7CC3] to-[#5A4688] p-3 sm:p-5 lg:p-7 rounded-2xl sm:rounded-3xl shadow-xl border-2 sm:border-4 border-[#6A5499] overflow-hidden">
        
        {/* Subtle Ambient Glows in Corners */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

        {/* Green Leaf Overlays in Upper & Bottom Corners */}
        <div className="absolute top-2 left-2 z-30 pointer-events-none opacity-80 sm:opacity-90">
          <span className="text-2xl sm:text-3xl lg:text-4xl drop-shadow-md">🌿</span>
        </div>

        <div className="absolute bottom-2 left-2 z-30 pointer-events-none opacity-80 sm:opacity-90">
          <span className="text-2xl sm:text-3xl lg:text-4xl drop-shadow-md">🍃</span>
        </div>

        {/* Vintage Fountain Pen Ornament on Right Margin */}
        <div className="hidden xl:block absolute top-12 right-2 z-30 pointer-events-none opacity-90 rotate-12">
          <div className="flex flex-col items-center">
            <div className="w-1.5 h-16 bg-gradient-to-b from-stone-200 to-stone-400 rounded-sm shadow-xs -mt-1 border border-stone-400" />
            <div className="w-3.5 h-12 rounded-sm bg-gradient-to-b from-indigo-900 to-purple-950 border-y border-white/40" />
            <div className="w-2 h-4 bg-stone-300 rounded-b-full border-t border-stone-500" />
          </div>
        </div>

        {/* Top Control Ribbon: Mode & Scrapbook Title */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/20 text-white gap-2 flex-wrap">
          <div className="flex items-center gap-2 pl-1 sm:pl-4 lg:pl-8">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-[#F4B843] font-bold border border-white/30 shrink-0">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display italic font-bold text-base sm:text-lg lg:text-xl text-white tracking-wide flex items-center gap-2 flex-wrap">
                <span className="truncate">Memories Album & Storybook</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F4B843] text-[#3B2A1E] font-bold shrink-0">
                  Double Spread
                </span>
              </h3>
              <p className="text-[11px] text-white/85 font-body hidden sm:block">
                Ring-bound journal spread with polaroids, weather stamps, and daily memories.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 pr-1">
            <button
              type="button"
              onClick={handlePrevPage}
              disabled={pageIndex === 0}
              className={`p-1.5 sm:p-2 rounded-xl border backdrop-blur-md transition-all shrink-0 ${
                pageIndex === 0
                  ? 'opacity-40 border-white/10 text-white/40 cursor-not-allowed'
                  : 'bg-white/15 border-white/30 text-white hover:bg-white/25 active:scale-95'
              }`}
              title="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono text-[11px] sm:text-xs text-white font-bold bg-white/15 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-white/25 whitespace-nowrap shrink-0">
              Pages {pageIndex * 2 + 1}-{pageIndex * 2 + 2} / {totalPages * 2}
            </span>

            <button
              type="button"
              onClick={handleNextPage}
              className="p-1.5 sm:p-2 rounded-xl bg-white/15 border border-white/30 text-white hover:bg-white/25 active:scale-95 backdrop-blur-md transition-all shrink-0"
              title="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* The Open Ring-Bound Book Container (Double Page Spread) */}
        <div className="relative flex flex-col lg:flex-row items-stretch justify-center pl-0 md:pl-2 lg:pl-6 pr-0 md:pr-2 lg:pr-10">
          
          {/* Mobile & Tablet Index Tabs Bar (Visible on mobile/tablet screens < 1024px) */}
          <div className="flex lg:hidden items-center justify-start sm:justify-center gap-1.5 pb-3 overflow-x-auto w-full">
            <button
              type="button"
              onClick={() => onSelectCollectionTab('album')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-body transition-all border whitespace-nowrap shrink-0 ${
                activeCollectionTab === 'album'
                  ? 'bg-[#FAF6EE] text-[#5A3B18] border-[#A88B60] shadow-xs font-extrabold'
                  : 'bg-white/20 text-white border-white/20'
              }`}
            >
              Album
            </button>
            <button
              type="button"
              onClick={() => onSelectCollectionTab('daily')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-body transition-all border whitespace-nowrap shrink-0 ${
                activeCollectionTab === 'daily'
                  ? 'bg-[#FAF6EE] text-[#5A3B18] border-[#A88B60] shadow-xs font-extrabold'
                  : 'bg-white/20 text-white border-white/20'
              }`}
            >
              Tasks
            </button>
            <button
              type="button"
              onClick={() => onSelectCollectionTab('monthly')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-body transition-all border whitespace-nowrap shrink-0 ${
                activeCollectionTab === 'monthly'
                  ? 'bg-[#FAF6EE] text-[#5A3B18] border-[#A88B60] shadow-xs font-extrabold'
                  : 'bg-white/20 text-white border-white/20'
              }`}
            >
              Journal
            </button>
            <button
              type="button"
              onClick={() => onSelectCollectionTab('future')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-body transition-all border whitespace-nowrap shrink-0 ${
                activeCollectionTab === 'future'
                  ? 'bg-[#FAF6EE] text-[#5A3B18] border-[#A88B60] shadow-xs font-extrabold'
                  : 'bg-white/20 text-white border-white/20'
              }`}
            >
              Collections
            </button>
          </div>

          {/* Main Book Surface - 2 Pages Side by Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl bg-[#FAF6EE] rounded-2xl sm:rounded-3xl shadow-xl border-2 border-[#D7C9B1] relative overflow-hidden">
            
            {/* Center Rings Binding Wire Overlay (Tablet & Desktop View) */}
            <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 lg:w-12 z-30 flex-col justify-around items-center pointer-events-none py-6">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="relative flex items-center justify-center w-full">
                  {/* Left punched hole */}
                  <div className="w-3 lg:w-3.5 h-3 lg:h-3.5 rounded-full bg-[#382D21] border border-stone-600 shadow-inner -mr-1" />
                  
                  {/* Metallic Double Ring Wire with 3D Reflection */}
                  <div className="w-8 lg:w-9 h-3 lg:h-3.5 rounded-md bg-gradient-to-r from-stone-400 via-stone-100 to-stone-400 shadow-[0_2px_4px_rgba(0,0,0,0.4)] border-y border-stone-500/80 -mx-1 z-10" />
                  
                  {/* Right punched hole */}
                  <div className="w-3 lg:w-3.5 h-3 lg:h-3.5 rounded-full bg-[#382D21] border border-stone-600 shadow-inner -ml-1" />
                </div>
              ))}
            </div>

            {/* Subtle Center Book Spine Fold Shadow */}
            <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 lg:w-16 bg-gradient-to-r from-black/10 via-transparent to-black/10 pointer-events-none z-20" />

            {/* ========================================================================= */}
            {/* LEFT PAGE: First Encounter / Featured Memory */}
            {/* ========================================================================= */}
            <div className="p-4 sm:p-5 lg:p-7 border-b md:border-b-0 md:border-r border-[#E5DAC6] relative flex flex-col justify-between min-h-[460px] sm:min-h-[520px]">
              
              {/* Header Stamp: Date & Weather */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-300/80 text-[11px] font-mono text-stone-600">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#8C5E48]">Date</span>
                  <span className="font-numeric font-medium tracking-tight text-stone-800">
                    {dateStrLeft}
                  </span>
                </div>

                {/* Weather Selector Widget */}
                <div className="flex items-center gap-1 bg-[#EFE8D8] px-2 py-0.5 rounded-full border border-stone-300">
                  <span className="font-bold text-[10px] text-stone-500 uppercase mr-1">Weather</span>
                  {(['sunny', 'rainy', 'cloudy', 'sakura', 'night'] as WeatherMood[]).map((w) => (
                    <button
                      key={w}
                      type="button"
                      onClick={() => handleWeatherChange(w)}
                      className={`p-1 rounded-full transition-all ${
                        weather === w
                          ? 'bg-white shadow-xs scale-110 ring-1 ring-amber-400'
                          : 'opacity-50 hover:opacity-100'
                      }`}
                      title={weatherIcons[w].label}
                    >
                      {weatherIcons[w].icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title on Kraft / Washi Tape Banner */}
              <div className="mb-4 relative">
                <div className="relative inline-block bg-[#F2DC9B] px-5 py-1.5 rounded-sm shadow-xs border-y border-[#D6BF7C] -rotate-0.5">
                  <div className="absolute -left-1.5 inset-y-0 w-2 bg-[#F2DC9B] border-l border-dashed border-[#B89F5B]" />
                  <div className="absolute -right-1.5 inset-y-0 w-2 bg-[#F2DC9B] border-r border-dashed border-[#B89F5B]" />
                  
                  <h4 className="font-display italic font-bold text-base sm:text-lg text-[#5A3B18] tracking-wider">
                    {leftTask ? `「 ${leftTask.title} 」` : '「 Golden Afternoon • First Memory 」'}
                  </h4>
                </div>

                <span className="absolute -top-3 -left-2 text-amber-700/60 font-mono text-sm rotate-12">
                  ↶
                </span>
              </div>

              {/* Central Polaroid Memory Photo Card */}
              <div className="relative my-auto flex justify-center py-2">
                <div className="group relative bg-white p-3 pb-4 rounded-md shadow-lg border border-stone-200/90 max-w-xs sm:max-w-sm rotate-[-1deg] hover:rotate-0 transition-transform">
                  
                  {/* Top-Left & Bottom-Right Washi Tape Strips */}
                  <div className="absolute -top-3 -left-3 w-14 h-5 bg-white/80 border border-stone-300 shadow-2xs rotate-[-30deg] z-20 backdrop-blur-xs" />
                  <div className="absolute -bottom-3 -right-3 w-14 h-5 bg-white/80 border border-stone-300 shadow-2xs rotate-[-30deg] z-20 backdrop-blur-xs" />

                  {/* Photo Container */}
                  <div className="w-full h-44 sm:h-52 rounded bg-stone-100 overflow-hidden relative">
                    <img
                      src={
                        leftTask?.imageUrl ||
                        'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={leftTask?.title || 'Summer Memory'}
                      className="w-full h-full object-cover"
                    />

                    {/* Quick Edit Decoration Button */}
                    <button
                      type="button"
                      onClick={() => setDecoratingItem({ pageSide: 'left', task: leftTask })}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Change photo / sticker"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtitle / Caption inside Polaroid frame */}
                  <p className="mt-2.5 text-center font-display italic text-xs text-stone-700 font-medium px-2">
                    {leftTask?.imageCaption ||
                      'Under the bright warm summer sunlight, a fresh start begins.'}
                  </p>
                </div>
              </div>

              {/* Bottom Handwritten Note Strip with Bird Sticker */}
              <div className="mt-4 pt-2">
                <div className="relative bg-[#E8EFE5] px-4 py-2 rounded-xl border border-[#C5D8C0] flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" title="Songbird mascot">
                      🐦
                    </span>
                    {isEditingLeftNote ? (
                      <input
                        type="text"
                        value={leftNote}
                        onChange={(e) => setLeftNote(e.target.value)}
                        onBlur={() => {
                          setIsEditingLeftNote(false);
                          localStorage.setItem('whimsical_bujo_left_note', leftNote);
                        }}
                        autoFocus
                        className="bg-transparent border-b border-stone-500 text-xs font-display italic text-[#2F4A2C] focus:outline-none w-full"
                      />
                    ) : (
                      <p
                        onClick={() => setIsEditingLeftNote(true)}
                        className="font-display italic text-xs text-[#2F4A2C] cursor-pointer hover:underline"
                        title="Click to edit reflection note"
                      >
                        {leftNote}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingLeftNote(!isEditingLeftNote)}
                    className="p-1 text-stone-400 hover:text-stone-700"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* RIGHT PAGE: Dandelions & Mindful Focus Entry */}
            {/* ========================================================================= */}
            <div className="p-4 sm:p-7 relative flex flex-col justify-between min-h-[460px] sm:min-h-[520px]">
              
              {/* Header Stamp: Date & Weather */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-300/80 text-[11px] font-mono text-stone-600">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#8C5E48]">Date</span>
                  <span className="font-numeric font-medium tracking-tight text-stone-800">
                    {dateStrLeft}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-[#EFE8D8] px-2 py-0.5 rounded-full border border-stone-300">
                  <span className="font-bold text-[10px] text-stone-500 uppercase mr-1">Weather</span>
                  <span className="text-sm">{weatherIcons[weather].symbol}</span>
                </div>
              </div>

              {/* Title on Kraft / Washi Tape Banner */}
              <div className="mb-4 relative flex items-center justify-between">
                <div className="relative inline-block bg-[#F2DC9B] px-5 py-1.5 rounded-sm shadow-xs border-y border-[#D6BF7C] rotate-0.5">
                  <div className="absolute -left-1.5 inset-y-0 w-2 bg-[#F2DC9B] border-l border-dashed border-[#B89F5B]" />
                  <div className="absolute -right-1.5 inset-y-0 w-2 bg-[#F2DC9B] border-r border-dashed border-[#B89F5B]" />
                  
                  <h4 className="font-display italic font-bold text-base sm:text-lg text-[#5A3B18] tracking-wider">
                    {rightTask ? `「 ${rightTask.title} 」` : '「 Shared Memories • Summer Dandelions 」'}
                  </h4>
                </div>

                <span className="text-amber-700/60 font-mono text-sm -rotate-12">
                  ↗
                </span>
              </div>

              {/* Central Polaroid Memory Photo Card */}
              <div className="relative my-auto flex justify-center py-2">
                <div className="group relative bg-white p-3 pb-4 rounded-md shadow-lg border border-stone-200/90 max-w-xs sm:max-w-sm rotate-[1deg] hover:rotate-0 transition-transform">
                  
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-white/80 border border-stone-300 shadow-2xs rotate-1 z-20 backdrop-blur-xs" />

                  {/* Photo Container */}
                  <div className="w-full h-44 sm:h-52 rounded bg-stone-100 overflow-hidden relative">
                    <img
                      src={
                        rightTask?.imageUrl ||
                        'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80'
                      }
                      alt={rightTask?.title || 'Dandelions after Rain'}
                      className="w-full h-full object-cover"
                    />

                    {/* Quick Edit Decoration Button */}
                    <button
                      type="button"
                      onClick={() => setDecoratingItem({ pageSide: 'right', task: rightTask })}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Change photo / sticker"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtitle / Caption inside Polaroid frame */}
                  <p className="mt-2.5 text-center font-display italic text-xs text-stone-700 font-medium px-2">
                    {rightTask?.imageCaption ||
                      'Blossoms opening under the sun after rain, holding precious memories.'}
                  </p>
                </div>
              </div>

              {/* Bottom Handwritten Note Strip with 4-Leaf Clover & Next Page Tab */}
              <div className="mt-4 pt-2 flex items-center justify-between gap-2">
                <div className="flex-1 relative bg-[#F4F9F2] px-4 py-2 rounded-xl border border-[#D0E2CC] flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className="text-xl" title="Lucky 4-leaf clover">
                      🍀
                    </span>
                    {isEditingRightNote ? (
                      <input
                        type="text"
                        value={rightNote}
                        onChange={(e) => setRightNote(e.target.value)}
                        onBlur={() => {
                          setIsEditingRightNote(false);
                          localStorage.setItem('whimsical_bujo_right_note', rightNote);
                        }}
                        autoFocus
                        className="bg-transparent border-b border-stone-500 text-xs font-display italic text-[#244222] focus:outline-none w-full"
                      />
                    ) : (
                      <p
                        onClick={() => setIsEditingRightNote(true)}
                        className="font-display italic text-xs text-[#244222] cursor-pointer hover:underline"
                        title="Click to edit note"
                      >
                        {rightNote}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsEditingRightNote(!isEditingRightNote)}
                    className="p-1 text-stone-400 hover:text-stone-700"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                </div>

                {/* Next Page Turn Button */}
                <button
                  type="button"
                  onClick={handleNextPage}
                  className="px-3 py-2 rounded-br-2xl bg-[#E8DEC7] hover:bg-[#DDD1B5] border-t border-l border-stone-300 text-[11px] font-mono font-bold text-stone-700 shadow-sm flex items-center gap-1 active:scale-95 transition-all whitespace-nowrap"
                  title="Turn to next page"
                >
                  <span>Next Page</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT-SIDE INDEX TABS (Bookmark Tabs on desktop) */}
          {/* ========================================================================= */}
          <div className="hidden lg:flex flex-col justify-start gap-2.5 pt-8 pl-1 -mr-2 sm:-mr-4 z-20">
            {/* Tab 1: Album */}
            <button
              type="button"
              onClick={() => onSelectCollectionTab('album')}
              className={`px-3 py-3 rounded-r-xl border-y-2 border-r-2 text-xs font-bold font-body transition-all shadow-md flex items-center gap-1.5 ${
                activeCollectionTab === 'album'
                  ? 'bg-[#EADDC2] text-[#5A3B18] border-[#A88B60] translate-x-1 font-extrabold shadow-lg'
                  : 'bg-[#C7B594] hover:bg-[#D4C3A3] text-[#3D2914] border-[#9E845B]'
              }`}
              title="Memories & Photo Album"
            >
              <span>Album</span>
            </button>

            {/* Tab 2: Tasks */}
            <button
              type="button"
              onClick={() => onSelectCollectionTab('daily')}
              className={`px-3 py-3 rounded-r-xl border-y-2 border-r-2 text-xs font-bold font-body transition-all shadow-md flex items-center gap-1.5 ${
                activeCollectionTab === 'daily'
                  ? 'bg-[#EADDC2] text-[#5A3B18] border-[#A88B60] translate-x-1 font-extrabold shadow-lg'
                  : 'bg-[#C7B594] hover:bg-[#D4C3A3] text-[#3D2914] border-[#9E845B]'
              }`}
              title="Daily Tasks Log"
            >
              <span>Tasks</span>
            </button>

            {/* Tab 3: Journal */}
            <button
              type="button"
              onClick={() => onSelectCollectionTab('monthly')}
              className={`px-3 py-3 rounded-r-xl border-y-2 border-r-2 text-xs font-bold font-body transition-all shadow-md flex items-center gap-1.5 ${
                activeCollectionTab === 'monthly'
                  ? 'bg-[#EADDC2] text-[#5A3B18] border-[#A88B60] translate-x-1 font-extrabold shadow-lg'
                  : 'bg-[#C7B594] hover:bg-[#D4C3A3] text-[#3D2914] border-[#9E845B]'
              }`}
              title="Monthly Journal & Milestones"
            >
              <span>Journal</span>
            </button>

            {/* Tab 4: Collections */}
            <button
              type="button"
              onClick={() => onSelectCollectionTab('future')}
              className={`px-3 py-3 rounded-r-xl border-y-2 border-r-2 text-xs font-bold font-body transition-all shadow-md flex items-center gap-1.5 ${
                activeCollectionTab === 'future'
                  ? 'bg-[#EADDC2] text-[#5A3B18] border-[#A88B60] translate-x-1 font-extrabold shadow-lg'
                  : 'bg-[#C7B594] hover:bg-[#D4C3A3] text-[#3D2914] border-[#9E845B]'
              }`}
              title="Collections & Future Log"
            >
              <span>Collections</span>
            </button>
          </div>
        </div>
      </div>

      {/* Item Decoration Picker Modal for Scrapbook */}
      {decoratingItem && decoratingItem.task && (
        <BujoDecorationPickerModal
          isOpen={!!decoratingItem}
          onClose={() => setDecoratingItem(null)}
          currentImageUrl={decoratingItem.task.imageUrl}
          currentImageLayout={decoratingItem.task.imageLayout}
          currentCaption={decoratingItem.task.imageCaption}
          onSaveDecoration={(dec) => {
            onUpdateTaskBujo(decoratingItem.task!.id, {
              imageUrl: dec.imageUrl,
              imageLayout: dec.imageLayout,
              imageCaption: dec.imageCaption,
            });
            setDecoratingItem(null);
            confetti({
              particleCount: 25,
              spread: 40,
              origin: { y: 0.6 },
              colors: ['#8E7CC3', '#FF8E7E', '#F4B843'],
            });
          }}
        />
      )}
    </div>
  );
};
