import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Flame, 
  Calendar as CalendarIcon, 
  Award, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Camera, 
  AlertCircle,
  Check
} from 'lucide-react';
import { useApp, calculateUserStreak, parseLocalDate, addDays, getTodayDate } from '../context/AppContext';
import { PhotoProof } from '../types';
import { ProofCaptureSourceLabel } from '../components/ProofCaptureSourceLabel';

export const StreakDetailsScreen: React.FC = () => {
  const { user, habits, theme, setCurrentScreen, setViewingProof } = useApp();

  const todayStr = getTodayDate();
  const todayObj = parseLocalDate(todayStr);

  // View state for monthly calendar (Year & Month, 1-indexed for month: 1 = Jan)
  const [calYear, setCalYear] = useState<number>(todayObj.getFullYear());
  const [calMonth, setCalMonth] = useState<number>(todayObj.getMonth() + 1);

  // Selected date on calendar for viewing daily activity details
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string>(todayStr);

  // Actual streak calculation from existing engine
  const userStreakData = calculateUserStreak(habits, todayStr);
  const currentStreak = userStreakData.currentStreak;
  const bestStreak = Math.max(
    userStreakData.longestStreak,
    currentStreak,
    user?.streak || 0
  );

  // Motivational message based on current streak
  const getMotivationalMessage = (streak: number) => {
    if (streak === 0) {
      return "Every legendary journey begins with day one. Complete a habit and take your photo proof today!";
    }
    if (streak < 3) {
      return "Momentum is sparking! The first few days build the foundation of automatic consistency.";
    }
    if (streak < 7) {
      return "Unstoppable drive! You are just days away from reaching your 7-Day Warrior milestone.";
    }
    if (streak < 14) {
      return "Full week mastered! Your brain is rewiring discipline into an effortless daily identity.";
    }
    if (streak < 30) {
      return "Two weeks strong! Real photo evidence proves your dedication is compounding daily.";
    }
    return "True mastery! Over a month of verified daily proof. You are an inspiration!";
  };

  // ==========================================
  // CONSISTENCY STATISTICS
  // ==========================================
  // 1. Weekly Consistency:
  // Denominator: 7 days (the last 7 days ending on todayStr).
  // Numerator: Unique calendar days in that window with at least 1 verified habit photo proof.
  const past7Days = Array.from({ length: 7 }, (_, i) => addDays(todayStr, -6 + i));
  const activeDaysInPast7 = past7Days.filter(date =>
    habits.some(h => h.proofs.some(p => p.date === date))
  ).length;
  const weeklyConsistencyPercent = Math.round((activeDaysInPast7 / 7) * 100);

  // 2. Monthly Consistency:
  // Denominator: Days elapsed in current calendar month up to todayStr.
  // Numerator: Unique calendar days in this month up to today with at least 1 verified habit photo proof.
  const currentMonthPrefix = todayStr.slice(0, 7); // 'YYYY-MM'
  const todayDayNum = todayObj.getDate();
  const daysInCurrentMonthUpToToday = Array.from({ length: todayDayNum }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    return `${currentMonthPrefix}-${day}`;
  });
  const completedDaysThisMonth = daysInCurrentMonthUpToToday.filter(date =>
    habits.some(h => h.proofs.some(p => p.date === date))
  ).length;
  const monthlyConsistencyPercent = todayDayNum > 0
    ? Math.round((completedDaysThisMonth / todayDayNum) * 100)
    : 0;

  // 3. Total Verified Proofs across all habits
  const totalVerifiedProofs = habits.reduce((acc, h) => acc + h.proofs.length, 0);

  // 4. Number of active habits
  const activeHabitsCount = habits.filter(habit => !habit.isPaused).length;

  // ==========================================
  // CALENDAR GENERATION
  // ==========================================
  const handlePrevMonth = () => {
    if (calMonth === 1) {
      setCalYear(prev => prev - 1);
      setCalMonth(12);
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 12) {
      setCalYear(prev => prev + 1);
      setCalMonth(1);
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  const handleJumpToToday = () => {
    setCalYear(todayObj.getFullYear());
    setCalMonth(todayObj.getMonth() + 1);
    setSelectedCalendarDate(todayStr);
  };

  const calMonthDateObj = parseLocalDate(`${calYear}-${String(calMonth).padStart(2, '0')}-01`);
  const monthDisplayTitle = calMonthDateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const isViewingCurrentMonth = calYear === todayObj.getFullYear() && calMonth === todayObj.getMonth() + 1;

  // Days in selected calendar month
  const totalDaysInMonth = new Date(calYear, calMonth, 0).getDate();
  const firstDayWeekday = calMonthDateObj.getDay(); // 0 is Sun, 1 is Mon
  const startPadding = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1; // Mon-start index 0..6

  // Earliest habit creation date to distinguish days before habits existed
  const earliestCreatedAt = habits.length > 0
    ? habits.reduce((earliest, h) => (!earliest || (h.createdAt && h.createdAt < earliest) ? h.createdAt : earliest), '')
    : null;

  interface DayCellData {
    dateStr: string;
    dayNum: number;
    status: 'completed' | 'missed' | 'future' | 'inactive' | 'pending-today';
    proofs: PhotoProof[];
  }

  const calendarDays: DayCellData[] = Array.from({ length: totalDaysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${calYear}-${String(calMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    const proofsForDay = habits.flatMap(h => h.proofs.filter(p => p.date === dateStr));

    if (dateStr > todayStr) {
      return { dateStr, dayNum, status: 'future', proofs: proofsForDay };
    }

    if (proofsForDay.length > 0) {
      return { dateStr, dayNum, status: 'completed', proofs: proofsForDay };
    }

    // No proofs on this date (dateStr <= todayStr)
    if (habits.length === 0) {
      return { dateStr, dayNum, status: 'inactive', proofs: [] };
    }

    if (earliestCreatedAt && dateStr < earliestCreatedAt) {
      return { dateStr, dayNum, status: 'inactive', proofs: [] };
    }

    if (dateStr === todayStr) {
      return { dateStr, dayNum, status: 'pending-today', proofs: [] };
    }

    // Past date where habits were active but no proofs were submitted
    return { dateStr, dayNum, status: 'missed', proofs: [] };
  });

  // Selected date proofs and info
  const selectedDayCell = calendarDays.find(d => d.dateStr === selectedCalendarDate) || {
    dateStr: selectedCalendarDate,
    dayNum: Number(selectedCalendarDate.slice(8)),
    status: (selectedCalendarDate > todayStr ? 'future' : 'inactive') as 'future' | 'inactive',
    proofs: habits.flatMap(h => h.proofs.filter(p => p.date === selectedCalendarDate))
  };

  const selectedDateFormatted = parseLocalDate(selectedCalendarDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // ==========================================
  // MILESTONES DEFINITIONS
  // ==========================================
  const milestones = [
    { days: 7, label: 'Week Warrior', icon: '⚡', description: 'Complete 7 consecutive streak days' },
    { days: 15, label: 'Fortnight Focus', icon: '🔥', description: '15 verified days of unstoppable discipline' },
    { days: 30, label: 'Monthly Master', icon: '🏆', description: '30 days of cemented daily habits' },
    { days: 100, label: 'Century Club', icon: '👑', description: '100 streak days of verifiable transformation' }
  ];

  // ==========================================
  // RECENT ACTIVITY
  // ==========================================
  const allProofsSorted = habits
    .flatMap(h => h.proofs)
    .sort((a, b) => {
      const timeA = a.timestamp ? new Date(a.timestamp).getTime() : parseLocalDate(a.date).getTime();
      const timeB = b.timestamp ? new Date(b.timestamp).getTime() : parseLocalDate(b.date).getTime();
      return timeB - timeA;
    });

  const recentProofs = allProofsSorted.slice(0, 6);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Navigation & Header */}
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <button
          onClick={() => setCurrentScreen('home')}
          className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl border bg-white text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs font-semibold text-xs shrink-0"
          style={{ borderColor: theme.colors.cardBorder }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back<span className="hidden sm:inline"> to Home</span></span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="text-xl select-none shrink-0">{theme.badgeEmoji}</span>
          <span 
            className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full truncate"
            style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
          >
            {theme.character} Streak HQ
          </span>
        </div>
      </div>

      {/* Hero Streak Card */}
      <div 
        className="rounded-3xl p-6 sm:p-7 border relative overflow-hidden shadow-xs"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder
        }}
      >
        {/* Subtle Ambient Glow */}
        <div 
          className="absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ backgroundColor: theme.colors.streakColor }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                Visual Proof Engine
              </span>
              <span 
                className="w-2 h-2 rounded-full animate-ping"
                style={{ backgroundColor: theme.colors.streakColor }}
              />
            </div>

            <div className="flex items-baseline gap-3">
              <h1 className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight font-display flex items-center gap-3">
                <span>{currentStreak}</span>
                <span className="text-2xl sm:text-3xl font-bold text-slate-500">
                  {currentStreak === 1 ? 'day streak' : 'days streak'}
                </span>
              </h1>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg leading-relaxed pt-1">
              {getMotivationalMessage(currentStreak)}
            </p>
          </div>

          {/* Record Streak & Badges Pill */}
          <div 
            className="p-4 rounded-2xl border bg-white/80 backdrop-blur-xs flex items-center gap-4 shrink-0 shadow-2xs self-start md:self-auto"
            style={{ borderColor: theme.colors.cardBorder }}
          >
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs"
              style={{ backgroundColor: `${theme.colors.streakColor}15`, color: theme.colors.streakColor }}
            >
              <Flame className="w-6 h-6 fill-current animate-pulse" />
            </div>

            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Personal Record
              </div>
              <div className="text-xl font-black text-slate-900">
                {bestStreak} {bestStreak === 1 ? 'Day' : 'Days'}
              </div>
              <div className="text-[10px] text-slate-400">
                All-time consecutive best
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Consistency Statistics Grid */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Consistency Metrics</span>
          </h2>
          <span className="text-[11px] text-slate-500">
            Calculated from verified dates
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Weekly Consistency */}
          <div 
            className="p-4 rounded-2xl border bg-white shadow-2xs flex flex-col justify-between space-y-2"
            style={{ borderColor: theme.colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Weekly Rate</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {weeklyConsistencyPercent}%
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {activeDaysInPast7} of 7 days verified (past week)
              </p>
            </div>
          </div>

          {/* Monthly Consistency */}
          <div 
            className="p-4 rounded-2xl border bg-white shadow-2xs flex flex-col justify-between space-y-2"
            style={{ borderColor: theme.colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Monthly Rate</span>
              <CalendarIcon className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {monthlyConsistencyPercent}%
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {completedDaysThisMonth} of {todayDayNum} days elapsed this month
              </p>
            </div>
          </div>

          {/* Total Photo Proofs */}
          <div 
            className="p-4 rounded-2xl border bg-white shadow-2xs flex flex-col justify-between space-y-2"
            style={{ borderColor: theme.colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Proofs</span>
              <Camera className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {totalVerifiedProofs}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Lifetime verified habit captures
              </p>
            </div>
          </div>

          {/* Active Habits */}
          <div 
            className="p-4 rounded-2xl border bg-white shadow-2xs flex flex-col justify-between space-y-2"
            style={{ borderColor: theme.colors.cardBorder }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Habits</span>
              <Sparkles className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">
                {activeHabitsCount}
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Routines currently monitored
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Interactive Calendar */}
      <div 
        className="rounded-3xl p-5 sm:p-6 border shadow-xs space-y-4"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder
        }}
      >
        {/* Calendar Month Navigation Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl"
              style={{ backgroundColor: theme.colors.primaryBg }}
            >
              <CalendarIcon className="w-4 h-4" style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base leading-tight">
                {monthDisplayTitle}
              </h3>
              <p className="text-xs text-slate-500">
                Tap any calendar date to view verified activity
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl border bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
              style={{ borderColor: theme.colors.cardBorder }}
              title="Previous month"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {!isViewingCurrentMonth && (
              <button
                onClick={handleJumpToToday}
                className="px-2.5 py-1 text-[11px] font-bold rounded-lg border bg-white text-slate-700 hover:bg-slate-50"
                style={{ borderColor: theme.colors.cardBorder }}
              >
                Today
              </button>
            )}

            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl border bg-white text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
              style={{ borderColor: theme.colors.cardBorder }}
              title="Next month"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[8px]">✓</span>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-400/80" />
            <span>Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-slate-300 bg-slate-100" />
            <span>No Habits / Rest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full border border-dashed border-slate-300" />
            <span>Future</span>
          </div>
        </div>

        {/* Weekday Names Header */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider py-1 border-b" style={{ borderColor: `${theme.colors.cardBorder}60` }}>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>

        {/* Calendar Days Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {/* Start Padding cells for month offset */}
          {Array.from({ length: startPadding }).map((_, idx) => (
            <div key={`pad-${idx}`} className="aspect-square opacity-0 pointer-events-none" />
          ))}

          {/* Actual Month Days */}
          {calendarDays.map((day) => {
            const isSelected = day.dateStr === selectedCalendarDate;
            const isToday = day.dateStr === todayStr;

            let bgClass = 'bg-white hover:bg-slate-50 text-slate-700';
            let borderStyle: React.CSSProperties = { borderColor: theme.colors.cardBorder };

            if (day.status === 'completed') {
              bgClass = 'bg-emerald-50 text-emerald-950 font-bold';
              borderStyle = { borderColor: '#A7F3D0' };
            } else if (day.status === 'missed') {
              bgClass = 'bg-rose-50 text-rose-900';
              borderStyle = { borderColor: '#FECDD3' };
            } else if (day.status === 'future') {
              bgClass = 'bg-slate-50/50 text-slate-300 border-dashed';
              borderStyle = { borderColor: '#E2E8F0' };
            } else if (day.status === 'pending-today') {
              bgClass = 'bg-amber-50/60 text-slate-800 font-semibold';
              borderStyle = { borderColor: '#FDE68A' };
            }

            if (isSelected) {
              borderStyle = {
                borderColor: theme.colors.primary,
                boxShadow: `0 0 0 2px ${theme.colors.primary}`
              };
            }

            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setSelectedCalendarDate(day.dateStr)}
                className={`relative aspect-square rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center p-1 transition-all duration-150 ${bgClass} ${
                  isSelected ? 'scale-105 z-10 font-black shadow-xs' : ''
                }`}
                style={borderStyle}
              >
                {/* Day number */}
                <span className={`text-xs sm:text-sm leading-none ${isToday ? 'underline underline-offset-2 font-black' : ''}`}>
                  {day.dayNum}
                </span>

                {/* Status Dot / Indicator */}
                <div className="mt-1 flex items-center justify-center h-2">
                  {day.status === 'completed' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  )}
                  {day.status === 'missed' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  )}
                  {day.status === 'pending-today' && (
                    <span 
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: theme.colors.primary }}
                    />
                  )}
                </div>

                {/* Multiple proof microbadge */}
                {day.proofs.length > 1 && (
                  <span className="absolute top-0.5 right-1 text-[8px] font-black text-emerald-700">
                    {day.proofs.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Date Proof Detail Panel */}
        <div 
          className="mt-4 p-4 rounded-2xl border bg-white shadow-2xs space-y-3"
          style={{ borderColor: theme.colors.cardBorder }}
        >
          <div className="flex items-center justify-between border-b pb-2.5" style={{ borderColor: `${theme.colors.cardBorder}60` }}>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                {selectedDateFormatted}
              </h4>
              <p className="text-[11px] text-slate-500">
                {selectedDayCell.status === 'completed' && `${selectedDayCell.proofs.length} habit ${selectedDayCell.proofs.length === 1 ? 'proof' : 'proofs'} verified`}
                {selectedDayCell.status === 'missed' && 'No habit proofs recorded'}
                {selectedDayCell.status === 'pending-today' && 'Today is active — complete habits to log proofs'}
                {selectedDayCell.status === 'inactive' && 'No habits were active on this date'}
                {selectedDayCell.status === 'future' && 'Future date'}
              </p>
            </div>

            <div>
              {selectedDayCell.status === 'completed' && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Completed
                </span>
              )}
              {selectedDayCell.status === 'missed' && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200">
                  Missed
                </span>
              )}
              {selectedDayCell.status === 'pending-today' && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                  Pending
                </span>
              )}
              {(selectedDayCell.status === 'inactive' || selectedDayCell.status === 'future') && (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500">
                  {selectedDayCell.status === 'future' ? 'Future' : 'Inactive'}
                </span>
              )}
            </div>
          </div>

          {/* Proof thumbnails or empty message */}
          {selectedDayCell.proofs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {selectedDayCell.proofs.map((proof) => (
                <div
                  key={proof.id}
                  onClick={() => setViewingProof(proof)}
                  className="group relative rounded-xl overflow-hidden border cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all bg-slate-50"
                  style={{ borderColor: theme.colors.cardBorder }}
                >
                  <div className="aspect-4/3 relative overflow-hidden bg-slate-900">
                    <img 
                      src={proof.photoUrl} 
                      alt={proof.habitTitle} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {proof.sticker && (
                      <span className="absolute bottom-1 right-1 text-sm bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded-md">
                        {proof.sticker}
                      </span>
                    )}
                  </div>
                  <div className="p-2">
                    <h5 className="font-bold text-slate-900 text-xs truncate">
                      {proof.habitTitle}
                    </h5>
                    <p className="text-[10px] text-slate-500 truncate">
                      {proof.caption || 'Verified completion'}
                    </p>
                    <ProofCaptureSourceLabel captureSource={proof.captureSource} className="text-[10px] text-slate-400 mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-xs text-slate-400 italic">
              {selectedDayCell.status === 'missed' && 'No photo evidence was logged for this scheduled day.'}
              {selectedDayCell.status === 'pending-today' && 'Take a quick photo proof today to maintain your active streak!'}
              {selectedDayCell.status === 'inactive' && 'You did not have active habits on this date.'}
              {selectedDayCell.status === 'future' && 'This date is in the future.'}
            </div>
          )}
        </div>
      </div>

      {/* Streak Milestones Progression */}
      <div 
        className="rounded-3xl p-5 sm:p-6 border shadow-xs space-y-4"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl"
              style={{ backgroundColor: theme.colors.primaryBg }}
            >
              <Award className="w-4 h-4" style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Streak Milestones
              </h3>
              <p className="text-xs text-slate-500">
                Unlock achievements based on your actual streak records
              </p>
            </div>
          </div>

          <span className="text-xs font-bold" style={{ color: theme.colors.primary }}>
            {milestones.filter(m => bestStreak >= m.days).length} of {milestones.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {milestones.map((m) => {
            const isUnlocked = bestStreak >= m.days;
            const progressPercent = Math.min(100, Math.round((bestStreak / m.days) * 100));

            return (
              <div 
                key={m.days}
                className={`p-4 rounded-2xl border transition-all ${
                  isUnlocked 
                    ? 'bg-white shadow-xs' 
                    : 'bg-slate-50/70 border-dashed opacity-85'
                }`}
                style={{
                  borderColor: isUnlocked ? theme.colors.primary : theme.colors.cardBorder
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 shadow-xs ${
                        isUnlocked ? '' : 'grayscale'
                      }`}
                      style={{
                        backgroundColor: isUnlocked ? theme.colors.primaryBg : '#F1F5F9'
                      }}
                    >
                      {m.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        {m.label} ({m.days}d)
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                    <span>{bestStreak} of {m.days} days record</span>
                    <span>{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: isUnlocked ? theme.colors.primary : '#94A3B8'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity List */}
      <div 
        className="rounded-3xl p-5 sm:p-6 border shadow-xs space-y-4"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl"
              style={{ backgroundColor: theme.colors.primaryBg }}
            >
              <Camera className="w-4 h-4" style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Recent Verified Completions
              </h3>
              <p className="text-xs text-slate-500">
                Latest photo evidence proving your daily habits
              </p>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('gallery')}
            className="text-xs font-bold hover:underline"
            style={{ color: theme.colors.primary }}
          >
            All Proofs ({totalVerifiedProofs})
          </button>
        </div>

        {recentProofs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentProofs.map((proof) => {
              const formattedDate = parseLocalDate(proof.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });

              return (
                <div
                  key={proof.id}
                  onClick={() => setViewingProof(proof)}
                  className="p-3 rounded-2xl border bg-white shadow-2xs flex items-center gap-3 cursor-pointer hover:scale-[1.01] hover:shadow-xs transition-all group"
                  style={{ borderColor: theme.colors.cardBorder }}
                >
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 shrink-0 relative">
                    <img 
                      src={proof.photoUrl || ''} 
                      alt={proof.habitTitle} 
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.img-fallback')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'img-fallback absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-400 text-xs';
                          fallback.innerHTML = '<span>📷</span>';
                          parent.appendChild(fallback);
                        }
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {proof.sticker && (
                      <span className="absolute bottom-0.5 right-0.5 text-xs">
                        {proof.sticker}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h5 className="font-bold text-slate-900 text-xs truncate">
                      {proof.habitTitle}
                    </h5>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {proof.caption || 'Verified completion'}
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{formattedDate}</span>
                      <ProofCaptureSourceLabel captureSource={proof.captureSource} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div 
            className="p-8 text-center text-xs text-slate-400 rounded-2xl border border-dashed"
            style={{ borderColor: theme.colors.cardBorder }}
          >
            No photo proofs recorded yet. Complete today's habits to start populating your verified timeline!
          </div>
        )}
      </div>
    </div>
  );
};
