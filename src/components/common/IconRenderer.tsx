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

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
  strokeWidth?: number;
}

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

export const IconRenderer: React.FC<IconRendererProps> = ({
  name,
  className = 'w-5 h-5',
  size,
  strokeWidth = 2.2,
}) => {
  if (!name) {
    return <Sparkles className={className} size={size} strokeWidth={strokeWidth} />;
  }

  // 1. Check if it's a custom uploaded image (Base64 data URL or external URL)
  if (name.startsWith('data:image') || name.startsWith('http://') || name.startsWith('https://') || name.startsWith('blob:')) {
    return (
      <img
        src={name}
        alt="Custom Icon"
        className={`${className} object-cover rounded-md shrink-0 select-none pointer-events-none`}
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
