// Date & Streak Utilities

export function getTodayKey(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDatePretty(dateString: string): string {
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getShortDayName(dayIndex: number): string {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return names[dayIndex % 7];
}

export function getDaysInCurrentWeek(): { dateStr: string; dayName: string; dayNum: number; isToday: boolean }[] {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 is Sunday
  const mondayOffset = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);

  const days = [];
  const todayStr = getTodayKey();

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    days.push({
      dateStr,
      dayName: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      dayNum: d.getDate(),
      isToday: dateStr === todayStr,
    });
  }

  return days;
}

export interface CalendarMonthDay {
  dateStr: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export function getCalendarGridDays(year: number, monthIndex: number): CalendarMonthDay[] {
  const todayStr = getTodayKey();
  const firstDayOfMonth = new Date(year, monthIndex, 1);
  const lastDayOfMonth = new Date(year, monthIndex + 1, 0);

  // 0 = Sun, 1 = Mon ... we want Monday start (Mon=0, Tue=1 ... Sun=6)
  let startDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startDayOfWeek === -1) startDayOfWeek = 6;

  const days: CalendarMonthDay[] = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, monthIndex, 0).getDate();
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    const prevMonthDate = new Date(year, monthIndex - 1, d);
    const y = prevMonthDate.getFullYear();
    const m = String(prevMonthDate.getMonth() + 1).padStart(2, '0');
    const day = String(d).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    days.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  // Current month days
  const totalDaysInMonth = lastDayOfMonth.getDate();
  for (let d = 1; d <= totalDaysInMonth; d++) {
    const m = String(monthIndex + 1).padStart(2, '0');
    const day = String(d).padStart(2, '0');
    const dateStr = `${year}-${m}-${day}`;
    days.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr,
    });
  }

  // Next month leading days (fill up grid to 35 or 42)
  const remainingCells = (7 - (days.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonthDate = new Date(year, monthIndex + 1, d);
    const y = nextMonthDate.getFullYear();
    const m = String(nextMonthDate.getMonth() + 1).padStart(2, '0');
    const day = String(d).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    days.push({
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr,
    });
  }

  return days;
}

// Calculate streaks considering frequency and missed days
export function calculateStreak(completedDates: string[]): { current: number; best: number } {
  if (!completedDates || completedDates.length === 0) {
    return { current: 0, best: 0 };
  }

  const uniqueSortedDates = Array.from(new Set(completedDates)).sort().reverse();
  const today = getTodayKey();

  // Check if yesterday or today is completed to keep streak alive
  let currentStreak = 0;
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`;

  const hasToday = uniqueSortedDates.includes(today);
  const hasYesterday = uniqueSortedDates.includes(yesterday);

  if (hasToday || hasYesterday) {
    let checkDate = new Date();
    if (!hasToday && hasYesterday) {
      checkDate = yesterdayDate;
    }

    while (true) {
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      const key = `${year}-${month}-${day}`;

      if (uniqueSortedDates.includes(key)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate best all-time streak
  const chronological = Array.from(new Set(completedDates)).sort();
  let bestStreak = 0;
  let tempStreak = 0;
  let prevDate: Date | null = null;

  for (const dateStr of chronological) {
    const [y, m, d] = dateStr.split('-').map(Number);
    const currentDate = new Date(y, m - 1, d);

    if (!prevDate) {
      tempStreak = 1;
    } else {
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }

    if (tempStreak > bestStreak) {
      bestStreak = tempStreak;
    }
    prevDate = currentDate;
  }

  bestStreak = Math.max(bestStreak, currentStreak);

  return { current: currentStreak, best: bestStreak };
}

// Generate last 60 days for heatmap
export function getLastNDays(n: number = 60): { dateStr: string; count: number }[] {
  const result = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    result.push({ dateStr, count: 0 });
  }
  return result;
}
