import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { Check, ChevronRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../utils/audio';

interface SwipeToCompleteProps {
  isCompleted: boolean;
  onComplete: () => void;
  onUncomplete?: () => void;
  color?: string; // hex
  text?: string;
  completedText?: string;
  disabled?: boolean;
}

export const SwipeToComplete: React.FC<SwipeToCompleteProps> = ({
  isCompleted,
  onComplete,
  onUncomplete,
  color = '#8E7CC3',
  text = 'Swipe to complete',
  completedText = 'Completed!',
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);

  // Trigger celebration
  const triggerCelebration = () => {
    soundEngine.playChime('success');
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#8E7CC3', '#FF8E7E', '#F4B843', '#83C5BE', '#4A3222'],
    });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (disabled || isCompleted) return;

    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const handleWidth = 44;
    const maxDrag = containerWidth - handleWidth - 8;
    const currentX = x.get();

    // If dragged at least 70% of the way
    if (currentX > maxDrag * 0.7) {
      x.set(maxDrag);
      triggerCelebration();
      onComplete();
    } else {
      // Snap back
      x.set(0);
    }
  };

  const handleUndo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUncomplete) {
      x.set(0);
      onUncomplete();
    }
  };

  // Background track fill opacity and width
  const trackBgWidth = useTransform(x, (val) => `${Math.max(0, val + 44)}px`);

  if (isCompleted) {
    return (
      <div 
        className="w-full h-11 rounded-full flex items-center justify-between px-3 text-white transition-all shadow-inner"
        style={{ backgroundColor: color }}
      >
        <div className="flex items-center space-x-2 pl-2">
          <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-white">
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </div>
          <span className="text-xs font-semibold tracking-wide font-body truncate max-w-[190px]">
            {completedText}
          </span>
        </div>
        {onUncomplete && (
          <button
            type="button"
            onClick={handleUndo}
            className="p-1.5 hover:bg-white/20 active:scale-95 rounded-full text-white/90 transition-all text-xs flex items-center gap-1 font-body"
            title="Undo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium pr-1">Undo</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-11 bg-[#FAF6EE] dark:bg-[#161825] rounded-full border-2 border-[#D7C9B1] dark:border-[#3C4263] overflow-hidden flex items-center select-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      {/* Dynamic progress track fill */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 rounded-full opacity-20"
        style={{
          width: trackBgWidth,
          backgroundColor: color,
        }}
      />

      {/* Center Instruction Label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-12">
        <span className="text-[12px] font-semibold text-[#735A46] dark:text-[#94A3B8] font-body tracking-tight flex items-center gap-1">
          {text}
        </span>
      </div>

      {/* Draggable Knob */}
      <motion.div
        drag={disabled ? false : 'x'}
        dragConstraints={containerRef}
        dragElastic={0.05}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="absolute left-1 top-1 bottom-1 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-md z-10 transition-transform active:scale-95"
        animate={{ scale: isDragging ? 1.05 : 1 }}
      >
        <div 
          className="w-full h-full rounded-full flex items-center justify-center shadow-sm"
          style={{ backgroundColor: color }}
        >
          <ChevronRight className="w-5 h-5 stroke-[2.5] text-white animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
};
