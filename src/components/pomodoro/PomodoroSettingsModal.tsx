import React, { useState } from 'react';
import { PomodoroSettings } from '../../types';
import { Modal } from '../common/Modal';
import { Clock, Volume2, Sparkles, Sliders } from 'lucide-react';

interface PomodoroSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: PomodoroSettings;
  onSaveSettings: (settings: PomodoroSettings) => void;
}

export const PomodoroSettingsModal: React.FC<PomodoroSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSaveSettings,
}) => {
  const [focusDuration, setFocusDuration] = useState(settings.focusDuration);
  const [shortBreakDuration, setShortBreakDuration] = useState(settings.shortBreakDuration);
  const [longBreakDuration, setLongBreakDuration] = useState(settings.longBreakDuration);
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(settings.sessionsBeforeLongBreak);
  const [autoStartBreaks, setAutoStartBreaks] = useState(settings.autoStartBreaks);
  const [autoStartFocus, setAutoStartFocus] = useState(settings.autoStartFocus);
  const [soundEffects, setSoundEffects] = useState(settings.soundEffects);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ...settings,
      focusDuration: Number(focusDuration) || 25,
      shortBreakDuration: Number(shortBreakDuration) || 5,
      longBreakDuration: Number(longBreakDuration) || 15,
      sessionsBeforeLongBreak: Number(sessionsBeforeLongBreak) || 4,
      autoStartBreaks,
      autoStartFocus,
      soundEffects,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Timer Preferences"
      subtitle="Configure your personalized focus rhythm and rest intervals"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Durations Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#5A4688] dark:text-[#C5BAEB] mb-1 font-body">
              Focus (Min)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={focusDuration}
              onChange={(e) => setFocusDuration(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-xl border-2 border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#161825] focus:border-[#8E7CC3] text-center font-numeric font-bold text-sm text-[#4A3222] dark:text-[#E2E8F0]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#E27B9B] dark:text-[#F8B4C8] mb-1 font-body">
              Short Break
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={shortBreakDuration}
              onChange={(e) => setShortBreakDuration(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-xl border-2 border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#161825] focus:border-[#E27B9B] text-center font-numeric font-bold text-sm text-[#4A3222] dark:text-[#E2E8F0]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#FF8E7E] dark:text-[#FF8E7E] mb-1 font-body">
              Long Break
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={longBreakDuration}
              onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 rounded-xl border-2 border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#161825] focus:border-[#FF8E7E] text-center font-numeric font-bold text-sm text-[#4A3222] dark:text-[#E2E8F0]"
            />
          </div>
        </div>

        {/* Sessions before long break */}
        <div className="p-3 rounded-2xl bg-[#FAF6EE] dark:bg-[#161825] border border-[#D7C9B1] dark:border-[#3C4263] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#4A3222] dark:text-[#E2E8F0] font-body block">
              Intervals Before Long Break
            </span>
            <span className="text-[11px] text-[#735A46] dark:text-[#94A3B8] font-body">
              Consecutive focus sessions count
            </span>
          </div>
          <div className="flex gap-1.5">
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setSessionsBeforeLongBreak(num)}
                className={`w-8 h-8 rounded-lg font-bold text-xs transition-all ${
                  sessionsBeforeLongBreak === num
                    ? 'bg-[#8E7CC3] text-white shadow-xs'
                    : 'bg-white dark:bg-[#23273C] text-[#4A3222] dark:text-[#E2E8F0] border border-[#D7C9B1] dark:border-[#3C4263] hover:bg-[#FAF6EE] dark:hover:bg-[#282C44]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Automated switches */}
        <div className="space-y-2 pt-1">
          <label className="p-3 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#161825] flex items-center justify-between cursor-pointer hover:bg-[#FAF6EE] dark:hover:bg-[#23273C] transition-colors">
            <div className="text-xs font-body">
              <span className="font-bold text-[#4A3222] dark:text-[#E2E8F0] block">Auto-start Breaks</span>
              <span className="text-[11px] text-[#735A46] dark:text-[#94A3B8]">Immediately begin rest countdown when focus session ends</span>
            </div>
            <input
              type="checkbox"
              checked={autoStartBreaks}
              onChange={(e) => setAutoStartBreaks(e.target.checked)}
              className="w-5 h-5 accent-[#8E7CC3] cursor-pointer"
            />
          </label>

          <label className="p-3 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#161825] flex items-center justify-between cursor-pointer hover:bg-[#FAF6EE] dark:hover:bg-[#23273C] transition-colors">
            <div className="text-xs font-body">
              <span className="font-bold text-[#4A3222] dark:text-[#E2E8F0] block">Auto-start Focus</span>
              <span className="text-[11px] text-[#735A46] dark:text-[#94A3B8]">Start focus countdown when break concludes</span>
            </div>
            <input
              type="checkbox"
              checked={autoStartFocus}
              onChange={(e) => setAutoStartFocus(e.target.checked)}
              className="w-5 h-5 accent-[#8E7CC3] cursor-pointer"
            />
          </label>

          <label className="p-3 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#161825] flex items-center justify-between cursor-pointer hover:bg-[#FAF6EE] dark:hover:bg-[#23273C] transition-colors">
            <div className="text-xs font-body">
              <span className="font-bold text-[#4A3222] dark:text-[#E2E8F0] block">Chime Alert on Session End</span>
              <span className="text-[11px] text-[#735A46] dark:text-[#94A3B8]">Harmonic Tibetan singing bowl chime</span>
            </div>
            <input
              type="checkbox"
              checked={soundEffects}
              onChange={(e) => setSoundEffects(e.target.checked)}
              className="w-5 h-5 accent-[#8E7CC3] cursor-pointer"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] text-[#735A46] dark:text-[#94A3B8] font-body text-xs font-semibold hover:bg-[#FAF6EE] dark:hover:bg-[#23273C]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white font-body text-xs font-bold transition-all shadow-md active:scale-95"
          >
            Save Settings
          </button>
        </div>
      </form>
    </Modal>
  );
};
