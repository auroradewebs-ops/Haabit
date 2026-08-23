import React, { useState } from 'react';
import { Habit } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { SwipeToComplete } from '../common/SwipeToComplete';
import { getTodayKey } from '../../utils/date';
import { Flame, Clock, Play, MoreVertical, Edit3, Trash2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audio';

interface HabitCardProps {
  habit: Habit;
  onToggleComplete: (id: string) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (id: string) => void;
  onStartPomodoro?: (habit: Habit) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  onToggleComplete,
  onEdit,
  onDelete,
  onStartPomodoro,
}) => {
  const todayStr = getTodayKey();
  const isCompleted = habit.completedDates.includes(todayStr);
  const [showMenu, setShowMenu] = useState(false);

  const handleCheckboxClick = () => {
    if (!isCompleted) {
      soundEngine.playChime('success');
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.75 },
        colors: ['#8E7CC3', '#FF8E7E', '#F4B843', '#83C5BE', '#4A3222'],
      });
    }
    onToggleComplete(habit.id);
  };

  const getTimeOfDayLabel = (time: Habit['targetTimeOfDay']) => {
    switch (time) {
      case 'morning':
        return 'Morning';
      case 'afternoon':
        return 'Afternoon';
      case 'evening':
        return 'Evening';
      default:
        return 'Anytime';
    }
  };

  return (
    <div
      className={`group relative bg-[#FAF6EE] dark:bg-[#1C1E2E] rounded-2xl p-4 sm:p-5 transition-all duration-200 border-2 shadow-xs ${
        isCompleted
          ? 'border-[#D7C9B1] dark:border-[#2D334C] bg-[#F4EFE6]/70 dark:bg-[#161825]/70 opacity-90'
          : 'border-[#D7C9B1] dark:border-[#383D59] hover:border-[#8E7CC3] dark:hover:border-[#A798DD] hover:shadow-md'
      }`}
    >
      {/* Decorative Washi Tape Corner */}
      <div
        className="absolute -top-2 left-6 w-12 h-3.5 rounded-xs opacity-75 transform -rotate-2 pointer-events-none shadow-2xs"
        style={{
          backgroundColor: habit.color || '#8E7CC3',
          backgroundImage: 'linear-gradient(45deg, rgba(255,255,255,0.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.2) 75%, transparent 75%, transparent)',
          backgroundSize: '8px 8px',
        }}
      />

      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-3 pt-1">
        <div className="flex items-center gap-3 min-w-0">
          {/* Icon Badge */}
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs border border-black/10 dark:border-white/10 overflow-hidden"
            style={{ backgroundColor: habit.color || '#8E7CC3' }}
          >
            <IconRenderer name={habit.iconName} className="w-5 h-5" size={20} />
          </div>

          <div className="min-w-0">
            <h4
              className={`font-display italic font-bold text-base sm:text-lg leading-snug truncate ${
                isCompleted ? 'line-through text-[#8C7662] dark:text-[#64748B]' : 'text-[#4A3222] dark:text-[#F1F5F9]'
              }`}
            >
              {habit.title}
            </h4>

            {/* Subtitle / Details */}
            {habit.description && (
              <p className="text-xs text-[#735A46] dark:text-[#94A3B8] font-body line-clamp-1 mt-0.5">
                {habit.description}
              </p>
            )}
          </div>
        </div>

        {/* Action Menu & Quick Start Focus */}
        <div className="flex items-center gap-1 shrink-0 relative">
          {onStartPomodoro && (
            <button
              type="button"
              onClick={() => onStartPomodoro(habit)}
              className="p-1.5 sm:p-2 rounded-xl text-[#5A4688] dark:text-[#C5BAEB] hover:bg-[#F2EFF9] dark:hover:bg-[#282C44] active:scale-95 transition-all flex items-center gap-1 text-xs font-bold font-body"
              title="Start focus timer for this habit"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-[#8C7662] dark:text-[#94A3B8] hover:text-[#4A3222] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Habit options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-36 bg-[#FFFDF8] dark:bg-[#1E2133] rounded-xl shadow-lg border border-[#D7C9B1] dark:border-[#3C4263] py-1.5 z-20">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(habit);
                }}
                className="w-full px-3 py-2 text-left text-xs font-bold font-body text-[#4A3222] dark:text-[#E2E8F0] hover:bg-[#FAF6EE] dark:hover:bg-[#282C44] flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#8E7CC3] dark:text-[#A798DD]" /> Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(habit.id);
                }}
                className="w-full px-3 py-2 text-left text-xs font-bold font-body text-[#E6503A] hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Badges Bar: Streak, Time of Day, Target Unit */}
      <div className="flex items-center gap-2 flex-wrap mb-3.5 text-xs font-body">
        {/* Streak Badge */}
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FFF8E7] dark:bg-[#2A2315] text-[#915B12] dark:text-[#F6D085] border border-[#F4B843]/40 dark:border-[#F4B843]/20 font-bold shadow-2xs">
          <Flame className="w-3.5 h-3.5 fill-[#F4B843] text-[#F4B843]" />
          <span>{habit.streakCurrent} {habit.streakCurrent === 1 ? 'day' : 'days'} streak</span>
          {habit.streakBest > habit.streakCurrent && (
            <span className="text-[10px] text-[#A67022] dark:text-[#D4A359] font-normal">
              (Best: {habit.streakBest})
            </span>
          )}
        </div>

        {/* Time of day / Schedule badge */}
        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 dark:bg-[#282C44] text-[#735A46] dark:text-[#CBD5E1] border border-[#D7C9B1] dark:border-[#3C4263] font-medium">
          <Clock className="w-3.5 h-3.5 text-[#8E7CC3] dark:text-[#A798DD]" />
          <span>
            {habit.scheduledTime ? habit.scheduledTime : getTimeOfDayLabel(habit.targetTimeOfDay)}
          </span>
        </div>

        {/* Target Goal */}
        {habit.targetCount > 1 && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F2EFF9] dark:bg-[#252136] text-[#5A4688] dark:text-[#C5BAEB] border border-[#8E7CC3]/30 font-bold text-[11px]">
            <span>Goal: {habit.targetCount} {habit.targetUnit || 'times'}</span>
          </div>
        )}
      </div>

      {/* Completion Confirmation Option (Checkbox VS Swipe-to-complete) */}
      <div className="pt-1">
        {habit.completionType === 'swipe' ? (
          <SwipeToComplete
            isCompleted={isCompleted}
            onComplete={() => onToggleComplete(habit.id)}
            onUncomplete={() => onToggleComplete(habit.id)}
            color={habit.color || '#8E7CC3'}
            text="Swipe to complete habit"
            completedText="Habit completed today! 🌿"
          />
        ) : (
          <button
            type="button"
            onClick={handleCheckboxClick}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between transition-all active:scale-[0.99] border ${
              isCompleted
                ? 'bg-[#FDF0F4] dark:bg-[#2F1823] text-[#B84067] dark:text-[#F8B4C8] border-[#F3C5D4] dark:border-[#5C283B] font-bold'
                : 'bg-white dark:bg-[#282C44] hover:bg-[#FFFDF8] dark:hover:bg-[#323755] text-[#4A3222] dark:text-[#E2E8F0] border-[#D7C9B1] dark:border-[#3C4263] font-bold shadow-2xs hover:border-[#8E7CC3]'
            }`}
          >
            <span className="text-xs font-body tracking-tight">
              {isCompleted ? 'Completed for today' : 'Mark as done'}
            </span>
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                isCompleted
                  ? 'bg-[#E27B9B] text-white shadow-xs'
                  : 'border-2 border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#1E2133] group-hover:border-[#8E7CC3]'
              }`}
            >
              {isCompleted && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
