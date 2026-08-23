import React, { useState, useEffect } from 'react';
import {
  Habit,
  Task,
  PomodoroSettings,
  PomodoroSessionRecord,
  TimeBlock,
  AppReminder,
} from './types';
import {
  getStoredHabits,
  saveStoredHabits,
  getStoredTasks,
  saveStoredTasks,
  getStoredPomodoroSettings,
  saveStoredPomodoroSettings,
  getStoredPomodoroHistory,
  saveStoredPomodoroHistory,
  getStoredReminders,
  saveStoredReminders,
} from './utils/storage';
import { getTodayKey } from './utils/date';
import { sendLocalNotification } from './utils/notifications';

import { Header, ActiveTab } from './components/common/Header';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { HabitList } from './components/habits/HabitList';
import { HabitFormModal } from './components/habits/HabitFormModal';
import { TaskList } from './components/tasks/TaskList';
import { TaskFormModal } from './components/tasks/TaskFormModal';
import { PomodoroTimer } from './components/pomodoro/PomodoroTimer';
import { ScheduleTimeline } from './components/schedule/ScheduleTimeline';
import { StatsOverview } from './components/stats/StatsOverview';
import { ReminderManager } from './components/reminders/ReminderManager';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('habits');

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('aura_dark_mode');
      if (saved !== null) {
        return saved === 'true';
      }
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Apply dark class to document element
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('aura_dark_mode', String(isDarkMode));
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Core Data States
  const [habits, setHabits] = useState<Habit[]>(getStoredHabits);
  const [tasks, setTasks] = useState<Task[]>(getStoredTasks);
  const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(getStoredPomodoroSettings);
  const [pomodoroHistory, setPomodoroHistory] = useState<PomodoroSessionRecord[]>(getStoredPomodoroHistory);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [reminders, setReminders] = useState<AppReminder[]>(getStoredReminders);

  // Modals
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  // Read URL query param on mount (e.g. ?tab=pomodoro)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab') as ActiveTab;
    if (tabParam && ['habits', 'pomodoro', 'tasks', 'schedule', 'stats', 'reminders'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    // Register service worker if supported
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    // PWA Install prompt listener
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Save changes to LocalStorage
  useEffect(() => {
    saveStoredHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStoredPomodoroSettings(pomodoroSettings);
  }, [pomodoroSettings]);

  useEffect(() => {
    saveStoredPomodoroHistory(pomodoroHistory);
  }, [pomodoroHistory]);

  useEffect(() => {
    saveStoredReminders(reminders);
  }, [reminders]);

  // Periodic Reminder Checker
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      reminders.forEach((r) => {
        if (r.enabled && r.time === currentHHMM && now.getSeconds() < 15) {
          sendLocalNotification(`Recordatorio: ${r.title}`, r.message);
        }
      });
    };

    const interval = setInterval(checkReminders, 15000);
    return () => clearInterval(interval);
  }, [reminders]);

  // PWA Install Action
  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstallPwa(false);
    }
    setDeferredPrompt(null);
  };

  // Habit Actions
  const handleToggleHabit = (id: string) => {
    const todayStr = getTodayKey();
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        const exists = h.completedDates.includes(todayStr);
        const newDates = exists
          ? h.completedDates.filter((d) => d !== todayStr)
          : [...h.completedDates, todayStr];

        // Recalculate streak
        const newStreak = exists ? Math.max(0, h.streakCurrent - 1) : h.streakCurrent + 1;
        const newBest = Math.max(h.streakBest, newStreak);

        return {
          ...h,
          completedDates: newDates,
          streakCurrent: newStreak,
          streakBest: newBest,
        };
      })
    );
  };

  const handleSaveHabit = (habitData: Partial<Habit>) => {
    if (editingHabit) {
      setHabits((prev) =>
        prev.map((h) => (h.id === editingHabit.id ? ({ ...h, ...habitData } as Habit) : h))
      );
    } else {
      const newHabit: Habit = {
        id: 'h-' + Date.now(),
        title: habitData.title || 'New Habit',
        description: habitData.description,
        category: habitData.category || 'mente',
        color: habitData.color || '#8E7CC3',
        iconName: habitData.iconName || 'Sparkles',
        frequency: habitData.frequency || 'daily',
        targetTimeOfDay: habitData.targetTimeOfDay || 'morning',
        scheduledTime: habitData.scheduledTime,
        completionType: habitData.completionType || 'swipe',
        targetCount: habitData.targetCount || 1,
        targetUnit: habitData.targetUnit || 'times',
        reminderEnabled: habitData.reminderEnabled || false,
        reminderTime: habitData.reminderTime,
        streakCurrent: 0,
        streakBest: 0,
        completedDates: [],
        createdAt: new Date().toISOString(),
      };
      setHabits((prev) => [newHabit, ...prev]);
    }
    setEditingHabit(null);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  // Task Actions
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newCompleted = !t.completed;
        return {
          ...t,
          completed: newCompleted,
          bujoStatus: newCompleted ? 'completed' : 'todo',
        };
      })
    );
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? ({ ...t, ...taskData } as Task) : t))
      );
    } else {
      const newTask: Task = {
        id: 't-' + Date.now(),
        title: taskData.title || 'New Task',
        notes: taskData.notes,
        category: taskData.category || 'trabajo',
        dueDate: taskData.dueDate || getTodayKey(),
        dueTime: taskData.dueTime,
        priority: taskData.priority || 'medium',
        color: taskData.color || '#8E7CC3',
        iconName: taskData.iconName || 'CheckSquare',
        completionType: taskData.completionType || 'swipe',
        estimatedPomodoros: taskData.estimatedPomodoros || 1,
        completedPomodoros: 0,
        completed: false,
        createdAt: new Date().toISOString(),
        bujoType: taskData.bujoType || 'task',
        bujoSignifier: taskData.bujoSignifier || 'none',
        bujoStatus: taskData.bujoStatus || 'todo',
        collection: taskData.collection || 'daily',
        imageUrl: taskData.imageUrl,
        imageLayout: taskData.imageLayout || 'polaroid',
        imageCaption: taskData.imageCaption,
      };
      setTasks((prev) => [newTask, ...prev]);
    }
    setEditingTask(null);
  };

  const handleUpdateTaskBujo = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const handleQuickAddTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: 't-' + Date.now(),
      title: taskData.title || 'New Entry',
      notes: taskData.notes || '',
      category: taskData.category || 'trabajo',
      dueDate: taskData.dueDate || getTodayKey(),
      priority: taskData.priority || 'medium',
      color: taskData.color || '#8E7CC3',
      iconName: taskData.iconName || 'CheckSquare',
      completionType: 'swipe',
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      completed: false,
      createdAt: new Date().toISOString(),
      bujoType: taskData.bujoType || 'task',
      bujoSignifier: taskData.bujoSignifier || 'none',
      bujoStatus: taskData.bujoStatus || 'todo',
      collection: taskData.collection || 'daily',
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Pomodoro Actions
  const handleSessionComplete = (record: PomodoroSessionRecord) => {
    setPomodoroHistory((prev) => [record, ...prev]);

    // If linked to task, increment pomodoros
    if (record.linkedTaskId) {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === record.linkedTaskId) {
            const nextCompleted = (t.completedPomodoros || 0) + 1;
            return {
              ...t,
              completedPomodoros: nextCompleted,
              completed: t.estimatedPomodoros ? nextCompleted >= t.estimatedPomodoros : t.completed,
            };
          }
          return t;
        })
      );
    }
  };

  const handleStartPomodoroFor = (item: Habit | Task) => {
    setActiveTab('pomodoro');
  };

  // Schedule Timeline Block Actions
  const handleAddTimeBlock = (blockData: Partial<TimeBlock>) => {
    const newBlock: TimeBlock = {
      id: 'tb-' + Date.now(),
      title: blockData.title || 'Time Block',
      startTime: blockData.startTime || '09:00',
      endTime: blockData.endTime || '10:00',
      color: blockData.color || '#8E7CC3',
      iconName: blockData.iconName || 'Clock',
      type: 'custom',
      isDone: false,
    };
    setTimeBlocks((prev) => [...prev, newBlock]);
  };

  const handleToggleTimeBlock = (id: string) => {
    setTimeBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, isDone: !b.isDone } : b))
    );
  };

  // Reminder Actions
  const handleAddReminder = (reminderData: Partial<AppReminder>) => {
    const newRem: AppReminder = {
      id: 'rem-' + Date.now(),
      title: reminderData.title || 'Gentle Reminder',
      message: reminderData.message || 'Time for mindful focus & recharge',
      time: reminderData.time || '12:00',
      type: reminderData.type || 'custom',
      enabled: true,
      repeatDaily: true,
    };
    setReminders((prev) => [...prev, newRem]);
  };

  const handleToggleReminder = (id: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleDeleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#12131F] text-[#4A3222] dark:text-[#E2E8F0] pb-24 md:pb-12 selection:bg-[#8E7CC3]/30 selection:text-[#5A4688] dark:selection:text-[#C5BAEB] transition-colors duration-300">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        canInstallPwa={canInstallPwa}
        onInstallPwa={handleInstallPwa}
        unreadRemindersCount={reminders.filter((r) => r.enabled).length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Tab Views */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-6">
        {activeTab === 'habits' && (
          <HabitList
            habits={habits}
            onToggleComplete={handleToggleHabit}
            onEditHabit={(h) => {
              setEditingHabit(h);
              setIsHabitModalOpen(true);
            }}
            onDeleteHabit={handleDeleteHabit}
            onOpenCreateModal={() => {
              setEditingHabit(null);
              setIsHabitModalOpen(true);
            }}
            onStartPomodoro={handleStartPomodoroFor}
          />
        )}

        {activeTab === 'pomodoro' && (
          <PomodoroTimer
            settings={pomodoroSettings}
            onUpdateSettings={setPomodoroSettings}
            onSessionComplete={handleSessionComplete}
            habits={habits}
            tasks={tasks}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskList
            tasks={tasks}
            onToggleComplete={handleToggleTask}
            onUpdateTaskBujo={handleUpdateTaskBujo}
            onQuickAddTask={handleQuickAddTask}
            onEditTask={(t) => {
              setEditingTask(t);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onOpenCreateModal={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            onStartPomodoro={handleStartPomodoroFor}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleTimeline
            habits={habits}
            tasks={tasks}
            timeBlocks={timeBlocks}
            onAddTimeBlock={handleAddTimeBlock}
            onToggleTimeBlock={handleToggleTimeBlock}
            onToggleHabit={handleToggleHabit}
            onToggleTask={handleToggleTask}
            onStartPomodoro={handleStartPomodoroFor}
          />
        )}

        {activeTab === 'stats' && (
          <StatsOverview
            habits={habits}
            tasks={tasks}
            pomodoroHistory={pomodoroHistory}
          />
        )}

        {activeTab === 'reminders' && (
          <ReminderManager
            reminders={reminders}
            onAddReminder={handleAddReminder}
            onToggleReminder={handleToggleReminder}
            onDeleteReminder={handleDeleteReminder}
          />
        )}
      </main>

      {/* Mobile Bottom Dock Bar */}
      <MobileBottomBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Habit Create / Edit Modal */}
      <HabitFormModal
        isOpen={isHabitModalOpen}
        onClose={() => {
          setIsHabitModalOpen(false);
          setEditingHabit(null);
        }}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />

      {/* Task Create / Edit Modal */}
      <TaskFormModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        editingTask={editingTask}
      />
    </div>
  );
}
