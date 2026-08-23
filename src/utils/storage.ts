import { Habit, Task, PomodoroSettings, PomodoroSessionRecord, FocusPhotoPreset, TimeBlock, AppReminder } from '../types';
import { getTodayKey } from './date';

export const APP_PALETTE = [
  { name: 'Rosa Vivo', hex: '#E36D9B', bg: 'bg-[#E36D9B]', text: 'text-[#E36D9B]', border: 'border-[#E36D9B]' },
  { name: 'Amarillo Sol', hex: '#E7DD6A', bg: 'bg-[#E7DD6A]', text: 'text-[#8A810E]', border: 'border-[#E7DD6A]' },
  { name: 'Verde Esmeralda', hex: '#00CB75', bg: 'bg-[#00CB75]', text: 'text-[#00CB75]', border: 'border-[#00CB75]' },
  { name: 'Verde Jade', hex: '#10B183', bg: 'bg-[#10B183]', text: 'text-[#10B183]', border: 'border-[#10B183]' },
  { name: 'Azul Cobalto', hex: '#2B4789', bg: 'bg-[#2B4789]', text: 'text-[#2B4789]', border: 'border-[#2B4789]' },
];

export const PHOTO_PRESETS: FocusPhotoPreset[] = [
  {
    id: 'photo-1',
    title: 'Cafetería Acogedora & Lluvia',
    author: 'Cozy Focus',
    category: 'cozy',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1600&q=80',
    dominantColor: '#2B4789',
  },
  {
    id: 'photo-2',
    title: 'Luz de Bosque & Niebla Matutina',
    author: 'Serene Woods',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=80',
    dominantColor: '#10B183',
  },
  {
    id: 'photo-3',
    title: 'Escritorio Minimalista & Plantas',
    author: 'Zen Workspace',
    category: 'minimal',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1600&q=80',
    dominantColor: '#00CB75',
  },
  {
    id: 'photo-4',
    title: 'Biblioteca Clásica & Madera Cálida',
    author: 'Academic Sanctuary',
    category: 'cozy',
    url: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1600&q=80',
    dominantColor: '#2B4789',
  },
  {
    id: 'photo-5',
    title: 'Atardecer Dorado en las Montañas',
    author: 'Golden Horizon',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    dominantColor: '#E7DD6A',
  },
  {
    id: 'photo-6',
    title: 'Cielo Estrellado & Nebulosa Rosa',
    author: 'Celestial Dream',
    category: 'abstract',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
    dominantColor: '#E36D9B',
  },
  {
    id: 'photo-7',
    title: 'Arquitectura Geométrica & Sombras',
    author: 'Modern Lines',
    category: 'architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
    dominantColor: '#2B4789',
  },
  {
    id: 'photo-8',
    title: 'Jardín Zen Japonés & Agua',
    author: 'Komorebi Peace',
    category: 'nature',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
    dominantColor: '#10B183',
  }
];

const INITIAL_HABITS: Habit[] = [
  {
    id: 'habit-1',
    title: 'Meditación Matutina & Mindfulness',
    description: '10 minutos de respiración consciente al despertar',
    category: 'mente',
    color: '#2B4789',
    iconName: 'Sparkles',
    frequency: 'daily',
    targetTimeOfDay: 'morning',
    scheduledTime: '07:30',
    completionType: 'swipe',
    completedDates: [getTodayKey()],
    streakCurrent: 4,
    streakBest: 12,
    createdAt: '2026-08-01',
    reminderEnabled: true,
    reminderTime: '07:25',
    targetCount: 1,
    targetUnit: 'sesión',
  },
  {
    id: 'habit-2',
    title: 'Hidratación — 2L de Agua',
    description: 'Mantener una botella a la mano durante el trabajo',
    category: 'salud',
    color: '#10B183',
    iconName: 'Droplets',
    frequency: 'daily',
    targetTimeOfDay: 'anytime',
    completionType: 'checkbox',
    completedDates: [getTodayKey()],
    streakCurrent: 7,
    streakBest: 21,
    createdAt: '2026-08-01',
    reminderEnabled: true,
    reminderTime: '11:00',
    targetCount: 8,
    targetUnit: 'vasos',
  },
  {
    id: 'habit-3',
    title: 'Lectura Profunda (20 Páginas)',
    description: 'Leer un libro de no ficción o literatura antes de dormir',
    category: 'creatividad',
    color: '#E36D9B',
    iconName: 'BookOpen',
    frequency: 'daily',
    targetTimeOfDay: 'evening',
    scheduledTime: '21:30',
    completionType: 'swipe',
    completedDates: [],
    streakCurrent: 3,
    streakBest: 9,
    createdAt: '2026-08-05',
    reminderEnabled: true,
    reminderTime: '21:15',
    targetCount: 20,
    targetUnit: 'págs',
  },
  {
    id: 'habit-4',
    title: 'Caminar 30 Minutos al Aire Libre',
    description: 'Paseo activo para despejar la mente y activar el cuerpo',
    category: 'bienestar',
    color: '#00CB75',
    iconName: 'Footprints',
    frequency: 'weekdays',
    targetTimeOfDay: 'afternoon',
    scheduledTime: '18:00',
    completionType: 'checkbox',
    completedDates: [],
    streakCurrent: 2,
    streakBest: 8,
    createdAt: '2026-08-10',
    reminderEnabled: false,
    targetCount: 1,
    targetUnit: 'paseo',
  },
  {
    id: 'habit-5',
    title: 'Sesión de Escritura Creativa',
    description: 'Escribir reflexiones, ideas o diario de gratitud',
    category: 'creatividad',
    color: '#E7DD6A',
    iconName: 'PenTool',
    frequency: 'daily',
    targetTimeOfDay: 'evening',
    scheduledTime: '20:45',
    completionType: 'swipe',
    completedDates: [],
    streakCurrent: 5,
    streakBest: 15,
    createdAt: '2026-08-08',
    reminderEnabled: true,
    reminderTime: '20:30',
    targetCount: 1,
    targetUnit: 'entrada',
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Finalizar propuesta del proyecto de diseño',
    notes: 'Revisar paleta de colores, tipografías y prototipo responsive',
    category: 'trabajo',
    dueDate: getTodayKey(),
    dueTime: '15:00',
    priority: 'high',
    completed: false,
    completionType: 'swipe',
    estimatedPomodoros: 3,
    completedPomodoros: 1,
    color: '#2B4789',
    iconName: 'Palette',
    bujoType: 'task',
    bujoStatus: 'todo',
    bujoSignifier: 'priority',
    collection: 'daily',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    imageLayout: 'polaroid',
    imageCaption: 'Diseño & Enfoque',
  },
  {
    id: 'task-2',
    title: 'Planificar menú semanal saludable',
    notes: 'Hacer lista de compras para vegetales frescos y frutos secos',
    category: 'salud',
    dueDate: getTodayKey(),
    dueTime: '19:00',
    priority: 'medium',
    completed: true,
    completedAt: '2026-08-21T10:15:00Z',
    completionType: 'checkbox',
    estimatedPomodoros: 1,
    completedPomodoros: 1,
    color: '#10B183',
    iconName: 'Apple',
    bujoType: 'task',
    bujoStatus: 'completed',
    bujoSignifier: 'none',
    collection: 'daily',
    imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=600&q=80',
    imageLayout: 'sticker',
    imageCaption: 'Monstera viva',
  },
  {
    id: 'task-3',
    title: 'Revisar finanzas y presupuesto mensual',
    notes: 'Organizar ahorros y gastos fijos',
    category: 'rutina',
    dueDate: getTodayKey(),
    dueTime: '17:30',
    priority: 'low',
    completed: false,
    completionType: 'checkbox',
    estimatedPomodoros: 2,
    completedPomodoros: 0,
    color: '#E36D9B',
    iconName: 'Wallet',
    bujoType: 'task',
    bujoStatus: 'todo',
    bujoSignifier: 'none',
    collection: 'daily',
  },
  {
    id: 'task-4',
    title: 'Reunión de alineación con equipo creativo',
    notes: 'Presentar avances de la interfaz y feedback de usuarios',
    category: 'trabajo',
    dueDate: getTodayKey(),
    dueTime: '11:00',
    priority: 'high',
    completed: false,
    completionType: 'checkbox',
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    color: '#2B4789',
    iconName: 'Users',
    bujoType: 'event',
    bujoStatus: 'todo',
    bujoSignifier: 'priority',
    collection: 'daily',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
    imageLayout: 'stamp',
    imageCaption: 'Coffee Talk',
  },
  {
    id: 'task-5',
    title: 'Idea: Probar paleta retro con tipografía serif para el nuevo branding',
    notes: 'Inspirado en catálogos editoriales de los 70s',
    category: 'creatividad',
    dueDate: getTodayKey(),
    priority: 'medium',
    completed: false,
    completionType: 'checkbox',
    estimatedPomodoros: 1,
    completedPomodoros: 0,
    color: '#E7DD6A',
    iconName: 'Sparkles',
    bujoType: 'note',
    bujoStatus: 'todo',
    bujoSignifier: 'inspiration',
    collection: 'ideas',
  },
];

const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsBeforeLongBreak: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  ambientSound: 'rain',
  ambientVolume: 0.4,
  soundEffects: true,
  backgroundImageUrl: PHOTO_PRESETS[0].url,
  backgroundOverlayOpacity: 0.55,
  backgroundBlur: 0,
};

const INITIAL_HISTORY: PomodoroSessionRecord[] = [
  {
    id: 'sess-1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    date: getTodayKey(),
    mode: 'focus',
    durationMinutes: 25,
    tag: 'Diseño UX',
    linkedTaskId: 'task-1',
  },
  {
    id: 'sess-2',
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
    date: getTodayKey(),
    mode: 'focus',
    durationMinutes: 25,
    tag: 'Estudio Profundo',
  },
  {
    id: 'sess-3',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    mode: 'focus',
    durationMinutes: 50,
    tag: 'Programación',
  },
];

export const STORAGE_KEYS = {
  HABITS: 'aura_habits_data_v2',
  TASKS: 'aura_tasks_data_v2',
  POMO_SETTINGS: 'aura_pomodoro_settings_v2',
  POMO_HISTORY: 'aura_pomodoro_history_v2',
  TIME_BLOCKS: 'aura_time_blocks_v2',
  REMINDERS: 'aura_reminders_v2',
  CUSTOM_PHOTOS: 'aura_custom_photos_v2',
  HABIT_BANNER_DECORATION: 'aura_habit_banner_decoration_v2',
};

export interface HabitBannerDecoration {
  phrase: string;
  imageUrl: string | null;
  imageCaption?: string;
  layout?: 'polaroid' | 'sticker' | 'frame';
}

export const COZY_MOTIVATIONAL_PHRASES = [
  'Small daily steps cultivate life’s greatest adventures. ✨',
  'Bloom gently at your own rhythm. 🌸',
  'Each mindful habit is a gift to your future self. 🌿',
  'Rest when you need, resume with kindness. 🍵',
  'Quiet consistency creates lasting wonder. 🪴',
  'Celebrate every little victory along the path. 💫',
  'Peace in every breath, purpose in every action. 🕯️',
  'You don’t have to be perfect, just present. 🍃',
  'A cozy routine brings clarity to the mind. 📖',
  'Little by little, a little becomes a lot. 🍓',
];

export const COZY_PRESET_DECORATIONS = [
  {
    id: 'preset-cozy-tea',
    title: 'Cozy Morning Brew',
    caption: 'Warm Morning ☕',
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'preset-plant-shelf',
    title: 'Botanical Corner',
    caption: 'Growing Daily 🌿',
    url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'preset-desk-lamp',
    title: 'Warm Study Corner',
    caption: 'Gentle Focus 🕯️',
    url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'preset-cottage-garden',
    title: 'Sunlit Meadow',
    caption: 'Peaceful Bloom 🌸',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'preset-pixel-sky',
    title: 'Pastel Sunset Sky',
    caption: 'Golden Hours 🌅',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  },
];

export function getStoredHabitBannerDecoration(): HabitBannerDecoration {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABIT_BANNER_DECORATION);
    if (raw) {
      return {
        phrase: 'Small daily steps cultivate life’s greatest adventures. ✨',
        imageUrl: null,
        imageCaption: 'Cozy Rituals 🌿',
        layout: 'polaroid',
        ...JSON.parse(raw),
      };
    }
  } catch {}
  return {
    phrase: 'Small daily steps cultivate life’s greatest adventures. ✨',
    imageUrl: null,
    imageCaption: 'Cozy Rituals 🌿',
    layout: 'polaroid',
  };
}

export function saveStoredHabitBannerDecoration(decoration: HabitBannerDecoration) {
  try {
    localStorage.setItem(STORAGE_KEYS.HABIT_BANNER_DECORATION, JSON.stringify(decoration));
  } catch (err) {
    console.error('Failed to save habit decoration', err);
  }
}

export function compressImageFile(file: File, maxWidth = 600, maxHeight = 600, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function getStoredHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_HABITS;
}

export function saveStoredHabits(habits: Habit[]) {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
}

export function getStoredTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_TASKS;
}

export function saveStoredTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function getStoredPomodoroSettings(): PomodoroSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POMO_SETTINGS);
    if (raw) return { ...DEFAULT_POMODORO_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_POMODORO_SETTINGS;
}

export function saveStoredPomodoroSettings(settings: PomodoroSettings) {
  localStorage.setItem(STORAGE_KEYS.POMO_SETTINGS, JSON.stringify(settings));
}

export function getStoredPomodoroHistory(): PomodoroSessionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POMO_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return INITIAL_HISTORY;
}

export function saveStoredPomodoroHistory(history: PomodoroSessionRecord[]) {
  localStorage.setItem(STORAGE_KEYS.POMO_HISTORY, JSON.stringify(history));
}

export function getStoredReminders(): AppReminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    {
      id: 'rem-1',
      title: 'Momento de Enfoque Matutino',
      message: 'Comienza tu primer bloque de concentración del día con Pomodoro',
      time: '09:00',
      type: 'pomodoro',
      enabled: true,
      repeatDaily: true,
    },
    {
      id: 'rem-2',
      title: 'Pausa para Hidratación',
      message: 'Recuerda tomar un vaso de agua fresca y estirar',
      time: '14:00',
      type: 'habit',
      enabled: true,
      repeatDaily: true,
    }
  ];
}

export function saveStoredReminders(reminders: AppReminder[]) {
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
}
