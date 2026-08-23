import React from 'react';
import {
  Sparkles,
  Droplets,
  BookOpen,
  Footprints,
  PenTool,
  Palette,
  Apple,
  Wallet,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Heart,
  Moon,
  Sun,
  Dumbbell,
  Coffee,
  Code,
  Compass,
  Music,
  Target,
  Zap,
  Check,
  AlertCircle,
  Smile,
  Brain,
  Feather,
  Eye,
  Wind,
  CheckSquare,
  Bookmark,
  Laptop,
  Briefcase,
  FileText,
  Utensils,
  Bed,
  Bike,
  GlassWater,
  Leaf,
  Activity,
  Camera,
  Scissors,
  Brush,
  Wand2,
  Flower2,
  Mic,
  Film,
  Gem,
  Gift,
  Star,
  PiggyBank,
  Home,
  ShoppingBag,
  Car,
  Plane,
  Sunrise,
  Sunset,
  Bell,
  Award,
  Anchor,
  Mountain,
  Shield,
  Flag,
  Cloud,
  Globe,
  Key,
  Lock,
  Lightbulb,
  MapPin,
  Search,
  Tag,
  Users,
  Trophy,
  Coffee as CupIcon,
  SmilePlus,
  LucideIcon
} from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Droplets,
  BookOpen,
  Footprints,
  PenTool,
  Palette,
  Apple,
  Wallet,
  Clock,
  CheckCircle2,
  Calendar,
  Flame,
  Heart,
  Moon,
  Sun,
  Dumbbell,
  Coffee,
  Code,
  Compass,
  Music,
  Target,
  Zap,
  Check,
  AlertCircle,
  Smile,
  Brain,
  Feather,
  Eye,
  Wind,
  CheckSquare,
  Bookmark,
  Laptop,
  Briefcase,
  FileText,
  Utensils,
  Bed,
  Bike,
  GlassWater,
  Leaf,
  Activity,
  Camera,
  Scissors,
  Brush,
  Wand2,
  Flower2,
  Mic,
  Film,
  Gem,
  Gift,
  Star,
  PiggyBank,
  Home,
  ShoppingBag,
  Car,
  Plane,
  Sunrise,
  Sunset,
  Bell,
  Award,
  Anchor,
  Mountain,
  Shield,
  Flag,
  Cloud,
  Globe,
  Key,
  Lock,
  Lightbulb,
  MapPin,
  Search,
  Tag,
  Users,
  Trophy,
  SmilePlus,
};

export const ICON_CATEGORIES: {
  category: string;
  icons: string[];
}[] = [
  {
    category: 'Mind & Mindfulness',
    icons: ['Sparkles', 'Heart', 'Moon', 'Sun', 'Flame', 'Brain', 'Feather', 'Eye', 'Wind', 'Smile', 'Sunrise', 'Sunset'],
  },
  {
    category: 'Productivity & Work',
    icons: ['CheckSquare', 'Target', 'Clock', 'Zap', 'BookOpen', 'Code', 'Laptop', 'Briefcase', 'FileText', 'Bookmark', 'Lightbulb', 'PenTool'],
  },
  {
    category: 'Health & Vitality',
    icons: ['Droplets', 'Dumbbell', 'Footprints', 'GlassWater', 'Activity', 'Apple', 'Utensils', 'Bed', 'Bike', 'Coffee', 'Leaf'],
  },
  {
    category: 'Creativity & Arts',
    icons: ['Palette', 'Brush', 'Wand2', 'Flower2', 'Camera', 'Scissors', 'Music', 'Mic', 'Film', 'Gem', 'Star', 'Gift'],
  },
  {
    category: 'Lifestyle & Routine',
    icons: ['Home', 'Wallet', 'PiggyBank', 'ShoppingBag', 'Car', 'Plane', 'Compass', 'Mountain', 'Award', 'Trophy', 'Bell', 'Key'],
  },
];

export const POPULAR_EMOJIS = [
  '🌿', '☕', '🧘', '💧', '📚', '🎯', '🎨', '✨', '🏃', '🌙',
  '🌸', '🥑', '💡', '🎧', '🪄', '🐾', '🍎', '🧁', '🏋️', '🪐',
  '🕯️', '🍵', '📖', '🌱', '🕊️', '🧘‍♂️', '💻', '📝', '🥗', '🌻'
];

export const AVAILABLE_ICONS = Object.keys(ICON_MAP);

/**
 * Checks if a given icon name string is actually an image (Base64 data URL, external URL, or blob)
 */
export function isImageIcon(name?: string | null): boolean {
  if (!name) return false;
  return (
    name.startsWith('data:image') ||
    name.startsWith('http://') ||
    name.startsWith('https://') ||
    name.startsWith('blob:') ||
    name.startsWith('/') ||
    name.startsWith('./') ||
    /\.(png|jpg|jpeg|webp|svg|gif|avif)$/i.test(name)
  );
}

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({
  name,
  className = 'w-5 h-5',
  size,
  strokeWidth = 2.2,
}) => {
  if (!name) {
    return <Sparkles className={className} size={size} strokeWidth={strokeWidth} />;
  }

  // 1. Check if it's a custom uploaded image
  if (isImageIcon(name)) {
    return (
      <img
        src={name}
        alt="Custom Icon"
        className={`object-cover rounded-xl shrink-0 select-none pointer-events-none ${className}`}
        style={{ width: size ? `${size}px` : undefined, height: size ? `${size}px` : undefined }}
      />
    );
  }

  // 2. Check if it's a known Lucide icon
  const LucideComponent = ICON_MAP[name];
  if (LucideComponent) {
    return <LucideComponent className={className} size={size} strokeWidth={strokeWidth} />;
  }

  // 3. Check if it's an emoji or custom single/multi-char symbol
  return (
    <span
      className={`inline-flex items-center justify-center select-none font-sans leading-none ${className}`}
      style={{ fontSize: size ? `${size * 0.9}px` : '1.1em' }}
    >
      {name}
    </span>
  );
};

interface IconBadgeProps {
  name: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  alt?: string;
}

/**
 * Universal Badge renderer for Habits, Tasks, Schedule items.
 * When the icon is a custom photo/image, it eliminates the colored frame/borders and lets the image fill the slot cleanly.
 * When the icon is a Lucide icon or emoji, it renders the styled colored frame badge.
 */
export const IconBadge: React.FC<IconBadgeProps> = ({
  name,
  color = '#8E7CC3',
  size = 'md',
  className = '',
  alt = 'Item icon',
}) => {
  const isImg = isImageIcon(name);

  const dimensionClasses =
    size === 'sm'
      ? 'w-8 h-8 sm:w-9 sm:h-9'
      : size === 'lg'
      ? 'w-12 h-12 sm:w-14 sm:h-14'
      : 'w-10 h-10 sm:w-11 sm:h-11';

  const iconInnerSize = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  const iconInnerClass = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  // If it's a custom image: ELIMINATE THE FRAME
  if (isImg) {
    return (
      <div
        className={`${dimensionClasses} rounded-xl overflow-hidden shrink-0 shadow-xs ${className}`}
        title={alt}
      >
        <img
          src={name}
          alt={alt}
          className="w-full h-full object-cover select-none pointer-events-none"
        />
      </div>
    );
  }

  // Standard Lucide icon or emoji: Render colored badge frame
  return (
    <div
      className={`${dimensionClasses} rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs border border-black/10 dark:border-white/10 overflow-hidden ${className}`}
      style={{ backgroundColor: color }}
      title={alt}
    >
      <IconRenderer name={name} className={iconInnerClass} size={iconInnerSize} />
    </div>
  );
};
