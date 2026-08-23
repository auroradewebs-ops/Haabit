import React, { useState, useEffect } from 'react';
import { Habit, CategoryType, CompletionType } from '../../types';
import { Modal } from '../common/Modal';
import { IconAndColorCustomizer } from '../common/IconAndColorCustomizer';
import { Bell, CheckSquare, Sliders, Clock, Tag } from 'lucide-react';

interface HabitFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Partial<Habit>) => void;
  editingHabit?: Habit | null;
}

const CATEGORIES: { value: CategoryType; label: string }[] = [
  { value: 'salud', label: 'Health & Body' },
  { value: 'mente', label: 'Mind & Mindfulness' },
  { value: 'trabajo', label: 'Work & Productivity' },
  { value: 'creatividad', label: 'Art & Creativity' },
  { value: 'estudio', label: 'Study & Learning' },
  { value: 'rutina', label: 'Daily Routine' },
  { value: 'bienestar', label: 'General Well-being' },
];

export const HabitFormModal: React.FC<HabitFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingHabit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryType>('mente');
  const [color, setColor] = useState('#8E7CC3');
  const [iconName, setIconName] = useState('Sparkles');
  const [frequency, setFrequency] = useState<Habit['frequency']>('daily');
  const [targetTimeOfDay, setTargetTimeOfDay] = useState<Habit['targetTimeOfDay']>('morning');
  const [scheduledTime, setScheduledTime] = useState('');
  const [completionType, setCompletionType] = useState<CompletionType>('swipe');
  const [targetCount, setTargetCount] = useState(1);
  const [targetUnit, setTargetUnit] = useState('times');
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState('08:00');

  useEffect(() => {
    if (editingHabit) {
      setTitle(editingHabit.title);
      setDescription(editingHabit.description || '');
      setCategory(editingHabit.category);
      setColor(editingHabit.color || '#8E7CC3');
      setIconName(editingHabit.iconName || 'Sparkles');
      setFrequency(editingHabit.frequency);
      setTargetTimeOfDay(editingHabit.targetTimeOfDay);
      setScheduledTime(editingHabit.scheduledTime || '');
      setCompletionType(editingHabit.completionType);
      setTargetCount(editingHabit.targetCount || 1);
      setTargetUnit(editingHabit.targetUnit || 'times');
      setReminderEnabled(editingHabit.reminderEnabled);
      setReminderTime(editingHabit.reminderTime || '08:00');
    } else {
      setTitle('');
      setDescription('');
      setCategory('mente');
      setColor('#8E7CC3');
      setIconName('Sparkles');
      setFrequency('daily');
      setTargetTimeOfDay('morning');
      setScheduledTime('');
      setCompletionType('swipe');
      setTargetCount(1);
      setTargetUnit('times');
      setReminderEnabled(false);
      setReminderTime('08:00');
    }
  }, [editingHabit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      color,
      iconName,
      frequency,
      targetTimeOfDay,
      scheduledTime: scheduledTime ? scheduledTime : undefined,
      completionType,
      targetCount: Number(targetCount) || 1,
      targetUnit: targetUnit.trim() || 'times',
      reminderEnabled,
      reminderTime: reminderEnabled ? reminderTime : undefined,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingHabit ? 'Edit Habit' : 'Cultivate New Habit'}
      subtitle="Design your daily rituals with clear targets, custom icons, and colors"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body">
            Habit Name *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Morning meditation, 2L water, Read 20 pages..."
            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] focus:outline-none font-body text-sm text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825] transition-colors"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body">
            Description or Intention (Optional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Why is this habit meaningful to you?"
            className="w-full px-3.5 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] focus:outline-none font-body text-xs text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#5A4688] dark:text-[#A798DD]" /> Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategoryType)}
            className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] focus:outline-none font-body text-xs text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Reusable Icon, Color & Local Image Customizer */}
        <IconAndColorCustomizer
          iconName={iconName}
          onChangeIcon={setIconName}
          color={color}
          onChangeColor={setColor}
          title="Habit Stamp, Color & Local Photo"
        />

        {/* Completion Confirmation Method: Checkbox VS Swipe */}
        <div className="p-3 rounded-2xl bg-[#FFF8E7] dark:bg-[#232018] border border-[#F4B843]/40 dark:border-[#F4B843]/20">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#915B12] dark:text-[#F8CE72] mb-2 font-body flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-[#F4B843]" /> Completion Gesture
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCompletionType('swipe')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                completionType === 'swipe'
                  ? 'border-[#8E7CC3] bg-white dark:bg-[#282C44] text-[#5A4688] dark:text-[#E2D9FC] shadow-xs ring-1 ring-[#8E7CC3]'
                  : 'border-[#D7C9B1] dark:border-[#3C4263] bg-white/70 dark:bg-[#1A1C2B] text-[#735A46] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#282C44]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Sliders className="w-4 h-4 text-[#8E7CC3] dark:text-[#A798DD]" />
                <span className="text-xs font-bold font-body">Swipe</span>
              </div>
              <p className="text-[11px] text-[#8C7662] dark:text-[#94A3B8] font-body">
                Smooth gesture slide to complete
              </p>
            </button>

            <button
              type="button"
              onClick={() => setCompletionType('checkbox')}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                completionType === 'checkbox'
                  ? 'border-[#8E7CC3] bg-white dark:bg-[#282C44] text-[#5A4688] dark:text-[#E2D9FC] shadow-xs ring-1 ring-[#8E7CC3]'
                  : 'border-[#D7C9B1] dark:border-[#3C4263] bg-white/70 dark:bg-[#1A1C2B] text-[#735A46] dark:text-[#94A3B8] hover:bg-white dark:hover:bg-[#282C44]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <CheckSquare className="w-4 h-4 text-[#E27B9B] dark:text-[#F8B4C8]" />
                <span className="text-xs font-bold font-body">Checkbox</span>
              </div>
              <p className="text-[11px] text-[#8C7662] dark:text-[#94A3B8] font-body">
                Single tap checkmark toggle
              </p>
            </button>
          </div>
        </div>

        {/* Schedule & Time of Day */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#5A4688] dark:text-[#A798DD]" /> Time of Day
            </label>
            <select
              value={targetTimeOfDay}
              onChange={(e) => setTargetTimeOfDay(e.target.value as Habit['targetTimeOfDay'])}
              className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] focus:outline-none font-body text-xs text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
            >
              <option value="morning">Morning (06:00 - 12:00)</option>
              <option value="afternoon">Afternoon (12:00 - 18:00)</option>
              <option value="evening">Evening (18:00 - 23:59)</option>
              <option value="anytime">Anytime</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body">
              Scheduled Time (Optional)
            </label>
            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] focus:outline-none font-body text-xs text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
            />
          </div>
        </div>

        {/* Target Goal */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body">
              Daily Target
            </label>
            <input
              type="number"
              min="1"
              max="999"
              value={targetCount}
              onChange={(e) => setTargetCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] focus:outline-none font-body text-xs text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body">
              Unit
            </label>
            <input
              type="text"
              value={targetUnit}
              onChange={(e) => setTargetUnit(e.target.value)}
              placeholder="pages, glasses, min, etc."
              className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] focus:outline-none font-body text-xs text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
            />
          </div>
        </div>

        {/* Reminder Toggle */}
        <div className="p-3 rounded-xl bg-[#FAF6EE] dark:bg-[#1A1C2B] border border-[#D7C9B1] dark:border-[#3C4263] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className={`w-4 h-4 ${reminderEnabled ? 'text-[#FF8E7E]' : 'text-[#8C7662] dark:text-[#94A3B8]'}`} />
            <div>
              <span className="text-xs font-bold text-[#4A3222] dark:text-[#E2E8F0] font-body block">
                Custom Reminder
              </span>
              <span className="text-[11px] text-[#735A46] dark:text-[#94A3B8] font-body">
                Receive a gentle notification at scheduled hour
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {reminderEnabled && (
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="px-2 py-1 rounded-lg border border-[#D7C9B1] dark:border-[#3C4263] text-xs font-body bg-white dark:bg-[#161825] text-[#4A3222] dark:text-[#E2E8F0]"
              />
            )}
            <input
              type="checkbox"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              className="w-5 h-5 accent-[#8E7CC3] cursor-pointer"
            />
          </div>
        </div>

        {/* Submit & Cancel Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] text-[#735A46] dark:text-[#94A3B8] font-body text-xs font-bold hover:bg-[#FAF6EE] dark:hover:bg-[#282C44] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white font-body text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            {editingHabit ? 'Save Changes' : 'Create Habit'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
