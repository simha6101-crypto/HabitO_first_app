import React from 'react';
import { Home, Image as ImageIcon, Award, Users } from 'lucide-react';
import { useApp, ScreenType } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { currentScreen, setCurrentScreen, theme } = useApp();

  const navItems: { screen: ScreenType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { screen: 'home', label: 'Home', icon: Home },
    { screen: 'gallery', label: 'Gallery', icon: ImageIcon },
    { screen: 'recap', label: 'Recap', icon: Award },
    { screen: 'friends', label: 'Friends', icon: Users },
  ];

  return (
    <div 
      className="fixed inset-x-0 z-40 flex justify-center pointer-events-none px-3 sm:px-4"
      style={{
        bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <nav 
        aria-label="Bottom Navigation"
        className="pointer-events-auto flex items-center gap-1 sm:gap-1.5 p-1.5 rounded-full shadow-lg backdrop-blur-xl border transition-all duration-300 max-w-full"
        style={{
          backgroundColor: `${theme.colors.cardBg}F5`,
          borderColor: theme.colors.cardBorder,
          boxShadow: `0 10px 25px -5px ${theme.colors.cardBorder}90, 0 8px 10px -6px rgba(0, 0, 0, 0.05)`
        }}
      >
        {navItems.map((item) => {
          const isActive = currentScreen === item.screen;
          const Icon = item.icon;

          return (
            <button
              key={item.screen}
              onClick={() => setCurrentScreen(item.screen)}
              className={`relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 shrink-0 ${
                isActive ? 'shadow-sm scale-105' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
              style={{
                backgroundColor: isActive ? theme.colors.primaryBg : 'transparent',
                color: isActive ? theme.colors.primary : undefined,
              }}
            >
              <Icon className="w-4 h-4 stroke-[2.2] shrink-0" />
              <span className={`tracking-wide ${isActive ? 'inline font-bold' : 'hidden sm:inline'}`}>
                {item.label}
              </span>

              {/* Tiny theme sticker badge when active */}
              {isActive && (
                <span className="text-[11px] leading-none select-none shrink-0">
                  {theme.badgeEmoji}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
