import React from 'react';
import { getLastNDays } from '../../utils/date';
import { Sparkles, Grid } from 'lucide-react';

interface HeatmapGridProps {
  completedDatesSet: Set<string>;
  habitCount: number;
}

export const HeatmapGrid: React.FC<HeatmapGridProps> = ({
  completedDatesSet,
  habitCount,
}) => {
  const days = getLastNDays(70); // 10 weeks of history

  return (
    <div className="bg-[#FAF6EE] dark:bg-[#1A1C2B] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border-2 border-[#D7C9B1] dark:border-[#383D59] shadow-xs relative overflow-hidden transition-colors">
      {/* Decorative washi tape */}
      <div className="absolute -top-3 right-10 w-24 h-5 bg-[#FF8E7E]/30 rounded-sm transform rotate-1 pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#8E7CC3]/15 dark:bg-[#8E7CC3]/25 text-[11px] font-bold text-[#5A4688] dark:text-[#C5BAEB] mb-1">
            <Grid className="w-3 h-3" />
            <span>Consistency Matrix</span>
          </div>
          <h3 className="font-display italic font-extrabold text-xl text-[#4A3222] dark:text-[#F1F5F9]">
            10-Week Activity Heatmap
          </h3>
          <p className="text-xs text-[#735A46] dark:text-[#94A3B8] font-body">
            Visual diary of completed habits and focus sessions over time
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-[#735A46] dark:text-[#94A3B8] font-body bg-white dark:bg-[#23273C] px-3 py-1.5 rounded-xl border border-[#D7C9B1] dark:border-[#3C4263]">
          <span>Less</span>
          <div className="w-3 h-3 rounded-xs bg-[#EFE7D8] dark:bg-[#2D334C] border border-[#D7C9B1] dark:border-[#3C4263]" />
          <div className="w-3 h-3 rounded-xs bg-[#8E7CC3]/50 border border-[#8E7CC3]" />
          <div className="w-3 h-3 rounded-xs bg-[#E27B9B] border border-[#B84F70]" />
          <span>More</span>
        </div>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-7 gap-1.5 min-w-[500px] p-2 bg-[#FFFDF8] dark:bg-[#161825] rounded-xl border border-[#D7C9B1] dark:border-[#3C4263]">
          {days.map((d) => {
            const isCompleted = completedDatesSet.has(d.dateStr);
            return (
              <div
                key={d.dateStr}
                title={`${d.dateStr}: ${isCompleted ? 'Activity recorded' : 'No recorded activity'}`}
                className={`w-3.5 h-3.5 rounded-xs border transition-all cursor-pointer hover:scale-125 ${
                  isCompleted
                    ? 'bg-[#E27B9B] border-[#B84F70] shadow-2xs'
                    : 'bg-[#EFE7D8] dark:bg-[#282C44] border-[#D7C9B1]/60 dark:border-[#3C4263]/50'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
