import React from 'react';
import { Menu, Flame, Sparkles, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_AVATAR } from '../data/avatars';

export const Navbar: React.FC = () => {
  const {
    theme,
    setIsDrawerOpen,
    user,
    setCurrentScreen,
    setIsNewHabitModalOpen
  } = useApp();

  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md transition-colors duration-300 border-b"
      style={{
        backgroundColor: `${theme.colors.canvasBg}F0`,
        borderColor: `${theme.colors.cardBorder}80`
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Drawer Toggle & App Branding */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={() => setIsDrawerOpen(true)}
            aria-label="Open menu drawer"
            className="p-2 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 text-slate-700 shrink-0"
            style={{
              backgroundColor: theme.colors.cardBg,
              border: `1px solid ${theme.colors.cardBorder}`
            }}
          >
            <Menu className="w-5 h-5" style={{ color: theme.colors.primary }} />
          </button>

          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span
              className="text-lg sm:text-xl select-none animate-bounce shrink-0"
              role="img"
              aria-label={theme.character}
            >
              {theme.badgeEmoji}
            </span>
            <div className="min-w-0">
              <span className="font-bold text-slate-900 tracking-tight text-base sm:text-lg flex items-center gap-1.5 font-display truncate">
                ProofHabit
                <span
                  className="hidden sm:inline-flex text-xs font-semibold px-2 py-0.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: theme.colors.primaryBg,
                    color: theme.colors.primary
                  }}
                >
                  {theme.character}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick Add Habit Button */}
          <button
            onClick={() => setIsNewHabitModalOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl text-white shadow-sm transition-all hover:opacity-95 active:scale-95 shrink-0"
            style={{ backgroundColor: theme.colors.primary }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Habit</span>
          </button>

          {/* Theme Quick Switcher Pill */}
          <button
            onClick={() => setCurrentScreen('settings')}
            title="Change Theme"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105 shrink-0"
            style={{
              backgroundColor: theme.colors.cardBg,
              border: `1px solid ${theme.colors.cardBorder}`,
              color: theme.colors.primary
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Theme:</span>
            <span className="font-semibold">{theme.name.split(' ')[0]}</span>
          </button>

          {/* Streak Flame Badge */}
          <button
            type="button"
            onClick={() => setCurrentScreen('streak-details')}
            title="View Streak Details"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm select-none transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            style={{
              backgroundColor: theme.colors.cardBg,
              border: `1.5px solid ${theme.colors.cardBorder}`,
              color: theme.colors.streakColor
            }}
          >
            <Flame className="w-4 h-4 fill-current animate-pulse" />
            <span>{user?.streak || 0}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium hidden sm:inline">Days</span>
          </button>

          {/* User Avatar */}
          <button
            onClick={() => setCurrentScreen('settings')}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 shrink-0"
            style={{ borderColor: theme.colors.primary }}
          >
            <img
              src={user?.avatar || DEFAULT_AVATAR}
              alt={user?.name || 'User'}
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
