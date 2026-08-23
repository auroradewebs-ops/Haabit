import React, { useState } from 'react';
import { TimeBlock } from '../../types';
import { Modal } from '../common/Modal';
import { IconAndColorCustomizer } from '../common/IconAndColorCustomizer';

interface TimeBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (block: Partial<TimeBlock>) => void;
}

export const TimeBlockModal: React.FC<TimeBlockModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState('#8E7CC3');
  const [iconName, setIconName] = useState('Clock');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      startTime,
      endTime,
      color,
      iconName,
      type: 'custom',
      isDone: false,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Schedule Time Block"
      subtitle="Organize your day with dedicated focus and routine blocks"
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1.5 font-body">
            Block Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Deep Work, Team Sync, Gym & Stretch, Evening Walk..."
            className="w-full px-3.5 py-2.5 rounded-xl border-2 border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825] focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1 font-body">
              Start Time
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] dark:text-[#CBD5E1] mb-1 font-body">
              End Time
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] focus:border-[#8E7CC3] text-xs font-body text-[#4A3222] dark:text-[#E2E8F0] bg-white dark:bg-[#161825]"
            />
          </div>
        </div>

        {/* Reusable Icon, Color & Local Image Customizer */}
        <IconAndColorCustomizer
          iconName={iconName}
          onChangeIcon={setIconName}
          color={color}
          onChangeColor={setColor}
          title="Time Block Icon, Color & Photo"
        />

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263] text-[#735A46] dark:text-[#94A3B8] text-xs font-bold font-body hover:bg-[#FAF6EE] dark:hover:bg-[#282C44]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#8E7CC3] text-white text-xs font-bold font-body shadow-xs hover:bg-[#7B68B4] active:scale-95 transition-all"
          >
            Save Time Block
          </button>
        </div>
      </form>
    </Modal>
  );
};
