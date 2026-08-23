import React, { useState, useMemo, useEffect } from 'react';
import { Task, BujoType, BujoStatus, BujoSignifier, BujoPaperSettings, BujoImageLayout } from '../../types';
import { getTodayKey, formatDatePretty } from '../../utils/date';
import {
  BookOpen,
  Plus,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  Star,
  Sparkles,
  Search,
  Calendar,
  Layers,
  HelpCircle,
  Play,
  Trash2,
  Edit2,
  Clock,
  ChevronRight,
  AlertCircle,
  Bookmark,
  FileText,
  Sliders,
  Palette,
  Camera,
  Image as ImageIcon,
  Tag,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audio';
import {
  DEFAULT_BUJO_PAPER_SETTINGS,
  getBujoPaperStyles,
  BUJO_STICKER_PRESETS,
} from '../../utils/bujoPresets';
import { BujoPaperCustomizerModal } from './BujoPaperCustomizerModal';
import { BujoDecorationPickerModal } from './BujoDecorationPickerModal';
import { BujoDecorativeImage } from './BujoDecorativeImage';
import { BujoScrapbookSpread } from './BujoScrapbookSpread';

interface BulletJournalViewProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onUpdateTaskBujo: (id: string, updates: Partial<Task>) => void;
  onQuickAddTask: (taskData: Partial<Task>) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onStartPomodoro?: (task: Task) => void;
}

export const BulletJournalView: React.FC<BulletJournalViewProps> = ({
  tasks,
  onToggleComplete,
  onUpdateTaskBujo,
  onQuickAddTask,
  onEditTask,
  onDeleteTask,
  onStartPomodoro,
}) => {
  const todayStr = getTodayKey();

  // Layout View Mode: 'scrapbook' (Double-page album) or 'list' (Analog ledger)
  const [viewMode, setViewMode] = useState<'scrapbook' | 'list'>('scrapbook');

  // Paper Settings State (Persisted in localStorage)
  const [paperSettings, setPaperSettings] = useState<BujoPaperSettings>(() => {
    try {
      const saved = localStorage.getItem('whimsical_bujo_paper_settings');
      return saved ? JSON.parse(saved) : DEFAULT_BUJO_PAPER_SETTINGS;
    } catch {
      return DEFAULT_BUJO_PAPER_SETTINGS;
    }
  });

  const handleUpdatePaperSettings = (newSettings: BujoPaperSettings) => {
    setPaperSettings(newSettings);
    try {
      localStorage.setItem('whimsical_bujo_paper_settings', JSON.stringify(newSettings));
    } catch (e) {
      console.error(e);
    }
  };

  const [showPaperModal, setShowPaperModal] = useState(false);

  // Active Collection Tab
  const [activeCollection, setActiveCollection] = useState<string>('daily');
  const [customCollections, setCustomCollections] = useState<string[]>([
    'Ideas & Projects',
    'Books & Reading',
    'Gratitude & Reflections',
  ]);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [isAddingCollection, setIsAddingCollection] = useState(false);

  // Rapid Logging State
  const [rapidText, setRapidText] = useState('');
  const [rapidType, setRapidType] = useState<BujoType>('task');
  const [rapidSignifier, setRapidSignifier] = useState<BujoSignifier>('none');
  const [rapidTime, setRapidTime] = useState('');
  const [rapidImageUrl, setRapidImageUrl] = useState<string>('');
  const [rapidImageLayout, setRapidImageLayout] = useState<BujoImageLayout>('polaroid');
  const [rapidImageCaption, setRapidImageCaption] = useState<string>('');
  const [showRapidStickerPicker, setShowRapidStickerPicker] = useState(false);

  // Key Legend Modal
  const [showKeyModal, setShowKeyModal] = useState(false);

  // Item Decoration Modal State
  const [decoratingTask, setDecoratingTask] = useState<Task | null>(null);

  // Tasks Migration State
  const pendingPastTasks = useMemo(() => {
    return tasks.filter(
      (t) =>
        t.dueDate < todayStr &&
        !t.completed &&
        t.bujoStatus !== 'migrated' &&
        t.bujoStatus !== 'cancelled'
    );
  }, [tasks, todayStr]);

  // Filter tasks based on current collection
  const displayedItems = useMemo(() => {
    if (activeCollection === 'daily') {
      return tasks.filter(
        (t) =>
          (t.dueDate === todayStr || (!t.dueDate && t.collection === 'daily')) &&
          (!t.collection || t.collection === 'daily')
      );
    }
    if (activeCollection === 'monthly') {
      const currentMonth = todayStr.substring(0, 7); // YYYY-MM
      return tasks.filter((t) => t.dueDate?.startsWith(currentMonth) || t.collection === 'monthly');
    }
    if (activeCollection === 'future') {
      return tasks.filter((t) => t.dueDate > todayStr || t.collection === 'future' || t.bujoStatus === 'scheduled');
    }
    // Custom Collection
    return tasks.filter((t) => t.collection === activeCollection);
  }, [tasks, activeCollection, todayStr]);

  // Handle Rapid Logging Submission
  const handleRapidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rapidText.trim()) return;

    soundEngine.playClick();
    onQuickAddTask({
      title: rapidText.trim(),
      dueDate: activeCollection === 'daily' ? todayStr : activeCollection === 'future' ? '' : todayStr,
      dueTime: rapidTime || undefined,
      category: 'trabajo',
      priority: rapidSignifier === 'priority' ? 'high' : 'medium',
      completed: false,
      completionType: 'checkbox',
      estimatedPomodoros: 1,
      completedPomodoros: 0,
      color: '#8E7CC3',
      iconName: rapidType === 'event' ? 'Calendar' : rapidType === 'note' ? 'FileText' : 'CheckSquare',
      bujoType: rapidType,
      bujoStatus: 'todo',
      bujoSignifier: rapidSignifier,
      collection: activeCollection,
      imageUrl: rapidImageUrl || undefined,
      imageLayout: rapidImageUrl ? rapidImageLayout : undefined,
      imageCaption: rapidImageUrl ? rapidImageCaption : undefined,
    });

    setRapidText('');
    setRapidTime('');
    setRapidSignifier('none');
    setRapidImageUrl('');
    setRapidImageCaption('');
  };

  // Migrate past tasks to today
  const handleMigratePastTasks = () => {
    pendingPastTasks.forEach((t) => {
      onUpdateTaskBujo(t.id, {
        dueDate: todayStr,
        bujoStatus: 'migrated',
        migratedToDate: todayStr,
      });
    });
    soundEngine.playChime('success');
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#8E7CC3', '#FF8E7E', '#F4B843'],
    });
  };

  // Toggle BuJo status on click
  const handleCycleBujoStatus = (task: Task) => {
    const currentStatus = task.bujoStatus || (task.completed ? 'completed' : 'todo');
    let nextStatus: BujoStatus = 'todo';
    let isCompleted = false;

    if (currentStatus === 'todo') {
      nextStatus = 'completed';
      isCompleted = true;
      soundEngine.playChime('success');
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.7 },
        colors: ['#8E7CC3', '#FF8E7E', '#F4B843'],
      });
    } else if (currentStatus === 'completed') {
      nextStatus = 'migrated';
      isCompleted = false;
      soundEngine.playClick();
    } else if (currentStatus === 'migrated') {
      nextStatus = 'cancelled';
      isCompleted = false;
      soundEngine.playClick();
    } else {
      nextStatus = 'todo';
      isCompleted = false;
      soundEngine.playClick();
    }

    onUpdateTaskBujo(task.id, {
      bujoStatus: nextStatus,
      completed: isCompleted,
      completedAt: isCompleted ? new Date().toISOString() : undefined,
    });
  };

  // Add custom collection
  const handleAddCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    if (!customCollections.includes(newCollectionName.trim())) {
      setCustomCollections([...customCollections, newCollectionName.trim()]);
      setActiveCollection(newCollectionName.trim());
    }
    setNewCollectionName('');
    setIsAddingCollection(false);
  };

  // Render BuJo Bullet with Signifier
  const renderBujoBullet = (task: Task) => {
    const bType = task.bujoType || 'task';
    const status = task.bujoStatus || (task.completed ? 'completed' : 'todo');
    const signifier = task.bujoSignifier || (task.priority === 'high' ? 'priority' : 'none');

    return (
      <div className="relative inline-flex items-center justify-center shrink-0">
        {/* Signifier prefix */}
        {signifier === 'priority' && (
          <span className="text-amber-500 font-bold text-sm mr-1 font-mono leading-none" title="High Priority">
            ★
          </span>
        )}
        {signifier === 'inspiration' && (
          <span className="text-[#FF8E7E] font-bold text-xs mr-1 font-mono leading-none" title="Inspiration / Idea">
            !
          </span>
        )}
        {signifier === 'explore' && (
          <span className="text-[#8E7CC3] font-bold text-xs mr-1 font-mono leading-none" title="Question / Explore">
            ?
          </span>
        )}

        {/* Main BuJo Symbol */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleCycleBujoStatus(task);
          }}
          className="w-7 h-7 rounded-lg hover:bg-black/5 active:scale-95 transition-all flex items-center justify-center font-mono font-bold text-base select-none"
          title="Click to cycle BuJo status (• Todo → ✕ Completed → > Migrated → ~ Cancelled)"
        >
          {status === 'completed' ? (
            <span className="text-emerald-600 font-black text-lg">✕</span>
          ) : status === 'migrated' ? (
            <span className="text-[#5A4688] font-black text-lg">›</span>
          ) : status === 'scheduled' ? (
            <span className="text-[#FF8E7E] font-black text-lg">‹</span>
          ) : status === 'cancelled' ? (
            <span className="text-stone-400 font-bold line-through text-base">✕</span>
          ) : bType === 'event' ? (
            <span className="text-[#5A4688] font-black text-lg">○</span>
          ) : bType === 'note' ? (
            <span className="text-stone-700 font-black text-lg">—</span>
          ) : (
            <span className="text-[#5A4688] font-black text-xl leading-none">•</span>
          )}
        </button>
      </div>
    );
  };

  const paperStyles = getBujoPaperStyles(paperSettings);
  const isDarkModePaper = paperSettings.paperTone === 'midnight';

  const ribbonColors: Record<BujoPaperSettings['bookmarkColor'], string> = {
    navy: '#243B66',
    rose: '#FF8E7E',
    emerald: '#8E7CC3',
    gold: '#F4B843',
    terracotta: '#C85A32',
    violet: '#8B5CF6',
  };

  return (
    <div className="space-y-6">
      {/* BuJo Top Bar & Customization Controller */}
      <div className="relative overflow-hidden bg-[#FAF6EE] rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 text-[#4A3222] shadow-sm border-2 sm:border-3 border-[#D7C9B1]">
        {/* Subtle decorative background watermark */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#8E7CC3]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
          {/* Header Title & Subtitle */}
          <div className="min-w-0 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8E7CC3]/15 border border-[#8E7CC3]/30 text-xs font-bold text-[#5A4688] mb-2">
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span className="whitespace-nowrap">Bullet Journal & Storybook Log</span>
            </div>
            <h1 className="font-display italic font-extrabold text-2xl sm:text-3xl text-[#4A3222] tracking-tight leading-snug">
              Rapid Logging & Scrapbook Journal
            </h1>
            <p className="text-[#735A46] text-xs sm:text-sm font-body mt-1 leading-relaxed">
              Organize your days mindfully: tasks (•), events (○), notes (—), polaroids, and customizable stationery.
            </p>
          </div>

          {/* Action Controls & View Switcher */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0">
            {/* View Mode Toggle: Scrapbook vs List */}
            <div className="bg-[#F2EFF9] p-1 rounded-xl sm:rounded-2xl flex items-center gap-1 border border-[#8E7CC3]/30 w-full sm:w-auto shrink-0">
              <button
                type="button"
                onClick={() => {
                  setViewMode('scrapbook');
                  soundEngine.playClick();
                }}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl font-bold text-xs font-body transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  viewMode === 'scrapbook'
                    ? 'bg-[#8E7CC3] text-white shadow-xs font-extrabold'
                    : 'text-[#4D3222]/80 hover:text-[#4D3222]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Double Spread</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setViewMode('list');
                  soundEngine.playClick();
                }}
                className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-1.5 rounded-lg sm:rounded-xl font-bold text-xs font-body transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                  viewMode === 'list'
                    ? 'bg-[#8E7CC3] text-white shadow-xs font-extrabold'
                    : 'text-[#4D3222]/80 hover:text-[#4D3222]'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Rapid Ledger</span>
              </button>
            </div>

            {/* Paper Customizer Trigger */}
            <button
              type="button"
              onClick={() => setShowPaperModal(true)}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white hover:bg-[#FFF5E6] text-[#4A3222] font-bold text-xs font-body border border-[#D7C9B1] shadow-xs flex items-center justify-center gap-2 active:scale-95 transition-all whitespace-nowrap"
              title="Customize paper color, dot grid or lined textures, and binder style"
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-stone-300 shadow-2xs shrink-0"
                style={{ backgroundColor: paperStyles.backgroundColor }}
              />
              <Palette className="w-3.5 h-3.5 text-[#5A4688] shrink-0" />
              <span>Paper Theme</span>
            </button>

            {/* Symbols Legend */}
            <button
              type="button"
              onClick={() => setShowKeyModal(true)}
              className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white hover:bg-[#FFF5E6] text-[#4A3222] font-bold text-xs font-body border border-[#D7C9B1] shadow-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all whitespace-nowrap"
            >
              <HelpCircle className="w-4 h-4 text-[#F4B843] shrink-0" />
              <span>Symbols Key</span>
            </button>
          </div>
        </div>
      </div>

      {/* RENDER SCRAPBOOK SPREAD (Double Page Storybook Spread) */}
      {viewMode === 'scrapbook' ? (
        <BujoScrapbookSpread
          tasks={tasks}
          onToggleComplete={onToggleComplete}
          onUpdateTaskBujo={onUpdateTaskBujo}
          onQuickAddTask={onQuickAddTask}
          onEditTask={onEditTask}
          paperSettings={paperSettings}
          activeCollectionTab={activeCollection}
          onSelectCollectionTab={(tab) => {
            if (tab === 'album') {
              setViewMode('scrapbook');
            } else {
              setActiveCollection(tab);
              setViewMode('list');
            }
          }}
        />
      ) : null}

      {/* Migration Assistant Notification if there are past pending tasks (List view) */}
      {viewMode === 'list' && pendingPastTasks.length > 0 && activeCollection === 'daily' && (
        <div className="bg-[#FFF8EE] border-2 border-[#F4B843] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4B843]/30 text-[#694A2D] flex items-center justify-center font-mono font-bold text-lg shrink-0">
              ›
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#4A3222] font-body">
                You have {pendingPastTasks.length} pending {pendingPastTasks.length === 1 ? 'task' : 'tasks'} from previous days
              </h4>
              <p className="text-[11px] text-[#735A46] font-body">
                The Bullet Journal method encourages intentional migration or discarding tasks that no longer serve you.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleMigratePastTasks}
            className="px-4 py-2 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white font-bold text-xs font-body shadow-xs flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap"
          >
            <span>Migrate to Today (›)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Notebook Spine / Tabs of Collections & List View */}
      {viewMode === 'list' && (
        <>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b-2 border-[#D7C9B1]">
            <button
              type="button"
              onClick={() => setActiveCollection('daily')}
              className={`px-4 py-2 rounded-t-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeCollection === 'daily'
                  ? 'bg-[#FAF6EE] text-[#4A3222] border-t-2 border-x-2 border-[#D7C9B1] shadow-xs font-extrabold'
                  : 'text-[#8C7662] hover:text-[#4A3222] hover:bg-stone-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-[#5A4688]" />
              <span>Daily Log (Today)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCollection('monthly')}
              className={`px-4 py-2 rounded-t-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeCollection === 'monthly'
                  ? 'bg-[#FAF6EE] text-[#4A3222] border-t-2 border-x-2 border-[#D7C9B1] shadow-xs font-extrabold'
                  : 'text-[#8C7662] hover:text-[#4A3222] hover:bg-stone-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#8E7CC3]" />
              <span>Monthly Log</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCollection('future')}
              className={`px-4 py-2 rounded-t-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeCollection === 'future'
                  ? 'bg-[#FAF6EE] text-[#4A3222] border-t-2 border-x-2 border-[#D7C9B1] shadow-xs font-extrabold'
                  : 'text-[#8C7662] hover:text-[#4A3222] hover:bg-stone-100'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 text-[#FF8E7E]" />
              <span>Future Log</span>
            </button>

            {customCollections.map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => setActiveCollection(col)}
                className={`px-4 py-2 rounded-t-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeCollection === col
                    ? 'bg-[#FAF6EE] text-[#4A3222] border-t-2 border-x-2 border-[#D7C9B1] shadow-xs font-extrabold'
                    : 'text-[#8C7662] hover:text-[#4A3222] hover:bg-stone-100'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-stone-600" />
                <span>{col}</span>
              </button>
            ))}

            {isAddingCollection ? (
              <form onSubmit={handleAddCollection} className="inline-flex items-center gap-1 pl-2">
                <input
                  type="text"
                  autoFocus
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Collection name..."
                  className="px-2.5 py-1 text-xs font-body rounded-lg border border-[#D7C9B1] focus:border-[#8E7CC3] focus:outline-none w-36 bg-[#FAF6EE]"
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-[#8E7CC3] text-white rounded-lg text-xs font-bold"
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingCollection(false)}
                  className="px-1.5 py-1 text-stone-400 hover:text-stone-700 text-xs"
                >
                  ✕
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setIsAddingCollection(true)}
                className="px-2.5 py-1.5 text-xs font-bold text-[#8C7662] hover:text-[#4A3222] hover:bg-stone-100 rounded-lg flex items-center gap-1 whitespace-nowrap"
                title="Create a new custom collection"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Collection</span>
              </button>
            )}
          </div>

          {/* Main Bullet Journal Customizable Notebook Container */}
          <div className="relative">
            {/* Binder Accessories Visuals */}

            {/* 1. Spiral Binder Rings on Left */}
            {paperSettings.bindingStyle === 'spiral' && (
              <div className="absolute left-1 sm:left-2 top-8 bottom-8 flex flex-col justify-between z-20 pointer-events-none">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-0.5">
                    {/* Hole */}
                    <div className="w-2.5 h-2.5 rounded-full bg-[#4A3222]/40 shadow-inner border border-white/20" />
                    {/* Spiral Ring wire */}
                    <div className="w-4 h-1.5 -ml-1 rounded-sm bg-gradient-to-r from-stone-400 via-stone-200 to-stone-400 shadow-xs border-y border-stone-500/50" />
                  </div>
                ))}
              </div>
            )}

            {/* 2. Top Pad Tear-off Header */}
            {paperSettings.bindingStyle === 'clean-pad' && (
              <div className="absolute -top-3 inset-x-8 h-4 bg-[#8C5E48] rounded-t-lg shadow-md border-b-2 border-stone-800/20 z-20 pointer-events-none flex items-center justify-center">
                <div className="h-0.5 w-1/3 bg-black/20 rounded-full" />
              </div>
            )}

            {/* 3. Silk Ribbon Bookmark on Top Right */}
            {paperSettings.showBookmark && (
              <div
                className="absolute -top-2 right-8 sm:right-12 w-5 h-20 shadow-lg rounded-b-sm border-x border-black/10 z-20 pointer-events-none transition-all"
                style={{
                  backgroundColor: ribbonColors[paperSettings.bookmarkColor] || '#FF8E7E',
                }}
              >
                {/* Notch and shadow */}
                <div className="absolute bottom-0 inset-x-0 h-3 bg-gradient-to-b from-transparent to-black/30" />
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[8px] border-t-black/20" />
              </div>
            )}

            {/* 4. Washi Tape Corners */}
            {paperSettings.showWashiCorners && (
              <>
                <div className="absolute -top-3 -left-3 w-14 h-6 bg-[#F4B843]/85 -rotate-45 border border-amber-300/60 shadow-2xs z-20 pointer-events-none" />
                <div className="absolute -bottom-3 -right-3 w-14 h-6 bg-[#FF8E7E]/75 -rotate-45 border border-pink-300/60 shadow-2xs z-20 pointer-events-none" />
              </>
            )}

            {/* The Paper Surface */}
            <div
              className={`rounded-3xl border-3 shadow-md p-5 sm:p-8 min-h-[560px] relative transition-all overflow-hidden ${
                paperSettings.bindingStyle === 'spiral' ? 'pl-9 sm:pl-12' : ''
              } ${
                paperSettings.bindingStyle === 'leather-folio'
                  ? 'ring-8 ring-[#4A3222]/90 border-[#4A3222]'
                  : 'border-[#D7C9B1]'
              }`}
              style={{
                backgroundColor: paperStyles.backgroundColor,
                backgroundImage: paperStyles.backgroundImage,
                backgroundSize: paperStyles.backgroundSize,
                color: paperStyles.color,
              }}
            >
              {/* Notebook Page Header / Stamp */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b-2 border-stone-300/60 gap-2">
                <div>
                  <span
                    className="text-[11px] font-mono font-bold uppercase tracking-widest block opacity-80"
                    style={{ color: isDarkModePaper ? '#93C5FD' : '#5A4688' }}
                  >
                    {activeCollection === 'daily'
                      ? `Page 01 • DAILY LOG`
                      : activeCollection === 'monthly'
                      ? `Page 02 • MONTHLY LOG`
                      : activeCollection === 'future'
                      ? `Page 03 • FUTURE LOG`
                      : `COLLECTION • ${activeCollection.toUpperCase()}`}
                  </span>
                  <h2
                    className="font-display italic font-bold text-2xl tracking-tight"
                    style={{ color: paperStyles.color }}
                  >
                    {activeCollection === 'daily'
                      ? formatDatePretty(todayStr)
                      : activeCollection === 'monthly'
                      ? 'Monthly Goals & Highlights'
                      : activeCollection === 'future'
                      ? 'Future Commitments'
                      : activeCollection}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono px-2.5 py-1 rounded-lg border shadow-2xs"
                    style={{
                      backgroundColor: isDarkModePaper ? '#1E293B' : 'rgba(255,255,255,0.85)',
                      borderColor: isDarkModePaper ? '#334155' : '#D7C9B1',
                      color: isDarkModePaper ? '#E2E8F0' : '#4A3222',
                    }}
                  >
                    {displayedItems.length} {displayedItems.length === 1 ? 'entry' : 'entries'}
                  </span>
                </div>
              </div>

              {/* Rapid Logging Input Bar */}
              <form
                onSubmit={handleRapidSubmit}
                className={`backdrop-blur-sm p-2.5 sm:p-3 rounded-2xl border-2 shadow-xs mb-6 flex flex-col gap-2 transition-all ${
                  isDarkModePaper
                    ? 'bg-slate-900/90 border-slate-700 text-white'
                    : 'bg-white/95 border-[#8E7CC3]'
                }`}
              >
                <div className="flex flex-wrap items-center gap-2">
                  {/* Symbol Type Selector */}
                  <div
                    className={`flex items-center gap-1 p-1 rounded-xl shrink-0 ${
                      isDarkModePaper ? 'bg-slate-800' : 'bg-[#F2EFF9]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setRapidType('task')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1 ${
                        rapidType === 'task'
                          ? 'bg-[#8E7CC3] text-white shadow-xs'
                          : isDarkModePaper
                          ? 'text-slate-300 hover:text-white'
                          : 'text-[#4A3222] hover:bg-white/50'
                      }`}
                      title="Task item (•)"
                    >
                      <span className="text-base leading-none">•</span>
                      <span className="font-body text-[11px]">Task</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRapidType('event')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1 ${
                        rapidType === 'event'
                          ? 'bg-[#8E7CC3] text-white shadow-xs'
                          : isDarkModePaper
                          ? 'text-slate-300 hover:text-white'
                          : 'text-[#4A3222] hover:bg-white/50'
                      }`}
                      title="Event or Appointment (○)"
                    >
                      <span className="text-sm leading-none">○</span>
                      <span className="font-body text-[11px]">Event</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRapidType('note')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1 ${
                        rapidType === 'note'
                          ? 'bg-[#8E7CC3] text-white shadow-xs'
                          : isDarkModePaper
                          ? 'text-slate-300 hover:text-white'
                          : 'text-[#4A3222] hover:bg-white/50'
                      }`}
                      title="Reflection Note (—)"
                    >
                      <span className="text-sm leading-none">—</span>
                      <span className="font-body text-[11px]">Note</span>
                    </button>
                  </div>

                  {/* Signifier toggle (Star / Priority) */}
                  <button
                    type="button"
                    onClick={() => setRapidSignifier(rapidSignifier === 'priority' ? 'none' : 'priority')}
                    className={`p-2 rounded-xl transition-all border shrink-0 ${
                      rapidSignifier === 'priority'
                        ? 'bg-amber-100 border-amber-300 text-amber-800'
                        : isDarkModePaper
                        ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                        : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-stone-700'
                    }`}
                    title={rapidSignifier === 'priority' ? 'Priority active (*)' : 'Mark as Priority (*)'}
                  >
                    <Star className={`w-4 h-4 ${rapidSignifier === 'priority' ? 'fill-amber-500 text-amber-500' : ''}`} />
                  </button>

                  {/* Sticker / Photo Attachment Trigger */}
                  <button
                    type="button"
                    onClick={() => setShowRapidStickerPicker(true)}
                    className={`p-2 rounded-xl transition-all border shrink-0 flex items-center gap-1 text-xs font-bold font-body ${
                      rapidImageUrl
                        ? 'bg-pink-100 border-pink-300 text-[#FF8E7E]'
                        : isDarkModePaper
                        ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-[#8E7CC3]'
                    }`}
                    title="Attach sticker, polaroid or washi tape to this entry"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#FF8E7E]" />
                    <span className="hidden sm:inline">
                      {rapidImageUrl ? 'Sticker Attached' : '+ Sticker'}
                    </span>
                  </button>

                  {/* Rapid Text Input */}
                  <div className="flex-1 min-w-[180px] relative">
                    <input
                      type="text"
                      value={rapidText}
                      onChange={(e) => setRapidText(e.target.value)}
                      placeholder={
                        rapidType === 'task'
                          ? 'Write a rapid task (press Enter)...'
                          : rapidType === 'event'
                          ? 'Meeting or scheduled event...'
                          : 'Reflection, idea, or mindful note...'
                      }
                      className={`w-full px-3 py-1.5 text-xs sm:text-sm font-body bg-transparent focus:outline-none placeholder:text-stone-400 ${
                        isDarkModePaper ? 'text-white' : 'text-stone-900'
                      }`}
                    />
                  </div>

                  {/* Time Picker if Event */}
                  {rapidType === 'event' && (
                    <input
                      type="time"
                      value={rapidTime}
                      onChange={(e) => setRapidTime(e.target.value)}
                      className={`px-2 py-1 rounded-lg border text-xs font-body ${
                        isDarkModePaper
                          ? 'bg-slate-800 border-slate-700 text-white'
                          : 'border-stone-200 bg-white'
                      }`}
                    />
                  )}

                  {/* Add Button */}
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white text-xs font-bold font-body shadow-xs flex items-center justify-center gap-1 active:scale-95 transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Log Entry</span>
                  </button>
                </div>

                {/* Rapid Logging Sticker Attachment Thumbnail Preview */}
                {rapidImageUrl && (
                  <div className="flex items-center justify-between px-2 pt-1 border-t border-dashed border-stone-200">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded overflow-hidden bg-stone-100 border border-stone-300">
                        <img src={rapidImageUrl} alt="Sticker" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[11px] font-mono text-stone-600 capitalize">
                        {rapidImageLayout} attached {rapidImageCaption ? `("${rapidImageCaption}")` : ''}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRapidImageUrl('');
                        setRapidImageCaption('');
                      }}
                      className="text-[11px] text-rose-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Rapid Logging Items List */}
              {displayedItems.length === 0 ? (
                <div className="py-16 text-center">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 font-mono text-2xl font-bold"
                    style={{
                      backgroundColor: isDarkModePaper ? 'rgba(255,255,255,0.1)' : 'rgba(142,124,195,0.15)',
                      color: isDarkModePaper ? '#93C5FD' : '#5A4688',
                    }}
                  >
                    •
                  </div>
                  <h3
                    className="font-display italic font-bold text-lg mb-1"
                    style={{ color: paperStyles.color }}
                  >
                    Blank journal page ready for your thoughts
                  </h3>
                  <p className="text-xs opacity-75 font-body max-w-sm mx-auto">
                    Use the input bar above to record tasks (•), events (○), notes (—) or customize your paper texture.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {displayedItems.map((item) => {
                    const isDone = item.bujoStatus === 'completed' || item.completed;
                    const isMigrated = item.bujoStatus === 'migrated';
                    const isCancelled = item.bujoStatus === 'cancelled';

                    return (
                      <div
                        key={item.id}
                        className={`group flex flex-col p-2.5 sm:p-3 rounded-2xl transition-all border ${
                          isDarkModePaper
                            ? isDone
                              ? 'bg-slate-900/40 border-slate-800/60 opacity-70'
                              : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 shadow-sm'
                            : isDone
                            ? 'bg-white/40 border-[#D7C9B1]/60 opacity-80'
                            : isCancelled
                            ? 'bg-stone-100/60 border-stone-200 opacity-60'
                            : isMigrated
                            ? 'bg-[#F2EFF9]/60 border-[#8E7CC3]/40'
                            : 'bg-white/90 hover:bg-white border-[#D7C9B1] shadow-2xs hover:border-[#8E7CC3]'
                        }`}
                      >
                        {/* Top Row: Bullet, Title, Time, and Actions */}
                        <div className="flex items-start justify-between gap-2">
                          {/* Left: Bullet & Title */}
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {renderBujoBullet(item)}

                            <div className="flex-1 min-w-0 pt-0.5">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span
                                  onClick={() => handleCycleBujoStatus(item)}
                                  className={`text-xs sm:text-sm font-body cursor-pointer select-none transition-colors ${
                                    isDone
                                      ? 'line-through text-stone-400 font-normal'
                                      : isCancelled
                                      ? 'line-through text-stone-400'
                                      : isDarkModePaper
                                      ? 'text-slate-100 font-medium hover:text-blue-300'
                                      : 'text-[#4A3222] font-semibold hover:text-[#5A4688]'
                                  }`}
                                >
                                  {item.title}
                                </span>

                                {item.dueTime && (
                                  <span className="inline-flex items-center gap-1 font-numeric text-[11px] font-bold text-[#5A4688] bg-[#F2EFF9] px-1.5 py-0.2 rounded border border-[#8E7CC3]/30">
                                    <Clock className="w-2.5 h-2.5" />
                                    {item.dueTime}
                                  </span>
                                )}

                                {item.bujoStatus === 'migrated' && (
                                  <span className="text-[10px] font-mono text-[#5A4688] bg-[#F2EFF9] px-1.5 py-0.2 rounded">
                                    › Migrated
                                  </span>
                                )}
                              </div>

                              {item.notes && (
                                <p
                                  className={`text-[11px] font-body mt-0.5 line-clamp-2 ${
                                    isDarkModePaper ? 'text-slate-400' : 'text-[#735A46]'
                                  }`}
                                >
                                  {item.notes}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Right Action Icons */}
                          <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                            {/* Sticker / Photo Decorate Button */}
                            <button
                              type="button"
                              onClick={() => setDecoratingTask(item)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                item.imageUrl
                                  ? 'text-[#FF8E7E] hover:bg-pink-50'
                                  : 'text-stone-400 hover:text-[#8E7CC3] hover:bg-stone-100'
                              }`}
                              title="Attach / Edit sticker or polaroid"
                            >
                              <Camera className="w-3.5 h-3.5" />
                            </button>

                            {onStartPomodoro && !isDone && item.bujoType !== 'note' && (
                              <button
                                type="button"
                                onClick={() => onStartPomodoro(item)}
                                className="p-1.5 rounded-lg text-[#8E7CC3] hover:bg-[#F2EFF9] transition-colors"
                                title="Focus with Zen Timer"
                              >
                                <Play className="w-3.5 h-3.5 fill-current" />
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => onEditTask(item)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                              title="Edit entry"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => onDeleteTask(item.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete from journal"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Decorative Image / Polaroid */}
                        {item.imageUrl && (
                          <div className="mt-2 pl-9">
                            <BujoDecorativeImage
                              imageUrl={item.imageUrl}
                              imageLayout={item.imageLayout || 'polaroid'}
                              caption={item.imageCaption}
                              imageSize={item.imageSize}
                              imageZoom={item.imageZoom}
                              imageFocusX={item.imageFocusX}
                              imageFocusY={item.imageFocusY}
                              imageFit={item.imageFit}
                              onEdit={() => setDecoratingTask(item)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Paper Customizer Modal */}
      {showPaperModal && (
        <BujoPaperCustomizerModal
          isOpen={showPaperModal}
          onClose={() => setShowPaperModal(false)}
          settings={paperSettings}
          onUpdateSettings={handleUpdatePaperSettings}
        />
      )}

      {/* Rapid Log Sticker Picker Modal */}
      {showRapidStickerPicker && (
        <BujoDecorationPickerModal
          isOpen={showRapidStickerPicker}
          onClose={() => setShowRapidStickerPicker(false)}
          currentImageUrl={rapidImageUrl}
          currentImageLayout={rapidImageLayout}
          currentCaption={rapidImageCaption}
          onSaveDecoration={(dec) => {
            setRapidImageUrl(dec.imageUrl || '');
            setRapidImageLayout(dec.imageLayout || 'polaroid');
            setRapidImageCaption(dec.imageCaption || '');
          }}
        />
      )}

      {/* Task Item Decoration Picker Modal */}
      {decoratingTask && (
        <BujoDecorationPickerModal
          isOpen={!!decoratingTask}
          onClose={() => setDecoratingTask(null)}
          currentImageUrl={decoratingTask.imageUrl}
          currentImageLayout={decoratingTask.imageLayout}
          currentCaption={decoratingTask.imageCaption}
          currentImageSize={decoratingTask.imageSize}
          currentImageZoom={decoratingTask.imageZoom}
          currentImageFocusX={decoratingTask.imageFocusX}
          currentImageFocusY={decoratingTask.imageFocusY}
          currentImageFit={decoratingTask.imageFit}
          onSaveDecoration={(dec) => {
            onUpdateTaskBujo(decoratingTask.id, {
              imageUrl: dec.imageUrl,
              imageLayout: dec.imageLayout,
              imageCaption: dec.imageCaption,
              imageSize: dec.imageSize,
              imageZoom: dec.imageZoom,
              imageFocusX: dec.imageFocusX,
              imageFocusY: dec.imageFocusY,
              imageFit: dec.imageFit,
            });
            setDecoratingTask(null);
          }}
        />
      )}

      {/* BuJo Key & Legend Reference Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-[#FAF6EE] rounded-3xl p-6 max-w-md w-full border-3 border-[#D7C9B1] shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-300">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#5A4688]" />
                <h3 className="font-display italic font-bold text-xl text-[#4A3222]">
                  Bullet Journal Official Key
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="p-1.5 rounded-xl hover:bg-stone-200 text-stone-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-body text-[#4A3222]">
              <p className="text-[11px] text-[#735A46] leading-relaxed">
                The Rapid Logging system uses minimal analog symbols to quickly classify and capture thoughts:
              </p>

              <div className="space-y-2 bg-white p-3.5 rounded-2xl border border-[#D7C9B1]">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#F2EFF9] flex items-center justify-center font-mono font-bold text-lg text-[#5A4688]">
                    •
                  </span>
                  <div>
                    <span className="font-bold text-[#4A3222] block">Dot / Task</span>
                    <span className="text-[11px] text-[#735A46]">Concrete actionable to-do</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center font-mono font-bold text-lg text-emerald-600">
                    ✕
                  </span>
                  <div>
                    <span className="font-bold text-[#4A3222] block">Cross / Completed</span>
                    <span className="text-[11px] text-[#735A46]">Successfully accomplished task</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-[#F2EFF9] flex items-center justify-center font-mono font-bold text-lg text-[#5A4688]">
                    ›
                  </span>
                  <div>
                    <span className="font-bold text-[#4A3222] block">Greater Than / Migrated</span>
                    <span className="text-[11px] text-[#735A46]">Rescheduled to a new day or cycle</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-pink-50 flex items-center justify-center font-mono font-bold text-lg text-[#FF8E7E]">
                    ‹
                  </span>
                  <div>
                    <span className="font-bold text-[#4A3222] block">Less Than / Scheduled</span>
                    <span className="text-[11px] text-[#735A46]">Scheduled in the Future Log</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center font-mono font-bold text-lg text-[#5A4688]">
                    ○
                  </span>
                  <div>
                    <span className="font-bold text-[#4A3222] block">Circle / Event</span>
                    <span className="text-[11px] text-[#735A46]">Meeting, appointment or calendar event</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-stone-100 flex items-center justify-center font-mono font-bold text-lg text-[#4A3222]">
                    —
                  </span>
                  <div>
                    <span className="font-bold text-[#4A3222] block">Dash / Note</span>
                    <span className="text-[11px] text-[#735A46]">Idea, memory or reflective remark</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center font-mono font-bold text-base text-amber-600">
                    ★
                  </span>
                  <div>
                    <span className="font-bold text-[#4A3222] block">Star / Priority (Signifier)</span>
                    <span className="text-[11px] text-[#735A46]">High importance or urgent focus</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-5 py-2 rounded-xl bg-[#8E7CC3] text-white text-xs font-bold font-body hover:bg-[#7B68B4]"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
