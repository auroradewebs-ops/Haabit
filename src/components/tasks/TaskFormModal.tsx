import React, { useState, useEffect } from 'react';
import { Task, CategoryType, CompletionType, BujoType, BujoSignifier, BujoStatus, BujoImageLayout } from '../../types';
import { Modal } from '../common/Modal';
import { IconAndColorCustomizer } from '../common/IconAndColorCustomizer';
import { getTodayKey } from '../../utils/date';
import {
  Calendar,
  Clock,
  Tag,
  Play,
  BookOpen,
  Star,
  Sparkles,
  Camera,
  Trash2,
} from 'lucide-react';
import { BujoDecorationPickerModal } from './BujoDecorationPickerModal';
import { BujoDecorativeImage } from './BujoDecorativeImage';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: Partial<Task>) => void;
  editingTask?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingTask,
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [category, setCategory] = useState<CategoryType>('trabajo');
  const [dueDate, setDueDate] = useState(getTodayKey());
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [color, setColor] = useState('#8E7CC3');
  const [iconName, setIconName] = useState('CheckSquare');
  const [completionType, setCompletionType] = useState<CompletionType>('swipe');
  const [estimatedPomodoros, setEstimatedPomodoros] = useState(2);
  // BuJo Fields
  const [bujoType, setBujoType] = useState<BujoType>('task');
  const [bujoSignifier, setBujoSignifier] = useState<BujoSignifier>('none');
  const [bujoStatus, setBujoStatus] = useState<BujoStatus>('todo');
  const [collection, setCollection] = useState('daily');
  // Decorative Image
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageLayout, setImageLayout] = useState<BujoImageLayout>('polaroid');
  const [imageCaption, setImageCaption] = useState<string>('');
  const [showDecorationModal, setShowDecorationModal] = useState(false);

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setNotes(editingTask.notes || '');
      setCategory(editingTask.category);
      setDueDate(editingTask.dueDate || getTodayKey());
      setDueTime(editingTask.dueTime || '');
      setPriority(editingTask.priority);
      setColor(editingTask.color || '#8E7CC3');
      setIconName(editingTask.iconName || 'CheckSquare');
      setCompletionType(editingTask.completionType);
      setEstimatedPomodoros(editingTask.estimatedPomodoros || 1);
      setBujoType(editingTask.bujoType || 'task');
      setBujoSignifier(editingTask.bujoSignifier || (editingTask.priority === 'high' ? 'priority' : 'none'));
      setBujoStatus(editingTask.bujoStatus || (editingTask.completed ? 'completed' : 'todo'));
      setCollection(editingTask.collection || 'daily');
      setImageUrl(editingTask.imageUrl || '');
      setImageLayout(editingTask.imageLayout || 'polaroid');
      setImageCaption(editingTask.imageCaption || '');
    } else {
      setTitle('');
      setNotes('');
      setCategory('trabajo');
      setDueDate(getTodayKey());
      setDueTime('');
      setPriority('medium');
      setColor('#8E7CC3');
      setIconName('CheckSquare');
      setCompletionType('swipe');
      setEstimatedPomodoros(2);
      setBujoType('task');
      setBujoSignifier('none');
      setBujoStatus('todo');
      setCollection('daily');
      setImageUrl('');
      setImageLayout('polaroid');
      setImageCaption('');
    }
  }, [editingTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      notes: notes.trim(),
      category,
      dueDate,
      dueTime: dueTime ? dueTime : undefined,
      priority: bujoSignifier === 'priority' ? 'high' : priority,
      color,
      iconName,
      completionType,
      estimatedPomodoros: Number(estimatedPomodoros) || 1,
      bujoType,
      bujoSignifier,
      bujoStatus,
      collection,
      imageUrl: imageUrl.trim() || undefined,
      imageLayout: imageUrl.trim() ? imageLayout : undefined,
      imageCaption: imageUrl.trim() ? imageCaption.trim() : undefined,
    });
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={editingTask ? 'Edit Task or Log' : 'New Task / BuJo Entry'}
        subtitle="Define tasks with pomodoro estimates, custom stamps, or bullet journal mode"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bullet Journal Mode Quick Type Selector */}
          <div className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-[#1A1C2B] border-2 border-[#D7C9B1] dark:border-[#3C4263] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5A4688] dark:text-[#E2D9FC] font-body flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> Bullet Journal Mode
              </span>
              <span className="text-[11px] text-[#735A46] dark:text-[#94A3B8] font-mono">
                Symbol: {bujoType === 'task' ? '• Task' : bujoType === 'event' ? '○ Event' : '— Note'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBujoType('task')}
                className={`p-2 rounded-xl text-center font-body text-xs font-bold transition-all border ${
                  bujoType === 'task'
                    ? 'bg-[#8E7CC3] text-white border-[#8E7CC3] shadow-xs'
                    : 'bg-white dark:bg-[#282C44] text-[#4A3222] dark:text-[#E2E8F0] border-[#D7C9B1] dark:border-[#3C4263] hover:bg-[#FAF6EE] dark:hover:bg-[#323755]'
                }`}
              >
                <span className="font-mono text-sm block">•</span>
                <span>Task</span>
              </button>

              <button
                type="button"
                onClick={() => setBujoType('event')}
                className={`p-2 rounded-xl text-center font-body text-xs font-bold transition-all border ${
                  bujoType === 'event'
                    ? 'bg-[#8E7CC3] text-white border-[#8E7CC3] shadow-xs'
                    : 'bg-white dark:bg-[#282C44] text-[#4A3222] dark:text-[#E2E8F0] border-[#D7C9B1] dark:border-[#3C4263] hover:bg-[#FAF6EE] dark:hover:bg-[#323755]'
                }`}
              >
                <span className="font-mono text-sm block">○</span>
                <span>Event</span>
              </button>

              <button
                type="button"
                onClick={() => setBujoType('note')}
                className={`p-2 rounded-xl text-center font-body text-xs font-bold transition-all border ${
                  bujoType === 'note'
                    ? 'bg-[#8E7CC3] text-white border-[#8E7CC3] shadow-xs'
                    : 'bg-white dark:bg-[#282C44] text-[#4A3222] dark:text-[#E2E8F0] border-[#D7C9B1] dark:border-[#3C4263] hover:bg-[#FAF6EE] dark:hover:bg-[#323755]'
                }`}
              >
                <span className="font-mono text-sm block">—</span>
                <span>Note</span>
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body">
              Title or Entry *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finish sprint deck, book flights, organize bookshelf..."
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] focus:outline-none font-body text-sm text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body">
              Notes or Context
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Links, subtasks or reminders..."
              className="w-full px-3.5 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] focus:outline-none font-body text-xs text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
            />
          </div>

          {/* Reusable Icon, Color & Local Image Customizer */}
          <IconAndColorCustomizer
            iconName={iconName}
            onChangeIcon={setIconName}
            color={color}
            onChangeColor={setColor}
            title="Task Stamp Icon, Color & Photo"
          />

          {/* Decorative Image & Stickers Section */}
          <div className="p-3 rounded-2xl bg-[#FFF8E7] dark:bg-[#232018] border border-[#F4B843]/40 dark:border-[#F4B843]/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#915B12] dark:text-[#F8CE72] font-body flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#FF8E7E]" /> Polaroid & Scrapbook Sticker Attachment
              </span>
              {imageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setImageUrl('');
                    setImageCaption('');
                  }}
                  className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center gap-1 font-body font-medium"
                >
                  <Trash2 className="w-3 h-3" /> Remove
                </button>
              )}
            </div>

            {imageUrl ? (
              <div className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-[#1A1C2B] border border-[#D7C9B1] dark:border-[#3C4263]">
                <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-stone-100 dark:bg-stone-900 rounded-lg overflow-hidden border">
                  <BujoDecorativeImage
                    imageUrl={imageUrl}
                    layout={imageLayout}
                    caption={imageCaption}
                    className="w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold font-body text-[#4A3222] dark:text-[#E2E8F0] capitalize">
                      Format: {imageLayout}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowDecorationModal(true)}
                      className="text-[11px] font-bold text-[#8E7CC3] hover:underline"
                    >
                      Change Style
                    </button>
                  </div>
                  {imageCaption && (
                    <p className="text-[11px] text-[#735A46] dark:text-[#94A3B8] font-body italic truncate">
                      "{imageCaption}"
                    </p>
                  )}
                  <div className="mt-1 flex gap-1">
                    {(['polaroid', 'stamp', 'washi', 'sticker', 'banner'] as BujoImageLayout[]).map((l) => (
                      <button
                        key={l}
                        type="button"
                        onClick={() => setImageLayout(l)}
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono capitalize ${
                          imageLayout === l
                            ? 'bg-[#8E7CC3] text-white font-bold'
                            : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDecorationModal(true)}
                className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-[#D7C9B1] dark:border-[#3C4263] hover:border-[#8E7CC3] bg-white dark:bg-[#1A1C2B] hover:bg-[#FAF6EE] dark:hover:bg-[#282C44] transition-colors flex items-center justify-center gap-2 text-xs font-bold font-body text-[#4A3222] dark:text-[#E2E8F0]"
              >
                <Camera className="w-4 h-4 text-[#8E7CC3]" />
                <span>Add Polaroid, Washi Tape, Scrapbook Stamp or Local Photo</span>
              </button>
            )}
          </div>

          {/* Date, Time & Signifier */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#5A4688] dark:text-[#A798DD]" /> Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#5A4688] dark:text-[#A798DD]" /> Time (Optional)
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#F4B843]" /> BuJo Signifier
              </label>
              <select
                value={bujoSignifier}
                onChange={(e) => {
                  const sig = e.target.value as BujoSignifier;
                  setBujoSignifier(sig);
                  if (sig === 'priority') setPriority('high');
                }}
                className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
              >
                <option value="none">Normal (Standard)</option>
                <option value="priority">★ Priority / Urgent</option>
                <option value="inspiration">! Inspiration / Idea</option>
                <option value="explore">? Question / Explore</option>
              </select>
            </div>
          </div>

          {/* Category & Collection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-[#5A4688] dark:text-[#A798DD]" /> Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryType)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
              >
                <option value="trabajo">Work & Productivity</option>
                <option value="estudio">Study & Learning</option>
                <option value="salud">Health & Body</option>
                <option value="creatividad">Art & Creativity</option>
                <option value="rutina">Home & Routine</option>
                <option value="mente">Personal & Wellness</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#5A4688] dark:text-[#A798DD]" /> BuJo Collection
              </label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
              >
                <option value="daily">Daily Log</option>
                <option value="monthly">Monthly Log</option>
                <option value="future">Future Log</option>
                <option value="Ideas & Projects">Ideas & Projects</option>
                <option value="Readings & Books">Readings & Books</option>
                <option value="Gratitude & Memory">Gratitude & Memory</option>
              </select>
            </div>
          </div>

          {/* Estimated Pomodoros */}
          <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#1A1C2B] border border-[#D7C9B1] dark:border-[#3C4263] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-[#8E7CC3] fill-[#8E7CC3]" />
              <div>
                <span className="text-xs font-bold text-[#4A3222] dark:text-[#E2E8F0] font-body block">
                  Estimated Pomodoro Focus Blocks
                </span>
                <span className="text-[11px] text-[#735A46] dark:text-[#94A3B8] font-body">
                  How many 25-minute focus intervals?
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setEstimatedPomodoros(num)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-bold text-xs transition-all ${
                    estimatedPomodoros === num
                      ? 'bg-[#8E7CC3] text-white shadow-xs'
                      : 'bg-white dark:bg-[#282C44] text-[#4A3222] dark:text-[#E2E8F0] border border-[#D7C9B1] dark:border-[#3C4263] hover:bg-[#FAF6EE] dark:hover:bg-[#323755]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] text-[#735A46] dark:text-[#94A3B8] font-body text-xs font-semibold hover:bg-[#FAF6EE] dark:hover:bg-[#282C44] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white font-body text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {showDecorationModal && (
        <BujoDecorationPickerModal
          isOpen={showDecorationModal}
          onClose={() => setShowDecorationModal(false)}
          currentImageUrl={imageUrl}
          currentImageLayout={imageLayout}
          currentCaption={imageCaption}
          onSaveDecoration={(dec) => {
            setImageUrl(dec.imageUrl || '');
            setImageLayout(dec.imageLayout || 'polaroid');
            setImageCaption(dec.imageCaption || '');
          }}
        />
      )}
    </>
  );
};
