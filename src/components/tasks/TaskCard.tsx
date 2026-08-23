import React, { useState } from 'react';
import { Task } from '../../types';
import { IconRenderer } from '../common/IconRenderer';
import { SwipeToComplete } from '../common/SwipeToComplete';
import { Clock, Calendar, Play, MoreVertical, Edit3, Trash2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audio';
import { BujoDecorativeImage } from './BujoDecorativeImage';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStartPomodoro?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onEdit,
  onDelete,
  onStartPomodoro,
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleCheckbox = () => {
    if (!task.completed) {
      soundEngine.playChime('success');
      confetti({
        particleCount: 35,
        spread: 50,
        origin: { y: 0.75 },
        colors: ['#8E7CC3', '#FF8E7E', '#F4B843', '#5FA382', '#4A3222'],
      });
    }
    onToggleComplete(task.id);
  };

  const getPriorityBadge = (p: Task['priority']) => {
    switch (p) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40 text-[11px] font-bold">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40 text-[11px] font-medium">
            Medium Priority
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[11px] font-medium">
            Low Priority
          </span>
        );
    }
  };

  return (
    <div
      className={`relative bg-[#FAF6EE] dark:bg-[#1C1E2E] rounded-2xl p-4 sm:p-5 transition-all duration-200 border-2 overflow-hidden shadow-xs ${
        task.completed
          ? 'border-[#D7C9B1] dark:border-[#2D334C] bg-[#F4EFE6]/70 dark:bg-[#161825]/70 opacity-90'
          : 'border-[#D7C9B1] dark:border-[#383D59] hover:border-[#8E7CC3] dark:hover:border-[#A798DD] hover:shadow-md'
      }`}
    >
      {/* Top Banner if imageLayout is banner */}
      {task.imageUrl && task.imageLayout === 'banner' && (
        <div className="-mx-4 -mt-4 sm:-mx-5 sm:-mt-5 mb-3">
          <BujoDecorativeImage
            imageUrl={task.imageUrl}
            imageLayout="banner"
            caption={task.imageCaption}
            onEdit={() => onEdit(task)}
          />
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs border border-black/10 dark:border-white/10 overflow-hidden"
            style={{ backgroundColor: task.color || '#8E7CC3' }}
          >
            <IconRenderer name={task.iconName} className="w-5 h-5" size={20} />
          </div>

          <div className="min-w-0">
            <h4
              className={`font-semibold text-base font-body leading-snug truncate ${
                task.completed ? 'line-through text-[#8C7662] dark:text-[#64748B]' : 'text-[#4A3222] dark:text-[#F1F5F9]'
              }`}
            >
              {task.title}
            </h4>
            {task.notes && (
              <p className="text-xs text-[#735A46] dark:text-[#94A3B8] font-body line-clamp-1 mt-0.5">
                {task.notes}
              </p>
            )}
          </div>
        </div>

        {/* Menu & Pomodoro Action */}
        <div className="flex items-center gap-1 shrink-0 relative">
          {onStartPomodoro && (
            <button
              type="button"
              onClick={() => onStartPomodoro(task)}
              className="p-1.5 sm:p-2 rounded-xl text-[#5A4688] dark:text-[#C5BAEB] hover:bg-[#F2EFF9] dark:hover:bg-[#282C44] active:scale-95 transition-all flex items-center gap-1 text-xs font-semibold"
              title="Focus task with Pomodoro timer"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-[#8C7662] dark:text-[#94A3B8] hover:text-[#4A3222] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-36 bg-[#FFFDF8] dark:bg-[#1E2133] rounded-xl shadow-xl border border-[#D7C9B1] dark:border-[#3C4263] py-1.5 z-20">
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onEdit(task);
                }}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-[#4A3222] dark:text-[#E2E8F0] hover:bg-[#FAF6EE] dark:hover:bg-[#282C44] flex items-center gap-2"
              >
                <Edit3 className="w-3.5 h-3.5 text-[#8E7CC3] dark:text-[#A798DD]" /> Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowMenu(false);
                  onDelete(task.id);
                }}
                className="w-full px-3 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inline Decorative Image (Polaroid, Stamp, Washi, Sticker) */}
      {task.imageUrl && task.imageLayout !== 'banner' && (
        <div className="my-2 flex justify-start">
          <BujoDecorativeImage
            imageUrl={task.imageUrl}
            imageLayout={task.imageLayout}
            caption={task.imageCaption}
            onEdit={() => onEdit(task)}
          />
        </div>
      )}

      {/* Badges & Meta info */}
      <div className="flex items-center gap-2 flex-wrap mb-4 text-xs font-body">
        {task.bujoType && (
          <span className="px-2 py-0.5 rounded-full bg-[#8E7CC3]/15 dark:bg-[#8E7CC3]/25 text-[#5A4688] dark:text-[#C5BAEB] border border-[#8E7CC3]/30 text-[11px] font-bold font-mono">
            {task.bujoType === 'event' ? '○ Event' : task.bujoType === 'note' ? '— Note' : '• BuJo Task'}
          </span>
        )}

        {getPriorityBadge(task.priority)}

        {task.collection && task.collection !== 'daily' && (
          <span className="px-2 py-0.5 rounded-full bg-white/80 dark:bg-[#282C44] text-[#735A46] dark:text-[#CBD5E1] border border-[#D7C9B1] dark:border-[#3C4263] text-[11px] font-medium">
            {task.collection}
          </span>
        )}

        {task.dueDate && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 dark:bg-[#282C44] text-[#735A46] dark:text-[#CBD5E1] border border-[#D7C9B1] dark:border-[#3C4263] font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{task.dueDate}</span>
          </div>
        )}

        {task.dueTime && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 dark:bg-[#282C44] text-[#735A46] dark:text-[#CBD5E1] border border-[#D7C9B1] dark:border-[#3C4263] font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>{task.dueTime}</span>
          </div>
        )}

        {task.estimatedPomodoros > 0 && (
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#F2EFF9] dark:bg-[#252136] text-[#5A4688] dark:text-[#C5BAEB] border border-[#8E7CC3]/30 font-bold text-[11px]">
            <Play className="w-3 h-3 fill-current" />
            <span>{task.completedPomodoros}/{task.estimatedPomodoros} pomodoros</span>
          </div>
        )}
      </div>

      {/* Completion (Swipe VS Checkbox) */}
      <div>
        {task.completionType === 'swipe' ? (
          <SwipeToComplete
            isCompleted={task.completed}
            onComplete={() => onToggleComplete(task.id)}
            onUncomplete={() => onToggleComplete(task.id)}
            color={task.color || '#8E7CC3'}
            text="Swipe to complete task"
            completedText="Task completed successfully! 🌿"
          />
        ) : (
          <button
            type="button"
            onClick={handleCheckbox}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between transition-all active:scale-[0.99] border ${
              task.completed
                ? 'bg-[#EBF7F2] dark:bg-[#172D24] text-[#23684F] dark:text-[#72D6B0] border-[#A2D5C6] dark:border-[#2D6A53] font-semibold'
                : 'bg-white dark:bg-[#282C44] hover:bg-[#FFFDF8] dark:hover:bg-[#323755] text-[#4A3222] dark:text-[#E2E8F0] border-[#D7C9B1] dark:border-[#3C4263] font-medium shadow-xs'
            }`}
          >
            <span className="text-xs font-body tracking-tight">
              {task.completed ? 'Task Finished' : 'Mark task as done'}
            </span>
            <div
              className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                task.completed
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'border-2 border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#1E2133]'
              }`}
            >
              {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
            </div>
          </button>
        )}
      </div>
    </div>
  );
};
