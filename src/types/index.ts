export type CategoryType = 
  | 'salud' 
  | 'mente' 
  | 'trabajo' 
  | 'creatividad' 
  | 'estudio' 
  | 'rutina' 
  | 'bienestar';

export type CompletionType = 'checkbox' | 'swipe';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: CategoryType;
  color: string; // Hex code
  iconName: string; // Lucide icon identifier
  frequency: 'daily' | 'weekdays' | 'weekends' | 'custom';
  customDays?: number[]; // 0 = Sunday, 1 = Monday, etc.
  targetTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'anytime';
  scheduledTime?: string; // e.g. "08:30"
  completionType: CompletionType;
  completedDates: string[]; // ['2026-08-21', ...]
  streakCurrent: number;
  streakBest: number;
  createdAt: string;
  reminderEnabled: boolean;
  reminderTime?: string;
  targetUnit?: string; // e.g. "veces", "páginas", "vasos", "min"
  targetCount: number; // e.g. 1, 8, 20
}

export type BujoType = 'task' | 'event' | 'note';
export type BujoStatus = 'todo' | 'completed' | 'migrated' | 'scheduled' | 'cancelled';
export type BujoSignifier = 'none' | 'priority' | 'inspiration' | 'explore';
export type BujoImageLayout = 'polaroid' | 'stamp' | 'sticker' | 'banner' | 'washi';

export interface BujoPaperSettings {
  paperTone: 'cream' | 'parchment' | 'kraft' | 'sage' | 'blush' | 'lavender' | 'slate' | 'midnight';
  paperPattern: 'dot-grid' | 'ruled' | 'graph' | 'isometric' | 'vintage-ledger' | 'blank';
  gridDensity: 'compact' | 'normal' | 'spacious';
  gridColor: 'navy' | 'sepia' | 'charcoal' | 'emerald' | 'gold' | 'rose';
  bindingStyle: 'spiral' | 'stitched' | 'leather-folio' | 'clean-pad';
  bookmarkColor: 'navy' | 'rose' | 'emerald' | 'gold' | 'terracotta' | 'violet';
  showBookmark: boolean;
  showWashiCorners: boolean;
  paperTextureOverlay: boolean;
}

export interface Task {
  id: string;
  title: string;
  notes?: string;
  category: CategoryType;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  completedAt?: string;
  createdAt?: string;
  completionType: CompletionType;
  estimatedPomodoros: number;
  completedPomodoros: number;
  color: string;
  iconName: string;
  // Bullet Journal (BuJo) Mode fields
  bujoType?: BujoType;
  bujoStatus?: BujoStatus;
  bujoSignifier?: BujoSignifier;
  collection?: string; // 'daily' | 'monthly' | 'future' | 'ideas' | custom collection name
  migratedToDate?: string;
  // Decorative image & sticker fields
  imageUrl?: string;
  imageLayout?: BujoImageLayout;
  imageCaption?: string;
  imageSize?: 'sm' | 'md' | 'lg' | 'xl';
  imageZoom?: number; // 100 to 250
  imageFocusX?: number; // 0 to 100
  imageFocusY?: number; // 0 to 100
  imageFit?: 'cover' | 'contain';
}

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

export interface PomodoroSettings {
  focusDuration: number; // in minutes (default: 25)
  shortBreakDuration: number; // in minutes (default: 5)
  longBreakDuration: number; // in minutes (default: 15)
  sessionsBeforeLongBreak: number; // default: 4
  autoStartBreaks: boolean;
  autoStartFocus: boolean;
  ambientSound: 'none' | 'rain' | 'waves' | 'forest' | 'cafe' | 'whitenoise';
  ambientVolume: number; // 0 to 1
  soundEffects: boolean;
  backgroundImageUrl: string;
  backgroundOverlayOpacity: number; // 0.1 to 0.9
  backgroundBlur: number; // 0 to 20 px
}

export interface PomodoroSessionRecord {
  id: string;
  timestamp: string; // ISO string
  date: string; // YYYY-MM-DD
  mode: PomodoroMode;
  durationMinutes: number;
  tag: string;
  linkedHabitId?: string;
  linkedTaskId?: string;
}

export interface TimeBlock {
  id: string;
  title: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: 'habit' | 'task' | 'pomodoro' | 'custom';
  referenceId?: string;
  color: string;
  iconName: string;
  isDone: boolean;
}

export interface AppReminder {
  id: string;
  title: string;
  message: string;
  time: string; // HH:mm
  type: 'habit' | 'task' | 'pomodoro' | 'custom';
  enabled: boolean;
  repeatDaily: boolean;
  referenceId?: string;
}

export interface FocusPhotoPreset {
  id: string;
  title: string;
  author: string;
  url: string;
  category: 'nature' | 'minimal' | 'cozy' | 'architecture' | 'abstract';
  dominantColor: string;
}
