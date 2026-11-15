import React from 'react';
import { 
  X, 
  Home, 
  CheckSquare, 
  Image as ImageIcon, 
  Users, 
  Award, 
  Settings as SettingsIcon, 
  LogOut, 
  Palette,
  Flame,
  Camera
} from 'lucide-react';
import { useApp, ScreenType } from '../context/AppContext';
import { DEFAULT_AVATAR } from '../data/avatars';

export const Drawer: React.FC = () => {
  const { 
    isDrawerOpen, 
    setIsDrawerOpen, 
    user, 
    currentScreen, 
    setCurrentScreen, 
    theme, 
    logout,
    habits 
  } = useApp();

  if (!isDrawerOpen) return null;

  const navigateTo = (screen: ScreenType) => {
    setCurrentScreen(screen);
    setIsDrawerOpen(false);
  };

  const navLinks = [
    { screen: 'home' as ScreenType, label: 'Home', icon: Home, count: null },
    { screen: 'streak-details' as ScreenType, label: 'Streak Details', icon: Flame, count: `${user?.streak || 0}d` },
    { screen: 'my-habits' as ScreenType, label: 'My Habits', icon: CheckSquare, count: `${habits.length}` },
    { screen: 'gallery' as ScreenType, label: 'Photo Gallery', icon: ImageIcon, count: `${user?.totalProofs || 0}` },
    { screen: 'friends' as ScreenType, label: 'Friends & Leaderboard', icon: Users, count: null },
    { screen: 'recap' as ScreenType, label: 'Monthly Recap', icon: Award, count: null },
    { screen: 'settings' as ScreenType, label: 'Settings & Themes', icon: SettingsIcon, count: null },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer Container */}
      <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300 animate-in slide-in-from-left">
        {/* Profile Summary Header */}
        <div 
          className="p-5 border-b relative"
          style={{
            backgroundColor: theme.colors.primaryBg,
            borderColor: theme.colors.cardBorder
          }}
        >
          <button
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Close menu"
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={user?.avatar || DEFAULT_AVATAR} 
                alt={user?.name || 'Profile'}
                className="w-14 h-14 rounded-2xl object-cover shadow-sm border-2 border-white/60"
              />
              <span className="absolute -bottom-1 -right-1 text-sm select-none">
                {theme.badgeEmoji}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 truncate text-base">{user?.name || 'Guest User'}</h3>
              <p className="text-xs text-slate-500 truncate">{user?.email || 'guest@example.com'}</p>
              <div className="mt-1 flex items-center gap-2">
                <span 
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: theme.colors.cardBg,
                    color: theme.colors.primary,
                    border: `1px solid ${theme.colors.cardBorder}`
                  }}
                >
                  Level {user?.level || 1} Hero
                </span>
                <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-0.5">
                  <Flame className="w-3 h-3 fill-current" />
                  {user?.streak || 0}d
                </span>
              </div>
            </div>
          </div>

          {/* Emotional Proof Stat Banner */}
          <div 
            className="mt-4 p-2.5 rounded-xl bg-white/80 backdrop-blur-xs flex items-center justify-between text-xs"
            style={{ border: `1px solid ${theme.colors.cardBorder}90` }}
          >
            <div className="flex items-center gap-2 text-slate-700">
              <Camera className="w-4 h-4" style={{ color: theme.colors.primary }} />
              <span className="font-medium">Visual Proofs</span>
            </div>
            <span className="font-bold text-slate-900">{user?.totalProofs || 0} photos logged</span>
          </div>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navLinks.map((link) => {
            const isActive = currentScreen === link.screen;
            const Icon = link.icon;

            return (
              <button
                key={link.screen}
                onClick={() => navigateTo(link.screen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'font-semibold shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
                style={{
                  backgroundColor: isActive ? theme.colors.primaryBg : undefined,
                  color: isActive ? theme.colors.primary : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                  <span>{link.label}</span>
                </div>
                {link.count && (
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      backgroundColor: isActive ? 'white' : '#F1F5F9',
                      color: isActive ? theme.colors.primary : '#64748B'
                    }}
                  >
                    {link.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Theme Switcher Shortcut */}
          <div className="pt-3 pb-1">
            <div className="px-3 text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-2">
              Active Theme
            </div>
            <button
              onClick={() => navigateTo('settings')}
              className="w-full p-2.5 rounded-xl border flex items-center gap-2.5 text-left transition-all hover:border-slate-300"
              style={{
                backgroundColor: theme.colors.canvasBg,
                borderColor: theme.colors.cardBorder
              }}
            >
              <span className="text-xl">{theme.badgeEmoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>{theme.name}</span>
                  <Palette className="w-3.5 h-3.5 text-slate-600" />
                </div>
                <div className="text-[11px] text-slate-600 truncate">{theme.character} · Pastel UI</div>
              </div>
            </button>
          </div>
        </div>

        {/* Theme Inspiration Footer & Log Out */}
        <div 
          className="p-4 border-t space-y-3"
          style={{ 
            borderColor: theme.colors.cardBorder,
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))'
          }}
        >
          {/* Theme Quote Card */}
          <div 
            className="p-3 rounded-xl text-xs italic text-slate-600 relative overflow-hidden"
            style={{ backgroundColor: theme.colors.primaryBg }}
          >
            <p className="relative z-10 leading-relaxed font-medium text-slate-700">
              {theme.quote}
            </p>
            <span className="absolute -bottom-2 -right-2 text-2xl opacity-30 select-none">
              {theme.badgeEmoji}
            </span>
          </div>

          <button
            onClick={() => {
              setIsDrawerOpen(false);
              logout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
