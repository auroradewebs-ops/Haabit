import React, { useState, useMemo } from 'react';
import { Task } from '../../types';
import { TaskCard } from './TaskCard';
import { BulletJournalView } from './BulletJournalView';
import { Plus, Search, CheckCircle2, ListTodo, BookOpen, LayoutGrid } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onOpenCreateModal: () => void;
  onStartPomodoro?: (task: Task) => void;
  onUpdateTaskBujo?: (id: string, updates: Partial<Task>) => void;
  onQuickAddTask?: (taskData: Partial<Task>) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onOpenCreateModal,
  onStartPomodoro,
  onUpdateTaskBujo = () => {},
  onQuickAddTask = () => {},
}) => {
  const [viewMode, setViewMode] = useState<'bujo' | 'cards'>('bujo');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'high'>('pending');
  const [search, setSearch] = useState('');

  const completedCount = useMemo(() => tasks.filter((t) => t.completed || t.bujoStatus === 'completed').length, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        (task.notes && task.notes.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      const isCompleted = task.completed || task.bujoStatus === 'completed';

      if (filter === 'pending') return !isCompleted;
      if (filter === 'completed') return isCompleted;
      if (filter === 'high') return task.priority === 'high' || task.bujoSignifier === 'priority';

      return true;
    });
  }, [tasks, search, filter]);

  return (
    <div className="space-y-6">
      {/* View Switcher Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFDF8] dark:bg-[#1A1C2B] p-2.5 sm:p-3 rounded-2xl border-2 border-[#D7C9B1] dark:border-[#383D59] shadow-xs transition-colors">
        <div className="flex items-center gap-1.5 bg-[#FAF6EE] dark:bg-[#151726] p-1 rounded-xl shrink-0 border border-[#D7C9B1]/60 dark:border-[#2D334C]">
          <button
            type="button"
            onClick={() => setViewMode('bujo')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-body transition-all flex items-center gap-1.5 ${
              viewMode === 'bujo'
                ? 'bg-[#8E7CC3] text-white shadow-xs font-extrabold'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:text-[#4A3222] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#282C44]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bullet Journal Spread</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('cards')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-body transition-all flex items-center gap-1.5 ${
              viewMode === 'cards'
                ? 'bg-[#8E7CC3] text-white shadow-xs font-extrabold'
                : 'text-[#735A46] dark:text-[#94A3B8] hover:text-[#4A3222] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#282C44]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Card Grid View</span>
          </button>
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white text-xs font-bold font-body transition-all shadow-xs flex items-center justify-center gap-1.5 active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Task / Entry</span>
          </button>
        </div>
      </div>

      {/* Mode Content: Bullet Journal vs Cards */}
      {viewMode === 'bujo' ? (
        <BulletJournalView
          tasks={tasks}
          onToggleComplete={onToggleComplete}
          onUpdateTaskBujo={onUpdateTaskBujo}
          onQuickAddTask={onQuickAddTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onStartPomodoro={onStartPomodoro}
        />
      ) : (
        <div className="space-y-6">
          {/* Header Banner for Cards */}
          <div className="relative overflow-hidden bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-3xl p-6 sm:p-7 text-[#4A3222] dark:text-[#E2E8F0] shadow-md border-3 border-[#D7C9B1] dark:border-[#383D59]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8E7CC3]/15 dark:bg-[#8E7CC3]/25 text-xs font-bold text-[#5A4688] dark:text-[#C5BAEB] mb-2 border border-[#8E7CC3]/30">
                  <ListTodo className="w-3.5 h-3.5" />
                  <span>Tasks & Rapid Logs</span>
                </div>
                <h1 className="font-display italic font-bold text-3xl sm:text-4xl text-[#4A3222] dark:text-[#F1F5F9] tracking-tight">
                  Your Goals & Daily To-Dos
                </h1>
                <p className="text-[#735A46] dark:text-[#94A3B8] text-xs sm:text-sm font-body mt-1 max-w-md">
                  Break down projects into mindful steps and connect them directly to your Zen Focus Timer.
                </p>
              </div>

              <div className="bg-white/80 dark:bg-[#23273C] backdrop-blur-md rounded-2xl p-3 sm:p-4 border-2 border-[#D7C9B1] dark:border-[#3C4263] flex items-center gap-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-[#8E7CC3]/20 flex items-center justify-center text-[#5A4688] dark:text-[#C5BAEB]">
                  <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#735A46] dark:text-[#94A3B8] block font-body">Overall Progress</span>
                  <span className="text-lg font-bold font-numeric text-[#4A3222] dark:text-[#F1F5F9]">
                    {completedCount} of {tasks.length} done
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Bar for Cards */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFFDF8] dark:bg-[#1A1C2B] p-3 rounded-2xl border-2 border-[#D7C9B1] dark:border-[#383D59] shadow-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8C7662] dark:text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks or reflections..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#FAF6EE] dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#3C4263] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] focus:outline-none focus:border-[#8E7CC3]"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <button
                type="button"
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap font-body ${
                  filter === 'pending'
                    ? 'bg-[#8E7CC3] text-white shadow-xs font-extrabold'
                    : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE] dark:hover:bg-[#282C44]'
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setFilter('high')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap font-body ${
                  filter === 'high'
                    ? 'bg-[#FF8E7E] text-white shadow-xs font-extrabold'
                    : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE] dark:hover:bg-[#282C44]'
                }`}
              >
                High Priority
              </button>
              <button
                type="button"
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap font-body ${
                  filter === 'completed'
                    ? 'bg-emerald-600 text-white shadow-xs font-extrabold'
                    : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE] dark:hover:bg-[#282C44]'
                }`}
              >
                Completed
              </button>
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap font-body ${
                  filter === 'all'
                    ? 'bg-[#8E7CC3] text-white shadow-xs font-extrabold'
                    : 'text-[#735A46] dark:text-[#94A3B8] hover:bg-[#FAF6EE] dark:hover:bg-[#282C44]'
                }`}
              >
                All ({tasks.length})
              </button>
            </div>
          </div>

          {/* Tasks List */}
          {filteredTasks.length === 0 ? (
            <div className="bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-3xl p-10 text-center border-2 border-dashed border-[#D7C9B1] dark:border-[#383D59]">
              <div className="w-14 h-14 rounded-2xl bg-[#F2EFF9] dark:bg-[#252136] text-[#5A4688] dark:text-[#C5BAEB] flex items-center justify-center mx-auto mb-3">
                <ListTodo className="w-7 h-7" />
              </div>
              <h3 className="font-display italic font-bold text-xl text-[#4A3222] dark:text-[#F1F5F9] mb-1">
                No entries in this view
              </h3>
              <p className="text-xs text-[#735A46] dark:text-[#94A3B8] font-body max-w-sm mx-auto mb-5">
                Keep your mind clear by logging mindful tasks with dates and estimated focus sessions.
              </p>
              <button
                type="button"
                onClick={onOpenCreateModal}
                className="px-5 py-2.5 rounded-xl bg-[#8E7CC3] text-white text-xs font-bold font-body inline-flex items-center gap-1.5 shadow-xs hover:bg-[#7B68B4]"
              >
                <Plus className="w-4 h-4" />
                <span>Create Task</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleComplete}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onStartPomodoro={onStartPomodoro}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
