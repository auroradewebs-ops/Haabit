import React, { useState, useEffect, useRef } from 'react';
import { PomodoroMode, PomodoroSettings, PomodoroSessionRecord, Habit, Task } from '../../types';
import { PhotoSelectorModal } from './PhotoSelectorModal';
import { PomodoroSettingsModal } from './PomodoroSettingsModal';
import { soundEngine } from '../../utils/audio';
import { sendLocalNotification } from '../../utils/notifications';
import { getTodayKey } from '../../utils/date';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Image as ImageIcon,
  Settings,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sparkles,
  CloudRain,
  Waves,
  Trees,
  Coffee,
  Radio,
  Tag,
  CheckCircle2,
  Flame,
  Link as LinkIcon
} from 'lucide-react';

interface PomodoroTimerProps {
  settings: PomodoroSettings;
  onUpdateSettings: (settings: PomodoroSettings) => void;
  onSessionComplete: (record: PomodoroSessionRecord) => void;
  habits: Habit[];
  tasks: Task[];
  onIncrementTaskPomodoro?: (taskId: string) => void;
}

const DEFAULT_TAGS = ['Deep Work', 'Design & Art', 'Study & Research', 'Reading', 'Writing', 'Planning & Review'];

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  settings,
  onUpdateSettings,
  onSessionComplete,
  habits,
  tasks,
  onIncrementTaskPomodoro,
}) => {
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [timeLeft, setTimeLeft] = useState(settings.focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessionsCount, setCompletedSessionsCount] = useState(0);
  const [currentTag, setCurrentTag] = useState(DEFAULT_TAGS[0]);
  const [linkedTaskId, setLinkedTaskId] = useState<string>('');
  const [linkedHabitId, setLinkedHabitId] = useState<string>('');

  // Modals & Zen mode
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync time left when mode changes or settings change while stopped
  useEffect(() => {
    if (!isRunning) {
      if (mode === 'focus') setTimeLeft(settings.focusDuration * 60);
      else if (mode === 'shortBreak') setTimeLeft(settings.shortBreakDuration * 60);
      else if (mode === 'longBreak') setTimeLeft(settings.longBreakDuration * 60);
    }
  }, [mode, settings.focusDuration, settings.shortBreakDuration, settings.longBreakDuration, isRunning]);

  // Ambient sound sync with isRunning & settings
  useEffect(() => {
    if (isRunning && !isMuted && settings.ambientSound !== 'none') {
      soundEngine.playAmbient(settings.ambientSound, settings.ambientVolume);
    } else {
      soundEngine.stopAmbient();
    }
    return () => {
      soundEngine.stopAmbient();
    };
  }, [isRunning, isMuted, settings.ambientSound, settings.ambientVolume]);

  // Main countdown timer interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerFinish();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  // Handle timer finish
  const handleTimerFinish = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);

    if (mode === 'focus') {
      soundEngine.playChime('complete');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8E7CC3', '#FF8E7E', '#F4B843'],
      });

      const newCount = completedSessionsCount + 1;
      setCompletedSessionsCount(newCount);

      // Record session
      onSessionComplete({
        id: `pomo-${Date.now()}`,
        date: getTodayKey(),
        timestamp: new Date().toISOString(),
        durationMinutes: settings.focusDuration,
        tag: currentTag,
        linkedTaskId: linkedTaskId || undefined,
        linkedHabitId: linkedHabitId || undefined,
      });

      // Increment task pomodoro count if linked
      if (linkedTaskId && onIncrementTaskPomodoro) {
        onIncrementTaskPomodoro(linkedTaskId);
      }

      sendLocalNotification(
        'Focus Session Completed! 🌿',
        `Great job! Take a restful ${settings.shortBreakDuration} min break.`
      );

      // Switch to break
      if (newCount % settings.longBreakInterval === 0) {
        setMode('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setMode('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
      }

      if (settings.autoStartBreaks) {
        setIsRunning(true);
      }
    } else {
      soundEngine.playChime('break');
      sendLocalNotification(
        'Break finished ☀️',
        'Ready for your next focused session?'
      );
      setMode('focus');
      setTimeLeft(settings.focusDuration * 60);

      if (settings.autoStartPomodoros) {
        setIsRunning(true);
      }
    }
  };

  const toggleTimer = () => {
    soundEngine.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    soundEngine.playClick();
    setIsRunning(false);
    if (mode === 'focus') setTimeLeft(settings.focusDuration * 60);
    else if (mode === 'shortBreak') setTimeLeft(settings.shortBreakDuration * 60);
    else if (mode === 'longBreak') setTimeLeft(settings.longBreakDuration * 60);
  };

  const handleSkip = () => {
    soundEngine.playClick();
    setIsRunning(false);
    if (mode === 'focus') {
      setMode('shortBreak');
      setTimeLeft(settings.shortBreakDuration * 60);
    } else {
      setMode('focus');
      setTimeLeft(settings.focusDuration * 60);
    }
  };

  const handleModeSelect = (newMode: PomodoroMode) => {
    if (mode === newMode) return;
    soundEngine.playClick();
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'focus') setTimeLeft(settings.focusDuration * 60);
    else if (newMode === 'shortBreak') setTimeLeft(settings.shortBreakDuration * 60);
    else if (newMode === 'longBreak') setTimeLeft(settings.longBreakDuration * 60);
  };

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate percentage
  const totalSeconds =
    mode === 'focus'
      ? settings.focusDuration * 60
      : mode === 'shortBreak'
      ? settings.shortBreakDuration * 60
      : settings.longBreakDuration * 60;
  const progressPercent = Math.min(100, Math.max(0, ((totalSeconds - timeLeft) / totalSeconds) * 100));

  const getModeColor = () => {
    if (mode === 'focus') return '#8E7CC3';
    if (mode === 'shortBreak') return '#FF8E7E';
    return '#F4B843';
  };

  return (
    <div className={`space-y-6 ${isZenMode ? 'fixed inset-0 z-50 bg-[#1E172E] p-4 sm:p-8 flex flex-col justify-between overflow-y-auto' : ''}`}>
      
      {/* Main Timer Display Container with Background Photo */}
      <div
        className={`relative overflow-hidden rounded-3xl border-3 border-[#8E7CC3]/40 shadow-xl transition-all ${
          isZenMode ? 'flex-1 flex flex-col justify-center my-auto min-h-[500px]' : 'min-h-[520px]'
        }`}
        style={{
          backgroundImage: `url(${settings.backgroundImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dynamic Dark Overlay for legibility */}
        <div
          className="absolute inset-0 transition-opacity duration-300 pointer-events-none"
          style={{
            backgroundColor: '#000000',
            opacity: settings.backgroundOverlayOpacity,
          }}
        />

        {/* Top Floating Controls inside container */}
        <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between text-white flex-wrap gap-2">
          {/* Mode Switcher Pills */}
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/20">
            <button
              type="button"
              onClick={() => handleModeSelect('focus')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 ${
                mode === 'focus'
                  ? 'bg-[#8E7CC3] text-white shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Focus</span>
              <span className="text-[10px] opacity-75 font-mono">({settings.focusDuration}m)</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeSelect('shortBreak')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 ${
                mode === 'shortBreak'
                  ? 'bg-[#FF8E7E] text-white shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Short Break</span>
              <span className="text-[10px] opacity-75 font-mono">({settings.shortBreakDuration}m)</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeSelect('longBreak')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 ${
                mode === 'longBreak'
                  ? 'bg-[#F4B843] text-[#3B2A1E] font-extrabold shadow-xs'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>Long Break</span>
              <span className="text-[10px] opacity-75 font-mono">({settings.longBreakDuration}m)</span>
            </button>
          </div>

          {/* Action buttons on top right */}
          <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/20">
            {/* Ambient Sound Toggle */}
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-xl text-xs transition-all ${
                isMuted ? 'text-rose-400 bg-rose-950/40' : 'text-white hover:bg-white/15'
              }`}
              title={isMuted ? 'Unmute ambient sound' : 'Mute ambient sound'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Change Background Photo */}
            <button
              type="button"
              onClick={() => setIsPhotoModalOpen(true)}
              className="p-2 rounded-xl text-xs text-white hover:bg-white/15 transition-all"
              title="Change background photo"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Zen Fullscreen Mode */}
            <button
              type="button"
              onClick={() => setIsZenMode(!isZenMode)}
              className={`p-2 rounded-xl text-xs transition-all ${
                isZenMode ? 'bg-[#8E7CC3] text-white' : 'text-white hover:bg-white/15'
              }`}
              title={isZenMode ? 'Exit Zen Mode' : 'Enter Zen Fullscreen'}
            >
              {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => setIsSettingsModalOpen(true)}
              className="p-2 rounded-xl text-xs text-white hover:bg-white/15 transition-all"
              title="Pomodoro Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Central Display: Circular Progress & Large Numeric Countdown */}
        <div className="relative z-10 flex flex-col items-center justify-center my-6 sm:my-10 px-4">
          {/* Active Tag Pill */}
          <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-sm">
            <Tag className="w-3.5 h-3.5 text-[#F4B843]" />
            <span className="text-xs font-bold font-body">{currentTag}</span>
            {linkedTaskId && (
              <span className="text-[10px] bg-black/40 px-2 py-0.5 rounded-full font-mono font-medium">
                Linked to Task
              </span>
            )}
          </div>

          {/* Glowing Timer Circle */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
            {/* SVG Circular Progress */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-white/15 fill-transparent"
                strokeWidth="4"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="fill-transparent transition-all duration-500"
                stroke={getModeColor()}
                strokeWidth="5"
                strokeDasharray={276.46}
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>

            {/* Center Time & Status */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
              <span className="font-numeric font-extrabold text-5xl sm:text-6xl tracking-tight drop-shadow-md">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-white/85 mt-2 font-body drop-shadow-xs">
                {mode === 'focus' ? 'Deep Focus' : mode === 'shortBreak' ? 'Short Rest' : 'Long Rest'}
              </span>
              <div className="flex items-center gap-1 mt-3">
                {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i < completedSessionsCount % settings.longBreakInterval
                        ? 'bg-[#8E7CC3] shadow-[0_0_8px_#8E7CC3]'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Primary Controls: Play/Pause, Reset, Skip */}
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="p-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 active:scale-95 transition-all shadow-sm"
              title="Reset timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={toggleTimer}
              className="px-8 py-4 rounded-3xl font-display italic font-bold text-lg text-white shadow-xl flex items-center gap-3 active:scale-95 transition-all border-2 border-white/40"
              style={{ backgroundColor: getModeColor() }}
            >
              {isRunning ? (
                <>
                  <Pause className="w-6 h-6 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 fill-white" />
                  <span>Start Flow</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleSkip}
              className="p-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 active:scale-95 transition-all shadow-sm"
              title="Skip stage"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bottom Ambient Ticker Bar */}
        <div className="relative z-10 p-3 bg-black/40 backdrop-blur-md border-t border-white/15 flex items-center justify-between text-xs text-white/80 px-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F4B843]" />
            <span className="font-body">
              Soundscape:{' '}
              <strong className="text-white capitalize font-medium">
                {settings.ambientSound === 'none' ? 'Silence' : settings.ambientSound}
              </strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Flame className="w-3.5 h-3.5 text-[#FF8E7E]" />
            <span className="font-mono font-bold text-white">
              {completedSessionsCount} sessions completed today
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Panel: Tags & Task Linking */}
      {!isZenMode && (
        <div className="bg-[#FFFDF8] rounded-3xl border-2 border-[#8E7CC3]/30 p-5 sm:p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] mb-2 font-body flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#8E7CC3]" /> Focus Categories
            </label>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setCurrentTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-body transition-all ${
                    currentTag === tag
                      ? 'bg-[#8E7CC3] text-white font-bold shadow-xs'
                      : 'bg-[#F2EDF9] text-[#4A3222] hover:bg-[#E4DAF3] font-medium'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Link to Task or Habit */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#4A3222] mb-2 font-body flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-[#FF8E7E]" /> Link with Task or Habit
            </label>
            <select
              value={linkedTaskId}
              onChange={(e) => setLinkedTaskId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#D7C9B1] bg-[#FAF6EE] text-xs font-body text-[#4A3222] focus:border-[#8E7CC3] focus:outline-none"
            >
              <option value="">No task linked (Standalone timer)</option>
              {tasks.map((t) => (
                <option key={t.id} value={t.id}>
                  Task: {t.title} ({t.completedPomodoros}/{t.estimatedPomodoros} pomodoros)
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Modals */}
      <PhotoSelectorModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={settings.backgroundImageUrl}
        onSelectPhoto={(url) => onUpdateSettings({ ...settings, backgroundImageUrl: url })}
        overlayOpacity={settings.backgroundOverlayOpacity}
        onOverlayOpacityChange={(op) => onUpdateSettings({ ...settings, backgroundOverlayOpacity: op })}
      />

      <PomodoroSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={onUpdateSettings}
      />
    </div>
  );
};
