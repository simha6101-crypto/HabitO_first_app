import React from 'react';
import { Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useApp, parseLocalDate, addDays, getTodayDate } from '../context/AppContext';

export const WeeklyDateStrip: React.FC = () => {
  const { selectedDate, setSelectedDate, theme, habits } = useApp();

  // Anchor the visible 7-day week to the Monday containing selectedDate
  const selectedDateObj = parseLocalDate(selectedDate);
  const dayOfWeek = selectedDateObj.getDay(); // 0 is Sun, 1 is Mon
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const mondayStr = addDays(selectedDate, diffToMonday);

  const todayStr = getTodayDate();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const fullDate = addDays(mondayStr, i);
    const d = parseLocalDate(fullDate);
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = String(d.getDate()).padStart(2, '0');
    const isToday = fullDate === todayStr || fullDate === '2026-10-03';
    return { dayName, dayNum, fullDate, isToday };
  });

  const monthLabel = parseLocalDate(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isCurrentWeek = weekDays.some(d => d.fullDate === todayStr || d.fullDate === '2026-10-03');

  // Count active habits completed with photo on selectedDate
  const activeHabits = habits.filter(h => !h.isPaused);
  const completedCount = activeHabits.filter(h => 
    (h.proofs || []).some(p => p.date === selectedDate)
  ).length;

  const totalCount = activeHabits.length;

  return (
    <div className="mb-6 space-y-3">
      {/* Current Month & Status Header */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div 
            className="p-1.5 rounded-lg shrink-0"
            style={{ backgroundColor: theme.colors.primaryBg }}
          >
            <Calendar className="w-4 h-4" style={{ color: theme.colors.primary }} />
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5 sm:gap-2 truncate">
              <span>{monthLabel}</span>
              {isCurrentWeek && <span className="text-xs font-normal text-slate-500 hidden sm:inline">· Current Week</span>}
            </h2>
            <p className="text-xs text-slate-600 truncate">
              {completedCount} of {totalCount} habits verified with photo proof
            </p>
          </div>
        </div>

        {/* Week navigation buttons & small theme badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, -7))}
              className="p-1.5 rounded-xl border bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
              style={{ borderColor: theme.colors.cardBorder }}
              title="Previous week"
              aria-label="Previous week"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {!isCurrentWeek && (
              <button
                onClick={() => setSelectedDate(todayStr === '2026-10-03' ? '2026-10-03' : todayStr)}
                className="px-2 py-1 text-[11px] font-bold rounded-lg border bg-white text-slate-700 hover:bg-slate-50"
                style={{ borderColor: theme.colors.cardBorder }}
              >
                Today
              </button>
            )}
            <button
              onClick={() => setSelectedDate(addDays(selectedDate, 7))}
              className="p-1.5 rounded-xl border bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
              style={{ borderColor: theme.colors.cardBorder }}
              title="Next week"
              aria-label="Next week"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div 
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border shrink-0"
            style={{
              backgroundColor: theme.colors.cardBg,
              borderColor: theme.colors.cardBorder,
              color: theme.colors.primary
            }}
          >
            <span>{theme.badgeEmoji}</span>
            <span className="font-semibold">{theme.character}</span>
          </div>
        </div>
      </div>

      {/* Week Date Strip Buttons */}
      <div 
        className="p-1.5 rounded-2xl border shadow-xs flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder
        }}
      >
        {weekDays.map((d) => {
          const isSelected = selectedDate === d.fullDate;
          // Check if any habit has proof on this day
          const dayProofsCount = habits.reduce(
            (acc, h) => acc + (h.proofs || []).filter(p => p.date === d.fullDate).length, 
            0
          );
          const hasFullProofs = dayProofsCount >= 3;

          return (
            <button
              key={d.fullDate}
              onClick={() => setSelectedDate(d.fullDate)}
              className={`flex-1 min-w-[36px] sm:min-w-[42px] py-1.5 sm:py-2 px-0.5 sm:px-2 rounded-xl flex flex-col items-center justify-center transition-all duration-200 relative ${
                isSelected 
                  ? 'shadow-xs font-bold scale-[1.02]' 
                  : 'hover:bg-slate-50 text-slate-600'
              }`}
              style={{
                backgroundColor: isSelected ? theme.colors.primaryBg : 'transparent',
                border: isSelected ? `1.5px solid ${theme.colors.cardBorder}` : '1.5px solid transparent'
              }}
            >
              {/* Day Name */}
              <span 
                className="text-[10px] uppercase font-bold tracking-wider"
                style={{ color: isSelected ? theme.colors.primary : '#94A3B8' }}
              >
                {d.dayName}
              </span>

              {/* Day Number */}
              <span 
                className={`text-sm sm:text-base font-bold my-0.5 ${
                  isSelected ? 'text-slate-900' : 'text-slate-700'
                }`}
              >
                {d.dayNum}
              </span>

              {/* Today indicator or Proofs status dot */}
              <div className="h-2 flex items-center justify-center">
                {d.isToday && !isSelected && (
                  <span 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                )}
                {dayProofsCount > 0 && isSelected && (
                  <span 
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: theme.colors.primary }}
                  />
                )}
                {dayProofsCount > 0 && !isSelected && (
                  <span 
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                    title={`${dayProofsCount} photos verified`}
                  />
                )}
              </div>

              {/* Micro badge for full consistency */}
              {hasFullProofs && (
                <span className="absolute -top-1 -right-0.5 text-[9px] select-none">
                  {theme.stickers[0]?.emoji || '⭐'}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
