import React, { useState, useMemo } from 'react';
import { Habit } from '../../types';
import { HabitCard } from './HabitCard';
import { getTodayKey } from '../../utils/date';
import {
  getStoredHabitBannerDecoration,
  saveStoredHabitBannerDecoration,
  HabitBannerDecoration,
  COZY_MOTIVATIONAL_PHRASES,
} from '../../utils/storage';
import { HabitDecorationModal } from './HabitDecorationModal';
import {
  Plus,
  Search,
  Sparkles,
  CheckCircle2,
  Feather,
  Quote,
  Pencil,
  Camera,
  Dice5,
  Image as ImageIcon,
} from 'lucide-react';

interface HabitListProps {
  habits: Habit[];
  onToggleComplete: (id: string) => void;
  onEditHabit: (habit: Habit) => void;
  onDeleteHabit: (id: string) => void;
  onOpenCreateModal: () => void;
  onStartPomodoro?: (habit: Habit) => void;
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  onToggleComplete,
  onEditHabit,
  onDeleteHabit,
  onOpenCreateModal,
  onStartPomodoro,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDecorationModalOpen, setIsDecorationModalOpen] = useState(false);
  const [decoration, setDecoration] = useState<HabitBannerDecoration>(() => getStoredHabitBannerDecoration());

  const todayStr = getTodayKey();

  const completedTodayCount = useMemo(() => {
    return habits.filter((h) => h.completedDates.includes(todayStr)).length;
  }, [habits, todayStr]);

  const completionPercentage = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;

  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      // Search
      const matchesSearch =
        habit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (habit.description && habit.description.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      const isCompleted = habit.completedDates.includes(todayStr);

      if (selectedFilter === 'completed') return isCompleted;
      if (selectedFilter === 'pending') return !isCompleted;
      if (selectedFilter === 'morning') return habit.targetTimeOfDay === 'morning';
      if (selectedFilter === 'afternoon') return habit.targetTimeOfDay === 'afternoon';
      if (selectedFilter === 'evening') return habit.targetTimeOfDay === 'evening';

      return true;
    });
  }, [habits, searchQuery, selectedFilter, todayStr]);

  const handleSaveDecoration = (newDeco: HabitBannerDecoration) => {
    setDecoration(newDeco);
    saveStoredHabitBannerDecoration(newDeco);
  };

  const handleQuickShuffleQuote = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentIdx = COZY_MOTIVATIONAL_PHRASES.indexOf(decoration.phrase);
    let nextIdx = Math.floor(Math.random() * COZY_MOTIVATIONAL_PHRASES.length);
    if (nextIdx === currentIdx) {
      nextIdx = (currentIdx + 1) % COZY_MOTIVATIONAL_PHRASES.length;
    }
    const newPhrase = COZY_MOTIVATIONAL_PHRASES[nextIdx];
    const updated = { ...decoration, phrase: newPhrase };
    setDecoration(updated);
    saveStoredHabitBannerDecoration(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner & Journal Spread Style Box */}
      <div className="relative overflow-hidden bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 text-[#4A3222] dark:text-[#E2E8F0] shadow-sm border-2 sm:border-3 border-[#D7C9B1] dark:border-[#383D59] transition-colors">
        
        {/* Subtle decorative washi tape on top edge */}
        <div className="absolute -top-3 left-12 w-28 h-5 bg-[#8E7CC3]/35 rounded-sm transform -rotate-1 pointer-events-none" />
        <div className="absolute -top-3 right-16 w-24 h-5 bg-[#FF8E7E]/30 rounded-sm transform rotate-2 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 sm:gap-6">
          
          {/* Left Column: Title, Subtitle, and Motivational Phrase */}
          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8E7CC3]/15 dark:bg-[#8E7CC3]/25 border border-[#8E7CC3]/30 text-xs font-bold text-[#5A4688] dark:text-[#C5BAEB] mb-2">
                <Feather className="w-3.5 h-3.5 shrink-0" />
                <span>Daily Rituals & Habit Tracker</span>
              </div>
              <h1 className="font-display italic font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#4A3222] dark:text-[#F1F5F9] tracking-tight leading-tight">
                Habits & Rituals
              </h1>
              <p className="text-[#735A46] dark:text-[#94A3B8] text-xs sm:text-sm font-body mt-1 leading-relaxed">
                Cultivate your ideal day one step at a time. Track your streaks, complete daily rituals, and build lasting momentum.
              </p>
            </div>

            {/* Motivational Quote Box */}
            <div className="relative group bg-[#FFFDF8] dark:bg-[#23273C] p-3 sm:p-3.5 rounded-2xl border border-[#D7C9B1] dark:border-[#3C4263] shadow-2xs transition-all hover:border-[#8E7CC3]/60">
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-start gap-2 min-w-0">
                  <Quote className="w-4 h-4 text-[#8E7CC3] dark:text-[#A798DD] shrink-0 mt-0.5 opacity-80" />
                  <p className="font-display italic text-xs sm:text-sm text-[#4A3222] dark:text-[#E2E8F0] leading-snug font-medium">
                    "{decoration.phrase}"
                  </p>
                </div>

                {/* Edit & Shuffle Quote Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={handleQuickShuffleQuote}
                    className="p-1.5 rounded-lg text-[#8C7662] dark:text-[#94A3B8] hover:text-[#5A4688] dark:hover:text-[#D1C6F3] hover:bg-[#FAF6EE] dark:hover:bg-[#2D334C] transition-all"
                    title="Inspire me with another quote"
                  >
                    <Dice5 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDecorationModalOpen(true)}
                    className="p-1.5 rounded-lg text-[#8C7662] dark:text-[#94A3B8] hover:text-[#5A4688] dark:hover:text-[#D1C6F3] hover:bg-[#FAF6EE] dark:hover:bg-[#2D334C] transition-all"
                    title="Edit phrase & photo decoration"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Progress Card & Decorative Polaroid Image */}
          <div className="flex flex-col sm:flex-row lg:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
            
            {/* Daily Circular Progress & Summary Card */}
            <div className="bg-[#FFFDF8] dark:bg-[#23273C] rounded-2xl p-3.5 sm:p-4 border border-[#D7C9B1] dark:border-[#3C4263] shadow-xs flex items-center gap-3.5 shrink-0 flex-1 sm:flex-initial">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#EFE7D8] dark:text-[#323755]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#8E7CC3] dark:text-[#A798DD] transition-all duration-700 ease-out"
                    strokeDasharray={`${completionPercentage}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xs sm:text-sm font-extrabold font-numeric text-[#4A3222] dark:text-[#F1F5F9] leading-none">
                    {completionPercentage}%
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#4A3222] dark:text-[#E2E8F0] font-bold font-body">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#8E7CC3] dark:text-[#A798DD]" />
                  <span>{completedTodayCount} of {habits.length} completed</span>
                </div>
                <p className="text-[11px] text-[#735A46] dark:text-[#94A3B8] font-body mt-0.5">
                  {completionPercentage === 100
                    ? 'All rituals finished today! 🎉'
                    : `${habits.length - completedTodayCount} habits remaining`}
                </p>
              </div>
            </div>

            {/* Decorative Photo / Polaroid Widget */}
            {decoration.imageUrl ? (
              <div
                onClick={() => setIsDecorationModalOpen(true)}
                className="relative group cursor-pointer shrink-0 self-center sm:self-auto transition-transform hover:scale-105 active:scale-95 my-1 sm:my-0"
                title="Click to customize habit decoration & photo"
              >
                {/* Polaroid Layout */}
                {(!decoration.layout || decoration.layout === 'polaroid') && (
                  <div className="relative bg-white dark:bg-[#282C44] p-2 sm:p-1.5 pb-2.5 sm:pb-2 rounded-2xl sm:rounded-xl shadow-md border-2 border-[#D7C9B1] dark:border-[#3C4263] w-36 sm:w-28 md:w-32 transform sm:rotate-2">
                    {/* Washi Tape Strip */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 sm:w-10 h-4 sm:h-3.5 bg-[#FF8E7E]/40 dark:bg-[#FF8E7E]/50 rounded-xs shadow-2xs -rotate-1 pointer-events-none" />
                    
                    <div className="w-full h-28 sm:h-20 md:h-22 rounded-xl sm:rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800">
                      <img
                        src={decoration.imageUrl}
                        alt={decoration.imageCaption || 'Decoration'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs sm:text-[10px] font-display italic font-semibold text-center text-[#4A3222] dark:text-[#E2E8F0] truncate mt-1.5 sm:mt-1 px-1 sm:px-0.5">
                      {decoration.imageCaption || 'My Space 🌿'}
                    </div>

                    {/* Hover indicator */}
                    <div className="absolute inset-0 bg-[#8E7CC3]/30 rounded-2xl sm:rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-5 h-5 sm:w-4 sm:h-4 text-white drop-shadow" />
                    </div>
                  </div>
                )}

                {/* Framed Layout */}
                {decoration.layout === 'frame' && (
                  <div className="relative w-32 h-32 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-[#8E7CC3] shadow-md bg-white dark:bg-[#282C44] p-1">
                    <img
                      src={decoration.imageUrl}
                      alt={decoration.imageCaption || 'Decoration'}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-5 h-5 sm:w-4 sm:h-4 text-white drop-shadow" />
                    </div>
                  </div>
                )}

                {/* Sticker Layout */}
                {decoration.layout === 'sticker' && (
                  <div className="relative w-32 h-32 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden p-1.5 sm:p-1 bg-white dark:bg-[#282C44] shadow-md border-2 border-dashed border-[#8E7CC3] transform -rotate-1 sm:-rotate-2">
                    <img
                      src={decoration.imageUrl}
                      alt={decoration.imageCaption || 'Decoration'}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="w-5 h-5 sm:w-4 sm:h-4 text-white drop-shadow" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Add Photo Pill Button when no image is loaded yet */
              <button
                type="button"
                onClick={() => setIsDecorationModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 sm:px-3.5 sm:py-3 rounded-2xl border-2 border-dashed border-[#D7C9B1] dark:border-[#3C4263] hover:border-[#8E7CC3] dark:hover:border-[#8E7CC3] bg-white/60 dark:bg-[#23273C]/60 hover:bg-white dark:hover:bg-[#23273C] text-[#735A46] dark:text-[#94A3B8] hover:text-[#5A4688] dark:hover:text-[#D1C6F3] text-xs font-bold font-body flex items-center justify-center gap-2 transition-all active:scale-95 shrink-0 group"
                title="Add a decorative image or custom phrase to this box"
              >
                <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-lg bg-[#8E7CC3]/15 group-hover:bg-[#8E7CC3]/25 text-[#8E7CC3] flex items-center justify-center transition-colors">
                  <Camera className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                </div>
                <span>Add Photo Decoration</span>
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FAF6EE] dark:bg-[#1A1C2B] p-3 rounded-2xl border-2 border-[#D7C9B1] dark:border-[#383D59] shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#8C7662] dark:text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search habits by name or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#3C4263] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] placeholder:text-[#8C7662]/70 dark:placeholder:text-[#94A3B8]/60 focus:outline-none focus:border-[#8E7CC3]"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap font-body ${
              selectedFilter === 'all'
                ? 'bg-[#8E7CC3] text-white shadow-xs font-extrabold'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-white/60 dark:hover:bg-[#282C44]'
            }`}
          >
            All ({habits.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap font-body ${
              selectedFilter === 'pending'
                ? 'bg-[#FF8E7E] text-white shadow-xs font-extrabold'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-white/60 dark:hover:bg-[#282C44]'
            }`}
          >
            Pending
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap font-body ${
              selectedFilter === 'completed'
                ? 'bg-[#E27B9B] text-white shadow-xs font-extrabold'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-white/60 dark:hover:bg-[#282C44]'
            }`}
          >
            Completed
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('morning')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap font-body ${
              selectedFilter === 'morning'
                ? 'bg-[#F4B843] text-[#3B2A1E] shadow-xs font-extrabold'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-white/60 dark:hover:bg-[#282C44]'
            }`}
          >
            Morning
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('evening')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap font-body ${
              selectedFilter === 'evening'
                ? 'bg-[#5A4688] text-white shadow-xs font-extrabold'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-white/60 dark:hover:bg-[#282C44]'
            }`}
          >
            Evening
          </button>
        </div>

        {/* Create button */}
        <button
          type="button"
          onClick={onOpenCreateModal}
          className="px-4 py-2 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white text-xs font-bold font-body transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Habit Cards Grid */}
      {filteredHabits.length === 0 ? (
        <div className="bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-3xl p-10 text-center border-2 border-dashed border-[#D7C9B1] dark:border-[#383D59]">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF8E7] dark:bg-[#2A2315] text-[#F4B843] flex items-center justify-center mx-auto mb-3 border border-[#F4B843]/30">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className="font-display italic font-bold text-xl text-[#4A3222] dark:text-[#F1F5F9] mb-1">
            No habits found
          </h3>
          <p className="text-xs text-[#735A46] dark:text-[#94A3B8] font-body max-w-sm mx-auto mb-5">
            {searchQuery
              ? 'No habits match your search query.'
              : 'Begin crafting your daily routine by creating your first mindful habit.'}
          </p>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#8E7CC3] text-white text-xs font-bold font-body inline-flex items-center gap-1.5 shadow-sm hover:bg-[#7B68B4] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Habit</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleComplete={onToggleComplete}
              onEdit={onEditHabit}
              onDelete={onDeleteHabit}
              onStartPomodoro={onStartPomodoro}
            />
          ))}
        </div>
      )}

      {/* Habit Decoration & Motivational Phrase Customizer Modal */}
      <HabitDecorationModal
        isOpen={isDecorationModalOpen}
        onClose={() => setIsDecorationModalOpen(false)}
        currentDecoration={decoration}
        onSaveDecoration={handleSaveDecoration}
      />
    </div>
  );
};

