import React, { useState, useMemo } from 'react';
import { Habit, Task, PomodoroSessionRecord } from '../../types';
import { getCalendarGridDays, getTodayKey, formatDatePretty } from '../../utils/date';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Sparkles,
  Check,
  Award,
  ListTodo
} from 'lucide-react';

interface InsightsCalendarProps {
  habits: Habit[];
  tasks: Task[];
  pomodoroHistory: PomodoroSessionRecord[];
}

export const InsightsCalendar: React.FC<InsightsCalendarProps> = ({
  habits,
  tasks,
  pomodoroHistory,
}) => {
  const todayStr = getTodayKey();
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(() => new Date().getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdayNames = [
    { full: 'Monday', short: 'Mon', initial: 'M', min: 'Mo' },
    { full: 'Tuesday', short: 'Tue', initial: 'T', min: 'Tu' },
    { full: 'Wednesday', short: 'Wed', initial: 'W', min: 'We' },
    { full: 'Thursday', short: 'Thu', initial: 'T', min: 'Th' },
    { full: 'Friday', short: 'Fri', initial: 'F', min: 'Fr' },
    { full: 'Saturday', short: 'Sat', initial: 'S', min: 'Sa' },
    { full: 'Sunday', short: 'Sun', initial: 'S', min: 'Su' },
  ];

  const calendarDays = useMemo(() => {
    return getCalendarGridDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(todayStr);
  };

  // Pre-calculate per-day activity for quick lookup
  const dayStatsMap = useMemo(() => {
    const map = new Map<
      string,
      {
        completedHabits: Habit[];
        completedTasks: Task[];
        focusMinutes: number;
        sessionCount: number;
      }
    >();

    habits.forEach((h) => {
      h.completedDates.forEach((dateStr) => {
        const entry = map.get(dateStr) || { completedHabits: [], completedTasks: [], focusMinutes: 0, sessionCount: 0 };
        entry.completedHabits.push(h);
        map.set(dateStr, entry);
      });
    });

    tasks.forEach((t) => {
      if (t.completed && t.dueDate) {
        const entry = map.get(t.dueDate) || { completedHabits: [], completedTasks: [], focusMinutes: 0, sessionCount: 0 };
        entry.completedTasks.push(t);
        map.set(t.dueDate, entry);
      }
    });

    pomodoroHistory.forEach((p) => {
      if (p.mode === 'focus') {
        const entry = map.get(p.date) || { completedHabits: [], completedTasks: [], focusMinutes: 0, sessionCount: 0 };
        entry.focusMinutes += p.durationMinutes;
        entry.sessionCount += 1;
        map.set(p.date, entry);
      }
    });

    return map;
  }, [habits, tasks, pomodoroHistory]);

  const selectedDayData = useMemo(() => {
    return dayStatsMap.get(selectedDate) || {
      completedHabits: [],
      completedTasks: [],
      focusMinutes: 0,
      sessionCount: 0,
    };
  }, [dayStatsMap, selectedDate]);

  return (
    <div className="bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border-2 sm:border-3 border-[#D7C9B1] dark:border-[#383D59] shadow-sm relative overflow-hidden space-y-5 sm:space-y-6 transition-colors">
      {/* Decorative washi tape corner */}
      <div className="absolute -top-3 left-8 sm:left-10 w-24 sm:w-28 h-5 bg-[#8E7CC3]/30 rounded-sm transform -rotate-1 pointer-events-none" />

      {/* Header bar: Month navigation & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#D7C9B1] dark:border-[#383D59] pb-4">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#8E7CC3]/15 dark:bg-[#8E7CC3]/25 border border-[#8E7CC3]/30 text-[11px] sm:text-xs font-bold text-[#5A4688] dark:text-[#C5BAEB] mb-1 sm:mb-1.5">
            <CalendarIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            <span>Monthly Activity Calendar</span>
          </div>
          <h2 className="font-display italic font-extrabold text-xl sm:text-2xl lg:text-3xl text-[#4A3222] dark:text-[#F1F5F9] tracking-tight">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={handleGoToToday}
            className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-white dark:bg-[#23273C] hover:bg-[#FFFDF8] dark:hover:bg-[#2C314B] text-[#4A3222] dark:text-[#E2E8F0] border border-[#D7C9B1] dark:border-[#3C4263] text-xs font-bold font-body shadow-2xs transition-all active:scale-95 whitespace-nowrap min-h-[36px] sm:min-h-[40px] flex items-center justify-center"
          >
            Today
          </button>
          <div className="flex items-center gap-1 bg-white dark:bg-[#23273C] p-1 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 sm:p-2 rounded-lg text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE] dark:hover:bg-[#2C314B] transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
              aria-label="Previous month"
              title="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-[#D7C9B1] dark:bg-[#3C4263]" />
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 sm:p-2 rounded-lg text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE] dark:hover:bg-[#2C314B] transition-colors min-w-[34px] min-h-[34px] flex items-center justify-center"
              aria-label="Next month"
              title="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Calendar Grid Area (7 or 8 cols on lg) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-2">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-body text-xs font-extrabold text-[#735A46] dark:text-[#94A3B8] pb-1">
            {weekdayNames.map((day) => (
              <div key={day.full} className="py-1">
                <span className="hidden sm:inline">{day.short}</span>
                <span className="inline sm:hidden">{day.min}</span>
              </div>
            ))}
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarDays.map((day) => {
              const data = dayStatsMap.get(day.dateStr);
              const hasHabits = Boolean(data && data.completedHabits.length > 0);
              const hasFocus = Boolean(data && data.focusMinutes > 0);
              const hasTasks = Boolean(data && data.completedTasks.length > 0);
              const isSelected = selectedDate === day.dateStr;

              return (
                <button
                  key={day.dateStr}
                  type="button"
                  onClick={() => setSelectedDate(day.dateStr)}
                  className={`aspect-square sm:aspect-auto sm:min-h-[72px] md:min-h-[76px] p-1 sm:p-2 rounded-xl sm:rounded-2xl border text-left transition-all relative flex flex-col justify-between overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8E7CC3] ${
                    !day.isCurrentMonth
                      ? 'opacity-30 bg-white/40 dark:bg-[#161825]/40 border-[#EFE7D8] dark:border-[#282C44] text-[#8C7662] dark:text-[#64748B]'
                      : isSelected
                      ? 'bg-white dark:bg-[#23273C] border-2 border-[#8E7CC3] dark:border-[#A798DD] shadow-md ring-2 ring-[#8E7CC3]/25 z-10'
                      : day.isToday
                      ? 'bg-[#F2EFF9]/80 dark:bg-[#252136]/80 border-[#8E7CC3]/70 dark:border-[#8E7CC3] hover:bg-white dark:hover:bg-[#23273C]'
                      : 'bg-white dark:bg-[#1E2133] hover:bg-[#FFFDF8] dark:hover:bg-[#25283D] border-[#D7C9B1] dark:border-[#2D334C]'
                  }`}
                >
                  {/* Day number top row */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-[11px] xs:text-xs sm:text-sm font-extrabold font-numeric ${
                        day.isToday
                          ? 'w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#8E7CC3] text-white flex items-center justify-center -ml-0.5 -mt-0.5 shadow-2xs text-[10px] sm:text-xs'
                          : isSelected
                          ? 'text-[#5A4688] dark:text-[#C5BAEB]'
                          : 'text-[#4A3222] dark:text-[#F1F5F9]'
                      }`}
                    >
                      {day.dayNumber}
                    </span>

                    {/* Desktop/Tablet habit count badge */}
                    {hasHabits && (
                      <span className="hidden sm:inline-block text-[10px] font-bold font-numeric text-[#E27B9B] dark:text-[#F8B4C8] bg-[#FDF0F4] dark:bg-[#2F1823] px-1.5 py-0.2 rounded-md border border-[#F3C5D4] dark:border-[#5C283B]">
                        {data?.completedHabits.length}✓
                      </span>
                    )}
                  </div>

                  {/* Activity Indicators: Micro-dots on Mobile, Rich badges on Desktop/Tablet */}
                  <div className="w-full mt-auto">
                    {/* Mobile Dot indicators (< sm) */}
                    <div className="flex sm:hidden items-center justify-center gap-1 pt-0.5">
                      {hasHabits && (
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-[#E27B9B]"
                          title={`${data?.completedHabits.length} habits done`}
                        />
                      )}
                      {hasFocus && (
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-[#8E7CC3]"
                          title={`${data?.focusMinutes}m focus`}
                        />
                      )}
                      {hasTasks && (
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-[#FF8E7E]"
                          title={`${data?.completedTasks.length} tasks`}
                        />
                      )}
                    </div>

                    {/* Desktop/Tablet rich badge details (sm+) */}
                    <div className="hidden sm:block space-y-0.5 w-full">
                      {hasFocus && (
                        <div className="text-[9px] md:text-[10px] font-bold font-numeric text-[#5A4688] dark:text-[#C5BAEB] bg-[#F2EFF9] dark:bg-[#252136] px-1 py-0.5 rounded truncate flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 shrink-0" />
                          <span>{data?.focusMinutes}m</span>
                        </div>
                      )}

                      {!hasFocus && hasHabits && (
                        <div className="flex gap-0.5 items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#E27B9B]" />
                          <span className="text-[9px] text-[#735A46] dark:text-[#94A3B8] font-medium truncate">
                            {data?.completedHabits.length} habit{data?.completedHabits.length === 1 ? '' : 's'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile legend bar */}
          <div className="flex sm:hidden items-center justify-center gap-4 text-[10px] font-body text-[#735A46] dark:text-[#94A3B8] pt-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#E27B9B]" />
              <span>Habits</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#8E7CC3]" />
              <span>Focus</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[#FF8E7E]" />
              <span>Tasks</span>
            </div>
          </div>
        </div>

        {/* Selected Day Scrapbook Card (5 or 4 cols on lg, full width on mobile) */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#FFFDF8] dark:bg-[#1E2133] rounded-2xl sm:rounded-3xl p-4 sm:p-5 border-2 border-[#D7C9B1] dark:border-[#383D59] shadow-xs flex flex-col justify-between transition-colors">
          <div className="space-y-4">
            <div className="border-b border-[#D7C9B1] dark:border-[#2D334C] pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7662] dark:text-[#94A3B8] font-body">
                  Daily Log Inspection
                </span>
                {selectedDate === todayStr && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8E7CC3]/15 text-[#5A4688] dark:text-[#C5BAEB] border border-[#8E7CC3]/30">
                    Today
                  </span>
                )}
              </div>
              <h3 className="font-display italic font-extrabold text-lg sm:text-xl text-[#4A3222] dark:text-[#F1F5F9] mt-0.5">
                {formatDatePretty(selectedDate)}
              </h3>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#2D334C]">
                <span className="text-[10px] font-bold text-[#735A46] dark:text-[#94A3B8] font-body block">Habits Done</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg sm:text-xl font-bold font-numeric text-[#E27B9B] dark:text-[#F8B4C8]">
                    {selectedDayData.completedHabits.length}
                  </span>
                  <span className="text-[10px] text-[#735A46] dark:text-[#94A3B8]">logged</span>
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#2D334C]">
                <span className="text-[10px] font-bold text-[#735A46] dark:text-[#94A3B8] font-body block">Focus Time</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg sm:text-xl font-bold font-numeric text-[#5A4688] dark:text-[#C5BAEB]">
                    {selectedDayData.focusMinutes}
                  </span>
                  <span className="text-[10px] text-[#735A46] dark:text-[#94A3B8]">mins</span>
                </div>
              </div>
            </div>

            {/* Completed habits breakdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#735A46] dark:text-[#94A3B8] font-body">
                  Completed Rituals
                </span>
                <span className="text-[10px] font-numeric font-bold text-[#735A46] dark:text-[#94A3B8]">
                  ({selectedDayData.completedHabits.length})
                </span>
              </div>
              {selectedDayData.completedHabits.length === 0 ? (
                <div className="p-3 rounded-xl bg-[#FAF6EE]/60 dark:bg-[#161825]/60 border border-dashed border-[#D7C9B1] dark:border-[#2D334C] text-center">
                  <p className="text-xs text-[#8C7662] dark:text-[#64748B] italic font-body">
                    No habits recorded for this date.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {selectedDayData.completedHabits.map((h) => (
                    <div
                      key={h.id}
                      className="p-2 sm:p-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#2D334C] flex items-center justify-between text-xs gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: h.color || '#E27B9B' }}
                        />
                        <span className="font-bold text-[#4A3222] dark:text-[#E2E8F0] font-body truncate">{h.title}</span>
                      </div>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E27B9B] shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Completed tasks breakdown */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#735A46] dark:text-[#94A3B8] font-body">
                  Completed Tasks
                </span>
                <span className="text-[10px] font-numeric font-bold text-[#735A46] dark:text-[#94A3B8]">
                  ({selectedDayData.completedTasks.length})
                </span>
              </div>
              {selectedDayData.completedTasks.length === 0 ? (
                <div className="p-3 rounded-xl bg-[#FAF6EE]/60 dark:bg-[#161825]/60 border border-dashed border-[#D7C9B1] dark:border-[#2D334C] text-center">
                  <p className="text-xs text-[#8C7662] dark:text-[#64748B] italic font-body">
                    No tasks marked done on this date.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedDayData.completedTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-2 sm:p-2.5 rounded-xl bg-[#FAF6EE] dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#2D334C] flex items-center justify-between text-xs gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: t.color || '#FF8E7E' }}
                        />
                        <span className="font-bold text-[#4A3222] dark:text-[#E2E8F0] font-body truncate">{t.title}</span>
                      </div>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E27B9B] shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
