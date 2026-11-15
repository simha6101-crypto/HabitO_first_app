import React, { useState } from 'react';
import { 
  Palette, 
  Settings as SettingsIcon, 
  Bell, 
  Volume2, 
  Camera, 
  Users, 
  Download, 
  RotateCcw, 
  Check, 
  Sparkles,
  User,
  Heart,
  LogOut,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { THEMES } from '../themes';
import { ThemeId } from '../types';
import { DEFAULT_AVATAR } from '../data/avatars';
import { ProfilePictureStudioModal } from '../components/ProfilePictureStudioModal';

export const SettingsScreen: React.FC = () => {
  const { 
    theme, 
    setThemeId, 
    user, 
    updateUserBio, 
    settings, 
    updateSettings, 
    resetAllData,
    logout,
    habits,
    appearance,
    setAppearance,
    isDarkMode
  } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserBio(name, bio);
    setIsSaved(true);
    setIsEditingProfile(false);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExportData = () => {
    const data = {
      user,
      habits,
      settings,
      themeId: theme.id,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `proofhabit-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Profile Summary Card */}
      <div 
        className="rounded-3xl p-5 sm:p-6 border relative overflow-hidden shadow-xs"
        style={{
          backgroundColor: theme.colors.cardBg,
          borderColor: theme.colors.cardBorder
        }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative group">
            <img 
              src={user?.avatar || DEFAULT_AVATAR} 
              alt={user?.name || 'User'} 
              className="w-20 h-20 rounded-3xl object-cover border-2 shadow-sm"
              style={{ borderColor: theme.colors.primary }}
            />
            <span className="absolute -bottom-1 -right-1 text-2xl select-none">
              {theme.badgeEmoji}
            </span>
            <button
              type="button"
              onClick={() => setIsStudioOpen(true)}
              className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
              title="Change Profile Picture"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 min-w-0 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-slate-900">{user?.name || 'Habit Hero'}</h1>
                <span 
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full inline-block"
                  style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
                >
                  Level {user?.level || 1} Hero · {theme.name}
                </span>
              </div>

              <div className="flex items-center justify-center gap-2">
                {isSaved && (
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                  style={{ borderColor: theme.colors.cardBorder }}
                >
                  {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {!isEditingProfile ? (
              <>
                <p className="text-xs text-slate-600 max-w-md">
                  {user?.bio || 'Documenting daily consistency with photo evidence!'}
                </p>
                <div className="text-[11px] text-slate-600 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                  <span>{user?.email || 'guest@example.com'}</span>
                  <span>·</span>
                  <span>{user?.totalProofs || 0} Photos Logged</span>
                </div>
                <div className="pt-1.5 flex justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={() => setIsStudioOpen(true)}
                    className="px-3 py-1.5 rounded-xl border text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-1.5"
                    style={{ borderColor: theme.colors.cardBorder }}
                  >
                    <Camera className="w-3.5 h-3.5" style={{ color: theme.colors.primary }} />
                    <span>Change Profile Picture</span>
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleProfileSubmit} className="pt-2 space-y-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-1"
                    style={{ borderColor: theme.colors.cardBorder }}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700">Hero Bio</label>
                  <textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border text-xs focus:outline-none focus:ring-1"
                    style={{ borderColor: theme.colors.cardBorder }}
                  />
                </div>
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsStudioOpen(true)}
                    className="px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 active:scale-95 shadow-2xs"
                    style={{
                      borderColor: theme.colors.cardBorder,
                      backgroundColor: theme.colors.primaryBg,
                      color: theme.colors.primary
                    }}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Change Profile Picture</span>
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-95"
                    style={{ backgroundColor: theme.colors.primary }}
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* APPEARANCE SECTION (LIGHT / DARK / SYSTEM) */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-xl"
              style={{ backgroundColor: theme.colors.primaryBg }}
            >
              <Moon className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                APPEARANCE
              </h2>
              <p className="text-xs text-slate-500">
                Choose light mode, dark mode, or follow your system theme
              </p>
            </div>
          </div>

          <div 
            className="px-3 py-1 rounded-full text-xs font-bold border capitalize"
            style={{
              backgroundColor: theme.colors.primaryBg,
              borderColor: theme.colors.cardBorder,
              color: theme.colors.primary
            }}
          >
            Mode: {appearance}
          </div>
        </div>

        {/* 3 Appearance Mode Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              id: 'light' as const,
              label: 'Light',
              description: 'Crisp pastel surfaces & clean light background',
              icon: Sun
            },
            {
              id: 'dark' as const,
              label: 'Dark',
              description: 'Polished charcoal/navy surfaces & soft borders',
              icon: Moon
            },
            {
              id: 'system' as const,
              label: 'System',
              description: 'Automatically adapts to device color scheme',
              icon: Monitor
            }
          ].map((modeOption) => {
            const isSelected = appearance === modeOption.id;
            const Icon = modeOption.icon;

            return (
              <button
                key={modeOption.id}
                type="button"
                onClick={() => setAppearance(modeOption.id)}
                className={`p-4 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected ? 'ring-2 shadow-md' : 'hover:border-slate-300'
                }`}
                style={{
                  backgroundColor: theme.colors.cardBg,
                  borderColor: isSelected ? theme.colors.primary : theme.colors.cardBorder,
                  boxShadow: isSelected ? `0 0 0 2px ${theme.colors.primary}` : undefined
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-xs"
                    style={{
                      backgroundColor: isSelected ? theme.colors.primary : theme.colors.primaryBg,
                      color: isSelected ? '#FFFFFF' : theme.colors.primary
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  {isSelected && (
                    <div 
                      className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: theme.colors.primary }}
                    >
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Active</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="font-bold text-slate-900 text-sm">{modeOption.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-snug">{modeOption.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* CHANGE THEME SECTION (DISNEY & MARVEL PASTEL THEMES) */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="p-2 rounded-xl"
              style={{ backgroundColor: theme.colors.primaryBg }}
            >
              <Palette className="w-5 h-5" style={{ color: theme.colors.primary }} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                CHANGE THEME
              </h2>
              <p className="text-xs text-slate-500">
                Choose your favorite Disney or Marvel pastel aesthetic with cute stickers & quotes
              </p>
            </div>
          </div>

          <div 
            className="px-3 py-1 rounded-full text-xs font-bold border"
            style={{
              backgroundColor: theme.colors.primaryBg,
              borderColor: theme.colors.cardBorder,
              color: theme.colors.primary
            }}
          >
            Active: {theme.character}
          </div>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(THEMES).map((th) => {
            const isSelected = theme.id === th.id;

            return (
              <div
                key={th.id}
                className="space-y-2"
              >
                {/* Short Quotation Above Each Theme */}
                <div 
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold italic flex items-center gap-2 border transition-all"
                  style={{
                    backgroundColor: isSelected
                      ? th.colors.primaryBg
                      : isDarkMode ? 'rgba(255, 255, 255, 0.06)' : '#F8FAFC',
                    borderColor: isSelected
                      ? th.colors.primary
                      : isDarkMode ? 'rgba(255, 255, 255, 0.14)' : '#E2E8F0',
                    color: isSelected ? th.colors.primary : isDarkMode ? '#CBD5E1' : '#64748B'
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span className="leading-snug">{th.quote}</span>
                </div>

                {/* Theme Selection Card */}
                <div
                  onClick={() => setThemeId(th.id)}
                  className={`p-4 sm:p-5 rounded-3xl border bg-white shadow-xs cursor-pointer transition-all duration-300 relative overflow-hidden hover:scale-[1.02] ${
                    isSelected ? 'ring-2 shadow-md' : 'hover:border-slate-300'
                  }`}
                  style={{
                    borderColor: isSelected ? th.colors.primary : th.colors.cardBorder,
                    boxShadow: isSelected ? `0 0 0 2px ${th.colors.primary}` : undefined
                  }}
                >
                  {/* Category Pill & Selection Indicator */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: th.colors.primaryBg,
                        color: th.colors.primary
                      }}
                    >
                      {th.category} · {th.character}
                    </span>

                    {isSelected ? (
                      <div 
                        className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: th.colors.primary }}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Active Theme</span>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-600">
                        Tap to apply
                      </span>
                    )}
                  </div>

                  {/* Character Name & Mascot Stickers */}
                  <div className="flex items-center gap-3 my-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs"
                      style={{ backgroundColor: th.colors.primaryBg }}
                    >
                      {th.badgeEmoji}
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-base">{th.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">{th.description}</p>
                    </div>
                  </div>

                  {/* Cute Theme Stickers Strip */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Included Theme Stickers:
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {th.stickers.map((stk) => (
                        <span 
                          key={stk.name}
                          className="px-2 py-0.5 rounded-full text-xs border flex items-center gap-1"
                          style={{
                            backgroundColor: th.colors.pillBg,
                            borderColor: th.colors.cardBorder
                          }}
                        >
                          <span>{stk.emoji}</span>
                          <span
                            className="text-[10px] font-medium text-slate-700"
                            style={isDarkMode ? { color: '#0F172A' } : undefined}
                          >
                            {stk.name}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pastel Color Swatches Preview */}
                  <div
                    className="mt-3 pt-3 border-t flex items-center justify-between text-xs"
                    style={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.12)' : '#F1F5F9' }}
                  >
                    <span className="text-[11px] text-slate-600 font-medium">Pastel Palette:</span>
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="w-5 h-5 rounded-full shadow-xs border border-black/10" 
                        style={{ backgroundColor: th.colors.primary }}
                        title="Primary Color"
                      />
                      <span 
                        className="w-5 h-5 rounded-full shadow-xs border border-black/10" 
                        style={{ backgroundColor: th.colors.primaryBg }}
                        title="Primary Pastel Tint"
                      />
                      <span 
                        className="w-5 h-5 rounded-full shadow-xs border border-black/10" 
                        style={{ backgroundColor: th.colors.secondary }}
                        title="Secondary Pastel"
                      />
                      <span 
                        className="w-5 h-5 rounded-full shadow-xs border border-black/10" 
                        style={{ backgroundColor: th.colors.canvasBg }}
                        title="Canvas Background"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ========================================================= */}
      {/* BASIC APP SETTINGS IN "SETTINGS" SECTION */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div 
            className="p-2 rounded-xl"
            style={{ backgroundColor: theme.colors.primaryBg }}
          >
            <SettingsIcon className="w-5 h-5" style={{ color: theme.colors.primary }} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              SETTINGS
            </h2>
            <p className="text-xs text-slate-500">
              Configure daily reminders, photo proofs, and app data
            </p>
          </div>
        </div>

        <div 
          className="rounded-3xl border bg-white shadow-xs divide-y overflow-hidden"
          style={{ borderColor: theme.colors.cardBorder }}
        >
          {/* Daily Reminder Time */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
              >
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Daily Photo Proof Reminder</h4>
                <p className="text-xs text-slate-500">Alert time to log today's proof before midnight</p>
              </div>
            </div>

            <input 
              type="time"
              value={settings.dailyReminderTime}
              onChange={(e) => updateSettings({ dailyReminderTime: e.target.value })}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold text-slate-800 focus:outline-none"
              style={{ borderColor: theme.colors.cardBorder }}
            />
          </div>

          {/* Sound & Haptics Toggle */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
              >
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Celebration Effects & Confetti</h4>
                <p className="text-xs text-slate-500">Trigger celebratory confetti bursts when logging proofs</p>
              </div>
            </div>

            <button
              onClick={() => updateSettings({ soundEffects: !settings.soundEffects })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.soundEffects ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* High Res Photos */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
              >
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">High-Fidelity Photo Proofs</h4>
                <p className="text-xs text-slate-500">Store camera snapshots in full quality for monthly recaps</p>
              </div>
            </div>

            <button
              onClick={() => updateSettings({ highResPhotos: !settings.highResPhotos })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.highResPhotos ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Public Leaderboard */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
              >
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Friends Leaderboard Sharing</h4>
                <p className="text-xs text-slate-500">Allow friends to view your streaks and latest photo proofs</p>
              </div>
            </div>

            <button
              onClick={() => updateSettings({ publicLeaderboard: !settings.publicLeaderboard })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                settings.publicLeaderboard ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-white shadow-xs" />
            </button>
          </div>

          {/* Backup / Export Data */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: theme.colors.primaryBg, color: theme.colors.primary }}
              >
                <Download className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Backup & Export All Data</h4>
                <p className="text-xs text-slate-500">Download your habits, gallery photos, and settings as JSON</p>
              </div>
            </div>

            <button
              onClick={handleExportData}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              style={{ borderColor: theme.colors.cardBorder }}
            >
              Export
            </button>
          </div>

          {/* Reset Demo Data */}
          <div className="p-4 sm:p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <RotateCcw className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-rose-700">Reset Demo Data</h4>
                <p className="text-xs text-slate-500">Restore default starter habits, settings, and stats</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (confirm('Are you sure you want to reset all data back to original demo state?')) {
                  resetAllData();
                }
              }}
              className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Account Log Out */}
      <div className="pt-2 flex justify-center">
        <button
          onClick={logout}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl border text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all shadow-xs"
          style={{ borderColor: '#FECDD3' }}
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out of ProofHabit</span>
        </button>
      </div>

      {/* Profile Picture Studio Modal */}
      <ProfilePictureStudioModal 
        isOpen={isStudioOpen} 
        onClose={() => setIsStudioOpen(false)} 
      />
    </div>
  );
};
