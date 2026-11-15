import { Habit, UserProfile, Friend, HabitChallenge, AppSettings } from '../types';
import { DEFAULT_AVATAR } from './avatars';

// Built-in demo proof IDs used in older starter datasets.
// Used to identify and safely clean up legacy seeded proofs from previous browser storage.
export const SEEDED_DEMO_PROOF_IDS = new Set([
  'p-101', 'p-102', 'p-103', 'p-104', 'p-105',
  'p-201', 'p-202', 'p-203',
  'p-301', 'p-302', 'p-303',
  'p-401', 'p-402',
  'p-501'
]);

export const INITIAL_USER: UserProfile = {
  id: 'usr-1',
  name: 'Miyamura',
  email: 'abc@example.com',
  avatar: DEFAULT_AVATAR,
  bio: 'Chasing 1% daily progress with visual proof ✨ Disney & Marvel fan!',
  level: 8,
  streak: 14,
  totalProofs: 0,
  badges: [
    {
      id: 'b-1',
      name: '7-Day Streak Starter',
      description: 'Completed any habit 7 consecutive days with photo proof',
      icon: '🔥',
      earnedDate: '2026-09-24',
      category: 'streak'
    },
    {
      id: 'b-2',
      name: 'Photo Proof Pioneer',
      description: 'Logged over 25 verified habit photo proofs',
      icon: '📸',
      earnedDate: '2026-09-29',
      category: 'photos'
    },
    {
      id: 'b-3',
      name: 'Early Bird',
      description: 'Logged morning workout before 7:30 AM',
      icon: '🌅',
      earnedDate: '2026-10-01',
      category: 'special'
    },
    {
      id: 'b-4',
      name: 'Theme Champion',
      description: 'Stayed consistent across 3 distinct hero themes',
      icon: '🦸‍♀️',
      earnedDate: '2026-10-02',
      category: 'special'
    }
  ]
};

export const INITIAL_HABITS: Habit[] = [
  {
    id: 'h-1',
    title: 'Morning Gym & Strength',
    category: 'Fitness',
    icon: 'dumbbell',
    cadence: 'daily',
    targetDaysPerWeek: 6,
    streak: 14,
    bestStreak: 21,
    color: '#EF4444',
    createdAt: '2026-09-01',
    proofs: []
  },
  {
    id: 'h-2',
    title: 'Hydration: 2.5L Water',
    category: 'Health',
    icon: 'droplets',
    cadence: 'daily',
    targetDaysPerWeek: 7,
    streak: 18,
    bestStreak: 24,
    color: '#0284C7',
    createdAt: '2026-08-20',
    proofs: []
  },
  {
    id: 'h-3',
    title: 'Read 30 Pages',
    category: 'Mindset',
    icon: 'book-open',
    cadence: 'daily',
    targetDaysPerWeek: 7,
    streak: 9,
    bestStreak: 15,
    color: '#8B5CF6',
    createdAt: '2026-09-10',
    proofs: []
  },
  {
    id: 'h-4',
    title: 'Clean Workspace & Deep Work',
    category: 'Productivity',
    icon: 'monitor',
    cadence: 'weekdays',
    targetDaysPerWeek: 5,
    streak: 6,
    bestStreak: 12,
    color: '#10B981',
    createdAt: '2026-09-15',
    proofs: []
  },
  {
    id: 'h-5',
    title: 'Evening Gratitude & Stretch',
    category: 'Mindset',
    icon: 'sparkles',
    cadence: 'daily',
    targetDaysPerWeek: 7,
    streak: 11,
    bestStreak: 11,
    color: '#F59E0B',
    createdAt: '2026-09-18',
    proofs: []
  }
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f-1',
    name: 'Aarav Patel',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    streak: 23,
    monthlyProofs: 42,
    recentProof: {
      habitTitle: '5K Sunset Run',
      photoUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
      timeAgo: '2h ago'
    },
    isOnline: true
  },
  {
    id: 'f-2',
    name: 'Maya Lin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    streak: 19,
    monthlyProofs: 39,
    recentProof: {
      habitTitle: 'French Duolingo & Notes',
      photoUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      timeAgo: '4h ago'
    },
    isOnline: true
  },
  {
    id: 'f-3',
    name: 'Carlos Ruiz',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
    streak: 15,
    monthlyProofs: 31,
    recentProof: {
      habitTitle: 'Healthy Meal Prep',
      photoUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      timeAgo: '6h ago'
    },
    isOnline: false
  },
  {
    id: 'f-4',
    name: 'Emily Watson',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    streak: 12,
    monthlyProofs: 28,
    recentProof: {
      habitTitle: 'Morning Yoga Flow',
      photoUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
      timeAgo: '8h ago'
    },
    isOnline: false
  },
  {
    id: 'f-5',
    name: 'Kenji Sato',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    streak: 8,
    monthlyProofs: 21,
    recentProof: {
      habitTitle: 'Guitar Fingerpicking Drill',
      photoUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
      timeAgo: '1d ago'
    },
    isOnline: true
  }
];

export const INITIAL_CHALLENGES: HabitChallenge[] = [
  {
    id: 'c-1',
    title: '30-Day Morning Grind',
    description: 'Snap your daily morning workout photo before 9:00 AM every day.',
    category: 'Fitness',
    participantsCount: 1420,
    targetDays: 30,
    daysRemaining: 16,
    endsAt: '2026-10-19T23:59:59Z',
    joined: true,
    userProgressDays: 14,
    rewardBadge: '🏅',
    rewardTitle: 'Dawn Warrior Medal',
    badgeEmoji: '⚡'
  },
  {
    id: 'c-2',
    title: 'Hydration Hero Quest',
    description: 'Provide daily visual proof of hitting your 2L+ water goal.',
    category: 'Health',
    participantsCount: 985,
    targetDays: 21,
    daysRemaining: 7,
    endsAt: '2026-10-10T23:59:59Z',
    joined: true,
    userProgressDays: 14,
    rewardBadge: '🌊',
    rewardTitle: 'Hydra Master Trophy',
    badgeEmoji: '🔔'
  },
  {
    id: 'c-3',
    title: 'Book a Month Sprint',
    description: 'Read and snap 1 photo of your book and favorite quote each day.',
    category: 'Mindset',
    participantsCount: 760,
    targetDays: 25,
    daysRemaining: 18,
    endsAt: '2026-10-21T23:59:59Z',
    joined: false,
    userProgressDays: 0,
    rewardBadge: '📚',
    rewardTitle: 'Literary Scholar Plaque',
    badgeEmoji: '✨'
  },
  {
    id: 'c-4',
    title: 'Zero Sugar & Whole Foods',
    description: 'Snap your healthy nutritious home-cooked meals every day.',
    category: 'Health',
    participantsCount: 512,
    targetDays: 14,
    daysRemaining: 9,
    endsAt: '2026-10-12T23:59:59Z',
    joined: false,
    userProgressDays: 0,
    rewardBadge: '🥗',
    rewardTitle: 'Clean Fuel Shield',
    badgeEmoji: '🥑'
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  dailyReminderEnabled: true,
  dailyReminderTime: '08:00',
  soundEffects: true,
  highResPhotos: true,
  publicLeaderboard: true
};
