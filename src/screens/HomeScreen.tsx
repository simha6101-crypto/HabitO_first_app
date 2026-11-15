import React from 'react';
import { Plus, Sparkles, Flame, Camera, ArrowRight } from 'lucide-react';
import { useApp, getTodayDate } from '../context/AppContext';
import { WeeklyDateStrip } from '../components/WeeklyDateStrip';
import { HabitCard } from '../components/HabitCard';

export const HomeScreen: React.FC = () => {
  const { 
    habits, 
    theme, 
    user, 
    setIsNewHabitModalOpen, 
    setCurrentScreen,
    selectedDate 
  } = useApp();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Hero';
  const activeHabits = habits.filter(habit => !habit.isPaused);

  // Count habits with proof on selectedDate
  const completedToday = activeHabits.filter(h => 
    h.proofs.some(p => p.date === selectedDate)
  ).length;

  const isSelectedToday = selectedDate === '2026-10-03' || selectedDate === getTodayDate();

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Greeting Header & Theme Banner */}
      <div 
        className="rounded-2xl sm:rounded-3xl p-4 sm:p-6 border relative overflow-hidden transition-all shadow-xs"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder,
        }}
      >
        {/* Background Pastel Aura */}
        <div 
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full blur-2xl opacity-40 pointer-events-none"
          style={{ backgroundColor: theme.colors.primaryBg }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl select-none animate-pulse">{theme.badgeEmoji}</span>
              <span 
                className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: theme.colors.primaryBg,
                  color: theme.colors.primary
                }}
              >
                {theme.category} · {theme.name}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Good day, {firstName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg">
              Every habit verified with real visual proof. You have completed{' '}
              <strong className="text-slate-900 font-bold">{completedToday} of {activeHabits.length}</strong>{' '}
              habits for {isSelectedToday ? 'today' : selectedDate}.
            </p>
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewHabitModalOpen(true)}
              className="px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs font-bold text-white shadow-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shrink-0"
              style={{
                backgroundColor: theme.colors.primary,
                boxShadow: `0 4px 14px ${theme.colors.cardBorder}`
              }}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add Habit</span>
            </button>
          </div>
        </div>

        {/* Theme Motivational Quote Banner */}
        <div 
          className="mt-4 pt-3 border-t flex items-center justify-between gap-2 text-xs italic"
          style={{ borderColor: `${theme.colors.cardBorder}70`, color: theme.colors.primary }}
        >
          <div className="flex items-center gap-2 truncate">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{theme.quote}</span>
          </div>
          <button
            onClick={() => setCurrentScreen('settings')}
            className="text-[11px] font-semibold underline not-italic shrink-0 hover:opacity-80"
          >
            Change Theme
          </button>
        </div>
      </div>

      {/* Interactive Streak Details Card */}
      <div 
        onClick={() => setCurrentScreen('streak-details')}
        className="p-3.5 sm:p-4 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-md group shadow-2xs"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div 
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shadow-xs shrink-0"
            style={{ 
              backgroundColor: `${theme.colors.streakColor}15`, 
              color: theme.colors.streakColor 
            }}
          >
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-current animate-pulse" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-base sm:text-lg font-black text-slate-900 font-display truncate">
                {user?.streak || 0}-Day Streak
              </span>
              <span 
                className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0"
                style={{ 
                  backgroundColor: `${theme.colors.streakColor}15`, 
                  color: theme.colors.streakColor 
                }}
              >
                Streak HQ
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate">
              Tap to view full monthly calendar, consistency analytics & milestones
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-slate-800 transition-colors shrink-0">
          <span className="hidden sm:inline">View Details</span>
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>

      {/* Weekly Date Strip */}
      <WeeklyDateStrip />

      {/* Habits Grid Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 truncate">
            <span>Today's Habit Proofs</span>
            <span 
              className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
              style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
            >
              {activeHabits.length}
            </span>
          </h2>
          <p className="text-xs text-slate-500 truncate">
            Tap "+ Photo Proof" or the camera to verify your progress
          </p>
        </div>

        <button
          onClick={() => setCurrentScreen('gallery')}
          className="text-xs font-semibold flex items-center gap-1 hover:underline shrink-0"
          style={{ color: theme.colors.primary }}
        >
          <span>View Photo Gallery</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Habit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} />
        ))}
      </div>

      {/* Emotional Payoff Gallery Teaser Card */}
      <div 
        className="p-4 sm:p-5 rounded-2xl sm:rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 cursor-pointer transition-all hover:scale-[1.01]"
        onClick={() => setCurrentScreen('gallery')}
        style={{
          backgroundColor: theme.colors.primaryBg,
          borderColor: theme.colors.cardBorder
        }}
      >
        <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
          <div 
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center bg-white shadow-xs shrink-0"
          >
            <Camera className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.colors.primary }} />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">
              Your Visual Proof Gallery
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              {user?.totalProofs || 0} photo proofs logged this month. Look back and celebrate your visual journey!
            </p>
          </div>
        </div>

        <button
          className="px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold bg-white text-slate-900 shadow-xs border flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
          style={{ borderColor: theme.colors.cardBorder }}
        >
          <span>Open Gallery</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
