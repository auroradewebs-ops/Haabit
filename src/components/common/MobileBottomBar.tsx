import React from 'react';
import { ActiveTab } from './Header';
import {
  CheckCircle2,
  Clock,
  ListTodo,
  Calendar,
  BarChart3,
} from 'lucide-react';

interface MobileBottomBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  onTabChange,
}) => {
  const items: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'habits', label: 'Habits', icon: <CheckCircle2 className="w-5 h-5" /> },
    { id: 'pomodoro', label: 'Focus', icon: <Clock className="w-5 h-5" /> },
    { id: 'tasks', label: 'Journal', icon: <ListTodo className="w-5 h-5" /> },
    { id: 'schedule', label: 'Timeline', icon: <Calendar className="w-5 h-5" /> },
    { id: 'stats', label: 'Insights', icon: <BarChart3 className="w-5 h-5" /> },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF8]/95 dark:bg-[#151726]/95 backdrop-blur-lg border-t-2 border-[#D7C9B1] dark:border-[#2D334C] px-2 py-1.5 shadow-xl flex items-center justify-around transition-colors">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onTabChange(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive
                ? 'text-[#5A4688] dark:text-[#C5BAEB] font-bold scale-105'
                : 'text-[#8C7662] dark:text-[#94A3B8] hover:text-[#4A3222] dark:hover:text-white'
            }`}
          >
            <div className={`p-1 rounded-xl ${isActive ? 'bg-[#8E7CC3]/20 text-[#5A4688] dark:text-[#C5BAEB]' : ''}`}>
              {item.icon}
            </div>
            <span className="text-[10px] font-body mt-0.5 tracking-tight font-bold">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
