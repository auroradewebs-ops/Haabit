import React from 'react';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  Calendar,
  BarChart3,
  Bell,
  Download,
  Moon,
  Sun,
} from 'lucide-react';

export type ActiveTab = 'habits' | 'pomodoro' | 'tasks' | 'schedule' | 'stats' | 'reminders';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
  unreadRemindersCount?: number;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  canInstallPwa,
  onInstallPwa,
  unreadRemindersCount = 0,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'habits', label: 'Habits', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'pomodoro', label: 'Focus Timer', icon: <Clock className="w-4 h-4" /> },
    { id: 'tasks', label: 'Journal & Tasks', icon: <ListTodo className="w-4 h-4" /> },
    { id: 'schedule', label: 'Timeline', icon: <Calendar className="w-4 h-4" /> },
    { id: 'stats', label: 'Insights', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFFDF8]/95 dark:bg-[#151726]/95 backdrop-blur-md border-b-2 border-[#D7C9B1] dark:border-[#2D334C] shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Title */}
        <button
          type="button"
          onClick={() => onTabChange('habits')}
          className="font-display italic font-extrabold text-2xl sm:text-3xl text-[#5A4688] dark:text-[#C5BAEB] tracking-tight hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
        >
          Aurora
        </button>

        {/* Zone 2: Navigation Links (Desktop & Tablet) */}
        <nav className="hidden md:flex items-center gap-0.5 lg:gap-1 bg-[#FAF6EE] dark:bg-[#1E2133] p-1 rounded-2xl border border-[#D7C9B1] dark:border-[#3C4263] overflow-hidden shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`px-2.5 lg:px-3.5 py-1.5 lg:py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#8E7CC3] text-white shadow-xs font-extrabold'
                    : 'text-[#735A46] dark:text-[#94A3B8] hover:text-[#4A3222] dark:hover:text-white hover:bg-white/80 dark:hover:bg-[#282C44]'
                }`}
              >
                {item.icon}
                <span className="hidden lg:inline">{item.label}</span>
                <span className="inline lg:hidden">
                  {item.id === 'pomodoro'
                    ? 'Focus'
                    : item.id === 'tasks'
                    ? 'Journal'
                    : item.id === 'schedule'
                    ? 'Timeline'
                    : item.id === 'stats'
                    ? 'Insights'
                    : item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Dark Mode, Alerts & PWA Install) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Dark Mode Toggle */}
          {onToggleDarkMode && (
            <button
              type="button"
              onClick={onToggleDarkMode}
              className="p-2 sm:px-2.5 sm:py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 border border-[#D7C9B1] dark:border-[#3C4263] bg-white dark:bg-[#1E2133] text-[#4A3222] dark:text-[#E2E8F0] hover:bg-[#FAF6EE] dark:hover:bg-[#282C44] active:scale-95 shadow-xs"
              title={isDarkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#F4B843] animate-spin-slow" />
              ) : (
                <Moon className="w-4 h-4 text-[#5A4688]" />
              )}
              <span className="hidden xl:inline text-[11px]">
                {isDarkMode ? 'Light' : 'Dark'}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onTabChange('reminders')}
            className={`p-2 sm:px-2.5 md:px-3 sm:py-2 rounded-xl text-xs font-bold font-body transition-all flex items-center gap-1.5 relative border ${
              activeTab === 'reminders'
                ? 'bg-[#FF8E7E] text-white border-[#FF8E7E] shadow-xs'
                : 'bg-white dark:bg-[#1E2133] text-[#4A3222] dark:text-[#E2E8F0] hover:bg-[#FAF6EE] dark:hover:bg-[#282C44] border-[#D7C9B1] dark:border-[#3C4263]'
            }`}
            title="Custom Reminders"
          >
            <Bell className="w-4 h-4 text-current" />
            <span className="hidden xl:inline">Alerts</span>
            {unreadRemindersCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#FF8E7E] absolute top-1.5 right-1.5 ring-2 ring-white dark:ring-[#1E2133] animate-pulse" />
            )}
          </button>

          {canInstallPwa && (
            <button
              type="button"
              onClick={onInstallPwa}
              className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-[#8E7CC3] hover:bg-[#7B68B4] text-white text-xs font-bold font-body shadow-xs flex items-center gap-1.5 active:scale-95 transition-all whitespace-nowrap"
              title="Install Aura as a Desktop or Mobile App"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Install App</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
