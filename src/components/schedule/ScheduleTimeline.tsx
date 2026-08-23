import React, { useState, useMemo } from 'react';
import { Habit, Task, TimeBlock } from '../../types';
import { TimeBlockModal } from './TimeBlockModal';
import { IconRenderer } from '../common/IconRenderer';
import { SwipeToComplete } from '../common/SwipeToComplete';
import { getTodayKey, formatDatePretty } from '../../utils/date';
import { Plus, Calendar, Clock, Sparkles, Check, Play, BookOpen, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audio';

interface ScheduleTimelineProps {
  habits: Habit[];
  tasks: Task[];
  timeBlocks: TimeBlock[];
  onAddTimeBlock: (block: Partial<TimeBlock>) => void;
  onToggleTimeBlock: (id: string) => void;
  onToggleHabit: (id: string) => void;
  onToggleTask: (id: string) => void;
  onStartPomodoro?: (item: any) => void;
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  habits,
  tasks,
  timeBlocks,
  onAddTimeBlock,
  onToggleTimeBlock,
  onToggleHabit,
  onToggleTask,
  onStartPomodoro,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const todayStr = getTodayKey();

  // Combine habits with scheduled time, tasks with due time, and custom time blocks into unified chronological timeline
  const scheduleItems = useMemo(() => {
    const items: Array<{
      id: string;
      title: string;
      subtitle?: string;
      time: string;
      endTime?: string;
      type: 'habit' | 'task' | 'custom';
      color: string;
      iconName: string;
      isCompleted: boolean;
      completionType: 'checkbox' | 'swipe';
      rawItem: any;
    }> = [];

    // Add scheduled habits
    habits.forEach((h) => {
      const isDone = h.completedDates.includes(todayStr);
      const time = h.scheduledTime || (h.targetTimeOfDay === 'morning' ? '08:00' : h.targetTimeOfDay === 'afternoon' ? '14:00' : h.targetTimeOfDay === 'evening' ? '20:00' : '10:00');
      items.push({
        id: `habit-${h.id}`,
        title: h.title,
        subtitle: h.description || 'Daily ritual',
        time,
        type: 'habit',
        color: h.color || '#8E7CC3',
        iconName: h.iconName,
        isCompleted: isDone,
        completionType: h.completionType,
        rawItem: h,
      });
    });

    // Add tasks for today
    tasks
      .filter((t) => t.dueDate === todayStr)
      .forEach((t) => {
        items.push({
          id: `task-${t.id}`,
          title: t.title,
          subtitle: t.notes || `Priority: ${t.priority}`,
          time: t.dueTime || '16:00',
          type: 'task',
          color: t.color || '#FF8E7E',
          iconName: t.iconName,
          isCompleted: t.completed,
          completionType: t.completionType,
          rawItem: t,
        });
      });

    // Add custom time blocks
    timeBlocks.forEach((b) => {
      items.push({
        id: `block-${b.id}`,
        title: b.title,
        subtitle: `Custom time block (${b.startTime} - ${b.endTime})`,
        time: b.startTime,
        endTime: b.endTime,
        type: 'custom',
        color: b.color || '#F4B843',
        iconName: b.iconName,
        isCompleted: b.isDone,
        completionType: 'checkbox',
        rawItem: b,
      });
    });

    // Sort chronologically by time
    return items.sort((a, b) => a.time.localeCompare(b.time));
  }, [habits, tasks, timeBlocks, todayStr]);

  const handleToggle = (item: (typeof scheduleItems)[0]) => {
    if (!item.isCompleted) {
      soundEngine.playChime('success');
      confetti({
        particleCount: 30,
        spread: 45,
        origin: { y: 0.7 },
        colors: ['#8E7CC3', '#FF8E7E', '#F4B843', '#83C5BE', '#4A3222'],
      });
    }

    if (item.type === 'habit') {
      onToggleHabit(item.rawItem.id);
    } else if (item.type === 'task') {
      onToggleTask(item.rawItem.id);
    } else {
      onToggleTimeBlock(item.rawItem.id);
    }
  };

  const completedCount = scheduleItems.filter((i) => i.isCompleted).length;
  const completionPercentage = scheduleItems.length > 0 ? Math.round((completedCount / scheduleItems.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 text-[#4A3222] dark:text-[#E2E8F0] shadow-sm border-2 sm:border-3 border-[#D7C9B1] dark:border-[#383D59] transition-colors">
        {/* Washi tape decor */}
        <div className="absolute -top-3 left-10 w-24 h-5 bg-[#8E7CC3]/30 rounded-sm transform -rotate-2 pointer-events-none" />
        <div className="absolute -top-3 right-12 w-28 h-5 bg-[#F4B843]/30 rounded-sm transform rotate-1 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="min-w-0 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8E7CC3]/15 dark:bg-[#8E7CC3]/25 border border-[#8E7CC3]/30 text-xs font-bold text-[#5A4688] dark:text-[#C5BAEB] mb-2.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>Day Planner & Timeline</span>
            </div>
            <h1 className="font-display italic font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#4A3222] dark:text-[#F1F5F9] tracking-tight leading-tight">
              {formatDatePretty(todayStr)}
            </h1>
            <p className="text-[#735A46] dark:text-[#94A3B8] text-xs sm:text-sm font-body mt-1 leading-relaxed">
              Your day in harmony: habits, timed tasks, and dedicated focus blocks structured chronologically.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white font-bold text-xs font-body shadow-xs inline-flex items-center gap-1.5 transition-all active:scale-95 shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Time Block</span>
          </button>
        </div>
      </div>

      {/* Progress Bar & Summary Pill */}
      <div className="bg-[#FAF6EE] dark:bg-[#1A1C2B] p-4 rounded-2xl border-2 border-[#D7C9B1] dark:border-[#383D59] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#F2EFF9] dark:bg-[#252136] text-[#5A4688] dark:text-[#C5BAEB] flex items-center justify-center border border-[#8E7CC3]/30">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#4A3222] dark:text-[#F1F5F9] font-body block">
              {scheduleItems.length} Scheduled Activities Today
            </span>
            <span className="text-[11px] text-[#735A46] dark:text-[#94A3B8] font-body">
              {completedCount} completed ({completionPercentage}%)
            </span>
          </div>
        </div>

        <div className="w-full sm:w-48 flex items-center gap-3">
          <div className="flex-1 h-3 bg-[#EFE7D8] dark:bg-[#2D334C] rounded-full overflow-hidden border border-[#D7C9B1] dark:border-[#3C4263]">
            <div
              className="h-full bg-[#8E7CC3] transition-all duration-500 rounded-full"
              style={{
                width: `${completionPercentage}%`,
              }}
            />
          </div>
          <span className="text-xs font-bold font-numeric text-[#4A3222] dark:text-[#E2E8F0]">
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Interactive Timeline List */}
      {scheduleItems.length === 0 ? (
        <div className="bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-3xl p-10 text-center border-2 border-dashed border-[#D7C9B1] dark:border-[#383D59]">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF8E7] dark:bg-[#2A261E] text-[#F4B843] flex items-center justify-center mx-auto mb-3 border border-[#F4B843]/30">
            <Calendar className="w-7 h-7" />
          </div>
          <h3 className="font-display italic font-bold text-xl text-[#4A3222] dark:text-[#F1F5F9] mb-1">
            No items scheduled for today
          </h3>
          <p className="text-xs text-[#735A46] dark:text-[#94A3B8] font-body max-w-sm mx-auto mb-5">
            Add habits with scheduled times, tasks with due dates, or create custom time blocks to visualize your timeline.
          </p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-[#8E7CC3] text-white text-xs font-bold font-body inline-flex items-center gap-1.5 shadow-xs hover:bg-[#7B68B4] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Time Block</span>
          </button>
        </div>
      ) : (
        <div className="relative pl-6 sm:pl-8 space-y-4 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#D7C9B1] dark:before:bg-[#383D59]">
          {scheduleItems.map((item) => {
            return (
              <div key={item.id} className="relative group">
                {/* Timeline Pin Node */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-4 w-6 h-6 rounded-full border-2 border-[#FAF8F5] dark:border-[#12131F] flex items-center justify-center shadow-xs transition-all ${
                    item.isCompleted
                      ? 'bg-[#E27B9B] text-white'
                      : 'bg-[#8E7CC3] text-white'
                  }`}
                >
                  {item.isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>

                {/* Item Card */}
                <div
                  className={`bg-[#FAF6EE] dark:bg-[#1C1E2E] rounded-2xl p-4 sm:p-5 border-2 transition-all shadow-xs ${
                    item.isCompleted
                      ? 'border-[#D7C9B1] dark:border-[#2D334C] bg-[#F4EFE6]/70 dark:bg-[#161825]/70 opacity-90'
                      : 'border-[#D7C9B1] dark:border-[#383D59] hover:border-[#8E7CC3] dark:hover:border-[#A798DD] hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left info */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs border border-black/10"
                        style={{ backgroundColor: item.color }}
                      >
                        <IconRenderer name={item.iconName} className="w-5 h-5" />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 font-numeric text-xs font-bold text-[#5A4688] dark:text-[#C5BAEB] bg-[#F2EFF9] dark:bg-[#252136] px-2 py-0.5 rounded-lg border border-[#8E7CC3]/30">
                            <Clock className="w-3 h-3" />
                            {item.time} {item.endTime ? `- ${item.endTime}` : ''}
                          </span>

                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C7662] dark:text-[#94A3B8] font-body bg-white/70 dark:bg-[#282C44] px-2 py-0.5 rounded-md border border-[#D7C9B1] dark:border-[#3C4263]">
                            {item.type === 'habit' ? 'Habit' : item.type === 'task' ? 'Task' : 'Time Block'}
                          </span>
                        </div>

                        <h4
                          className={`font-display italic font-bold text-base sm:text-lg mt-1 truncate ${
                            item.isCompleted ? 'line-through text-[#8C7662] dark:text-[#64748B]' : 'text-[#4A3222] dark:text-[#F1F5F9]'
                          }`}
                        >
                          {item.title}
                        </h4>

                        {item.subtitle && (
                          <p className="text-xs text-[#735A46] dark:text-[#94A3B8] font-body mt-0.5 line-clamp-1">
                            {item.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Actions: Pomodoro quick trigger + Confirmation */}
                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center w-full sm:w-auto">
                      {onStartPomodoro && !item.isCompleted && (
                        <button
                          type="button"
                          onClick={() => onStartPomodoro(item.rawItem)}
                          className="px-3 py-2 rounded-xl text-[#5A4688] dark:text-[#C5BAEB] hover:bg-[#F2EFF9] dark:hover:bg-[#252136] border border-[#8E7CC3]/30 font-bold text-xs font-body flex items-center gap-1 active:scale-95 transition-all bg-white dark:bg-[#23273C] shrink-0"
                          title="Start focus timer"
                        >
                          <Play className="w-3.5 h-3.5 fill-[#5A4688] dark:fill-[#C5BAEB]" />
                          <span>Focus</span>
                        </button>
                      )}

                      <div className="flex-1 sm:flex-initial">
                        {item.completionType === 'swipe' ? (
                          <div className="min-w-[170px]">
                            <SwipeToComplete
                              isCompleted={item.isCompleted}
                              onComplete={() => handleToggle(item)}
                              onUncomplete={() => handleToggle(item)}
                              color={item.color}
                              text="Swipe"
                              completedText="Done"
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggle(item)}
                            className={`w-full sm:w-auto px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 border ${
                              item.isCompleted
                                ? 'bg-[#FDF0F4] dark:bg-[#2F1823] text-[#B84067] dark:text-[#F8B4C8] border-[#F3C5D4] dark:border-[#5C283B] font-bold text-xs font-body'
                                : 'bg-white dark:bg-[#23273C] hover:bg-[#FFFDF8] dark:hover:bg-[#2B304A] text-[#4A3222] dark:text-[#E2E8F0] border-[#D7C9B1] dark:border-[#3C4263] font-bold text-xs font-body shadow-2xs'
                            }`}
                          >
                            <span>{item.isCompleted ? 'Completed' : 'Mark done'}</span>
                            <div
                              className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                                item.isCompleted
                                  ? 'bg-[#E27B9B] text-white shadow-xs'
                                  : 'border-2 border-[#D7C9B1] dark:border-[#4B5563] bg-white dark:bg-[#161825]'
                              }`}
                            >
                              {item.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Time block modal */}
      <TimeBlockModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={onAddTimeBlock}
      />
    </div>
  );
};
