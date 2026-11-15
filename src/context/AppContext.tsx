import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ThemeId,
  ThemeConfig,
  Habit,
  UserProfile,
  PhotoProof,
  Friend,
  HabitChallenge,
  AppSettings,
  AppearanceMode,
  PhotoCaptureSource
} from '../types';
import { THEMES, getThemeConfig } from '../themes';
import { DEFAULT_AVATAR, BUILTIN_AVATARS } from '../data/avatars';
import {
  INITIAL_USER,
  INITIAL_HABITS,
  INITIAL_FRIENDS,
  INITIAL_CHALLENGES,
  INITIAL_SETTINGS,
  SEEDED_DEMO_PROOF_IDS
} from '../data/initialData';

export type ScreenType = 'home' | 'gallery' | 'recap' | 'friends' | 'settings' | 'my-habits' | 'streak-details';

interface AppContextType {
  // Theme
  themeId: ThemeId;
  theme: ThemeConfig;
  setThemeId: (id: ThemeId) => void;

  // Appearance / Dark Mode
  appearance: AppearanceMode;
  setAppearance: (mode: AppearanceMode) => void;
  isDarkMode: boolean;

  // Navigation
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;

  // Auth / User
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  guestLogin: () => void;
  updateUserBio: (name: string, bio: string) => void;
  updateUserAvatar: (avatarUrl: string) => void;

  // Date Strip Selection
  selectedDate: string; // YYYY-MM-DD
  setSelectedDate: (date: string) => void;

  // Habits & Proofs
  habits: Habit[];
  addHabit: (habitData: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'createdAt' | 'proofs'>) => void;
  updateHabit: (habitId: string, habitData: Pick<Habit, 'title' | 'category' | 'icon' | 'cadence' | 'targetDaysPerWeek' | 'color'>) => void;
  toggleHabitPaused: (habitId: string) => void;
  deleteHabit: (habitId: string) => void;
  addPhotoProof: (habitId: string, photoUrl: string, caption: string, sticker?: string, captureSource?: PhotoCaptureSource, imageHash?: string) => void;
  deletePhotoProof: (proofId: string) => void;

  // Modals
  photoModalHabitId: string | null;
  openPhotoCapture: (habitId: string) => void;
  closePhotoCapture: () => void;

  viewingProof: PhotoProof | null;
  setViewingProof: (proof: PhotoProof | null) => void;

  isNewHabitModalOpen: boolean;
  setIsNewHabitModalOpen: (open: boolean) => void;
  editingHabit: Habit | null;
  openHabitEditor: (habit: Habit) => void;

  // Challenges & Friends
  challenges: HabitChallenge[];
  toggleJoinChallenge: (challengeId: string) => void;
  friends: Friend[];
  addFriend: (name: string) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  resetAllData: () => void;

  // Celebrations
  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'proofhabit_v1_';

// ==========================================
// DATE & STREAK CALCULATION ENGINE
// ==========================================

export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

export function formatLocalDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDays(dateStr: string, days: number): string {
  const date = parseLocalDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatLocalDate(date);
}

export function diffDays(dateStr1: string, dateStr2: string): number {
  const d1 = parseLocalDate(dateStr1).getTime();
  const d2 = parseLocalDate(dateStr2).getTime();
  return Math.round((d1 - d2) / 86400000);
}

export function isWeekday(dateStr: string): boolean {
  const day = parseLocalDate(dateStr).getDay();
  return day >= 1 && day <= 5;
}

export function getPreviousScheduledWeekday(dateStr: string): string {
  let prev = addDays(dateStr, -1);
  while (!isWeekday(prev)) {
    prev = addDays(prev, -1);
  }
  return prev;
}

export function getLastScheduledWeekday(asOfDate: string): string {
  let cur = asOfDate;
  while (!isWeekday(cur)) {
    cur = addDays(cur, -1);
  }
  return cur;
}

export function getTodayDate(selectedDate?: string): string {
  const localToday = formatLocalDate(new Date());
  if (localToday < '2026-10-03') {
    return '2026-10-03';
  }
  return localToday;
}

function isHabitPausedOn(habit: Habit, date: string): boolean {
  return habit.pausePeriods?.some(({ startedAt, endedAt }) =>
    date >= startedAt && (!endedAt || date <= endedAt)
  ) ?? false;
}

function getPreviousActiveScheduledDate(habit: Habit, date: string): string {
  let previous = addDays(date, -1);
  const earliestDate = habit.createdAt ? addDays(habit.createdAt, -14) : addDays(date, -365);
  while (
    previous >= earliestDate &&
    ((habit.cadence === 'weekdays' && !isWeekday(previous)) ||
    isHabitPausedOn(habit, previous))
  ) {
    previous = addDays(previous, -1);
  }
  return previous;
}

function getStreakStartDate(habit: Habit, dateSet: Set<string>, asOfDate: string): string | null {
  let candidate = asOfDate;
  const earliestDate = habit.createdAt ? addDays(habit.createdAt, -14) : addDays(asOfDate, -365);
  while (
    candidate >= earliestDate &&
    ((habit.cadence === 'weekdays' && !isWeekday(candidate)) ||
    isHabitPausedOn(habit, candidate))
  ) {
    candidate = addDays(candidate, -1);
  }

  if (dateSet.has(candidate)) return candidate;

  const previous = getPreviousActiveScheduledDate(habit, candidate);
  return dateSet.has(previous) ? previous : null;
}

function activeGapDays(habit: Habit, newerDate: string, olderDate: string): number {
  let pausedDays = 0;
  for (let date = addDays(olderDate, 1); date <= newerDate; date = addDays(date, 1)) {
    if (isHabitPausedOn(habit, date)) pausedDays++;
  }
  return diffDays(newerDate, olderDate) - pausedDays;
}

export function calculateHabitStreak(
  habit: Habit,
  asOfDate: string = getTodayDate()
): { currentStreak: number; bestStreak: number } {
  // Only completed dates up to asOfDate are eligible for streak calculation.
  // This prevents future dates from accidentally inflating completed-day streaks.
  const uniqueDates = Array.from(new Set(habit.proofs.map(p => p.date)))
    .filter(d => d <= asOfDate)
    .sort();
  if (uniqueDates.length === 0) {
    return { currentStreak: 0, bestStreak: habit.bestStreak || 0 };
  }

  const dateSet = new Set(uniqueDates);
  let currentStreak = 0;
  let maxHistoricalRun = 0;

  if (habit.cadence === 'weekdays') {
    // Current streak
    const start = getStreakStartDate(habit, dateSet, asOfDate);

    if (start) {
      let check = start;
      while (dateSet.has(check)) {
        currentStreak++;
        check = getPreviousActiveScheduledDate(habit, check);
      }
    }

    // Historical longest streak for weekdays
    let run = 0;
    let prev: string | null = null;
    for (const d of uniqueDates) {
      if (!prev) {
        run = 1;
      } else {
        const expectedPrev = getPreviousActiveScheduledDate(habit, d);
        if (prev === expectedPrev || prev === addDays(d, -1) || (prev >= expectedPrev && prev < d)) {
          run++;
        } else {
          run = 1;
        }
      }
      if (run > maxHistoricalRun) maxHistoricalRun = run;
      prev = d;
    }
  } else if (habit.cadence === 'custom') {
    const target = Math.min(6, Math.max(1, habit.targetDaysPerWeek || 3));
    const maxGap = Math.max(1, 7 - target + 1);

    // Filter proofs up to asOfDate
    const proofsUpToAsOf = uniqueDates.filter(d => d <= asOfDate);
    if (proofsUpToAsOf.length > 0) {
      const latest = proofsUpToAsOf[proofsUpToAsOf.length - 1];
      if (activeGapDays(habit, asOfDate, latest) <= maxGap) {
        currentStreak = 1;
        let curr = latest;
        for (let i = proofsUpToAsOf.length - 2; i >= 0; i--) {
          const prev = proofsUpToAsOf[i];
          const gap = activeGapDays(habit, curr, prev);
          if (gap <= maxGap && gap >= 0) {
            currentStreak++;
            curr = prev;
          } else {
            break;
          }
        }
      }
    }

    // Historical longest streak for custom
    let run = 0;
    let prev: string | null = null;
    for (const d of uniqueDates) {
      if (!prev) {
        run = 1;
      } else {
        const gap = activeGapDays(habit, d, prev);
        if (gap <= maxGap && gap >= 0) {
          run++;
        } else {
          run = 1;
        }
      }
      if (run > maxHistoricalRun) maxHistoricalRun = run;
      prev = d;
    }
  } else {
    // Default: 'daily'
    const start = getStreakStartDate(habit, dateSet, asOfDate);

    if (start) {
      let check = start;
      while (dateSet.has(check)) {
        currentStreak++;
        check = getPreviousActiveScheduledDate(habit, check);
      }
    }

    // Historical longest streak for daily
    let run = 0;
    let prev: string | null = null;
    for (const d of uniqueDates) {
      if (prev && (getPreviousActiveScheduledDate(habit, d) === prev || addDays(prev, 1) === d)) {
        run++;
      } else {
        run = 1;
      }
      if (run > maxHistoricalRun) maxHistoricalRun = run;
      prev = d;
    }
  }

  const bestStreak = Math.max(habit.bestStreak || 0, maxHistoricalRun, currentStreak);
  return { currentStreak, bestStreak };
}

export function calculateUserStreak(
  habits: Habit[],
  asOfDate: string = getTodayDate()
): { currentStreak: number; longestStreak: number } {
  // Only completed dates up to asOfDate are eligible for streak calculation
  const allDates = Array.from(
    new Set(habits.flatMap(h => h.proofs.map(p => p.date)))
  ).filter(d => d <= asOfDate).sort();

  if (allDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dateSet = new Set(allDates);
  const yesterday = addDays(asOfDate, -1);

  let start: string | null = null;
  if (dateSet.has(asOfDate)) {
    start = asOfDate;
  } else if (dateSet.has(yesterday)) {
    start = yesterday;
  }

  let currentStreak = 0;
  if (start) {
    let check = start;
    while (dateSet.has(check)) {
      currentStreak++;
      check = addDays(check, -1);
    }
  }

  let longestStreak = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of allDates) {
    if (prev && addDays(prev, 1) === d) {
      run++;
    } else {
      run = 1;
    }
    if (run > longestStreak) longestStreak = run;
    prev = d;
  }

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Appearance state: 'light' | 'dark' | 'system'
  // Appearance state: 'light' | 'dark' | 'system'
  const [appearance, setAppearanceState] = useState<AppearanceMode>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}appearance`);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved as AppearanceMode;
      }
    } catch (e) {
      console.warn('LocalStorage error reading appearance:', e);
    }
    return 'system';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      setSystemPrefersDark(e.matches);
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isDarkMode = appearance === 'dark' || (appearance === 'system' && systemPrefersDark);

  // Theme state (default to Spiderman or stored)
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}theme`);
      return (saved && THEMES[saved as ThemeId]) ? (saved as ThemeId) : 'spiderman';
    } catch (e) {
      console.warn('LocalStorage error reading theme:', e);
      return 'spiderman';
    }
  });

  const theme = React.useMemo(() => getThemeConfig(themeId, isDarkMode), [themeId, isDarkMode]);

  const setThemeId = (newId: ThemeId) => {
    setThemeIdState(newId);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}theme`, newId);
    } catch (err) {
      console.warn('Failed to save theme to localStorage:', err);
    }
    triggerCelebration();
  };

  const setAppearance = (mode: AppearanceMode) => {
    setAppearanceState(mode);
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}appearance`, mode);
    } catch (err) {
      console.warn('Failed to save appearance to localStorage:', err);
    }
  };

  // Nav state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Auth state
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}user`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          // If previous storage recorded the legacy seeded 38 demo proofs, initialize to 0
          let safeTotalProofs = typeof parsed.totalProofs === 'number' ? parsed.totalProofs : INITIAL_USER.totalProofs;
          if (safeTotalProofs === 38) {
            safeTotalProofs = 0;
          }

          return {
            ...INITIAL_USER,
            ...parsed,
            avatar: (!parsed.avatar || parsed.avatar.includes('images.unsplash.com/photo-1534528741775-53994a69daeb'))
              ? DEFAULT_AVATAR
              : parsed.avatar,
            badges: Array.isArray(parsed.badges) ? parsed.badges : INITIAL_USER.badges,
            streak: typeof parsed.streak === 'number' ? parsed.streak : INITIAL_USER.streak,
            totalProofs: safeTotalProofs
          };
        }
      }
    } catch (e) {
      console.warn('LocalStorage error reading user:', e);
    }
    return INITIAL_USER; // Default logged in for instant seamless demo, can log out
  });

  const updateUserAvatar = (avatarUrl: string) => {
    setUser(prev => prev ? { ...prev, avatar: avatarUrl } : prev);
    triggerCelebration();
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}auth`);
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  // Selected date (Defaults to 2026-10-03 or current system date)
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-03');

  // Habits state
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}habits`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((h: Partial<Habit>, index: number) => ({
            id: h.id || `h-${index}-${Date.now()}`,
            title: h.title || 'Untitled Habit',
            category: h.category || 'Fitness',
            icon: h.icon || 'dumbbell',
            cadence: h.cadence || 'daily',
            targetDaysPerWeek: typeof h.targetDaysPerWeek === 'number' ? h.targetDaysPerWeek : 7,
            streak: typeof h.streak === 'number' ? h.streak : 0,
            bestStreak: typeof h.bestStreak === 'number' ? h.bestStreak : 0,
            color: h.color || '#EF4444',
            createdAt: h.createdAt || '2026-09-01',
            proofs: Array.isArray(h.proofs) ? h.proofs
              .filter(p => p && p.id && !SEEDED_DEMO_PROOF_IDS.has(p.id))
              .map(p => ({
                ...p,
                likes: typeof p.likes === 'number' ? p.likes : 1
              })) : [],
            isPaused: !!h.isPaused,
            pausePeriods: Array.isArray(h.pausePeriods) ? h.pausePeriods : []
          }));
        }
      }
    } catch (e) {
      console.warn('LocalStorage error reading habits:', e);
    }
    return INITIAL_HABITS;
  });

  // Friends state
  const [friends, setFriends] = useState<Friend[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}friends`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage error reading friends:', e);
    }
    return INITIAL_FRIENDS;
  });

  // Challenges state
  const [challenges, setChallenges] = useState<HabitChallenge[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}challenges`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('LocalStorage error reading challenges:', e);
    }
    return INITIAL_CHALLENGES;
  });

  // Settings state
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return { ...INITIAL_SETTINGS, ...parsed };
        }
      }
    } catch (e) {
      console.warn('LocalStorage error reading settings:', e);
    }
    return INITIAL_SETTINGS;
  });

  // Modals
  const [photoModalHabitId, setPhotoModalHabitId] = useState<string | null>(null);
  const [viewingProof, setViewingProof] = useState<PhotoProof | null>(null);
  const [isNewHabitModalOpen, setIsNewHabitModalOpenState] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  const setIsNewHabitModalOpen = (open: boolean) => {
    setIsNewHabitModalOpenState(open);
    if (!open) setEditingHabit(null);
  };

  const openHabitEditor = (habit: Habit) => {
    setEditingHabit(habit);
    setIsNewHabitModalOpenState(true);
  };

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}habits`, JSON.stringify(habits));
    } catch (err) {
      console.warn('Failed to save habits to localStorage (quota may be exceeded):', err);
    }
  }, [habits]);

  // Keep user totalProofs synchronized if legacy demo proof count (38) was present
  useEffect(() => {
    if (user) {
      const actualCount = habits.reduce((acc, h) => acc + (h.proofs?.length || 0), 0);
      if (user.totalProofs !== actualCount && (user.totalProofs === 38 || user.totalProofs > actualCount)) {
        setUser(prev => prev ? { ...prev, totalProofs: actualCount } : null);
      }
    }
  }, [habits]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(`${STORAGE_KEY_PREFIX}user`, JSON.stringify(user));
      }
      localStorage.setItem(`${STORAGE_KEY_PREFIX}auth`, String(isAuthenticated));
    } catch (err) {
      console.warn('Failed to save user/auth to localStorage:', err);
    }
  }, [user, isAuthenticated]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}friends`, JSON.stringify(friends));
    } catch (err) {
      console.warn('Failed to save friends to localStorage:', err);
    }
  }, [friends]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
    } catch (err) {
      console.warn('Failed to save settings to localStorage:', err);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY_PREFIX}challenges`, JSON.stringify(challenges));
    } catch (err) {
      console.warn('Failed to save challenges to localStorage:', err);
    }
  }, [challenges]);

  // Dynamic Theme Styling & Dark Mode applied to root HTML
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    document.body.style.backgroundColor = theme.colors.canvasBg;
    root.style.setProperty('--canvas-bg', theme.colors.canvasBg);
    root.style.setProperty('--card-bg', theme.colors.cardBg);
    root.style.setProperty('--card-border', theme.colors.cardBorder);
    root.style.setProperty('--theme-primary', theme.colors.primary);
    root.style.setProperty('--theme-primary-bg', theme.colors.primaryBg);
  }, [isDarkMode, theme]);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: [theme.colors.primary, theme.colors.secondary, '#FDE047', '#A7F3D0']
      });
    } catch {
      // safe fallback
    }
  };

  const login = async (email: string) => {
    const existingName = email.split('@')[0];
    const loggedUser: UserProfile = {
      ...INITIAL_USER,
      email,
      name: existingName.charAt(0).toUpperCase() + existingName.slice(1)
    };
    setUser(loggedUser);
    setIsAuthenticated(true);
    triggerCelebration();
    return true;
  };

  const register = async (name: string, email: string) => {
    const newUser: UserProfile = {
      ...INITIAL_USER,
      id: `usr-${Date.now()}`,
      name,
      email,
      bio: 'New hero starting my visual streak journey! 🚀',
      level: 1,
      streak: 1,
      totalProofs: 0
    };
    setUser(newUser);
    setIsAuthenticated(true);
    triggerCelebration();
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const guestLogin = () => {
    setUser(INITIAL_USER);
    setIsAuthenticated(true);
    triggerCelebration();
  };

  const updateUserBio = (name: string, bio: string) => {
    if (user) {
      setUser({ ...user, name, bio });
    }
  };

  const openPhotoCapture = (habitId: string) => {
    if (habits.find(habit => habit.id === habitId)?.isPaused) return;
    setPhotoModalHabitId(habitId);
  };

  const closePhotoCapture = () => {
    setPhotoModalHabitId(null);
  };

  const addHabit = (data: Omit<Habit, 'id' | 'streak' | 'bestStreak' | 'createdAt' | 'proofs'>) => {
    const newHabit: Habit = {
      ...data,
      id: `h-${Date.now()}`,
      streak: 0,
      bestStreak: 0,
      createdAt: selectedDate,
      proofs: []
    };
    setHabits(prev => [newHabit, ...prev]);
    setIsNewHabitModalOpen(false);
    triggerCelebration();
  };

  const updateHabit = (
    habitId: string,
    data: Pick<Habit, 'title' | 'category' | 'icon' | 'cadence' | 'targetDaysPerWeek' | 'color'>
  ) => {
    const refDate = getTodayDate();
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;

      const updatedHabit = { ...habit, ...data };
      const streakResult = calculateHabitStreak(updatedHabit, refDate);
      return {
        ...updatedHabit,
        streak: streakResult.currentStreak,
        bestStreak: streakResult.bestStreak
      };
    }));
    setIsNewHabitModalOpen(false);
  };

  const toggleHabitPaused = (habitId: string) => {
    const today = getTodayDate();
    setHabits(prev => prev.map(habit => {
      if (habit.id !== habitId) return habit;

      if (habit.isPaused) {
        const pausePeriods = (habit.pausePeriods || []).map((period, index, periods) =>
          index === periods.length - 1 && !period.endedAt
            ? { ...period, endedAt: addDays(today, -1) }
            : period
        );
        const resumedHabit = { ...habit, isPaused: false, pausePeriods };
        const streakResult = calculateHabitStreak(resumedHabit, today);
        return {
          ...resumedHabit,
          streak: streakResult.currentStreak,
          bestStreak: streakResult.bestStreak
        };
      }

      const pausedHabit = {
        ...habit,
        isPaused: true,
        pausePeriods: [...(habit.pausePeriods || []), { startedAt: today }]
      };
      const streakResult = calculateHabitStreak(pausedHabit, today);
      return {
        ...pausedHabit,
        streak: streakResult.currentStreak,
        bestStreak: streakResult.bestStreak
      };
    }));
  };

  const deleteHabit = (habitId: string) => {
    const remaining = habits.filter(h => h.id !== habitId);
    setHabits(remaining);

    const refDate = getTodayDate();
    const userStreakData = calculateUserStreak(remaining, refDate);
    const totalProofs = remaining.reduce((acc, h) => acc + h.proofs.length, 0);

    if (user) {
      setUser(prev => prev ? {
        ...prev,
        streak: userStreakData.currentStreak,
        totalProofs
      } : null);
    }

    if (editingHabit?.id === habitId) {
      setEditingHabit(null);
      setIsNewHabitModalOpen(false);
    }
    if (photoModalHabitId === habitId) {
      setPhotoModalHabitId(null);
    }
    if (viewingProof?.habitId === habitId) {
      setViewingProof(null);
    }
  };

  const addPhotoProof = (
    habitId: string,
    photoUrl: string,
    caption: string,
    sticker?: string,
    captureSource?: PhotoCaptureSource,
    imageHash?: string
  ) => {
    const targetHabit = habits.find(h => h.id === habitId);
    if (!targetHabit) return;

    const existingForDate = targetHabit.proofs.find(p => p.date === selectedDate);

    const newProof: PhotoProof = {
      id: existingForDate ? existingForDate.id : `p-${Date.now()}`,
      habitId,
      habitTitle: targetHabit.title,
      photoUrl,
      caption: caption || 'Proof of habit completed! 🔥',
      timestamp: new Date().toISOString(),
      date: selectedDate,
      sticker: sticker || theme.badgeEmoji,
      likes: existingForDate ? existingForDate.likes : 1,
      captureSource,
      imageHash
    };

    const refDate = getTodayDate();

    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        let replaced = false;
        const updatedProofs: PhotoProof[] = [];
        for (const p of habit.proofs) {
          if (p.date === selectedDate) {
            if (!replaced) {
              updatedProofs.push(newProof);
              replaced = true;
            }
          } else {
            updatedProofs.push(p);
          }
        }
        if (!replaced) {
          updatedProofs.unshift(newProof);
        }

        const streakResult = calculateHabitStreak({ ...habit, proofs: updatedProofs }, refDate);

        return {
          ...habit,
          streak: streakResult.currentStreak,
          bestStreak: streakResult.bestStreak,
          proofs: updatedProofs
        };
      }
      return habit;
    });

    setHabits(updatedHabits);

    // Update overall user streak and total proofs based on unique verified dates
    const userStreakData = calculateUserStreak(updatedHabits, refDate);
    const totalProofs = updatedHabits.reduce((acc, h) => acc + h.proofs.length, 0);

    if (user) {
      setUser(prev => prev ? {
        ...prev,
        streak: userStreakData.currentStreak,
        totalProofs
      } : null);
    }

    closePhotoCapture();
    triggerCelebration();
  };

  const deletePhotoProof = (proofId: string) => {
    const refDate = getTodayDate();

    const updatedHabits = habits.map(habit => {
      const hasProof = habit.proofs.some(p => p.id === proofId);
      if (hasProof) {
        const remainingProofs = habit.proofs.filter(p => p.id !== proofId);
        const streakResult = calculateHabitStreak({ ...habit, proofs: remainingProofs }, refDate);
        return {
          ...habit,
          streak: streakResult.currentStreak,
          bestStreak: streakResult.bestStreak,
          proofs: remainingProofs
        };
      }
      return habit;
    });

    setHabits(updatedHabits);

    // Recalculate overall user streak and total proofs from remaining verified dates
    const userStreakData = calculateUserStreak(updatedHabits, refDate);
    const totalProofs = updatedHabits.reduce((acc, h) => acc + h.proofs.length, 0);

    if (user) {
      setUser(prev => prev ? {
        ...prev,
        streak: userStreakData.currentStreak,
        totalProofs
      } : null);
    }

    setViewingProof(null);
  };

  const toggleJoinChallenge = (challengeId: string) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        const nextJoined = !c.joined;
        return {
          ...c,
          joined: nextJoined,
          participantsCount: nextJoined ? c.participantsCount + 1 : c.participantsCount - 1,
          userProgressDays: nextJoined ? 1 : 0
        };
      }
      return c;
    }));
    triggerCelebration();
  };

  const addFriend = (name: string) => {
    const randomAvatar = BUILTIN_AVATARS[Math.floor(Math.random() * BUILTIN_AVATARS.length)].svgDataUri;
    const newFriend: Friend = {
      id: `f-${Date.now()}`,
      name,
      avatar: randomAvatar,
      streak: 1,
      monthlyProofs: 1,
      isOnline: true
    };
    setFriends(prev => [newFriend, ...prev]);
    triggerCelebration();
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetAllData = () => {
    // Only remove keys belonging to ProofHabit using established STORAGE_KEY_PREFIX
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (err) {
      console.warn('Safe localStorage reset error:', err);
    }

    setHabits(INITIAL_HABITS);
    setUser(INITIAL_USER);
    setFriends(INITIAL_FRIENDS);
    setChallenges(INITIAL_CHALLENGES);
    setSettings(INITIAL_SETTINGS);
    setThemeIdState('spiderman');
    setAppearanceState('system');
  };

  return (
    <AppContext.Provider
      value={{
        themeId,
        theme,
        setThemeId,
        appearance,
        setAppearance,
        isDarkMode,
        currentScreen,
        setCurrentScreen,
        isDrawerOpen,
        setIsDrawerOpen,
        user,
        isAuthenticated,
        login,
        register,
        logout,
        guestLogin,
        updateUserBio,
        updateUserAvatar,
        selectedDate,
        setSelectedDate,
        habits,
        addHabit,
        updateHabit,
        toggleHabitPaused,
        deleteHabit,
        addPhotoProof,
        deletePhotoProof,
        photoModalHabitId,
        openPhotoCapture,
        closePhotoCapture,
        viewingProof,
        setViewingProof,
        isNewHabitModalOpen,
        setIsNewHabitModalOpen,
        editingHabit,
        openHabitEditor,
        challenges,
        toggleJoinChallenge,
        friends,
        addFriend,
        settings,
        updateSettings,
        resetAllData,
        triggerCelebration
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
