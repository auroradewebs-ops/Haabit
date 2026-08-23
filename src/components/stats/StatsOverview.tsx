import React, { useMemo, useState } from 'react';
import { Habit, Task, PomodoroSessionRecord } from '../../types';
import { HeatmapGrid } from './HeatmapGrid';
import { InsightsCalendar } from './InsightsCalendar';
import { getTodayKey, getDaysInCurrentWeek, formatDatePretty } from '../../utils/date';
import {
  Flame,
  Clock,
  CheckCircle2,
  Trophy,
  BarChart3,
  TrendingUp,
  Award,
  Sparkles,
  Calendar,
  Check,
  Target
} from 'lucide-react';

interface StatsOverviewProps {
  habits: Habit[];
  tasks: Task[];
  pomodoroHistory: PomodoroSessionRecord[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  habits,
  tasks,
  pomodoroHistory,
}) => {
  const todayStr = getTodayKey();
  const currentWeekDays = getDaysInCurrentWeek();
  const [selectedPulseDay, setSelectedPulseDay] = useState<string | null>(todayStr);

  // Focus time stats
  const todayFocusMinutes = useMemo(() => {
    return pomodoroHistory
      .filter((p) => p.date === todayStr && p.mode === 'focus')
      .reduce((sum, p) => sum + p.durationMinutes, 0);
  }, [pomodoroHistory, todayStr]);

  const totalFocusMinutes = useMemo(() => {
    return pomodoroHistory
      .filter((p) => p.mode === 'focus')
      .reduce((sum, p) => sum + p.durationMinutes, 0);
  }, [pomodoroHistory]);

  const totalSessionsCount = useMemo(() => {
    return pomodoroHistory.filter((p) => p.mode === 'focus').length;
  }, [pomodoroHistory]);

  // Overall Habit streaks
  const bestOverallStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map((h) => h.streakBest));
  }, [habits]);

  const currentMaxStreak = useMemo(() => {
    if (habits.length === 0) return 0;
    return Math.max(...habits.map((h) => h.streakCurrent));
  }, [habits]);

  const completedTodayCount = habits.filter((h) => h.completedDates.includes(todayStr)).length;
  const habitCompletionRate = habits.length > 0 ? Math.round((completedTodayCount / habits.length) * 100) : 0;

  // Set of all completed dates for Heatmap & Weekly view
  const allCompletedDatesSet = useMemo(() => {
    const dates = new Set<string>();
    habits.forEach((h) => {
      h.completedDates.forEach((d) => dates.add(d));
    });
    pomodoroHistory.forEach((p) => {
      dates.add(p.date);
    });
    return dates;
  }, [habits, pomodoroHistory]);

  // Per-day completion data for the current week
  const weekDayDataMap = useMemo(() => {
    const map = new Map<
      string,
      {
        completedHabitsCount: number;
        focusMinutes: number;
        completedTasksCount: number;
      }
    >();

    currentWeekDays.forEach((w) => {
      const completedHabitsCount = habits.filter((h) => h.completedDates.includes(w.dateStr)).length;
      const focusMinutes = pomodoroHistory
        .filter((p) => p.date === w.dateStr && p.mode === 'focus')
        .reduce((sum, p) => sum + p.durationMinutes, 0);
      const completedTasksCount = tasks.filter((t) => t.completed && t.dueDate === w.dateStr).length;

      map.set(w.dateStr, {
        completedHabitsCount,
        focusMinutes,
        completedTasksCount,
      });
    });

    return map;
  }, [habits, tasks, pomodoroHistory, currentWeekDays]);

  const pulseDetails = useMemo(() => {
    if (!selectedPulseDay) return null;
    const data = weekDayDataMap.get(selectedPulseDay) || {
      completedHabitsCount: 0,
      focusMinutes: 0,
      completedTasksCount: 0,
    };
    return {
      dateStr: selectedPulseDay,
      ...data,
    };
  }, [selectedPulseDay, weekDayDataMap]);

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 text-[#4A3222] dark:text-[#E2E8F0] shadow-sm border-2 sm:border-3 border-[#D7C9B1] dark:border-[#383D59] transition-colors">
        {/* Washi tape accents */}
        <div className="absolute -top-3 left-10 sm:left-14 w-24 sm:w-28 h-5 bg-[#8E7CC3]/30 rounded-sm transform -rotate-1 pointer-events-none" />
        <div className="absolute -top-3 right-10 sm:right-16 w-20 sm:w-24 h-5 bg-[#F4B843]/30 rounded-sm transform rotate-2 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
          <div className="min-w-0 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#8E7CC3]/15 dark:bg-[#8E7CC3]/25 border border-[#8E7CC3]/30 text-[11px] sm:text-xs font-bold text-[#5A4688] dark:text-[#C5BAEB] mb-2 sm:mb-2.5">
              <TrendingUp className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" />
              <span>Performance Ledger & Habit Analytics</span>
            </div>
            <h1 className="font-display italic font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#4A3222] dark:text-[#F1F5F9] tracking-tight leading-tight">
              Insights & Progress
            </h1>
            <p className="text-[#735A46] dark:text-[#94A3B8] text-xs sm:text-sm font-body mt-1 leading-relaxed">
              Reflect upon your daily discipline, explore your monthly calendar milestones, and celebrate ongoing focus streaks.
            </p>
          </div>

          <div className="bg-[#FFFDF8] dark:bg-[#23273C] rounded-2xl p-3.5 sm:p-4 border border-[#D7C9B1] dark:border-[#3C4263] shadow-xs flex items-center gap-3.5 shrink-0 w-full sm:w-auto">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FFF8E7] dark:bg-[#2F2A1E] border border-[#F4B843]/40 flex items-center justify-center text-[#F4B843] shrink-0">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
            </div>
            <div>
              <span className="text-[11px] sm:text-xs text-[#735A46] dark:text-[#94A3B8] font-body block font-medium">Active Top Streak</span>
              <span className="text-xl sm:text-2xl font-extrabold font-numeric text-[#4A3222] dark:text-[#F1F5F9] block leading-tight">
                {currentMaxStreak} {currentMaxStreak === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Today Focus Minutes */}
        <div className="bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 border-[#D7C9B1] dark:border-[#383D59] shadow-xs relative overflow-hidden transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#735A46] dark:text-[#94A3B8] font-body">
                Focus Today
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F2EFF9] dark:bg-[#252136] text-[#5A4688] dark:text-[#C5BAEB] border border-[#8E7CC3]/30 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-numeric text-[#5A4688] dark:text-[#C5BAEB]">
                {todayFocusMinutes}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-[#735A46] dark:text-[#94A3B8] font-body">mins</span>
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#8C7662] dark:text-[#64748B] font-body mt-2">
            {Math.round(todayFocusMinutes / 25)} session{Math.round(todayFocusMinutes / 25) === 1 ? '' : 's'}
          </p>
        </div>

        {/* Card 2: Habit Completion Rate */}
        <div className="bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 border-[#D7C9B1] dark:border-[#383D59] shadow-xs relative overflow-hidden transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#735A46] dark:text-[#94A3B8] font-body">
                Completion Rate
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FDF0F4] dark:bg-[#2F1823] text-[#E27B9B] dark:text-[#F8B4C8] border border-[#F3C5D4] dark:border-[#5C283B] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-numeric text-[#E27B9B] dark:text-[#F8B4C8]">
                {habitCompletionRate}%
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-[#735A46] dark:text-[#94A3B8] font-body">
                ({completedTodayCount}/{habits.length})
              </span>
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#8C7662] dark:text-[#64748B] font-body mt-2 truncate">
            {completedTodayCount === habits.length && habits.length > 0 ? 'All done today! 🌸' : 'In progress'}
          </p>
        </div>

        {/* Card 3: Best All Time Streak */}
        <div className="bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 border-[#D7C9B1] dark:border-[#383D59] shadow-xs relative overflow-hidden transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#735A46] dark:text-[#94A3B8] font-body">
                All-Time Streak
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FFF8E7] dark:bg-[#2F2A1E] text-[#915B12] dark:text-[#F4B843] border border-[#F4B843]/40 flex items-center justify-center">
                <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-numeric text-[#A67022] dark:text-[#F4B843]">
                {bestOverallStreak}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-[#735A46] dark:text-[#94A3B8] font-body">days</span>
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#8C7662] dark:text-[#64748B] font-body mt-2 truncate">
            Personal record
          </p>
        </div>

        {/* Card 4: Total Concentration Hours */}
        <div className="bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 border-2 border-[#D7C9B1] dark:border-[#383D59] shadow-xs relative overflow-hidden transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-[#735A46] dark:text-[#94A3B8] font-body">
                Total Focus
              </span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#FAF0F5] dark:bg-[#331C28] text-[#D94F88] dark:text-[#FF8E7E] border border-[#FF8E7E]/30 flex items-center justify-center">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 sm:gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-numeric text-[#4A3222] dark:text-[#F1F5F9]">
                {(totalFocusMinutes / 60).toFixed(1)}
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-[#735A46] dark:text-[#94A3B8] font-body">hrs</span>
            </div>
          </div>
          <p className="text-[10px] sm:text-[11px] text-[#8C7662] dark:text-[#64748B] font-body mt-2 truncate">
            {totalSessionsCount} focus blocks
          </p>
        </div>
      </div>

      {/* Week in Review: Responsive Weekly Habit Pulse */}
      <div className="bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-[#D7C9B1] dark:border-[#383D59] shadow-xs transition-colors space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#5A4688] dark:text-[#C5BAEB] mb-0.5">
              <Target className="w-3 h-3" />
              <span>Current Week Rhythm</span>
            </div>
            <h3 className="font-display italic font-extrabold text-lg sm:text-xl text-[#4A3222] dark:text-[#F1F5F9]">
              Weekly Habit Pulse
            </h3>
          </div>
          <span className="text-xs text-[#735A46] dark:text-[#94A3B8] font-body">
            Tap any day to see details
          </span>
        </div>

        {/* 7-Day Responsive Row */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {currentWeekDays.map((w) => {
            const data = weekDayDataMap.get(w.dateStr);
            const hasActivity = allCompletedDatesSet.has(w.dateStr);
            const isSelected = selectedPulseDay === w.dateStr;

            return (
              <button
                key={w.dateStr}
                type="button"
                onClick={() => setSelectedPulseDay(w.dateStr)}
                className={`p-1.5 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl text-center border-2 transition-all flex flex-col items-center justify-between min-h-[68px] sm:min-h-[82px] focus-visible:outline-none ${
                  isSelected
                    ? 'border-[#8E7CC3] dark:border-[#A798DD] bg-white dark:bg-[#23273C] shadow-md ring-2 ring-[#8E7CC3]/20 scale-102 sm:scale-105 z-10'
                    : w.isToday
                    ? 'border-[#8E7CC3]/60 dark:border-[#8E7CC3] bg-[#F2EFF9]/60 dark:bg-[#252136]/60'
                    : 'border-[#D7C9B1] dark:border-[#2D334C] bg-[#FFFDF8] dark:bg-[#161825] hover:bg-[#FAF6EE] dark:hover:bg-[#1E2133]'
                }`}
              >
                {/* Day name */}
                <span
                  className={`text-[9px] xs:text-[10px] sm:text-xs font-extrabold font-body block uppercase ${
                    isSelected
                      ? 'text-[#5A4688] dark:text-[#C5BAEB]'
                      : 'text-[#735A46] dark:text-[#94A3B8]'
                  }`}
                >
                  <span className="hidden sm:inline">{w.dayName}</span>
                  <span className="inline sm:hidden">{w.dayName.slice(0, 2)}</span>
                </span>

                {/* Day number */}
                <span
                  className={`text-sm sm:text-base md:text-lg font-extrabold font-numeric block my-0.5 ${
                    w.isToday
                      ? 'text-[#5A4688] dark:text-[#C5BAEB] font-black underline decoration-2'
                      : 'text-[#4A3222] dark:text-[#F1F5F9]'
                  }`}
                >
                  {w.dayNum}
                </span>

                {/* Completion indicator */}
                <div className="flex justify-center items-center mt-0.5">
                  <div
                    className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white text-[10px] transition-transform ${
                      hasActivity
                        ? 'bg-[#E27B9B] shadow-2xs'
                        : 'bg-[#EFE7D8] dark:bg-[#2D334C] text-[#8C7662] dark:text-[#64748B]'
                    }`}
                  >
                    {hasActivity ? (
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                    ) : (
                      <div className="w-1 h-1 rounded-full bg-current" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Quick Card */}
        {pulseDetails && (
          <div className="mt-3 p-3 sm:p-4 rounded-xl bg-white dark:bg-[#1E2133] border border-[#D7C9B1] dark:border-[#2D334C] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F2EFF9] dark:bg-[#252136] text-[#5A4688] dark:text-[#C5BAEB] border border-[#8E7CC3]/30 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#4A3222] dark:text-[#F1F5F9] font-body block">
                  {formatDatePretty(pulseDetails.dateStr)}
                </span>
                <span className="text-[11px] text-[#735A46] dark:text-[#94A3B8] font-body">
                  {pulseDetails.completedHabitsCount} habits logged • {pulseDetails.focusMinutes}m focus • {pulseDetails.completedTasksCount} tasks done
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                  pulseDetails.completedHabitsCount > 0 || pulseDetails.focusMinutes > 0
                    ? 'bg-[#FDF0F4] dark:bg-[#2F1823] text-[#E27B9B] dark:text-[#F8B4C8] border-[#F3C5D4] dark:border-[#5C283B]'
                    : 'bg-[#FAF6EE] dark:bg-[#161825] text-[#735A46] dark:text-[#94A3B8] border-[#D7C9B1] dark:border-[#2D334C]'
                }`}
              >
                {pulseDetails.completedHabitsCount > 0 || pulseDetails.focusMinutes > 0
                  ? 'Active Day 🌸'
                  : 'Rest / No Logs'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Monthly Activity Calendar */}
      <InsightsCalendar
        habits={habits}
        tasks={tasks}
        pomodoroHistory={pomodoroHistory}
      />

      {/* Consistency Heatmap Grid */}
      <HeatmapGrid completedDatesSet={allCompletedDatesSet} habitCount={habits.length} />
    </div>
  );
};
