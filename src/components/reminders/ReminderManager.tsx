import React, { useState } from 'react';
import { AppReminder } from '../../types';
import { Modal } from '../common/Modal';
import { requestNotificationPermission, sendLocalNotification } from '../../utils/notifications';
import { Bell, Plus, Clock, Sparkles, Check, Trash2, Volume2 } from 'lucide-react';

interface ReminderManagerProps {
  reminders: AppReminder[];
  onAddReminder: (reminder: Partial<AppReminder>) => void;
  onToggleReminder: (id: string) => void;
  onDeleteReminder: (id: string) => void;
}

export const ReminderManager: React.FC<ReminderManagerProps> = ({
  reminders,
  onAddReminder,
  onToggleReminder,
  onDeleteReminder,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [time, setTime] = useState('09:00');
  const [type, setType] = useState<AppReminder['type']>('habit');
  const [hasPermission, setHasPermission] = useState(
    'Notification' in window && Notification.permission === 'granted'
  );

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setHasPermission(granted);
    if (granted) {
      sendLocalNotification(
        'Notifications Enabled! 🌿',
        'Aurora will gently notify you of your habits and focus sessions.'
      );
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddReminder({
      title: title.trim(),
      message: message.trim() || 'Time to tend to your daily rituals.',
      time,
      type,
      enabled: true,
      repeatDaily: true,
    });

    setIsModalOpen(false);
    setTitle('');
    setMessage('');
    setTime('09:00');
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="relative overflow-hidden bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 text-[#4A3222] dark:text-[#E2E8F0] shadow-sm border-2 sm:border-3 border-[#D7C9B1] dark:border-[#383D59] transition-colors">
        <div className="absolute -top-3 left-10 w-24 h-5 bg-[#FF8E7E]/30 rounded-sm transform -rotate-2 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="min-w-0 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF8E7E]/15 dark:bg-[#FF8E7E]/25 border border-[#FF8E7E]/30 text-xs font-bold text-[#D94F88] dark:text-[#FF8E7E] mb-2.5">
              <Bell className="w-3.5 h-3.5" />
              <span>Gentle Chimes & Notifications</span>
            </div>
            <h1 className="font-display italic font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#4A3222] dark:text-[#F1F5F9] tracking-tight leading-tight">
              Custom Reminders
            </h1>
            <p className="text-[#735A46] dark:text-[#94A3B8] text-xs sm:text-sm font-body mt-1 leading-relaxed">
              Set mindful sound and banner alerts for your hydration, focus blocks, and daily rituals.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white font-bold text-xs font-body shadow-xs inline-flex items-center gap-1.5 transition-all active:scale-95 shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Reminder</span>
          </button>
        </div>
      </div>

      {/* Permission request alert card if not granted */}
      {!hasPermission && (
        <div className="bg-[#FFF8E7] dark:bg-[#2A261E] rounded-2xl p-4 sm:p-5 border-2 border-[#F4B843]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4B843]/20 text-[#915B12] dark:text-[#F4B843] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#4A3222] dark:text-[#F1F5F9] font-body">
                Enable device notifications
              </h4>
              <p className="text-[11px] text-[#735A46] dark:text-[#94A3B8] font-body">
                Allow Aurora to send you gentle background reminder alerts when it's time for your habits.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRequestPermission}
            className="px-4 py-2 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white font-bold text-xs font-body shadow-xs whitespace-nowrap active:scale-95 transition-all"
          >
            Enable Alerts
          </button>
        </div>
      )}

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.map((r) => (
          <div
            key={r.id}
            className={`bg-[#FAF6EE] dark:bg-[#1C1E2E] rounded-2xl p-4 sm:p-5 border-2 transition-all flex items-start justify-between gap-3 shadow-xs ${
              r.enabled
                ? 'border-[#D7C9B1] dark:border-[#383D59] hover:border-[#8E7CC3] dark:hover:border-[#A798DD]'
                : 'border-[#EFE7D8] dark:border-[#2D334C] bg-[#F4EFE6]/70 dark:bg-[#161825]/70 opacity-70'
            }`}
          >
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs ${
                  r.enabled ? 'bg-[#FF8E7E]' : 'bg-[#D7C9B1] dark:bg-[#3C4263]'
                }`}
              >
                <Bell className="w-5 h-5" />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-numeric text-xs font-bold text-[#645098] dark:text-[#C5BAEB] bg-[#F2EDF9] dark:bg-[#252136] px-2 py-0.5 rounded-lg border border-[#8E7CC3]/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {r.time}
                  </span>
                  <span className="text-[10px] font-bold text-[#8C7662] dark:text-[#94A3B8] font-body uppercase bg-white/70 dark:bg-[#282C44] px-2 py-0.5 rounded-md border border-[#D7C9B1] dark:border-[#3C4263]">
                    {r.type === 'habit' ? 'Habit' : r.type === 'pomodoro' ? 'Focus' : 'General'}
                  </span>
                </div>

                <h4 className="font-display italic font-bold text-base text-[#4A3222] dark:text-[#F1F5F9] mt-1 truncate">
                  {r.title}
                </h4>
                <p className="text-xs text-[#735A46] dark:text-[#94A3B8] font-body mt-0.5 line-clamp-1">
                  {r.message}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <input
                type="checkbox"
                checked={r.enabled}
                onChange={() => onToggleReminder(r.id)}
                className="w-5 h-5 accent-[#8E7CC3] cursor-pointer"
                title={r.enabled ? 'Disable reminder' : 'Enable reminder'}
              />
              <button
                type="button"
                onClick={() => onDeleteReminder(r.id)}
                className="p-1.5 rounded-lg text-[#8C7662] dark:text-[#94A3B8] hover:text-[#E6503A] dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Delete reminder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Reminder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add Gentle Reminder"
        subtitle="Schedule a soft alert for your habits or daily focus"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body">
              Reminder Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Drink glass of water, Afternoon focus stretch..."
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body">
              Message or Note
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="e.g. Take a deep breath and drink some water 🌿"
              className="w-full px-3.5 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1 font-body">
                Alert Time
              </label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1 font-body">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as AppReminder['type'])}
                className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
              >
                <option value="habit">Habit Reminder</option>
                <option value="pomodoro">Focus Session</option>
                <option value="general">General Note</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] text-[#735A46] dark:text-[#94A3B8] text-xs font-bold font-body hover:bg-[#FAF6EE] dark:hover:bg-[#25283D]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#8E7CC3] text-white text-xs font-bold font-body shadow-xs hover:bg-[#7B68B4] active:scale-95 transition-all"
            >
              Save Reminder
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
